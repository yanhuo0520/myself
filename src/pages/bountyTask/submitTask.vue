<template>
	<div class="submitTask">
		<!-- <div class="header"></div> -->
        <van-nav-bar :border="false"  title="提交任务" left-arrow  @click-left="leftBack">
            <template #right>
                <img class="right-img"  @click="closeTask()" src="../../images/bountyTask/close-icon.png" alt="">
            </template>
        </van-nav-bar>
        <van-form class="form-con" @submit="onSubmit">
            <div class="task-group">
                <img class="bot" src="../../images/bountyTask/submit-bot.png" alt="">
                <img class="bg" src="../../images/bountyTask/submit-bg.png" alt="">
                <img class="right-icon" src="../../images/bountyTask/submit-right-icon.png" alt="">
                <div class="top-box">
                    <div class="tit-con">
                        <div class="tit">{{orderDetail.title}}</div>
                        <div class="tag">{{orderDetail.type_name}}</div>
                    </div>
                    <div class="top-img">
                        <img src="../../images/bountyTask/submit-top-icon.png" alt="">
                    </div>
                    <div style="flex:1;background: #4880f8;"></div>
                </div>
                <div class="bottom-box">
                    <div class="bot-item-con">
                        <div class="top-con">
                            <div class="num">{{orderDetail.price}}</div>
                            <img class="icon" src="../../images/bountyTask/submit-yuan-icon.png" alt="">
                        </div>
                        <div class="bot-con">
                            <div class="desc">悬赏金额</div>
                        </div>
                    </div>
                    <div class="bot-item-con">
                        <div class="top-con">
                            <van-count-down :time="orderDetail.time*1000" @finish="countDownFinish()">
                                <template #default="timeData">
                                    <div class="num">
                                        <span v-if="timeData.days">{{timeData.days}}</span>
                                        <span v-else-if="timeData.hours">{{timeData.hours}}</span>
                                        <span v-else-if="timeData.minutes">{{timeData.minutes}}</span>
                                        <span v-else-if="timeData.seconds">1</span>
                                         <span v-else>0</span>
                                    </div>
                                    <template v-if="timeData.days">
                                        <img class="icon" src="../../images/bountyTask/submit-day-icon.png" alt="">
                                    </template>
                                    <template v-else-if="timeData.hours">
                                        <img class="icon" src="../../images/bountyTask/submit-shi-icon.png" alt="">
                                    </template>
                                    <template v-else>
                                        <img class="icon" src="../../images/bountyTask/submit-fen-icon.png" alt="">
                                    </template>
                                </template>
                            </van-count-down>
                        </div>
                        <div class="bot-con">
                            <div class="desc">剩余时间</div>
                        </div>
                    </div>
                    <div class="bot-item-con">
                        <div class="top-con">
                            <div class="num">{{orderDetail.timeNum}}</div>
                            <template v-if="orderDetail.timeType == 1">
                                <img class="icon" src="../../images/bountyTask/submit-fen-icon.png" alt="">
                            </template>
                            <template v-if="orderDetail.timeType == 2">
                                <img class="icon" src="../../images/bountyTask/submit-shi-icon.png" alt="">
                            </template>
                            <template v-if="orderDetail.timeType == 3">
                                <img class="icon" src="../../images/bountyTask/submit-day-icon.png" alt="">
                            </template>
                        </div>
                        <div class="bot-con">
                            <div class="desc">审核时间</div>
                        </div>
                    </div>
                </div>
            </div>
            <van-cell-group class="cell-group">
                <van-field v-model="note" type="textarea" :rows="3" autosize   maxlength="200"  show-word-limit placeholder="请您详细地描述做任务过程，以便审核，字数请控制
在200字以内…"  :rules="[{ required: isTimeOver ? false : true, message: '请输入提交描述' }]" :border="false" :readonly="isTimeOver"/>
                <van-field name="uploader"  :rules="[{ required: true, message: '请至少上传一张截图' }]">
                    <template #input>
                        <van-uploader :disabled="isTimeOver" v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" class="uploadCont"  >
                            <img src="../../images/jia.png" />
                            <div class="desc">任务截图(必填)</div>
                        </van-uploader>
                    </template>
                </van-field>
            </van-cell-group>
            <div style="width:100%; height:100px"></div>
            <div class="submit-con">
                <van-button :loading="submitLoading" :disabled="isTimeOver" block type="info" native-type="submit">
                    <template #icon >
						<img src="../../images/bountyTask/detail-task-btn-icon.png" alt="">
					</template>
                    {{isTimeOver ? '任务超时,禁止提交' : '立即提交'}}
                </van-button>
            </div>
        </van-form>

        <div class="fixed-full-con" @click.stop v-if="isDetailLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">加载中...</span>
            </div>
        </div>
	</div>
