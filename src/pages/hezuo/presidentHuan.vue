<template>
	<div class="presidentHuan" ref="scrollTopHuan" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'
		:class="{'ifFixed': ifFixed}">
		<van-nav-bar title="我要还款" left-arrow fixed @click-left="leftBack" />
		<div class="jieCont">
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
			<div class="wraning" v-if="leftCont.all_overdue_number > 0">
				<img src="../../images/warning.png" class="tip" />
				<p>您有{{leftCont.all_overdue_number}}笔借款已逾期</p>
				<img src="../../images/right1.png" class="right" />
			</div>
			<p class="maxEdu">{{leftCont.all_left_principal}}</p>
			<div class="jieDesc">
				<div class="item">
					<p class="num">{{leftCont.all_back_principal}}</p>
					<p class="title">已还金额</p>
				</div>
				<div class="item">
					<p class="num">{{leftCont.loan_count}}</p>
					<p class="title">待还笔数</p>
				</div>
				<div class="item">
					<p class="num">{{leftCont.all_overdue_number}}</p>
					<p class="title">逾期笔数</p>
				</div>
			</div>
		</div>

		<div class="main-cont" :class="{'ifFixed': ifFixed}">
			<van-sticky :offset-top="46">
				<van-tabbar :fixed="false" class="jieTabbar">
					<van-tabbar-item v-for="(item1,index1) of itemsJie" @click="clickitemsJieTab(item1.id, item1.status)"
						:key="index1">
						<template #icon>
							<img :src="index1 === jieId ?item1.iconSelect: item1.icon" />
						</template>
					</van-tabbar-item>
				</van-tabbar>
			</van-sticky>
			


			<!-- 待还款 -->
			<div class="contentTab" v-if="jieId == 0">
				<div class="item" v-for="(item, index) in proList" :key="index" @click="huanJihua(item.loan_code)">
					<div class="header">
						<p class="time">{{item.add_time}}</p>
					</div>
					<van-grid class="grid" :column-num="3" :border="false">
						<van-grid-item>
							<p class="num">{{item.loan_money}}</p>
							<p class="title">借款金额</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.interest_money}}</p>
							<p class="title">利息</p>
						</van-grid-item>
						<van-grid-item :class="item.overdue_day > 0 ? 'overtime' : '' ">
							<p class="num">{{item.left_principal}}</p>
							<p class="title">待还金额</p>
						</van-grid-item>
					</van-grid>
					<div class="bott">
						<img src="../../images/endTime.png" />
						<p class="desc">{{item.endDate}}</p>
					</div>
				</div>
				<!-- 加载中 -->
				<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
				<!-- 没有更多了 -->
				<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>

			</div>

			<!-- 已结清 -->
			<div class="contentTab" v-if="jieId == 1">
				<div class="item" v-for="(item, index) in proList" :key="index" @click="huanJilu(item.loan_code)">
					<div class="header">
						<p class="time">{{item.add_time}}</p>
					</div>
					<van-grid class="grid" :column-num="3" :border="false">
						<van-grid-item>
							<p class="num">{{item.loan_money}}</p>
							<p class="title">借款金额</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.interest_money}}</p>
							<p class="title">利息</p>
						</van-grid-item>
						<van-grid-item>
							<p class="num">{{item.back_principal}}</p>
							<p class="title">已还金额</p>
						</van-grid-item>
					</van-grid>
					<div class="bott">
						<img src="../../images/endTime.png" />
						<p class="desc">{{item.endDate}}</p>
					</div>
				</div>
				<!-- 加载中 -->
				<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
				<!-- 没有更多了 -->
				<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
			</div>
		</div>


	</div>
