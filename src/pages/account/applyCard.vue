<template>
	<div class="applyCard" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="添加银行卡" left-arrow fixed @click-left="leftBack" />
		<p class="m-title">仅限<span>本人</span>持有的银行卡</p>
		<div class="groupCont">
			<p class="title">银行卡号</p>
			<van-field v-model="cardNum" type="number" clearable :class="ifIn? 'ifIn' : ''" placeholder="请输入银行卡号"
				@input="ifIn = true" @clear="cardName = ''">
				<template #right-icon>
					<van-uploader :after-read="afterRead" :max-count="1" class="upload" >
						<img src="../../images/camera.png" class="rightIcon" />
					</van-uploader>
				</template>
			</van-field>

			<div class="cardCont" v-if="cardName">{{cardName}}</div>
		</div>
		<van-button :icon='require("../../images/add.png")' type="info" block class="sendBtn" @click="sendApply()" v-if="hidshowFooter">
			立即添加
		</van-button>
	</div>
</template>
<script>
	export default {
		name: "applyCard",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				token: '',
				cardNum: '',
				ifIn: false,
				cardImg: '',
				cardName:'',

				docmHeight: document.documentElement.clientHeight, //默认屏幕高度
				showHeight: "0", //实时屏幕高度
				hidshowFooter: true, //显示或者隐藏footer,
			}
		},
		mounted() {
			window.leftBack = this.leftBack;
			if(typeof android != 'undefined'){
				this.token = android.load("token")
			}else{
				this.token = localStorage.getItem('token')
			}
			
			window.onresize = () => { // 实时屏幕高度
				this.showHeight = document.body.clientHeight;
			};
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			// 上传照片
			afterRead(file){
				// 判断图片大小，确定是否压缩图片
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){ // 压缩后大小 > 压缩前大小
						//压缩后比原来更大，则将原图上传
						this._uploadFile(file.file, file.file.name);
					} else {
						//压缩后比原来小，上传压缩后的
						this._uploadFile(result, file.file.name)
					}
				})
			},
			// 上传识别银行卡
			_uploadFile(file, filename){
				var formdata = new FormData(); //可以通过append()方法来追加数据
				formdata.append("file", file, filename);
				formdata.append("token", this.token);
				const instance = this.$axios.create({
					//withCredentials:true
				});
				this.$toast.loading({
					message: '识别中...',
					forbidClick: true,
					duration: 0,
				});
				instance.post("http://coopera.xfd365.com/user/auth/uploadImg", formdata).then(res => {
					if (res.data.errno === 0) {
						this.cardImg = res.data.data.url
						this.$api.get_aipocr_bank_no({'url': this.cardImg}).then(res => {
							this.$toast.clear()
							if (res.errno == 0) {
								this.cardNum = res.data.bank_card_number
								this.cardName = res.data.bank_name
							} else {
								this.$toast(res.errmsg)
							}
						}).catch(err => {
							this.$toast.clear()
						})
					} else {
						this.$toast(res.errmsg);
					}
				});
			},
			
			// 提交
			sendApply() {
				if(this.cardNum.trim().length == 0){
					this.$toast("请输入银行卡号")
					return
				}
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_get_bank_by_banknum({
					bank_num: this.cardNum
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$router.push({
							path: '/applyCardDetail',
							query: {
								carNum: this.cardNum,
								cardType: res.data,
								info: JSON.stringify(res.info)
							}
						})
					} else {
						this.$toast(res.errmsg)
					}

				}).catch(err => {
					this.$toast.clear()
				})
			}

		},
		watch: {
			showHeight: function() {
				if (this.docmHeight > this.showHeight) {
					this.hidshowFooter = false;
				} else {
					this.hidshowFooter = true;
				}
			}
		}
	}
</script>
<style lang="less">
	.applyCard {
		padding-top: 46px;
		padding-bottom: 44px;
		background: #f0f6fc url(../../images/applyBg.png) no-repeat right 46px;
		background-size: auto 36px;

		.van-nav-bar {
			z-index: 10;
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

		.m-title {
			margin: 0 10px;
			padding-top: 10px;

			span {
				color: #3B6AF1;
			}
		}

		.groupCont {
			background: #ffffff;
			margin-top: 10px;
			padding-top: 20px;
			border-radius: 10px 10px 0 0;
			height: calc(100% - 30px);
			position: relative;

			input:-ms-input-placeholder {
				color: #444444;
				font-size: 12px;
			}

			::-webkit-input-placeholder {
				color: #444444;
				font-size: 12px;
			}

			.title {
				margin-left: 15px;
				color: #9AA8B6;
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

			.cardCont {
				display: flex;
				align-items: center;
				margin: 0 12px;
				font-size: 15px;

				img {
					height: 20px;
					margin-right: 5px;
				}
			}
		}



		.sendBtn {
			position: fixed;
			bottom: 0;
			left: 0;
			font-size: 15px;
			border-radius: 0;
			background: #3B6AF1;
			border: 1px solid #3B6AF1;
		}




	}
</style>
