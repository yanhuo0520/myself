<template>
	<div class="applyMass" :style='{height: deviceHeight + "px"}'>
		<div class="topTitle">
			<img src="../../images/xiexianBg.png" class="bgxiexian" />
			<img src="../../images/massTitle.png" class="leftImg" />
			<img src="../../images/massIcon.png" class="rightImg" />
		</div>
		<van-cell-group>
			<van-field v-model="massName" clearable label="群众团体名称" :left-icon="require('../../images/name.png')"
				placeholder="请输入群众团体名称" />
			<van-field v-model="number" readonly is-link clearable label="成员数量"
				:left-icon="require('../../images/number.png')" placeholder="请选择成员数量"
				@click.stop="selecnumberShow = true" />
			<van-field v-model="name" label="管理员姓名" readonly :left-icon="require('../../images/person1.png')"
				placeholder="请输入管理员姓名" />
			<van-field v-model="phone" type="number" clearable label="管理员手机号" :left-icon="require('../../images/phone.png')"
				placeholder="请输入管理员手机号" />

			<van-field v-model="phoneCode" type="number" clearable label="手机验证码" :left-icon="require('../../images/msg.png')">
				<template v-if="showCodeBtn" #right-icon>
					<p @click="getCode">发送验证码</p>
				</template>
				<template v-else #right-icon>
					<p>{{times}}秒</p>
				</template>
			</van-field>

			<van-field v-model="cardNum" readonly clearable label="管理员身份证" :left-icon="require('../../images/person2.png')" @touchstart.native.stop="cardKeyword = true"
				placeholder="请输入管理员身份证" />

			<van-number-keyboard
				:show="cardKeyword"
				v-model="cardNum"
				extra-key="X"
				maxlength = "18"
				@blur="cardKeyword = false"
				/>

			<van-field v-model="area" label="团体所在地" readonly is-link :left-icon="require('../../images/address1.png')"
				placeholder="请选择团体所在地" @click.stop="addreShow = true" />
			<van-field v-model="addressIn" clearable label="详细地址" :left-icon="require('../../images/detailAdd.png')"
				placeholder="请输入团体详细地址" />

			<van-field v-model="yqCode" label="团队邀请码" :left-icon="require('../../images/code.png')" @input="filterSpaces()"
				placeholder="可不填,填写后仅凭码加入团队" />

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

		<p class="applyBtn" @click.stop="apply()">创建团体</p>
		<!-- 提醒 -->
		<div class="tipCont" v-if="hasApply">
			<img src="../../images/tipImg.png" alt="" class="leftImg" />
			该群众团体名称已被使用，请您重新输入
			<img src="../../images/guang.png" alt="" class="rightImg" />
		</div>

		<!-- 请选择成员数量 -->
		<van-action-sheet v-model="selecnumberShow" title="请选择成员数量" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sureSel()">
			<van-radio-group v-model="selRadionumber">
				<van-cell :title="item.name" v-for="(item, index) in numberList" :key="index" clickable
					@click="selRadionumber = item.num_id, number_title = item.name"
					:class="selRadionumber == item.num_id ? 'active' : ''">
					<template #right-icon>
						<van-radio :name="item.num_id">
							<template #icon="props">
								<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
							</template>
						</van-radio>
					</template>
				</van-cell>
			</van-radio-group>
		</van-action-sheet>

		<!-- 请选择团体所在地区 -->
		<van-popup v-model="addreShow" round position="bottom">
			<van-cascader v-model="cascaderValue" title="请选择团体所在地区" :options="options" active-color="#1989fa"
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
				hasApply: false,
				massName: '',
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				number: '',
				number_title: '',
				number_id: '',
				selRadionumber: 1,
				numberList: [],
				selecnumberShow: false,

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
				area_id: '',
				addressIn: '',
				yqCode: '',
				times: 180,
				showCodeBtn: true,
				phoneCode: '',

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
			this.userTeamBaseInfo()
			this.userTeamNumbers()
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
						if (res.data.area_name) {
							this.area = res.data.province_name + '/' + res.data.city_name + '/' + res.data
								.area_name
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
			// 请选择成员数量
			userTeamNumbers() {
				this.$api.user_team_numbers().then(res => {
					if (res.errno == 0) {
						this.numberList = res.data;
						this.selRadionumber = res.data[0].num_id
						this.number_title = res.data[0].name
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},
			sureSel() {
				this.number = this.number_title
				this.number_id = this.selRadionumber
				this.selecnumberShow = false
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
			onChange({
				value,
				selectedOptions,
				tabIndex
			}) {
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
			onFinish({
				selectedOptions
			}) {
				this.addreShow = false;
				this.province_id = selectedOptions[0].value
				this.city_id = selectedOptions[1].value
				this.area_id = selectedOptions[2].value
				this.area = selectedOptions.map((option) => option.text).join('/');
			},
			// 发送验证码
			getCode() {
				if (this.$validatePhone(this.phone) != true) {
					this.$toast(this.$validatePhone(this.phone))
					return
				}
				this.$api.get_code({
					phone: this.phone
				}).then(res => {
					if (res.errno == 0) { // 启用倒计时
						this.showCodeBtn = false
						this.timer = setInterval(() => {
							this.times--
							if (this.times === 0) {
								this.times = 180
								this.showCodeBtn = true
								clearInterval(this.timer)
							}
						}, 1000)
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {

				})
			},
			// 身份证正面
			afterRead1(file) {
				// 判断图片大小，确定是否压缩图片
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
				if (this.massName.trim().length == 0) {
					this.$toast("请输入群众团体名称")
					return
				}
				if (this.number.length == 0) {
					this.$toast("请选择成员数量")
					return
				}
				if (this.name.trim().length == 0) {
					this.$toast("请输入管理员姓名")
					return
				}
				if (this.$validatePhone(this.phone) != true) {
					this.$toast(this.$validatePhone(this.phone))
					return
				}
				if (this.cardNum.length == 0) {
					this.$toast("请输入管理员身份证")
					return
				}
				if (!this.area_id) {
					this.$toast("请选择团体所在地")
					return
				}
				if (this.addressIn.trim().length == 0) {
					this.$toast("请输入团体详细地址")
					return
				}
				if (this.phoneCode.length == 0) {
					this.$toast("请输入手机验证码")
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
				data.team_name = this.massName // 团体名称
				data.num_id = this.number_id // 团体人数id
				data.name = this.name // 管理员姓名
				data.user_phone = this.phone // 管理员手机号
				data.idcard_just = this.img1
				data.idcard = this.cardNum
				data.idcard_reverse = this.img2
				data.province_id = this.province_id
				data.city_id = this.city_id
				data.area_id = this.area_id
				data.address = this.addressIn
				data.join_pwd = this.yqCode
				data.code = this.phoneCode // 短信验证码
				
				this.$api.user_team_add(data).then(res => {
					this.$toast(res.errmsg)
					if (res.errno == 0) {
						this.$router.go(-1);
					} else if (res.errno == 2) { // 短信验证码不正确
						this.phoneCode = ''
					} else if (res.errno == 3) { // 名称重复
						this.hasApply = true
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

			.bgxiexian {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 126px;
			}

			.leftImg {
				width: 214px;
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

		.tipCont {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			background: #3A3F4E;
			line-height: 40px;
			height: 40px;
			font-size: 13px;
			color: #C3C8D8;
			padding-left: 56px;
			border-radius: 5px;

			.leftImg {
				position: absolute;
				left: 2px;
				bottom: 0;
				width: 50px;
				height: 50px;
			}

			.rightImg {
				position: absolute;
				right: 0;
				top: 0;
				height: 40px;
			}
		}

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
		}
	}
</style>
