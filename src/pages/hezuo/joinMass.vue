<template>
	<div class="applyMass" :style='{height: deviceHeight + "px"}'>
		<div class="topTitle">
			<img src="../../images/xiexianBg.png" class="bgxiexian" />
			<img src="../../images/joinMassTitle.png" class="leftImg" />
			<img src="../../images/joinMassIcon.png" class="rightImg" />
		</div>
		<van-cell-group>
			<van-field v-model="name" label="姓名" readonly :left-icon="require('../../images/person1.png')"
				placeholder="请输入姓名" />
			<van-field v-model="phone" label="手机号" readonly :left-icon="require('../../images/phone.png')"
				placeholder="请输入手机号" />

			<van-field v-model="cardNum" readonly clearable label="管理员身份证" :left-icon="require('../../images/person2.png')" @touchstart.native.stop="cardKeyword = true"
				placeholder="请输入管理员身份证" />
			<van-number-keyboard
				:show="cardKeyword"
				v-model="cardNum"
				extra-key="X"
				maxlength = "18"
				@blur="cardKeyword = false"
				/>

			<van-field v-model="area" label="所在地" readonly is-link :left-icon="require('../../images/address1.png')"
				placeholder="请选择您的所在地"  @click.stop="addreShow = true" />
			<van-field v-model="addressIn" label="详细地址" :left-icon="require('../../images/detailAdd.png')"
				placeholder="请输入您的详细地址" />

			<van-field v-model="yqCode" label="团队邀请码" :left-icon="require('../../images/code.png')" @input="filterSpaces()"
				placeholder="创建者如未设置,可不填" />

			<van-field readonly label="身份证照片" :left-icon="require('../../images/pic.png')" />
			<div style="display: flex;">
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
			
		</van-cell-group>

		<p class="applyBtn" @click.stop="apply()">申请加入</p>

		<!-- 请选择团体所在地区 -->
		<van-popup v-model="addreShow" round position="bottom">
			<van-cascader v-model="cascaderValue" title="请选择您的所在地区" :options="options" active-color="#1989fa"
				@close="addreShow = false" @change="onChange" @finish="onFinish" />
		</van-popup>


	</div>
