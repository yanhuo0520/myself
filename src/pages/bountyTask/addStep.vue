<template>
	<div class="addStep">
		<div class="header"></div>
        <van-nav-bar :border="false" title="任务步骤" left-arrow  @click-left="leftBack"/>
        <div class="top-btn-con">
            <div style="flex:1"></div>
            <div class="top-btn-item info" @click="showDraggablePopup">设置排序</div>
            <div class="top-btn-item" @click="showAddPopup">添加步骤</div>
        </div>
        <div class="step-box">
            <div class="step-group">
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
                        <div class="item-btn-con van-hairline--top">
                            <div style="flex:1"></div>
                            <div class="btn" @click="editItem(item,index)">编辑</div>
                            <div class="btn del" @click="delItem(index)">删除</div>
                        </div>
                    </div>
                </div>
                <template v-if="!stepList || stepList.length == 0">
                    <div class="no-data-con">
                        <div class="no-data-desc">暂未添加任何步骤,请点击右上角【添加步骤】</div>
                    </div>
                </template>
                <div style="height:10px"></div>
            </div>
        </div>
        <div class="footer-btn-con">
            <van-button round block type="info" :disabled="stepList.length < 1" @click="saveStep">确认步骤</van-button>
        </div>
        <!-- 拖拽排序 -->
		<van-popup v-model="isShowDraggablePopup" round position="bottom" style="min-height:40%">
            <van-notice-bar left-icon="volume-o" text="注：可拖拽排序"  />
            <div class="draggable-con">
                <vue-draggable v-model="sortData"  :options="{ draggable: '.draggable-item' }" @end="onEnd()">
                    <div class="draggable-item" v-for="(item,index) in sortData" :key="index">{{item.step_title}}</div>
                </vue-draggable>
            </div>
            <div style="padding:10px">
                <van-button round block type="info" @click="confirmSort">确定排序</van-button>
            </div>
		</van-popup>
        <!-- 添加步骤弹窗 -->
        <van-popup class="add-popup" v-model="isShowAddPopup" round position="bottom" style="min-height:40%">
            <div class="add-popup-tit">{{isEdit ? '编辑' : '添加'}}步骤</div>
            <div class="add-popup-con">
                <van-field v-model="typeName" label="步骤类型"  placeholder="请选择步骤类型" readonly @click="isShowType = true" is-link />
                <template v-if="type == 1">
                    <van-field v-model="step_title" label="标题"  placeholder="请输入步骤标题"  />
                    <van-field v-model="content" label="描述" rows="3" autosize type="textarea" placeholder="请输入您的描述(选填)" />
                    <van-uploader v-model="fileList" :before-read="beforeRead" :after-read="afterRead" :before-delete="beforeDelete" class="uploadCont">
                    <img src="../../images/jia.png" />
                        <p>说明图(选填)</p>
                    </van-uploader>
                </template>
                <template v-if="type == 2">
                    <van-field v-model="step_title" label="标题"  placeholder="请输入步骤标题"  />
                    <van-field v-model="content" label="口令/链接"  placeholder="请输入要复制的口令/链接"  />
                </template>
            </div>
            <div class="btn-con">
                <van-button  block type="info" @click="confirmAdd">确定{{isEdit ? '编辑' : '添加'}}</van-button>
            </div>
		</van-popup>

         <!-- 步骤类型 -->
        <van-action-sheet v-model="isShowType" :actions="typeOption" @select="onTypeSelect" />
	</div>
