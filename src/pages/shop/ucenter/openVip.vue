<template>
  <div class="openVip">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="我的积分"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="$router.push('/shopIndex')"
    >
      <template #right>
        <img src="../../../images/shop/ucenter/shouye.png" alt="" width="20" />
      </template>
    </van-nav-bar>
    <div class="banner">
      <div class="text">
        <p>当前积分</p>
        <p>{{ integ }}</p>
      </div>
    </div>

    <van-tabs v-model="active" @click="onClick" color="#D1B27D">
      <van-tab
        v-for="(items, index) in titleList"
        :title="items.name"
        :key="index"
      ></van-tab>
    </van-tabs>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getIntegral(0)"
    >
      <div style="margin: 10px">
        <van-cell
          v-for="(item, index) in integralList"
          :key="index"
          style="margin-top: 10px"
        >
          <div class="xiaofei_record">
            <div class="xiaofei_left">
              <p>消费-社内购买/社外购买-商品名称</p>
              <p>{{ item.add_time }}</p>
            </div>
            <div
              class="xiaofei_right"
              style="font-size: 0.46rem; font-weight: 600; margin-top: 20px"
            >
              <span v-if="(item.type = 1)" class="jia">+</span>
              <span v-else-if="(item.type = 2)">-</span>
              <span class="item.type = 1 ? jia : ''">{{ item.num }}</span>
            </div>
          </div>
        </van-cell>
      </div>
    </van-list>
  </div>
</template>
<script>
export default {
  name: "openVip",
  data() {
    return {
      integ: 0,
      active: 0,
      integralList: [],
      titleList: [
        { name: "全部", id: 0 },
        { name: "商城积分", id: 1 },
        { name: "借款积分", id: 2 },
      ],
      page: 1,
      loading: false,
      finished: false,
    };
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    onClick(name, title) {
      var that = this;
      that.loading = true;
      that.integralList = [];
      console.log(title,name)
      that.getIntegral(name);
    },
    getIntegral(name) {
      this.$api.coopera_user_integ_log({
        page: this.page,
        class: name
      }).then((res) => {
        if (res.errno === 0) {
          this.integ = res.total_integ;
          if (res.data.length != 0) {
            let data = res.data;
            if (res.total_page == 1) {
              this.integralList = data;
            } else {
              this.integralList = this.integralList.concat(data);
            }
            if (this.page < res.total_page) {
              this.page++;
            }
            this.loading = false;
          } else {
            if (res.total_page == 0) {
              this.integralList = [];
            }
            this.loading = false;
            this.finished = true;
          }
          // 数据全部加载完成
          if (this.integralList.length == res.count) {
            this.finished = true;
          }
        }
      });
    },
  },
  mounted(){
    window.leftBack = this.leftBack
  }
};
</script>
<style lang="less">
.openVip {
  min-height: 100%;
  background: #f5f5f5;
  /* 导航栏 */
  .van-nav-bar {
    .van-icon {
      color: #444;
      font-size: 20px;
      .van-nav-bar__right {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
      }
      .van-nav-bar__title {
        font-weight: bold;
      }
    }
  }
  .banner {
    position: relative;
    height: 188px;
    background-color: #ceae79;
    text-align: center;
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      p:first-of-type {
        font-size: 16px;
      }
      p:last-of-type {
        font-size: 40px;
        font-weight: bold;
        margin-top: 10px;
      }
    }
  }
  .xiaofei_record {
    background-color: #fff;
    border-radius: 4px;

    .xiaofei_left {
      display: inline-block;
      p {
        font-size: 12px;
      }
      p:last-child {
        color: #9b9b9b;
        margin-top: 5px;
      }
    }
    .xiaofei_right {
      float: right;
      .jia {
        color: #ceae79;
      }
    }
  }
  .van-tabs--line .van-tabs__wrap {
    font-size: 12px;
  }
}
</style>