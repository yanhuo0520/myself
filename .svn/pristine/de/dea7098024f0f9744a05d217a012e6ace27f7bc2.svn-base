<template>
    <div class="index">
        <div class="header">
            <div class="common">
                <div class="left">
                    <img src="../images/address.png" alt="">
                    郑州市郑东新区
                </div>
                <div class="right">
                    <van-badge :content="5" max="99" color="#F45E45">
                        <img src="../images/message.png" alt="">
                    </van-badge>
                </div>
            </div>
            <div class="common">
                <img src="../images/logo.png" alt="">
                <img src="../images/qiandao.png" alt="">
            </div>
        </div>

        <div class="card">
            <div class="top">
                <img src="../images/account.png" alt="">
                <img src="../images/jiantou.png" alt="">
            </div>
            <div class="module">
                <div>
                    <span>5825</span>
                    <p>信用额度</p>
                    <img src="../images/fen.png" alt="">
                </div>
                <div>
                    <span>76</span>
                    <p>合作社账户</p>
                    <img src="../images/xiang.png" alt="">
                </div>
                <div>
                    <span>41</span>
                    <p>我的保险</p>
                    <img src="../images/fen1.png" alt="">
                </div>
                <div>
                    <span>974</span>
                    <p>我的账单</p>
                    <img src="../images/weihuan.png" alt="">
                </div>
            </div>
        </div>

        <div class="grid">
            <van-grid :column-num="4" :border="false">
                <van-grid-item v-for="(item,index) in grid" :key="index" @click="$router.push(item.path)">
                    <img :src="item.icon" alt="">
                    {{item.name}}
                </van-grid-item>
            </van-grid>
        </div>

        <p>专属特惠福利</p>

        <div class="fuli">
            <img src="../images/zhunong.png" alt="">
            <img src="../images/hezuoshe.png" alt="">
        </div>
        
        <p>实惠好物精选</p>

        <div class="jingxuan">
            <div class="left">
                <img src="../images/nongzishangcheng.png" alt="" @click="$router.push('/nongziShop')">
            </div>
            <div class="right">
                <img src="../images/xinrenhaoli.png" alt="">
                <img src="../images/jingxuanhaowu.png" alt="">
            </div>
        </div>

        <bottom :idx="0"></bottom>
    </div>
</template>
<script>
import bottom from "@/components/bottom";
export default {
  name: "index",
  components: {
    bottom
  },
  data () {
    return {
        grid:[
            {name:'账户管家',icon:require('../images/indexZhgj.png'),path:'/accountIndex'},
            {name:'信用额度',icon:require('../images/indexXyed.png')},
            {name:'信用贷款',icon:require('../images/indexXydk.png')},
            {name:'众筹借款',icon:require('../images/indexZcjk.png')},
            {name:'资金互助',icon:require('../images/indexZjhz.png')},
            {name:'生活缴费',icon:require('../images/indexShjf.png')},
            {name:'保险商城',icon:require('../images/indexBxsc.png')},
        ]
    };
  },
  mounted(){
      
  }
}
</script>
<style lang="less">
.index{
    min-height: 100%;
    background: #f0f6fc;
    position: relative;
    .header{
        background: url(../images/bgHeader1.png) no-repeat;
        background-size: 100% 100%;
        width: calc(100% - 30px);
        height: 252px;
        padding: 15px;
        .common{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            .left{
                display: flex;
                align-items: center;
                img{
                    width: 13px;
                    height: 15px;
                    margin-right: 5px;
                }
            }
            .right{
                img{
                    width: 15px;
                    height: 15px;
                }
            }

            >img:first-of-type{
                width: 137px;
                height: 53px;
            }
            >img:last-of-type{
                width: 117px;
                height: 62px;
            }
        }
    }

    .card{
        background: url(../images/cardBg.png) no-repeat;
        background-size: 100% 100%;
        width: 90%;
        height: 158px;
        position: absolute;
        left: 5%;
        top: 150px;
        .top{
            display: flex;
            justify-content: space-between;
            margin: 5%;
            img:first-of-type{
                width: 58px;
                height: 14px;
            }
            img:last-of-type{
                width: 28px;
                height: 15px;
            }
        }

        .module{
            display: flex;
            justify-content: space-between;
            margin: 0 5%;
            color: #fff;
            div{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                position: relative;
                span{
                    font-size: 20px;
                }
                p{
                    margin: 0;
                }
                img{
                    position: absolute;
                    right: -15px;
                    top: -5px;
                    width: 14px;
                    height: 10px;
                }
            }
            div:last-of-type{
                img{
                    width: 20px;
                }
            }
        }
    }

    .grid{
        width: 90%;
        margin-left: 5%;
        padding-top: 20px;
        background: #fff;
        border-radius: 20px;
        img{
            width: 57px;
            height: 57px;
        }
    }

    >p{
        margin: 5%;
        font-size: 16px;
    }

    .fuli{
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin-left: 5%;
        img{
            width: 48%;
            height: 115px;
        }
    }

    .jingxuan{
        display: flex;
        justify-content: space-between;
        width: 90%;
        margin-left: 5%;
        margin-bottom: 30px;
        .left{
            width: 48%;
            img{
                height: 140px;
                width: 100%;
            }
        }
        .right{
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            width: 48%;
            img{
                height: 65px;
                width: 100%;
            }
        }
    }
}
</style>