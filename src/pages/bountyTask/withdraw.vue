<template>
	<div class="withDraw" >
		<van-nav-bar :border="false"  title="立即提现" left-arrow @click-left="leftBack"/>
		<div class="header">
			<van-cell  title="到账账户" value="内容" is-link>
				<div class="choose-con" @click="showSelectBankPopup">
					<template v-if="bankInfo && bankInfo.bank_type">
						<div class="bank-icon" >
							<template v-if="bankInfo.open_bank_letter">
								<img :src="'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/bankIcon/small_logo/'+bankInfo.open_bank_letter+'.png'" alt="">
							</template>
							<template v-else>
								<template v-if="bankInfo.bank_type == 'coop'">
									<img width="22px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
								</template>
								<template v-if="bankInfo.bank_type == 'wx'">
									<img width="20px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/wx-logo.png" alt="">
								</template>
							</template>
						</div>
						<span class="bank-name">{{bankInfo.open_bank}} <span v-if="bankInfo.open_bank_letter">{{bankInfo.bank_type}} ({{bankInfo.bank_short_num}})</span></span>
					</template>
					<template v-else>
						正在获取银行卡...
					</template>
				</div>
			</van-cell>
		</div>
		<div class="withdraw-con">
            <div class="tit">提现金额</div>
            <div class="price-input" @click="clickShowKey">
                <span class="icon">￥</span>
                <template>
                    <div class="input">
                        <span class="price" v-if="price">{{price}}</span>
                        <span v-else class="desc">提现将到账至{{bankInfo.open_bank}}</span>
                        <span v-if="show" class="cursor-blink"></span>
                    </div>
                </template>
                <div class="clear-con" v-if="show && price" @click="clearInput">
                    <van-icon name="clear" ></van-icon>
                </div>
                <div class="btn" @click.stop="maxPriceClick">全部提现</div>
            </div>
            <div class="input-desc">可提现金额：{{balance}}</div>
            <div class="btn-con" :class="{'opacity-6': Number(price) <= 0}" @click="withDrawSubmit">立即提现</div>
        </div>
        <van-number-keyboard
                v-model="price"
                :show="show"
                theme="custom"
                extra-key="."
                close-button-text="提现"
                @blur="keyBlur"
                @input="keyInput"
                @delete="keyDel"
                @close="withDrawSubmit"
            >
            <template #title-left>
                <div class="down-con" @click="show = false">
                    <van-icon name="arrow-down" ></van-icon>
                </div>
            </template>
        </van-number-keyboard>

		 <van-popup class="type-popup-con" v-model="isShowTypePopup" round position="bottom"  style="min-height:60%;max-height:60%" >
            <div class="type-popup">
                <div class="type-popup-tit">
                    <div class="tit">选择到账账户</div>
                    <div class="close-con" @click="isShowTypePopup = false">
                        <van-icon name="close" size="20px"/>
                    </div>
                </div>
                <van-radio-group v-model="bankInfo.bank_id">
                    <van-cell-group class="type-group">
                        <van-cell :title="item.open_bank+ ' '+ item.bank_type+' ('+item.bank_short_num+')'" clickable v-for="(item, index) in bankOption" :key="index" @click="selectType(item)">
                            <template #title>
								<span >{{item.open_bank}} <span v-if="item.bank_type != 'wx' && item.bank_type != 'coop'">{{item.bank_type}} ({{item.bank_short_num}})</span></span>
							</template>
							<template #icon>
								<div class="bank-icon" >
									<template v-if="item.open_bank_letter">
										<img :src="'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/bankIcon/small_logo/'+item.open_bank_letter+'.png'" alt="">
									</template>
									<template v-else>
										<template v-if="item.bank_type == 'coop'">
											<img width="22px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
										</template>
										<template v-if="item.bank_type == 'wx'">
											<img width="20px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/wx-logo.png" alt="">
										</template>
									</template>
								</div>
							</template>
							<template #right-icon>
								<van-radio :name="item.bank_id" />
							</template>
							<template #default>
								<span v-if="item.bank_type"></span>
							</template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
        </van-popup>
	</div>
