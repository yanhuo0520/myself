<template>
	<div class="verifyTaskList">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="审核发布" left-arrow  @click-left="leftBack"/>
        <van-tabs v-model="status" @change="handleTabClick" background="transparent" color="#3B6AF1" line-width="35px" line-height="2px" title-active-color="#3B6AF1">
            <van-tab title="全部" name=""></van-tab>
            <van-tab title="待提交" name="1"></van-tab>
            <van-tab title="待审核" name="2"></van-tab>
            <van-tab title="已完成" name="3"></van-tab>
            <van-tab title="不合格" name="4"></van-tab>
        </van-tabs>
        <div class="task-box">
            <!-- <template > -->
                <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
                    <van-list v-model="loading" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
                        <template #loading>
                            <div class="list-loading-con">
                                <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                                <span>加载中...</span>
                            </div>
                        </template>
                        <template >
                            <div class="task-group" v-for="(item,index) in data" :key="index" >
                                <div class="task-card">
                                    <div style="padding: 0 10px;box-shadow:3px 3px 6px #ccc;border-radius:8px"   @click="toTaskDetail(item)">
                                        <div class="top-name van-hairline--bottom" >
                                            <span class="time">{{ item.add_time }}</span>
                                            <span  class="status-name" :class="{'err': item.status == 4, 'waitsubmit' : item.status == 1, 'cancel': item.status == 5, 'success': item.status == 3, 'waitShenhe': item.status == 2}" >{{ item.status_name }}</span>
                                        </div>
                                        <div class="task-item-con">
                                            <div class="header-con">
                                                <img :src="item.icon ? item.icon : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png'" alt="">
                                            </div>
                                            <div class="task-inner">
                                                <div class="task-item">
                                                    <div class="label">任务名称：</div>
                                                    <div class="val">{{item.title}}</div>
                                                </div>
                                                <div class="task-item">
                                                    <div class="label">领取ID：</div>
                                                    <div class="val" style="color:red">{{item.reward_make_id}}</div>
                                                </div>
                                                <div class="task-item">
                                                    <div class="label">申请人：</div>
                                                    <div class="val">{{item.user_name}}</div>
                                                </div>
                                                <div class="task-item" v-if="item.status == 3 || item.status == 4 || item.status == 5">
                                                    <div class="label">操作时间：</div>
                                                    <div class="val">{{item.verify_time}}</div>
                                                </div>
                                                <div class="task-item" v-if="item.status == 4">
                                                    <div class="label">不合格原因：</div>
                                                    <div class="val price">{{item.note}}</div>
                                                </div>
                                                <div class="task-item" v-if="item.status == 1">
                                                    <div class="label">任务倒计时：</div>
                                                    <div class="val">
                                                        <van-count-down :time="item.time * 1000">
                                                            <template #default="timeData">
                                                                <span class="block">{{ timeData.days }}</span>
                                                                <span class="colon">天</span>
                                                                <span class="block">{{ timeData.hours }}</span>
                                                                <span class="colon">时</span>
                                                                <span class="block">{{ timeData.minutes }}</span>
                                                                <span class="colon">分</span>
                                                                <span class="block">{{ timeData.seconds }}</span>
                                                                <span class="colon">秒</span>
                                                            </template>
                                                        </van-count-down>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="price-con">
                                                <span class="price">+{{item.price}}</span>
                                            </div>
                                        </div>
                                        <div class="btn-con">
                                            <div style="flex:1"></div>
                                            <div class="btn">
                                                <!-- <van-button plain round size="small"  type="primary" @click.stop="toTaskDetail(item)">任务详情</van-button> -->
                                                <template v-if="item.status == 2">
                                                    <van-button plain round size="small" type="info" @click.stop="submit(item,index)" :loading="item.loading" loading-text="加载中...">去审核</van-button>
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>  
                        </template>
                    </van-list>
                </van-pull-refresh>
            <!-- </template> -->
            <template v-if="!loading && (!data || data.length === 0)">
                <van-empty class="custom-image" :image="isErr ? 'network' : 'https://img01.yzcdn.cn/vant/custom-empty-image.png'" :description="isErr ? '服务异常,请稍后重试' : ('暂无'+ (statusTit && statusTit != '全部' ? '【'+statusTit+'】的任务' : '可审核的任务'))">
                    <template v-if="isErr">
                        <van-button round type="danger" class="bottom-button" @click="getData">重新加载</van-button>
                    </template>
                    <template v-else>
                        <van-button round type="info" class="bottom-button" @click="toTaskHall">前往任务大厅</van-button>
                    </template>
                </van-empty>
            </template>
        </div>

        <!-- 审核弹窗 -->
        <van-popup class="add-popup" v-model="isShowVerifyPopup" round position="bottom" style="min-height:40%;max-height: 80%">
            <div class="add-popup-tit">确认审核</div>
            <div class="add-popup-con">
                <van-field v-model="selectRow.title" label="任务标题"  disabled  />
                <van-field v-model="selectRow.user_name" label="任务人"  disabled  />
                <van-field  label="任务截图"  readonly @click="imgPreView()">
                    <template #input>
                        <span style="color:#1989fa">点击查看任务截图</span>
                    </template>
                </van-field>
                <van-field  label="任务描述"  readonly >
                    <template #input>
                        <span style="color:#ff9917">{{selectRow.desc}}</span>
                    </template>
                </van-field>
                <van-field v-model="selectRow.price" label="任务金额"  disabled  />
                <van-field v-model="selectRow.add_time" label="提交时间"  disabled  />
                <van-field  label="审核状态"  readonly >
                    <template #input>
                        <van-radio-group v-model="radio" direction="horizontal">
                            <van-radio name="1">同意</van-radio>
                            <van-radio name="2">拒绝</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="radio == 2" v-model="content" label="拒绝原因" rows="3" autosize type="textarea" placeholder="请输入您的拒绝原因" />
            </div>
            <div class="btn-con">
                <van-button round block type="info" @click="confirmVerify">提交</van-button>
            </div>
		</van-popup>
	</div>