</template>
<script>
	export default {
		name: "applyMass",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 115,
				token: '',
				team_id: '',
				name: '',
				phone: '',
				cardNum: '',
				cardKeyword: false,
				addreShow: false,
				cascaderValue: '',
				optionId1: 0,
				optionId2: 0,
				options: [{
					text: '浙江省',
					value: '330000',
					children: [],
				}, ],
				area: '',
				province_id: '',
				city_id: '',
				area_id:'',
				addressIn: '',
				yqCode: '',
				
				fileList1: [],
				img1: '',
				fileList2: [],
				img2: '',
			};
		},
		mounted() {
			if(typeof android != 'undefined'){
				this.token = android.load("token")
			}else{
				this.token = localStorage.getItem('token')
			}
			
			this.team_id = this.$route.query.team_id
			this.userTeamBaseInfo()
			this.getAddress(1)
		},
		methods: {
			// 用户创建团队或加入团队时自己的基本信息
			userTeamBaseInfo() {
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.$api.user_team_base_info().then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.name = res.data.name
						this.phone = res.data.phone
						this.cardNum = res.data.idcard
						this.province_id = res.data.province_id
						this.city_id = res.data.city_id
						this.area_id = res.data.area_id
						this.addressIn = res.data.address
						if(res.data.area_name){
							this.area = res.data.province_name + '/' + res.data.city_name + '/' + res.data.area_name
						}
						
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
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 选择合作社地址
			getAddress(level, code) {
				this.$api.addresss({
					level: level,
					code: code,
					type: 1
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						for (let i = 0; i < res.data.length; i++) {
							res.data[i].id = i
							res.data[i].value = res.data[i].code
							res.data[i].text = res.data[i].name
							res.data[i].level = level
							res.data[i].children = []
						}
						this.options = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			onChange({value, selectedOptions, tabIndex}) {
				if (tabIndex == 0) {
					this.optionId1 = selectedOptions[0].id
				} else if (tabIndex == 1) {
					this.optionId2 = selectedOptions[1].id
				}
				if (tabIndex > 1) {
					return
				}
				this.$api.addresss({
					level: tabIndex + 2,
					code: value,
					type: this.seltype
				}).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						if (res.data.length > 0) {
							for (let i = 0; i < res.data.length; i++) {
								res.data[i].id = i
								res.data[i].value = res.data[i].code
								res.data[i].text = res.data[i].name
								res.data[i].level = tabIndex + 2
								if (tabIndex < 1) {
									res.data[i].children = []
								}
							}
						} else {
							let array = {}
							array.id = 0
							array.code = ''
							array.value = '暂无'
							array.text = '暂无'
							array.name = '暂无'
							array.level = tabIndex + 2
							res.data.push(array)
						}

						this.$nextTick(() => {
							if (tabIndex == 0) {
								this.options[this.optionId1].children = res.data;
							} else if (tabIndex == 1) {
								let children1 = this.options[this.optionId1].children
								children1[this.optionId2].children = res.data;
							}
						})


					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			onFinish({selectedOptions}) {
				this.addreShow = false;
				this.province_id = selectedOptions[0].value
				this.city_id = selectedOptions[1].value
				this.area_id = selectedOptions[2].value
				this.area = selectedOptions.map((option) => option.text).join('/');
			},
			// 身份证正面
			afterRead1(file) {
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						//压缩后比原来更大，则将原图上传
						this._uploadFile1(file.file, file.file.name);
					} else {
						//压缩后比原来小，上传压缩后的
						this._uploadFile1(result, file.file.name)
					}
				})
			},
			_uploadFile1(file, filename){
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
						this.img1 = res.data.data.url
						this.$api.idcardOcr({
							'idcard_url': this.img1
						}).then(res => {
							this.$toast.clear()
							if (res.errno == 0) {
								this.cardNum = res.data.certNumber
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
			beforeDelete1(file, detail) {
				this.img1 = ''
				this.fileList1 = []
			},
			// 身份证反面
			afterRead2(file) {
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						//压缩后比原来更大，则将原图上传
						this._uploadFile2(file.file, file.file.name);
					} else {
						//压缩后比原来小，上传压缩后的
						this._uploadFile2(result, file.file.name)
					}
				})
			},
			_uploadFile2(file, filename){
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
						this.img2 = res.data.data.url
					} else {
						this.$toast(res.errmsg);
					}
				});
			},
			beforeDelete2(file, detail) {
				this.img2 = ''
				this.fileList2 = []
			},
			// 过滤空格
			filterSpaces(){
				this.yqCode = this.yqCode.replace(/ /g,'')
			},
			apply() {
				if(this.name.trim().length == 0){
					this.$toast("请输入姓名")
					return
				}
				if (this.$validatePhone(this.phone) != true) {
					this.$toast(this.$validatePhone(this.phone))
					return
				}
				if(this.cardNum.trim().length == 0){
					this.$toast("请输入身份证")
					return
				}
				if(!this.area_id){
					this.$toast("请选择所在地")
					return
				}
				if(this.addressIn.trim().length == 0){
					this.$toast("请输入详细地址")
					return
				}
				if (this.img1.length == 0) {
					this.$toast("请上传身份证正面照片")
					return
				}
				if (this.img2.length == 0) {
					this.$toast("请上传身份证反面照片")
					return
				}
				let data = {}
				data.team_id = this.team_id
				data.join_pwd = this.yqCode 
				data.province_id = this.province_id
				data.city_id = this.city_id
				data.area_id = this.area_id
				data.address = this.addressIn
				data.idcard_just = this.img1
				data.idcard = this.cardNum
				data.idcard_reverse = this.img2

				this.$api.user_join_team(data).then(res => {
					this.$toast(res.errmsg)
					if (res.errno == 0) {
						this.$router.go(-1);
					}
				}).catch(err => {

				})
			},


		},


	}
</script>
<style lang="less">
	.applyMass {
		background: url(../../images/bgHeader4.png) no-repeat;
		background-size: 100% 300px;
		padding-top: 46px;
		.topTitle {
			margin: 0 15px;
			display: flex;
			justify-content: space-between;
			height: 80px;
			.bgxiexian{
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 126px;
			}
			.leftImg {
				width: 185px;
				height: 46px;
			}

			.rightImg {
				width: 69px;
				height: 69px;
			}
		}

		.van-cell-group {
			padding-top: 10px;
			border-radius: 10px 10px 0 0;

			.van-field__button {
				img {
					width: 9px;
					vertical-align: middle;
				}
			}

			.van-field__right-icon {
				color: #3B6AF1;

				img {
					width: 22px;
					vertical-align: middle;
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
		
		.van-hairline--top-bottom::after,
		.van-hairline-unset--top-bottom::after {
			border-width: 0;
		}

		.applyBtn {
			margin: 10px 30px 0 30px;
			background: #3b6af1;
			border-radius: 40px;
			font-size: 15px;
			line-height: 40px;
			color: #FFFFFF;
			text-align: center;
		}
	}
</style>
