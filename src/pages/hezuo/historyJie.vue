<template>
	<div class="historyJie" ref="scrollTopJie" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar :title="name + '的历史借款'" left-arrow fixed @click-left="leftBack" />
		<div class="main-cont">
			<van-sticky :offset-top="46">
				<div class="searchCont">
					<div class="itemSea" @click="dateShow = true">
						<img src="../../images/date2.png" class="icon" />
						<p>{{searchDate}}</p>
					</div>
					<div class="itemSea" @click="selectShow = true">
						<img src="../../images/jieStu.png" class="icon" />
						<p>{{loanStatusText}}</p>
					</div>
				</div>
			</van-sticky>

			<!-- 历史借款 -->
			<div class="content">
				<div class="item" v-for="(item, index) in proList" :key="index" @click="goDetail(item.loan_code)">
					<div class="header">
						<p class="time">{{item.add_time}}</p>
						<!-- "status" //0待审批，1已放款，2已拒绝，3放款失败，4已结清，10已担保，11待担保 -->
						<p v-if="item.status == 0" class="status blue">待审批</p>
						<p v-else-if="item.status == 1" class="status green">已放款</p>
						<p v-else-if="item.status == 2" class="status red">已拒绝</p>
						<p v-else-if="item.status == 3" class="status orange">放款失败</p>
						<p v-else-if="item.status == 4" class="status grey">已结清</p>
						<p v-else-if="item.status == 10" class="status purple">已担保</p>
						<p v-else-if="item.status == 11" class="status yellow">待担保</p>
					</div>
					<van-grid class="grid" :column-num="3" :border="false">
						<van-grid-item class="unitYuan">
							<p class="num">{{item.loan_money}}</p>
							<p class="title">借款金额</p>
						</van-grid-item>
						<!-- 放款后 -->
						<template v-if="item.status == 1 || item.status == 4">
							<van-grid-item class="unitYuan">
								<p class="num">{{item.interest_money}}</p>
								<p class="title">借款利息</p>
							</van-grid-item>
							<van-grid-item class="unitYuan"
								:class="(item.overdue_day > 0 && item.status == 1)? 'overtime' : ''">
								<p class="num">{{item.left_principal}}</p>
								<p class="title">待还金额</p>
							</van-grid-item>
						</template>

						<!-- 放款前 -->
						<template v-else>
							<van-grid-item class="unitTime">
								<!-- 借款期限标识：0无，1年，2月，3日 -->
								<p class="num"
									:class="{'ri': item.loan_term_sign == 3,'yue': item.loan_term_sign == 2,'nian': item.loan_term_sign == 1}">
									{{item.loan_term_number}}
								</p>
								<p class="title">借款时长</p>
							</van-grid-item>
							<van-grid-item class="unitLilv">
								<p class="num">{{item.loan_rate}}</p>
								<p class="title">借款{{item.rate_explain}}</p>
							</van-grid-item>
						</template>
					</van-grid>
					<div class="bott" v-if="item.status == 2 && item.reason">
						<img src="../../images/refuseTitle.png" />
						<p class="desc">{{item.reason}}</p>
					</div>
				</div>

				<!-- 加载中 -->
				<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
				<!-- 没有更多了 -->
				<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
			</div>
		</div>

		<van-calendar v-model="dateShow" :min-date="minDate" color="#3B6AF1" title="选择借款日期" type="range"
			@confirm="onConfirm" />

		<!-- 选择借款状态 -->
		<van-action-sheet v-model="selectShow" title="选择借款状态" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<van-radio-group v-model="radioId">
				<van-cell :title="item1.name" clickable v-for="(item1, index1) in loanItem" :key="index1"
					@click="radioId = item1.id, radioSelStatus = item1.status, radioStatusText = item1.name"
					:class="radioId == item1.id ? 'active' : ''">
					<template #right-icon>
						<van-radio :name="item1.id">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
			</van-radio-group>
		</van-action-sheet>

	</div>
