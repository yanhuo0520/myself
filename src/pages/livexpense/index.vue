<template>
	<div class="livexpense" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="生活缴费" left-arrow fixed @click-left="leftBack" />
		<div class="gridCont">
			<img src="../../images/huafeiTitle.png" alt="" class="titleImg" />
			<div class="groupCont">
				<p class="title">电话号码</p>
				<van-field v-model="phone" type="number" clearable :class="ifIn? 'ifIn' : ''" placeholder="请输入电话号码"
					@input="ifIn = true" @blur="ifIn = false">
					<template #right-icon>
						<img src="../../images/person7.png" class="rightIcon" />
					</template>
				</van-field>
			</div>
			<ul>
				<li :class="saleId == item.id ? 'active': ''" v-for="(item, index) in moneyItem" :key="index" @click="saleId = item.id">
					<p class="realMoney"><span>{{item.showMoney}}</span>元</p>
					<p class="saleMoney">售价{{item.saleMoney}}元</p>
				</li>
			</ul>
			<van-button round block type="info" @click="goPayLive()">立即充值</van-button>
			

		</div>
		<div class="gridCont">
			<img src="../../images/liveTitle.png" alt="" class="titleImg" />
			<van-grid class="grid" :border="false" :column-num="4">
				<van-grid-item v-for="(item2, index2) in gridItem" :key="index2" @click="goPayLive(item2.path)">
					<img :src=item2.icon alt="" />
					{{item2.name}}
				</van-grid-item>
			</van-grid>
		</div>
		
	</div>
</template>
<script>
	export default {
		name: "livexpense",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				phone: '',
				ifIn: false,
				saleId: 1,
				moneyItem:[{
					id: 1,
					showMoney: 30,
					saleMoney: 29.8
				},{
					id: 2,
					showMoney: 50,
					saleMoney: 49
				},{
					id: 3,
					showMoney: 100,
					saleMoney: 98
				},{
					id: 4,
					showMoney: 200,
					saleMoney: 198
				},{
					id: 5,
					showMoney: 300,
					saleMoney: 298
				},{
					id: 6,
					showMoney: 500,
					saleMoney: 498
				}],
				gridItem: [{
						name: "水费",
						icon: require("../../images/liveShui.png"),
						// path: "/accountIndex",
					},
					{
						name: "电费",
						icon: require("../../images/liveDian.png"),
					},
					{
						name: "燃气费",
						icon: require("../../images/liveRan.png"),
					},
					{
						name: "暖气费",
						icon: require("../../images/liveNuan.png"),
					},
					{
						name: "固话宽带",
						icon: require("../../images/liveHua.png"),
					},
					{
						name: "有线电视",
						icon: require("../../images/liveWifi.png"),
					},
					{
						name: "物业费用",
						icon: require("../../images/liveWu.png"),
					},
				],
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			if(typeof android != 'undefined'){
				this.phone = android.load("phone")
			}else{
				this.phone = localStorage.getItem('phone')
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			goPayLive(path){
				this.$toast("暂未开放，敬请期待")
			}
			
		}
	}
</script>
<style lang="less">
	.livexpense {
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
		.gridCont {
			margin: 10px 10px 0 10px;
			padding: 10px 0;
			background: #FFFFFF;
			border-radius: 10px;

			.titleImg {
				height: 19px;
				margin: 5px 0 0 15px;
			}
			.groupCont{
				.title {
					margin: 15px 0 0 15px;
					color: #9AA8B6;
				}
				input:-ms-input-placeholder {
					color: #444444;
					font-size: 12px;
				}

				::-webkit-input-placeholder {
					color: #444444;
					font-size: 12px;
				}
				.van-cell {
					background: transparent;

					&::after {
						border: none;
					}

					&.ifIn {
						.van-field__value {
							border-bottom: 1px solid #3B6AF1;
						}
					}

					.rightIcon{
						width: 15px;
						height: 15px;
					}

					.van-field__value {
						border-bottom: 1px solid #F0F6FC;

						input {
							line-height: 32px;
							font-family: DIN, DIN-Medium;
							font-size: 20px;
						}
					}

				}
			}

			ul{
				margin: -10px 10px 0 10px;
				padding: 5px 0;
				display: flex;
				flex-wrap: wrap;
				li{
					justify-content: space-between;
					color: #9AA8B6;
					padding: 10px 0;
					line-height: 18px;
					width: calc(33.333% - 15px);
					max-width: 95px;
					text-align: center;
					border-radius: 5px;
					background: #F0F6FC;
					border: 1px solid #F0F6FC;
					margin: 10px 5px 0 5px;
					&.active{
						background: #E2F4FF;
						border: 1px solid #3b6af1;
						.realMoney{
							color: #3B6AF1;
						}
					}
					.realMoney{
						color: #444444;
						span{
							font-size: 18px;
							font-weight: bold;
						}
					}
				}
			}
			.van-button--info {
				margin: 15px;
				width: calc(100% - 30px);
				height: 38px;
				background: #3B6AF1;
				border: 1px solid #3B6AF1;
			}
			.grid {
				.van-grid-item {
					width: 25%;

					img {
						width: 53px;
					}
				}

				.van-grid-item__content {
					padding: 10px 5px;
				}
			}
		}


	}
</style>