</template>
<script>
    import VueDraggable from 'vuedraggable';
    import SortableJS from 'sortablejs';
    import VueClipboards from 'vue-clipboards'
    import Vue from 'vue'
	Vue.use(VueClipboards)
	export default {
		name: "addStep",
		data() {
			return {
                isShowDraggablePopup: false,
                isShowAddPopup: false,
                isShowType: false,
                type: 1,
                typeName: '图文信息',
                typeOption: [
                    { name: '链接/口令', value: 2 },
                    { name: '图文信息', value: 1 }
				],
                step_title: '',
                content: '',
                fileList: [],
                picList: [],
                stepList: [],
                sortData: [],
                isEdit: false,
                editIndex: 0
			};
        },
        components: {
			VueDraggable, SortableJS
		},
		mounted() {
            window.leftBack = this.leftBack
            if (localStorage.getItem('stepList')) {
                this.stepList = JSON.parse(localStorage.getItem('stepList'))
            }
		},
		methods: {
            leftBack() {
				this.$router.push({
                    path: '/addTask',
                    query: {
                        lastPath: '/addStep'
                    }
                })
            },
            // 复制链接
            copyTextSuccess(e) {
                console.log(e)
				this.$toast('复制成功!')
			},
			copyTextError(e) {
				this.$toast('复制失败!')
			},
            // 拖拽事件
            onEnd() {
                this.sortData = this.sortData.map((item, index) => {
					item.step = index + 1
					return item
                })
                if (document.querySelector('.step-group')) {
                    document.querySelector('.step-group').scrollTop = 0
                }
            },
             // 确定排序
            confirmSort () {
                this.stepList = JSON.parse(JSON.stringify(this.sortData))
                localStorage.setItem('stepList',JSON.stringify(this.stepList))
                this.isShowDraggablePopup = false
            },
            // 显示设置排序弹窗
            showDraggablePopup () {
                if (!this.stepList || this.stepList.length < 2) {
                    this.$toast('至少添加两个步骤才可以使用排序')
                    return
                }
                this.sortData = JSON.parse(JSON.stringify(this.stepList))
                this.isShowDraggablePopup = true
            },
            // 显示添加步骤弹窗
            showAddPopup () {
                this.isShowAddPopup = true
                this.step_title = ''
                this.content = ''
                this.fileList = []
                this.picList = []
                this.isEdit = false
            },
            // 步骤类型选择
            onTypeSelect (row) {
                this.type = row.value
                this.typeName = row.name
                this.isShowType = false
            },
            // 上传前处置
            beforeRead (file) {
                if (this.fileList.length > 8) {
                    this.$toast('最大可上传9张')
                    return false
                }
                return true
            },
            // 上传后处置
            afterRead (file) {
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
				const instance = this.$axios.create({
					//withCredentials:true
                });
                file.status = 'uploading';
                file.message = '上传中...';
				instance.post("http://coopera.xfd365.com/user/auth/uploadImg", formdata).then(res => {
					if (res.data.errno === 0) {
                        file.status = 'done';
						this.$toast("上传成功");
						this.picList.push(res.data.data.url)
					} else {
						file.status = 'failed';
                        file.message = '上传失败';
					}
				}).catch(err =>{
                    file.status = 'failed';
                    file.message = '上传失败';
                });
			},
			beforeDelete(file, detail) {
				let index = detail.index
				this.fileList.splice(index, 1);
				this.picList.splice(index, 1);
            },
            // 确认添加步骤
            confirmAdd () {
                if (!this.step_title) {
                    this.$toast('请填写步骤标题!')
                    return
                }
                if (this.type == 2) {
                    if (!this.content) {
                        this.$toast('请填写链接/口令')
                        return
                    }
                }
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
                            this.isShowAddPopup = false
                            // on confirm
                        })
                        .catch(() => {
                            this.isShowAddPopup = false
                            // on cancel
                    });
                    return
                }
                // let tmpObj = {}
                // tmpObj.step_title = this.step_title
                // tmpObj.content = this.content
                // tmpObj.type = this.type
                // tmpObj.pic = this.picList
                this.handleAddData()
                this.isShowAddPopup = false
            },
            handleAddData () {
                let tmpObj = {}
                tmpObj.step_title = this.step_title
                tmpObj.content = this.content
                tmpObj.type = this.type
                tmpObj.pic = this.picList
                if (this.isEdit) {
                    tmpObj.step = this.editIndex+1
                    this.stepList[this.editIndex] = tmpObj
                } else {
                    tmpObj.step = this.stepList.length+1
                    this.stepList.push(tmpObj)
                    setTimeout(() =>{
                        if (document.querySelector('.step-group')) {
                            document.querySelector('.step-group').scrollTop = document.querySelector('.step-group').scrollHeight
                        }
                    })
                }
                localStorage.setItem('stepList',JSON.stringify(this.stepList))
            },
            editItem (row, index) {
                let tmpRow = JSON.parse(JSON.stringify(row))
                this.step_title = tmpRow.step_title
                this.content = tmpRow.content
                this.type = tmpRow.type
                if (this.type == 1) {
                    this.typeName = '图文信息'
                } else if (this.type == 2) {
                    this.typeName = '链接/口令'
                }
                let tmpFileArr = []
                if (tmpRow.pic && tmpRow.pic.length > 0) {
                    tmpRow.pic.forEach(item =>{
                        let tmpObj = {
                            content: item,
                            file: 'File',
                            status: 'done',
                            message: '',
                            isImage: true 
                        }
                        tmpFileArr.push(tmpObj)
                    })
                }
                this.fileList = tmpFileArr
                this.picList = tmpRow.pic
                this.editIndex = index

                this.isShowAddPopup = true
                this.isEdit = true
            },
            // 删除步骤
            delItem (index) {
                this.$dialog.confirm({
                    title: '提示',
                    message: '确认删除该步骤吗?'
                    })
                    .then(() => {
                        this.stepList.splice(index, 1)
                        localStorage.setItem('stepList',JSON.stringify(this.stepList))
                        // on confirm
                    })
                    .catch(() => {
                        // on cancel
                });
            },
            // 保存步骤
            saveStep () {
                this.$router.push({
                    path: '/addTask',
                    query: {
                        lastPath: '/addStep'
                    }
                })
            }
		}
	};
</script>
<style lang="less">
	.addStep {
		background: #f0f6fc;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
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
        .top-btn-con {
            display: flex;
            align-items: center;
            position: relative;
            z-index: 2;
            padding: 8px 10px;
            box-shadow: 0 10px 10px -10px #ccc;
            .top-btn-item {
                padding: 8px 14px;
                background: #1989fa;
                color: #fff;
                border-radius: 1000px;
                margin-left: 10px;
            }
            .info {
                border: 1px solid #ebedf0;
                color: #323233;
                background: #fff;
            }
        }
        .step-box {
            position: relative;
            flex: 1;
            overflow: hidden;
            .step-group {
                padding: 10px;
                height: 100%;
                overflow-y: auto;
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
                                    width: 30%;
                                    float: left;
                                    margin-right: 5%;
                                }
                                img:nth-child(3n+3) {
                                    margin-right: 0;
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
        .footer-btn-con {
            padding: 10px;
            background: #fff;
        }
        .add-popup {
            .add-popup-tit {
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 10px;
                font-size: 14px;
                font-weight: bold;
            }
            .uploadCont {
				margin: 0 10px;
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
            .btn-con {
                margin-top: 15px;
            }
        }
        .no-data-con {
            width: 100%;
            height: 80%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .no-data-desc {
                font-size: 14px;
            }
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
        .draggable-con {
            padding: 20px 10px;
            .draggable-item {
                display: inline-block;
                font-size: 14px;
                color: #409eff;
                border: 1px solid #d9ecff;
                border-radius: 4px;
                background-color: #ecf5ff;
                padding: 10px; 
                white-space: nowrap;
                margin-right: 10px;
                margin-bottom: 10px;
            }
        }
	}
</style>
