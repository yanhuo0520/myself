<template>
	<div class="danOther" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="为他担保" left-arrow fixed @click-left="leftBack" />
		<div class="topTitle">
			<img src="../../images/otherTitle.png" class="leftImg" />
			<img src="../../images/otherIcon.png" class="rightImg" />
		</div>
		<van-cell-group>
			<van-field v-model="name" label="资产名称" :left-icon="require('../../images/name1.png')"
				placeholder="请输入资产名称" />
			<van-field v-model="nowMoney" clearable label="资产现价" :left-icon="require('../../images/qian8.png')"
				placeholder="请输入资产现价" />
			<van-field v-model="year" label="资产年限" :left-icon="require('../../images/date5.png')"
				placeholder="请输入资产年限" />
		</van-cell-group>

		<van-cell-group class="uploadImg">
			<van-field readonly label="资产照片" :left-icon="require('../../images/pic.png')" />
			<van-uploader v-model="fileList" :after-read="afterRead" :before-delete="beforeDelete" multiple
				:max-count="3">
				<img src="../../images/jia.png" />
				<p>照片(最多三张)</p>
			</van-uploader>
		</van-cell-group>

		<p class="applyBtn" @click.stop="apply()" v-if="!assetsCode">立即提交</p>
		
		<div class="btnCont" v-else>
			<p class="deletnBtn btn" @click.stop="dele()">立即删除</p>
			<p class="updateBtn btn" @click.stop="updete()">确认修改</p>
		</div>

	</div>
