<template>
  <div class="orderDetails">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      :title="title"
      left-arrow
      @click-left="returnLast"
    >
      <template #right>
        <img
          src="../../../images/shop/ucenter/shouye2.png"
          alt=""
          width="20"
          @click="$router.push('/shopIndex')"
        />
      </template>
    </van-nav-bar>

    <div
      class="order-type"
      :style="
        orderInfo.order_status == 7
          ? 'padding-right:40px'
          : 'padding-right:35px'
      "
    >
      <span>{{ title }}</span>
      <img
        :src="
          orderInfo.order_status == 7
            ? require('../../../images/shop/ucenter/fahuo.png')
            : orderInfo.order_status == 5 || orderInfo.order_status == 3
            ? require('../../../images/shop/ucenter/order-close.png')
            : require('../../../images/shop/ucenter/order-success.png')
        "
        alt=""
      />
    </div>

    <template v-if="orderInfo.order_id">
      <template v-if="addressInfo">
        <van-cell class="contact" center :border="false">
          <template #title>
            <div class="contact-con">
              <span class="name">{{ addressInfo.name }}</span>
              <span class="tel">{{ addressInfo.mobile }}</span>
              <div class="tag" v-if="addressInfo.is_default">
                <van-tag color="#e9f8ee" text-color="#13ba82">默认</van-tag>
              </div>
            </div>
            <p class="addr">
              {{
                (addressInfo.province ? " " + addressInfo.province : "") +
                (addressInfo.city ? " " + addressInfo.city : "") +
                (addressInfo.area ? " " + addressInfo.area : "") +
                (addressInfo.street ? " " + addressInfo.street : "") +
                (addressInfo.village ? " " + addressInfo.village : "")
              }}
            </p>
          </template>
          <template #icon>
            <img
              style="width: 28px; height: 28px"
              src="../../../images/shop/ucenter/receipt.png"
              alt=""
            />
          </template>
        </van-cell>
      </template>
    </template>

    <template v-if="orderGoods && orderGoods.length > 0">
      <div class="goods-card">
        <div v-for="(subItem, subIndex) in orderGoods" :key="subIndex">
          <van-card :title="subItem.goods_name" :centered="true">
            <template #thumb>
              <div>
                <van-image
                  width="100"
                  height="100"
                  fit="contain"
                  :src="subItem.thumb"
                />
              </div>
            </template>
            <template #desc>
              <div
                class="desc"
                :style="subItem.two == 1 ? 'width:calc(100% - 80px)' : ''"
              >
                <p v-if="subItem.oneStylesName">
                  {{ subItem.oneStylesTitle }}: {{ subItem.oneStylesName }}
                </p>
                <p v-if="subItem.twoStylesName">
                  {{ subItem.twoStylesTitle }}: {{ subItem.twoStylesName }}
                </p>
                <p v-if="subItem.threeStylesName">
                  {{ subItem.threeStylesTitle }}: {{ subItem.threeStylesName }}
                </p>
              </div>
            </template>
            <template #price>
              <div class="price" v-if="!subItem.pro_price">
                <span>￥</span>{{ subItem.retail_price }}
              </div>
              <div v-else>
                <div class="price">
                  <span>￥</span>{{ subItem.retail_price }}
                </div>
                <!-- <div
                  class="price"
                  style="
                    top: 20px;
                    color: #888888;
                    text-decoration: line-through;
                  "
                >
                  <span>￥</span>{{ subItem.retail_price }}
                </div> -->
              </div>
            </template>
            <template #num>
              <div class="num" v-if="!subItem.pro_price">
                <span>X</span>{{ subItem.goods_num }}
              </div>
              <div class="num" v-else style="top: 40px">
                <span>X</span>{{ subItem.goods_num }}
              </div>
            </template>
            <template #bottom>
              <div class="bottom">
                <van-tag color="#f5f5f5" text-color="#888888"
                  >24小时内发货</van-tag
                >
              </div>
            </template>
          </van-card>
        </div>
        <div class="goods_total_price">
          <van-cell title="商品总价" :value="'￥' + orderInfo.total_price" />
        </div>
        <div class="other-mark">
          <template v-if="post_fee > 0">
            <van-cell
              title="运费/快递"
              value-class="price"
              :value="'￥' + post_fee"
            />
          </template>
          <template v-else>
            <van-cell title="运费/快递" value="免邮" />
          </template>
        </div>
        <div class="other-mark">
          <template v-if="coupon_price > 0">
            <van-cell
              title="优惠券/红包"
              value-class="price"
              :value="'-￥' + coupon_price"
            />
          </template>
          <template v-else>
            <van-cell title="优惠券/红包" value="无" />
          </template>
        </div>
      </div>
    </template>

    <van-cell-group class="need-pay-con" :border="false">
      <van-cell
        :title="orderInfo.order_status == 1 ? '需付款' : '已付款'"
        :value="'￥' + orderInfo.real_price"
      />
    </van-cell-group>

    <div class="order-desc">
      <p>订单编号: {{ orderInfo.order_id }}</p>
      <p>下单时间: {{ orderInfo.add_time }}</p>
      <p>
        支付方式:
        {{
          orderInfo.pay_type == 2 || orderInfo.pay_type == null
            ? "微信支付"
            : "银联支付"
        }}
      </p>
    </div>

    <template v-if="orderInfo.order_status == 1">
      <div class="footer-btn">
        <van-button
          type="default"
          plain
          hairline
          round
          color="#676767"
          size="small"
          style="margin-right: 1rem"
          @click="cancelOrder()"
          >取消</van-button
        >
        <van-button
          type="primary"
          plain
          hairline
          round
          color="#00b578"
          size="small"
          @click="confirmOrder()"
          >付款</van-button
        >
      </div>
      <div style="height: 60px"></div>
    </template>
  </div>