</template>
<script>
    import { ImagePreview } from 'vant';
	export default {
		name: "submitTask",
		data() {
			return {
                reward_id: '',
                reward_make_id: '',
                status: '',
				fileList: [],
                picList: [],
                note: '',
                lastPath: '',
                loading: false,
                isErr: false,
                submitLoading: false,
                isDetailLoading: false,
                orderDetail: '',
                isTimeOver: false
			};
		},
		mounted() {
           window.leftBack = this.leftBack
           if (this.$route.query.lastPath) {
               this.lastPath = this.$route.query.lastPath
           }
           this.initData()
		},
		methods: {
            leftBack() {
                let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
                if (lastPath) {
                    if (lastPath == '/taskList') {
                        this.$router.push({
                            path: '/taskList',
                            query: {
                                status: this.$route.query.status
                            }
                        })
                    } else {
                        this.$router.go(-1);
                    }
                } else {
				    this.$router.go(-1);
                }
            },
            closeTask () {
                this.$router.push('/')
            },
            initData () {
                this.status = ''
                this.orderDetail = ''
                this.note = ''
                this.fileList = []
                this.picList = []
                this.reward_make_id = ''
                this.reward_id = ''
                this.isTimeOver = false
                this.isDetailLoading = true
                if (this.$route.query.reward_make_id) {
                    let detail = JSON.parse(this.$route.query.detail)
                    this.reward_make_id = this.$route.query.reward_make_id
                    this.reward_id = this.$route.query.reward_id
                    this.status = detail.status
                    this.getRewardDetail()
                }
            },
            // 任务倒计时结束
			countDownFinish () {
				this.isTimeOver = true
			},
            getRewardDetail () {
                this.$api.reward_detail_make_user({
					reward_id: this.reward_id
				}).then(res => {
					this.isDetailLoading = false
					if (res.errno == 0) {
						res.data.timeNum = 0
						res.data.timeType = 1 // 1-分钟 2-小时 3-天
						if (res.data.verify_time_name) {
							if (res.data.verify_time_name.indexOf('分钟') > - 1) {
								res.data.timeNum = res.data.verify_time_name.split('分钟')[0]
								res.data.timeType = 1
							}
							if (res.data.verify_time_name.indexOf('小时') > - 1) {
								res.data.timeNum = res.data.verify_time_name.split('小时')[0]
								res.data.timeType = 2
							}
							if (res.data.verify_time_name.indexOf('天') > - 1) {
								res.data.timeNum = res.data.verify_time_name.split('天')[0]
								res.data.timeType = 3
							}
                        }
                        if (res.data.make_pic) {
                            this.picList = res.data.make_pic.split(',')
                            this.picList.forEach(item =>{
                                let tmpObj = {
                                    content: item,
                                    file: 'File',
                                    status: 'done',
                                    message: '',
                                    isImage: true 
                                }
                                this.fileList.push(tmpObj)
                            })
                        }
                        res.data.time = res.data.time ? res.data.time : 0
						this.orderDetail = res.data
					} else {
						this.$toast(res.errmsg)
					}
				}).catch(err => {
					this.isLoading = false
					this.isDetailLoading = false
					this.$toast('服务异常,请稍后重试')
				})
            },
            // 上传前处置
            beforeRead (file) {
                if (this.fileList.length > 8) {
                    this.$toast('最大可上传9张')
                    return false
                }
                return true
            },
            afterRead(file) {
				var formdata = new FormData();
				//可以通过append()方法来追加数据
                let token = ''
                if (typeof android != 'undefined') {
                    token = android.load('token')
                } else {
                    this.token = localStorage.getItem('token')
                }
                if (!token) return
				formdata.append("file", file.file);
                formdata.append("token", token);
                file.status = 'uploading';
                file.message = '上传中...';
				const instance = this.$axios.create({
					//withCredentials:true
				});
				instance.post("http://coopera.xfd365.com/user/auth/uploadImg", formdata).then(res => {
					if (res.data.errno === 0) {
                        file.status = 'done';
						this.$toast("上传成功");
						this.picList.push(res.data.data.url)
					} else {
                        file.status = 'failed';
                        file.message = '上传失败';
						this.$toast(res.errmsg);
					}
				}).catch(err =>{
                    file.status = 'failed';
                    file.message = '上传失败';
                });;
			},
			beforeDelete(file, detail) {
                if (this.status != 1) return
				let index = detail.index
				this.fileList.splice(index, 1);
				this.picList.splice(index, 1);
            },
            // 查看提交案例
            imgPreView () {
                ImagePreview({
                    images: [
                        'https://img01.yzcdn.cn/vant/apple-1.jpg',
                        'https://img01.yzcdn.cn/vant/apple-2.jpg',
                    ],
                    closeable: true
                });
            },
            onSubmit (values) {
                let loadingNum = 0
                let errNum = 0
                if (this.fileList && this.fileList.length > 0) {
                    this.fileList.forEach(item =>{
                        if (item.status == 'uploading') {
                            loadingNum+=1
                        }
                        if (item.status == 'failed') {
                            errNum+=1
                        }
                    })
                }
                if (loadingNum > 0) {
                    this.$toast('有'+loadingNum+'张图片正在上传,请稍后重试!')
                    return
                }
                if (!this.picList || this.picList.length == 0) {
                    this.$toast('暂无成功上传的图片,请重新上传')
                    return
                }
                if (errNum > 0) {
                    this.$toast('有'+errNum+'张图片上传失败,请稍后重试!')
                    this.$dialog.confirm({
                        title: '提示',
                        message: '有'+errNum+'张图片上传失败,继续上传将自动删除上传失败图片!',
                        confirmButtonText: '继续上传'
                        })
                        .then(() => {
                            this.submitLoading = true
                            this.handleAddData()
                            // on confirm
                        })
                        .catch(() => {
                            // on cancel
                    });
                    return
                }
                this.submitLoading = true
                this.handleAddData()
            },
            handleAddData () {
                if (!this.reward_make_id) {
                    this.$toast('参数错误')
                    this.submitLoading = false
                    return
                }
                let params = {
                    reward_make_id: this.reward_make_id, 
                    make_content: this.note,
                    make_pic: this.picList.join(',')
                }
                this.$api.userRewardUp(params).then(res => {
					if (res.errno == 0) {
                        this.$toast('提交成功')
                        this.note = ''
                        this.picList = []
                        this.fileList = []
                        this.$router.push({
                            path: '/taskList',
                            query: {
                                status: this.status
                            }
                        })
					} else {
                        this.submitLoading = false
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.submitLoading = false
					this.$toast('服务异常,请稍后重试')
				})
                
            }

		}
	};
</script>
<style lang="less">
	.submitTask {
		background: #f0f6fc;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        div {
            box-sizing: border-box;
        }
        .form-con {
            flex: 1;
            overflow: hidden;
            overflow-y: auto;
            .task-group { 
                position: relative;
                width: calc(100% - 0.8rem);
                bottom: 0;
                margin: 0 0.4rem;
                margin-top: 0.3rem;
                background: #4880f8;
                display: flex;
                flex-direction: column;
                border-radius: 0.26rem 0.26rem 0px 0px;
                overflow: hidden;
                .bot {
                    position: absolute;
                    bottom: 0;
                    left: -0.4rem;
                    width: calc(100% + 0.8rem);
                }
                .bg {
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    height: 100%;
                }
                .right-icon {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 2.37rem;
                }
                .top-box {
                    display: flex;
                    .tit-con {
                        display: flex;
                        align-items: center;
                        padding-left: 0.4rem;
                        background: #5692ff;
                        .tit {
                            font-size: 0.38rem;
                            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                            color: #fff;
                            font-weight: 400	;
                            margin-right: 4px;
                            white-space: nowrap;
                        }
                        .tag {
                            background: #fff;
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
                        background: #5692ff;
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
                        width: 33.3%;
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
                                color: #fff;
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
                            font-size: 0.35rem;
                            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                            font-weight: 400;
                            text-align: center;
                            color: #fff;
                            margin-top: 0.32rem;
                        }
                    }
                }
            }
            .uploadCont {
                .van-uploader__preview {
                    margin-right: calc((100vw - 8.78rem)/2);
                    margin-bottom: calc((100vw - 8.78rem)/2);
                }
                .van-uploader__preview:nth-child(3n) {
                    margin-right: 0;
                }
                .van-uploader__preview-delete {
                    width: 0.4rem;
                    height: 0.4rem;
                    border-radius: 0 0 0 0.2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
				.van-uploader__preview-image{
					width: 2.66rem;
					height: 1.86rem;
				}
				.van-uploader__input-wrapper{
					background: #F0F6FC;
					width: 2.66rem;
                    height: 1.86rem;
                    text-align: center;
                    color: #9AA8B6;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
					img{
						width: 0.4rem;
						height: 0.4rem;
						margin-bottom: 0.1rem;
                    }
                    .desc {
                        text-align: center;
                        font-size: 0.3rem;
                        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                        font-weight: 400;
                        text-align: left;
                        color: #9aa8b6;
                    }
				}
			}
            .submit-con {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                .van-button__icon {
                    display: flex;
                    align-items: center;
                    margin-right: 0.06rem;
                    img {
                        width: 0.4rem;
                    }
                }
            }
        }
        .van-nav-bar {
            background: transparent;
            .right-img {
				height: 0.66rem;
			}
			.van-icon {
				color: #222222;
			}
			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}
		// .header {
        //     position: fixed;
        //     top: 0;
        //     left: 0;
		// 	background: url(../../images/bgHeader1.png) no-repeat;
		// 	background-size: 100% 100%;
		// 	width: 100%;
		// 	height: 115px;
        // }
        .cell-group {
            overflow: hidden;
            .van-cell {
                padding: 0.26rem 0.4rem;
            }
            .van-cell__label {
                color: red;
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
