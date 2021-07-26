<template>
	<div class="chooseTaskArea" >
        <!-- <van-nav-bar :border="false" title="任务步骤" left-arrow  @click-left="leftBack"/> -->
		<div class="topTitle">
			<img src="../../images/bgHeader4.png" class="bgxiexian" />
		</div>
		<div class="content">
            <p class="m-title">选择任务专区</p>
            <div class="selCont selCont1">
                <!-- <div class="item" @click="chIdentity(1)">
                    <img src="../../images/selImg1.png" class="leftImg" />
                    <div>
                        <img src="../../images/heuzoshe1.png" class="titleIMg" />
                        <p class="text">{{title1}}</p>
                    </div>
                    <img src="../../images/light4.png" class="rightTop" />
                    <img src="../../images/right2.png" class="rightBottom" />
                </div> -->
                <div class="item" @click="toTask(2)">
                    <img src="../../images/selImg2.png" class="leftImg" />
                    <div>
                        <!-- <img src="../../images/shenfen.png" class="titleIMg" /> -->
                        <p class="text">团长专区</p>
                    </div>
                    <img src="../../images/light4.png" class="rightTop" />
                    <img src="../../images/right3.png" class="rightBottom" />
                </div>
            </div>
            <div class="selCont selCont3">
                <div class="item" @click="toTask(1)">
                    <img src="../../images/selImg5.png" class="leftImg" />
                    <div>
                        <!-- <img src="../../images/applyHzuo.png" class="titleIMg" /> -->
                        <p class="text">普通专区</p>
                    </div>
                    <img src="../../images/light4.png" class="rightTop" />
                    <img src="../../images/right7.png" class="rightBottom" />
                </div>
            </div>

            <div class="back-btn-con">
                <van-button  type="info" round @click="$router.push('/')">返回三位一体</van-button>
            </div>
        </div>
        <div class="fixed-full-con" @click.stop v-if="loading">
            <div class="load-modal">
                <img class="logo" src="https://ljj-dom.oss-cn-beijing.aliyuncs.com/xfd/xuanshang/sanwei-app-logo.png" alt="">
                <span class="text">正在获取身份...</span>
            </div>
        </div>
	</div>
</template>
<script>
	export default {
		name: "chooseTaskArea",
		data() {
			return {
				loading: true
			};
		},
		mounted() {
            window.leftBack = this.leftBack
            this.loading = true
            this.isTeam()
		},
		methods: {
            leftBack () {
                this.$router.go(-1)
            },
            isTeam () {
                localStorage.setItem('publish', 1)
                this.$api.isTeam({}).then(res => {
                    this.loading = false
                    if (res.errno == 0) {
                        localStorage.setItem('isTeam', true)
                    } else {
                        localStorage.setItem('isTeam', false)
                        setTimeout(() =>{
                            this.$router.push({
                                path: '/taskIndex'
                            })
                        })
                    }
                }).catch(err => {
                    this.loading = false
                    localStorage.setItem('isTeam', false)
                })
            },
            toTask (type) {
                localStorage.setItem('publish', type)
                setTimeout(() =>{
                    this.$router.push({
                        path: '/taskIndex'
                    })
                })
            }
		},
	}
</script>
<style lang="less">
	.chooseTaskArea {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #f0f6fc;
        // background-size: 100% 300px;
        // background-color: #f0f6fc;
		// background: url(../../images/bgHeader4.png) no-repeat;

		.topTitle {
			display: flex;
			justify-content: space-between;
			.bgxiexian {
				width: 100%;
				height: 300px;
			}
		}

		.content {
            position: relative;
            margin-top: -170px;
			padding: 10px 20px;
			background: #f0f6fc;
			border-radius: 10px 10px 0 0;
		}

		.m-title {
            font-size: 0.36rem;
            color: #333;
            font-weight: bold;
		}
		
		.selCont {
			.item {
				height: 85px;
				margin-top: 10px;
				border-radius: 15px 15px 10px 10px;
				display: flex;
				align-items: center;
				position: relative;

				.leftImg {
					width: 101px;
					margin-top: 15px;
				}

				div {
					width: calc(100% - 120px);
				}

				.titleIMg {
					height: 15px;
				}

				.text {
					margin-top: 5px;
					font-size: 14px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.rightTop {
					position: absolute;
					top: 0;
					right: 0;
					width: 141px;
				}

				.rightBottom {
					position: absolute;
					right: 0;
					bottom: 0;
					width: 30px;
				}
			}
		}

		.selCont1 {
			.item {
				&:nth-child(1) {
					background: linear-gradient(#fff0e2 0%, #ffe2d6 100%);

					.text {
						color: #8F6B5D;
					}
				}

				&:nth-child(2) {
					background: linear-gradient(#e4fcff 0%, #d6f8ff 100%);

					.text {
						color: #5D868F;
					}
				}


			}
		}

		.selCont3 {
			.item {
				background: linear-gradient(#e2ebf8 0%, #e2ebf8 100%);

				.text {
					color: #476899;
				}
			}
        }
        
        .back-btn-con {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem 0;
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