</template>
<script>
	export default {
		name: "danOther",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				token: '',
				guaranteeCode: '',
				type_id: '',
				assetsCode: '',
				name: '',
				nowMoney: '',
				year: '',
				fileList: [],
				imgIdArray: []
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			if(typeof android != 'undefined'){
				this.token = android.load("token")
			}else{
				this.token = localStorage.getItem('token')
			}
			this.guaranteeCode = this.$route.query.guaranteeCode
			this.type_id = this.$route.query.type_id
			this.assetsCode = this.$route.query.assetsCode
			if(this.assetsCode){
				this.getDetail()
			}
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			getDetail(){
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.oneLoanGuaranteeAssetsDetail({assets_code: this.assetsCode}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.name = res.data.assets_name
						this.nowMoney = res.data.assets_price
						this.year = res.data.assets_age
			
						let imgList = res.img
						imgList.forEach(ele=>{
							this.imgIdArray.push(ele.img_id)
							let pathUrl = {}
								pathUrl.url = ele.img_url
							this.fileList.push(pathUrl)
						})
					}else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			afterRead(file) {
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						//压缩后比原来更大，则将原图上传
						this._uploadFile(file.file, file.file.name);
					} else {
						//压缩后比原来小，上传压缩后的
						this._uploadFile(result, file.file.name)
					}
				})
			},
			_uploadFile(file, filename){
				var formdata = new FormData();
				//可以通过append()方法来追加数据
				formdata.append("guarantee_code", this.guaranteeCode);
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
				instance.post("http://coopera.xfd365.com/api/coopera/upload_guarantee_img", formdata).then(res => {
					this.$toast.clear()
					if (res.data.errno === 0) {
						this.$toast("上传成功");
						this.imgIdArray.push(res.data.data.img_id)
					} else {
						this.$toast(res.errmsg);
					}
				});
			},
			beforeDelete(file, detail) {
				let index = detail.index
				this.$toast.loading({
					message: '删除中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.deleteGuaranteeImg({assets_code: this.assetsCode, img_id: this.imgIdArray[index]}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast(res.errmsg)
						this.fileList.splice(index, 1);
						this.imgIdArray.splice(index, 1);
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 删除
			dele(){
				this.$toast.loading({
					message: '删除中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.deleteLoanGuaranteeAssets({assets_code: this.assetsCode}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast(res.errmsg)
						this.$router.go(-1);
					}else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 修改
			updete(){
				if(this.name.length == 0){
					this.$toast("请输入资产名称")
					return
				}
				if(this.nowMoney.trim().length == 0){
					this.$toast("请输入资产现价")
					return
				}
				if(this.year.trim().length == 0){
					this.$toast("请输入房产年限！")
					return
				}
				let id_str = ''
				if(this.imgIdArray.length > 0){
					this.imgIdArray.forEach(ele => {
						id_str += ele + ','
					})

					if (id_str.lastIndexOf(',') > -1) {
						id_str = id_str.substr(0, id_str.length - 1)
					}
				}
			
				let data = {}
				data.assets_code = this.assetsCode
				data.assets_name = this.name // 资产名称 （房产类型）（汽车品牌跟名称）
				data.assets_price = this.nowMoney // 资产现价
				data.assets_age = this.year // 资产年限
				data.img_id_str = id_str
				this.$toast.loading({
					message: '提交中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.updateLoanGuaranteeAssets(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.$toast(res.errmsg)
						this.$router.go(-1);
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			apply() {
				if(this.name.length == 0){
					this.$toast("请输入资产名称")
					return
				}
				if(this.nowMoney.trim().length == 0){
					this.$toast("请输入资产现价")
					return
				}
				if(this.year.trim().length == 0){
					this.$toast("请输入房产年限！")
					return
				}
				let id_str = ''
				if(this.imgIdArray.length > 0){
					this.imgIdArray.forEach(ele => {
						id_str += ele + ','
					})

					if (id_str.lastIndexOf(',') > -1) {
						id_str = id_str.substr(0, id_str.length - 1)
					}
				}
				let data = {}
				data.guarantee_code = this.guaranteeCode
				data.guarantee_type_id = this.type_id
				data.assets_name = this.name // 资产名称 （房产类型）（汽车品牌跟名称）
				data.assets_price = this.nowMoney // 资产现价
				data.assets_age = this.year // 资产年限
				data.img_id_str = id_str
				this.$toast.loading({
					message: '提交中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.submitLoanGuaranteeAssets(data).then(res => {
					this.$toast.clear()
					this.$toast(res.errmsg)
					if (res.errno == 0) {
						setTimeout(()=>{
							this.$router.go(-1);
						}, 1000)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},


		},


	}
</script>
<style lang="less">
	.danOther {
		background: #f0f6fc url(../../images/bgHeader7.png) no-repeat;
		background-size: 100% auto;
		padding-top: 46px;
		overflow-y: scroll;

		.van-nav-bar {
			z-index: 10;
			background: url(../../images/bgHeader7.png) no-repeat top center;
			background-size: 100% 170px;

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

		.topTitle {
			margin: 15px;
			display: flex;
			justify-content: space-between;

			.leftImg {
				width: 200px;
				height: 46px;
			}

			.rightImg {
				width: 69px;
				height: 69px;
			}
		}

		.van-cell-group {
			margin: 0 10px;
			border-radius: 10px;

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

			&.uploadImg {
				margin-top: 10px;

				.van-cell::after {
					border: none;
				}
			}
		}

		input {
			text-align: right;
		}

		input:-ms-input-placeholder {
			color: #9AA8B6;
		}

		::-webkit-input-placeholder {
			color: #9AA8B6;
		}

		.van-uploader {
			padding: 0 15px 10px 15px;
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

		.applyBtn {
			margin: 30px 30px 0 30px;
			background: #3b6af1;
			border-radius: 40px;
			font-size: 15px;
			line-height: 40px;
			color: #FFFFFF;
			text-align: center;
		}
		
		.btnCont{
			margin-top: 30px;
			display: flex;
			justify-content: space-around;
			.btn{
				border-radius: 40px;
				font-size: 15px;
				line-height: 40px;
				width: calc(50% - 20px);
				text-align: center;
				&.deletnBtn{
					color: #9AA8B6;
					background: #FFFFFF;
				}
				&.updateBtn{
					color: #FFFFFF;
					background: #3b6af1;
				}
			}
		}


	}
</style>
