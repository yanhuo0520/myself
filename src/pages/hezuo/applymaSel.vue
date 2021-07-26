<template>
	<div class="applymaSel" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="加入群众团体" left-arrow fixed @click-left="leftBack" />
		<van-sticky :offset-top="46">
			<van-search v-model="value" shape="round" @input="searchIn()" clearable placeholder="请输入你要加入的群众团体名称">
				<template #right-icon>
					<img src="../../images/search.png" @click="onSearch()" class="searchBtn" alt="" />
				</template>
			</van-search>
			<template v-if="searCont">
				<van-cell-group class="serchCont">
					<van-cell v-for="(item, index) in serchContList" :key="index" :title="item.team_name"
						@click="selCont(item.team_id)" />
				</van-cell-group>
			</template>

		</van-sticky>
		<div class="content" v-if="showList">
			<p class="title">相关群众团体</p>
			<div class="itemCont" v-for="(item1, index1) in searList" :key="index1">
				<van-cell icon="shop-o">
					 <template #title>
					    <span class="custom-title">{{item1.team_name}}</span>
					    <van-tag round v-if="item1.mem_status == 0">团长</van-tag>
					  </template>
					<template #icon>
						<img src="../../images/mass1.png" class="leftIcon" />
					</template>
					<!-- mem_status -1没申请过该团队，0转为该团团长不可分销了，1审核通过，2待审核，3驳回 -->
					<template #right-icon v-if="item1.mem_status == 1">
						<p class="btn btnNull">已加入</p>
					</template>
					<template #right-icon v-else-if="item1.mem_status == 2">
						<p class="btn btnNull">审核中</p>
					</template>
					<template #right-icon v-else-if="item1.mem_status == 3">
						<p class="btn btnNull">未通过</p>
					</template>
					<template #right-icon v-else-if="item1.mem_status == -1">
						<p class="btn" @click="goinCode(item1.team_id)">申请加入</p>
					</template>
				</van-cell>
			</div>

			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
		</div>

		<div class="contentNull" v-else>
			<img src="../../images/selImg.png" class="nullImg" />
		</div>

	</div>
</template>
<script>
	export default {
		name: "applymaSel",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				value: '',
				team_id: '',
				team_name: '',
				searCont: false,
				serchContList: [],

				showList: false,
				searList: [],
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
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			searchIn() {
				this.showList = false
				this.searList = []
				this.$api.src_team_name_lists({
					team_name: this.value
				}).then(res => {
					if (res.errno == 0) {
						this.serchContList = res.data;
						if (res.data.length > 0) {
							this.searCont = true
						} else {
							this.searCont = false
						}
				
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
				
				})
			},
			selCont(id) {
				this.searCont = false
				this.team_id = id
				this.team_name = ''
				this.page = 1
				this.getList()
			},
			onSearch() {
				if (this.value) {
					this.team_name = this.value
					this.page = 1
					this.getList();
				} else {
					this.$toast("请输入搜索条件")
				}

			},
			// 页面滚动
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
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
				this.showList = true
				let data = {}
				data.page = this.page
				data.size = this.pageSize
				data.team_id = this.team_id
				data.team_name = this.team_name
				this.$api.user_src_team_lists(data).then(res => {
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
						this.searList = this.searList.concat(res.data.data);
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
						this.searList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},
			goinCode(team_id) {
				this.$router.push({
					path: '/joinMass',
					query: {
						team_id: team_id
					}
				})
				
			},
			sendBtn() {
				let data = {}
				data.team_id = this.team_id
				data.join_pwd = this.aaaa
				data.province_id = this.aaaa
				data.city_id = this.aaaa
				data.area_id = this.aaaa
				data.address = this.aaaa
				data.idcard_just = this.aaaa
				data.idcard = this.aaaa
				this.$api.user_join_team(data).then(res => {
					if (res.errno == 0) {
						this.ifTipJie = true
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},

		}
	}
</script>
<style lang="less">
	.applymaSel {
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

		.van-hairline--bottom::after {
			border-bottom-width: 0
		}

		.van-search {
			margin: 0 10px;
			padding: 0;
			border-radius: 50px;

			.van-field__left-icon {
				display: none;
			}

			.van-search__content {
				background: #FFFFFF;

				.van-cell {
					padding: 0 8px 0 5px;
				}
			}

			input:-ms-input-placeholder {
				color: #9AA8B6;
			}

			::-webkit-input-placeholder {
				color: #9AA8B6;
			}

			.searchBtn {
				margin-top: 5px;
				width: 25px;
			}
		}

		.serchCont {
			margin: 5px 10px 0 10px;
			border-radius: 15px;

			.van-cell {
				padding: 5px 16px;

				&:first-child {
					border-top-left-radius: 15px;
					border-top-right-radius: 15px;
				}

				&:last-child {
					border-bottom-left-radius: 15px;
					border-bottom-right-radius: 15px;
				}
			}
		}

		.contentNull {
			text-align: center;

			.nullImg {
				margin-top: 30px;
				width: 100%;
				max-width: 750px;
			}
		}

		.content {
			margin: 15px 10px;

			.itemNull {
				margin-top: 10px;
				text-align: center;

				span {
					color: red;
				}
			}

			.itemCont {
				margin-top: 10px;

				.van-cell {
					&:first-child {
						border-top-left-radius: 10px;
						border-top-right-radius: 10px;
					}

					&:last-child {
						border-bottom-left-radius: 10px;
						border-bottom-right-radius: 10px;
					}
					.van-tag{
						border: 1px solid #3b6af1;
						background: #e2f4ff;
						color: #3B6AF1;
					}
				}
			}

			.title {
				font-size: 15px;
			}

			.leftIcon {
				width: 20px;
				height: 20px;
				margin-right: 5px;
				margin-top: 3px;
			}

			.btn {
				color: #FFFFFF;
				width: 72px;
				text-align: center;
				border-radius: 30px;
				background: #3B6AF1;
				&.btnNull{
					background: #F0F6FC;
					color: #9AA8B6;
				}
			}
		}

		.van-loading,
		.noMore {
			padding: 10px 0;
			text-align: center;
		}




	}
</style>
