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
			<div v-if="value && searList.length > 0">
				<div class="itemCont" v-for="(item1, index1) in searList" :key="index1" >
					<van-cell :title="item1.team_name" icon="shop-o">
						<template #icon>
							<img src="../../images/mass1.png" class="leftIcon" />
						</template>
						<template #right-icon>
							<p class="btn" @click="goinCode(item1.team_id, item1.need_pwd)">申请加入</p>
						</template>
					</van-cell>
				</div>
			</div>
			
			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
		</div>

		<div class="contentNull" v-else>
			<img src="../../images/selImg.png" class="nullImg" />
		</div>

		<!-- 邀请码输入 -->
		<van-popup v-model="yqCodeShow" class="tipCont1">
			<img src="../../images/loginTip1.png" class="IMg" />
			<div class="titCont">
				<img src="../../images/yqmTitle.png" class="titleIMg" />
			</div>
			<div class="inCont">
				<van-field v-model="yqCode" rows="3" type="textarea" placeholder="请输入邀请码,如您已遗忘,请联系该群 众团体的创建者" />
				<p class="btn" @click="sendBtn()">立即提交</p>
			</div>

			<img src="../../images/close.png" @click="yqCodeShow = false" class="closeIMg" />
		</van-popup>


		<!-- 加入结果 -->
		<van-popup v-model="ifTipJie" class="tipCont2">
			<img src="../../images/jietip.png" class="IMg" />
			<p class="tipTitle">管理员将在1-3个工作日<br /> 审核完成,请您耐心等待!</p>
			<p class="btn" @click="ifTipJie=false">确定</p>
		</van-popup>


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
				yqmDefault: '',
				yqCodeShow: false,
				yqCode: '',
				ifTipJie: false,

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
				if (this.value) {
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
				}
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
			goinCode(team_id, need_pwd) {
				this.team_id = team_id
				if(need_pwd == 0){ //不需要邀请码加入  0否，1是
					this.sendBtn()
				}else{
					this.yqCodeShow = true
				}
				
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
				width: 65px;
				text-align: center;
				border-radius: 30px;
				background: #3B6AF1;
			}
		}

		.tipCont1 {
			width: calc(100% - 60px);
			max-width: 510px;
			border-radius: 10px;
			background: transparent;
			text-align: center;
			font-size: 15px;
			color: #444444;

			.IMg {
				width: 45px;
				margin-left: calc(50% + 20px);
			}

			.titCont {
				margin-top: -30px;
				text-align: center;
				background: #ffffff;
				border-radius: 10px 10px 0 0;

				.titleIMg {
					margin: 50px 0 20px 0;
					width: 130px;
				}
			}

			.inCont {
				padding: 10px 10px 20px 10px;
				background: #ffffff;
				margin-top: -1px;
				border-radius: 0 0 10px 10px;

				.van-cell {
					background-color: #F0F6FC;
					border-radius: 10px;
					padding: 5px 16px;
				}

				.yzmCell {
					margin-top: 10px;

					.van-button {
						height: auto;
						background: transparent;
						border: none;
						color: #3B6AF1;
					}
				}
			}

			.btn {
				margin-top: 20px;
				border-radius: 40px;
				font-size: 15px;
				line-height: 40px;
				text-align: center;
				background: #3b6af1;
				color: #FFFFFF;
			}

			.closeIMg {
				margin-top: 30px;
				padding: 10px 30px;
				width: 20px;
			}
		}

		.tipCont2 {
			width: calc(100% - 60px);
			max-width: 510px;
			border-radius: 10px;
			background: transparent url(../../images/danTipBg.png) no-repeat center 46px;
			background-size: 100% auto;
			text-align: center;
			font-size: 15px;
			color: #444444;

			.IMg {
				width: 100%;
			}

			.tipTitle {
				background: #FFFFFF;
				padding: 20px 0;
				line-height: 20px;
			}

			.btn {
				margin: 10px 20px 20px 20px;
				border-radius: 40px;
				font-size: 15px;
				line-height: 40px;
				text-align: center;
				background: #3b6af1;
				color: #FFFFFF;
			}
		}

		.van-loading,
		.noMore {
			padding: 10px 0;
			text-align: center;
		}




	}
</style>
