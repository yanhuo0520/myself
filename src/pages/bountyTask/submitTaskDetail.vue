<template>
	<div class="addTask">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="提交任务" left-arrow  @click-left="leftBack"/>
        <van-form class="form-con" @submit="onSubmit">
            <van-cell-group class="cell-group">
                <van-cell title="任务名称" :value="taskName"  />
                <van-cell title="任务金额" :value="taskPrice"  />
                <van-cell title="完成状态" :value="statusName"  :label="status == 4 ? errNote : ''" >
                    <van-tag round type="primary">{{statusName}}</van-tag>
                </van-cell>
                <template v-if="status == 1">
                    <van-field v-model="note" type="textarea" :rows="2" autosize label="描述" name="描述"  maxlength="200"  show-word-limit placeholder="请输入提交描述,200字以内" 
                        :rules="[{ required: true, message: '请输入提交描述' }]"
                    />
                    <van-field name="uploader"  :rules="[{ required: true, message: '请至少上传一张截图' }]">
                        <template #input>
                            <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" class="uploadCont"  >
                                <img src="../../images/jia.png" />
                                    <p>任务截图</p>
                            </van-uploader>
                        </template>
                    </van-field>
                    <!-- <p style="padding:10px;color:#1989fa" @click="imgPreView">点击查看提交案例</p> -->
                </template>
                <template v-else>
                    <van-field v-model="note" type="textarea" :rows="2" autosize label="描述" name="描述"  maxlength="200" readonly  show-word-limit placeholder="请输入提交描述,200字以内"     />
                    <van-field name="uploader"  readonly >
                        <template #input>
                            <van-uploader accept="image/*"  disabled  v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" class="uploadCont"  >
                                <img src="../../images/jia.png" />
                                    <p>任务截图</p>
                            </van-uploader>
                        </template>
                    </van-field>
                </template>
            </van-cell-group>
            <!-- <p v-if="status == 4" class="desc" style="padding: 0 10px">审核失败,<span style="color:#1989fa;padding: 10px 0" @click="fileList = [];picList = []; note = ''">清空数据</span>重新提交</p> -->
            <div style="width:100%; height:100px"></div>
            <div class="submit-con" v-if="status == 1 || status == 2 || status == 4">
                <van-button :loading="submitLoading" :disabled="status == 2 || status == 4" round block type="info" native-type="submit">{{status == 1 ? '提交任务' : status == 2 ? '审核中' : status == 4 ? '审核失败' : ''}}</van-button>
            </div>
        </van-form>
	</div>
</template>
<script>
    import { ImagePreview } from 'vant';
	export default {
		name: "addTask",
		data() {
			return {
                reward_make_id: '',
                status: '',
                statusName: '',
                taskName: '',
                taskPrice: '',
                errNote: '',
				fileList: [],
                picList: [],
                note: '',
                lastPath: '',
                loading: false,
                isErr: false,
                submitLoading: false
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
            initData () {
                this.status = ''
                this.statusName = ''
                this.taskName = ''
                this.taskPrice = ''
                this.errNote = ''
                this.note = ''
                this.fileList = []
                this.picList = []
                this.reward_make_id = ''
                if (this.$route.query.reward_make_id) {
                    let detail = JSON.parse(this.$route.query.detail)
                    this.reward_make_id = this.$route.query.reward_make_id
                    this.status = detail.status
                    this.statusName = detail.status_name
                    this.taskName = detail.title
                    this.taskPrice = detail.price
                    this.errNote = detail.note
                    this.note = detail.make_content
                    if (detail.make_pic) {
                        this.picList = detail.make_pic.split(',')
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
                    //   status: 1,
                    //         statusName: '',
                    //         taskName:'测试任务',
                    //         taskPrice:'8',
                    //         errNote: '错误原因',
                    //         picList: []

                }
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
	.addTask {
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
            .uploadCont {
				.van-uploader__preview-image{
					width: 100px;
					height: 70px;
				}
				.van-uploader__input-wrapper{
					background: #F0F6FC;
					width: 100px;
					height: 70px;
					text-align: center;
					color: #9AA8B6;
					img{
						width: 15px;
						height: 15px;
						margin: 16px 0 5px 0;
					}
				}
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
        .cell-group {
            margin: 10px;
            border-radius: 8px;
            box-shadow: 3px 3px 6px #ccc;
            overflow: hidden;
            .van-cell__label {
                color: red;
            }
        }
		
	}
</style>
