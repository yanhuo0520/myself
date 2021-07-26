<template>
	<div class="editTask">
		<div class="header"></div>
        <van-nav-bar :border="false"  :title="status == 5 ? '发布详情' : '发布详情'" left-arrow  @click-left="leftBack"/>
        <van-form class="form-con" @submit="onSubmit">
            <van-cell-group class="cell-group">
                <van-field v-model="typeName" label="任务类型" name="任务类型" placeholder="请选择任务类型" readonly 
                    :rules="[{ required: true, message: '请选择任务类型' }]"
                    @click="showPopup('type')"/>
                <van-field v-model="title" label="任务标题" name="任务标题" placeholder="请输入任务标题,12字以内" maxlength="12" readonly
                    :rules="[{ required: true, message: '请输入任务标题' }]"
                />
                <van-field v-model="name" label="项目名称" name="项目名称" placeholder="请输入项目名称,7字以内" maxlength="7"   readonly/>
                <van-field v-model="note" type="textarea" :rows="2" autosize label="任务说明" name="任务说明"  maxlength="200"   show-word-limit placeholder="请输入任务数码,200字以内" readonly
                    :rules="[{ required: true, message: '请输入任务说明' }]"
                />
                <van-field v-model="address" label="任务所属区域" placeholder="请选择任务所属区域" readonly @click="showPopup('addr')"/>
            </van-cell-group>

            <van-cell-group class="cell-group">
                <van-field v-model="timeLimitName" label="接单限时" name="接单限时" placeholder="请选择接单限时" readonly 
                    :rules="[{ required: true, message: '请选择接单限时' }]"
                    @click="showPopup('timeLimit')"/>
                <van-field v-model="verifyTimeName" label="审核时间" name="审核时间" placeholder="请选择审核时间" readonly
                    :rules="[{ required: true, message: '请选择审核时间' }]"
                    @click="showPopup('verifyTime')"/>
                <van-field v-model="makeNumName" label="做单次数" name="做单次数" placeholder="请选择做单次数" readonly 
                    :rules="[{ required: true, message: '请选择做单次数' }]"
                    @click="showPopup('makeNum')" />
            </van-cell-group>

            <van-cell-group class="cell-group">
                <van-field v-model="price" label="悬赏单价" type="number" placeholder="请输入悬赏单价"  @input="bindInput('price')" readonly
                    :rules="[{ required: true, message: '请输入悬赏单价' }]"
                />
                <van-field v-model="num" label="悬赏数量" type="digit" placeholder="请输入悬赏数量" @input="bindInput('digit')" readonly
                    :rules="[{ required: true, message: '请输入悬赏数量' }]"
                />
                <van-field v-model="advance" label="预付赏金" placeholder="0" readonly/>
            </van-cell-group>
            
            <!-- <template v-if="status == 5">
                <div style="margin-top:16px;width: 65%; margin-left:17.5%">
                    <van-button round block type="info" native-type="button" @click.stop="addStep">{{stepList && stepList.length > 0 ? '已设置【'+stepList.length+'】个步骤,点击查看' : '添加做单步骤'}}</van-button>
                </div>
            </template>
            <template v-else> -->
                <van-tabs v-model="active" style="margin-top:15px">
                    <van-tab title="做单步骤" name="1"></van-tab>
                </van-tabs>
                <div class="tab-con">
                    <template v-if="active == 1">
                        <div class="step-con">
                            <div class="step-item" v-for="(item, index) in stepList" :key="index">
                                <div class="step-item-tit">【步骤{{item.step}}】{{item.step_title}}</div>
                                <div class="step-item-box">
                                    <div class="step-item-con">
                                        <div class="step-item-desc"><span style="color:#333" v-if="item.type == 2">链接/口令: </span>{{item.content}}</div>
                                        <div class="link-btn-con" v-if="item.type == 2">
                                            <van-button ref="copy"  v-clipboard="item.content" @success.native="copyTextSuccess" @error.native="copyTextError"  round type="info" size="small" >复制链接</van-button>
                                        </div>
                                        <div class="step-img-con clearfix"  v-if="item.type == 1">
                                            <img v-for="(subItem, subIndex) in item.pic" :key="subIndex" :src="subItem" alt="">
                                        </div>
                                    </div>
                                    <!-- <div class="item-btn-con van-hairline--top">
                                        <div style="flex:1"></div>
                                        <div class="btn" @click="editItem(item,index)">编辑</div>
                                        <div class="btn del" @click="delItem(index)">删除</div>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            <!-- </template> -->

            <div style="width:100%; height:100px"></div>
            <div class="submit-con">
                <template v-if="status == 5">
                    <!-- <van-checkbox v-model="isAgree">
                        <span>已阅读并同意<span style="color:#1989fa" @click="toArticleDetail()">《任务发布规则》</span></span>
                    </van-checkbox>
                    <van-button round block type="info" native-type="submit">发布</van-button> -->
                        <span v-if="errNote">拒绝原因:<span style="color:red">{{errNote}}</span></span>
                    <van-button round block type="info" native-type="button">审核失败</van-button>
                </template>
                <template v-else>
                    <template  v-if="status == 1">
                        <van-button round block type="info" native-type="button" @click="toSale()">{{isShow ? '下架' : '上架'}}</van-button>
                    </template>
                    <template  v-if="status == 0">
                        <van-button round block type="info" native-type="button">审核中</van-button>
                    </template>
                    <template  v-if="status == 2">
                        <van-button round block type="info" native-type="button">任务已完成</van-button>
                    </template>
                    <template  v-if="status == 3">
                        <van-button round block type="info" native-type="button">任务已删除</van-button>
                    </template>
                    <template  v-if="status == 4">
                        <van-button round block type="info" native-type="button" @click="toPay()">去付款</van-button>
                    </template>
                    <template  v-if="status == 5">
                        <van-button round block type="info" native-type="button">审核失败</van-button>
                    </template>
                </template>
            </div>
        </van-form>
		<!-- 请选择任务地区 -->
		<van-popup v-model="isShowAddrPopup" round position="bottom">
			<van-cascader v-model="selectCode" :closeable="false" ref="addrSelect" :options="addrOptions" active-color="#1989fa" @close="isShowAddrPopup = false" @change="onSelectAddrChange" @finish="onSelectAddrFinish" >
				<template #title>
					<div class="slect-tit-con">
						<div class="text cancle" @click="selectAddrCancle">全部地区</div>
						<div class="tit">
							<template v-if="changeAddrTit">
								<span class="masker">{{changeAddrTit}}</span>
							</template>
							<template v-else>
								<span class="masker">请选择任务地区</span>
							</template>
						</div>
						<div class="text confirm" @click="selectAddrConfirm">确定</div>
					</div>
				</template>
			</van-cascader>
		</van-popup>
        <van-popup class="type-popup-con" v-model="isShowTypePopup" round position="bottom"  style="max-height:60%" >
            <div class="type-popup">
                <div class="type-popup-tit">
                    <div class="tit">选择任务类型</div>
                    <div class="close-con" @click="isShowTypePopup = false">
                        <van-icon name="close" size="20px"/>
                    </div>
                </div>
                <van-radio-group v-model="type">
                    <van-cell-group class="type-group">
                        <van-cell :title="item.text" :icon="item.icon" clickable v-for="(item, index) in typeOption" :key="index" @click="selectType(item)">
                            <template #right-icon>
                                <van-radio :name="item.value" />
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
            </div>
        </van-popup>
        <!-- 接单限时 -->
        <van-action-sheet v-model="isShowTimeLimit" :actions="timeLimitOption" cancel-text="取消" @select="onTimeLimitSelect" />
        <!-- 审核时间 -->
        <van-action-sheet v-model="isShowVerifyTime" :actions="verifyTimeOption" cancel-text="取消" @select="onVerifyTimeSelect" />
        <!-- 做单次数 -->
        <van-action-sheet v-model="isShowMakeNum" :actions="makeNumOption" cancel-text="取消" @select="onMakeNumSelect" />
        
	</div>