</template>
<script>
	export default {
		name: "presidentHuan",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				ifFixed: false,
				fromPath:'',
				leftCont: {
					all_left_principal: 0, //待还本金总额
					all_back_principal: 0, //已还本金总额
					loan_count: 0, //总计多少笔待还贷款
					all_overdue_number: 0, //当前逾期期数
				},
				jieId: 0,
				status: 1,
				itemsJie: [{
						name: "待还款",
						id: 0,
						status: 1,
						icon: require("../../images/daihuanTitle.png"),
						iconSelect: require("../../images/daihuanTitleSel.png")
					},
					{
						name: "已结清",
						id: 1,
						status: 4,
						icon: require("../../images/yijieqing1.png"),
						iconSelect: require("../../images/yijieqing1Sel.png")
					}
				],

				proList: [],
				ifChange: false,
				pageSize: 10, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: ''
			};
		},
		beforeRouteEnter (to, from, next){
			next(vm => {
				 // 通过 `vm` 访问组件实例,将值传入fromPath
				vm.fromPath = from.path
			})
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.$nextTick(()=>{
			  if(this.fromPath == '/preHuanPlan'){
			  	this.jieId = 0
					this.status = 1
			  }else if(this.fromPath == '/huanJilu'){
					this.jieId = 1
					this.status = 4
			  }
				this.myAllLeftBackPrincipal()
				this.getList()
			})
		},
		methods: {
			leftBack() {
				// this.$router.go(-1);
				this.$router.replace('/hezuoIndexPresid')
			},
			// 当前总剩余应还贷款本金总额（返回参数修改）
			myAllLeftBackPrincipal() {
				this.$api.myAllLeftBackPrincipal({}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.leftCont = res.left
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 切换标题
			clickitemsJieTab(id, status) {
				this.ifChange = true
				this.$refs.scrollTopHuan.scrollTop = 0
				this.jieId = id
				this.status = status
				this.proList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.getList()
			},
			// 页面滚动
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;

					if (scrollTop > 138) {
						this.ifFixed = true
					} else {
						this.ifFixed = false
					}

					//到底了
					// console.log(this.isLoading, this.ifFinish);
					// console.log(scrollTop, clientHeight, scrollHeight);
					//是否继续加载且已完成加载
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading && !this.ifFinish && this.page <= this
						.totalPage && !this.ifChange) {
						// 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
						this.isLoading = true;
						// console.log("到底了");
						setTimeout(() => {
							this.getList();
						}, 1000);
					}

				}
			},
			getList() {
				let data = {}
				data.status = this.status
				data.page = this.page
				data.size = this.pageSize
				this.$api.myUserLoanBackIndex(data).then(res => {
					this.ifChange = false
					if (res.errno == 0) {
						this.totalNum = res.data.count;
						this.totalPage = res.data.total_page
						if (this.totalNum == 0) {
							// console.log("没有数据");
							this.isLoading = false;
							this.ifFinish = true;
							this.page = 1;
							this.deviceTip = "暂无数据";
							return false;
						}
						res.data.lists.forEach(ele => {
							ele.endDate = ele.end_date.substr(0, 10)
						})
						this.proList = this.proList.concat(res.data.lists);
						// console.log(this.page, this.totalPage);
						if (this.page == this.totalPage) {
							this.isLoading = false;
							this.ifFinish = true;
							// this.page = 1;
							this.deviceTip = "没有更多了~";
							// console.log("没有更多了");
						} else {
							// console.log("下一页");
							this.isLoading = true;
							this.ifFinish = false;
							this.page++;
							this.deviceTip = "正在加载中~";
						}
					} else {
						this.proList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {

				});
			},
			huanJihua(loan_code){
				this.$router.push({
					path: '/preHuanPlan',
					query:{
						loanCode: loan_code
					}
				})
			},
			huanJilu(loan_code){
				this.$router.push({
					path: '/huanJilu',
					query:{
						loanCode: loan_code
					}
				})
			}

		},
	}
