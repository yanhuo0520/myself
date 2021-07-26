<template>
  <div class="personal">
    <!-- top -->
    <div class="top">
      <div style="width: 100%">
        <h1>我的</h1>
        <div class="avatar">
          <img
            class="avatar-img"
            src="../../../images/shop/ucenter/weidl.png"
            alt=""
          />
          <div class="username">
            <h1 v-if="nickname">{{ nickname }}</h1>
          </div>
          <div class="arrow-icon">
            <van-icon name="arrow" />
          </div>
        </div>
        <div class="role-con">
          <template>
            <van-cell
              is-link
              value="查看更多"
              size="large"
              @click="goGrid('我的积分')"
            >
              <template #title>
                <span
                  class="title title-blod"
                  style="font-size: 21px; margin: 0 10px"
                  >{{ integ }}</span
                >
                <span class="title" style="font-size: 14px">积分</span>
              </template>
            </van-cell>
          </template>
          <div class="jifen_icon">
            <img src="../../../images/shop/ucenter/jifen-icon.png" alt="" />
          </div>
        </div>
      </div>
    </div>

    <!-- 订单 -->
    <van-cell-group class="order-group">
      <van-cell
        title="我的订单"
        value="全部订单"
        is-link
        @click="orderState(0)"
      ></van-cell>
      <van-grid :border="false">
        <van-grid-item
          text="待付款"
          :badge="wait_pay > 0 ? wait_pay : null"
          @click="orderState(1)"
        >
          <template #icon>
            <img src="../../../images/shop/ucenter/dfk.png" alt="" />
          </template>
        </van-grid-item>
        <van-grid-item
          text="待发货"
          @click="orderState(2)"
          :badge="wait_send > 0 ? wait_send : null"
        >
          <template #icon>
            <img src="../../../images/shop/ucenter/dfh.png" alt="" />
          </template>
        </van-grid-item>
        <van-grid-item
          text="待收货"
          :badge="wait_receive > 0 ? wait_receive : null"
          @click="orderState(7)"
        >
          <template #icon>
            <img src="../../../images/shop/ucenter/dsh.png" alt="" />
          </template>
        </van-grid-item>
        <van-grid-item
          text="已完成"
          :badge="finish > 0 ? finish : null"
          @click="orderState(10)"
        >
          <template #icon>
            <img src="../../../images/shop/ucenter/ywc.png" alt="" />
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <!-- 我的常用 -->
    <van-cell-group class="order-group my-group">
      <van-cell title="我的常用"></van-cell>
      <van-grid :border="false">
        <van-grid-item
          @click="goGrid(item.name)"
          v-for="(item, index) in grids"
          :key="index"
        >
          <template #icon>
            <img :src="item.icon" alt="" />
          </template>
          <template #text>
            <p class="title">{{ item.name }}</p>
            <p v-if="isShopUser">&nbsp;</p>
          </template>
        </van-grid-item>
      </van-grid>
    </van-cell-group>

    <shopBottom :idx="3" :count="count"></shopBottom>
  </div>
