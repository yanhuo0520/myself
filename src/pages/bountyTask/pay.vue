<template>
	<div class="taskPay">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="悬赏收银台" left-arrow  @click-left="leftBack"/>
        <van-form class="form-con" @submit="onSubmit">
            <template v-if="isPaySuccess">
                <div class="pay-con">
                    <img src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/pay_success_icon.png" alt="">
                    <span class="desc">支付成功</span>
                    <div class="btn-con">
                        <van-button round plain block type="info" native-type="button" @click="toRouter('/addTask')">继续发布</van-button>
                        <van-button style="margin-left: 10px" round block type="info" native-type="button" @click="toRouter('/manageTask')">发布管理</van-button>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="price">￥{{price}}</div>
                <van-radio-group v-model="bankInfo.bank_id">
                    <van-cell-group class="type-group">
                        <van-cell  clickable v-for="(item, index) in bankOption" :key="index" @click="selectType(item)">
                            <template #title>
                                <span >{{item.open_bank}} <span style="font-size:0.3rem" v-if="item.bank_type == 'coop'">(可用￥{{coopBalance}})</span><span v-if="item.bank_type != 'wx' && item.bank_type != 'coop'  && item.bank_type != 'union'">{{item.bank_type}} ({{item.bank_num}})</span></span>
                            </template>
                            <template #icon>
                                <div class="bank-icon" >
                                    <template v-if="item.open_bank_letter">
                                        <img :src="'https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/bankIcon/small_logo/'+item.open_bank_letter+'.png'" alt="">
                                    </template>
                                    <template v-else>
                                        <template v-if="item.bank_type == 'coop'">
                                            <img width="22px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                                        </template>
                                        <template v-if="item.bank_type == 'wx'">
                                            <img width="20px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/wx-logo.png" alt="">
                                        </template>
                                        <template v-if="item.bank_type == 'union'">
                                            <img width="20px" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/union.png" alt="">
                                        </template>
                                    </template>
                                </div>
                            </template>
                            <template #right-icon>
                                <van-radio :name="item.bank_id" :disabled="item.bank_type == 'coop' && coopBalance < price"/>
                            </template>
                            <template #default>
                                <span v-if="item.bank_type"></span>
                            </template>
                        </van-cell>
                    </van-cell-group>
                </van-radio-group>
                <div style="width:100%; height:60px"></div>
                <div class="submit-con">
                    <van-button round block type="info" native-type="submit">去支付</van-button>
                </div>
            </template>
        </van-form>
	</div>
