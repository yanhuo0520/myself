<template>
  <div class="scoringRecord" :style='{height: deviceHeight + "px"}'>
    <van-nav-bar title="评分记录" left-arrow fixed @click-left="returnLast()" />
    <van-list v-model="loading" :finished="finished"  @load="getCreaitList"  >
      <div  class="content" v-if="!isKong && list.length > 0"   v-for="(item,index) in list" :key="index" >
        <div class="item">
          <div class="left">
            <img :src="item.is_n == 2 ? nmImg : item.photo " />
            <div>
              <p class="title" v-text="item.is_n == 2 ? '匿名' :  item.name"></p>
              <p class="time">评分时间: {{item.add_time}}</p>
            </div>
          </div>
          <div class="right">
            <p class="price">{{item.score}} </p>
            <img src="../../images/credit/fenshu.png" alt="" >
          </div>
        </div>
      </div>
      
    <template #finished>
        <div  v-if="list.length > 0"> 没有更多了</div>
        <div v-else class="empty">
          <img src="../../images/credit/null.png" alt="">
        </div>
        
    </template>
    </van-list>
   
  </div>
</template>

<script>
  export default {
    name: "scoringRecord",
    data() {
      return {
        deviceHeight: document.body.clientHeight,
        list: [],
        page: 1, //当前页
        finished: false, //是否加载完成
        loading: false, //是否加载更多
        nmImg: require('../../images/credit/nm-touxiang.png'),
        isKong: false,
         isRefresh: 1,
        lastPath: '',
      };
    },
    created() {
         let lastPath = this.$route.query.lastPath; 
       if(lastPath){
         this.lastPath = lastPath;
       }
       document.documentElement.scrollTop = 0;
    },
    mounted(){
      window.leftBack = this.leftBack
    },
    methods: {
        leftBack() {
        this.returnLast()
      },
      returnLast(){
        this.$router.push({
            path:this.lastPath,
            query:{
                isRefresh: this.isRefresh
            }
        })
      },
      // 查看自评列表
      getCreaitList() {
        let that = this;
        that.$api.myCreditLists({
          size: 10,
          page: that.page
        }).then(res => {
          if (res.errno == 0) {
            if (res.data.data.length != 0) {
               if (res.total == 1) {
                  that.list = res.data.data;
                } else {
                  that.list = that.list.concat(res.data.data);
                }
                if (res.current_page < res.total) {
                    that.page++;
                }
              that.loading = false;
            } else {
                if (res.total == 0) {
                  that.list = [];
                  that.isKong = true;
                }
                that.finished = true;
                that.loading = false;
            }
             // 数据全部加载完成
              if (res.total == res.current_page) {
                that.finished = true;
              }
          } else {
               that.isKong = true;
            that.$toast(res.errmsg)
          }
        }).catch(err => {

        })
      },
    },
  }
</script>

<style lang="less">
  .scoringRecord {
    min-height: 100%;
    padding-top: 46px;
    background-color: #F0F6FC;

    .van-nav-bar {
      background: #F0F6FC;

      .van-icon {
        color: #222222;

      }

      .van-nav-bar__title {
        font-size: 16px;
        font-weight: bold;
      }

    }

    .content {
        position: relative;
      background: #FFFFFF;
      border-radius: 10px;
      padding: 15px;
      margin: 15px;

      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #F0F6FC;

        &:first-child {
          border-radius: 10px 10px 0 0;
        }
      }

      .left {
        display: flex;
        align-items: center;

        img {
          width: 40px;
          margin-right: 10px;
        }

        .title {
          font-size: 15px;
          margin-bottom: 9px;

          .faile {
            color: #F24B4B;
            background: #ffeded;
            border: 1px solid #f24b4b;
          }
        }

        .time {
          margin-top: 6px;
          color: #9AA8B6;
        }
      }

      .right {
        display: flex;
        align-items: center;

        .price {
          font-weight: bold;
          font-size: 25px;
          margin-right: 20px;
        }

        >img {
          height:14px;
          position: absolute;
          right: 15px;
          top: 15px;
        }
      }

    }
    .empty {
        width: 100%;
        height: auto;
        margin: 0 auto;
        margin-top: 100px;
        >img {
            width: 100%;
            height: 100%;
        }
    }

  }
</style>