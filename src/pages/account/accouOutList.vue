<template>
	<div class="accouOutList" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="转出列表" left-arrow fixed @click-left="leftBack" />
		<div class="content" v-if="list.length > 0">
			<div class="item" v-for="(item, index) in list" :key="index">
				<div class="left">
					<img src="../../images/gujin.png" />
					<div>
						<p class="title">测试</p>
						<p class="time">测试</p>
					</div>
				</div>
				<p class="price">测试</p>
			</div>
			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
		</div>
		<!-- 暂无内容 -->
		<div class="null" v-else-if="list.length == 0 && !isLoading">
			<img src="../../images/zanwu.png" alt="" />
		</div>
		
	</div>
</template>
<script>
	export default {
		name: "accouOutList",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				list: [],
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
			
			this.walletTakeOutLists()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
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
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading &&!this.ifFinish && this.page <= this.totalPage) {
						// 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
						this.isLoading = true;
						// console.log("到底了");
						setTimeout(() => {
							this.walletTakeOutLists();
						}, 1000);
					}
				}
			},
			walletTakeOutLists() {
				let data = {}
					data.status = '' // 1取出成功，2取出申请审核中，3取出申请驳回
					data.page = this.page
					data.size = this.pageSize
					// data.start_date = this.start_date
					// data.end_date = this.end_date
				this.$api.wallet_take_out_lists(data).then(res => {
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
						this.list = this.list.concat(res.data);
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
				});
			},
		}
	}
</script>
<style lang="less">
	.accouOutList {
		padding-top: 46px;
		background: #F0F6FC;
		overflow: auto;
		.van-nav-bar {
			background: #F0F6FC;

			.van-icon {
				color: #222222;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}
		.van-hairline--bottom::after{
			border-bottom-width: 0
		}
		.content{
			background: #ffff;
			border-radius: 10px 10px 0 0;
			.item{
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px 0;
				margin: 0 10px;
				border-bottom: 1px solid #F0F6FC;
			}
			.left{
				display: flex;
				align-items: center;
				img{
					width: 40px;
					margin-right: 10px;
				}
				.title{
					font-size: 14px;
				}
				.time{
					margin-top: 6px;
					color: #9AA8B6;
				}
			}
			.price{
				font-weight: bold;
				font-size: 15px;
			}
		}

		.null{
			text-align: center;
			img{
				max-width: 100%;
			}
		}

		.van-loading, .noMore {
			padding: 10px 0;
			text-align: center;
		}



	}
</style>
