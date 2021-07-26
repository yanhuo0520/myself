<template>
	<div class="taskDetail" >
		<van-pull-refresh v-model="isLoading" @refresh="onRefresh" >
			<!-- <div class="count-down" v-if="orderDetail && orderDetail.jiedan == 1">
				<span style="color:#fff">距离结束：</span>
				<van-count-down :time="orderDetail.time*1000" @finish="countDownFinish()">
					<template #default="timeData">
						<span class="block">{{ timeData.days }}</span>
						<span class="colon">天</span>
						<span class="block">{{ timeData.hours }}</span>
						<span class="colon">时</span>
						<span class="block">{{ timeData.minutes }}</span>
						<span class="colon">分</span>
						<span class="block">{{ timeData.seconds }}</span>
						<span class="colon">秒</span>
					</template>
				</van-count-down>
			</div> -->
			<div class="hearder-con">
				<img class="bg" src="../../images/bountyTask/detail-top-bg.png" alt="">
				<div class="absolute-top-box">
					<van-nav-bar :border="false"  title="任务详情"  left-arrow @click-left="leftBack" @click-right="rightClick">
						<template #right>
							<van-icon name="weapp-nav" />
						</template>
					</van-nav-bar>
					<div class="header">
						<div class="img">
							<img :src="imgPhote" />
						</div>
						<div class="name-con">
							<p class="name">{{userName}}</p>
							<p class="desc">{{orderDetail.guan_all}}人关注</p>
						</div>
						<div class="follow-btn">
							<template v-if="isFollow">
								<div class="btn follow" @click="toFollow(isFollow)">
									<img class="icon" src="../../images/bountyTask/detail-follow-icon.png" alt="">
									<span>已关注</span>
								</div>
							</template>
							<template v-else>
								<div class="btn" @click="toFollow(isFollow)">
									<img class="icon" src="../../images/bountyTask/detail-follow-icon.png" alt="">
									<span>关注</span>
								</div>
							</template>
						</div>
					</div>
					<div class="task-group">
						<div class="top-box">
							<div class="tit-con">
								<div class="tit">{{orderDetail.title}}</div>
								<div class="tag">{{orderDetail.type_name}}</div>
							</div>
							<div class="top-img">
								<img src="../../images/bountyTask/detail-top-icon.png" alt="">
							</div>
							<div style="flex:1;background: #f0f8ff;"></div>
						</div>
						<div class="bottom-box">
							<div class="bot-item-con">
								<div class="top-con">
									<div class="num">{{orderDetail.price}}</div>
									<img class="icon" src="../../images/bountyTask/detail-yuan-icon.png" alt="">
								</div>
								<div class="bot-con">
									<div class="desc">悬赏单价</div>
								</div>
							</div>
							<div class="bot-item-con">
								<div class="top-con">
									<div class="num">{{orderDetail.stock}}</div>
									<img class="icon" src="../../images/bountyTask/detail-jian-icon.png" alt="">
								</div>
								<div class="bot-con">
									<div class="desc">剩余数量</div>
								</div>
							</div>
							<div class="bot-item-con">
								<div class="top-con">
									<div class="num">{{((orderDetail.num - orderDetail.stock)*(orderDetail.price * 1000))/1000}}</div>
									<img class="icon" src="../../images/bountyTask/detail-yuan-icon.png" alt="">
								</div>
								<div class="bot-con">
									<div class="desc">累计悬赏</div>
								</div>
							</div>
							<div class="bot-item-con">
								<div class="top-con">
									<div class="num">{{orderDetail.timeNum}}</div>
									<template v-if="orderDetail.timeType == 1">
										<img class="icon" src="../../images/bountyTask/detail-fen-icon.png" alt="">
									</template>
									<template v-if="orderDetail.timeType == 2">
										<img class="icon" src="../../images/bountyTask/detail-shi-icon.png" alt="">
									</template>
									<template v-if="orderDetail.timeType == 3">
										<img class="icon" src="../../images/bountyTask/detail-tian-icon.png" alt="">
									</template>
								</div>
								<div class="bot-con">
									<div class="desc">做单时间</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<van-sticky>
				<div class="tab-box">
					<div class="tab-con">
						<div class="tab-item" @click="handleTabClick(1)">
							<img :src="status == 1 ? tabImgArr[0] : tabImgArr[1]" alt="">
						</div>
						<div class="tab-item" @click="handleTabClick(2)">
							<img :src="status == 2 ? tabImgArr[2] : tabImgArr[3]" alt="">
						</div>
						<div class="tab-item" @click="handleTabClick(3)">
							<img :src="status == 3 ? tabImgArr[4] : tabImgArr[5]" alt="">
						</div>
					</div>
					<div style="flex:1"></div>
				</div>
			</van-sticky>
			<div class="task-info-box" v-if="status == 1">
				<div class="task-info-group">
					<div class="task-info-tit">
						<div class="tit-con">
							<img src="../../images/bountyTask/detail-info-icon.png" alt="">
							<span class="tit">任务说明</span>
						</div>
					</div>
					<div class="task-info-desc">
						{{orderDetail.name ? ('(项目名称:'+ orderDetail.name+')') : ''}}{{orderDetail.note}}
					</div>
				</div>
				<div class="task-info-group">
					<div class="task-info-tit">
						<div class="tit-con">
							<img src="../../images/bountyTask/detail-info-icon.png" alt="">
							<span class="tit">任务所属区域</span>
						</div>
					</div>
					<div class="task-info-desc">
						{{orderDetail.address ? ('仅限' + orderDetail.address) : '全部地区'}}
					</div>
				</div>
				<div class="task-info-group">
					<div class="task-info-tit">
						<div class="tit-con">
							<img src="../../images/bountyTask/detail-info-icon.png" alt="">
							<span class="tit">其它主要事项</span>
						</div>
					</div>
					<div class="task-info-tip">
						<div class="info-tip-item">
							<div class="label">审核时间：</div>
							<div class="val">{{orderDetail.verify_time_name}}</div>
						</div>
						<div class="info-tip-item">
							<div class="label">做单次数：</div>
							<div class="val">{{orderDetail.make_num_name}}</div>
						</div>
						<div style="clear:both"></div>
					</div>
				</div>
			</div>
			<div class="step-box" v-if="status == 2">
				<div class="step-group-tit">
					<div class="tit-con">
						<img class="icon" src="../../images/bountyTask/detail-step-start.png" alt="">
						<span class="text">共计{{stepList.length}}步</span>
					</div>
				</div>
				<div class="step-con">
					<div class="step-item-group" v-for="(item, index) in stepList" :key="index">
						<div class="dot"></div>
						<div class="step-end" v-if="index == (stepList.length - 1)">
							<img  src="../../images/bountyTask/detail-task-btn-icon.png" alt="">
						</div>
						<div class="step-item">
							<div class="step-item-tit van-hairline--bottom">
								<div class="step">{{index+1}}</div>
								<span class="tit">{{item.step_title}}</span>
							</div>
							<div class="step-item-box">
								<div class="step-item-con">
									<div class="step-item-desc">
										<span  v-if="item.type == 2">链接/口令: </span>
										{{item.content}}
									</div>
									<div class="link-btn-con" v-if="item.type == 2">
										<div class="btn" ref="copy"  v-clipboard="item.content" @success="copyTextSuccess" @error="copyTextError">
											<img src="../../images/bountyTask/detail-copy-btn.png"    alt="">
										</div>
										<!-- <van-button ref="copy"  v-clipboard="item.content" @success.native="copyTextSuccess" @error.native="copyTextError"  round type="info" size="small" >复制链接</van-button> -->
									</div>
									<div class="step-img-con clearfix"  v-if="item.type == 1">
										<img v-for="(subItem, subIndex) in item.pic" :key="subIndex" :src="subItem" alt="">
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="evaluate-con" v-if="status == 3">
				<van-list v-model="loading" :finished="finished" @load="getCommentLists" :finished-text="data && data.length > 0 ? '' : ''" >
					<template #finished>
						<span v-if="data && data.length > 0">
							~ 没有更多啦 ~
						</span>
						<div v-else>
							<img style="width:80%;margin-top:1rem" src="../../images/bountyTask/detail-no-evaluate.png" alt="">
						</div>
					</template>
					<div class="evaluate-item van-hairline--bottom" v-for="(item,index) in data" :key="index">
						<div class="top ">
							<div class="name-con">
								<img :src="item.photo ? item.photo : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/niming.png'" alt="">
								<span class="name">{{item.user_name}}</span>
							</div>
							<div class="date-con">
								<img class="icon" src="../../images/mutualCircle/time-icon.png" alt="">
								<span>{{item.add_time}}</span>
							</div>
						</div> 
						<div class="evaluate">
							{{item.comment}}
						</div>
					</div>
				</van-list>
			</div>
			<!-- <van-cell-group class="task-group" >
				<div class="task-id">任务ID: {{orderDetail.reward_id}}</div>
				<div class="task-tit-con">
					<div class="tit">{{orderDetail.title}}</div>
					<div class="price">+{{orderDetail.price}}元</div>
				</div>
				<div class="task-params-con van-hairline--top">
					<div class="task-item-con">
						<div class="param">{{orderDetail.stock}}</div>
						<div class="desc">剩余数量</div>
					</div>
					<div class="task-item-con">
						<div class="param">{{orderDetail.num - orderDetail.stock}}</div>
						<div class="desc">人已赚到</div>
					</div>
					<div class="task-item-con">
						<div class="param">{{orderDetail.time_limit_name}}</div>
						<div class="desc">做单时间</div>
					</div>
					<div class="task-item-con">
						<div class="param">{{orderDetail.verify_time_name}}</div>
						<div class="desc">审核时间</div>
					</div>
				</div>
			</van-cell-group>
			<van-cell-group class="task-group"  style="margin-top:15px">
				<div class="task-tit-con">
					<div class="tit">任务说明</div>
				</div>
				<div class="task-params-con van-hairline--top" style="color:#999">
					{{orderDetail.note}}
				</div>
			</van-cell-group> -->
			<!-- <van-tabs v-model="active" style="margin-top:15px">
				<van-tab title="做单步骤" name="1"></van-tab>
				<van-tab title="任务评价" name="2"></van-tab>
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
							</div>
						</div>
					</div>
				</template>
				<template v-if="active == 2">
					<div class="evaluate-con">
						<van-list v-model="loading" :finished="finished" @load="getCommentLists" :finished-text="data && data.length > 0 ? '没有更多了' : '暂无评价'" >
							<div class="evaluate-item van-hairline--bottom" v-for="(item,index) in data" :key="index">
								<div class="top ">
									<div class="name-con">
										<img :src="item.photo ? item.photo : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/niming.png'" alt="">
										<span class="name">{{item.user_name}}</span>
									</div>
									<div class="date">
										{{item.add_time}}
									</div>
								</div> 
								<div class="evaluate">
									{{item.comment}}
								</div>
							</div>
						</van-list>
					</div>
				</template>
			</div> -->
			<template  v-if="orderDetail && orderDetail.jiedan == 1">
				<div style="height:1.6rem"></div>
				<div class="time-limit-con">
					<div style="width:1.97rem"></div>
					<div class="text">距离该任务完成倒计时:</div>
					<div class="time-con">
						<van-count-down :time="orderDetail.time*1000" @finish="countDownFinish()">
							<template #default="timeData">
								<span class="block">{{ timeData.days }}</span>
								<span class="colon">:</span>
								<span class="block">{{ timeData.hours }}</span>
								<span class="colon">:</span>
								<span class="block">{{ timeData.minutes }}</span>
								<span class="colon">:</span>
								<span class="block">{{ timeData.seconds }}</span>
								<!-- <span class="colon">:</span> -->
							</template>
						</van-count-down>
					</div>
					<div class="time-bg">
						<img src="../../images/bountyTask/detail-time-limit-bg.png" alt="">
					</div>
					<div class="time-icon">
						<img src="../../images/bountyTask/detail-time-limit-icon.png" alt="">
					</div>
				</div>
			</template>
			<div style="height:50px"></div>
			<div class="footer-btn-con">
				<van-button block type="info" :disabled="orderDetail.status == 2 || orderDetail.jiedan == 2 || orderDetail.jiedan == 3" @click="userRewardAdd">
					<template #icon >
						<img src="../../images/bountyTask/detail-task-btn-icon.png" alt="">
					</template>
					{{orderDetail.status == 2 ? '任务已完结' : orderDetail.jiedan == 0 ? '领取任务' : (orderDetail.jiedan == 1 ? '领取成功,点击提交' : (orderDetail.jiedan == 2 ? '审核中' : '无领取次数,'+orderDetail.make_num_name)) }}
				</van-button>
			</div>
		</van-pull-refresh>
		<van-share-sheet
			v-model="showShare"
			title="快捷入口"
			:options="options"
			@select="onSelect"
		/>
		<van-popup class="type-popup-con" v-model="isShowTypePopup" round position="bottom"  style="min-height:60%" >
            <div class="type-popup">
                <div class="type-popup-tit">
                    <div class="tit">选择举报原因</div>
                    <div class="close-con" @click="isShowTypePopup = false">
                        <van-icon name="close" size="20px"/>
                    </div>
                </div>
                <van-radio-group v-model="type">
                    <van-cell-group class="type-group">
                        <van-cell :title="item.content" clickable v-for="(item, index) in typeOption" :key="index" @click="selectType(item)">
                            <template #right-icon>
                                <van-radio :name="item.id" />
                            </template>
                        </van-cell>
						<van-field v-model="content" label="投诉内容" rows="3" autosize type="textarea" maxlength="200"   show-word-limit placeholder="请输入您的投诉内容(选填)" />
						<van-field v-model="wxNo" label="微信号"  placeholder="请输入您的微信号(选填)" />
                    </van-cell-group>
                </van-radio-group>
				<div class="report-btn-con">
					<van-button  block type="danger" @click="confirmReport">确定举报</van-button>
				</div>
            </div>
        </van-popup>

		<van-popup v-model="isReceivePopup" class="receive-popup">
			<div class="receive-box">
				<div class="close-icon" @click.stop="isReceivePopup = false">
					<van-icon name="close" />
				</div>
				<div class="top-icon">
					<img src="../../images/bountyTask/detail-popup-icon.png" alt="">
				</div>
				<div class="img">
					<img src="../../images/bountyTask/detail-popup-img.png" alt="">
				</div>
				<div class="receive-desc-con">
					<div class="tit">领取成功</div>
					<div class="tit">
						请您在内<span class="masker">{{orderDetail.time_limit_name}}</span>完成任务
					</div>
				</div>
				<div class="btn-con">
					<div class="btn-item" @click.stop="isReceivePopup = false">我知道了</div>
				</div>
			</div>
		</van-popup>

		<div class="fixed-full-con" @click.stop v-if="isDetailLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">加载中...</span>
            </div>
        </div>
	</div>