</template>
<script>
import shopBottom from "@/components/shopBottom";
export default {
  name: "personal",
  components: {
    shopBottom,
  },
  data() {
    return {
      nickname: "",
      wait_pay: 0,
      wait_send: 0,
      wait_receive: 0,
      finish: 0,
      integ: "",

      isShopUser: false,
      grids: [
        {
          name: "我的收藏",
          icon: require("../../../images/shop/ucenter/my-sc.png"),
        },
        {
          name: "我的积分",
          icon: require("../../../images/shop/ucenter/my-jf.png"),
        },
        {
          name: "地址管理",
          icon: require("../../../images/shop/ucenter/my-adress.png"),
        },
      ],
      count: 0,
    };
  },
  mounted() {
    // 购物车数量
    this.$api.coopera_shop_cart().then((res) => {
      if (res.errno == 0) {
        this.count = res.data.cartTotal.checkedGoodsCount; //总共几件
      }
    });

    this.$api.coopera_user_info().then((res) => {
      if (res.errno == 0) {
        this.headimgurl = res.data.headimgurl;
        this.nickname = res.data.name;
        this.wait_pay = res.data.wait_pay;
        this.wait_send = res.data.wait_send;
        this.wait_receive = res.data.wait_receive;
        this.finish = res.data.finish;
        this.integ = res.data.integ;
      }
    });
  },
  methods: {
    //   登录
    goLogins() {},

    //订单状态
    orderState(val) {
      this.$router.push({
        path: "/orderMy",
        query: {
          status: val,
        },
      });
    },
    goGrid(name) {
      if (name == "我的收藏") {
        this.$router.push({
          path: "/collectMy",
        });
      } else if (name == "我的积分") {
        this.$router.push({
          path: "/openVip",
        });
      } else if (name == "地址管理") {
        this.$router.push({
          path: "/collectAddress",
        });
      }
    },
  },
};
</script>
<style lang="less">
.personal {
  background: #f5f5f5;
  min-height: 100%;
  /* top */
  .top {
    display: flex;
    background-image: url(../../../images/shop/ucenter/my_bj.png);
    width: 100%;
    height: 200px;
    background-size: 100% 100%;
    position: relative;
    h1 {
      width: 100%;
      font-size: 18px;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 46px;
      text-align: center;
    }
    .avatar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: calc(100% - 24px);
      height: 60px;
      position: absolute;
      top: 45%;
      transform: translateY(-50%);
      padding: 0 12px;
      .avatar-img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .username {
        padding-left: 20px;
        h1 {
          padding: 0;
        }
      }
    }
    .btn-con {
      position: relative;
      width: 86.5px;
      height: 33px;
      border-radius: 4px;
      overflow: hidden;
      .van-button {
        width: 100%;
        height: 100%;
        opacity: 0.7;
      }
      span {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 14px;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 33px;
      }
    }
    .arrow-icon {
      flex: 1;
      text-align: right;
      .van-icon {
        color: #fff;
        font-size: 16px;
      }
    }
    .role-con {
      position: absolute;
      bottom: 0;
      width: calc(100% - 24px);
      left: 12px;
      height: 50px;
      border-radius: 8px 8px 0px 0px;
      background-color: #eeda9d;
      background-size: 100% 100%;
      overflow: hidden;
      .jifen_icon {
        position: absolute;
        bottom: 15px;
        left: 12px;
        width: 24px;
        height: 24px;
        z-index: 999;
        img {
          width: 100%;
        }
      }
      .van-cell {
        background: transparent;
        .van-cell__title {
          flex: none;
          padding-left: 10px;
        }
        .van-cell__value {
          flex: 1;
          color: #856001;
          font-size: 14px;
        }
        .van-icon {
          color: #856001;
        }
        .title {
          font-size: 16px;
          color: #856001;
        }
        .title.title-blod {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .van-cell::after {
        border-bottom: none;
      }
    }
  }
  /* 订单 */
  .order-group {
    margin: 12px;
    border-radius: 8px;
    box-shadow: 0px 2px 9px 0px rgba(153, 153, 153, 0.15);
    overflow: hidden;
    .van-cell__title {
      font-weight: bold;
      font-size: 14px;
    }
    .van-cell__value {
      font-size: 14px;
    }

    .van-grid {
      display: flex;
      .van-grid-item {
        flex: 1;
        .van-grid-item__icon-wrapper {
          img {
            height: 48px;
            margin-bottom: 10px;
          }
        }
        .van-grid-item__text {
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
  /* 登陆提示 */
  .no-login-desc {
    position: fixed;
    width: calc(100% - 24px);
    height: 46px;
    bottom: 50px;
    background-color: #616161;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-size: 14px;
    padding: 0 12px;
  }
}
</style>