</template>
<script>
	export default {
		name: "taskPay",
		data() {
			return {
                bankOption: [],
                bankInfo: {
					bank_type: '',
					bank_num: '',
					open_bank_letter: '',
					open_bank: '',
					bank_id: ''
                },
                id: '',
                price: 0,
                coopBalance: 0,
                isPaySuccess: false  
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.price = this.$route.query.price ? Number(this.$route.query.price) : 0
            this.id = this.$route.query.id ? this.$route.query.id : ''
            this.coopBalance = 0
            this.bankInfo = {
                bank_type: '',
                bank_num: '',
                open_bank_letter: '',
                open_bank: '',
                bank_id: ''
            }
            this.getCoopBalance()
            // this.getBankList()
            this.bankOption = [{
                open_bank_letter: '',
                open_bank: '社内余额',
                bank_type: 'coop',
                bank_num: '',
                bank_id: 'coop'
            },{
                open_bank_letter: '',
                open_bank: '微信支付',
                bank_type: 'wx',
                bank_num: '',
                bank_id: 'wx'
            },{
                open_bank_letter: '',
                open_bank: '银联支付',
                bank_type: 'union',
                bank_num: '',
                bank_id: 'union'
            }]
            if (!window.taskPayInterVal) {
                this.isPaySuccess = false
            }
		},
		methods: {
            leftBack() {
                if (window.taskPayInterVal) {
                    clearInterval(window.taskPayInterVal)
                    window.taskPayInterVal = null
                }
                let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
                if (lastPath) {
                    if (lastPath == '/manageTask') {
                        this.$router.push({
                            path: '/manageTask',
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
            // 跳转路由
            toRouter (path) {
                this.$router.push(path)
            },
            // 获取我的社内额度
			getCoopBalance() {
				this.balance = 0
				this.$api.rewardUserInfo().then(res => {
					if (res.errno == 0) {
                        this.coopBalance = Number(res.data)
                        if (Number(this.price) > Number(res.data)) {
                            this.bankInfo = JSON.parse(JSON.stringify(this.bankOption[1]))
                        } else {
                            this.bankInfo = JSON.parse(JSON.stringify(this.bankOption[0]))
                        }
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast('服务异常,请稍后重试')
				})
			},
            // 获取我的银行卡列表
			getBankList() {
				this.bankOption = []
				this.$api.userInfo().then(res => {
					// substr(-4)
					if (res.errno == 0) {
						res.data = [{
							open_bank_letter: 'CCB',
							open_bank: '建设银行',
							bank_type: '借记卡',
							bank_num: '7650',
							bank_id: 1
						},{
							open_bank_letter: 'ABC',
							open_bank: '农业银行',
							bank_type: '借记卡',
							bank_num: '7651',
							bank_id: 2
						},{
							open_bank_letter: 'ICBC',
							open_bank: '工商银行',
							bank_type: '借记卡',
							bank_num: '7652',
							bank_id: 3
						},{
							open_bank_letter: 'SPDB',
							open_bank: '浦发银行',
							bank_type: '借记卡',
							bank_num: '7653',
							bank_id: 4
						},{
							open_bank_letter: 'HNRCU',
							open_bank: '农商银行',
							bank_type: '借记卡',
							bank_num: '7654',
							bank_id: 5
						},{
							open_bank_letter: 'COMM',
							open_bank: '交通银行',
							bank_type: '借记卡',
							bank_num: '7655',
							bank_id: 6
						},{
							open_bank_letter: 'CCB',
							open_bank: '建设银行',
							bank_type: '借记卡',
							bank_num: '7656',
							bank_id: 7
						},{
							open_bank_letter: 'CCB',
							open_bank: '建设银行',
							bank_type: '借记卡',
							bank_num: '7657',
							bank_id: 8
                        }]
                        let tmpArr = [{
                            open_bank_letter: '',
							open_bank: '社内余额',
							bank_type: 'coop',
							bank_num: '',
							bank_id: 'coop'
                        },{
                            open_bank_letter: '',
							open_bank: '微信支付',
							bank_type: 'wx',
							bank_num: '',
							bank_id: 'wx'
                        }]
                        this.bankOption = tmpArr.concat(res.data)
                        this.bankInfo = JSON.parse(JSON.stringify(res.data[0]))
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 选择银行卡
            selectType (row) {
                if (row.bank_type == 'coop') {
                    if (this.coopBalance < this.price) {
                        this.$toast('社内额度不足,请选择其他支付方式')
                        return
                    }
                }
                this.bankInfo = JSON.parse(JSON.stringify(row))
            },
            onSubmit (values) {
                if (!this.bankInfo || !this.bankInfo.bank_id) {
                    this.$toast('请先选择支付方式！')
                }
                if (window.taskPayInterVal) {
                    clearInterval(window.taskPayInterVal)
                    window.taskPayInterVal = null
                }
                if (this.bankInfo.bank_id == 'coop') {
                    this.$api.payAdvanceByWallet({
                        reward_id: this.id
                    }).then(res => {
                        if (res.errno == 0) {
                           this.isPaySuccess = true
                        } else {
                            this.$toast(res.errmsg)
                        }
                    }).catch(err => {
                        this.$toast('服务异常,请稍后重试')
                    })
                    
                } else  {
                    if(typeof android != 'undefined'){
                        let cls = ''
                        if (this.bankInfo.bank_id == 'wx') {
                            cls = 1
                        } else if (this.bankInfo.bank_id == 'union') {
                            cls = 2
                        }
                        this.$api.payAdvanceByUnion({
                            reward_id: this.id,
                            cls: cls
                        }).then(res => {
                            if (res.errno == 0) {
                                if (this.bankInfo.bank_id == 'wx') {
                                    android.unionWxPay(res.data)
                                } else if (this.bankInfo.bank_id == 'union') {
                                    let union = res.data
                                    if (res.data.indexOf('tn') > -1) {
                                        union =  JSON.parse(res.data)['tn']
                                    }
                                    android.unionPay(union);
                                }
                                // localStorage.setItem('taskOrderNo', res.order_no)
                                let that = this
                                window.taskPayInterVal = setInterval(() =>{
                                    that.InquirePayStatus(res.order_no)
                                }, 1000)
                            } else {
                                this.$toast(res.errmsg)
                            }
                        }).catch(err => {
                            this.$toast('服务异常,请稍后重试')
                        })
                    }else{ 
                        this.$toast('请在app内支付')
                    }
                }
            },
            // 查询支付结果
            InquirePayStatus (no) {
                this.$api.searchAdvanceByWallet({
                    order_no: no
                }).then(res => {
                    if (res.errno == 0) {
                        if (res.data.status == 1) {
                            this.isPaySuccess = true
                            clearInterval(window.taskPayInterVal)
                            window.taskPayInterVal = null
                        } else if (res.data.status == 2){
                            this.$toast('支付失败,请重新支付')
                            clearInterval(window.taskPayInterVal)
                            window.taskPayInterVal = null
                        }
                    } else {
                        this.isPaySuccess = false
                        clearInterval(window.taskPayInterVal)
                        window.taskPayInterVal = null
                    }
                }).catch(err => {
                    this.isPaySuccess = false
                    this.$toast('服务异常')
                    clearInterval(window.taskPayInterVal)
                    window.taskPayInterVal = null
                })
            }

		}
	};
</script>
<style lang="less">
	.taskPay {
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
            position: relative;
            .pay-con {
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 80%;
                img {
                    width: 50px;
                }
                .desc {
                    font-weight: bold;
                    font-size: 0.5rem;
                    margin: 20px 0;
                }
                .btn-con {
                    display: flex;
                    align-items: center;
                    width: 70%;
                    justify-content: space-between;
                    .van-button {
                        height: 1rem;
                    }
                }

            }
            .price {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: red;
                font-weight: bold;
                padding: 10px 0;
            }
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
        .type-group {
            width: 94%;
            border-radius: 10px;
            box-shadow: 3px 3px 6px #ccc;
            box-sizing: border-box;
            margin: 0 auto;
            overflow: hidden;
            .van-cell {
                align-items: center;
                .bank-icon {
                    display: flex;
                    align-items: center;
                    width: 30px;
                }
                .van-cell__title {
                    font-weight: bold;
                }
                .van-cell__value {
                    margin: 0 6px;
					flex: none;
                }
            }
        }
	}
</style>