</template>
<script>
	export default {
		name: "editTask",
		data() {
			return {
                isShowTypePopup: false,
                isShowAddrPopup: false,
                isShowTimeLimit: false,
                isShowVerifyTime: false,
                isShowMakeNum: false,

                timeLimitOption: [
                    { name: '加载中', loading: true }
                ],
                verifyTimeOption: [
                    { name: '加载中', loading: true }
                ],
                makeNumOption: [
                    { name: '加载中', loading: true }
                ],

                stepList: [],

				changeAddrTit: '',
				address: '',
				optionId1: 0,
				optionId2: 0,
				addrOptions: [],
				selectCode: '',
				province_id: '',
				city_id: '',
                area_id:'',

                name: '',
                title: '',
                type: 0,
                typeName: '',
                typeOption: [],
                note: '',
                timeLimit: '',
                timeLimitName: '',
                verifyTime: '',
                verifyTimeName: '',
                makeNum: '',
                makeNumName: '',
                price: '',
                num: '',
                advance: 0,
                address: '',
                isAgree: false,
                id: '',
                status: '',
                isShow: false,
                active: '1',
                errNote: ''
			};
		},
		mounted() {
            // this.getConfig('reward_time_limit')
            // this.getConfig('reward_verify_time')
            // this.getConfig('reward_make_num')
            // this.getConfig('reward_type')
            window.leftBack = this.leftBack
            this.initData()
		},
		methods: {
            leftBack() {
                let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
                if (lastPath) {
                    if (lastPath == '/manageTask') {
				        this.$router.push({
                            path: '/manageTask',
                            query: {
                                status: this.$route.query.main_status
                            }
                        });
                    } else {
                        this.$router.go(-1)
                    }
                } else {
                    this.$router.go(-1)
                }
            },
            initData () {
                this.changeAddrTit = ''
				this.address = ''
				this.optionId1 = 0
				this.optionId2 =  0
				this.addrOptions = []
				this.selectCode = ''
				this.province_id = ''
				this.city_id = ''
                this.area_id = ''
                this.name = ''
                this.title = ''
                this.type = 0
                this.typeName = ''
                this.note = ''
                this.timeLimit = ''
                this.timeLimitName = ''
                this.verifyTime = ''
                this.verifyTimeName = ''
                this.makeNum = ''
                this.makeNumName = ''
                this.price = ''
                this.num = ''
                this.advance =  0
                this.id = this.$route.query.id ? this.$route.query.id : ''
                this.status = this.$route.query.status ? this.$route.query.status : ''
                this.taskDetail()
                // this.getAddress(1)
            },
            initOldData () {
                let taskForm = JSON.parse(localStorage.getItem('taskForm'))
                this.changeAddrTit = taskForm.changeAddrTit
				this.optionId1 = taskForm.optionId1
				this.optionId2 =  taskForm.optionId2
				this.addrOptions = taskForm.addrOptions
				this.selectCode = taskForm.selectCode
				this.province_id = taskForm.province_id
				this.city_id = taskForm.city_id
                this.area_id = taskForm.area_id
                this.name = taskForm.name
                this.title = taskForm.title
                this.type = taskForm.type
                this.typeName = taskForm.typeName
                this.note = taskForm.note
                this.timeLimit = taskForm.timeLimit
                this.timeLimitName = taskForm.timeLimitName
                this.verifyTime = taskForm.verifyTime
                this.verifyTimeName = taskForm.verifyTimeName
                this.makeNum = taskForm.makeNum
                this.makeNumName = taskForm.makeNumName
                this.price = taskForm.price
                this.num = taskForm.num
                this.advance =  taskForm.advance
                this.address = taskForm.address
            },
            // 显示弹窗
            showPopup (type) {
                return
                // if (this.status != 5) return
                if (type == 'type') {
                    this.isShowTypePopup = true
                } else if (type == 'addr') {
                    this.isShowAddrPopup = true
                } else if (type == 'timeLimit') {
                    this.isShowTimeLimit = true
                } else if (type == 'verifyTime') {
                    this.isShowVerifyTime = true
                } else if (type == 'makeNum') {
                    this.isShowMakeNum = true
                }
            },
            // 任务详情
            taskDetail () {
                this.$api.rewardDetail({
                    reward_id: this.id
                }).then(res => {
					if (res.errno == 0) {
                        let data = res.data
                        // this.changeAddrTit = ''
                        // this.addrOptions = []
                        // this.selectCode = ''
                        // this.province_id = ''
                        // this.city_id = ''
                        // this.area_id = ''
                       
                        this.name = data.name
                        this.title = data.title
                        this.typeName = data.type_name
                        this.note = data.note
                        this.timeLimitName = data.time_limit_name
                        this.verifyTimeName = data.verify_time_name
                        this.makeNumName = data.make_num_name
                        this.price = data.price
                        this.num = data.num
                        this.advance =  data.advance
                        this.isShow = data.is_show  == 1 ? true : false

                        this.errNote = data.remarks

                        data.step_data.forEach(item =>{
                            item.pic = item.pic ? item.pic.split(',') : '' 
                        })
                        // console.log(JSON.stringify(data.step_data))
                        this.stepList = data.step_data
                        let tmpAddr = ''
                        if (data.province_name || data.city_name || data.area_name) {
                            if (data.province_name) {
                                tmpAddr+=data.province_name
                            } 
                            if (data.city_name) {
                                tmpAddr+=data.city_name
                            }
                            if (data.area_name) {
                                tmpAddr+=data.area_name
                            }
                            this.address = tmpAddr
                        } else {
                            this.address = '全部地区'
                        }
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 获取接单限时，审核时间，做单次数配置信息
            getConfig (table) {
                this.$api.getConfig({
                    table: table
                }).then(res => {
					if (res.errno == 0) {
                        if (table == 'reward_time_limit') {
                            res.data.forEach(item =>{
                                item.name = item.time_limit_name,
                                item.value = item.time_limit_id
                            })
                            this.timeLimitOption = res.data
                        } else if (table == 'reward_verify_time') {
                            res.data.forEach(item =>{
                                item.name = item.verify_time_name,
                                item.value = item.verify_time_id
                            })
                            this.verifyTimeOption = res.data
                        } else if (table == 'reward_make_num') {
                            res.data.forEach(item =>{
                                item.name = item.make_num_name,
                                item.value = item.make_num_id
                            })
                            this.makeNumOption = res.data
                        } else if (table == 'reward_type') {
                            res.data.forEach(item =>{
                                item.text = item.type_name,
                                item.value = item.type_id
                            })
                            this.typeOption = res.data
                        }
					} else {
						this.$toast(res.errmsg)	
					
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
            },
            setStorage () {
                let taskForm = {
                    changeAddrTit: this.changeAddrTit,
                    address: this.address,
                    optionId1: this.optionId1,
                    optionId2: this.optionId2,
                    addrOptions: this.addrOptions,
                    selectCode: this.selectCode,
                    province_id: this.province_id,
                    city_id: this.city_id,
                    area_id:this.area_id,
                    name: this.name,
                    title: this.title,
                    type: this.type,
                    typeName: this.typeName,
                    note: this.note,
                    timeLimit: this.timeLimit,
                    timeLimitName: this.timeLimitName,
                    verifyTime: this.verifyTime,
                    verifyTimeName: this.verifyTimeName,
                    makeNum: this.makeNum,
                    makeNumName: this.makeNumName,
                    price: this.price,
                    num: this.num,
                    advance: this.advance,
                    address: this.address
                }
                localStorage.setItem('taskForm', JSON.stringify(taskForm))
            },
            // 查看任务发布规则
            toArticleDetail () {
                this.setStorage()
                this.$router.push({
                    path: '/articleDetail',
                    query: {
                        id: 66,
                        lastPath: '/editTask'
                    }
                })
            },
            // 添加步骤
            addStep () {
                this.setStorage()
                setTimeout(() =>{
                    this.$router.push('/addStep')
                })
            },
            // 限时任务类型弹窗
            selectType (row) {
                this.type = row.value
                this.typeName = row.text
                this.isShowTypePopup = false
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
						this.addrOptions = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 地区选择改变
			onSelectAddrChange({value, selectedOptions, tabIndex}) {
				if (tabIndex == 0) {
					this.optionId1 = selectedOptions[0].id
				} else if (tabIndex == 1) {
					this.optionId2 = selectedOptions[1].id
				}
				this.changeAddrTit = selectedOptions.map((option) => option.text).join('/');
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
								this.addrOptions[this.optionId1].children = res.data;
							} else if (tabIndex == 1) {
								let children1 = this.addrOptions[this.optionId1].children
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
			// 地区选择完成
			onSelectAddrFinish({selectedOptions}) {
				this.isShowAddrPopup = false;
				this.province_id = selectedOptions[0].value
				this.city_id = selectedOptions[1].value
				this.area_id = selectedOptions[2].value
				this.address = selectedOptions.map((option) => option.text).join('/');
			},
			// 地区确认完成
			selectAddrConfirm () {
				if (!this.$refs.addrSelect.value) {
					this.$toast('请先选择地区')
					return
				}
				let selectedOptions = this.$refs.addrSelect.getSelectedOptionsByValue(this.$refs.addrSelect.options,this.$refs.addrSelect.value)
				let activeTab = this.$refs.addrSelect.activeTab
				if (activeTab == 1) {
                    this.province_id = selectedOptions[0].value
                    this.city_id = ''
                    this.area_id = ''
				} else if (activeTab == 2) {
                    this.city_id = selectedOptions[1].value
                    this.area_id = ''
				} else if (activeTab == 3) {
					this.area_id = selectedOptions[2].value
                }
				this.address = selectedOptions.map((option) => option.text).join('/')
				this.$refs.addrSelect.onClose()
			},
			// 地区取消
			selectAddrCancle () {
                this.province_id = ''
                this.city_id = ''
                this.area_id = ''
                this.selectCode = ''
                this.changeAddrTit = ''
				this.$refs.addrSelect.onClose()
			},
			// 确认筛选
			onFilterConfirm () {
				this.$refs.filter.toggle();
            },
            // 接单限时选择
            onTimeLimitSelect (row) {
                this.timeLimit = row.time_limit_id
                this.timeLimitName = row.time_limit_name
                this.isShowTimeLimit = false
            },
            // 审核时间选择
            onVerifyTimeSelect (row) {
                this.verifyTime = row.verify_time_id
                this.verifyTimeName = row.verify_time_name
                this.isShowVerifyTime = false
            },
            // 做单次数选择
            onMakeNumSelect (row) {
                this.makeNum = row.make_num_id
                this.makeNumName = row.make_num_name
                this.isShowMakeNum = false
            },
            // 悬赏单价与数量改变
            bindInput (type) {
                if (type == 'price') {
                } else if (type == 'digit') {
                }
                this.advance = (Number(this.price)*1000 * Number(this.num))/1000
            },
            onSubmit (values) {
                if (this.stepList && this.stepList.length > 0) {
                    if (!this.isAgree) {
                        this.$toast('请先阅读任务发布规则')
                        return
                    }
                    let tmpStepList = JSON.parse(JSON.stringify(this.stepList))
                    tmpStepList.forEach(item =>{
                        item.pic = item.pic.join(',')
                    })
                    let params = {
                        name: this.name,
                        title: this.title,
                        type_id: this.type,
                        note:  this.note,
                        time_limit_id: this.timeLimit,
                        verify_time_id: this.verifyTime,
                        make_num_id: this.verifyTime,
                        price: this.price,
                        num: this.num,
                        advance: this.advance,
                        provinceCode: this.province_id,
                        cityCode: this.city_id,
                        areaCode: this.area_id,
                        step_data: tmpStepList
                    }
                    this.$toast.loading({
                        duration: 0, // 持续展示 toast
                        forbidClick: true,
                        message: '正在提交...',
                    })
                    this.$api.rewardAdd(params).then(res => {
                        this.$toast.clear()
                        if (res.errno == 0) {
                            let tmpPrice = JSON.parse(JSON.stringify(this.advance))
                            this.initData()
                            localStorage.removeItem('taskForm')
                            localStorage.removeItem('stepList')
                            setTimeout(() =>{
                                this.$router.push({
                                    path: '/taskPay',
                                    query: {
                                        price: tmpPrice,
                                        id: res.reward_id
                                    }
                                })
                            })
                        } else {
                            if (res.advance) {
                                this.advance = res.advance
                            }
                            this.$toast(res.errmsg)
                        }
                        console.log(res)
                    }).catch(err => {
                        this.$toast('服务异常,请稍后重试')
                    })
                } else {
                    this.$toast('请先添加操作步骤！')
                }
            },
            // 上下架
            toSale (item) {
                this.$api.rewardIsShow({
                    reward_id: this.id,
                    is_show: this.isShow ? 0 : 1
                }).then(res => {
					if (res.errno == 0) {
                        this.isShow = !this.isShow
                        this.$toast(this.isShow ? '上架成功' : '下架成功')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 去付款
            toPay () {
                this.$router.push({
                    path: '/taskPay',
                    query: {
                        price: this.advance,
                        id: this.id
                    }
                })
            },

		}
	};
</script>
<style lang="less">
	.editTask {
		background: #f0f6fc;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        .form-con {
            flex: 1;
            overflow: hidden;
            overflow-y: auto;
            .submit-con {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                background: #fff;
                box-shadow: 3px 3px 6px #ccc;
                padding: 10px 15px;
                box-sizing: border-box;
                box-shadow: 0px -6px 6px -6px #ccc; 
                z-index: 999
            }
        }
        .van-nav-bar {
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
            position: fixed;
            top: 0;
            left: 0;
			background: url(../../images/bgHeader1.png) no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 115px;
        }
        .cell-group {
            margin: 10px;
            border-radius: 8px;
            box-shadow: 3px 3px 6px #ccc;
            overflow: hidden;
        }
		.slect-tit-con {
			display: flex;
			align-items: center;
			justify-items: center;
			.text {
				width: 50px;
				height: 50px;
				color: #7045f2;
            }
            .cancle {
                width: 70px!important;
            }
			.tit {
				flex: 1;
				display: block;
				overflow: hidden; 
				text-overflow: ellipsis;
				white-space: nowrap; 
			}
		}
		.van-cascader__title {
			width: 100%;
			height: 100%;
			line-height: normal;
			.slect-tit-con {
				width: 100%;
				height: 100%;
				.text {
					width: 50px;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.tit {
					text-align: center;
					.masker {
						font-weight: bold;
					}
				}
			}
        }
        .van-tabs__wrap {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
		}
		.tab-con {
            position: relative;
			background: #fff;
			padding: 10px;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			.step-con {
				.step-item {
                    display: flex;
                    flex-direction: column;
                    border-radius: 6px;
                    background: #fff;
                    padding: 10px;
                    box-shadow: 3px 3px 6px #ccc;
                    margin-bottom: 10px;
                    .step-item-tit {
                        font-size: 14px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .step-item-box {
                        display: flex;
                        flex-direction: column;
                        .link-btn-con {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .step-item-con {
                            width: 100%;
                            .step-item-desc {
                                color: #666;
                                padding-left: 5px;
                            }
                            .step-img-con {
                                margin-top: 6px;
                                img {
                                    width: 100%;
                                    float: left;
                                }
                            }
                        }
                        .item-btn-con {
                            margin-top: 10px;
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            padding: 8px 0;
                            .btn {
                                padding: 8px 14px;
                                background: #fff;
                                color: #1989fa;
                                border-radius: 1000px;
                                margin-left: 10px; 
                                border: 1px solid #1989fa;
                            }
                            .del {
                                background: #f56c6c;
                                color: #fff;
                                border-color: #f56c6c;
                            }
                        }
                    }
                }
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
            }
            
        }
	}
</style>
