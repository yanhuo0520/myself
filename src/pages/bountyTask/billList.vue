<template>
	<div class="billList" >
        <div class="head-con">
            <van-nav-bar title="收益明细" :border="false" left-arrow @click-left="leftBack"/>
            <div class="banner" style="height:200px" ></div>
            <div class="head-absolute-center">
                <div class="desc">可提现余额</div>
                <div class="num">{{price}}</div>
                <div class="tip-con">
                    <!-- <img class="img" src="./images/question-icon.png" alt=""> -->
                    <span class="tip"></span>
                    <div class="btn-con" @click="toWithdrawr()">立即提现</div>
                </div>
            </div>
            <van-sticky>
                <div class="tit-con">
                    <div class="tit">余额明细</div>
                    <div class="month" @click="dateShow = true; dayType = 1">
                        <span class="text">{{curShowDate}}</span>
                        <img class="icon" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/date-draw-icon.png" alt="">
                    </div>
                </div>
            </van-sticky>
        </div>
		<div class="list-con">
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="!list || list.length == 0">
                <van-list v-model="loading" :finished="finished" :finished-text="list && list.length > 0 ? '没有更多了' : ''" @load="getDetail" >
                    <template #loading>
                        <div class="list-loading-con">
                            <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                            <span>加载中...</span>
                        </div>
                    </template>
                    <div class="list-item-con" :class="{'van-hairline--bottom': (index+1 != list.length) }" v-for="(item,index) in list" :key="index" @click="toDetail(item)">
                        <template v-if="item.type == 3 ">
                            <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/withdraw-icon.png" alt="">
                        </template>
                        <template v-else-if="item.type == 1 ">
                            <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/chongzhi.png" alt="">
                        </template>
                        <template v-else>
                            <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/money.png" alt="">
                        </template>
                        <div class="order-info">
                            <div class="tit">{{(item.type == 1 ? '充值' : (item.type == 2 ? '任务收益' : (item.type == 3 ? '提现' : '支出'))) + (item.str ? ('-'+item.str) : '')}}</div>
                            <div class="no" v-if="item.desc">{{item.desc}}</div>
                            <div class="date">{{item.add_time}}</div>
                        </div>
                        <div class="price">
                            <span :class="{'add': item.status == 1 && (item.type == 1 || item.type == 2)}">{{(item.status == 2 || item.status == 4) ? '' : (item.type == 1 || item.type == 2 ? '+' : '-')}}{{item.money}}</span>
                            <span class="status" :class="{'nopay': item.status == 4, 'shenhe': item.status == 3}" v-if="item.status != 1">
                                {{item.type == 1 ? '' : (item.type == 2 ? '任务收益' : (item.type == 3 ? '' : '支出'))}}
                                <template v-if="item.status == 2">
                                   <template v-if="item.cls == 2">
                                       <span style="color:#000">已全额退款</span>
                                   </template>
                                   <template v-else>失败</template>
                                </template>
                                <template v-if="item.status == 3">
                                   审核中
                                </template>
                                <template v-if="item.status == 4">
                                   未支付
                                </template>
                            </span>
                        </div>
                    </div>
                </van-list>
            </van-pull-refresh>
			<template v-if="(!list || list.length == 0 || isErr) && !loading">
				<div class="no-data">
					<div class="no-data-con">
						<img :src="isErr ? errImg : noDataImg" alt="">
						<p class="no-title">{{ isErr ? '网络竟然崩溃了' : '暂无余额明细'}}</p>
						<p class="no-desc">{{ isErr ? '别紧张,试试看刷新页面' : '请尝试切换搜索时间' }}</p>
						<van-button size="small" plain round color="#01C327" v-if="isErr" @click="handleErr">刷新</van-button>
					</div>
				</div>
			</template>
		</div>
		<div style="height: 25px;"></div>
		<van-popup v-model="dateShow" position="bottom" style="height: 100%;">
			<div class="popup-tit">
				<div class="text" @click="dateShow = false">取消</div>
				<div  class="tit">选择时间</div>
				<div  class="text color-green" @click="dateConfirmByMonth">完成</div>
			</div>
			<div class="date-type-con">
                <div class="date-type" @click="changeDateType">按{{dateType == 1 ? '日' : '月'}}选择</div>
                <div class="date-type date-type-all" @click="selectAllDate">全部时间</div>
            </div>
			<div class="select-date-con">
				<template v-if="dateType == 1">
					<div class="date">
                        <span v-if="selectMonth">{{selectMonth}}</span>
                        <span v-else style="color:#999">点我选择月份</span>
                    </div>
				</template>
				<template v-if="dateType == 2">
					<div class="date" :class="{'border-color': dayType == 2}" @click="dayType = 1">
                        <span v-if="startDate">{{startDate}}</span>
                        <span v-else style="color:#999">点我选择开始时间</span>
                    </div>
					<div class="mask">至</div>
					<div class="date" :class="{'border-color': dayType == 1}"  @click="dayType = 2">
                        <span v-if="endDate">{{endDate}}</span>
                        <span v-else style="color:#999">点我选择结束时间</span>
                    </div>
				</template>
			</div>
			<template v-if="dateType == 1">
				<van-datetime-picker ref="monthpicker" :min-date="minDate" :max-date="maxDate" v-model="curMonth" type="year-month" :show-toolbar="false" :formatter="formatter" @change="changeDateByMonth" @confirm="confirmByMonth"></van-datetime-picker>	
			</template>		
			<template v-if="dateType == 2">
				<template v-if="dayType == 1">
					<van-datetime-picker ref="datepickerByStart" :min-date="minDate" :max-date="maxDate" v-model="curStartDate" type="date" :show-toolbar="false" :formatter="formatterByDate" @change="changeDateByStart" @confirm="confirmByStart" ></van-datetime-picker>	
				</template>
				<template v-if="dayType == 2">
					<van-datetime-picker ref="datepickerByEnd" :min-date="minDate" :max-date="maxDate" v-model="curEndDate" type="date" :show-toolbar="false" :formatter="formatterByDate" @change="changeDateByEnd" @confirm="confirmByEnd" ></van-datetime-picker>	
				</template>
			</template>	
		</van-popup>
	</div>
