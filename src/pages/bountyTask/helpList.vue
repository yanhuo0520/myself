<template>
	<div class="helpList">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="帮助中心" left-arrow  @click-left="leftBack"/>
        <div class="task-box">
            <!-- <template > -->
                <van-list v-model="loading" :finished="finished" @load="getData" :finished-text="data && data.length > 0 ? '没有更多了' : ''" >
                    <template #loading>
                        <div class="list-loading-con">
                            <img  src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                            <span>加载中...</span>
                        </div>
                    </template>
                    <div class="task-group-con">
                        <div class="task-group" v-for="(item,index) in data" :key="index" >
                            <van-cell center :border="false"  is-link  @click="detail(item)">
                                <template #title>
                                    <span class="name">【{{item.content}}】</span>    
                                </template>
                                <template #label>
                                    <span class="desc">{{item.update_time}}</span>    
                                </template>
                                <!-- <template #icon>
                                <img class="header-img" :src="item.img" />
                                </template> -->
                            </van-cell>
                        </div>  
                    </div>
                </van-list>
            <!-- </template> -->
            <template v-if="!loading && (!data || data.length === 0)">
                <van-empty class="custom-image" :image="isErr ? 'network' : 'https://img01.yzcdn.cn/vant/custom-empty-image.png'" :description="isErr ? '服务异常,请稍后重试' : ('暂无'+ (statusTit && statusTit != '全部' ? '【'+statusTit+'】的任务' : '已领取的任务'))">
                    <template v-if="isErr">
                        <van-button round type="danger" class="bottom-button" @click="getData">重新加载</van-button>
                    </template>
                    <template v-else>
                        <van-button round block type="info" class="bottom-button" @click="toTaskHall">前往任务大厅</van-button>
                    </template>
                </van-empty>
            </template>
        </div>
	</div>
</template>
<script>
	export default {
		name: "helpList",
		data() {
			return {
                loading: false,
                finished: false,
                isErr: false,
                page: 0,
                size: 10,
                data: [],
                status: '',
                statusTit: ''
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.page = 0
            this.data = [];
		},
		methods: {
            leftBack() {
				this.$router.go(-1);
            },
            getData () {
                this.finished = false
				let page = this.page + 1
                this.loading = true
                this.isErr = false
				this.$api.helpLists({
					page: page,
					size: this.size
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
            // 查看详情
            detail (item) {
                this.$router.push({
                    path: '/articleDetail',
                    query: {
                        id: item.id
                    }
                })
            },
            // 前往任务大厅
            toTaskHall () {
                this.$router.push({
                    path: '/taskHall',
                    query: {}
                })
            }
        }
	};
</script>
<style lang="less">
	.helpList {
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
            .task-group-con {
                overflow: hidden;
                width: 92%;
                margin: 10px auto;
                background: transparent;
                .task-group{
                    background: #fff;
                    width: 100%; 
                    border-radius: 6px;
                    margin-bottom: 15px;
                    overflow: hidden;
                    box-shadow: 1px 1px 4px #ccc;
                    .van-cell {
                        line-height: inherit;
                    }
                    .name {
                        font-size: 0.36rem;
                        font-weight: bold;
                    }
                    .desc {
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
