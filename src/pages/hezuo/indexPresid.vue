<template>
	<div class="hezuoIndexPresid">
		<van-nav-bar title="合作经济" fixed />
		<div class="topCont">
			<div class="topLeft">
				<img :src="photoIMg" alt="" class="headerImg" />
				<p>{{userName}} <span class="tip">{{organIdentity}}</span> </p>
			</div>
			<p class="topRight" @click="changeIdentity">{{organName}}</p>
		</div>
		<!-- 资金溢出问题改成横向展示，不要k w 转换了 -->
		<!-- <div class="money">
			<div> 
				<p class="num">{{$formatNumber(indexData.total_money)}}</p>
				<p class="title">互助金总额</p>
			</div>
			<div> 
				<p class="num">{{$formatNumber(indexData.bonus_money)}}</p>
				<p class="title">互助金收益</p>
			</div>
			<div> 
				<p class="num">{{$formatNumber(indexData.stock_all_profit)}}</p>
				<p class="title">股金分红</p>
			</div>
		</div> -->
		<!-- 已废弃 -->
		<!-- 	<div class="moneyCont">
			<van-cell title="互助金总额" :value="indexData.total_money + '元'">
				<template #icon>
					<img class="img-icon" src="../../images/qian10.png" />
				</template>
			</van-cell>
			<van-cell title="互助金收益" :value="indexData.bonus_money + '元'">
				<template #icon>
					<img class="img-icon" src="../../images/qian11.png" />
				</template>
			</van-cell>
			<van-cell title="股金分红" :value="indexData.stock_all_profit + '元'">
				<template #icon>
					<img class="img-icon" src="../../images/qian12.png" />
				</template>
			</van-cell>
		</div> -->
		<div class="jieCont">
			<img src="../../images/light3.png" alt="" class="bgTop" />
			<img src="../../images/logoBg.png" alt="" class="bgLogo" />
			<img src="../../images/xiexianBg.png" alt="" class="bgBottom" />
			
			<p class="maxEdu">{{indexData.total_money}}</p>
			<div class="jieDesc">
				<div class="item">
					<p class="num">{{indexData.bonus_money}}</p>
					<p class="title">互助金收益</p>
				</div>
				<div class="item">
					<p class="num">{{indexData.stock_all_profit}}</p> 
					<!-- 累计股金分红 -->
					<p class="title">股金分红</p>
				</div>
			</div>
			<p class="btn" @click.stop="$router.push('/shouyiTi')">收益提取</p>
		</div>
		<!-- 信用互助业务 -->
		<div class="gridCont">
			<img src="../../images/xinyong_text.png" alt="" class="titleImg" />
			<van-grid class="grid" :border="false" :column-num="4">
				<van-grid-item v-for="(item1, index1) in gridXinyong" :key="index1" @click="goOther(item1.path)">
					<img :src=item1.src alt="" />
					{{item1.name}}
				</van-grid-item>
			</van-grid>
		</div>

		<!-- 其他业务 -->
		<div class="gridCont">
			<img src="../../images/other_text.png" alt="" class="titleImg" />
			<van-grid class="grid" :border="false" :column-num="4">
				<van-grid-item v-for="(item2, index2) in gridOther" :key="index2" @click="goOther(item2.path)">
					<img :src=item2.src alt="" />
					{{item2.name}}
				</van-grid-item>
			</van-grid>
		</div>

		<div class="imgCont">
			<div class="left">
				<img src="../../images/hezuobg.png" alt="" class="topBg" />
				<img src="../../images/shop_text.png" alt="" class="topImg" />
				<img src="../../images/jiantou3.png" alt="" class="leftImg" />
				<img src="../../images/shopPic.png" alt="" class="rightImg" />
			</div>
			<div class="right">
				<img src="../../images/hezuobg.png" alt="" class="topBg" />
				<img src="../../images/baoxian_text.png" alt="" class="topImg" />
				<img src="../../images/jiantou4.png" alt="" class="leftImg" />
				<img src="../../images/baoxianPIc.png" alt="" class="rightImg" />
			</div>
		</div>
		<bottom :idx="1"></bottom>

	</div>