</template>
<script>
	export default {
		name: "billList",
		data() {
			return {
                price: 0,
				loading: true,
				finished: false,
				type: '0', // 0-全部 1-充值 2-收益 3-提现 4-支出
                page: 0,
                size: 10,
				list: [],
                noDataImg: '',
                errImg: '',

                dateType: '1', // 1-按月 2-按日查询
				dayType: '1', // 1-开始日期 2-结束日期

				curMonth : '',
				selectMonth: '',
				minDate: new Date(2021, 0, 1),
				maxDate: new Date(),
				dateShow: false, //是都显示日期弹窗

				curStartDate: '',
				curEndDate: '',
				startDate: '',
                endDate: '',
                curShowDate: '',

                isLoading: false
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
            // if (lastPath) {
            //     if (lastPath == '/billDetail') return
            // }
            this.initData()
		},
		methods: {
			// 返回
			leftBack () {
				this.$router.push({
                    path: '/taskCenter',
                    query: {}
                })
			},
			// 跳转路由
			toRouter (path) {
				this.$router.push(path)
            },
            onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getDetail()
            },
            // 跳转提现
            toWithdrawr () {
                this.$router.push({
                    path: '/withdraw',
                    query: {
                        price: this.price
                    }
                })
            },
            // 年月选择器展示
            formatter(type, val) {
                if (type === 'year') {
                    return `${val}年`;
                } else if (type === 'month') {
                    return `${val}月`;
                }
                return val;
            },
            // 年月选择器展示
            formatterByDate(type, val) {
                if (type === 'year') {
                    return `${val}年`;
                } else if (type === 'month') {
                    return `${val}月`;
                } else if (type === 'day') {
                    return `${val}日`;
                }
                return val;
            },
            // 初始化
            initData(){
                this.curMonth = new Date()
                this.curStartDate = new Date()
                this.curEndDate = new Date()
                // this.selectMonth = this.fillZero(new Date().getFullYear())+ '-'+ this.fillZero((new Date().getMonth() + 1))
                // this.startDate = this.fillZero(new Date().getFullYear())+ '-' + this.fillZero(new Date().getMonth()+1) +'-'+this.fillZero(new Date().getDate())
                // this.endDate = this.startDate
                // this.curShowDate = '本月'
                this.selectMonth = ''
                this.startDate = ''
                this.endDate = ''
                this.curShowDate = '全部'
                this.getDetail()
            },
            // 小于10补0
            fillZero(val) {
                if(Number(val) < 10) {
                    val = '0'+val
                } 
                return val
            },
            // 改变日期类型
            changeDateType() {
                if(this.dateType == 1) {
                    this.dateType = 2
                } else {
                    this.dateType = 1
                }
            },
            // 按月查询改变日期
            changeDateByMonth(e) {
                let valArr = e.getValues()
                let year = valArr[0].replace('年','-')
                let month = valArr[1].replace('月','')
                this.selectMonth = year+month
            },
            // 选择所有时间
            selectAllDate () {
                this.curShowDate = '全部'
                this.selectMonth = ''
                this.startDate = ''
                this.endDate = ''
                this.dateShow = false
                this.page = 0
                this.loading = true
                this.finished = false
                this.list = []
                this.getDetail()
            },
            // 选择月份确认
            dateConfirmByMonth() {
                if(this.dateType == 1) {
                    this.$refs.monthpicker.getPicker().confirm()
                } else if(this.dateType == 2) {
                    if(this.dayType == 1) {
                        this.$refs.datepickerByStart.getPicker().confirm()
                    } else {
                        this.$refs.datepickerByEnd.getPicker().confirm()
                    }
                }

            },
            // 触发月份确认
            confirmByMonth(val) {
                let curDate = new Date()
                this.selectMonth = this.fillZero(val.getFullYear())+'-'+this.fillZero(val.getMonth()+1)
                if(curDate.getFullYear() == val.getFullYear() && curDate.getMonth() == val.getMonth()) {
                    this.curShowDate = '本月'
                } else {
                    this.curShowDate = this.selectMonth
                }
                this.dateShow = false
                this.page = 0
                this.loading = true
                this.finished = false
                this.list = []
                this.getDetail()
            },
            // 按日查询 开始日期 改变日期
            changeDateByStart(e) {
                let valArr = e.getValues()
                let year = valArr[0].replace('年','-')
                let month = valArr[1].replace('月','-')
                let day = valArr[2].replace('日','')
                this.startDate = year+month+day
            },
            // 选择日 开始确认
            dateConfirmByStart(val) {
                this.$refs.datepickerByStart.getPicker().confirm()
            },
            // 触发日 开始确认
            confirmByStart(val) {
                this.startDate = this.fillZero(val.getFullYear())+'-'+this.fillZero(val.getMonth()+1)+ '-'+this.fillZero(val.getDate())
                if(new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
                    let tmpStart = JSON.parse(JSON.stringify(this.endDate))
                    let tmpEnd = JSON.parse(JSON.stringify(this.startDate))
                    this.startDate = tmpStart
                    this.endDate = tmpEnd
                    this.curStartDate = new Date(tmpStart)
                    this.curEndDate = new Date(tmpEnd)
                }
                if(this.startDate == this.endDate) {
                    this.curShowDate = this.startDate
                } else {
                    this.curShowDate = this.startDate+ ' 至 ' + this.endDate
                }
                this.dateShow = false
                this.page = 0
                this.loading = true
                this.finished = false
                this.list = []
                this.getDetail()
            },
            // 按日查询 结束日期 改变日期
            changeDateByEnd(e) {
                let valArr = e.getValues()
                let year = valArr[0].replace('年','-')
                let month = valArr[1].replace('月','-')
                let day = valArr[2].replace('日','')
                this.endDate = year+month+day
            },
            // 选择日 结束确认
            dateConfirmByEnd(val) {
                this.$refs.datepickerByEnd.getPicker().confirm()	
            },
            // 触发日 结束份确认
            confirmByEnd(val) {
                this.endDate = this.fillZero(val.getFullYear())+'-'+this.fillZero(val.getMonth()+1)+ '-'+this.fillZero(val.getDate())
                if(new Date(this.startDate).getTime() > new Date(this.endDate).getTime()) {
                    let tmpStart = JSON.parse(JSON.stringify(this.endDate))
                    let tmpEnd = JSON.parse(JSON.stringify(this.startDate))
                    this.startDate = tmpStart
                    this.endDate = tmpEnd
                    this.curStartDate = new Date(tmpStart)
                    this.curEndDate = new Date(tmpEnd)
                }
                if(this.startDate == this.endDate) {
                    this.curShowDate = this.startDate
                } else {
                    this.curShowDate = this.startDate+ ' 至 ' + this.endDate
                }
                this.dateShow = false
                this.page = 0
                this.loading = true
                this.finished = false
                this.list = []
                this.getDetail()
            },
            // 处理请求错误
            handleErr () {
                this.page = 0
                this.list = []
                this.loading = true
                this.finished = false
                this.getDetail()
            },
            // 获取余额详细
            getDetail() {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
				this.$api.capitalLists({
                    type: this.type,
                    page: page,
                    size: this.size,
                    date_type: this.dateType,
                    start_time: this.dateType == 1 ? this.selectMonth : this.startDate,
                    end_time: this.dateType == 1 ? this.selectMonth  : this.endDate,
				}).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
                        this.price = Number(res.data.account)
						// res.data.data = [{
                        //     type: 1,
                        //     str: '下载App',
                        //     id: 12,
                        //     add_time: '2021-06-09 12:00:00',
                        //     money: 8.00
                        // },{
                        //     type: 2,
                        //     str: '任务预付金',
                        //     add_time: '2021-06-09 12:00:00',
                        //     money: 800
                        // },{
                        //     type: 3,
                        //     str: '任务预付金',
                        //     add_time: '2021-06-09 12:00:00',
                        //     money: 800
                        // },{
                        //     type: 4,
                        //     str: '',
                        //     add_time: '2021-06-09 12:00:00',
                        //     money: 50.50
                        // },{
                        //     type: 4,
                        //     str: '',
                        //     add_time: '2021-06-09 12:00:00',
                        //     money: 66,
                        //     withdrawal_status: 0
                        // }]
                        // res.data.totalPage = 1
                        
						let data = res.data.data
						if (data && data.length > 0) {
                            data.forEach(item =>{
                                if (item.type == 1 || item.type == 3) {
                                    if (item.cls == 1) {
                                        item.desc = item.type == 1 ? '从微信扣款' : '提现至微信'
                                    } else if (item.cls == 2) {
                                        item.desc = item.type == 1 ? '从银联扣款' : '提现至银行卡'
                                    } else if (item.cls == 3) {
                                        item.desc = item.type == 1 ? '从社内余额扣款' : '提现至社内余额'
                                    }
                                } else {
                                    item.str = item.title
                                }
                            })
							if (page == 1) {
								this.list = data
							} else {
								this.list = this.list.concat(data)
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
                        this.list = []
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
                    this.isLoading = false
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.list = []
					this.isErr = true
				})
            },
            // 跳转账单详情
            toDetail (row) {
                this.$router.push({
                    path: '/billDetail',
                    query: {
                        id: row.reward_capital_account_list_id
                    }
                })
            }
		
		}
	}
