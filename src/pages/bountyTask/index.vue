<template>
	<div class="taskIndex">
		<div class="header">
			<div style="height:0.25rem"></div>
            <van-nav-bar :border="false" >
				<template #title>
					<img class="tit-img" src="../../images/bountyTask/index-nav-tit.png" alt="">
				</template>
				<template #right>
					<img class="right-img"  @click="leftBack()" src="../../images/bountyTask/close-icon.png" alt="">
				</template>
			</van-nav-bar>
			<div class="search-con">
				<form action="/" style="width:100%;height:100%">
        			 <van-search v-model="searchName" shape="round" background="transparent" placeholder="请输入任务标题" @search="onSearch" @clear="onSearch" clearable>
						<template #left-icon>
							<img style="width:0.4rem;vertical-align: text-top;" src="../../images/bountyTask/search-icon.png" alt="">
						</template>
					 </van-search>
				</form>
			</div>
		</div>
        <!-- <van-notice-bar class="notice-bar" left-icon="volume-o" :scrollable="false">
            <van-swipe vertical  class="notice-swipe"  :autoplay="2000" :show-indicators="false" >
                <van-swipe-item v-for="(item,index) in noticeList" :key="index">用户 <span class="masker">{{item.name}}</span> 完成悬赏提现成功 <span class="masker">{{item.price}}</span>元</van-swipe-item>
            </van-swipe>
        </van-notice-bar> -->
		<van-grid class="grid" :column-num="4" :border="false">
            <template v-if="taskTypeOption && taskTypeOption.length > 0">
				<van-grid-item v-for="(item, index) in taskTypeOption" :key="index"  @click="toTaskHall(item)"  v-if="index != 0">  
					<img :src="item.icon" alt="" />
					{{ item.name }}
				</van-grid-item>
			</template>
			<template v-else>
				<div class="task-type-status" @click="handleTaskType">
					<template v-if="taskTypeLoading">
						<img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
						<span>加载中...</span>
					</template>
					<template v-if="taskTypeErr">
						<span>任务类型获取失败,点击重新加载</span>
					</template>
				</div>
			</template>
		</van-grid>
		<div class="tab-box">
			<div class="tab-item" @click="toShowSheet(2)">
				<div class="left-icon">
					<img src="../../images/bountyTask/index-tab-icon1.png" alt="">
				</div>
				<div class="tab-text">{{sel2Tit ? sel2Tit : '全部类型'}}</div>
				<div class="right-icon">
					<img src="../../images/bountyTask/index-select-icon.png" alt="">
				</div>
			</div>
			<div class="tab-item" @click="showAddressPopup" >
				<div class="left-icon">
					<img src="../../images/bountyTask/index-addr-icon.png" alt="">
				</div>
				<div class="tab-text">{{curSelectAddr ? curSelectAddr : '选择地区'}}</div>
				<div class="right-icon">
					<img src="../../images/bountyTask/index-select-icon.png" alt="">
				</div>
			</div>
			<div class="tab-item" @click="toShowSheet(1)">
				<div class="left-icon">
					<img src="../../images/bountyTask/index-tab-icon2.png" alt="">
				</div>
				<div class="tab-text">{{sel1Tit}}</div>
				<div class="right-icon">
					<img src="../../images/bountyTask/index-select-icon.png" alt="">
				</div>
			</div>
		</div>
		<!-- <div class="dropdown">
			<van-dropdown-menu :close-on-click-overlay="false" :close-on-click-outside="false"	>
				<van-dropdown-item v-model="taskType" :options="taskTypeOption" @change="changeTaskType" />
				<van-dropdown-item  @open="showAddressPopup" ref="addr">
					<template #title>
						<span>{{curSelectAddr ? curSelectAddr : '选择地区'}}</span>
					</template>
				</van-dropdown-item>
				<van-dropdown-item title="筛选" ref="filter">
					<van-cell center title="最新发布" >
						<template #right-icon>
							<van-switch v-model="isNewDate" size="24" active-color="#ee0a24" />
						</template>
					</van-cell>
					<van-cell center title="价格由高到低">
						<template #right-icon>
							<van-switch v-model="isMaxPrice" size="24" active-color="#ee0a24" />
						</template>
					</van-cell>
					<van-cell center title="人气由高到低">
						<template #right-icon>
							<van-switch v-model="isMaxOrder" size="24" active-color="#ee0a24" />
						</template>
					</van-cell>
					<div style="padding: 5px 16px;">
						<van-button type="danger" block round @click="onFilterConfirm">
							确认
						</van-button>
					</div>
				</van-dropdown-item>
			</van-dropdown-menu>
		</div> -->
		<div class="team-banner-con" :class="{'team-bg': publish == 2}" v-if="isTeam && isTeam == 'true'" @click="changePublish">
			<div class="left-img">
				<template v-if="publish == 2">
					<img src="../../images/bountyTask/index-team-left-icon.png" alt="">
				</template>
				<template v-else>
					<img src="../../images/bountyTask/index-team-left-icon2.png" alt="">
				</template>
			</div>
			<div style="flex:1"></div>
			<div class="right-img">
				<img src="../../images/bountyTask/index-team-bg.png" alt="">
			</div>
			<div class="team-text">
				<template v-if="publish == 2">
					<img src="../../images/bountyTask/index-team-text.png" alt="">
				</template>
				<template v-else>
					<img src="../../images/bountyTask/index-team-text2.png" alt="">
				</template>
				
			</div>
		</div>
		<p class="hot-tit">推荐任务</p>
        <div class="task-box">
			<!-- <div class="task-group-type"  @click="toTaskHall()">
				<div class="name-con">
					<img class="icon" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/tuijian.png" alt="">
					<span class="desc">推荐</span>
				</div>
                <div class="more-con">
                    <span>更多<van-icon name="arrow" /></span>
                </div> 
			</div> -->
			<van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="!taskList || taskList.length == 0">
				<van-list v-model="loading" :finished="finished" :finished-text="taskList && taskList.length > 0 ? '~ 没有更多啦 ~' : (searchName ? '暂无搜索结果,请换个关键词试试(#^.^#)' : '暂无发布的任务')" @load="onLoad" >
					<template #loading>
                        <div class="list-loading-con">
                            <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                            <span>加载中...</span>
                        </div>
                    </template>
					<div class="task-group" v-for="(item, index) in taskList" :key="index" @click="toTaskDetail(item)">
						<div class="task-con">
							<div class="task-tit-con">
								<div class="task-tag-con">
									<div class="shu"></div>
									<div class="task-tit">{{item.title}}</div>
									<div class="tag">{{item.type_name}}</div>
								</div>
								<div class="task-desc-con">
									<div class="desc-item">
										<img class="icon" src="../../images/bountyTask/num-icon.png" alt="">
										<div class="text">剩余数量:{{item.num}}</div>
									</div>
									<div class="desc-item">
										<img class="icon" src="../../images/bountyTask/time-icon.png" alt="">
										<div class="text">做单时间:{{item.time_limit_name}}</div>
									</div>
								</div>
							</div>
							<div class="task-price-con">
								<div class="price-box">
									<img class="icon" src="../../images/bountyTask/price-icon.png" alt="">
									<span class="price">{{item.price}}</span>
								</div>
							</div>
						</div>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>
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
		<!-- 筛选 -->
		<van-action-sheet v-model="selectShow1" title="筛选" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sheetCancel(1)">
			<template v-if="sheetList.length > 0">
				<van-radio-group v-model="radioSel1">
					<van-cell :title="item.name" clickable v-for="(item, index) in sheetList" :key="index"
						@click="radioSel1 = item.val,radiSel1Title = item.name"
						:class="(radioSel1 == item.val) ? 'active' : ''">
						<template #right-icon>
							<van-radio :name="item.val">
								<template #icon="props">
									<img class="img-icon" :src="props.checked ? radioActiveIcon : radioIcon" />
								</template>
							</van-radio>
						</template>
					</van-cell>
				</van-radio-group>
			</template>
			<van-loading class="isLoadClass" v-if="isLoading" size="24px">加载中……</van-loading>
			<p class="sheetNull" v-if="sheetList.length == 0 && !isLoading">暂无</p>
		</van-action-sheet>
		<!-- 全部类型 -->
		<van-action-sheet v-model="selectShow2" title="选择类型" class="selSheet" :closeable="false" cancel-text="确定" @cancel="sheetCancel(2)">
			<template v-if="sheetList.length > 0">
				<div class="type-box">
					<div class="type-item" :class="{'active': radioSel2 == item.val}" v-for="(item, index) in sheetList" :key="index" @click="radioSel2 = item.val,radiSel2Title = item.name">{{item.name}}</div>
					<div class="clear" style="clear:both"></div> 
				</div>
			</template>
			<van-loading class="isLoadClass" v-if="isLoading" size="24px">加载中……</van-loading>
			<p class="sheetNull" v-if="sheetList.length == 0 && !isLoading">暂无</p>
		</van-action-sheet>
		
		<div style="height:1.73rem"></div>
        <taskBottom :idx="0"></taskBottom>

		<div class="fixed-full-con" @click.stop v-if="submitLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">{{publish == 1 ? '正在切换平台任务' : '正在切换普通任务'}}</span>
            </div>
        </div>
	</div>
