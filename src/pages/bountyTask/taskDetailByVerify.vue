<template>
	<div class="taskDetailByVerify" >
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
			<van-nav-bar :border="false"  title="接单详情"  left-arrow @click-left="leftBack" ></van-nav-bar>
			<div class="count-down" v-if="detail && detail.status == 1">
				<span style="color:#fff">距离结束：</span>
				<van-count-down :time="detail.time*1000" @finish="countDownFinish()">
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
			<div style="height:20px"></div>

			<div class="header">
				<div class="tag">接单人</div>
				<div class="img">
					<img :src="detail.photo" />
				</div>
				<div class="name-con">
					<p class="name">{{detail.user_name}}</p>
					<!-- <p class="desc">{{orderDetail.guan_all}}人关注</p> -->
				</div>
				<!-- <div class="follow-btn">
					<template v-if="isFollow">
						<div class="btn follow" @click="toFollow(isFollow)">
							已关注
						</div>
					</template>
					<template v-else>
						<div class="btn" @click="toFollow(isFollow)">
							<van-icon name="like-o" />
							关注
						</div>
					</template>
				</div> -->
			</div>
			<van-cell-group class="task-group" >
				<div class="task-id">任务ID: {{orderDetail.reward_id}}</div>
				<div class="task-tit-con">
					<div class="tit">{{orderDetail.title}}</div>
					<div class="price">+{{orderDetail.price}}元</div>
				</div>
				<div class="task-params-con van-hairline--top">
					<div class="task-item-con">
						<div class="param">{{orderDetail.stock}}</div>
						<div class="desc">剩余数量</div>
					</div>
					<div class="task-item-con">
						<div class="param">{{orderDetail.num - orderDetail.stock}}</div>
						<div class="desc">人已赚到</div>
					</div>
					<div class="task-item-con">
						<div class="param">{{orderDetail.time_limit_name}}</div>
						<div class="desc">做单时间</div>
					</div>
					<div class="task-item-con">
						<div class="param">{{orderDetail.verify_time_name}}</div>
						<div class="desc">审核时间</div>
					</div>
				</div>
			</van-cell-group>
			<van-cell-group class="task-group"  style="margin-top:15px">
				<div class="task-tit-con">
					<div class="tit">任务说明</div>
					<!-- <div class="price">+8元</div> -->
				</div>
				<div class="task-params-con van-hairline--top" style="color:#999">
					{{orderDetail.note}}
				</div>
			</van-cell-group>
			<van-tabs v-model="active" style="margin-top:15px">
				<van-tab title="做单步骤" name="1"></van-tab>
				<!-- <van-tab title="任务评价" name="2"></van-tab> -->
			</van-tabs>
			<div class="tab-con">
				<template v-if="active == 1">
					<div class="step-con">
						<div class="step-item" v-for="(item, index) in stepList" :key="index">
							<div class="step-item-tit">【步骤{{item.step}}】{{item.step_title}}</div>
							<div class="step-item-box">
								<div class="step-item-con">
									<div class="step-item-desc"><span style="color:#333" v-if="item.type == 2">链接/口令: </span>{{item.content}}</div>
									<div class="link-btn-con" v-if="item.type == 2">
										<van-button ref="copy"  v-clipboard="item.content" @success.native="copyTextSuccess" @error.native="copyTextError"  round type="info" size="small" >复制链接</van-button>
									</div>
									<div class="step-img-con clearfix"  v-if="item.type == 1">
										<img v-for="(subItem, subIndex) in item.pic" :key="subIndex" :src="subItem" alt="">
									</div>
								</div>
								<!-- <div class="item-btn-con van-hairline--top">
									<div style="flex:1"></div>
									<div class="btn" @click="editItem(item,index)">编辑</div>
									<div class="btn del" @click="delItem(index)">删除</div>
								</div> -->
							</div>
						</div>
					</div>
				</template>
				<template v-if="active == 2">
					<div class="evaluate-con">
						任务评价
					</div>
				</template>
			</div>
			<div style="height:50px"></div>
			<div class="footer-btn-con">
				<van-button block type="info" @click="submit" >{{detail.status == 1 ? '用户待提交' : (detail.status == 2 ? '用户已提交,点击审核' : (detail.status == 3 ? '已完成,点击查看提交详情' : (detail.status == 5 ? '用户已取消' : '不合格,点击查看提交详情'))) }}</van-button>
			</div>
		</van-pull-refresh>

		 <!-- 添加步骤弹窗 -->
        <van-popup class="add-popup" v-model="isShowVerifyPopup" round position="bottom" style="min-height:40%;max-height: 80%">
            <div class="add-popup-tit">{{detail && detail.status != 2 ? '提交详情' : '确认审核'}}</div>
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
                        <van-radio-group v-model="radio" direction="horizontal" :disabled="detail && detail.status != 2">
                            <van-radio name="1">同意</van-radio>
                            <van-radio name="2">拒绝</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field v-if="radio == 2" :readonly="detail && detail.status != 2" v-model="content" label="拒绝原因" rows="3" autosize type="textarea" placeholder="请输入您的拒绝原因" />
            </div>
            <div class="btn-con" v-if="detail && detail.status == 2">
                <van-button round block type="info" @click="confirmVerify">提交</van-button>
            </div>
		</van-popup>

		<div class="fixed-full-con" @click.stop v-if="isDetailLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">加载中...</span>
            </div>
        </div>
	</div>
