<template>
	<div class="manageTask">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="发布管理" left-arrow  @click-left="leftBack"/>
        <van-tabs v-model="status" @change="handleTabClick" background="transparent" color="#3B6AF1" line-width="35px" line-height="2px" title-active-color="#3B6AF1">
            <van-tab title="全部" name=""></van-tab>
            <van-tab title="待付款" name="4"></van-tab>
            <van-tab title="审核中" name="0"></van-tab>
            <van-tab title="审核通过" name="1"></van-tab>
            <van-tab title="审核失败" name="5"></van-tab>
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
                                <div class="task-card" @click="detail(item)">
                                    <div style="padding: 0 10px;" >
                                        <div class="top-name van-hairline--bottom" >
                                            <span class="time">{{ item.add_time }}</span>
                                            <span  class="status-name" :class="{'waitpay': item.status == 4, 'shenhe': item.status == 0, 'success': (item.status == 1 || item.status == 2), 'err': item.status == 5, 'del': item.status == 3}" >{{ item.status_name }}</span>
                                        </div>
                                        <div class="task-item-con">
                                            <div class="header-con">
                                                <img :src="item.icon ? item.icon : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png'" alt="">
                                            </div>
                                            <div class="task-inner">
                                                <div class="task-item">
                                                    <!-- <div class="label">任务名称：</div> -->
                                                    <div class="val">{{item.title}}</div>
                                                </div>
                                                <div class="task-item" style="padding: 0">
                                                    <div class="val" style="display:flex">
                                                        <div class="tag">{{item.type_name}}</div>
                                                        <template v-if="item.name">
                                                            <div class="tag name" >{{item.name}}</div>
                                                        </template>
                                                        <template v-if="item.status == 1">
                                                            <div class="tag sale" :class="{'isShow': item.is_show == 1}">{{item.is_show == 1 ? '上架中' : '已下架'}}</div>
                                                        </template>
                                                    </div>
                                                </div>
                                                <div class="task-item" style="padding: 0;padding-top:6px">
                                                    <div class="val num-con" >
                                                        <span>押金: <span class="masker" style="color:red">{{item.advance}}</span></span>
                                                        <span>剩余押金: <span class="masker" style="color:red">{{(item.stock * (item.price * 1000))/1000}}</span></span>
                                                    </div>
                                                </div>
                                                <div class="task-item" style="padding: 0;padding-top:6px">
                                                    <div class="val num-con">
                                                        <span>总量: <span class="masker">{{item.num}}</span></span>
                                                        <span>已完成: <span class="masker">{{(item.num - item.stock)}}</span></span>
                                                    </div>
                                                </div>
                                                <div class="task-item" v-if="item.status == 5">
                                                    <div class="label">拒绝原因：</div>
                                                    <div class="val price">{{item.remarks}}</div>
                                                </div>
                                            </div>
                                            <!-- <div class="price-con">
                                                <span class="price">+{{item.price}}</span>
                                            </div> -->
                                        </div>
                                        <div class="btn-con">
                                            <div style="flex:1"></div>
                                            <div class="btn">
                                                <template v-if="item.status == 1">
                                                    <van-button round size="small" :type="item.is_show  ? 'warning' : 'primary'" @click.stop="toSale(item)">去{{item.is_show ? '下' : '上'}}架</van-button>
                                                    <van-button plain round size="small" type="info" @click.stop="endTask(item)">结束任务</van-button>
                                                </template>
                                                <template v-if="item.status == 4">
                                                    <van-button round size="small" type="info" @click.stop="toPay(item)">去付款</van-button>
                                                </template>
                                                <template v-if="item.status == 5">
                                                    <!-- <van-button plain round size="small" type="info" @click.stop="editTask(item)">编辑</van-button> -->
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
            <template  v-if="!loading && (!data || data.length === 0)">
                <van-empty class="custom-image" :image="isErr ? 'network' : 'https://img01.yzcdn.cn/vant/custom-empty-image.png'" :description="isErr ? '服务异常,请稍后重试' : ('暂无'+ (statusTit && statusTit != '全部' ? '【'+statusTit+'】的任务' : '已领取的任务'))">
                    <template v-if="isErr">
                        <van-button round type="danger" class="bottom-button" @click="getData">重新加载</van-button>
                    </template>
                    <template v-else>
                        <van-button round type="info" class="bottom-button" @click="toRouter('/addTask')">发布任务</van-button>
                    </template>
                </van-empty>
            </template>
        </div>
	</div>