</template>
<script>
    import taskBottom from "@/components/taskBottom";
	export default {
		name: "taskIndex",
		data() {
			return {
				isShowAddrPopup: false,
				changeAddrTit: '',
				curSelectAddr: '',
				optionId1: 0,
				optionId2: 0,
				addrOptions: [],
				selectCode: '',
				province_id: '',
				city_id: '',
				area_id:'',

				taskTypeLoading: false,
				taskTypeErr: false,
				taskTypeOption: [],
				searchName: '',
                taskType: '',
                // taskTypeOption: [
                //     { text: '全部类型', value: 0 },
                //     { text: '下载', value: 1 },
				// 	{ text: '注册', value: 2 },
				// ],
				isNewDate: true, // 是否最新发布
				isMaxPrice: false, // 是否最高价格
				isMaxOrder: false, // 是否最高人气
				loading: false,
				finished: false,
				isErr: false,
				page: 0,
				size: 10,
                taskList: [],
                
                noticeList: [{
                    name: '测试1',
                    price: 100
                },{
                    name: '张三',
                    price: 50
                },{
                    name: '李四',
                    price: 20
                },{
                    name: '王五',
                    price: 10
				}],
				
				radioSel1: '', 
				radiSel1Title: '',
				sheetList: [],
				radioIcon: require("../../images/radio.png"),
				radioActiveIcon: require("../../images/radioSel.png"),
				selectShow1: false,
				sel1Tit: '筛选',
				
				radioSel2: '', 
				radiSel2Title: '',
				selectShow2: false,
				sel2Tit: '全部类型',

				publish: 1,
				isTeam: false,

				isLoading: false,
				submitLoading: false
			};
        },
        components: {
			taskBottom,
		},
		mounted() {
			window.leftBack = this.leftBack
			this.publish = localStorage.getItem('publish') ? localStorage.getItem('publish') : 1
			this.isTeam = localStorage.getItem('isTeam') ? localStorage.getItem('isTeam') : false
			this.getConfig('reward_type')
			this.capitalAccountAdd()
			this.getAddress(1)
		},
		methods: {
            leftBack() {
				this.$router.push('/');
			},
			onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.onLoad()
			},
			// 切换普通任务与平台任务
			changePublish () {
				this.submitLoading = true
				this.page = 0
				this.loading = true
				this.finished = false
				this.taskList = []
				if (this.publish == 1) {
					localStorage.setItem('publish', 2)
				} else if (this.publish == 2) {
					localStorage.setItem('publish', 1)
				}
				setTimeout(() =>{
					this.onLoad()
				})
			},
			toShowSheet (type) {
				if (type == 1) {
					this.selectShow1 = true
					this.sheetList = [{
						name: '最新发布',
						val: 1
					},{
						name: '价格由高到低',
						val: 2
					},{
						name: '人气由高到低',
						val: 3
					}]
				} else if (type == 2) {
					this.selectShow2 = true
					this.sheetList = JSON.parse(JSON.stringify(this.taskTypeOption))
				}
			},
			sheetCancel (type) {
				this.selectShow1 = false
				this.selectShow2 = false
				if (type == 1) { // 选择合作社
					this.sel1Tit = this.radiSel1Title
					if (this.radioSel1 == 1) {
						this.isNewDate = true
						this.isMaxPrice = false
						this.isMaxOrder = false
					} else if (this.radioSel1 == 2) {
						this.isNewDate = false
						this.isMaxPrice = true
						this.isMaxOrder = false
					} else if (this.radioSel1 == 3) {
						this.isNewDate = false
						this.isMaxPrice = false
						this.isMaxOrder = true
					}
					this.page = 0
					this.loading = true
					this.finished = false
					this.taskList = []
					this.onLoad()
					// this.sel1Tit = this
				}  else if (type == 2) {
					this.sel2Tit = this.radiSel2Title
					this.page = 0
					this.loading = true
					this.finished = false
					this.taskList = []
					this.taskType = this.radioSel2
					this.onLoad()
				}
			},
			// 处理获取任务类型异常
			handleTaskType () {
				if (this.taskTypeLoading) return
				if (this.taskTypeErr) {
					this.taskTypeErr = false
					this.taskTypeLoading = true
					this.getConfig('reward_type')
				}
			},
			// 获取接单限时，审核时间，做单次数,任务类型配置信息
            getConfig (table) {
				this.taskTypeOption = []
				this.taskTypeLoading = true
				this.taskTypeErr = false
                this.$api.getConfig({
                    table: table
                }).then(res => {
					this.taskTypeLoading = false
					this.taskTypeErr = false
					if (res.errno == 0) {
						let tmpArr = [{
							name: "全部类型",
							icon: 'http://coopera.xfd365.com/public/uploads/20210616/16ecbba006a106b17d245ec198b23dfc.png',
							val: ''
						}]
						if (res.data) {
							res.data.forEach(item =>{
								item.name = item.type_name
								item.val = item.type_id
							})
						}
						this.taskTypeOption = tmpArr.concat(res.data)
					} else {
						this.$toast(res.errmsg)	
					
					}
				}).catch(err=>{
					this.taskTypeLoading = false
					this.taskTypeErr = true
					this.$toast('服务异常,请稍后重试')
				})
            },
			// 悬赏开户
			capitalAccountAdd () {
				this.$api.capitalAccountAdd({}).then(res => {
				}).catch(err => {
					this.$toast.clear()
				})
			},
			// 显示地区筛选框
			showAddressPopup () {
				this.isShowAddrPopup = true
				// setTimeout(() =>{
				// 	this.$refs.addr.toggle(false)
				// })
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
				this.curSelectAddr = selectedOptions.map((option) => option.text).join('/');
				this.page = 0
				this.loading = true
				this.finished = false
				this.taskList = []
				this.onLoad()
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
				} else if (activeTab == 2) {
					this.city_id = selectedOptions[1].value
				} else if (activeTab == 3) {
					this.area_id = selectedOptions[2].value
				}
				this.curSelectAddr = selectedOptions.map((option) => option.text).join('/')
				this.$refs.addrSelect.onClose()
				this.page = 0
				this.taskList = []
				this.onLoad()
			},
			// 地区取消
			selectAddrCancle () {
                this.curSelectAddr = ''
                this.province_id = ''
                this.city_id = ''
                this.area_id = ''
                this.selectCode = ''
                this.changeAddrTit = ''
				this.$refs.addrSelect.onClose()
				this.page = 0
				this.loading = true
				this.finished = false
				this.taskList = []
				this.onLoad()
			},
			// 确认筛选
			onFilterConfirm () {
				this.$refs.filter.toggle();
				this.page = 0
				this.loading = true
				this.finished = false
				this.taskList = []
				this.onLoad()
			},
			// 获取任务列表
			onLoad() {
				this.finished = false
				let page = this.page + 1
				this.loading = true
				let order = ''
				if (this.isNewDate) {
					order+='add_time desc'
				}
				if (this.isMaxPrice) {
					if (order) {
						order+=',price desc'
					} else {
						order+='price desc'
					}
				}
				if (this.isMaxOrder) {
					if (order) {
						order+=',renqi desc'
					} else {
						order+='renqi desc'
					}
				}
				this.$api.rewardLists({
					page: page,
					size: this.size,
					order: order,
					title: this.searchName,
					provinceCode: this.province_id,
					cityCode: this.city_id,
					areaCode: this.area_id,
					type_id: this.taskType,
					user_id: '',
					publish: localStorage.getItem('publish')
				}).then(res => {
					this.publish = localStorage.getItem('publish')
					this.loading = false
					this.isLoading = false
					if (res.errno == 0) {
						if (this.submitLoading) {
							this.$toast('切换' + (this.publish == 1 ? '普通任务' : '平台任务') + '成功')
						}
						this.submitLoading = false
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
								this.taskList = []
								this.taskList = data
							} else {
								this.taskList = this.taskList.concat(data)
							}
						}
						this.page = page
						if (this.page >= res.data.total) {
							this.finished = true
						} else {
							this.finished = false
						}
					} else {
						this.$toast(res.errmsg)	
						this.submitLoading = false
						this.finished = true
						this.page = 0
					}
				}).catch(err=>{
					this.submitLoading = false
					this.$toast('服务异常,请稍后重试')
					this.isLoading = false
					this.loading = false
					this.finished = true
					this.page = 0
					this.isErr = true
				})
			},
			// 搜索
			onSearch () {
				this.page = 0
				this.loading = true
				this.finished = false
				this.taskList = []
				this.onLoad()
			},
			// 改变任务类型
			changeTaskType () {
				this.page = 0
				this.loading = true
				this.finished = false
				this.taskList = []
				this.onLoad()
			},
			// 前往任务详情
			toTaskDetail (item) {
				this.$router.push({
					path: '/taskDetail',
					query: {
						id: item.reward_id
					}
				})
            },
            toTaskHall (item) {
                this.$router.push({
                    path: '/taskHall',
                    query: {
                        type: item ? item.val : ''
                    }
                })
            }
		}
	};
