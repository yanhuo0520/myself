<template>
	<div class="taskList">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="任务领取记录" left-arrow  @click-left="leftBack"/>
        <van-tabs v-model="status" @change="handleTabClick" background="transparent" color="#3B6AF1" line-width="35px" line-height="2px" title-active-color="#3B6AF1">
            <van-tab title="全部" name=""></van-tab>
            <van-tab title="进行中" name="1"></van-tab>
            <van-tab title="审核中" name="2"></van-tab>
            <van-tab title="审核失败" name="4"></van-tab>
            <van-tab title="已完成" name="3"></van-tab>
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
                                <div style="padding: 0 10px;" @click="toDetail(item)">
                                    <div class="top-name van-hairline--bottom" >
                                        <span class="time">{{ item.add_time }}</span>
                                        <!-- <template v-if="item.status != 4"> -->
                                            <span  class="status-name" :class="{'jinxing':item.status == 1, 'shenhe':item.status == 2, 'err': item.status == 4, 'sucess': item.status == 3, 'cancle': item.status == 5}" >{{ item.status_name }}</span>
                                        <!-- </template> -->
                                        <!-- <template v-else>
                                            <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/order-finish.png" alt="">
                                        </template> -->
                                    </div>
                                    <div class="task-item-con">
                                        <div class="task-item">
                                            <div class="label">领取ID：</div>
                                            <div class="val">{{item.reward_make_id}}</div>
                                        </div>
                                        <div class="task-item">
                                            <div class="label">任务名称：</div>
                                            <div class="val">{{item.title}}</div>
                                        </div>
                                        <div class="task-item">
                                            <div class="label">任务收益：</div>
                                            <div class="val price">{{item.price}}</div>
                                        </div>
                                        <div class="task-item" v-if="item.status == 2">
                                            <div class="label">提交时间：</div>
                                            <div class="val">{{item.update_time}}</div>
                                        </div>
                                        <div class="task-item" v-if="item.status == 4">
                                            <div class="label">失败原因</div>
                                            <div class="val price">{{item.note}}</div>
                                        </div>
                                        <div class="task-item" v-if="item.status == 1">
                                            <div class="label">任务倒计时：</div>
                                            <div class="val">
                                                <van-count-down :time="item.yu_time*1000" @finish="countDownFinish(item)" >
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
                                    <div class="btn-con">
                                        <div style="flex:1"></div>
                                        <div class="btn">
                                            <van-button v-if="item.publish == 2" plain round size="small"  type="default" @click.stop="toForward(item)">转发</van-button>
                                            <van-button plain round size="small"  type="primary" @click.stop="toTaskDetail(item)">任务详情</van-button>
                                            <template v-if="item.status == 1">
                                                <van-button plain round size="small" type="warning" @click.stop="giveUpTask(item,index)">放弃任务</van-button>
                                                <van-button plain round size="small" type="info" @click.stop="toDetail(item)">提交</van-button>
                                            </template>
                                            <template v-if="item.status == 4">
                                                <!-- <van-button plain round size="small" type="info" @click.stop="toDetail(item)">重新提交</van-button> -->
                                                <van-button plain round size="small" type="info" @click.stop="toTaskDetail(item)">再来一单</van-button>
                                            </template>
                                            <template v-if="item.status == 3">
                                                <van-button plain round size="small" type="default" @click.stop="toEvaluate(item)">评价</van-button>
                                                <van-button plain round size="small" type="info" @click.stop="toTaskDetail(item)">再来一单</van-button>
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
                <van-empty class="custom-image" :image="isErr ? 'network' : 'https://img01.yzcdn.cn/vant/custom-empty-image.png'" :description="isErr ? '服务异常,请稍后重试' : ('暂无'+ (statusTit && statusTit != '全部' ? '【'+statusTit+'】的任务' : '已领取的任务'))">
                    <template v-if="isErr">
                        <van-button round type="danger" class="bottom-button" @click="getData">重新加载</van-button>
                    </template>
                    <template v-else>
                        <van-button round type="info" class="bottom-button" @click="toTaskHall">前往任务大厅</van-button>
                    </template>
                </van-empty>
            </template>
        </div>

        <van-dialog v-model="isEvaluationShow" title="评价" show-cancel-button @confirm="confimMsg()" @cancel="cancelMsg()">
            <van-field v-model="msg" rows="2" autosize type="textarea" maxlength="200" placeholder="请输入您的评价" show-word-limit />
            <div style="padding:15px;font-size:14px">
                <van-checkbox v-model="isIncognito" checked-color="#ee0a24">匿名评价</van-checkbox>
            </div>
        </van-dialog>

        <van-popup class="add-popup" v-model="isShowPopup" round position="bottom" style="min-height:40%;max-height: 80%">
            <div class="add-popup-tit">转发任务</div>
            <div class="add-popup-con">
                <van-field v-model="forwardForm.price" label="悬赏单价" type="number" placeholder="请输入悬赏单价"  @input="bindInput('price')"/>
                <van-field v-model="forwardForm.num" label="悬赏数量" type="digit" placeholder="请输入悬赏数量" @input="bindInput('digit')" />
                <van-field v-model="forwardForm.advance" label="预付赏金" placeholder="0" readonly/>
            </div>
            <div class="btn-con">
                <van-button round block type="info" @click="confrimForward">确认转发</van-button>
            </div>
		</van-popup>
	</div>
