<template>
	<div class="billDetail">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="订单详情" left-arrow  @click-left="leftBack"/>
        <van-form class="form-con">
            <van-cell-group class="cell-group" :border="false">
                <div class="top">
                    <template v-if="detail.type == 3 ">
                        <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/withdraw-icon.png" alt="">
                    </template>
                    <template v-else-if="detail.type == 1 ">
                        <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/chongzhi.png" alt="">
                    </template>
                    <template v-else-if="detail.type == 5 ">
                        <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/tui.png" alt="">
                    </template>
                    <template v-else>
                        <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/money.png" alt="">
                    </template>
                    <div class="tit">{{detail.title}}</div>
                    <div class="price">
                        <span >{{(detail.status == 2 || detail.status == 4) ? '' : (detail.type == 1 || detail.type == 2 ? '+' : '-')}}{{detail.money}}</span>
                    </div>
                    <div class="pay-desc">
                        <template v-if="detail.status == 1">
                            <span>交易成功</span>
                        </template>
                        <template v-if="detail.status == 2">
                            <span style="color:red">{{detail.cls == 2 ? '已全额退款' : '交易失败'}}<span v-if="detail.cls != 2">{{detail.message ? ','+detail.message : ''}}</span><span v-if="detail.cls == 2">{{detail.note ? ','+detail.note : ''}}</span></span>
                        </template>
                        <template v-if="detail.status == 3">
                            <span style="color:#ff6010">
                                {{detail.type == 1 ? '充值' : (detail.detail == 2 ? '' : (detail.type == 3 ? '提现' : ''))}}
                                审核中
                            </span>
                        </template>
                        <template v-if="detail.status == 4">
                            <span style="color:#ff976a">未支付</span>
                        </template>
                        <template v-if="detail.status == 5">
                            <span style="color:#ff976a">押金退款</span>
                        </template>
                    </div>
                </div>
                <van-cell title="订单类型"  >
                    {{detail.type == 1 ? '充值' : detail.type == 2 ? '任务收益' : (detail.type == 3 ? '提现' : (detail.type == 5 ? '押金退款' : '支付'))}}
                </van-cell>
                <van-cell :title="detail.type == 1 ? '付款方式' : '到账途径'"  v-if="detail.type == 1 || detail.type == 3 || detail.type == 5">
                    {{detail.cls == 1 ? '微信支付' : detail.cls == 2 ? (detail.type == 1 ? '银联支付' : '银行卡') : '社内余额支付'}}
                </van-cell>
                <van-cell :title="detail.cls == 1 ? '微信昵称' : detail.cls == 2 ? '持卡人' : '账户名称'"  v-if="detail.type == 3 || detail.type == 5">
                   {{detail.name}}
                </van-cell>
                <van-cell title="银行卡号"  v-if="(detail.type == 3 || detail.type == 5) && detail.cls == 2">
                    {{detail.bank_card}}
                </van-cell>
                <!-- <van-cell title="任务ID" :value="detail.reward_id"  /> -->
                <van-cell title="创建时间" :value="detail.add_time"  />
                <van-cell title="订单号" :value="detail.order_no" v-if="detail.order_no" />
            </van-cell-group>
        </van-form>

        <div class="fixed-full-con" @click.stop v-if="loading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">加载中...</span>
            </div>
        </div>
	</div>
</template>
<script>
	export default {
		name: "billDetail",
		data() {
			return {
                id: '',
                detail: '',
                loading: false,
                isLoading: false
			};
		},
		mounted() {
           window.leftBack = this.leftBack
           this.id = this.$route.query.id
           this.getBillDetail()
		},
		methods: {
            leftBack() {
                this.$router.go(-1)
                // let lastPath = ''
                // this.$router.push({
                //     path: '/billList',
                //     query: {
                //         lastPath: '/billDetail'
                //     }
                // })
            },
            // 获取账单详情
            getBillDetail () {
                this.loading = true
                this.$api.capitalDetail({
                    reward_capital_account_list_id: this.id
                }).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
                        this.detail = res.data
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
                    this.isLoading = false
					this.loading = false
				})
            }
		}
	};
</script>
<style lang="less">
	.billDetail {
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
            padding-top: 30px;
            position: relative;
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
            // overflow: hidden;
            position: relative;
            .top {
                display: flex;
                align-items: center;
                flex-direction: column;
                .logo {
                    width: 45px;
                    margin-top: -22.5px;
                    border-radius: 50%;
                    background: #fff;
                }
                .tit {
                    font-size: 0.35rem;
                    margin: 10px 0;
                }
                .price {
                    font-weight: bold;
                    font-size: 0.75rem;
                }
                .pay-desc {
                    margin: 10px 0;
                }
            }
            .van-cell__title {
                flex: none;
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
