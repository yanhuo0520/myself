<template>
	<div class="addArticle" >
		<van-nav-bar :border="false"  title="我要发圈"   left-text="取消"   @click-left="leftBack" >
            <template #right>
                <div class="right-con" @click.stop="onClickRight">
                    发表
                </div>
            </template>
        </van-nav-bar>
        <div class="textarea-con">
            <van-field v-model="content" laceholder="请输入用户名"  rows="5" autosize type="textarea" placeholder="请输入您想发布的内容" />
        </div>
        <div class="img-con">
            <van-uploader  v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" />
        </div>
        <van-cell title="所在位置" icon="location-o" is-link @click="chooseAddr" />

        <div class="fixed-full-con" @click.stop v-if="submitLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">发表中...</span>
            </div>
        </div>
	</div>
</template>
<script>
	export default {
		name: "addArticle",
		data() {
			return {
                content: '',
                fileList: [],
                picList: [],
                submitLoading: false
			};
		},
		activated() {
            window.leftBack = this.leftBack
            let tmpObj = localStorage.getItem('mutualArticle') ? JSON.parse(localStorage.getItem('mutualArticle')) : ''
            if (tmpObj) {
                this.content = tmpObj.content
                this.picList = tmpObj.picList
                let tmpArr = []
                tmpObj.picList.forEach(item =>{
                     let tmpItemObj = {
                        content: item,
                        file: 'File',
                        status: 'done',
                        message: '',
                        isImage: true 
                    }
                    tmpArr.push(tmpItemObj)
                })
                this.fileList = tmpArr
            } else {
                this.content = ''
                this.picList = []
                this.fileList = []
            }
            this.submitLoading = false
		},
		methods: {
			// 返回
			leftBack () {
                if (this.content || this.picList && this.picList.length > 0) {
                    this.$dialog.confirm({
                        title: '提示',
                        message: '将此次编辑保留?',
                        confirmButtonText: '保留',
                        confirmButtonColor: '#1989fa',
                        cancelButtonText: '不保留'
                        })
                        .then(() => {
                            // on confirm
                            let tmpObj = {
                                content: this.content,
                                picList: this.picList   
                            }
                            localStorage.setItem('mutualArticle', JSON.stringify(tmpObj))
                            setTimeout(() =>{
                                this.$router.push('/mutualCircle')
                            })
                        })
                        .catch(() => {
                            // on cancel
                            this.content = ''
                            this.picList = []
                            this.fileList = []
                            localStorage.removeItem('mutualArticle')
                            setTimeout(() =>{
                                this.$router.push('/mutualCircle')
                            })
                    });
                    return
                }
				this.$router.push('/mutualCircle')
            },
            // 选择位置
            chooseAddr () {
                this.$toast('暂未开放')
            },
            // 发送
            onClickRight () {
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
                if (errNum > 0) {
                    this.$toast('有'+errNum+'张图片上传失败,请稍后重试!')
                    this.$dialog.confirm({
                        title: '提示',
                        message: '有'+errNum+'张图片上传失败,继续上传将自动删除上传失败图片!',
                        confirmButtonText: '继续上传'
                        })
                        .then(() => {
                            this.handleAddData()
                            // on confirm
                        })
                        .catch(() => {
                            // on cancel
                    });
                    return
                }
                this.handleAddData()
            },
            handleAddData () {
                if (!this.picList || this.picList.length == 0) {
                    this.$toast('请至少上传一张图片')
                    return
                }
                if (this.submitLoading) return
                this.submitLoading = true
                let params = {}
                params.content = this.content
                params.img_str = this.picList.join(',')
                this.$api.userCircleAdd(params).then(res => {
                    this.submitLoading = false
                    if (res.errno == 0) {
                        this.content = ''
                        this.fileList = []
                        this.picList = []
                        localStorage.removeItem('mutualArticle')
                        this.$toast('发布成功')
                        setTimeout(() =>{
                            this.$router.push({
                                path: '/mutualCircle',
                                query: {}
                            })
                        })
                    } else {
                        this.$toast(res.errmsg)
                    }
                }).catch(err => {
                    this.submitLoading = false
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
            // 图片删除
            beforeDelete(file, detail) {
				let index = detail.index
				this.fileList.splice(index, 1);
				this.picList.splice(index, 1);
            },
            // 上传图片
            afterRead(file) {
				file.status = 'uploading';
                file.message = '上传中...';
				this.$compreImg(file.content).then(result => {
					if (result.size > file.file.size){
						//压缩后比原来更大，则将原图上传
                        this.uploadFile(file, file.file.name);
					} else {
                        file.file = result
						//压缩后比原来小，上传压缩后的
						this.uploadFile(file, file.file.name)
					}
				}).catch(err =>{
                    file.status = 'failed';
                    file.message = '上传失败';
                })
            },
            uploadFile(file, filename){
				var formdata = new FormData();
				//可以通过append()方法来追加数据
				let token = ''
                if (typeof android != 'undefined') {
                    token = android.load('token')
                } else {
                    this.token = localStorage.getItem('token')
                }
                if (!token) return
				formdata.append("file", file.file, filename);
				formdata.append("token", token);
				const instance = this.$axios.create({
					//withCredentials:true
				});
				instance.post("http://coopera.xfd365.com/user/auth/uploadImg", formdata).then(res => {
					this.$toast.clear()
					if (res.data.errno === 0) {
						file.status = 'done';
						this.$toast("上传成功");
						this.picList.push(res.data.data.url)
					} else {
                        this.$toast(res.errmsg);
                        file.status = 'failed';
                        file.message = '上传失败';
					}
				}).catch(err =>{
                    console.log(err)
                    this.$set(file, 'status', 'failed')
                    this.$set(file, 'message', '上传失败')
                    // file.status = 'failed';
                    // file.message = '上传失败';
                });
			},
		},


	}
</script>
<style lang="less">
	.addArticle {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
        // background-color: #fff;	
        background-color: #f0f6fc;	
        overflow-y: auto;
		div {
			box-sizing: border-box;
        }
        .clearfix:after{
            content:"";/*设置内容为空*/
            height:0;/*高度为0*/
            line-height:0;/*行高为0*/
            display:block;/*将文本转为块级元素*/
            visibility:hidden;/*将元素隐藏*/
            clear:both;/*清除浮动*/
        }
        .clearfix{ zoom:1;/*为了兼容IE*/ }
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
            .van-nav-bar__text {
                font-size: 16px;
                color: #000;
            }
            .right-con {
                padding: 0.08rem 0.5rem;
                color: #fff;
                background: #1989fa;
                border-radius: 1000px;
            }
        }
        .img-con {
            padding: 10px 0.6rem;
            background: #fff;
            .van-uploader {
                
            }
            .van-uploader__preview:nth-child(3n) {
                margin: 0;
            }
            .van-uploader__preview,.van-uploader__upload {
                width: calc((100vw - 1.2rem - 22px)/3);
                height: calc((100vw - 1.2rem - 22px)/3);
                margin: 0 10px 10px 0;
                background: #f7f8fa;
                .van-uploader__file {
                    width: 100%;
                    height: 100%;
                }
                .van-uploader__preview-image {
                    width: 100%;
                    height: 100%;
                }
            }
            .van-uploader__upload {
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
