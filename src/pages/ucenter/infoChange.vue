<template>
	<div class="infoChange" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="变更身份信息" left-arrow fixed @click-left="leftBack" />
		<p class="m-title">请输入<span>"变更后"</span>的身份信息</p>
		<div class="cell-cont">
			<p class="title">姓名</p>
			<van-field v-model="name" :class="ifIn1? 'ifIn' : ''"  placeholder="请输入变更后的姓名" @input="ifIn1 = true" @blur="ifIn1=false" >
			<template #right-icon>
					<img src="../../images/person1.png" alt="" class="iconImg" />
				</template>
			</van-field>


			<p class="title">身份证号</p>
			<van-field v-model="cardNum" readonly :class="ifIn2? 'ifIn' : ''" autofocus placeholder="请输入变更后的身份证号" @touchstart.native.stop="cardKey = true"  @blur="ifIn2=false" >
			<template #right-icon>
					<img src="../../images/person2.png" alt="" class="iconImg" />
				</template>
			</van-field>

			<p class="title">身份证照片</p>
			<div class="cardUpload">
				<van-uploader v-model="fileList1" :after-read="afterRead1" :before-delete="beforeDelete1" multiple
					:max-count="1">
					<img src="../../images/jia.png" />
					<p>身份证正面</p>
				</van-uploader>
				<van-uploader v-model="fileList2" :after-read="afterRead2" :before-delete="beforeDelete2" multiple
					:max-count="1">
					<img src="../../images/jia.png" />
					<p>身份证反面</p>
				</van-uploader>
			</div>
		</div>
		<van-number-keyboard
			:show="cardKey"
			v-model="cardNum"
			extra-key="X"
			maxlength = "18"
			@blur="cardKey = false, ifIn2 = false"
			@input="ifIn2 = true"
			/>
		
		<van-button :icon='require("../../images/send.png")' type="info" block class="sendBtn" @click="saveInfo()" v-if="hidshowFooter">
			立即提交
		</van-button>
	</div>
</template>
<script>
	export default {
		name: "infoChange",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 90,
				token: '',
				ifIn1: false,
				ifIn2: false,
				name: '',
				cardNum: '',
				cardKey: false,
				fileList1: [],
				img1: '',
				fileList2: [],
				img2: '',

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
			// 身份证正面
			afterRead1(file) {
				// 判断图片大小，确定是否压缩图片
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						//压缩后比原来更大，则将原图上传
						this._uploadFile(file.file, file.file.name, 1);
					} else {
						//压缩后比原来小，上传压缩后的
						this._uploadFile(result, file.file.name, 1)
					}
				})
			},
			// 身份证反面
			afterRead2(file) {
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						this._uploadFile(file.file, file.file.name, 2);
					} else {
						this._uploadFile(result, file.file.name, 2)
					}
				})
			},
			_uploadFile(file, filename, id){
				var formdata = new FormData(); //可以通过append()方法来追加数据
				formdata.append("file", file, filename);
				formdata.append("token", this.token);
				const instance = this.$axios.create({
					//withCredentials:true
				});
				this.$toast.loading({
					message: '上传中...',
					forbidClick: true,
					duration: 0,
				});
				instance.post("http://coopera.xfd365.com/user/auth/uploadImg", formdata).then(res => {
					this.$toast.clear()
					if (res.data.errno === 0) {
						if(id == 1){
							this.img1 = res.data.data.url
							let pathUrl1 = {}
							pathUrl1.url = res.data.data.url
							this.fileList1 = []
							this.fileList1.push(pathUrl1)
						}else if(id == 2){
							this.img2 = res.data.data.url
							let pathUrl2 = {}
							pathUrl2.url = res.data.data.url
							this.fileList2 = []
							this.fileList2.push(pathUrl2)
						}
						
					} else {
						this.img1 = ''
						this.fileList1 = []
						this.img2 = []
						this.fileList2 = []
						this.$toast(res.errmsg);
					}
				});
			},
			beforeDelete1(file, detail) {
				this.img1 = ''
				this.fileList1 = []
			},
			beforeDelete2(file, detail) {
				this.img2 = ''
				this.fileList2 = []
			},
			saveInfo(){
				if(this.name.trim().length == 0){
					this.$toast("请输入变更姓名")
					return
				}
				if(this.cardNum.length == 0){
					this.$toast("请输入变更身份证号")
					return
				}
				if(this.img1.length == 0){
					this.$toast("请上传身份证正面照")
					return
				}
				if(this.img2.length == 0){
					this.$toast("请上传身份证反面照")
					return
				}
				
				let data = {}
				data.name = this.name
				data.idcard = this.cardNum
				data.idcard_just = this.img1
				data.idcard_reverse = this.img2
				this.$toast.loading({
					message: '修改中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.update_user_baseinfo(data).then(res=>{
					this.$toast.clear()
					if(res.errno == 0){
						this.$toast("修改成功")
						setTimeout(()=>{
							this.$router.go(-1)
						})
					}else{
						this.$toast(res.errmsg)
					}
				}).catch(err=>{
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
	.infoChange {
		padding-top: 46px;
		padding-bottom: 44px;
		background: #f0f6fc url(../../images/applyBg.png) no-repeat right 46px;
		background-size: auto 36px;
		overflow: auto;

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
			padding: 10px 0;
			span {
				color: #3B6AF1;
			}
		}
		.cell-cont{
			background: #ffffff;
			padding-top: 15px;
			height: calc(100% - 48px);
			border-radius: 10px 10px 0 0;
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
				margin-top: 15px;
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

				.iconImg{
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
			.cardUpload{
				display: flex;
				background: #FFFFFF;
				.van-uploader {
					padding: 20px 0 10px 15px;
				}
				
				.van-uploader__preview-image {
					width: 100px;
					height: 70px;
				}
				
				.van-uploader__input-wrapper {
					background: #F0F6FC;
					width: 100px;
					height: 70px;
					text-align: center;
					color: #9AA8B6;
				
					img {
						width: 15px;
						height: 15px;
						margin: 16px 0 5px 0;
					}
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