</script>
<style lang="less">
	.billList {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: url(../../images/bgHeader5.png) no-repeat;
		background-size: 100% 227px;
		background-color: #f0f6fc;	
		overflow-y: auto;
		div {
			box-sizing: border-box;
		}
		.van-nav-bar {
			// background: url(../../images/bgHeader5.png) no-repeat top center;
			// background-size: 100% 227px;
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
			margin: 20px 15px;
        }
        .head-con {
            position: relative;
            .banner { 
                position: relative; 
                width: 100%; 
                display: block; 
            }
		    .head-absolute-center { 
                position: absolute; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%,-60%); 
                width: 100%; 
                align-items: center; 
                justify-content: center; 
                flex-direction: column; 
                .desc { 
                    font-size: 0.34rem; 
                    text-align: center; 
                }
                .num { 
                    font-size: 1.3rem; 
                    font-weight: bold; 
                    text-align: center;
                     margin-top: 8px
                }
                .tip-con { 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    padding: 0 16px; 
                    .img { 
                        width: 20px; 
                        height: 20px; 
                    }
                    .tip { 
                        color: #999; 
                        flex: 1; 
                        padding-left: 8px; 
                    }
                    .btn-con { 
                        border: 1px solid #1989fa; 
                        color: #1989fa; 
                        padding: 6px 12px; 
                        border-radius: 1000px; 
                    }
                    .btn-con:active { 
                        opacity: .6; 
                    }
                }
            }
            .tit-con { 
                position: absolute; 
                left: 16px; 
                bottom: 0; 
                width: calc(100% - 32px); 
                height: 45px; 
                background: #fff; 
                display: flex; 
                align-items: center; 
                justify-content: space-between; 
                padding: 20px; 
                border-top-left-radius: 10px; 
                border-top-right-radius: 10px; 
                font-size: 0.36rem; 
                .month { 
                    display: flex; 
                    align-items: center; 
                    .icon { 
                        width: 10px; 
                        height: 10px; 
                        margin-left: 5px; 
                    }
                }
            }
        }
		.van-sticky--fixed {
            .tit-con { 
                position: relative; 
                left: 0; 
                width: 100%; 
                border-radius: 0; 
                box-shadow: 2px 2px 5px #ccc; 
            }
        }
		.list-con { 
            flex: 1; 
            background: #fff; 
            margin-left: 16px; 
            margin-right: 16px; 
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px; 
            min-height: 350px; 
            position: relative;
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
            .list-item-con { 
                padding: 10px 15px; 
                display: flex;
                .logo { 
                    width: 1rem; 
                    height: 1rem;  
                    display: flex; 
                }
                .order-info { 
                    display: flex; 
                    flex-direction: column; 
                    word-wrap:break-word; 
                    word-break:break-all; 
                    max-width: calc(100% - 125px); 
                    min-height: 1.3rem; 
                    justify-content: space-between; 
                    padding-left: 10px;
                    .tit { 
                        color: #333333; 
                        font-size: 0.36rem; 
                        font-weight: bold;
                        line-height: 1.2;
                    }
                    .no { 
                        color: #888888; 
                    }
                    .date {
                        color: #888888; 
                    }
                }
            }
            .price { 
                color: #444444; 
                font-weight: bold; 
                font-size: 0.4rem; 
                word-wrap:break-word; 
                word-break:break-all; 
                flex: 1; 
                min-width: 80px; 
                text-align: right; 
                display: flex; 
                justify-content: space-around; 
                flex-direction: column;
                .status { 
                    color: red; 
                    font-size: 0.3rem;
                }
                .shenhe {
                    color: #ff6010;
                }
                .nopay {
                    color: #ff976a;
                }
                .add {
                    color: #ff2814; 
                }
            }
        }
		.popup-tit { 
            display: flex; 
            align-items: center;
            justify-content: center; 
            text-align: center; 
            padding: 10px 0;
            .text { 
                width: 100px; 
                color: #999;
            }
            .color-green { 
                color: #03d769;
            }
            .tit { 
                flex: 1; font-weight: bold; 
            }
        }
        .date-type-con {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px;
            .date-type { 
                border: 1px solid #02d267; 
                color: #02d267; 
                width:100px; 
                height: 28px;
                line-height: 28px; 
                text-align: center; 
                border-radius: 1000px; 
            }
            .date-type-all {
                border-color: #1989fa;
                color: #1989fa;
            }
        }
		
		.select-date-con { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            .date { 
                border-bottom: 1px solid #02d267; 
                border-width: 110%; 
                padding: 10px 20px; 
            }
            .border-color { 
                border-color: #888888; 
            }
            .mask { 
                padding: 0 15px; 
            }
        }
		/* 无数据 */
		.no-data { 
            position: absolute; 
            top: 0; 
            left: 0; 
            right: 0; 
            bottom: 0; 
            z-index: 1;
            .no-data-con { 
                position: absolute; 
                width: 90%; 
                top: 50%; 
                left: 50%; 
                transform: translate(-50%,-50%); 
                text-align: center; 
                img { 
                    width: 100%; 
                }
                .no-title{ 
                    font-size: 0.35rem; 
                    font-weight:600;  
                    color:rgba(0,0,0,1); 
                }
                .no-desc { 
                    font-size: 0.3rem; 
                    font-weight:400; 
                    color:rgba(136,136,136,1); 
                    padding: 0.3rem 0;
                }
                .van-button { 
                    font-size: 0.3rem; 
                    font-weight:400; 
                    color:rgba(1,195,39,1);
                }
            }
        }
	}
</style>