</template>
<script>
export default {
  name: "orderDetails",
  data() {
    return {
      title: "订单详情",
      order_id: "",
      addressInfo: {}, //地址信息
      orderGoods: [], //商品信息
      orderInfo: {}, //价格
      shop_name: "", //店铺名称
      post_fee: 0,
      coupon_price: 0,
    };
  },
  mounted() {
    window.leftBack = this.leftBack;
    this.order_id = this.$route.query.order_id;
    this.detail();
  },
  methods: {
    leftBack() {
      this.returnLast()
    },
    returnLast(){
      var status = this.$route.query.status;
      if (status) {
        this.$router.push({
          path: "/orderMy",
          query: {
            status: status,
          },
        });
      } else {
        this.$router.push('/orderMy');
      }
    },
    //订单详情
    detail() {
      this.$api
        .order_detail({
          order_id: this.order_id,
        })
        .then((res) => {
          if (res.errno === 0) {
            this.addressInfo = res.data.addressInfo;
            this.orderGoods = res.data.orderGoods;
            this.orderInfo = res.data.orderInfo;
            this.post_fee = res.data.post_fee;
            this.coupon_price = res.data.coupon_price;
            if (this.orderInfo.order_status == 1) {
              this.title = "待付款";
            } else if (this.orderInfo.order_status == 2) {
              this.title = "待发货";
            } else if (this.orderInfo.order_status == 3) {
              this.title = "支付失败";
            } else if (this.orderInfo.order_status == 5) {
              this.title = "已取消";
            } else if (this.orderInfo.order_status == 6) {
              this.title = "已退款";
            } else if (this.orderInfo.order_status == 7) {
              this.title = "待收货";
            } else if (this.orderInfo.order_status == 8) {
              this.title = "退换货";
            } else if (this.orderInfo.order_status == 10) {
              this.title = "已完成";
            }
          }
        });
    },
    //立即支付
    confirmOrder() {
      var status = this.$route.query.status;
      if (status) {
        this.$router.push({
          path: "/shopPay",
          query: {
            status: status,
            order_id: this.orderInfo.order_id,
            orderDetails: "1",
          },
        });
      } else {
        this.$router.push({
          path: "/shopPay",
          query: {
            order_id: this.orderInfo.order_id,
            orderDetails: "1",
          },
        });
      }
    },
    //取消订单
    cancelOrder() {
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认取消订单吗?",
        })
        .then(() => {
          that.$api
            .order_cancel({
              order_id: that.order_id,
            })
            .then((res) => {
              if (res.errno === 0) {
                that.$toast.success("取消成功");
                setTimeout(function () {
                  var status = that.$route.query.status;
                  if (status) {
                    that.$router.push({
                      path: "/orderMy",
                      query: {
                        status: status,
                      },
                    });
                  } else {
                    that.$router.push("/orderMy");
                  }
                }, 1000);
              }
            });
        });
    },
  },
};
</script>
<style lang="less">
.orderDetails {
  min-height: 100%;
  background: #f5f5f5;
  /* 导航栏 */
  .van-nav-bar {
    background: linear-gradient(#09c0ff, #09c0ff);
    .van-icon {
      color: #fff;
      font-size: 17px;
    }
    .van-nav-bar__right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      img {
        display: block;
      }
    }
    .van-nav-bar__title {
      font-weight: bold;
      color: #fff;
    }
  }

  /* 订单状态 */
  .order-type {
    background: linear-gradient(#09c0ff, #09c0ff);
    height: 104px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 20px;
    padding-right: 20px;
    color: #ffffff;
    font-weight: bold;
    font-size: 18px;
    img {
      height: 60px;
    }
  }

  /* 选择地址 */
  .van-contact-card::before {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #ffc3c3 0,
      #ffc3c3 20%,
      transparent 0,
      transparent 25%,
      #b3dcfa 0,
      #b3dcfa 45%,
      transparent 0,
      transparent 50%
    );
    background-size: 80px;
    content: "";
  }
  .contact {
    .van-cell__title {
      padding-left: 14px;
      .contact-con {
        display: flex;
        align-items: center;
        .name {
          font-size: 16px;
          font-weight: 500;
          color: rgba(53, 53, 53, 1);
          padding-right: 14px;
        }
        .tel {
          font-size: 14px;
          font-weight: 400;
          color: rgba(136, 136, 136, 1);
          padding-right: 32px;
        }
        .tag {
          font-size: 14px;
          font-weight: 400;
          color: rgba(0, 181, 120, 1);
        }
      }
      .addr {
        padding: 0;
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: rgba(53, 53, 53, 1);
      }
    }
    .van-cell__title::before {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 2px;
      background: -webkit-repeating-linear-gradient(
        135deg,
        #ffc3c3 0,
        #ffc3c3 20%,
        transparent 0,
        transparent 25%,
        #b3dcfa 0,
        #b3dcfa 45%,
        transparent 0,
        transparent 50%
      );
      background-size: 80px;
      content: "";
    }
  }
  /* 选择的商品列表 */
  .goods-card {
    background: rgba(255, 255, 255, 1);
    margin-top: 14px;
    .shop-name {
      padding: 10px 14px 0 14px;
      display: flex;
      align-items: center;
      img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        padding-left: 10px;
      }
    }
    .van-card {
      padding-left: 14px;
      padding-right: 14px;
      margin-top: 0;
      background: rgba(255, 255, 255, 1);
      .van-card__header {
        align-content: center;
      }
      .van-card__thumb {
        width: auto;
        height: auto;
        display: flex;
        align-items: center;
        margin-right: 10px;
      }
      .van-card__title {
        width: calc(100% - 80px);
        font-size: 14px;
        font-weight: 600;
        color: rgba(53, 53, 53, 1);
        padding-bottom: 10px;
      }
      .desc {
        width: calc(100% - 2.5rem);
        font-size: 14px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        p {
          padding: 0;
          margin: 0;
          word-break: break-all;
          word-wrap: break-word;
        }
      }
      .van-card__price {
        font-size: 14px;
        font-weight: 400;
        color: #353535;
        .price {
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          text-align: right;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .price1 {
          position: absolute;
          bottom: 20px;
          right: 0;
          width: 80px;
          text-align: right;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14px;
          font-weight: 400;
          color: #888888;
        }
      }
      .van-card__num {
        font-size: 14px;
        font-weight: 400;
        color: #888888;
        .num {
          position: absolute;
          top: 20px;
          right: 0;
          width: 40px;
          text-align: right;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .price2 {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 80px;
          text-align: right;
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 14px;
          font-weight: 400;
          color: #888888;
        }
      }
    }
    .goods_total_price {
      .van-cell {
        font-size: 14px;
        color: #333;
      }
      .van-cell__value {
        color: #333;
      }
    }
    .other-mark {
      .van-cell {
        font-size: 14px;
        color: #888888;
        .van-cell__value {
          color: #888888;
        }
        .price {
          color: #ff2814;
          font-weight: 400;
        }
      }
    }
  }
  /* 需付款 */
  .need-pay-con {
    margin-top: 14px;
    .van-cell {
      font-size: 14px;
      color: #333;
      .van-cell__value {
        font-size: 16px;
        color: #ff2814;
        font-weight: 400;
      }
    }
  }
  /* 订单号等标注信息 */
  .order-desc {
    padding: 10px 16px;
    background: #fff;
    margin: 14px 0;
    p {
      font-size: 14px;
      color: #888;
      margin-bottom: 2px;
    }
  }
}
</style>