</template>
<script>
	export default {
		name: "manageTask",
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

                isLoading: false,
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.status = this.$route.query.status
            if (this.status == 1) {
                this.statusTit = '审核通过'
            } else if (this.status == 4) {
                this.statusTit = '待付款'
            } else if (this.status == 0) {
                this.statusTit = '审核中'
            } else if (this.status == 5) {
                this.statusTit = '审核失败'
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
				this.$api.releaseLists(params).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						// res.data.data = [{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 1,
                        //     status_name: '审核通过',
                        //     title: '测试审核通过的任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '张三',
                        //     typeName: '邀请专区'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 2,
                        //     status_name: '审核中',
                        //     title: '测试审核中任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '李四',
                        //     typeName: '邀请专区'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 3,
                        //     status_name: '审核失败    ',
                        //     title: '测试审核失败任务1',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     errNote: '拒绝原因111111',
                        //     name: '张三',
                        //     typeName: '邀请专区'
                        // },{
                        //     add_time: '2021-06-07 12:15:30',
                        //     status: 1,
                        //     status_name: '审核通过',
                        //     title: '测试审核通过任务2',
                        //     price: '8',
                        //     date: '',
                        //     time: 30 * 60 * 60 * 1000,
                        //     name: '张三',
                        //     typeName: '邀请专区'
                        // }]
                        // res.data.totalPage = 1
                        res.data.data.forEach(item => {
                            if (item.status == 0) {
                                item.status_name = '审核中'
                            } else if (item.status == 1) {
                                item.status_name = '审核通过'
                            } else if (item.status == 2) {
                                item.status_name = '任务已完结'
                            } else if (item.status == 3) {
                                item.status_name = '已删除'
                            } else if (item.status == 4) {
                                item.status_name = '待付款'
                            } else if (item.status == 5) {
                                item.status_name = '已拒绝'
                            }
                        });
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = [];
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
            detail (item) {
                this.$router.push({
                    path: '/editTask',
                    query: {
                        lastPath: '/manageTask',
                        status: item.status,
                        id: item.reward_id,
                        main_status: this.status
                    }
                })
            },
            // 结束任务
            endTask (item) {
                this.$dialog.confirm({
                    title: '提示',
                    message: '手动结束任务,将退还剩余押金',
                    })
                    .then(() => {
                        this.$api.rewardStatus({
                            reward_id: item.reward_id,
                            status: 2
                        }).then(res => {
                            if (res.errno == 0) {
                                this.$toast('已手动完结任务,任务押金正在退回中...')
                                item.status = 2
                                item.status_name = '任务已完结'
                            } else {
                                this.$toast(res.errmsg)	
                            }
                        }).catch(err=>{
                            this.$toast('服务异常,请稍后重试')
                        })
                    })
                    .catch(() => {
                        // on cancel
                });
            },
            // 上下架
            toSale (item) {
                this.$api.rewardIsShow({
                    reward_id: item.reward_id,
                    is_show: item.is_show ? 0 : 1
                }).then(res => {
					if (res.errno == 0) {
                        item.is_show = item.is_show ? 0 : 1
                        this.$toast(item.is_show ? '上架成功' : '下架成功')
					} else {
						this.$toast(res.errmsg)	
					
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 去付款
            toPay (item) {
                if (!item.advance || item.advance == 0) {
                    this.$toast('订单异常,付款金额必须大于0')
                    return
                }
                if (window.taskPayInterVal) {
                    clearInterval(window.taskPayInterVal)
                    window.taskPayInterVal = null
                }
                setTimeout(() =>{
                    this.$router.push({
                        path: '/taskPay',
                        query: {
                            price: item.advance,
                            id: item.reward_id,
                            lastPath: '/manageTask',
                            status: this.status
                        }
                    })
                })
            },
            // 去编辑
            editTask () {
                this.$router.push('/addTask')
            },
            // 前往发布任务
            toRouter () {
                this.$router.push({
                    path: '/addTask',
                    query: {}
                })
            }
        }
	};
</script>
<style lang="less">
	.manageTask {
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
                        color:#00B578 
                    }
                    .waitpay {
                        color: #1989fa;
                    }
                    .err {
                        color: red;
                    }
                    .success {
                        color:#00B578;
                    }
                    .del {
                        color:#999999; 
                    }
                    .shenhe {
                        color: #ff976a;
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
                                .tag {
                                    padding: 4px 6px;
                                    background: rgb(161, 122, 255);
                                    // background: rgb(219, 204, 255);
                                    // color: rgb(161, 122, 255);
                                    color: #fff;
                                    border-radius: 100px;
                                    font-weight: normal;
                                    font-size: 0.3rem
                                }
                                .name {
                                    margin-left: 10px;
                                    background: #1989fa;
                                    color: #fff;
                                }
                                .sale {
                                    margin-left: 10px;
                                    background: #F56C6C;
                                    color: #fff;
                                }
                                .isShow {
                                    background: #67C23A;
                                    color: #fff;
                                }
                            }
                            .num-con {
                                font-weight: normal;
                                font-size: 0.32rem;
                                color: #999;
                                .masker {
                                    color: #ff9917;
                                }
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
	}
</style>
