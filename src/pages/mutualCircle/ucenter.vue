<template>
	<div class="mutualUcenter" >
		<van-nav-bar :border="false"  :title="userInfo && userInfo.user_id ? ( myUserId == userInfo.user_id ? '我的主页' : ('【'+userInfo.name+'】的主页')) : '用户主页'" left-arrow @click-left="leftBack"/>
         <!-- <div class="tab-box"> -->
        <div class="user-info" v-if="userInfo">
            <div  class="logo">
                <img  :src="userInfo.photo" alt="">
            </div>
            <div class="name-con">
                <div class="name">{{userInfo.name}}</div>
                <div class="info-box">
                    <div class="info-item">
                        <div class="label">粉丝</div>
                        <div class="num">{{userInfo.user_fen}}</div>
                    </div>
                    <div class="info-item">
                        <div class="label">关注</div>
                        <div class="num">{{userInfo.user_guan}}</div>
                    </div>
                </div>
            </div>
            <div class="follow-con" v-if="myUserId != userInfo.user_id">
                <template v-if="userInfo.is_to == 1 && userInfo.is_me == 1">
                    <div @click="addFollowByTop" class="btn can" ><van-icon name="sort" /> 互相关注</div>
                </template>
                <template v-else>
                    <template v-if="userInfo.is_to == 1">
                        <div  @click="addFollowByTop" class="btn can" ><van-icon name="wap-nav" /> 已关注</div>
                    </template>
                    <template v-else>
                        <div @click="addFollowByTop" class="btn">+ 关注</div>
                    </template>
                </template>
            </div>
        </div>
        <!-- </div> -->
        <van-sticky>
            <div class="tab-box">
                <div class="tab-con">
                    <div class="tab-item" @click="handleTabClick(1)">
                        <img :src="status == 1 ? tabImgArr[0] : tabImgArr[1]" alt="">
                    </div>
                    <div class="tab-item" @click="handleTabClick(2)">
                        <img :src="status == 1 ? tabImgArr[3] : tabImgArr[2]" alt="">
                    </div>
                </div>
                <div style="flex:1"></div>
            </div>
        </van-sticky>
        <div class="article-box">
            <div class="article-con">
                <template v-if="status == 1">
                    <van-pull-refresh style="min-height:60vh" v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
                        <van-list v-model="loading" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
                            <template #loading>
                                <div class="list-loading-con">
                                    <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                                    <span>加载中...</span>
                                </div>
                            </template>
                            <template #finished>
                                <template v-if="data && data.length > 0">
                                    没有更多了
                                </template>
                                <template v-else>
                                    <div class="no-data-con">
                                        <span>还未发布圈子</span>
                                    </div>
                                </template>
                            </template>
                                <div class="article-item" v-for="(item,index) in data" :key="index" @click="toDetail(item)">
                                    <div class="bottom-con">
                                        <van-image class="main-img" :src="item.img_list && item.img_list.length > 0 ? item.img_list[0] : ''" >
                                            <!-- <template v-slot:error>加载失败</template> -->
                                        </van-image>
                                        <!-- <img class="main-img" :src="../../images/mutualCircle/el.png" alt=""> -->
                                        <div class="my-article">
                                            <div class="date-con">
                                                <div class="info-item time-con">
                                                    <img src="../../images/mutualCircle/time-icon.png" alt="">
                                                    <span>{{item.add_time}}</span>
                                                </div>
                                            </div>
                                            <div class="info">
                                                {{item.content}}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </van-list>
                    </van-pull-refresh>
                </template>
                <template v-if="status == 2">
                    <van-sticky offset-top="1.2rem" style="width:100%">
                        <div class="tab2-con">
                            <div class="tab2-item" :class="{'active': tabActive == 1}" @click="handleTab2Change(1)">{{myUserId == userInfo.user_id ? '关注的人' : '他/她的关注'}}</div>
                            <div class="tab2-item" :class="{'active': tabActive == 2}"  @click="handleTab2Change(2)">{{myUserId == userInfo.user_id ? '我的粉丝' : '他/她的粉丝'}}</div>
                            <!-- <van-tabs v-model="tabActive" type="card" @change="handleTab2Change">
                                <van-tab title="关注的人" name="1"></van-tab>
                                <van-tab title="我的粉丝" name="2"></van-tab>
                            </van-tabs> -->
                        </div>
                    </van-sticky>
                    <van-pull-refresh style="min-height:50vh" v-model="isLoading" @refresh="onRefresh" :disabled="!data || data.length == 0">
                        <van-list :immediate-check="false" v-model="loading" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
                            <template #loading>
                                <div class="list-loading-con">
                                    <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                                    <span>加载中...</span>
                                </div>
                            </template>
                            <template #finished>
                                <template v-if="data && data.length > 0">
                                    没有更多了
                                </template>
                                <template v-else>
                                    <div class="no-data-con">
                                        <span>{{tabActive == 1 ? '还未关注任何人' : '还没有粉丝'}}</span>
                                    </div>
                                </template>
                            </template>
                            <template v-if="tabActive == 1">
                                <div class="task-group-con">
                                    <div class="task-group" v-for="(item,index) in data" :key="index" >
                                        <!-- <van-swipe-cell class="van-hairline--top" :ref="'swipecell'+index"> -->
                                            <van-cell center :border="false"   @click="toUcenter(item)">
                                                <template #title>
                                                    <span class="name">{{item.to_user_name}}</span>   
                                                    <template v-if="item.from == 1">
                                                        <van-tag round type="warning">悬赏模块</van-tag>
                                                    </template>
                                                    <template v-if="item.from == 2">
                                                        <van-tag round type="primary">圈子模块</van-tag>
                                                    </template>
                                                </template>
                                                <template #label>
                                                    <span class="desc">{{item.guan_count}}人已关注</span>    
                                                </template>
                                                <template #icon>
                                                    <img  class="header-img" :src="item.photo" />
                                                </template>
                                                <template #right-icon>
                                                    <template v-if="item.is_hu == 1">
                                                        <div @click.stop="addFollowByItem(item, index)" class="btn follow" ><van-icon name="sort" /> 互相关注</div>
                                                    </template>
                                                    <template v-else>
                                                        <div @click.stop="addFollowByItem(item, index)" class="btn follow" ><van-icon name="wap-nav" /> 已关注</div>
                                                    </template>
                                                    <!-- <van-icon name="ellipsis" @click.stop="openRight('swipecell'+index)"/> -->
                                                </template>
                                            </van-cell>
                                            <!-- <template #right>
                                                <van-button  type="danger" :text="active == 1 ? '取消关注' : (item.is_hu == 1 ? '取消关注' : '去关注')" @click="cancelFollow(item, index)"/>
                                            </template>
                                        </van-swipe-cell> -->
                                    </div>  
                                </div>
                            </template>
                            <template v-if="tabActive == 2">
                                <div class="task-group-con">
                                    <div class="task-group" v-for="(item,index) in data" :key="index" >
                                        <!-- <van-swipe-cell class="van-hairline--top" :ref="'swipecell'+index"> -->
                                            <van-cell center :border="false"  @click="toUcenter(item)">
                                                <template #title>
                                                    <span class="name">{{item.to_user_name}}</span>
                                                    <template v-if="item.from == 1">
                                                        <van-tag round type="warning">悬赏模块</van-tag>
                                                    </template>
                                                    <template v-if="item.from == 2">
                                                        <van-tag round type="primary">圈子模块</van-tag>
                                                    </template>
                                                </template>
                                                <template #label>
                                                    <span class="desc">{{item.guan_count}}人已关注</span>    
                                                </template>
                                                <template #icon>
                                                    <img class="header-img" :src="item.photo" />
                                                </template>
                                                <template #right-icon>
                                                    <template v-if="item.is_hu == 1">
                                                        <div @click.stop="addFollowByItem(item, index)" class="btn follow" ><van-icon name="sort" /> 互相关注</div>
                                                    </template>
                                                    <template v-else>
                                                        <div @click.stop="addFollowByItem(item, index)" class="btn" >+ 关注</div>
                                                    </template>
                                                    <!-- <van-icon name="ellipsis" @click.stop="openRight('swipecell'+index)"/> -->
                                                </template>
                                            </van-cell>
                                            <!-- <template #right>
                                                <van-button  type="danger" :text="active == 1 ? '取消关注' : (item.is_hu == 1 ? '取消关注' : '去关注')" @click="cancelFollow(item, index)"/>
                                            </template> -->
                                        <!-- </van-swipe-cell> -->
                                    </div>  
                                </div>
                            </template>
                        </van-list>
                    </van-pull-refresh>
                </template>
            </div>
        </div>

        <div class="fixed-full-con" @click.stop v-if="isDetailLoading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">加载中...</span>
            </div>
        </div>
	</div>
