<template>
  <div class="shopPay">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="支付订单"
      left-arrow
      @click-left="returnLast()"
      @click-right="$router.push('/shopIndex')"
    >
      <template #right>
        <img src="../../images/shop/ucenter/shouye.png" alt="" width="20" />
      </template>
    </van-nav-bar>

    <van-cell-group class="order-info-con">
      <van-cell title="订单编号" :border="false" :value="order_id"></van-cell>
      <van-cell
        title="订单金额"
        :border="false"
        :value="`￥${real_price}`"
      ></van-cell>
      <van-cell title="优惠金额" :border="false" v-if="goodsPayType != 1">
        <template v-if="coupon_price">
          <span class="price-icon">￥</span>
          <span class="coupon_price">{{ coupon_price }}</span>
        </template>
        <template v-else>
          <span>无</span>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell
      title="支付方式"
      is-link
      :border="false"
      :value="pay_type"
      @click="showPicker = true"
    ></van-cell>

    <!-- 立即支付 -->
    <van-submit-bar
      :price="real_price * 100"
      button-text="付款"
      button-size="small"
      @submit="promptlyPay"
    />

    <van-popup
      class="picker-con"
      v-model="showPicker"
      round
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-picker
        show-toolbar
        value-key="name"
        :columns="columns"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "shopPay",
  data() {
    return {
      order_id: "",
      real_price: 20,
      goodsPayType: 0,
      coupon_price: 0,

      pay_type: "请选择",
      showPicker: false,
      columns: [
        {
          values: [],
        },
      ],
      pay_id: 0,
      interval: "",
    };
  },
  mounted() {
    this.order_id = this.$route.query.order_id;
    this.handlepayType();
    this.paymentOrder();
    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.returnLast()
    },
    returnLast() {
      let href = window.location.href;
      if (href.indexOf("cate_id") > -1) {
        let id = this.$route.query.id;
        let cate_id = this.$route.query.cate_id;
        let tabIndex = this.$route.query.tabIndex;
        this.$router.push({
          path: "/goodsDetails",
          query: {
            id: id,
            cate_id: cate_id,
            tabIndex: tabIndex
          },
        });
      } else if (href.indexOf("index") > -1) {
        let id = this.$route.query.id;
        this.$router.push({
          path: "/goodsDetails",
          query: {
            id: id,
            index: 1,
          },
        });
      } else if (href.indexOf("cart") > -1) {
        this.$router.push("/shoppingCart");
      } else if (href.indexOf("speedBuy") > -1) {
        this.$router.push("/speedBuy");
      } else if (href.indexOf("orderMy") > -1) {
        this.$router.push("/orderMy");
      } else if (href.indexOf("orderDetails") > -1) {
        if (href.indexOf("status") > -1) {
          this.$router.push({
            path: "/orderDetails",
            query: {
              order_id: this.$route.query.order_id,
              status: this.$route.query.status,
            },
          });
        } else {
          this.$router.push({
            path: "/orderDetails",
            query: {
              order_id: this.$route.query.order_id,
            },
          });
        }
      } else {
        this.$router.go(-1);
      }
    },
    handlepayType() {
      this.$api
        .select_parent_pay_type({
          order_id: this.$route.query.order_id,
        })
        .then((res) => {
          if (res.errno == 0) {
            let list = res.data;
            list = list.map((ele) => {
              return {
                name: ele.pay_str,
                id: ele.pay_type,
              };
            });
            this.columns[0].values = list;
          }
        });
    },
    onConfirm(value, index) {
      this.pay_type = value[0].name;
      this.pay_id = value[0].id;
      this.showPicker = false;
    },

    // 立即支付
    promptlyPay() {
      let that = this;
      if (this.pay_id == 0) {
        this.$toast.fail("请先选择支付方式");
        return;
      }
      // rePrepay
      // let href = window.location.href;
      // if (href.indexOf("orderMy") > -1 || href.indexOf("orderDetails") > -1) {
      //   this.$api
      //   axios
      //     .post(that.JumpUrl.rePrepay, {
      //       order_id: getQueryString("order_id"),
      //       token: this.token,
      //     })
      //     .then((res) => {
      //       if (res.data.errno == 0) {
      //         this.orderpay();
      //       }
      //     });
      //   return;
      // }
      this.orderpay();
    },
    orderpay() {
      let that = this;
      this.$api
        .parent_orderpay({
          order_id: this.order_id,
          pay_type: this.pay_id,
          pay_pwd: "", //支付方式为28余额支付的时候必须要传，这是用户在所买合作社的支付密码
        })
        .then((res) => {
          if (res.errno == 0) {
            if (that.pay_id == 26) {
              if (typeof android != "undefined") {
                android.nongAliPay(res.data);
              }
            } else if (that.pay_id == 23) {
              if (typeof android != "undefined") {
                android.unionAliPay(res.data);
              }
            } else if (that.pay_id == 24) {
              if (typeof android != "undefined") {
                android.unionPay(JSON.parse(res.data).tn);
              }
            } else if (that.pay_id == 25) {
              return;
            } else if (that.pay_id == 22) {
              if (typeof android != "undefined") {
                android.unionWxPay(res.data);
              }
            }
          } else if (res.errno == 2) {
            if (that.pay_id == 25) {
              let code = this.$route.query.code;
              if (code) {
                that.code = code;
              }
              if (that.code) {
                that.wechatLogin();
              } else {
                that.wxSign();
              }
            } else {
              that.$toast.fail(res.errmsg);
            }
          } else {
            that.$toast.fail(res.errmsg);
          }
        });
    },

    paymentOrder() {
      this.$api
        .order_detail({
          order_id: this.order_id,
        })
        .then((res) => {
          if (res.errno === 0) {
            this.real_price = Number(res.data.orderInfo.real_price);
            this.coupon_price = Number(res.data.coupon_price);
          }
        });
    },

    //订单状态
    orderState() {
      let that = this;
      this.$api
        .parent_orderQuery({
          order_id: this.order_id,
        })
        .then((res) => {
          clearInterval(this.interval);
          if (that.goodsPayType == 1) {
            this.$router.push({
              path: "/orderDetails",
              query: {
                order_id: this.order_id,
                paySource: 1,
              },
            });
          } else {
            this.$router.push({
              path: "/orderDetails",
              query: {
                order_id: this.order_id,
              },
            });
          }
        });
    },
    onPayFinish(info) {
      // alert(JSON.stringify(info));
      if (info.isSuccess) {
        this.orderState();
        this.interval = setInterval(function () {
          this.orderState();
        }, 5000);
      }
    },
  },
};
</script>
<style lang="less">
.shopPay {
  min-height: 100%;
  background: #f5f5f5;
  .van-nav-bar {
    .van-icon,
    .van-nav-bar__text {
      color: #444;
    }
  }

  /* 订单信息 */
  .order-info-con {
    margin: 12px 0;
    .van-cell {
      .van-cell__value {
        color: #333;
      }
    }
    .price-icon {
      color: #ee0a24;
      font-size: 12px;
    }
    .coupon_price {
      color: #ee0a24;
      font-size: 14px;
    }
  }

  /* 提交 */
  .van-submit-bar__bar {
    .van-submit-bar__text {
      text-align: left;
    }
    .van-button {
      width: 80px;
      height: 30px;
      line-height: 30px;
      background: linear-gradient(#66d6fc, #00beff);
    }
  }
}
</style>