</template>
<script>
	export default {
		name: "taskList",
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
                isEvaluationShow: false,
                msg: '',
                isIncognito: true,
                selectRow: '',
                isLoading: false,

                isShowPopup: false,
                forwardForm: {
                    price: '',
                    num: '',
                    advance: 0
                }
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.status = this.$route.query.status
            if (this.status == 1) {
                this.statusTit = '进行中'
            } else if (this.status == 2) {
                this.statusTit = '审核中'
            } else if (this.status == 3) {
                this.statusTit = '审核失败'
            } else if (this.status == 4) {
                this.statusTit = '已完成'
            } else if (this.status == 5) {
                this.statusTit = '已取消'
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
                this.data = [];
                this.loading = true
                this.finished = false
                this.status = name;
                this.statusTit = title
                this.getData()
            },
            // 任务倒计时结束
			countDownFinish (item) {
                item.status = 4
                item.status_name = '不合格'
                item.note = '任务超时系统自动取消'
            },
            getData () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
				this.$api.userRewardLists({
					page: page,
                    size: this.size,
                    status: this.status
				}).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						// res.data.data = [{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 1,
                        //     status_name: '进行中',
                        //     title: '测试进行中任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 2,
                        //     status_name: '审核中',
                        //     title: '测试审核中任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 3,
                        //     status_name: '审核失败',
                        //     title: '测试审核失败任务1',
                        //     price: '8',
                        //     date: '',
                        //     errNote: '拒绝原因1111111',
                        //     time: 30 * 60 * 60 * 1000,
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 1,
                        //     status_name: '进行中',
                        //     title: '测试进行中任务2',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 4,
                        //     status_name: '已完成',
                        //     title: '测试已完成任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 5,
                        //     status_name: '已取消',
                        //     title: '测试已完成任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        // }]
                        // res.data.totalPage = 1
                        res.data.data.forEach(item =>{
                            if (item.status == 1) {
                                item.status_name = '进行中'
                            } else if (item.status == 2) {
                                item.status_name = '审核中'
                            } else if (item.status == 3) {
                                item.status_name = '已完成'
                            } else if (item.status == 4) {
                                item.status_name = '不合格'
                            } else if (item.status == 5) {
                                item.status_name = '已取消'
                            } 
                        })
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
            // 前往提交详情
            toDetail (item) {
                let params = {
                    title: item.title,
                    status: item.status,
                    status_name: item.status_name,
                    price: item.price,
                    make_pic: item.make_pic,
                    make_content: item.make_content,
                    note: item.note
                }
                let path = item.status == 1 ? '/submitTask' : '/submitTaskDetail'
                this.$router.push({
                    path: path,
                    query: {
                        lastPath: '/taskList',
                        reward_make_id: item.reward_make_id,
                        reward_id: item.reward_id,
                        detail: JSON.stringify(params),
                        status: this.status
                    }
                })
            },
            // 前往任务详情
            toTaskDetail (item) {
                this.$router.push({
                    path: '/taskDetail',
                    query: {
                        id: item.reward_id,
                        lastPath: '/taskList',
                        status: this.status
                    }
                })
            },
            // 悬赏单价与数量改变
            bindInput (type) {
                if (type == 'price') {
                    this.forwardForm.price = this.handlePrice(this.forwardForm.price)
                } else if (type == 'digit') {
                    if (!this.forwardForm.num || this.forwardForm.num == 0) {
                        this.forwardForm.num = ''
                        this.$toast('悬赏数量必须大于0')
                        return 
                    }
                }
                this.forwardForm.advance = (Number(this.forwardForm.price)*1000 * Number(this.forwardForm.num))/1000
            },
            /**
            * 处理金额保留几位小数
            * @param val 要处理的金额
            */
            handlePrice(val) {
                var regStrs = [
                    ['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
                    ['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
                    ['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
                    ['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
                ];
                for(var i=0; i<regStrs.length; i++){
                    var reg = new RegExp(regStrs[i][0]);
                    val = val.replace(reg, regStrs[i][1]);
                }
                return val
            },
            // 转发任务
            toForward (item) {
                this.isShowPopup = true
                this.selectRow = item
                this.forwardForm = {
                    price: '',
                    num: '',
                    advance: 0
                }
            },
            confrimForward () {
                if (!this.forwardForm.price || this.forwardForm.price == 0) {
                    this.$toast('悬赏单价必须大于0')
                    return
                }
                if (!this.forwardForm.num || this.forwardForm.num == 0) {
                    this.$toast('悬赏数量必须大于0')
                    return
                }
                this.$api.rewardForward({
                    reward_id: this.selectRow.reward_id,
                    price: this.forwardForm.price,
                    num: this.forwardForm.num
				}).then(res => {
					if (res.errno == 0) {
                        if (window.taskPayInterVal) {
                            clearInterval(window.taskPayInterVal)
                            window.taskPayInterVal = null
                        }
                        setTimeout(() =>{
                            this.$router.push({
                                path: '/taskPay',
                                query: {
                                    price: this.forwardForm.advance,
                                    id: res.reward_id
                                }
                            })
                        })
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 放弃任务
            giveUpTask (item,index) {
                this.$dialog.confirm({
                    title: '提示',
                    message: '确定放弃该任务吗?',
                    })
                    .then(() => {
                        this.gibeUpApi(item,index)
                        // on confirm
                    })
                    .catch(() => {
                        // on cancel
                });
            },
            gibeUpApi (item,index) {
                this.$api.userRewardDel({
					reward_make_id: item.reward_make_id
				}).then(res => {
					if (res.errno == 0) {
                        this.$toast('任务已放弃')
                        this.data[index].status = 5
                        this.data[index].status_name = '已取消'
                        // this.data.splice(index,1)
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 提交任务
            submit () {
                this.$router.push({
                    path: '/submitTask',
                    query: {
                        lastPath: '/taskList'
                    }
                })
            },
            // 显示评价弹窗
            toEvaluate (item) {
                this.msg = ''
                this.selectRow = item
                this.isEvaluationShow = true
            },
            // 确定评价
            confimMsg () {
                this.$api.commentAdd({
                    reward_id: this.selectRow.reward_id,
                    comment: this.msg,
                    is_n: this.isIncognito ? 1 : ''
				}).then(res => {
					if (res.errno == 0) {
                        this.isEvaluationShow = false
                        this.$toast('评价成功')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 取消评价
            cancelMsg () {
                this.isEvaluationShow = false
                this.msg = ''
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
	.taskList {
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
                box-shadow: 3px 3px 6px #ccc;
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
                        color: #00B578;
                    }
                    .jinxing {
                        color: #1989fa;
                    }
                    .shenhe {
                        color: #ff976a;
                    }
                    .err {
                        color: red;
                    }
                    .cancle {
                        color: #999999;
                    }
                    .sucess {
                        color: #00B578;
                    }
                    img { 
                        height: 30px;
                    }
                }
                .task-item-con {
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
                padding: 10px 0.6rem;
            }
        }
	}
</style>
