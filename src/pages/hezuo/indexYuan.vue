<template>
	<div class="indexYuan" ref="scrollTopState" @scroll="scrollEvent($event)" :style='{height: deviceHeight + "px"}'
		:class="{'ifFixed': ifFixed}">
		<van-nav-bar title="合作经济" fixed />
		<div class="topCont">
			<div class="topLeft">
				<img :src="photoIMg" alt="" class="headerImg" />
				<p>{{infoDetal.name}} <span class="tip">团员</span> </p>
			</div>
			<p class="topRight" @click="changeIdentity">{{infoDetal.team_name}}</p>
		</div>

		<div class="money">
			<div>
				<p class="num">{{infoDetal.yw_count}}</p>
				<p class="title">我的业务</p>
			</div>
			<div>
				<p class="num">{{infoDetal.tg_numbers}}</p>
				<p class="title">我的推广</p>
			</div>
			<div @click="goTiMoney(infoDetal.profit)">
				<p class="num">{{infoDetal.profit}}</p>
				<p class="title">我的收益</p>
			</div>
		</div>
		<!-- 团队业务-团队业绩-我的团队 -->
		<van-sticky :offset-top="46">
			<van-tabbar :fixed="false" class="teamTabbar">
				<van-tabbar-item v-for="(item1,index1) of itemsTeam" @click="clickTeamTab(item1.id)" :key="index1">
					<template #icon>
						<img :src="index1 === itemTeamId ?item1.iconSelect: item1.icon" />
					</template>
				</van-tabbar-item>
			</van-tabbar>
		</van-sticky>

		<!-- 团队业务 -->
		<div class="content" v-if="itemTeamId == 0">
			<div class="imgCont">
				<img src="../../images/hezuobg.png" alt="" class="topBg" />
				<img src="../../images/gshw.png" alt="" class="topImg" />
				<img src="../../images/haowu.png" alt="" class="leftImg" />
			</div>
			<!-- 商品分类 -->
			<div class="cateList" v-if="categoryList.length > 0">
				<ul>
					<li v-for="(item2,index2) of categoryList" @click="clickGoodTab(item2.assort_id)" :key="index2">
						<!-- <img :src="item2.icon" /> -->
						<p :class="item2.assort_id === categoryId ? 'active': ''">{{item2.assort_name}}</p>
					</li>
				</ul>
			</div>
			<div class="shopCont">
				<div class="shop" v-for="(item3,index3) of goodsList" @click="goodDetail(item3.goods_id)" :key="index3">
					<div class="img-cont">
						<p class="saleNum">已抢购{{item3.sales_num}}</p>
						<img :src="item3.thumb" class="shop-img" />
					</div>
					<div class="bottom-cont">
						<p class="name">{{item3.goods_name}}</p>
						<p class="from">{{item3.coopera_name}}</p>
						<div class="price-cont">
							<p class="price"><span class="new">￥</span>{{item3.priceQian}}.<span
									class="new">{{item3.priceHou}}</span> <span
									class="old">￥{{item3.discount_price}}</span> </p>
							<div class="cartCont">
								<!-- <img src="../../images/addgood.png" alt="" @click="addCart()" /> -->
								赚{{item3.member_tg_money}}
							</div>
						</div>
					</div>
				</div>
				<div style="width: 100%;position: relative;">
					<!-- 加载中 -->
					<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
					<!-- 没有更多了 -->
					<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>
				</div>
			</div>

		</div>

		<!-- 团队业绩 -->
		<div class="content" v-if="itemTeamId == 1">
			<div class="contTotal">
				<img src="../../images/logoBg.png" alt="" class="logoBg" />
				<img src="../../images/xiexianBg.png" alt="" class="xiexianBg" />
				<div class="yejiDiv">
					<p class="num">{{yejistatistics.yw_count}}</p>
					<p class="title">个人业务量</p>
				</div>
				<div class="yejiDiv">
					<p class="num">{{yejistatistics.person_all_profit}}</p>
					<p class="title">个人总收益</p>
				</div>
			</div>
			<div class="yejiCont">
				<p class="main-title">个人业绩实时动态</p>
				<div class="yejiItem" v-for="(item, index) in yejiList" :key="index">
					<div class="header">
						<img :src="item.photo" alt="" class="peoplePic" />
						<img src="../../images/cartLine.png" alt="" class="cartLine" />
						<img :src="item.goods[0].thumb" alt="" class="goodsPic" />
					</div>
					<div class="listItem">
						<div>
							<img src="../../images/shareperson.png" />
							<p class="title">{{item.name}}</p>
						</div>
						<div>
							<img src="../../images/xiadantime.png" />
							<p class="title">{{item.log_date}}</p>
						</div>
					</div>
				</div>
				<!-- 加载中 -->
				<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
				<!-- 没有更多了 -->
				<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>

			</div>
		</div>
		<!-- 我的团队 -->
		<div class="content" v-if="itemTeamId == 2">
			<div class="teamTitle">
				<div class="item" v-for="(item, index) in itemApplyTitle" :key="index"
					:class="item3Id == item.id ? 'active' : ''" @click="teamItemSel(item.id)">
					<img :src="item.icon" alt="" />
					<p>{{item.name}}</p>
				</div>
			</div>

			<template v-if="item3Id == 1">
				<div class="contTotal">
					<img src="../../images/logoBg.png" alt="" class="logoBg" />
					<img src="../../images/xiexianBg.png" alt="" class="xiexianBg" />
					<div class="teamDiv">
						<p class="num">{{teamstatistics.total_count}} </p>
						<p class="title">团队总人数</p>
					</div>
					<div class="teamDiv">
						<p class="num">{{teamstatistics.yx_count}}<span
								class="totalNum">/{{teamstatistics.total_count}}</span></p>
						<p class="title">有效总人数</p>
					</div>
				</div>
				<div class="stateCont">
					<!-- 我的排名 -->
					<div class="stateItem">
						<div class="header">
							<p class="rank">{{myRankDetail.rank}}</p>
							<div class="headerLeft">
								<img :src="myRankDetail.photo" alt="" class="headerImg" />
								<p class="title">{{myRankDetail.name}}</p>
								<!-- "if_active": 1,//是否7天内活跃：0否，1是 -->
								<p class="tip tip1" v-if="myRankDetail.if_active == 1">活跃</p>
								<p class="tip tip2" v-else>沉闷</p>
							</div>
							<p class="inTime">入团时间:{{myRankDetail.add_date}}</p>

						</div>
					</div>
					<p class="main-title">团队成员状态</p>

					<div class="stateItem" v-for="(item, index) in teamList" :key="index">
						<div class="header">
							<p class="rank">{{item.rank}}</p>
							<div class="headerLeft">
								<img :src="item.photo" alt="" class="headerImg" />
								<p class="title">{{item.name}}</p>
								<!-- "if_active": 1,//是否7天内活跃：0否，1是 -->
								<p class="tip tip1" v-if="item.if_active == 1">活跃</p>
								<p class="tip tip2" v-else>沉闷</p>
							</div>
							<p class="inTime">入团时间:{{item.add_date}}</p>

						</div>
					</div>

					<!-- 加载中 -->
					<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
					<!-- 没有更多了 -->
					<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>

				</div>

			</template>

			<div class="stateCont" v-else>
				<!-- 我的排名 -->
				<div class="stateItem">
					<div class="header">
						<p class="rank">{{myRankDetail.rank}}</p>
						<div class="headerLeft">
							<img :src="myRankDetail.photo" alt="" class="headerImg" />
							<p class="title">{{myRankDetail.name}}</p>
							<!-- "if_active": 1,//是否7天内活跃：0否，1是 -->
							<p class="tip tip1" v-if="myRankDetail.if_active == 1">活跃</p>
							<p class="tip tip2" v-else>沉闷</p>
						</div>
						<p class="inTime">入团时间:{{myRankDetail.add_date}}</p>

					</div>
					<div class="listItem">
						<div>
							<p class="top">商城推广</p>
							<p class="bottomTitle">参与业务</p>
						</div>
						<div>
							<p class="top moneyBg">{{myRankDetail.total_profit}}</p>
							<p class="bottomTitle">业务总收益</p>
						</div>
						<div>
							<p class="top moneyBg">{{myRankDetail.member_profit}}</p>
							<p class="bottomTitle">可提现收益</p>
						</div>
					</div>
				</div>
				<p class="main-title">团队成员收益排名</p>

				<div class="stateItem" v-for="(item, index) in teamList" :key="index">
					<div class="header">
						<p class="rank">{{item.rank}}</p>
						<div class="headerLeft">
							<img :src="item.photo" alt="" class="headerImg" />
							<p class="title">{{item.name}}</p>
							<!-- "if_active": 1,//是否7天内活跃：0否，1是 -->
							<p class="tip tip1" v-if="item.if_active == 1">活跃</p>
							<p class="tip tip2" v-else>沉闷</p>
						</div>
						<p class="inTime">入团时间:{{item.add_date}}</p>

					</div>
					<div class="listItem">
						<div>
							<p class="top">商城推广</p>
							<p class="bottomTitle">参与业务</p>
						</div>
						<div>
							<p class="top moneyBg">{{item.total_profit}}</p>
							<p class="bottomTitle">业务总收益</p>
						</div>
						<div>
							<p class="top moneyBg">{{item.member_profit}}</p>
							<p class="bottomTitle">可提现收益</p>
						</div>
					</div>
				</div>

				<!-- 加载中 -->
				<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
				<!-- 没有更多了 -->
				<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>

			</div>
		</div>

		<bottom :idx="1"></bottom>
	</div>