</template>
<script>
	export default {
		name: "withDraw",
		data() {
			return {
				show: true,
                price: '',
				balance: 0,
				isShowTypePopup: false,
				bankInfo: {
					bank_type: '',
					bank_num: '',
					bank_short_num: '',
					open_bank_letter: '',
					open_bank: '',
					bank_id: ''
				},
				bankOption: []
			};
		},
		mounted() {
			window.leftBack = this.leftBack
			this.getBankList()
			this.getBalance()
		},
		methods: {
			// 返回
			leftBack () {
				this.$router.go(-1)
			},
			// 跳转路由
			toRouter (path) {
				this.$router.push(path)
			},
			// 获取我的银行卡列表
			getBankList() {
				this.bankOption = []
				let tmpArr = [{
					open_bank_letter: '',
					open_bank: '社内账户',
					bank_type: 'coop',
					bank_num: '',
					bank_id: 'coop'
				},{
					open_bank_letter: '',
					open_bank: '微信账户',
					bank_type: 'wx',
					bank_num: '',
					bank_id: 'wx'
				}]
				this.$api.rewardUserBank().then(res => {
					// substr(-4)
					if (res.errno == 0) {
						// res.data = [{
						// 	open_bank_letter: 'CCB',
						// 	open_bank: '建设银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7650',
						// 	bank_id: 1
						// },{
						// 	open_bank_letter: 'ABC',
						// 	open_bank: '农业银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7651',
						// 	bank_id: 2
						// },{
						// 	open_bank_letter: 'ICBC',
						// 	open_bank: '工商银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7652',
						// 	bank_id: 3
						// },{
						// 	open_bank_letter: 'SPDB',
						// 	open_bank: '浦发银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7653',
						// 	bank_id: 4
						// },{
						// 	open_bank_letter: 'HNRCU',
						// 	open_bank: '农商银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7654',
						// 	bank_id: 5
						// },{
						// 	open_bank_letter: 'COMM',
						// 	open_bank: '交通银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7655',
						// 	bank_id: 6
						// },{
						// 	open_bank_letter: 'CCB',
						// 	open_bank: '建设银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7656',
						// 	bank_id: 7
						// },{
						// 	open_bank_letter: 'CCB',
						// 	open_bank: '建设银行',
						// 	bank_type: '借记卡',
						// 	bank_num: '7657',
						// 	bank_id: 8
						// }]
						
						if (res.data && res.data.length > 0) {
							res.data.forEach(item =>{
								item.bank_short_num = item.bank_num.substr(-4)
							})
							this.bankOption = tmpArr.concat(res.data)
						} else {
							this.bankOption = tmpArr
						}
					} else {
						this.bankOption = tmpArr
						// this.$toast(res.errmsg)
					}
					this.bankInfo = JSON.parse(JSON.stringify(this.bankOption[0]))
				}).catch(err => {
					this.bankOption = tmpArr
					this.bankInfo = JSON.parse(JSON.stringify(this.bankOption[0]))
					this.$toast('服务异常,请稍后重试')
				})
			},
			// 获取可提现金额
			getBalance() {
				this.balance = 0
				this.$api.userReDetail().then(res => {
					if (res.errno == 0) {
						this.balance = Number(res.data.account)
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast('服务异常,请稍后重试')
				})
			},
			// 自定义键盘输入事件
			keyInput(val) {
				let str = val+''
				if(this.price == '') {
					if(val == '.') {
						this.$toast('第一位禁止为.')
						setTimeout(() =>{
							this.price = ''
						})
						return
					}
				} else {
					if(this.price === '0') {
						if(val == 0) {
							this.$toast('第二位禁止为0')
							setTimeout(() =>{
								this.price = '0'
							})
							return ''
						}
					}

					if(val == '.') {
						let lastPrice = JSON.parse(JSON.stringify(this.price))
						if(this.price.indexOf('.') > 0) {
							// this.$toast('第一位禁止为.')
							setTimeout(() =>{
								this.price = lastPrice
							})
							return
						}
						
					}
					let tmpArr = this.price.split('.')
					if(tmpArr && tmpArr.length > 1) {
						if(tmpArr[1].length > 1) {
							let lastPrice = JSON.parse(JSON.stringify(this.price))
							setTimeout(() =>{
								this.price = lastPrice
							})
						}
					}
				
				}
				

				let lastPrice2 = JSON.parse(JSON.stringify(this.price))
				setTimeout(() =>{
					if(Number(this.balance) <= 0) {
						this.price = ''
						this.$toast('可提现金额为0')
						return
					}
					if(Number(this.price) > Number(this.balance)) {
						this.price = lastPrice2
						this.$toast('最大可提现额度为'+this.balance+'元')
						return
					}
					// if(Number(this.price) <= 0) {
					// 	this.price = ''
					// 	this.$toast('最低提现1元')
					// 	return
					// }
					

					if(str.length > 0) {
						document.querySelector(".cursor-blink").style.position = 'relative'
						document.querySelector(".cursor-blink").style.left="0px";  
						if(Number(this.price) > 0) {
							document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="1"; 
						} else {
							document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="0.6"; 
						}
					} else {
						document.querySelector(".cursor-blink").style.position = 'absolute'
						document.querySelector(".cursor-blink").style.left="0px";  
						document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="0.6";
					}
					
				})
				

			},
			// 自定义键盘失去焦点
			keyBlur() {

			},
			// 点击显示自定义键盘
			clickShowKey() {
				if(!this.show) {
					this.show = true
					setTimeout(() =>{
						if(this.price) {
							document.querySelector(".cursor-blink").style.position = 'relative'
						} else {
							document.querySelector(".cursor-blink").style.position = 'absolute'
						}
						document.querySelector(".cursor-blink").style.left="0px"; 
					})
				}
			},
			// 自定义键盘删除事件
			keyDel() {
				if(this.price.length == 1) {
					document.querySelector(".cursor-blink").style.position = 'absolute'
					document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="0.6"
				}
				setTimeout(() =>{
					if(Number(this.price) <= 0) {
						document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="0.6"
					} else {
						document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="1"
					}
				})
			},
			// 清空输入金额
			clearInput() {
				this.price = ''
				document.querySelector(".cursor-blink").style.position = 'absolute'
				document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="0.6"
			},
			// 全部提现按钮,回显最大提示金额
			maxPriceClick() {
				if(this.balance <=0) {
					this.price = ''
					this.$toast('可提现金额为0')
				} else {
					this.price = JSON.stringify(this.balance)
					document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="1"
				}
				this.show = false
			},
			// 提现
			withDrawSubmit() {
				let that = this;
				if (!this.bankInfo || !this.bankInfo.bank_id) {
					this.$toast('请先选择到账账户!')
					return
				}
				if(!this.price) {
					this.$toast('请先输入提现金额')
					return
				}
				if(this.price) {
					if(Number(this.price) <= 0) {
						this.$toast('提现金额必须大于0')
						return
					}
					this.price = Number(this.price)+''
					this.$toast.loading({
						message: '提现中...',
						duration: 0, // 持续展示 toast
						forbidClick: true,
					});
					let cls = ''
					if (this.bankInfo.bank_id == 'wx') {
						cls = 1
					} else if (this.bankInfo.bank_id == 'coop') {
						cls = 3
					} else {
						cls = 2
					}
					this.$api.rewardWithdrawal({
						money: this.price,
						cls: cls,
						bank_card: cls == 2 ? this.bankInfo.bank_num : ''
					}).then(res => {
						this.$toast.clear();
						if (res.errno == 0) {
							if (cls == 2) {
								this.$toast('已提交平台审核,请等待')
							} else {
								this.$toast('提现成功')
							}
							this.balance = (Number(this.balance)*1000 - Number(this.price)*1000)/1000
							// this.getBalance()
							this.price = ''
							if(document.querySelector(".cursor-blink")){
								document.querySelector(".cursor-blink").style.position = 'absolute'
								document.querySelector(".cursor-blink").style.left="0px";  
							}
							document.querySelector(".van-number-keyboard__sidebar .van-key__wrapper .van-key--blue ").style.opacity="0.6"; 
						} else {
							this.$toast(res.errmsg)
						}
					}).catch(err => {
						this.$toast('服务异常,请稍后重试')
					})
				} 
			},
			// 显示选择银行卡弹窗
			showSelectBankPopup () {
				this.isShowTypePopup = true
			},
			// 选择银行卡
            selectType (row) {
                this.bankInfo = row
                this.isShowTypePopup = false
            },
		},


	}
</script>
<style lang="less">
	.withDraw {
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
		}
		.header {
			margin: 20px 15px;
			.van-cell {
				border-radius: 6px;
			}
			.van-cell__title {
				flex: none;
				width: 60px;
				font-size: 0.34rem;
			}
			.choose-con {
				display: flex;
				.bank-icon {
					display: flex;
					align-items: center;
				}
				.bank-name {
					font-weight: bold;
					color: #333;
					font-size: 0.36rem;
				}
			}
		}
		.withdraw-con { 
			position: relative; 
			width: calc(100% - 32px); 
			border-radius: 10px; 
			background: #fff; 
			margin-left: 16px; 
			padding: 20px;
			.tit { 
				color: #333; 
				font-size: 0.35rem; 
			}
			.input-desc { 
				color: #888888; 
				font-size: 0.33rem;
			}
			.btn-con { 
				width: 100%; 
				height: 1.1rem; 
				line-height: 1.1rem; 
				color: #fff;
				background: #1989fa;
				border-radius: 1000px; 
				text-align: center; 
				margin-top: 0.6rem; 
				margin-bottom: 0.2rem; 
			}
			.btn-con:active {
				opacity: .6;
			}
		}
        .price-input { 
			padding: 8px 0; 
			display: flex; 
			align-items: center;
			.icon { 
				font-size: 0.35rem; 
				font-weight: bold; 
			}
			.input { 
				display: flex; 
				align-items: center; 
				height: 40px; 
				position: relative; 
				flex: 1; 
				overflow-y: hidden;
				overflow-x: auto; 
				padding-right: 20px; 
				.price { 
					font-size: 1rem; 
					font-weight: bold; 
					color: #333;    
				}
				.desc {  
					font-size: 0.4rem; 
					color: #999; 
				}
			}
			.btn { 
				color: #1989fa; 
			}
			.btn:active { 
				opacity: 0.6;
			}
		}
        .clear-con { 
			font-size: 18px; 
			color: #999; 
		}
		.opacity-6 { 
			opacity: 0.6;
		}
        /* 自定义键盘样式 */
        .van-number-keyboard__header { 
			background: #fff;
			.van-number-keyboard__title { 
				color: #999; 
			}
			.van-number-keyboard__title-left { 
				width: 100%; 
				text-align: center; 
				color: #999; 
				font-size: 22px; 
			}
		}
        .van-number-keyboard__sidebar {
			
			.van-key__wrapper {
				.van-key--delete { 
					
				} 
				.van-key--blue { 
					background: #1989fa; 
					opacity: 0.6; 
				}
			}
			.van-key__wrapper:first-of-type { 
				flex: none; 
				height: 56px; 
			}
		}
        .cursor-blink { 
			animation: blink 1s infinite steps(1, start); 
			width:1px; 
			height:20px;   
			display: inline-block; 
			position: absolute; 
		}
        /*这里设置动画blink*/
        @keyframes blink {
            0%, 100% {
                background-color: #000;
                color: #aaa;
            }
            50% {
                background-color: #bbb; /* not #aaa because it's seem there is Google Chrome bug */
                color: #000;
            }
		}
		.type-popup-con {
            display: flex;
            align-items: center;
            flex-direction: column;
            .type-popup {
                position: relative;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                .type-popup-tit {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    z-index: 999;
                    background: #fff;
                    padding: 18px 0;
                    .tit {
                        flex: 1;
                        font-weight: bold;
                        text-align: center;
                        font-size: 14px;    
                    }
                    .close-con {
                        width: 50px;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                }
                .van-radio-group {
                    width: 100%;
                    height: calc(100% - 44px);
                    overflow: hidden;
                    overflow-y: auto;
				}
				.van-cell__title {
					font-weight: bold;
					flex: none;
				}
				.bank-icon {
					display: flex;
					align-items: center;
				}
            }
            
        }
	}
</style>