</script>
<style lang="less">
	.presidentHuan {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc url(../../images/bgHeader6.png) no-repeat;
		background-size: 100% 170px;

		&.ifFixed {
			background: #f0f6fc url(../../images/bgTop6.png) no-repeat center 46px;
			background-size: 100% 200px;
		}

		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader6.png) no-repeat top center;
			background-size: 100% 170px;


			.van-icon {
				color: #222222;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}

		.van-hairline--bottom::after {
			border-bottom-width: 0
		}


		.jieCont {
			margin: 0 10px;
			padding-top: 35px;
			padding: 35px 0 15px 0;
			text-align: center;
			border-radius: 15px 15px 0 0;
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			color: #FFFFFF;
			position: relative;
			overflow: hidden;

			.bgTop {
				position: absolute;
				top: 0;
				right: 0;
				width: 200px;
			}

			.bgLogo {
				position: absolute;
				left: -40px;
				bottom: -10px;
				width: 110px;
			}

			.bgBottom {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 300px;
			}

			.wraning {
				position: absolute;
				left: 10px;
				top: 10px;
				height: 16px;
				display: flex;
				align-items: center;
				background: #F0F6FC;
				color: #444444;
				border-radius: 10px;

				.tip {
					width: 20px;
					margin-right: 2px;
				}

				.right {
					margin-left: 5px;
					height: 8px;
					padding-right: 5px;
				}
			}

			.maxEdu {
				font-family: DIN, DIN-Medium;
				font-size: 30px;
				position: relative;
				display: inline;

				&::before {
					position: absolute;
					top: -5px;
					left: calc(100% + 2px);
					content: '';
					width: 65px;
					height: 10px;
					background: url(../../images/daihuanyuan.png) no-repeat;
					background-size: auto 10px;
				}
			}

			.jieDesc {
				margin-top: 25px;
				display: flex;
				justify-content: space-around;

				.item {
					position: relative;
					width: 33.3333%;

					&:last-child {
						&::after {
							background: transparent;
						}
					}

					&::after {
						position: absolute;
						content: '';
						top: 0;
						right: 0;
						width: 1px;
						height: 30px;
						background: linear-gradient(0deg, rgba(255, 255, 255, 0.2) 0%, #ffffff 50%, rgba(255, 255, 255, 0.2) 100%);
					}

					.num {
						font-size: 15px;
						position: relative;
						display: inline;

						&::before {
							position: absolute;
							top: -5px;
							left: calc(100% + 2px);
							content: '';
							width: 14px;
							height: 10px;
						}
					}

					.title {
						margin-top: 5px;
						color: #B2CAFF;
					}

					&:nth-child(1) .num::before {
						background: url(../../images/yuan.png) no-repeat;
						background-size: auto 10px;
					}

					&:nth-child(2) .num::before,
					&:nth-child(3) .num::before {
						background: url(../../images/bi.png) no-repeat;
						background-size: auto 10px;
					}
				}
			}
		}
		.van-sticky--fixed{
			.jieTabbar{
				border-radius: 10px 10px 0 0;
			}
		}
		.van-tabbar.jieTabbar {
			padding: 15px 0 10px 0;
			height: auto;
			.van-tabbar-item__icon {
				height: 25px;

				img {
					width: 48px;
					height: auto;
				}
			}

			.van-tabbar-item--active {
				background: transparent;
			}
		}

		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0
		}

		.main-cont {
			background: url("../../images/jiebg.png") no-repeat;
			background-size: 100% 170px;

			&.ifFixed {
				background: none;
			}
		}

		.contentTab {
			.item {
				margin: 10px 10px 0 10px;
				border-radius: 10px;
				background: #FFFFFF;

				&:first-child {
					margin-top: 0;
				}

				.header {
					font-size: 15px;
					display: flex;
					background: url(../../images/right1.png) no-repeat calc(100% - 10px) center;
					background-size: 9px 15px;
					line-height: 42px;
					padding-left: 15px;
					position: relative;

					&::before {
						position: absolute;
						top: 16px;
						left: 8px;
						content: '';
						width: 3px;
						height: 8px;
						border-radius: 35%;
						background: #3B6AF1;
					}
				}

				.grid {
					.van-grid-item {
						border-top: 1px solid #F0F6FC;
						border-right: 1px solid #F0F6FC;

						&:nth-child(3n) {
							border-right: none;
						}

						&.overtime {
							.num {
								color: #F24B4B;

								&::before {
									background: url(../../images/yuan2.png) no-repeat;
									background-size: auto 10px;
								}
							}

							.title {
								color: #F24B4B;
							}
						}

						.num {
							font-size: 15px;
							position: relative;

							&::before {
								position: absolute;
								top: -5px;
								left: calc(100% + 2px);
								content: '';
								min-width: 14px;
								height: 10px;
								background: url(../../images/yuan1.png) no-repeat;
								background-size: auto 10px;
							}
						}

						.title {
							margin-top: 5px;
							color: #9AA8B6;
						}
					}
				}

				.bott {
					display: flex;
					align-items: center;
					padding: 0 10px;
					border-top: 1px solid #F0F6FC;

					img {
						width: 75px;
						height: 20px;
					}

					.desc {
						color: #9AA8B6;
						font-size: 15px;
						line-height: 42px;
						width: calc(100% - 85px);
						padding-left: 10px;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}

		}

		.null {
			img {
				max-width: 100%;
			}
		}

		.van-loading,
		.noMore {
			padding: 10px 0;
			text-align: center;
		}


	}
</style>
