<template>
	<div class="danFang" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="为他担保" left-arrow fixed @click-left="leftBack" />
		<div class="topTitle">
			<img src="../../images/fangTitle.png" class="leftImg" />
			<img src="../../images/fangicon.png" class="rightImg" />
		</div>
		<van-cell-group>
			<van-field v-model="type" readonly label="房产类型" :left-icon="require('../../images/fang.png')"
				:right-icon="require('../../images/right1.png')" @click="selectShow = true" placeholder="请选择房产类型" />
			<van-field v-model="money" clearable label="房产现价" :left-icon="require('../../images/qian8.png')"
				placeholder="请输入房产现价" />
			<van-field v-model="year" label="房产年限" :left-icon="require('../../images/date5.png')"
				placeholder="请输入房产年限" />
		</van-cell-group>

		<van-cell-group class="uploadImg">
			<van-field readonly label="房产照片" :left-icon="require('../../images/pic.png')" />
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
		<!-- 房产类型 -->
		<van-action-sheet v-model="selectShow" title="房产类型" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<template v-if="fangTypeList.length > 0">
				<van-radio-group v-model="selRadio" v-for="(item, index) in fangTypeList" :key="index">
					<van-cell :title="item.type_name" clickable
						@click="selRadio = item.type_id, selType = item.type_name"
						:class="selRadio == item.type_id ? 'active' : ''">
						<template #right-icon>
							<van-radio :name="item.type_id">
								<template #icon="props">
									<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
								</template>
							</van-radio>
						</template>
					</van-cell>
				</van-radio-group>
			</template>

			<p class="sheetNull" v-if="fangTypeList.length == 0">暂无</p>
		</van-action-sheet>

	</div>
</template>
<script>
	export default {
		name: "danFang",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				token: '',
				guaranteeCode: '',
				type_id: '',
				assetsCode: '',
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selectShow: false,
				fangTypeList: [],
				selRadio: '',
				selType: '',

				type: '',
				money: '',
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
			this.houseType()
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
						this.type = res.data.assets_name
						this.fangTypeList.forEach(ele=>{
							if(ele.type_name == res.data.assets_name){
								this.selRadio = ele.type_id
								this.selType = res.type_name
							}
						})
						this.money = res.data.assets_price
						this.year = res.data.assets_age

						let imgList = res.img
						imgList.forEach(ele=>{
							this.imgIdArray.push(ele.img_id)
							let pathUrl = {}
								pathUrl.url = ele.img_url
							this.fileList.push(pathUrl)
						})
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 房产类型
			houseType() {
				this.$api.houseType().then(res => {
					if (res.errno == 0) {
						this.selRadio = res.data[0].type_id
						this.selType = res.data[0].type_name
						this.fangTypeList = res.data;
					}else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},
			sureSel() {
				this.selectShow = false
				this.type = this.selType
			},
			// 我要担保--上传资产证明图片
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
					if (res.data.errno == 0) {
						this.$toast("上传成功");
						this.imgIdArray.push(res.data.data.img_id)
					}else{
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
			// 修改
			updete(){
				if(this.type.length == 0){
					this.$toast("请选择房产类型！")
					return
				}
				if(this.money.trim().length == 0){
					this.$toast("请输入房产现价！")
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
				data.assets_name = this.type // 资产名称 （房产类型）（汽车品牌跟名称）
				data.assets_price = this.money // 资产现价
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
					}else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			apply() {
				if(this.type.length == 0){
					this.$toast("请选择房产类型！")
					return
				}
				if(this.money.trim().length == 0){
					this.$toast("请输入房产现价！")
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
				data.assets_name = this.type // 资产名称 （房产类型）（汽车品牌跟名称）
				data.assets_price = this.money // 资产现价
				data.assets_age = this.year // 资产年限
				data.img_id_str = id_str
				this.$toast.loading({
					message: '提交中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.submitLoanGuaranteeAssets(data).then(res => {
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


		},


	}
</script>
<style lang="less">
	.danFang {
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


		// 选择框
		.selSheet {
			.van-action-sheet__header {
				font-size: 15px;
				font-weight: bold;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					height: 3px;
					width: 30px;
					background: #3B6AF1;
					border-radius: 2px;
					bottom: 6px;
					left: calc(50% - 15px);
				}
			}

			.active {
				.van-cell__title {
					color: #3B6AF1;
				}
			}

			.img-icon {
				height: 20px;
			}

			.van-action-sheet__gap{
				height: 0px;
			}
			.van-action-sheet__cancel{
				color: #FFFFFF;
				height: 80px;
				font-size: 15px;
				padding-top: 25px;
				background: url(../../images/bgBtn1.png) no-repeat center 25px;
				background-size: calc(100% - 40px) 40px;
			}

			.sheetNull {
				margin: 20px 0;
				color: #666666;
				text-align: center;
			}
		}

	}
</style>
