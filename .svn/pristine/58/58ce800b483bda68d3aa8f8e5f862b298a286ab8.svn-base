<template>
	<div class="followList">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="关注/粉丝列表" left-arrow  @click-left="leftBack"/>
        <van-tabs v-model="active" @change="handleTabClick" background="transparent" color="#3B6AF1" line-width="35px" line-height="2px" title-active-color="#3B6AF1">
            <van-tab title="我的关注" name="1"></van-tab>
            <van-tab title="我的粉丝" name="2"></van-tab>
        </van-tabs>
        <div class="task-box">
            <!-- <template > -->
            <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
                <van-list v-model="loading" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
                    <template #loading>
                        <div class="list-loading-con">
                            <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                            <span>加载中...</span>
                        </div>
                    </template>
                    <div class="task-group-con">
                        <div class="task-group" v-for="(item,index) in data" :key="index" >
                            <van-swipe-cell class="van-hairline--top" :ref="'swipecell'+index">
                                <van-cell center :border="false"   @click="toTaskHall(item)">
                                    <template #title>
                                        <span class="name">{{item.to_user_name}}</span>    
                                    </template>
                                    <template #label>
                                        <span class="desc">{{item.guan_count}}人已关注</span>    
                                    </template>
                                    <template #icon>
                                        <img class="header-img" :src="item.photo" />
                                    </template>
                                    <template #right-icon>
                                        <template v-if="item.is_hu == 1">
                                            <div class="btn follow" @click.stop="openRight('swipecell'+index)">
                                                互相关注
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="btn "  @click.stop="openRight('swipecell'+index)">
                                                {{active == 1 ? '已关注' : '关注'}}
                                            </div>
                                        </template>
                                        <!-- <van-icon name="ellipsis" @click.stop="openRight('swipecell'+index)"/> -->
                                    </template>
                                </van-cell>
                                <template #right>
                                    <van-button  type="danger" :text="active == 1 ? '取消关注' : (item.is_hu == 1 ? '取消关注' : '去关注')" @click="cancelFollow(item, index)"/>
                                </template>
                            </van-swipe-cell>
                        </div>  
                    </div>
                </van-list>
            </van-pull-refresh>
            <!-- </template> -->
            <template v-if="!loading && (!data || data.length === 0)">
                <van-empty class="custom-image" :image="isErr ? 'network' : 'https://img01.yzcdn.cn/vant/custom-empty-image.png'" :description="isErr ? '服务异常,请稍后重试' : '暂无关注'">
                    <template v-if="isErr">
                        <van-button round type="danger" class="bottom-button" @click="getData">重新加载</van-button>
                    </template>
                    <template v-else>
                        <van-button round block type="info" class="bottom-button" @click="toRouter('/taskHall')">前往任务大厅</van-button>
                    </template>
                </van-empty>
            </template>
        </div>
	</div>
