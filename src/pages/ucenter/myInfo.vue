<template>
	<div class="myInfo">
		<van-nav-bar title="个人信息" left-arrow fixed @click-left="leftBack" />
		<div class="cell-cont">
			<van-cell title="头像" is-link class="imgVan">
				<template #icon>
					<img src="../../images/person3.png" alt="" class="iconImg" />
				</template>
				<template>
					<van-uploader :after-read="afterRead" class="change">
						<img :src="imgPhote" alt="" class="headerImg" />
					</van-uploader>
				</template>
			</van-cell>
			<van-field v-model="user_tg_id" label="用户ID" readonly :left-icon="require('../../images/user_tg_id.png')" />
			<van-field v-model="name" clearable is-link label="姓名" readonly @click="$router.push('/infoChange')" :left-icon="require('../../images/person1.png')" />
			<van-cell title="手机号" :value="info.phone">
				<template #icon>
					<img src="../../images/phone.png" alt="" class="iconImg" />
				</template>
			</van-cell>
			<van-field v-model="area" label="所在地" readonly :left-icon="require('../../images/address1.png')" />
			<van-field v-model="address" label="详细地址" readonly :left-icon="require('../../images/detailAdd.png')" />
		</div>

		<div class="cell-cont cont1">
			<van-field v-model="cardNum" clearable label="身份证号" readonly :left-icon="require('../../images/person2.png')" />
		</div>
		<div class="cell-cont cont1">
			<van-field readonly label="身份证照片" :left-icon="require('../../images/pic.png')" />
			<div class="cardUpload">
				<van-uploader v-model="fileList1" multiple :disabled="disabled" :deletable="deletable"
					:max-count="1">
					<img src="../../images/jia.png" />
					<p>身份证正面</p>
				</van-uploader>
				<van-uploader v-model="fileList2" multiple :disabled="disabled"  :deletable="deletable"
					:max-count="1">
					<img src="../../images/jia.png" />
					<p>身份证反面</p>
				</van-uploader>
			</div>
		</div>

	</div>
</template>
<script>
	export default {
		name: "myInfo",
		data() {
			return {
				token: '',
				info: '',
				imgPhote: '',
				user_tg_id: '',
				name: '',
				beforeName: '',
				cardNum: '',
				beforeCardNum: '',
				
				disabled: true,
				deletable: false,
				fileList1: [],
				img1: '',
				fileList2: [],
				img2: '',
				area: '',
				address: '',
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			if(typeof android != 'undefined'){
				this.token = android.load("token")
			}else{
				this.token = localStorage.getItem('token')
			}
			this.myInfo(); 
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			myInfo(){
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.userInfo().then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.info = res.data;	
						this.imgPhote = res.data.photo
						this.user_tg_id = res.data.user_tg_id
						this.name = res.data.name
						this.beforeName = res.data.name
						this.cardNum = res.data.idcard
						this.beforeCardNum = res.data.idcard
						
						if (res.data.area_name) {
							this.area = res.data.province_name + '/' + res.data.city_name + '/' + res.data.area_name
						}else{
							this.area = '无'
						}
						this.address = res.data.address ? res.data.address : '无'
						
						let pathUrl1 = {}
						if(res.data.idcard_just != null){
							pathUrl1.url = res.data.idcard_just
							this.img1 = res.data.idcard_just
							this.fileList1.push(pathUrl1)
						}
						let pathUrl2 = {}
						if(res.data.idcard_reverse != null){
							pathUrl2.url = res.data.idcard_reverse
							this.img2 = res.data.idcard_reverse
							this.fileList2.push(pathUrl2)
						}
					} else {
						this.$toast(res.errmsg)	
					}

				}).catch(err=>{
					this.$toast.clear()
				})
			},
			// 修改头像
			afterRead(file) {
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
					if (res.data.errno === 0) {
						let urlIMg = res.data.data.url
						this.$api.update_user_photo({photo: urlIMg}).then(res=>{
							this.$toast.clear()
							if(res.errno == 0){
								this.$toast("头像修改成功")
								this.imgPhote = urlIMg
							}
						}).catch(err=>{
							this.$toast.clear()
						})
					} else {
						this.$toast.clear()
						this.$toast(res.errmsg);
					}
				}).catch(err=>{
					this.$toast.clear()
				});
			},
		}
	}
</script>
<style lang="less">
	.myInfo {
		padding-top: 46px;
		background: #F0F6FC;
		min-height: calc(100% - 46px);

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


		.cell-cont {
			&.cont1{
				margin-top: 10px;
			}
			.imgVan{
				align-items: center;
				border-radius: 10px 10px 0 0;
				padding: 5px 16px;
				line-height: 0;
				.van-cell__title{
					margin-top: 5px;
				}
				.headerImg{
					width: 40px;
					height: 40px;
					border-radius: 50%;
					border: 2px solid #FFFFFF;
				}
			}
			.van-cell__title{
				flex: 0.4;
			}
			.van-field__label{
				color: #323233;
			}
			.van-cell__value{
				color: #9AA8B6;
			}
			.van-field__control{
				text-align: right;
				color: #9AA8B6;
			}
			.iconImg {
				height: 15px;
				margin-top: 4px;
				margin-right: 6px;
			}
			.iconRightImg{
				height: 15px;
			}
			.cardUpload{
				display: flex;
				background: #FFFFFF;
				.van-uploader {
					padding: 10px 0 10px 15px;
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


	}
</style>