</template>
<script>
    import { ImagePreview } from 'vant';
	export default {
		name: "verifyTaskList",
		data() {
			return {
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],
                status: '',
                statusTit: '',

                selectRow: {},
                curRow: '',
                curIndex: '',

                isShowVerifyPopup: false,
                // typeName: '1233',
                content: '',
                radio: '1',

                isLoading: false,

			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.status = this.$route.query.status
            if (this.status == 1) {
                this.statusTit = '待提交'
            } else if (this.status == 2) {
                this.statusTit = '待审核'
            } else if (this.status == 3) {
                this.statusTit = '已完成'
            } else if (this.status == 4) {
                this.statusTit = '不合格'
            } else {
                this.statusTit = ''
            }
            this.getData()
		},
		methods: {
            leftBack() {
				this.$router.push('/taskCenter');
            },
            onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
            },
            // 切换任务完成状态
            handleTabClick(name, title) {
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = [];
                this.status = name;
                this.statusTit = title
                this.getData()
            },
            getData () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                }
                if (this.status != '') {
                    params.status = this.status
                }
				this.$api.makeLists(params).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						// res.data.data = [{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 1,
                        //     status_name: '待审核',
                        //     title: '测试待审核任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '张三'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 2,
                        //     status_name: '已取消',
                        //     title: '测试已取消任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '李四'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 3,
                        //     status_name: '已拒绝    ',
                        //     title: '测试已拒绝任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '张三'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 1,
                        //     status_name: '待审核',
                        //     title: '测试待审核任务2',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '张三'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 4,
                        //     status_name: '已同意',
                        //     title: '测试已同意任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '张三'
                        // }]
                        // res.data.totalPage = 1
                        res.data.data.forEach(item => {
                            if (item.status == 1) {
                                item.status_name = '待提交'
                            } else if (item.status == 2){
                                item.status_name = '待审核'
                            } else if (item.status == 3){
                                item.status_name = '已完成'
                            } else if (item.status == 4){
                                item.status_name = '不合格'
                            } else if (item.status == 5){
                                item.status_name = '已取消'
                            }
                        });
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
								this.data = data
							} else {
								this.data = this.data.concat(data)
							}
						}
						this.page = page
						if (this.page >= res.data.total) {
							this.finished = true
						} else {
							this.finished = false
						}
					} else {
						this.$toast(res.errmsg)	
						this.finished = true
                        this.page = 0
                        this.data = []
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
                    this.isLoading = false
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.data = []
					this.isErr = true
				})
            },
            // 前往任务详情
            toTaskDetail (item) {
                let params = {
                    user_name: item.user_name,
                    photo: item.photo,
                    status: item.status,
                    note: item.note,
                    reward_make_id: item.reward_make_id,
                    time: item.time
                }
                this.$router.push({
                    path: '/taskDetailByVerify',
                    query: {
                        lastPath: '/verifyTaskList',
                        id: item.reward_id,
                        detail: JSON.stringify(params),
                        status: this.status
                    }
                })
            },
            // 去审核
            submit (item,index) {
                this.$set(item,'loading', true)
                this.$api.makeDetail({
                    reward_make_id: item.reward_make_id
                }).then(res => {
                    this.$set(item,'loading', false)
					if (res.errno == 0) {
                        this.curRow = item
                        this.curIndex = index
                        this.selectRow = {
                            title: item.title,
                            user_name: item.user_name,
                            pic: res.data.make_pic.split(','),
                            desc: res.data.make_content,
                            price: item.price,
                            add_time: item.add_time
                        }
                        this.isShowVerifyPopup = true
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$set(item,'loading', false)
					this.$toast('服务异常,请稍后重试')
				})
            },
             // 查看提交案例
            imgPreView () {
                let that = this
                ImagePreview({
                    images: that.selectRow.pic,
                    closeable: true
                });
            },
            // 确认审核
            confirmVerify () {
                this.$api.verify({
                    reward_make_id: this.curRow.reward_make_id,
                    status: this.radio == 1 ? '3' : '4',
                    note: this.content
                }).then(res => {
					if (res.errno == 0) {
                        this.$toast(this.radio == 1 ? '同意了审核' : '拒绝了审核')
                        // this.$set(this.curRow,'status',this.radio == 1 ? 3 : 4)
                        // this.curRow.status = (this.radio == 1 ? 3 : 4)
                        this.data[this.curIndex].status = (this.radio == 1 ? 3 : 4)
                        this.isShowVerifyPopup = false
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
                this.isShowVerifyPopup = false
            },
            // 评价
            toEvaluate () {
                this.$toast('点击了评价')
            },
            // 再来一单
            addTask () {
                this.$toast('再来一单')
            },
            // 前往任务大厅
            toTaskHall () {
                this.$router.push({
                    path: '/taskHall',
                    query: {}
                })
            }
        }
	};
</script>
<style lang="less">
	.verifyTaskList {
		background: #f0f6fc;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        
        .van-nav-bar {
            background: transparent;
			.van-icon {
				color: #222222;
			}
			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}
		.header {
            position: fixed;
            top: 0;
            left: 0;
			background: url(../../images/bgHeader1.png) no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 115px;
        }
        .task-box {
            position: relative;
            flex: 1;
            overflow-y: auto;
            .list-loading-con {
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 1rem;
                    animation: cuIcon-spin 1s infinite linear;
                }
                @keyframes cuIcon-spin {
                    0% {
                        -webkit-transform: rotate(0);
                        transform: rotate(0);
                    }

                    100% {
                        -webkit-transform: rotate(359deg);
                        transform: rotate(359deg);
                    }
                }
            }
            .van-pull-refresh {
                min-height: 100%;
            }
            .task-card {
                background:rgba(255,255,255,1);  
                width: 94%; margin: 0 auto; 
                margin-top: 10px; 
                border-radius: 8px;
                .top-name { 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    height: 40px; 
                    .time { 
                        color: #888888; 
                        font-size: 0.3rem; 
                    }
                    .status-name { 
                        font-size: 0.35rem; 
                        font-weight: 400; 
                        color:#00B578 
                    }
                    .waitsubmit {
                       color: #1989fa;
                    }
                    .cancel {
                       color: #999999;
                    }
                    .err {
                        color: red;
                    }
                    .waitShenhe {
                       color: #ff976a;
                    }
                    .success {
                        color: #00B578;
                    }
                    img { 
                        height: 30px;
                    }
                }
                .task-item-con {
                    display: flex;
                    align-items: center;
                    .header-con {
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        // background: #f7f8fa;
                        margin-right: 6px;
                        // box-shadow: 3px 3px 6px #ccc;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .price-con {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .price {
                            font-size: 0.5rem;
                            font-weight: bold;
                            color: #ff9917;
                        }
                    }
                    .task-inner {
                        flex: 1;
                        .task-item {
                            display: flex;
                            align-items: center;
                            padding: 8px 0;
                            .label {
                                width: 80px;
                                font-weight: bold;
                                font-size: 0.33rem;
                                white-space: nowrap;
                            }
                            .val {
                                font-weight: bold;
                                color: #333;
                                font-size: 0.36rem;
                            }
                            .price {
                                font-weight: bold;
                                color: red;
                                font-size: 0.35rem;
                            }
                            .colon {
                                display: inline-block;
                                color: #333;
                                font-size: 0.32rem;
                            }
                            .block {
                                display: inline-block;
                                width: 22px;
                                color: #fff;
                                font-size: 12px;
                                text-align: center;
                                background-color: #000;
                                border-radius: 4px;
                            }
                        }
                    }
                }
                .btn-con {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    .btn {
                       display: flex;
                       align-items: center; 
                       .van-button {
                           height: 30px;
                           padding: 0 12px;
                           margin-left: 10px;
                       }
                    }
                }
            }
        }
        .custom-image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            .van-empty__image {
                width: 90px;
                height: 90px;
            }
        }
         .bottom-button {
            width: 160px;
            height: 40px;
        }
        .add-popup {
            .add-popup-tit {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px;
                font-size: 14px;
                font-weight: bold;
            }
            .uploadCont {
				margin: 0 10px;
				.van-uploader__preview-image{
					width: 100px;
					height: 70px;
				}
				.van-uploader__input-wrapper{
					background: #F0F6FC;
					width: 100px;
					height: 70px;
					text-align: center;
					color: #9AA8B6;
					img{
						width: 15px;
						height: 15px;
						margin: 16px 0 5px 0;
					}
				}
            }
            .btn-con {
                margin-top: 15px;
            }
        }
	}
</style>