</template>
<script>
	import bottom from "@/components/bottom";
	export default {
		name: "indexYuan",
		components: {
			bottom,
		},
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				teamId: '',
				photoIMg: require("../../images/header.png"),
				infoDetal: '',
				ifFixed: false,

				itemTeamId: 0,
				itemsTeam: [{
						name: "团队业务",
						id: 0,
						icon: require("../../images/teamyewu.png"),
						iconSelect: require("../../images/teamyewuA.png")
					},
					{
						name: "我的业绩",
						id: 1,
						icon: require("../../images/myYeji.png"),
						iconSelect: require("../../images/myYejiA.png")
					},
					{
						name: "我的团队",
						id: 2,
						icon: require("../../images/teamy.png"),
						iconSelect: require("../../images/teamyA.png")
					}
				],

				categoryId: 0,
				categoryList: [],
				goodsList: [],

				pageSize: 10, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: '',

				ifChange: false,
				yejistatistics: {
					if_team_owner: '', //是否为团长：0否，1是
					all_profit: 0, //团队总收益
					yw_count: 0, //团队业务量（团长）、个人业务量（团员）
					person_all_profit: 0, //个人总收益
				},
				yejiList: [],

				teamstatistics: {
					total_count: 0, //团队总人数
					yx_count: 0, //有效总人数（有推广）
				},
				myRankDetail: '',
				teamList: [],

				itemApplyTitle: [{
					name: "有效人数",
					id: 1,
					icon: require("../../images/teamIcon11.png"),
				}, {
					name: "收益排名",
					id: 2,
					icon: require("../../images/teamIcon12.png"),
				}],
				item3Id: 1,
				teamApllyList: [],


				ifShare: '',
				lock_mem_id: '', // 获取团员加密后的主键id

			};
		},
		mounted() {
			window.leftBack = this.leftBack
			if(typeof android != 'undefined'){
				this.teamId = android.load("teamId")
			}else{
				this.teamId = localStorage.getItem('teamId')
			}
			
			this.userTeamIndex()
			this.getTeamLockMemId()
			this.teamFirstCategory();
			setTimeout(() => {
				this.teamGoodslists()
			}, 1000);
			
		},
		methods: {
			// 主页面返回退出应用
			leftBack(){
				let that = this
				var first = null
				window.leftBack = function(){
					if(!first){
					first = new Date().getTime();
					that.$toast("再按一次退出应用");
					setTimeout(function() {
						first = null;
					}, 1500);
					}else{
					if(new Date().getTime() - first < 1500){
						android.closeWindow();
					}
					}
				}
			},
			userTeamIndex() { // 团队基本信息和推广统计信息
				this.$api.userTeamIndex({
					team_id: this.teamId
				}).then(res => {
					if (res.errno == 0) {
						this.infoDetal = res.data
						if (res.data.photo) {
							this.photoIMg = this.infoDetal.photo
						} else {
							this.photoIMg = require("../../images/header.png")
						}
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},
			// 提现收益
			goTiMoney(money){
				this.$router.push({
					path: '/tiXian',
					query: {
						money: money,
						team_id: this.teamId
					}
				})
			},
			// 加入别人团队的团员才可进行分享
			getTeamLockMemId() { // 团队业务--获取团员加密后的主键id
				this.$api.getTeamLockMemId({
					team_id: this.teamId
				}).then(res => {
					if (res.errno == 0) {
						this.ifShare = 0
						this.lock_mem_id = res.lock_mem_id
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},
			// 切换身份
			changeIdentity() {
				this.$router.replace('/chooseIdentity'); // 进入选择合作社/合作联社页面
			},
			// 切换标题
			clickTeamTab(id) {
				this.ifChange = true
				this.$refs.scrollTopState.scrollTop = 0
				this.itemTeamId = id
				this.goodsList = []
				this.yejiList = []
				this.teamList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''
				if (id == 0) {
					this.teamFirstCategory();
					this.teamGoodslists()
				} else if (id == 1) { // 团队业务
					this.teamProfitStatistics()
					this.teamBusinessLog()
				} else if (id == 2) { // 我的团队
					this.item3Id = 1
					this.teamMemberStatistics()
					this.teamMemberStatus()
				}
			},
			// 我的团队切换
			teamItemSel(id) {
				this.ifChange = true
				this.$refs.scrollTopState.scrollTop = 0
				this.item3Id = id
				this.teamList = []
				this.page = 1
				this.totalNum = 0
				this.totalPage = 1
				this.ifFinish = false
				this.isLoading = true
				this.deviceTip = ''

				this.teamMemberStatus()
			},
			clickGoodTab(id) {
				if (id == this.categoryId) {
					return
				} else {
					this.categoryId = id
					this.ifChange = true
					this.$refs.scrollTopState.scrollTop = 0
					this.page = 1
					this.totalNum = 0
					this.totalPage = 1
					this.ifFinish = false
					this.isLoading = true
					this.deviceTip = ''
					this.goodsList = []
					this.teamGoodslists()
				}
			},
			// 页面滚动
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;
					if (scrollTop > 164) {
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
							if (this.itemTeamId == 0) {
								this.teamGoodslists()
							} else if (this.itemTeamId == 1) {
								this.teamBusinessLog()
							} else if (this.itemTeamId == 2) {
								this.teamMemberStatus()
							}
						}, 1000);
					}
				}
			},
			// 团队业务--团队中供应商城商品分类
			teamFirstCategory() {
				this.$api.teamFirstCategory({
					team_id: this.teamId
				}).then(res => {
					if (res.errno == 0) {
						this.categoryId = res.data[0].assort_id
						this.categoryList = res.data;
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},
			// 团队业务--团队中供应商城商品列表（带分类带搜索）
			teamGoodslists() {
				let data = {}
				data.team_id = this.teamId
				data.assort_id = this.categoryId
				data.page = this.page
				data.size = this.pageSize
				this.$api.teamGoodslists(data).then(res => {
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
						let dataCont = res.data.data
						dataCont.forEach(ele => {
							let arrayPrice = ele.retail_price.split('.')
							ele.priceQian = arrayPrice[0]
							ele.priceHou = arrayPrice[1]
						})
						this.goodsList = this.goodsList.concat(dataCont);
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
						this.goodsList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {

				});

			},
			// 商品详情
			goodDetail(goods_id) {
				this.$router.push({
					path: '/goodsDetails',
					query: {
						id: goods_id,
						ifShare: this.ifShare,
						lock_mem_id: this.lock_mem_id
					}
				})
			},
			// 团队业绩--业务收益统计
			teamProfitStatistics() {
				this.$api.teamProfitStatistics({
					team_id: this.teamId
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.yejistatistics = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},

			// 团队业绩--实时动态
			teamBusinessLog() {
				let data = {}
				data.team_id = this.teamId
				data.page = this.page
				data.size = this.pageSize
				this.$api.teamBusinessLog(data).then(res => {
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
						this.yejiList = this.yejiList.concat(res.data.data);
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
						this.yejiList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {

				});
			},

			// 我的团队--团队人数统计
			teamMemberStatistics() {
				this.$api.teamMemberStatistics({
					team_id: this.teamId
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.teamstatistics = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},

			// 我的团队--团队成员状态
			teamMemberStatus() {
				let data = {}
				data.team_id = this.teamId
				data.page = this.page
				data.size = this.pageSize
				this.$api.teamMemberStatus(data).then(res => {
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
						if (res.data.my_rank) {
							this.myRankDetail = res.data.my_rank
						}
						this.teamList = this.teamList.concat(res.data.data);
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
						this.teamList = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {

				});
			},
		},
	}
</script>
<style lang="less">
	.indexYuan {
		padding-top: 46px;
		overflow-x: hidden;
		overflow-y: auto;
		background: #f0f6fc url(../../images/bgHeader2.png) no-repeat;
		background-size: 100% 200px;

		&.ifFixed {
			background: #f0f6fc url(../../images/bgHeader3Ch.png) no-repeat;
			background-size: 100% 170px;
		}

		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader2.png) no-repeat top center;
			background-size: 100% 200px;

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

		.topCont {
			margin: 15px 10px 25px 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.topLeft {
				display: flex;
				align-items: center;
				position: relative;

				.headerImg {
					position: absolute;
					width: 40px;
					height: 40px;
					border: 2px solid #FFFFFF;
					border-radius: 50%;
				}

				p {
					font-size: 15px;
					line-height: 30px;
					background: #FFFFFF;
					padding: 0 10px 0 26px;
					border-radius: 30px;
					margin-left: 20px;
					display: flex;
					align-items: center;

					img {
						margin-left: 5px;
						height: 15px;
					}

					.tip {
						color: #eeb333;
						font-size: 12px;
						transform: scale(0.9);
						padding: 0 5px;
						line-height: 18px;
						background: linear-gradient(#674e4d 0%, #432e31 100%);
						border-radius: 5px;
					}
				}
			}

			.topRight {
				background: rgba(255, 255, 255, 0.5);
				background-image: url(../../images/down.png);
				background-repeat: no-repeat;
				background-position: calc(100% - 10px) calc(50% - 1px);
				background-size: 8px 5px;
				line-height: 20px;
				padding: 5px 23px 5px 10px;
				border-radius: 30px;
				font-size: 15px;
				max-width: calc(100% - 160px);
			}

		}

		.money {
			display: flex;
			justify-content: space-between;
			margin: 10px 10% 20px 10%;

			div {
				margin-top: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.num {
					font-size: 20px;
					font-weight: bold;
					position: relative;
					font-family: DIN Medium, DIN Medium-Medium;

					&::before {
						position: absolute;
						top: -5px;
						left: calc(100% + 2px);
						content: '';
						width: 100%;
						min-width: 30px;
						height: 10px;
					}
				}

				&:nth-child(1) .num::before {
					background: url(../../images/xiang1.png) no-repeat;
					background-size: auto 10px;
				}

				&:nth-child(2) .num::before {
					background: url(../../images/ren.png) no-repeat;
					background-size: auto 10px;
				}

				&:nth-child(3) .num::before {
					background: url(../../images/ketixian.png) no-repeat;
					background-size: auto 10px;
				}

				.title {
					margin-top: 8px;
				}
			}
		}

		.van-sticky--fixed {
			.van-tabbar {
				border-radius: 10px 10px 0 0;
			}
		}

		.van-tabbar.teamTabbar {
			padding: 15px 0 10px 0;
			height: auto;
			border-radius: 10px 10px 0 0;

			.van-tabbar-item__icon {
				height: 25px;

				img {
					width: 64px;
					height: auto;
				}
			}

		}

		.cateList {
			margin-top: 10px;
			overflow-x: scroll;
			overflow-y: hidden;
			padding-left: 5px;
			position: relative;
			width: calc(100% - 10px);
			// height: 70px;  // 有图标时这个高度
			height: 30px; // 没有图标时这个高度

			&::-webkit-scrollbar {
				// 界面滚动时不显示滚动条
				//width: 0;
				height: 0;
			}

			ul {
				display: inline-flex;
			}

			li {
				float: left;
				width: 62px;
				height: 62px;
				text-align: center;

				img {
					width: 35px;
					height: 35px;
					border-radius: 50px;
				}

				p {
					margin-top: 5px;
					color: #444444;
					line-height: 20px;
					display: inline-block;

					&.active {
						background: #3B6AF1;
						color: #FFFFFF;
						padding: 0 6px;
						border-radius: 40px;
					}
				}
			}
		}

		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0;
		}

		.content {
			position: relative;

			&::before {
				position: absolute;
				content: '';
				top: 0;
				left: 0;
				width: 100%;
				height: 100px;
				background: linear-gradient(#ffffff 30%, #f0f6fc 100%);
			}
		}

		.contTotal {
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			margin: 0 10px;
			border-radius: 10px;
			height: 95px;
			display: flex;
			justify-content: space-around;
			color: #FFFFFF;
			position: relative;

			.logoBg {
				position: absolute;
				top: 0;
				right: 0;
				height: 95px;
			}

			.xiexianBg {
				position: absolute;
				left: 0;
				bottom: 0;
				max-width: 290px;
			}

			div {
				margin-top: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;

				.num {
					font-size: 20px;
					font-weight: bold;
					font-family: DIN Medium, DIN Medium-Medium;
					position: relative;

					&::before {
						position: absolute;
						top: -5px;
						left: calc(100% + 2px);
						content: '';
						min-width: 30px;
						height: 10px;
					}

					.totalNum {
						color: #A6C2FF;
					}
				}

				.title {
					margin-top: 12px;
				}

			}

			.yejiDiv {

				&:nth-of-type(1) .num::before {
					background: url(../../images/xiang.png) no-repeat;
					background-size: auto 10px;
				}

				&:nth-of-type(2) .num::before {
					background: url(../../images/yuan.png) no-repeat;
					background-size: auto 10px;
				}

			}

			.teamDiv .num::before {
				background: url(../../images/ren1.png) no-repeat;
				background-size: auto 10px;
			}

		}

		// 团队成员状态
		.stateCont,
		.yejiCont {
			margin: 15px 10px;
			position: relative;

			.main-title {
				margin-top: 10px;
				font-size: 15px;
			}
		}

		// 团队业务
		.imgCont {
			margin: 0 10px;
			background: #E0E4F8;
			height: 60px;
			border-radius: 60px;
			position: relative;
			overflow: hidden;

			.topBg {
				position: absolute;
				right: 0;
				top: 0;
				height: 60px;
			}

			.topImg {
				position: absolute;
				right: 30px;
				top: 22px;
				height: 17px;
			}

			.leftImg {
				position: absolute;
				left: 20px;
				bottom: 0;
				height: 55px;
			}
		}

		.shopCont {
			margin: 0 10px 30px 10px;
			display: flex;
			flex-wrap: wrap;

			.shop {
				border-radius: 10px;
				margin-top: 10px;
				width: calc(50% - 5px);

				&:nth-child(2n) {
					margin-left: 10px
				}

				.img-cont {
					text-align: center;
					border-radius: 10px;
					overflow: hidden;
					position: relative;
					height: 0;
					padding-bottom: 100%;
					background: #FFFFFF;

					&::after {
						position: absolute;
						content: '';
						left: 15px;
						right: 15px;
						bottom: 0;
						height: 1px;
						background: #F0F6FC;
					}

					.saleNum {
						position: absolute;
						top: 0;
						left: 0;
						z-index: 1;
						color: #444444;
						line-height: 22px;
						padding: 0 10px;
						background: linear-gradient(#d4e2f0 0%, #eaf2f9 100%);
						border-radius: 10px 0px 10px 0px;
					}

					.shop-img {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						max-width: calc(100% - 30px);
						max-height: calc(100% - 30px);
					}
				}

				.bottom-cont {
					background: #FFFFFF;
					border-radius: 10px;
					padding: 10px;

					.name,
					.from {
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.name {
						color: #444444;
						font-size: 15px;
					}

					.from {
						color: #9AA8B6;
						margin-top: 5px;
					}
				}

				.price-cont {
					margin-top: 10px;
					display: flex;
					justify-content: space-between;
					align-items: center;

					.price {
						color: #FF3371;
						font-size: 15px;
						font-weight: bold;
					}

					.new {
						font-size: 12px;
					}

					.old {
						font-size: 12px;
						color: #D4E2F0;
						text-decoration: line-through;
					}

					.cartCont {
						padding: 0 5px;
						color: #FFFFFF;
						white-space: nowrap;
						height: 20px;
						line-height: 20px;
						background: url(../../images/bgBtn.png);
						background-size: 100% 20px;

						img {
							height: 20px;
						}


					}
				}

			}
		}

		// 团队业绩item
		.yejiItem {
			margin-top: 10px;
			background: #FFFFFF;
			border-radius: 10px;

			.header {
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding: 10px;
				border-bottom: 1px solid #F0F6FC;

				.peoplePic,
				.goodsPic {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					border: 2px solid #F0F7FC;
				}

				.cartLine {
					height: 25px;
				}
			}

			.listItem {
				padding: 10px;
				display: flex;
				justify-content: space-between;

				div {
					display: flex;
					align-items: center;

					.title {
						margin-left: 5px;
						font-size: 13px;
						color: #9AA8B6;
					}

					img {
						height: 20px;
					}
				}
			}
		}

		.teamTitle {
			position: relative;
			display: flex;
			justify-content: space-around;
			text-align: center;
			margin-bottom: 10px;

			.item {
				&.active {
					p {
						color: #5B646C;
						background: #F0F6FC;
					}
				}
			}

			img {
				width: 35px;
				height: 35px;
			}

			p {
				margin-top: 5px;
				line-height: 20px;
				color: #9AA8B6;
				padding: 0 8px;
				border-radius: 30px;
			}
		}

		// 我的团队item
		.stateItem {
			margin-top: 10px;
			background: #FFFFFF;
			border-radius: 10px;

			.header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 10px 10px 10px 46px;
				border-bottom: 1px solid #F0F6FC;
				position: relative;

				.rank {
					position: absolute;
					top: 0;
					left: 12px;
					font-size: 13px;
					background: #F0F6FC;
					min-width: 15px;
					padding: 0 5px;
					height: 20px;
					padding-top: 13px;
					text-align: center;
					border-radius: 0 0 30px 30px;
				}

				.headerLeft {
					display: flex;
					align-items: center;



					.headerImg {
						width: 20px;
						height: 20px;
						border-radius: 50%;
					}

					.title {
						font-size: 14px;
						margin-left: 5px;
					}

					.tip {
						line-height: 16px;
						padding: 0 5px;
						border-radius: 14px;
						margin-left: 5px;

						&.tip1 {
							color: #3B6AF1;
							background: #e2f4ff;
							border: 1px solid #3b6af1;
						}

						&.tip2 {
							color: #9AA8B6;
							background: #F0F6FC;
							border: 1px solid #D9E1E9;
						}
					}
				}

				.inTime {
					color: #9AA8B6;
				}

			}

			.listItem {
				display: flex;
				justify-content: space-around;

				div {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					padding: 15px 0;

					.top {
						font-size: 14px;
						color: #444444;

						&.moneyBg {
							position: relative;

							&::before {
								position: absolute;
								top: -5px;
								left: calc(100% + 2px);
								content: '';
								min-width: 30px;
								height: 10px;
								background: url(../../images/yuan1.png) no-repeat;
								background-size: auto 10px;
							}
						}
					}

					.bottomTitle {
						margin-top: 6px;
						color: #9AA8B6;
					}
				}
			}
		}

		.van-loading,
		.noMore {
			padding: 10px 0;
			text-align: center;
			height: 40px;
			line-height: 40px;
		}

	}
</style>