</template>
<script>
	export default {
		name: "followList",
		data() {
			return {
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],
                status: '',
                statusTit: '',
                active: '1',
                isLoading: false                    
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.page = 0
            this.data = [];
            this.getData()
		},
		methods: {
            leftBack() {
				this.$router.go(-1);
            },
            toRouter (path) {
                this.$router.push(path)
            },
            onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
            },
            // 切换任务完成状态
            handleTabClick(name, title) {
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = [];
                this.active = name
                this.getData()
            },
            getData() {
                if (this.active == 1) {
                    this.getFollowList()
                } else if (this.active == 2) {
                    this.getFenLists()
                }
            },
            // 获取粉丝列表
            getFenLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
				this.$api.fenLists({
					page: page,
					size: this.size
				}).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
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
                    this.isLoading = false
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.data = []
					this.isErr = true
				})
            },
            // 获取关注列表
            getFollowList () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
				this.$api.guanLists({
					page: page,
					size: this.size
				}).then(res => {
                    this.loading = false
                    this.isLoading = false
					if (res.errno == 0) {
						// res.data.data = [{
                        //     id: 1,
                        //     name: '张三',
                        //     img: 'http://coopera.xfd365.com/public/uploads/20210607/dfe0728c25e520d06918c6af3c7a32c6.png',
                        //     num: 30
                        // },{
                        //     id: 2,
                        //     name: '李四',
                        //     img: 'http://coopera.xfd365.com/public/uploads/20210607/dfe0728c25e520d06918c6af3c7a32c6.png',
                        //     num: 30
                        // },{
                        //     id: 3,
                        //     name: '王五',
                        //     img: 'http://coopera.xfd365.com/public/uploads/20210607/dfe0728c25e520d06918c6af3c7a32c6.png',
                        //     num: 30
                        // },{
                        //     id: 4,
                        //     name: '测试1',
                        //     img: 'http://coopera.xfd365.com/public/uploads/20210607/dfe0728c25e520d06918c6af3c7a32c6.png',
                        //     num: 30
                        // },{
                        //     id: 5,
                        //     name: '测试2',
                        //     img: 'http://coopera.xfd365.com/public/uploads/20210607/dfe0728c25e520d06918c6af3c7a32c6.png',
                        //     num: 30
                        // }]
                        // res.data.totalPage = 1
                        
						let data = res.data.data
						if (data && data.length > 0) {
							if (page == 1) {
                                this.data = []
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
                    this.isLoading = false
					this.loading = false
					this.finished = true
                    this.page = 0
                    this.data = []
					this.isErr = true
				})
            },
            // 显示取消按钮
            openRight (ref) {
                if (this.$refs[ref][0].offset) {
                    this.$refs[ref][0].close();
                    return;
                }
                this.$refs[ref][0].open('right')
            },
            // 点击取消关注
            cancelFollow (item, index) {
                this.$api.guanAdd({
					user_id: this.active == 1 ? item.to_user_id : item.user_id
				}).then(res => {
					if (res.errno == 0) {
						this.data.splice(index, 1)
                        this.$toast('取消成功')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
					this.$toast('服务异常,请稍后重试')
				})
                
            },
            // 前往当前人任务列表
            toTaskHall (item) {
                if(this.active == 2) return
                this.$router.push({
                    path: '/taskHall',
                    query: {
                        userId: item.to_user_id,
                        userName: item.to_user_name
                    }
                })
            }
        }
	};
</script>
<style lang="less">
	.followList {
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
        .task-box {
            position: relative;
            flex: 1;
            overflow-y: auto;
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
            .task-group-con {
                border-radius: 10px;
                overflow: hidden;
                width: 92%;
                margin: 10px auto;
                background: transparent;
                box-shadow: 3px 3px 6px #ccc;
                .task-group{
                    background: #fff;
                    width: 100%; 
                    .van-cell {
                        line-height: inherit;
                        .van-icon-ellipsis {
                            font-size: 24px;
                            font-weight: bold;
                        }
                    }
                    .name {
                        font-size: 0.36rem;
                        font-weight: bold;
                    }
                    .desc {
                    }
                    .btn {
                        background: #f56c6c;
                        color: #fff;
                        border-radius: 1000px;
                        padding: 6px 12px;
                        border: 1px solid #f56c6c;
                    }
                    .follow {
                        border: 1px solid #fff;
                        background: #f78e8e;
                    }
                    .header-img {
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        background: #f7f8fa;
                        margin-right: 6px;
                        padding: 3px;
                        box-sizing: border-box;
                        img {
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        }
                    }
                    .van-button {
                        height: 100%;
                    }
                    .van-cell:first-of-type{
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                    }
                    .van-swipe-cell__wrapper:last-child {
                        .van-cell {
                            border-bottom-left-radius: 10px;
                            border-bottom-right-radius: 10px;
                        }
                    }
                }
            }
            
        }
        .custom-image {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            .van-empty__image {
                width: 90px;
                height: 90px;
            }
        }
         .bottom-button {
            width: 160px;
            height: 40px;
        }
	}
</style>