</template>
<script>
	export default {
		name: "mutualUcenter",
		data() {
			return {
                userInfo: null,
                userId: null,
                tabImgArr: [require('../../images/mutualCircle/ucenter-tab-select-icon1.png'),require('../../images/mutualCircle/ucenter-tab-icon1.png'),require('../../images/mutualCircle/ucenter-tab-select-icon2.png'),require('../../images/mutualCircle/ucenter-tab-icon2.png')],
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],
                status: 1,
                lastStatus: 1,

                tabActive: '1',

                isLoading: false,

                isDetailLoading: true,

                myUserId: null
			};
		},
		activated() {
            window.leftBack = this.leftBack
            let lastPath = this.$route.query.lastPath ? this.$route.query.lastPath : ''
            this.userId = this.$route.query.userId ? this.$route.query.userId : ''
            this.myUserId = localStorage.getItem('userIdByCirle')
            if (lastPath == '/mutualCircle') {
                this.initData()
                this.getUserDetail()
            } else {
                let meta = this.$route.meta
                if (meta && meta.scrollPosition && Number(meta.scrollPosition.y) > 100) {
                    this.lastStatus = ''
                    document.querySelector('.mutualUcenter').scrollTop = meta.scrollPosition.y
                } else  {
                    this.initData()
                    this.getUserDetail()
                }
            }
        },
        beforeRouteLeave (to, from, next) {
            from.meta.scrollPosition.y = document.querySelector('.mutualUcenter').scrollTop
			next()
	    },
		methods: {
            // 初始化数据
            initData () {
                this.page = 0
                this.size = 10
                this.data = []
                this.status = 1
                this.lastStatus = 1
                this.isDetailLoading = true
            },
            // 跳转用户中心
            toUcenter (row) {
                let userId = null
                if (this.tabActive == 1) {
                    userId = row.to_user_id
                } else if (this.tabActive == 2) {
                    userId = row.user_id
                }
                if (userId) {
                    if (userId == this.userId) return
                    this.$router.push({
                        path: '/mutualUcenter',
                        query: {
                            lastPath: '/mutualDetail',
                            userId: userId
                        }
                    })
                }
            },
			// 返回
			leftBack () {
                this.$router.go(-1)
            },
            // 路由跳转
            toRouter (path) {
                this.$router.push(path)
            },
            onRefresh() {
                this.page = 0
                this.loading = true
                this.finished = false
                this.getData()
            },
            // 获取用户信息
            getUserDetail () {
                this.$api.userDetail({
                    user_id: this.userId
                }).then(res => {
                    this.isDetailLoading = false
					if (res.errno == 0) {
                        this.userInfo = res.data
                        this.getData()
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.isDetailLoading = false
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 关注/取消关注 -顶部按钮操作
            addFollowByTop () {
                this.$api.guanUserAdd({
                    user_id: this.userId
                }).then(res => {
					if (res.errno == 0) {
                        if (this.userInfo.is_to == 1) {
                            this.userInfo.is_to = 2
                        } else {
                            this.userInfo.is_to = 1
                        }
                        if (this.status == 2) {
                            let curIndex = 'no'
                            if (this.tabActive == 1) {
                                this.data.forEach((item, index) =>{
                                    if (item.to_user_id == this.userId) {
                                        curIndex = index
                                    }
                                })
                            } else if (this.tabActive == 2) {
                                this.data.forEach((item, index) =>{
                                    if (item.user_id == this.userId) {
                                        curIndex = index
                                    }
                                })
                            }
                            if (curIndex == 'no') {
                                let tmpObj = {
                                    from: 2,
                                    guan_count: Number(this.userInfo.user_guan)+1,
                                    is_hu: 1,
                                    photo: this.userInfo.photo,
                                    user_id: this.userId,
                                    to_user_id: this.userId
                                }
                                this.data.unshift(tmpObj)
                            } else {
                                // this.userInfo.user_guan = Number(this.userInfo.user_guan)-1
                                this.data.splice(curIndex, 1)
                            }
                        }
                        this.$toast(this.userInfo.is_to == 2 ? '已取消关注' : '关注成功')
					} else {
						this.$toast(res.errmsg)	
					}
				}).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
				})
            },
            // 对于当前粉丝/关注的人 处理是否关注
            addFollowByItem (row, index) {
                if (this.tabActive == 1) {
                    this.$dialog.confirm({
                        title: '提示',
                        message: '确定不再关注此人？',
                        theme: 'round-button',
                    })
                    .then(() => {
                        this.handleGuan(row, index, () =>{
                            this.data.splice(index, 1)
                            this.$toast('已取消关注')
                            if (row.user_id == this.userId) {
                                this.userInfo.is_to = 2
                            }
                        })
                    })
                    .catch(() => {
                        // on cancel
                    });
                    
                } else if (this.tabActive == 2) {
                    if (row.is_hu == 1) {
                        this.$dialog.confirm({
                            title: '提示',
                            message: '确定不再关注此人？',
                            theme: 'round-button',
                        })
                        .then(() => {
                            this.handleGuan(row, index, () =>{
                                this.data.splice(index, 1)
                                this.$toast('已取消关注')
                                if (row.user_id == this.userId) {
                                    this.userInfo.is_to = 2
                                }
                            })
                        })
                        .catch(() => {
                            // on cancel
                        });
                    } else {
                        this.handleGuan(row, index, () =>{
                            this.$toast('关注成功')
                            row.is_hu = 1
                            if (row.user_id == this.userId) {
                                this.userInfo.is_to = 1
                            }
                        })
                    }
                }
            },
            // 添加/取消关注处理
            handleGuan (row, index, callBack) {
                this.$api.guanUserAdd({
                    user_id: this.tabActive == 1 ? row.to_user_id : row.user_id
                }).then(res => {
                    if (res.errno == 0) {
                        callBack && typeof callBack == 'function' && callBack()
                    } else {
                        this.$toast(res.errmsg)	
                    }
                }).catch(err=>{
                    this.$toast('服务异常,请稍后重试')
                })
            },
            // 切换一级tab栏
            handleTabClick(type) {
                this.status = type;
                if (this.status == this.lastStatus && !this.isErr) return
                this.lastStatus = this.status
                this.page = 0
                this.loading = true
                this.finished = false
                this.data = [];
                this.getData()
            },
            // 切换二级tab栏
            handleTab2Change (name) {
                if (name == this.tabActive) return
                this.page = 0
                this.loading = true
                this.finished = false
                this.tabActive = name
                this.data = [];
                this.getData()
            },
            // 跳转圈子详情
            toDetail (row) {
                this.$router.push({
                    path: '/mutualDetail',
                    query: {
                        id: row.circle_id,
                        userId: this.userId,
                        lastPath: '/mutualUcenter',
                    }
                })
            },
            getArticleList () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                    user_id: this.userId
                }
				this.$api.userCircleLists(params).then(res => {
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
						} else {
                            this.data = []
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
            getData () {
                if (this.status == 1) {
                    this.getArticleList()
                } else if (this.status == 2) {
                    if (this.tabActive == 1) {
                        this.userGuanLists()
                    } else if (this.tabActive == 2) {
                        this.fenLists()
                    }
                }
            },
            // 我关注的人列表
            userGuanLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                    user_id: this.userId
                }
				this.$api.userGuanLists(params).then(res => {
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
						} else {
                            this.data = []
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
            // 粉丝列表
            fenLists () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
                let params = {
                    page: page,
                    size: this.size,
                    user_id: this.userId
                }
				this.$api.fenLists(params).then(res => {
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
						} else {
                            this.data = []
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
		},
	}
</script>
<style lang="less">
	.mutualUcenter {
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
        }
        .user-info {
            display: flex;
            align-items: center;
            background: #fff;
            border-top-left-radius: 0.2rem;
            border-top-right-radius: 0.2rem;
            padding: 0.4rem;
            margin-bottom: 0.4rem;
            padding-left: 1.6rem;
            position: relative;
            margin-top: 0.5rem;
            .logo {
                width: 1.2rem;
                height: 1.2rem;
                padding: 3px;
                border-radius: 1000px;
                position: absolute;
                left: 0.4rem;
                top: -0.5rem;
                background: #f9f9f9;
                // padding: 4px;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    object-fit: cover;
                }
            }
            .name-con {
                display: flex;
                flex-direction: column;
                padding-left: 10px;
                .name {
                    font-size: 0.36rem;
                    font-weight: bold;
                    margin-bottom: 6px;
                }
                .info-box {
                    display: flex;
                    align-items: center;
                    .info-item {
                        display: flex;
                        margin-right: 6px;
                    }
                }
            }
            .follow-con {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                .btn {
                    padding: 0.2rem 0.4rem;
                    border-radius: 1000px;
                    color: #fff;
                    background-image: linear-gradient(to right, #ff9700 , #ed1c24);
                    // background: #ff9700;
                    // background: #ed1c24;
                }
                .can {
                    display: flex;
                    background: #f1f1f1;
                    color: #555;
                }
            }
        }
        .tab-box {
            display: flex;
            align-items: center;
            flex-direction: column;
            background: linear-gradient(0deg,#f0f6fc 0%, #ffffff 100%);
            height: 5.3rem;
            border-radius: 0.53rem 0.53rem 0 0;
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
                        width: 16%;
                    }
                }
            }
        }
        .van-sticky--fixed {
            .tab-box {
                border-radius: inherit;
                height: 1.2rem;
            }
        }
        .article-box {
            padding: 0 0.4rem;
            margin-top: -3.8rem;
            position: relative;
            .article-con {
                width: 100%;
                display: flex;
                align-items: center;
                flex-direction: column;
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
                    width: 100%;
                }
                .tab2-con {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    .tab2-item {
                        border: 1px solid #dcdfe6;
                        color: #333;
                        padding: 0.2rem 0.5rem;
                        border-radius: 3px;
                        // font-weight: bold;
                        font-size: 0.36rem;
                       
                    }
                    .tab2-item:first-child {
                        border-right: none;
                    }
                    .active {
                        color: #fff;
                        background: #99c0e9;
                        font-weight: bold;
                        border: none;
                    }
                }
                .task-group-con {
                    border-radius: 10px;
                    overflow: hidden;
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
                        .van-tag {
                            font-size: 0.25rem;
                            padding: 0.01rem 0.15rem;
                        }
                        .desc {
                        }
                        .btn {
                            font-size: 0.3rem;
                            padding: 0.2rem 0.3rem;
                            border-radius: 1000px;
                            color: #fff;
                            background-image: linear-gradient(to right, #ff9700 , #ed1c24);
                            // background: #ff9700;
                            // background: #ed1c24;
                        }
                        .follow {
                            display: flex;
                            background: #f1f1f1;
                            color: #555;
                        }
                        // .btn {
                        //     background: #f56c6c;
                        //     color: #fff;
                        //     border-radius: 1000px;
                        //     padding: 6px 12px;
                        //     border: 1px solid #f56c6c;
                        // }
                        // .follow {
                        //     border: 1px solid #fff;
                        //     background: #f78e8e;
                        // }
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
                .article-item {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    background: #fff;
                    border-radius: 10px;
                    padding: 0.4rem;
                    margin-bottom: 0.39rem;
                    .top-user-con {
                        width: 100%;
                        display: flex;
                        .user-avatar {
                            width: 1.2rem;
                            height: 1.2rem;
                            border-radius: 50%;
                            margin-right: 10px;
                        }
                        .user-info {
                            flex: 1;
                            .name {
                                font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                                font-size: 0.4rem;
                                font-weight: bold;
                                margin-bottom: 10px;
                                line-height: 1.2;
                            }
                           
                        }
                        .user-status {
                            .follow-icon {
                                width: 18px;
                            }
                        }
                    }
                    .detail-con {
                        width: 100%;
                        .text-con {
                            width: 100%;
                            font-size: 0.38rem;
                            font-family: Microsoft YaHei, Microsoft YaHei-Regular;
                            font-weight: 400;
                            text-align: justifyLeft;
                            color: #444444;
                            line-height: 1.5;
                            margin: 10px 0;
                        }
                        .img-con {
                            width: 100%;
                            .img-item {
                                --foo: calc((100% - 7.95rem)/2); // 发布的图片间隙距离
                                width: 2.65rem;
                                height: 1.85rem;
                                display: block;
                                float: left;
                                margin-right: var(--foo);
                                margin-bottom: var(--foo);
                            }
                            .img-item:nth-child(3n) {
                                margin-right: 0;
                            }
                        }
                    }
                }
            }
        }
        .bottom-con {
            display: flex;
            align-items: center;
            width: 100%;
            background: #f9f9f9;
            .main-img {
                width: 1.8rem;
                height: 1.8rem;
                border-radius: 4px;
            }
            .my-article {
                flex: 1;
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                padding-left: 10px;
                .tit {
                    font-weight: bold;
                    font-size: 0.35rem;
                }
                .date-con {
                    display: flex;
                    align-items: center;
                    .info-item {
                        display: flex;
                        align-items: center;
                        background: #f0f6fc;
                        border-radius: 100px;
                        color: #9aa8b6;
                        padding: 3px 8px;
                        font-size: 0.32rem;
                        img {
                            width: 10px;
                            margin-right: 3px;
                        }
                    }
                    .addr-con {
                        margin-right: 10px;
                        max-width: 3.5rem;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    .time-con {
                        max-width: 6rem;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
                .info {
                    margin-top: 6px;
                    color: #888;
                    line-height: 1.2;
                    display: -webkit-box;
                    text-overflow: ellipsis;
                    word-wrap: break-word;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
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
	}
</style>