</template>
<script>
   	import { ImagePreview } from 'vant';
	import VueClipboards from 'vue-clipboards'
    import Vue from 'vue'
	Vue.use(VueClipboards)
	export default {
		name: "taskDetailByVerify",
		data() {
			return {
				id: '',
                orderDetail: '',
                userName: '',
				imgPhote: '',
				active: '',
				stepList: [],
				isFollow: false,
			
				type: '',
                typeName: '',
				typeOption: [],
				isShowTypePopup: false,

				detail: '',

				selectRow: {},

                isShowVerifyPopup: false,
                // typeName: '1233',
                content: '',
				radio: '1',
				
				isLoading: false,
				isDetailLoading: true,
			};
		},
		mounted() {
			window.leftBack = this.leftBack
			// this.stepList = localStorage.getItem('stepList') ? JSON.parse(localStorage.getItem('stepList')) : []
			this.id = this.$route.query.id ? this.$route.query.id : ''
			this.getTaskDetail()
			this.detail = JSON.parse(this.$route.query.detail)
		},
		methods: {
			leftBack() {
				let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
				if (lastPath) {
					if (lastPath == '/verifyTaskList') {
						this.$router.push({
							path: '/verifyTaskList',
							query: {
								status: this.$route.query.status
							}
						})
					} else {
						this.$router.go(-1)
					}
				} else {
					this.$router.go(-1)
				}
			},
			// 详情刷新
			onRefresh() {
                this.getTaskDetail()
			},
			// 获取任务详情
			getTaskDetail () {
				this.$api.reward_detail_make_user({
					reward_id: this.id
				}).then(res => {
					this.isLoading = false
					this.isDetailLoading = false
					if (res.errno == 0) {
						this.orderDetail = res.data
						this.stepList = res.data.step_data
						if (this.stepList && this.stepList.length > 0) {
							this.stepList.forEach(item =>{
								if (item.pic) {
									item.pic = item.pic.split(',')
								}
							})
						}
						this.userName = res.data.user_name
						// if (res.data.photo) {
							this.imgPhote = res.data.photo ? res.data.photo : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png'
						// } else {
						// 	this.imgPhote = require("../../images/header.png")
						// }
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.isDetailLoading = false
					this.isLoading = false
					this.$toast('服务异常,请稍后重试')
				})
			},
			// 复制链接
            copyTextSuccess(e) {
                console.log(e)
				this.$toast('复制成功!')
			},
			copyTextError(e) {
				this.$toast('复制失败!')
			},
			// 任务倒计时结束
			countDownFinish () {
				this.detail.status = 4
			},
			// 查看提交案例
            imgPreView () {
                let that = this
                ImagePreview({
                    images: that.selectRow.pic,
                    closeable: true
                });
            },
			 // 去审核
            submit () {
				if (this.detail) {
					if (this.detail.status == 1) {
						this.$toast('用户待提交审核')
						return
					}
					if (this.detail.status == 2) {
						this.$api.makeDetail({
							reward_make_id: this.detail.reward_make_id
						}).then(res => {
							if (res.errno == 0) {
								if (res.data.make_pic) {
									this.selectRow = {
										title: this.orderDetail.title,
										user_name: this.detail.user_name,
										pic: res.data.make_pic ? res.data.make_pic.split(',') : '',
										desc: res.data.make_content,
										price: this.orderDetail.price,
										add_time: res.data.add_time
									}
									this.isShowVerifyPopup = true
								} else {
									this.$toast('用户未提交审核,不合格原因为: '+ this.detail.note)
								}
							} else {
								this.$toast(res.errmsg)	
							}
						}).catch(err=>{
							this.$toast('服务异常,请稍后重试')
						})
						return
					}
					if (this.detail.status == 5) {
						this.$toast('用户已取消该任务')
					} else {
						this.$api.makeDetail({
							reward_make_id: this.detail.reward_make_id
						}).then(res => {
							if (res.errno == 0) {
								if (res.data.make_pic) {
									this.selectRow = {
										title: this.orderDetail.title,
										user_name: this.detail.user_name,
										pic: res.data.make_pic ? res.data.make_pic.split(',') : '',
										desc: res.data.make_content,
										price: this.orderDetail.price,
										add_time: this.detail.add_time
									}
									this.radio = (this.detail.status == 3 ? '1' : this.detail.status == 4 ? '2' : '')
									this.content = this.detail.note
									this.isShowVerifyPopup = true
								} else {
									this.$toast('用户未提交审核,不合格原因为: '+ this.detail.note)
								}
							} else {
								this.$toast(res.errmsg)	
							}
						}).catch(err=>{
							console.log(err)
							this.$toast('服务异常,请稍后重试')
						})
						return
					}
				} else {
					this.$toast('参数错误')
				}  
            },
			// 确认审核
            confirmVerify () {
                this.$api.verify({
                    reward_make_id: this.detail.reward_make_id,
                    status: this.radio == 1 ? '3' : '4',
                    note: this.content
                }).then(res => {
					if (res.errno == 0) {
                        this.$toast(this.radio == 1 ? '同意了审核' : '拒绝了审核')
						this.isShowVerifyPopup = false
						this.$router.push({
							path: '/verifyTaskList',
							query: {
								status: 2
							}
						})
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					console.log(err)
					this.$toast('服务异常,请稍后重试')
				})
                this.isShowVerifyPopup = false
            },
		},
	}
</script>
<style lang="less">
	.taskDetailByVerify {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../../images/bgHeader5.png) no-repeat;
		background-size: 100% 120px;
		background-color: #f0f6fc;	
		overflow-y: auto;
		.van-nav-bar {
			// background: url(../../images/bgHeader5.png) no-repeat top center;
			// background-size: 100% 227px;
			background: transparent;

			.van-icon {
				color: #222222;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}
		.count-down {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10px;
			background: #000;
			.colon {
				display: inline-block;
				color: #fff;
				font-size: 0.32rem;
			}
			.block {
				display: inline-block;
				width: 22px;
				color: #fff;
				font-size: 12px;
				text-align: center;
				background-color: #2f3430;
				border-radius: 4px;
			}
		}

		.header {
			margin: 0 10px;
            text-align: center;
            display: flex;
			align-items: center;
			position: relative;
			.tag {
				position: absolute;
				top:0;
				left: 50%;
				transform: translate(-50%,-50%);
				background: #f0f6fc;
				font-size: 0.35rem;
				padding: 8px 16px;
				border-radius: 1000px;
				font-weight: bold;
				z-index: 999;
			}
			.img {
				width: 42px;
				height: 42px;
				position: relative;
				background: #f7f8fa;
				border-radius: 50%;
				padding: 4px;
				box-shadow: 3px 3px 6px #ccc;
				box-sizing: border-box;
				margin-right: 10px;
				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}
			.name-con {
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				flex: 1;
				.name {
					font-size: 0.38rem;
					font-weight: bold;
				}
				.desc {
					font-size: 0.3rem;
					margin-top: 6px;
				}
			}
			.follow-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				.btn {
					background: #f56c6c;
					color: #fff;
					border-radius: 1000px;
					padding: 6px 12px;
					border: 1px solid #f56c6c;
				}
				.follow {
					border: 1px solid #fff;
					background: #f78e8e;
				}
			}
		}
		.task-group { 
            margin: 0 10px;
            border-radius: 8px;
            box-shadow: 0px 2px 9px 0px rgba(153,153,153,0.15);
			padding:5px 10px;
			margin-top: 20px;
			position: relative;
			.task-id {
				position: absolute;
				top:0;
				left: 50%;
				transform: translate(-50%,-50%);
				background: #f0f6fc;
				font-size: 0.35rem;
				padding: 8px 16px;
				border-radius: 1000px;
				font-weight: bold;
				z-index: 999;
			}
            .task-tit-con {
                display: flex;
                align-items: center;
                justify-content: space-between;
				padding: 15px 0;
                .tit {
                    font-weight: bold;
                    font-size: 0.36rem;
                }
                .price {
                    color: #ff9917;
                    font-weight: bold;
                    font-size: 0.36rem;
                }
            }
            .task-params-con {
                display: flex;
				align-items: center;
				padding: 15px 0;
                .task-item-con {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    font-size: 0.35rem;
                    .param {
						margin-bottom: 10px;
						font-weight: bold;
                    }
                }
            }
		}
		.van-tabs__wrap {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
		}
		.tab-con {
			background: #fff;
			padding: 10px;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			.step-con {
				.step-item {
                    display: flex;
                    flex-direction: column;
                    border-radius: 6px;
                    background: #fff;
                    padding: 10px;
                    box-shadow: 3px 3px 6px #ccc;
                    margin-bottom: 10px;
                    .step-item-tit {
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .step-item-box {
                        display: flex;
                        flex-direction: column;
                        .link-btn-con {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .step-item-con {
                            width: 100%;
                            .step-item-desc {
                                color: #666;
                                padding-left: 5px;
                            }
                            .step-img-con {
                                margin-top: 6px;
                                img {
                                    width: 100%;
                                    float: left;
                                }
                            }
                        }
                        .item-btn-con {
                            margin-top: 10px;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 8px 0;
                            .btn {
                                padding: 8px 14px;
                                background: #fff;
                                color: #1989fa;
                                border-radius: 1000px;
                                margin-left: 10px; 
                                border: 1px solid #1989fa;
                            }
                            .del {
                                background: #f56c6c;
                                color: #fff;
                                border-color: #f56c6c;
                            }
                        }
                    }
                }
			}
		}
		.footer-btn-con {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #fff;
		}
		 .type-popup-con {
            display: flex;
            align-items: center;
            flex-direction: column;
            .type-popup {
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                .type-popup-tit {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    z-index: 999;
                    background: #fff;
                    padding: 18px 0;
                    .tit {
                        flex: 1;
                        font-weight: bold;
                        text-align: center;
                        font-size: 14px;    
                    }
                    .close-con {
                        width: 50px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                .van-radio-group {
                    width: 100%;
                    height: calc(100% - 44px);
                    overflow: hidden;
                    overflow-y: auto;
                }
            }
            
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
		.fixed-full-con {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:  rgba(0, 0, 0, 0.3);
			z-index: 9999;
            .cu-load::before {
                font-family: "cuIcon";
                display: inline-block;
                margin-right: 6px;
            }
            .load-modal {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4rem;
                height: 4rem;
                transform: translate(-50%,-50%);
                background-color: #ffffff;
                border-radius: 10px;
                // box-shadow: 0 0 0px 2000px rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                font-size: 28px;
                z-index: 9999;
                text-align: center;
                .logo {
                    width: 1.2rem;
                }
                .text {
                    font-size: 0.4rem;
                    margin-top: 10px;
                }
            }
            .load-modal::after {
                content: "";
                position: absolute;
                background-color: #ffffff;
                border-radius: 50%;
                width: 75%;
                height: 75%;
                font-size: 14px;
                border-top: 5px solid rgba(0, 0, 0, 0.05);
                border-right: 5px solid rgba(0, 0, 0, 0.05);
                border-bottom: 5px solid rgba(0, 0, 0, 0.05);
                border-left: 5px solid #f37b1d;
                animation: cuIcon-spin 1s infinite linear;
                z-index: -1;
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
	}
</style>