</script>
<style lang="less">
	.taskIndex {
		background: #f0f6fc;
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
		div {
			box-sizing: border-box;
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
			background: url('../../images/bountyTask/index-top-bg.png') no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 5.8rem;
			.tit-img {
				height: 0.45rem;
			}
			.right-img {
				height: 0.66rem;
			}
			.search-con {
				margin-top: 0.3rem;
				display: flex;
				justify-content: space-between;
                align-items: center;
                padding: 0 0.4rem;
                .van-search {
					width: 100%;
					padding: 0;
                    .van-search__content--round {
                        background: #fff;
                    }
                }
			}
			.left-nav-con {
				position: absolute;
				top: 50%;
				left: 0;
				transform: translateY(-50%);
				background: #1989fa;
				color: #fff;
				font-size: 0.34rem;
				width: 2.5rem;
				padding: 3px 0;
				border-top-right-radius: 100px;
				border-bottom-right-radius: 100px;
			}
		}
		.grid {
			width: calc(100% - 0.8rem);
			margin: 0 0.4rem 0 0.4rem;
			padding: 10px 0;
			background: #fff;
			border-radius: 15px;
			margin-top: -2.5rem;
			.task-type-status {
				display: flex;
                align-items: center;
				justify-content: center;
				width: 100%;
				min-height: 60px;
                img {
                    width: 1rem;
                    animation: cuIcon-spin 1s infinite linear;
                }
                @keyframes cuIcon-spin {
                    0% {
                        -webkit-transform: rotate(0);
                        transform: rotate(0);
                    }

                    100% {
                        -webkit-transform: rotate(359deg);
                        transform: rotate(359deg);
                    }
                }
			}
			.van-grid-item {
				width: 25%;
			}
			.van-grid-item__content {
				padding: 6px 8px;
				img {
					width: 57px;
					height: 57px;
				}
			}
		}
		.team-banner-con {
			width: calc(100% - 0.8rem);
			position: relative;
			display: flex;
			background: #cadff9;
			border-radius: 1000px;
			margin-left: 0.4rem;
			margin-top: 0.4rem;
			.left-img {
				padding-left: 0.4rem;
				display: flex;
				align-items: flex-end;
				img {
					height: 1.4rem;
				}
			}
			.right-img {
				img {
					height: 1.59rem;
				}
			}
			.team-text {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 0.66rem;
				img {
					height: 0.44rem
				}
			}
		}
		.team-bg {
			background: #fae4d3;
		}
		.hot-tit {
			width: 100%;
			padding: 0 0.4rem;
			font-size: 0.4rem;
			font-family: Microsoft YaHei, Microsoft YaHei-Regular;
			font-weight: bold;
			text-align: left;
			color: #444444;
			margin-top: 0.4rem;
		}
		.tab-box {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			padding: 0 0.4rem;
			.tab-item {
				margin-top: 0.4rem;
				width: calc((100% - 0.52rem)/3);
				display: flex;
				align-items: center;
				background: #fff;
				border-radius: 1000px;
				height: 0.8rem;
				padding: 0 0.26rem;
				margin-right: 0.26rem;
				.left-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 0.26rem;
					img {
						width: 100%;
					}
				}
				.tab-text {
					box-sizing: border-box;
					width: calc(100% - 0.5rem);
					padding: 0 0.1rem;
					color: #9aa8b6;
					font-size: 0.36rem;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					padding-bottom: 0;
				}
				.right-icon {
					display: flex;
					align-items: center;
					justify-content: center;
					width: 0.21rem;
					img {
						width: 100%;
					}
				}
			}
			.tab-item:last-child {
				margin-right: 0;
			}
		}
        .dropdown {
			margin-top: 20px;
		}
		
		.task-box {
			.list-loading-con {
                display: flex;
                align-items: center;
                justify-content: center;
                img {
                    width: 1rem;
                    animation: cuIcon-spin 1s infinite linear;
                }
                @keyframes cuIcon-spin {
                    0% {
                        -webkit-transform: rotate(0);
                        transform: rotate(0);
                    }

                    100% {
                        -webkit-transform: rotate(359deg);
                        transform: rotate(359deg);
                    }
                }
            }
			.van-pull-refresh {
                min-height: 100%;
            }
			.task-group-type {
				display: flex;
				align-items: center;
				padding: 6px 10px;
				.name-con {
					display: flex;
                    align-items: center;
                    flex:1;
					.icon {
						width: 0.7rem;
					}
					.desc {
						font-weight: bold;
						font-size: 14px;
					}
                }
                .more-con {
                    display: flex;
                    align-items:center;
                    justify-content: center;
                    span {
                        display: flex;
                        color: #999;
                    }
                }
			}
			.task-group {
				background: #fff;
				border-radius: 10px;
				margin-bottom: 15px;
				width: calc(100% - 0.8rem);
				margin-left: 0.4rem;
				margin-top: 0.4rem;
				.task-con {
					display: flex;
					align-items: center;
					padding: 0.4rem;
					.task-tit-con {
						flex: 1;
						display: flex;
						flex-direction: column;
						overflow: hidden;
						.task-tag-con {
							display: flex;
							align-items: center;
							margin-bottom: 0.28rem;
							.shu {
								width: 0.1rem;
								height: 0.25rem;
								background: #3b6af1;
								border-radius: 0.8rem;
								margin-right: 0.2rem;
							}
							.task-tit {
								max-width: 4rem;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: bold;
								text-align: left;
								color: #444444;
								font-size: 0.36rem;
								margin-right: 0.18rem;
								padding-bottom: 0;
							}
							.tag {
								background: #e2f4ff;
								border: 1px solid #3b6af1;
								border-radius: 18px;
								font-size: 0.26rem;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: 400;
								color: #3b6af1;
								padding: 0.06rem 0.12rem;
							}
						}
						.task-desc-con {
							display: flex;
							align-items: center;
							width: 100%;
							.desc-item {
								display: flex;
								align-items: center;
								margin-right: 0.4rem;
								.icon {
									width: 0.31rem;
									margin-right: 0.15rem;
								}
								.text {
									font-family: Microsoft YaHei, Microsoft YaHei-Regular;
									font-weight: 400;
									color: #9aa8b6;
									font-size: 0.31rem;
								}
							}
							.desc-item:last-child {
								margin-right: 0;
							}
						}
					}
				}
				.task-price-con {
					display: flex;
					flex-direction: column;
					align-items: center;
					.price-box {
						display: flex;
						align-items: center;
						background: linear-gradient(#3b6af1 0%, #5b95ff 100%);
						border-radius: 100px;
						padding: 0.18rem 0.15rem;
						.icon {
							width: 0.53rem;
							margin-right: 0.08rem;
						}
						.price {
							font-size: 0.45rem;
							font-weight: 700;
							font-family: DIN, DIN-Bold;
							color: #ffffff;
						}
					}
				}
			}
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
        .notice-bar {
            background:transparent;
            .notice-swipe {
                height: 40px;
                line-height: 40px;
                color: #999;
                .masker {
                    color: #ed6a0c
                }
            }
		}
		
		// 选择
		.selSheet {
			z-index: 999999;
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

			.van-tag--primary {
				background: #3B6AF1;
				padding: 2px 6px;
				transform: scale(0.9);
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

			.isLoadClass {
				padding: 10px 0;
				text-align: center;
			}

			.sheetNull {
				margin: 20px 0;
				color: #666666;
				text-align: center;
			}

			.content {
				padding: 20px 0;
				display: flex;
				justify-content: space-around;

				.item {
					text-align: center;

					img {
						width: 70px;
					}

					p {
						margin-top: 10px;
						font-size: 15px;
					}
				}
			}
		}
		// 任务类型
		.type-box {
			padding: 0.26rem 0.4rem;
			.type-item {
				width: calc((100% - 0.8rem)/3);
				margin-right: 0.4rem;
				margin-bottom: 0.4rem;
				height: 0.93rem;
				background: #f0f6fc;
				color: #9aa8b6;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 0.36rem;
				border-radius: 1000px;
				float: left;
			}
			.active {
				border: 1px solid #3b6af1;
				background: #e2f4ff;
				color: #3b6af1;
			}
			.type-item:nth-child(3n) {
				margin-right: 0;
			}
		}

		.fixed-full-con {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background:  rgba(0, 0, 0, 0.3);
			z-index: 9999;
            .cu-load::before {
                font-family: "cuIcon";
                display: inline-block;
                margin-right: 6px;
            }
            .load-modal {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 4rem;
                height: 4rem;
                transform: translate(-50%,-50%);
                background-color: #ffffff;
                border-radius: 10px;
                // box-shadow: 0 0 0px 2000px rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
                font-size: 28px;
                z-index: 9999;
                text-align: center;
                .logo {
                    width: 1.2rem;
                }
                .text {
                    font-size: 0.4rem;
                    margin-top: 10px;
                }
            }
            .load-modal::after {
                content: "";
                position: absolute;
                background-color: #ffffff;
                border-radius: 50%;
                width: 75%;
                height: 75%;
                font-size: 14px;
                border-top: 5px solid rgba(0, 0, 0, 0.05);
                border-right: 5px solid rgba(0, 0, 0, 0.05);
                border-bottom: 5px solid rgba(0, 0, 0, 0.05);
                border-left: 5px solid #f37b1d;
                animation: cuIcon-spin 1s infinite linear;
                z-index: -1;
            }
            @keyframes cuIcon-spin {
                0% {
                    -webkit-transform: rotate(0);
                    transform: rotate(0);
                }

                100% {
                    -webkit-transform: rotate(359deg);
                    transform: rotate(359deg);
                }
            }

        }
        
	}
</style>
