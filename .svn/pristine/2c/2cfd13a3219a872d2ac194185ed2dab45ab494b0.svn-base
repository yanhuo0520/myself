<template>
  <div class="eachflows">
    <van-nav-bar title="组织团体互评" left-arrow fixed @click-left="returnLast()" />
    <div v-if="!isInfo" class="top_title">
      <p>请您对<span>“团体成员”</span>作出公平公正的评价</p>
      <img src="../../images/credit/top_title.png" alt="" class="title_img">
    </div>
    <van-skeleton v-if="!isInfo" title avatar :row="3" :loading="loading">
      <van-cell-group>
        <van-cell v-for="(item,index) in scoreList" :key="index" :title="item.content" clickable @click="toggle(item)">
          <template #right-icon>
            <van-switch v-model="item.is_xuan" size="19" />
          </template>
        </van-cell>
      </van-cell-group>
      <van-button class="submit" type="info" @click="addCreditScore">立即提交
        <template #icon>
          <img src="../../images/credit/tijiao.png" alt="" width="15">
        </template>
      </van-button>
    </van-skeleton>
    <div v-if="isInfo" class="pinfen_info">
      <img v-if="isChenggong" src="../../images/credit/hp-cg.png" alt="" class="cheng">
      <img v-else src="../../images/credit/hp-sb.png" alt="" class="cheng">
      <div class="btn">
        <van-button v-if="isChenggong" class="info_btn" type="info" @click="pfAgain('/creditScore')">完成 </van-button>
        <van-button v-else class="info_btn" type="info" @click="pfAgain('/eachOthers')">重新评分 </van-button>
        <p v-if="!isChenggong" @click="pfAgain('/creditScore')">返回信用评分</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "eachflows",
    data() {
      return {
        citizen: '1',
        scoreList: [],
        success_id: '',
        lists: [],
        loading: true,
        isInfo: false,
        isChenggong: true,
        isRefresh: 1,
        lastPath: '',
      };
    },
    mounted() {
      window.leftBack = this.leftBack
    },
    created() {
      let id = localStorage.getItem('id');
      let lastPath = this.$route.query.lastPath;
      if (lastPath) {
        this.lastPath = lastPath;
      }
      if (id != null) {
        this.success_id = id;
      }
      this.getScoreItem()
    },
    methods: {
      leftBack() {
        this.returnLast()
      },
      returnLast(){
         this.$router.push({
          path: this.lastPath,
          query: {
            isRefresh: this.isRefresh
          }
        })
      },
      getScoreItem() {
        let that = this;
        that.$api.scoreItem({}).then(res => {
          if (res.errno == 0) {
            res.data.forEach(item => {
              item.is_xuan = false;
            });
            that.scoreList = res.data;
            that.loading = false;
          } else {
            that.$toast(res.errmsg)
          }
        }).catch(err => {

        })
      },
      toggle(event) {
        let that = this;
        that.lists = [];
        that.scoreList.forEach(item => {
          var items = {};
          items.id = item.id;
          items.content = item.content;
          items.is_xuan = item.is_xuan;
          that.lists.push(items);
        })
      },
      addCreditScore() {
        let that = this;
        if (that.lists.length == 0) {
          that.lists = [];
          that.scoreList.forEach(item => {
            var items = {};
            items.id = item.id;
            items.content = item.content;
            items.is_xuan = item.is_xuan;
            that.lists.push(items)
          })
        }
        that.lists.forEach(item => {
          if (item.is_xuan == true) {
            item.is_xuan = '1';
          } else if (item.is_xuan == false) {
            item.is_xuan = '2';
          }
        })
        that.$api.addCreditScore({
          credit_id: that.success_id,
          lists: JSON.stringify(that.lists)
        }).then(res => {
          if (res.errno == 0) {
            that.isInfo = true;
          } else {
            that.isInfo = true;
            that.isChenggong = false;
          }
        }).catch(err => {

        })
      },

      pfAgain(path) {
        this.$router.push({
          path: path,
          query: {
            isRefresh: this.isRefresh
          }
        })
      }
    },
  }
</script>

<style lang="less">
  .eachflows {
    min-height: 100%;
    padding-top: 46px;

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

    .top_title {
      display: flex;
      height: 37px;
      font-size: 13px;
      background: #F0F6FC;

      >p {
        flex: 1;
        padding: 0 0 0 15px;
        margin-top: 10px;

        >span {
          color: #3B6AF1;
        }
      }

      .title_img {
        float: right;
        height: 100%;
        margin-right: 15px;
      }
    }

    .van-cell::after {
      border-bottom: 0px;
    }

    [class*=van-hairline]::after {
      border-bottom: 0px;
    }

    .submit {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: #3B6AF1;
    }

    .pinfen_info {
      .cheng {
        display: block;
        height: 180px;
        margin: 0 auto;
        margin-top: 30px;
      }

      .btn {
        width: 80%;
        height: 40px;
        margin: 0 auto;
        text-align: center;
        font-size: 15px;

        .info_btn {
          width: 100%;
          border-radius: 20px;
          background-color: #3B6AF1;
          margin: 160px 0 25px 0;
        }

        p {
          color: #444444;
        }
      }
    }
  }
</style>