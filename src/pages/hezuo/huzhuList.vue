<template>
	<div class="huzhuList" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="互助金明细" left-arrow fixed @click-left="leftBack" />
		<div class="topTitle">
			<div class="time" @click="show=true">
				<img src="../../images/time.png" class="leftImg" />
				{{showTime}}
				<img src="../../images/down.png" class="rightImg" />
			</div>
			<div class="time" @click="showStatus = true">
				<img src="../../images/jieStu.png" class="leftImg" />
				{{selStatusText}}
				<img src="../../images/down.png" class="rightImg" />
			</div>
		</div>
		<div class="content" v-if="list.length > 0">
			<div class="item" v-for="(item, index) in list" :key="index" @click="goDetail(item.log_id)">
				<div class="left">
					<img src="../../images/huzhujin.png" />
					<div>
						<p class="title">{{item.log_type_str}}
						<!-- "status":  0失败（取出申请驳回），1成功，2审核中 -->
							<van-tag round class="zhuanIng" v-if="item.status == 2">转出中</van-tag>
							<template v-else-if="item.status == 1"></template>
							<van-tag round class="faile" v-else>失败</van-tag>
						</p>
						<p class="time">{{item.log_date}}</p>
					</div>
				</div>
				<p class="price">{{item.log_money}}</p>
			</div>
			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
		</div>
		<!-- 暂无内容 -->
		<div class="content null" v-else-if="list.length == 0 && !isLoading">
			<img src="../../images/zanwu.png" alt="" />
		</div>


		<van-popup v-model="show" round position="bottom" :style="{ height: '40%' }">
			<van-datetime-picker v-model="currentDate" type="year-month" title="选择年月" :min-date="minDate"
				:max-date="maxDate" @cancel="show=false" @confirm="handleTime" />
		</van-popup>
		
		<!-- 选择状态 -->
		<van-action-sheet v-model="showStatus" title="选择类型" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<van-radio-group v-model="radioId">
				<van-cell :title="item1.name" clickable v-for="(item1, index1) in logTypeItem" :key="index1"
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
			<!-- <van-button round block type="info" @click="sureSel()">确定</van-button> -->
		</van-action-sheet>


	</div>
</template>
<script>
	export default {
		name: "huzhuList",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 86,
				showTime: '',
				show: false,
				minDate: new Date(2020, 0, 1),
				maxDate: new Date(),
				currentDate: new Date(),
				searchDate: '',
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				showStatus: false,
				selStatus: 0,
				selStatusText: '全部',
				radioId: 1,
				radioSelStatus: 0,
				radioStatusText: '全部',
				// log_type：0全部，10存款，1取款，2贷款，3还款，5转入，6转出，14定期存入，15定期取出
				logTypeItem: [{
					name: '全部',
					id: 1,
					status: 0
				}, {
					name: '取款',
					id: 2,
					status: 1
				}, {
					name: '贷款',
					id: 3,
					status: 2
				}, {
					name: '还款',
					id: 4,
					status: 3
				}, {
					name: '转入',
					id: 5,
					status: 5
				}, {
					name: '转出',
					id: 6,
					status: 6
				}, {
					name: '存款',
					id: 7,
					status: 10
				}, {
					name: '定期存入',
					id: 8,
					status: 14
				}, {
					name: '定期取出',
					id: 9,
					status: 15
				}],
				list: [],
				pageSize: 20, //每页显示
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
			
			this.$toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0,
			});
			
			this.showTime = this.$dateCurMonth()
			this.searchDate = this.$dateCurYearMonth()
			
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			handleTime(value) {
				let d = new Date(value);
				let year = d.getFullYear()
				let month = (d.getMonth() < 9) ? ('0' + (d.getMonth() + 1)) : (d.getMonth() + 1)
				let myDate = new Date(year, month, 0);
				this.showTime = year + '-' + month
				this.searchDate = year + '-' + month
				this.show = false
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.list = []
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getList()

			},
			sureSel(){
				this.showStatus = false
				this.selStatus = this.radioSelStatus
				this.selStatusText = this.radioStatusText
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				this.list = []
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.getList()
			},
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
				data.date = this.searchDate
				data.log_type = this.selStatus
				this.$api.passbook_log(data).then(res => {
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
						this.list = this.list.concat(res.data.log);
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
						this.list = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},
			goDetail(log_id){
				this.$router.push({
					path: '/huzhuDetail',
					query: {
						logId: log_id
					}
				})
			}
		}
	}
</script>
<style lang="less">
	.huzhuList {
		padding-top: 86px;
		overflow: auto;

		.van-nav-bar {
			background: #F0F6FC;
			z-index: 10;

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

		.topTitle {
			position: fixed;
			top: 46px;
			left: 0;
			width: 100%;
			padding: 0 10px;
			line-height: 20px;
			height: 40px;
			background: #F0F6FC url(../../images/cooperativebg1.png) no-repeat bottom right;
			background-size: auto 45px;

			&::after {
				position: absolute;
				left: 0;
				bottom: 0;
				content: '';
				height: 10px;
				width: calc(100% - 20px);
				background: url(../../images/bgraduis1.png) no-repeat bottom;
				background-size: 100% 10px;
			}

			.time {
				display: inline-flex;
				align-items: center;
				padding: 0 10px;
				border-radius: 30px;
				background: #FFFFFF;
				.leftImg{
					width: 12px;
					height: 12px;
					margin-right: 5px;
				}
				.rightImg{
					margin-left: 5px;
					width: 8px;
					height: 5px;
				}
			}
		}

		.content {
			background: #FFFFFF;
			border-radius: 10px 10px 0 0;
			padding: 0 10px;

			.item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				border-bottom: 1px solid #F0F6FC;

				&:first-child {
					border-radius: 10px 10px 0 0;
				}
			}

			.left {
				display: flex;
				align-items: center;

				img {
					width: 40px;
					margin-right: 10px;
				}

				.title {
					font-size: 14px;
					.faile {
						color: #F24B4B;
						background: #ffeded;
						border: 1px solid #f24b4b;
					}

					.zhuanIng {
						color: #3B6AF1;
						background: #e2f4ff;
						border: 1px solid #3b6af1;
					}
				}

				.time {
					margin-top: 6px;
					color: #9AA8B6;
				}
			}

			.price {
				font-weight: bold;
				font-size: 15px;
			}
		}

		.null {
			text-align: center;

			img {
				margin-top: 30px;
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