</template>
<script>
	import VueClipboards from 'vue-clipboards'
    import Vue from 'vue'
	Vue.use(VueClipboards)
	export default {
		name: "taskDetail",
		data() {
			return {
				tabImgArr: [require('../../images/bountyTask/detail-tab1-select-icon.png'),require('../../images/bountyTask/detail-tab1-icon.png'),require('../../images/bountyTask/detail-tab2-select-icon.png'),require('../../images/bountyTask/detail-tab2-icon.png'),require('../../images/bountyTask/detail-tab3-select-icon.png'),require('../../images/bountyTask/detail-tab3-icon.png')],
				id: '',
                orderDetail: '',
                userName: '',
				imgPhote: '',
				active: '',
				stepList: [],
				isFollow: false,
				showShare: false,
				options: [
					{ name: '我的关注', icon: 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/guanzhu.png', value: 1 },
					{ name: '任务大厅', icon: 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/task.png', value: 2 },
					{ name: '举报任务', icon: 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/jubao.png', value: 3 }
				],
				type: '',
                typeName: '',
				typeOption: [],
				isShowTypePopup: false,
				content: '',
				wxNo: '',
				loading: false,
				isDetailLoading: true,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
				data: [],

				status: 1,
				lastStatus: 1,
				
				isReceivePopup: false,
				
				isLoading: false,
				submitLoding: false
			};
		},
		mounted() {
			window.leftBack = this.leftBack
			// this.stepList = localStorage.getItem('stepList') ? JSON.parse(localStorage.getItem('stepList')) : []
			this.id = this.$route.query.id ? this.$route.query.id : ''
			if (this.id) {
				this.getTaskDetail()
				this.getCommentLists()
				this.geTaskReportLists()
			}
		},
		methods: {
			leftBack() {
				let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
				if (lastPath) {
					if (lastPath == '/taskHall') {
						this.$router.push({
							path: '/taskHall'
						})
					} else if (lastPath == '/taskList') {
						this.$router.push({
							path: '/taskList',
							query: {
								status: this.$route.query.status
							}
						})
					} else {
						this.$router.go(-1)
					}
				} else {
					this.$router.go(-1)
				}
			},
			rightClick () {
				this.showShare = true
			},
			// 详情刷新
			onRefresh() {
                this.getTaskDetail()
			},
			// 获取任务详情
			getTaskDetail () {
				this.$api.reward_detail_make_user({
					reward_id: this.id
				}).then(res => {
					this.isLoading = false
					this.isDetailLoading = false
					if (res.errno == 0) {
						res.data.address = ''
						if (res.data.province_name) {
							res.data.address+=res.data.province_name
						}
						if (res.data.city_name) {
							res.data.address+=res.data.city_name
						}
						if (res.data.area_name) {
							res.data.address+=res.data.area_name
						}
						res.data.timeNum = 0
						res.data.timeType = 1 // 1-分钟 2-小时 3-天
						if (res.data.time_limit_name) {
							if (res.data.time_limit_name.indexOf('分钟') > - 1) {
								res.data.timeNum = res.data.time_limit_name.split('分钟')[0]
								res.data.timeType = 1
							}
							if (res.data.time_limit_name.indexOf('小时') > - 1) {
								res.data.timeNum = res.data.time_limit_name.split('小时')[0]
								res.data.timeType = 2
							}
							if (res.data.time_limit_name.indexOf('天') > - 1) {
								res.data.timeNum = res.data.time_limit_name.split('天')[0]
								res.data.timeType = 3
							}
						}
						this.orderDetail = res.data
						this.stepList = res.data.step_data
						if (this.stepList && this.stepList.length > 0) {
							this.stepList.forEach(item =>{
								if (item.pic) {
									item.pic = item.pic.split(',')
								}
							})
						}
						this.isFollow = res.data.is_guan == 0 ? false : true
						this.userName = res.data.user_name
						// if (res.data.photo) {
							this.imgPhote = res.data.photo ?  res.data.photo : 'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png'
						// } else {
						// 	this.imgPhote = require("../../images/header.png")
						// }
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.isLoading = false
					this.isDetailLoading = false
					this.$toast('服务异常,请稍后重试')
				})
			},
			// 获取评价列表
			getCommentLists () {
				this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
				this.$api.commentLists({
					page: page,
                    size: this.size,
					reward_id: this.id
				}).then(res => {
					this.loading = false
					if (res.errno == 0) {
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
								this.data = data
							} else {
								this.data = this.data.concat(data)
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
						this.finished = true
                        this.page = 0
                        this.data = []
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.data = []
					this.isErr = true
				})
			},
			// 切换tab栏
            handleTabClick(type) {
                this.status = type;
                // if (this.status == this.lastStatus && !this.isErr) return
                // this.lastStatus = this.status
                // this.page = 0
                // this.loading = true
                // this.finished = false
                // this.data = [];
                // this.getData()
            },
			// 获取举报题目列表
			geTaskReportLists () {
				this.$api.taskReportLists({}).then(res => {
					if (res.errno == 0) {
						this.typeOption = res.data
					} else {
						this.$toast(res.errmsg)	
					
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
			},
			// 复制链接
            copyTextSuccess(e) {
				this.$toast('复制成功!')
			},
			copyTextError(e) {
				this.$toast('复制失败!')
			},
			// 关注/取消关注
			toFollow (type) {
				this.$api.guanAdd({
					user_id: this.orderDetail.user_id
				}).then(res => {
					if (res.errno == 0) {
						if (type) {
							this.isFollow = false
							this.orderDetail.guan_all = Number(this.orderDetail.guan_all) - 1
						} else {
							this.isFollow = true
							this.orderDetail.guan_all = Number(this.orderDetail.guan_all) + 1
						}
						this.$toast(this.isFollow ? '关注成功' : '已取消关注')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
			},
			onSelect(option) {
				if (option.value == 3) {
					this.isShowTypePopup = true
				} else {
					if (option.value == 1) {
						this.$router.push({
							path: '/followList',
							query: {
								lastPath: '/taskDetail'
							}
						})
					} else if (option.value == 2) {
						this.$router.push({
							path: '/taskHall',
							query: {
								lastPath: '/taskDetail'
							}
						})
					}
				}
				this.showShare = false;
			},
			// 选择举报原因
            selectType (row) {
                this.type = row.id
                this.typeName = row.content
            },
			// 确定举报
			confirmReport () {
				if (!this.type) {
					this.$toast('请选择一条举报原因')
					return
				}
				this.$api.taskReportAdd({
					reward_id: this.id,
					content: this.content,
					wx_int: this.wxNo,
					config_id: this.type
				}).then(res => {
					this.submitLoding = false
					if (res.errno == 0) {
						this.$toast('举报成功,官方将对此任务严查')
						this.type = ''
						this.wxNo = ''
						this.content = ''
                		this.isShowTypePopup = false
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast('服务异常,请稍后重试')
				})
			},
			// 任务倒计时结束
			countDownFinish () {
				this.orderDetail.jiedan = 0
			},
			// 领取任务
			userRewardAdd () {
				if (this.orderDetail.jiedan == 0) {
					if (this.submitLoding) return
					this.submitLoding = true
					this.$api.userRewardAdd({
						reward_id: this.id
					}).then(res => {
						this.submitLoding = false
						if (res.errno == 0) {
							this.isReceivePopup = true
							this.getTaskDetail()
						} else {
							this.$toast(res.errmsg)
						}
					}).catch(err => {
						this.submitLoding = false
						this.$toast('服务异常,请稍后重试')
					})
				} else {
					if (this.orderDetail.jiedan == 1) {
						let params = {
							title: this.orderDetail.title,
							type_name: this.orderDetail.type_name,
							status: 1,
							status_name: '进行中',
							price: this.orderDetail.price,
							make_pic: '',
							make_content: '',
							note: ''
						}
						this.$router.push({
							path: '/submitTask',
							query: {
								lastPath: '/taskDetail',
								reward_make_id: this.orderDetail.reward_make_id,
								reward_id: this.orderDetail.reward_id,
								detail: JSON.stringify(params)
							}
						})
						return
					}
					if (this.orderDetail.jiedan == 2) {
						this.$toast('正在审核中')
						return
					}
				}
			},
		},
	}
</script>
<style lang="less">
	.taskDetail {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		// background: url(../../images/bgHeader5.png) no-repeat;
		// background-size: 100% 120px;
		background-color: #f0f6fc;	
		div {
			box-sizing: border-box;
		}
		.van-pull-refresh {
			height: 100%;
			overflow-y: auto;
		}
		.hearder-con {
			width: 100%;
			position: relative;
			.bg {
				width: 100%;
			}
			.absolute-top-box {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				.header {
					margin: 0.6rem 0.4rem 0 0.4rem;
					text-align: center;
					display: flex;
					align-items: center;
					.img {
						width: 1.2rem;
						height: 1.2rem;
						position: relative;
						background: #f7f8fa;
						border-radius: 50%;
						border: 2px solid rgba(255,255,255,0.40);
						margin-right: 0.33rem;
						img {
							width: 100%;
							height: 100%;
							object-fit: cover;
							border-radius: 50%;
						}
					}
					.name-con {
						display: flex;
						flex-direction: column;
						align-items: flex-start;
						flex: 1;
						.name {
							font-size: 0.4rem;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							color: #fff;
						}
						.desc {
							margin-top: 0.24rem;
							font-size: 0.32rem;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							color: #bbcfff;
						}
					}
					.follow-btn {
						display: flex;
						align-items: center;
						justify-content: center;
						.btn {
							background: rgba(255,255,255,0.80);
							color: #222222;
							border-radius: 1000px;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-size: 0.4rem;
							font-weight: 400;
							padding: 0.16rem 0.32rem;
							.icon {
								height: 0.4rem;
								vertical-align: bottom;
							}
						}
						.follow {
							opacity: 0.8;
						}
					}
				}
			}
			.van-nav-bar {
				margin-top: 0.4rem;
				// background: url(../../images/bgHeader5.png) no-repeat top center;
				// background-size: 100% 227px;
				background: transparent;

				.van-icon {
					color: #fff;
				}
				.van-nav-bar__title {
					font-size: 0.42rem;
					font-weight: bold;
					color: #fff;
				}
			}
		}
		
		// .count-down {
		// 	display: flex;
		// 	align-items: center;
		// 	justify-content: center;
		// 	padding: 10px;
		// 	background: #000;
		// 	.colon {
		// 		display: inline-block;
		// 		color: #292d39;
		// 		font-size: 0.32rem;
		// 	}
		// 	.block {
		// 		display: inline-block;
		// 		color: #fff;
		// 		font-size: 0.32rem;
		// 		padding: 0.08rem;
		// 		text-align: center;
		// 		background-color: #2a2f3c;
		// 		border-radius: 0.13rem;
		// 	}
		// }

		
		.task-group { 
			position: absolute;
			width: calc(100% - 0.8rem);
			bottom: 0;
            margin: 0 0.4rem;
			background: #f0f8ff;
			display: flex;
			flex-direction: column;
			border-radius: 0.26rem 0.26rem 0px 0px;
			overflow: hidden;
			.top-box {
				display: flex;
				.tit-con {
					display: flex;
					align-items: center;
					padding-left: 0.4rem;
					background: #fff;
					.tit {
						font-size: 0.38rem;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						color: #222222;
						font-weight: 400	;
						margin-right: 4px;
						white-space: nowrap;
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
				.top-img {
					width: 1.73rem;
					background: #fff;
					img {
						display: block;
						width: 100%;
					}
				}
			}
			.bottom-box {
				width: 100%;
				height: 2.4rem;
				display: flex;
				.bot-item-con {
					width: 25%;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					.top-con {
						position: relative;
						.num {
							font-size: 0.53rem;
							font-family: DIN, DIN-Medium;
							font-weight: 500;
							color: #222222;
						}
						.icon {
							position: absolute;
							top: 0;
							right: -0.1rem;
							width: 0.4rem;
							transform: translate(100%,-50%)
						}
					}
					.bot-con {
						font-size: 0.32rem;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						text-align: center;
						color: #9aa8b6;
						margin-top: 0.32rem;
					}
				}
			}
		}
		.tab-box {
            display: flex;
            align-items: center;
            flex-direction: column;
			background: linear-gradient(0deg,#f0f6fc 0%, #ffffff 100%);
			height: 4rem;
			padding: 0 0.4rem;
			padding-top: 0.15rem;
            .tab-con {
                display: flex;
                align-items: center;
                width: 100%;
                .tab-item {
                    width: 50%;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 0.3rem;
                    height: 1rem;
                    img {
                        // height: 0.38rem;
                        width: 54%;
                    }
                }
            }
        }
        .van-sticky--fixed {
            z-index: 9999;
            .tab-box {
                border-radius: inherit;
                height: 1.2rem;
            }
		}
		.task-info-box {
			width: calc(100% - 0.8rem);
			margin: 0 0.4rem;
			margin-top: -2.4rem;
			.task-info-group {
				background: #fff;
				padding: 0.4rem;
				border-radius: 10px;
				margin-bottom: 0.4rem;
				.task-info-tit {
					display: flex;
					.tit-con {
						display: flex;
						align-items: center;
						background: #e4f2ff;
						border-radius: 0px 0.26rem 0px 0px;
						font-size: 0.34rem;
						font-family: Microsoft YaHei, Microsoft YaHei-Bold;
						font-weight: 700;
						color: #444;
						.tit {
							padding-right: 0.3rem;
							padding-left: 0.15rem;
						}
						img {
							width: 0.53rem;
						}
					}
				}
				.task-info-desc {
					margin-top: 0.4rem;
					font-size: 0.38rem;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					text-align: justifyLeft;
					color: #444444;
				}
				.task-info-tip {
					margin-top: 0.4rem;
					.info-tip-item {
						width: 50%;
						display: flex;
						float: left;
						font-size: 0.4rem;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						.label {
							color: #9aa8b6;
						}
						.val {
							color: #444444;
						}
					}
				}
			}
		}
		.step-box {
			width: calc(100% - 1.04rem);
			margin: -2.4rem 0.4rem 0 0.66rem;
			.step-group-tit {
				display: flex;
				align-items: center;
				padding-bottom: 0.53rem;
				border-left: 1px solid #3b6af1;
				.tit-con {
					display: flex;
					background: #3b6af1;
					border-radius: 100px;
					padding: 0.1rem 0.1rem;
					margin-left: -0.28rem;
					.icon {
						width: 0.36rem;
						margin-right: 0.1rem;
					}
					.text {
						font-size: 0.35rem;
						color: #fff;
					}
				}
			}
			.step-con {
				.step-item-group {
					position: relative;
					padding-left: 0.4rem;
					padding-bottom: 0.4rem;
					// margin-bottom: 0.5rem;
					border-left: 1px solid #3b6af1;
					.dot {
						width: 5px;
						height: 5px;
						border-radius: 50%;
						background: #3b6af1;
						position: absolute;
						left: -0.5px;
						top: 0;
						transform: translate(-50%,-50%);
					}
					.step-end {
						width: 0.32rem;
						height: 0.32rem;
						position: absolute;
						left: 0;
						bottom: 0;
						transform: translateX(-50%);
						background: #3b6af1;
						border-radius: 50%;
						img {
							width: 100%;
							height: 100%;
							border-radius: 50%;
						}
					}
					.step-item {
						display: flex;
						flex-direction: column;
						border-radius: 6px;
						background: #fff;
						
						.step-item-tit {
							padding: 0.4rem;
							display: flex;
							align-items: center;
							.step {
								width: 0.53rem;
								height: 0.53rem;
								background: linear-gradient(180deg,#d4e2f0 0%, #eaf2f9 100%);
								color: #ffffff;
								font-size: 0.34rem;
								font-weight: bold;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
								margin-right: 0.2rem;
							}
							.tit {
								font-size: 0.4rem;
								font-family: Microsoft YaHei, Microsoft YaHei-Regular;
								font-weight: bold;
								color: #444444;
							}
						}
						.step-item-box {
							display: flex;
							flex-direction: column;
							padding: 0.4rem;
							.link-btn-con {
								width: 100%;
								display: flex;
								align-items: center;
								justify-content: flex-end;
								.btn {
									img {
										width: 1.33rem;
									}
								}
							}
							.step-item-con {
								width: 100%;
								.step-item-desc {
									font-size: 0.4rem;
									font-family: Microsoft YaHei, Microsoft YaHei-Regular;
									font-weight: 400;
									text-align: left;
									color: #9aa8b6;
									margin-bottom: 0.4rem;
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
		}
		.evaluate-con {
			width: calc(100% - 0.8rem);
			margin: 0 0.4rem;
			margin-top: -2.4rem;
			.evaluate-item {
				padding: 0.4rem;
				background: #fff;
				border-radius: 10px;
				margin-bottom: 0.4rem;
				.top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					.name-con {
						display: flex;
						align-items: center;
						img {
							width: 0.53rem;
							height: 0.53rem;
							border-radius: 50%;
							object-fit: cover;
						}
						.name {
							margin-left: 0.15rem;
							font-size: 0.4rem;
							font-family: Microsoft YaHei, Microsoft YaHei-Regular;
							font-weight: 400;
							color: #222222;
						}
					}
					.date-con {
						background: #f0f6fc;
						border-radius: 100px;
						font-size: 0.32rem;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						color: #9aa8b6;
						padding: 0.06rem 0.2rem;
						.icon {
							width: 0.32rem;
						}
						// .date {
							
						// }
					}
				}
				.evaluate {
					margin-top: 0.4rem;
					color: #000;
					font-size: 0.4rem;
					font-family: Microsoft YaHei, Microsoft YaHei-Regular;
					font-weight: 400;
					text-align: justifyLeft;
					color: #444444;
				}
			}
		}
		.van-tabs__wrap {
			border-top-left-radius: 10px;
			border-top-right-radius: 10px;
		}
		.footer-btn-con {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			background: #fff;
			.van-button__icon {
				display: flex;
				align-items: center;
				margin-right: 0.06rem;
				img {
					width: 0.4rem;
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
		
		.receive-popup {
			width: 68%;
			overflow: inherit;
			border-radius: 0.26rem;
			.receive-box {
				position: relative;
				.top-icon {
					position: absolute;
					top: 0;
					right: 18%;
					transform: translateY(-50%);
					width: 1.2rem;
					img {
						width: 100%;
					}
				}
				.close-icon {
					position: absolute;
					bottom: -2.5rem;
					left: 50%;
					transform: translateX(-50%);
					color: #fff;
					font-size: 0.6rem;
				}
				.receive-desc-con {
					display: flex;
					align-items: center;
					justify-content: center;
					flex-direction: column;
					margin-top: 0.9rem;
					margin-bottom: 1.2rem;
					.tit {
						font-size: 0.4rem;
						font-family: Microsoft YaHei, Microsoft YaHei-Regular;
						font-weight: 400;
						color: #444444;
						line-height: 1.5;
						.masker {
							color: #3b6af1;
						}
					}
				}
				.btn-con {
					display: flex;
					align-items: center;
					justify-content: center;
					margin-bottom: 0.66rem;
					.btn-item {
						width: 5.45rem;
						height: 0.93rem;
						opacity: 1;
						background: #3b6af1;
						border-radius: 30px;
						display: flex;
						align-items: center;
						color: #fff;
						justify-content: center;
					}
					.btn-item:active {
						opacity: 0.6;
					}
				}
				.img {
					padding-left: 0.4rem;
					img {
						width: 100%;
					}
				}
			}
		}

		.time-limit-con {
			position: fixed;
			width: calc(100% - 0.52rem);
			left: 0.26rem;
			bottom: 50px;
			display: flex;
			align-items: center;
			background: #3a3f4e;
			border-radius: 5px;
			height: 1.06rem;
			.text {
				font-size: 0.34rem;
				font-family: Microsoft YaHei, Microsoft YaHei-Regular;
				font-weight: 400;
				color: #c3c8d8;
				margin-right: 0.15rem;
			}
			.colon {
				display: inline-block;
				color: #292d39;
				font-size: 0.4rem;
				font-weight: bold;
			}
			.time-con {
				position: relative;
				.block {
					display: inline-block;
					color: #fff;
					font-size: 0.32rem;
					width: 0.5rem;
					height: 0.5rem;
					text-align: center;
					background-color: #2a2f3c;
					border-radius: 0.13rem;
					line-height: 0.5rem;
				}
			}
			.time-bg {
				position: absolute;
				right: 0;
				bottom: 0;
				width: 2.95rem;
				height: 1.06rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
			.time-icon {
				position: absolute;
				bottom: 0;
				left: 0.13rem;
				width: 1.6rem;
				height: 1.6rem;
				img {
					width: 100%;
					height: 100%;
				}
			}
			
		}
	}
</style>