</template>
<script>
	export default {
		name: "historyJie",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				loanCode: '',
				name: '',
				proList: [],

				selectShow: false,
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				radioId: 1,
				radioSelId: 1,
				loanStatus: '',
				radioSelStatus: '',
				loanStatusText: '选择借款状态',
				radioStatusText: '',
				// 借款状态：0待审批，1已放款，2已拒绝，3放款失败，4已结清，10已担保，11待担保
				loanItem: [{
					name: '全部',
					id: 1,
					status: ''
				}, {
					name: '待审批',
					id: 2,
					status: 0
				}, {
					name: '已放款',
					id: 3,
					status: 1
				}, {
					name: '已拒绝',
					id: 4,
					status: 2
				}, {
					name: '放款失败',
					id: 5,
					status: 3
				}, {
					name: '已结清',
					id: 6,
					status: 4
				}, {
					name: '已担保',
					id: 7,
					status: 10
				}, {
					name: '待担保',
					id: 8,
					status: 11
				}],
				minDate: new Date(2021, 0, 1),
				startDate: '',
				endDate: '',
				searchDate: '选择借款日期',
				dateShow: false,
				pageSize: 10, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.loanCode = this.$route.query.loanCode
			this.name = this.$route.query.name
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 页面滚动
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;
					//到底了
					// console.log(this.isLoading, this.ifFinish);
					// console.log(scrollTop, clientHeight, scrollHeight);
					//是否继续加载且已完成加载
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading && !this.ifFinish && this.page <= this
						.totalPage) {
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
				data.page = this.page
				data.size = this.pageSize
				data.loan_code = this.loanCode
				data.loan_status = this.loanStatus
				data.start_date = this.startDate
				data.end_date = this.endDate

				this.$api.userLoanHistory(data).then(res => {
					this.$toast.clear()
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
						this.proList = this.proList.concat(res.data.loan);
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
					this.$toast.clear()
				});
			},
			formatDate(date) {
				return `${date.getMonth() + 1}/${date.getDate()}`;
			},
			formatDate1(date) {
				return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
			},
			onConfirm(date) {
				const [start, end] = date;
				this.dateShow = false;
				this.startDate = this.formatDate1(start)
				this.endDate = this.formatDate1(end)
				this.searchDate = `${this.formatDate(start)} - ${this.formatDate(end)}`;
				this.proList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.getList()
			},
			sureSel() {
				this.selectShow = false
				if (this.radioId != this.radioSelId) {
					this.radioSelId = this.radioId;
					this.loanStatus = this.radioSelStatus;
					this.loanStatusText = this.radioStatusText;
					this.proList = []
					this.page = 1
					this.totalNum = 0
					this.totalPage = 1
					this.ifFinish = false
					this.isLoading = true
					this.deviceTip = ''
					this.getList()
				}
			},
			goApply(id) {
				this.$router.push({
					path: '/applyJie',
					query: {
						productId: id
					}
				})
			},
			goDetail(code) {
				this.$router.push({
					// path: '/danjieDetail',
					path: '/jieDetail',
					query: {
						loanCode: code
					}
				})
			},

		},
	}
</script>
<style lang="less">
	.historyJie {
		padding-top: 46px;
		overflow: auto;
		background: #f0f6fc;

		.van-nav-bar {
			z-index: 10;
			background: #f0f6fc;

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

		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0
		}

		.van-sticky {
			background: #f0f6fc;
			height: 40px;
		}

		.searchCont {
			padding: 0 10px;
			display: flex;
			align-items: center;

			.itemSea {
				display: flex;
				align-items: center;
				padding-left: 10px;
				width: 130px;
				height: 30px;
				border-radius: 30px;
				background: #FFFFFF url(../../images/down.png) no-repeat calc(100% - 10px) center;
				background-size: 8px 5px;

				&:last-child {
					margin-left: 10px;
				}

				p {
					margin-left: 5px;
				}

				.icon {
					height: 14px;
				}
			}
		}

		.content {
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

					.status {
						font-size: 12px;
						transform: scale(0.9);
						align-items: center;
						height: 16px;
						line-height: 16px;
						margin: 11px 0 0 5px;
						padding: 0 5px;
						border-radius: 30px;

						&.red {
							color: #F13B3B;
							background: #ffeeee;
							border: 1px solid #f13b3b;
						}

						&.blue {
							color: #3B6AF1;
							background: #e2f4ff;
							border: 1px solid #3b6af1;
						}

						&.green {
							color: #2ABE8F;
							background: #e2fff9;
							border: 1px solid #2abe8f;
						}

						&.purple {
							color: #9E77E0;
							background: #faf6ff;
							border: 1px solid #9e77e0;
						}

						&.yellow {
							color: #FFA800;
							background: #fffde2;
							border: 1px solid #ffa800;
						}

						&.orange {
							color: #FF6C00;
							background: #FFEDE1;
							border: 1px solid #ff6c00;
						}

						&.grey {
							color: #9AA8B6;
							background: #f2f7fc;
							border: 1px solid #9aa8b6;
						}
					}
				}

				.grid {
					.van-grid-item {
						border-top: 1px solid #F0F6FC;
						border-right: 1px solid #F0F6FC;

						&:nth-child(3n) {
							border-right: none;
						}

						&.unitYuan {
							.num {
								&::before {
									background: url(../../images/yuan1.png) no-repeat;
									background-size: auto 10px;
								}
							}
						}

						&.unitTime {
							.num.ri {
								&::before {
									background: url(../../images/ri.png) no-repeat;
									background-size: auto 10px;
								}
							}

							.num.yue {
								&::before {
									background: url(../../images/yue1.png) no-repeat;
									background-size: auto 10px;
								}
							}

							.num.nian {
								&::before {
									background: url(../../images/nian.png) no-repeat;
									background-size: auto 10px;
								}
							}
						}

						&.unitLilv {
							.num {
								&::before {
									background: url(../../images/qian1.png) no-repeat;
									background-size: auto 10px;
								}
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


		.selSheet {
			.van-action-sheet__header {
				font-size: 15px;
				font-weight: bold;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					height: 3px;
					width: 30px;
					background: #3B6AF1;
					border-radius: 2px;
					bottom: 6px;
					left: calc(50% - 15px);
				}
			}

			.active {
				.van-cell__title {
					color: #3B6AF1;
				}
			}

			.img-icon {
				height: 20px;
			}

			.van-action-sheet__gap{
				height: 0px;
			}
			.van-action-sheet__cancel{
				color: #FFFFFF;
				height: 80px;
				font-size: 15px;
				padding-top: 25px;
				background: url(../../images/bgBtn1.png) no-repeat center 25px;
				background-size: calc(100% - 40px) 40px;
			}
		}


	}
</style>
