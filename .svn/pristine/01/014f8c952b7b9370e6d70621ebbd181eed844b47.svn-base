<template>
	<div class="usercenter" >
		<van-nav-bar :border="false"  title="任务中心"  >
			<template #left>
				<div class="left-nav-con" @click="leftBack()">返回三位一体</div>
			</template>
		</van-nav-bar>
		<div class="header">
			<div  class="img">
				<img :src="imgPhote" />
			</div>
			<div class="name-con">
				<p class="name">{{userName}}</p>
			</div>
		</div>
		<div class="balance-box" >
			<div class="balance-item" @click="toRouter('/billList')">
				<span class="num">{{userReDetail.lei ? userReDetail.lei : 0}}</span>
				<span class="text">累计收益</span>
			</div>
			<span class="shu"></span>
			<div class="balance-item" @click="toRouter('/billList')">
				<span class="num">{{userReDetail.account ? userReDetail.account : 0}}</span>
				<span class="text">可提现金额</span>
			</div>
			<span class="shu"></span>
			<div class="balance-item" @click="toRouter('/depositBillList')">
				<span class="num">{{userReDetail.rewardaccount ? userReDetail.rewardaccount : 0}}</span>
				<span class="text">剩余任务押金</span>
			</div>
			<div class="withdraw-btn-con">
				<van-button  round size="small"  type="info" @click.stop="toWithDraw()">提现</van-button>
			</div>
		</div>
        <van-cell-group class="order-group" >
            <van-cell title="我的领取" value="全部领取的任务" is-link  @click="toTaskList('')"></van-cell>
            <van-grid :border="false">
                <van-grid-item  text="进行中" :badge="userReDetail.jin ? userReDetail.jin : ''"    @click="toTaskList(1)">
                    <template #icon>
                        <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/jinxing.png" alt="">
                    </template>
                </van-grid-item>
                <van-grid-item text="审核中" :badge="userReDetail.shen ? userReDetail.shen : ''"  @click="toTaskList(2)">
                    <template #icon>
                        <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/shenhe.png" alt="">
                    </template>
                </van-grid-item>
                <van-grid-item  text="审核失败" :badge="userReDetail.shi ? userReDetail.shi : ''" @click="toTaskList(4)">
                    <template #icon>
                        <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/err.png" alt="">
                    </template>
                </van-grid-item>
                <van-grid-item  text="已完成" :badge="userReDetail.wan ? userReDetail.wan : ''" @click="toTaskList(3)">
                    <template #icon>
                        <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/jinxing.png" alt="">
                    </template>
                </van-grid-item>
            </van-grid>
        </van-cell-group>

        <div class="release-manage-box">
            <div class="manage-item-box" @click="toRouter('/verifyTaskList')">
                <div class="manage-item-con">
                    <div class="tit">审核发布</div>
                    <div class="desc">审核用户领取的任务</div>
                </div>
                <div class="icon-con">
                    <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/banner-icon1.png" alt="">
                </div>
            </div>
            <div class="manage-item-box" @click="toRouter('/manageTask')">
                <div class="manage-item-con">
                    <div class="tit">发布管理</div>
                    <div class="desc">管理我发布的任务</div>
                </div>
                <div class="icon-con">
                    <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/banner-icon2.png" alt="">
                </div>
            </div>
        </div>
		<van-cell-group class="user-list">
			<van-cell icon="gold-coin"  title="收益明细" is-link @click="toRouter('/billList')"/>
			<van-cell icon="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/yajin.png"  title="押金明细" is-link @click="toRouter('/depositBillList')"/>
			<van-cell icon="like"  title="我的关注/粉丝" is-link @click="toRouter('/followList')"/>
			<van-cell icon="chat"  title="我的评价" is-link @click="toRouter('/myComment')"/>
			<van-cell icon="question"  title="帮助中心" is-link @click="toRouter('/helpList')"/>
		</van-cell-group>
		<!-- <div style="height:30px"></div> -->
        <!-- <van-cell title="帮助中心" is-link >
            <template #icon>
                <img class="img-icon" src="../../images/inIcon.png" />
            </template>
        </van-cell> -->
		<div style="height:1.73rem"></div>
		<taskBottom :idx="2"></taskBottom>
	</div>