</template>
<script>
	import bottom from "@/components/bottom";
	export default {
		name: "hezuoIndexPresid",
		components: {
			bottom,
		},
		data() {
			return {
				userName: '',
				organName: '',
				organIdentity: '',
				cooperaId: '',
				photoIMg: require("../../images/header.png"),
				indexData: {
					total_money: 0,
					bonus_money: 0,
					stock_all_profit: 0,
					stock_money: 0
				},
				gridXinyong: [{
						name: "互助金存入",
						src: require("../../images/huzhuIn.png"),
						path: "/huzhuIn",
					},
					{
						name: "互助金提取",
						src: require("../../images/huzhuOut.png"),
						path: "/huzhuTi"
					},
					{
						name: "互助金转账",
						src: require("../../images/huzhuChange.png"),
						path: "1001"
					},
					{
						name: "我的股金",
						src: require("../../images/mygujin.png"),
						path: "1002"
					},
				],
				gridOther: [{
						name: "我要借款",
						src: require("../../images/myJie.png"),
						path: "/presidentJie",
					},
					{
						name: "我要还款",
						src: require("../../images/myHuan.png"),
						path: "/presidentHuan",
					},
					{
						name: "我要担保",
						src: require("../../images/mydan.png"),
						path: "/presidentDan",
					}
				],
				show: false,


			};
		},
		mounted() {
			window.leftBack = this.leftBack
			if(typeof android != 'undefined'){
				this.userName = android.load("userName")
				this.organName = android.load("organName")
				this.organIdentity = android.load("organIdentity")
				this.cooperaId = android.load("cooperaId")
			}else{
				this.userName = localStorage.getItem('userName')
				this.organName = localStorage.getItem('organName')
				this.organIdentity = localStorage.getItem('organIdentity')
				this.cooperaId = localStorage.getItem('cooperaId')
			}
			this.passbookIndex()
			// 获取头像
			this.$api.userInfo().then(res => {
				if (res.errno == 0) {
					if (res.data.photo) {
						this.photoIMg = res.data.photo
					} else {
						this.photoIMg = require("../../images/header.png")
					}
				} 
			}).catch(err => {

			})

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
			goOther(path) {
				if(path == 1001){
					this.$router.push({
						path: '/huzhuZhuan',
						query: {
							money: this.indexData.can_out_money
						}
					})
				}else if(path == 1002){
					this.$router.push({
						path: '/myGujin',
						query: {
							id: this.cooperaId, // 合作社Id
							gujin: this.indexData.stock_money,

						}
					})
				} else {
					this.$router.push(path);
				}
			},
			// 切换身份
			changeIdentity() {
				this.$router.replace('/chooseIdentity'); // 进入选择合作社/合作联社页面
			},
			// 互助金--互助金存入首页（返回参数去掉银行卡列表，加上定期、收益账户）
			passbookIndex() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.passbook_index({}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.indexData = res.data

					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
		},
	}
</script>
<style lang="less">
	.hezuoIndexPresid {
		padding-top: 46px;
		min-height: calc(100% - 46px);
		background: #f0f6fc url(../../images/bgHeader2.png) no-repeat;
		background-size: 100% 200px;

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
			position: relative;

			.topLeft {
				display: flex;
				align-items: center;

				.headerImg {
					position: absolute;
					width: 40px;
					height: 40px;
					background: #ffffff;
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

		// 已废弃
		// .money {
		// 	display: flex;
		// 	justify-content: space-between;
		// 	margin: 10px 5% 20px 5%;
		// 	div {
		// 		margin-top: 10px;
		// 		display: flex;
		// 		align-items: center;
		// 		justify-content: center;
		// 		flex-direction: column;
		// 		padding: 0 5px;
		// 		.num {
		// 			font-size: 20px;
		// 			font-weight: bold;
		// 			position: relative;
		// 			font-family: DIN Medium, DIN Medium-Medium;

		// 			&::before {
		// 				position: absolute;
		// 				top: -8px;
		// 				left: 100%;
		// 				content: '';
		// 				width: 15px;
		// 				height: 10px;
		// 				background: url(../../images/yuan1.png) no-repeat;
		// 				background-size: auto 10px;
		// 			}
		// 		}

		// 		.title {
		// 			margin-top: 12px;
		// 		}
		// 	}
		// }
		// 已废弃
		// .moneyCont{
		// 	margin: 0 10px;
		// 	border-radius: 10px;
		// 	padding: 6px 0;
		// 	background: #ffffff;
		// 	.van-cell{
		// 		padding: 6px 16px;
		// 		&::after{
		// 			border-bottom: none;
		// 		}
		// 		&:first-child{
		// 			border-radius: 10px 10px 0 0;
		// 		}
		// 		&:last-child{
		// 			border-radius: 0 0 10px 10px;
		// 		}
		// 	}
		// 	.img-icon{
		// 		height: 15px;
		// 		margin: 4px 5px 0 0;
		// 	}
		// 	.van-cell__title{
		// 		flex: 0.45;
		// 	}
		// 	.van-cell__value{
		// 		color: #9AA8B6;
		// 	}
		// }
		.jieCont {
			margin: 0 10px;
			padding: 35px 0 15px 0;
			text-align: center;
			border-radius: 15px 15px 0 0;
			background: linear-gradient(-35deg, #3b6af1 0%, #5a94ff 100%);
			color: #FFFFFF;
			position: relative;
			overflow: hidden;
			height: 130px;

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
					background: url(../../images/huzhuyuan.png) no-repeat;
					background-size: auto 10px;
				}
			}

			.jieDesc {
				margin-top: 25px;
				display: flex;
				justify-content: space-around;

				.item {
					position: relative;
					width: 50%;

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
							background: url(../../images/yuan.png) no-repeat;
							background-size: auto 10px;
						}
					}

					.title {
						margin-top: 5px;
						color: #B2CAFF;
					}
				}
			}
			.btn{
				position: absolute;
				bottom: 10px;
				left: 15%;
				color: #3B6AF1;
				background: #ffffff;
				border-radius: 30px;
				width: 70%;
				font-size: 15px;
				line-height: 34px;
			}

		}

		.gridCont {
			margin: 10px 10px 0 10px;
			padding: 10px 0;
			background: #FFFFFF;
			border-radius: 10px;

			.titleImg {
				height: 19px;
				margin: 5px 0 0 15px;
			}

			.grid {
				.van-grid-item {
					width: 25%;

					img {
						width: 53px;
						margin-bottom: 5px;
					}
				}

				.van-grid-item__content {
					padding: 10px 5px;
				}
			}
		}

		.imgCont {
			display: flex;
			justify-content: space-between;
			margin: 15px 10px 30px 10px;

			.left,
			.right {
				width: calc(50% - 5px);
				height: 120px;
				background: #ffffff;
				padding: 15px;
				position: relative;

				.topBg {
					position: absolute;
					right: 0;
					top: 0;
					height: 135px;
				}

				.topImg {
					height: 35px;
				}

				.leftImg {
					position: absolute;
					left: 15px;
					bottom: 25px;
					height: 15px;
				}

				.rightImg {
					position: absolute;
					right: 10px;
					bottom: 5px;
					width: 73px;
				}
			}

			.left {
				background: #E0E4F8;
			}

			.right {
				background: #FAE8DA;
				margin-left: 10px;
			}
		}

	}
</style>