</template>
<script>
	import taskBottom from "@/components/taskBottom";
	export default {
		name: "usercenter",
		data() {
			return {
				userName: '',
				imgPhote: '',
				userReDetail: {
					lei: 0,//累计收益
					jin: 0,//进行中的单子数量
					shen: 0,//审核中的单子数量
					wan: 0,//已完成单子数量
					shi: 0,//审核失败单子数量
					account: "0.00"//账户余额
				}
			};
		},
		components: {
			taskBottom,
		},
		mounted() {
			window.leftBack = this.leftBack
			this.getUserReDetail()
		},
		methods: {
			leftBack() {
				this.$router.push('/');
			},
			// 获取累计收益 任务数量等
			getUserReDetail () {
				this.$api.userReDetail().then(res => {
					if (res.errno == 0) {
						if (res.data) {
							this.userReDetail = {
								lei: res.data.lei,//累计收益
								jin: res.data.jin,//进行中的单子数量
								shen: res.data.shen,//审核中的单子数量
								wan: res.data.wan,//已完成单子数量
								shi: res.data.shi,//审核失败单子数量
								account: res.data.account//账户余额
							}
							this.imgPhote = res.data.photo
							this.userName = res.data.name
						}
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {

				})
			},
			toWithDraw () {
				this.$router.push({
					path: '/withDraw',
					query: {
						price: this.userReDetail.account
					}
				})
			},
			// 跳转路由
			toRouter (path) {
				this.$router.push(path)
			},
			toTaskList (status) {
				this.$router.push({
					path: '/taskList',
					query: {
						status: status
					}
				})
			}
		},


	}
</script>
<style lang="less">
	.usercenter {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../../images/bgHeader5.png) no-repeat;
		background-size: 100% 227px;
		background-color: #f0f6fc;	
		overflow-y: auto;
		div {
			box-sizing: border-box;
		}
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
			.left-nav-con {
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				background: #1989fa;
				color: #fff;
				font-size: 0.34rem;
				width: 2.5rem;
				padding: 3px 0;
				border-top-right-radius: 100px;
				border-bottom-right-radius: 100px;
			}
		}
		.header {
			margin: 0 10px;
            text-align: center;
            display: flex;
            align-items: center;
			.img {
				width: 1.2rem;
				height: 1.2rem;
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
		}
		.balance-box {
			display: flex;
			align-items: center;
			background: #fff;
			min-height: 1.2rem;
			margin: 30px 10px 10px 10px;
			border-radius: 6px;
			padding: 6px 10px;
			.balance-item {
				width: 25%;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				.text {
					font-size: 0.3rem;
					color: #666;
					margin-top:3px
				}
				.num {
					font-size: 0.35rem;
					font-weight: bold;
					color:#333;
				}
			}
			.shu {
				width: 2px;
				height: 15px;
				background: #f0f6fc;
			}
			.withdraw-btn-con {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: flex-end;
				.van-button {
					height: 30px;
					line-height: 30px;
					padding: 0 20px;
				}
			}
		}
		.order-group { 
            margin: 0 10px;
            border-radius: 8px;
            box-shadow: 0px 2px 9px 0px rgba(153,153,153,0.15);
            overflow: hidden;
            .van-cell__title { 
                font-weight: bold; 
                font-size: 14px; 
            }
            .van-cell__value { 
                font-size: 12px; 
            }
            .van-grid-item  {
                .van-grid-item__icon-wrapper {
                    img { 
                        height: 40px; 
                        margin-bottom:8px;
                    }
                }
                .van-grid-item__text { 
                    font-size: 13px; color: #333333; 
                }
            }
            
        }
        .release-manage-box {
            display: flex;
            padding: 10px;
            align-items: center;
            justify-content: space-between;
            .manage-item-box {
                width: 47%;
                background: #f1f1f1;
                padding: 15px 10px;
                display: flex;
                align-items: center;
				box-sizing: border-box;
				background-image: linear-gradient(to right, #39b54a 0%, #8dc63f 100%);
				border-radius: 6px;
				box-shadow: 3px 3px 6px #ccc;
                .manage-item-con {
					flex: 1;
					color: #fff;
					.tit {
						font-size: 0.32rem;
						font-weight: bold;
					}
					.desc {
						font-size: 0.32rem;
						padding-top: 8px;
					}
				}
                .icon-con {
                    width: 22px;
                    height: 22px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
			}
			.manage-item-box:nth-of-type(2) {
				background-image: linear-gradient(to right, #ff9569 0%, #e92758 100%);
			}
		}
		.user-list {
			margin: 10px;
			background: transparent;
			border-radius: 8px;
			overflow: hidden;
			box-shadow: 3px 3px 6px #ccc;
			.van-cell__left-icon {
				color: #888;
			}
		}
	}
</style>
