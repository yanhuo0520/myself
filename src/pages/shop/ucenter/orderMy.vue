<template>
  <div class="orderMy">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="我的订单"
      left-arrow
      @click-left="$router.push('/personal')"
    >
      <template #right>
        <img
          src="../../../images/shop/ucenter/shouye.png"
          alt=""
          width="20"
          @click="$router.push('/shopIndex')"
        />
      </template>
    </van-nav-bar>

    <van-sticky :offset-top="46">
      <van-tabs
        v-model="status"
        @change="handleClick"
        background="#f5f5f5"
        color="#46C4FF"
        line-width="35px"
        line-height="2px"
        title-active-color="#46C4FF"
      >
        <van-tab title="全部" name=""></van-tab>
        <van-tab title="待付款" name="1"></van-tab>
        <van-tab title="待发货" name="2"></van-tab>
        <van-tab title="待收货" name="7"></van-tab>
        <van-tab title="已完成" name="10"></van-tab>
      </van-tabs>
    </van-sticky>

    <div v-if="payment && payment.length > 0">
      <van-list
        v-model="orderLoading"
        :immediate-check="false"
        :finished="finished"
        @load="getOrderLists"
        finished-text="没有更多了"
      >
        <template>
          <div
            class="order-group"
            v-for="(item, index) in payment"
            :key="index"
          >
            <div class="goods-card">
              <div style="padding: 0 14px">
                <div class="top-name van-hairline--bottom">
                  <span class="time">{{ item.add_time }}</span>
                  <template v-if="item.order_status != 10">
                    <span
                      class="status-name"
                      :style="item.order_status == 1 ? 'color:#ff6010' : ''"
                      >{{ item.order_status_name }}</span
                    >
                  </template>
                  <template v-else>
                    <img
                      src="../../../images/shop/ucenter/order-finish.png"
                      alt=""
                    />
                  </template>
                </div>
              </div>
              <div
                v-for="(subItem, subIndex) in item.goodsList"
                :key="subIndex"
                @click="detailsOrder(item.order_id)"
              >
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
                        {{ subItem.oneStylesTitle }}:
                        {{ subItem.oneStylesName }}
                      </p>
                      <p v-if="subItem.twoStylesName">
                        {{ subItem.twoStylesTitle }}:
                        {{ subItem.twoStylesName }}
                      </p>
                      <p v-if="subItem.threeStylesName">
                        {{ subItem.threeStylesTitle }}:
                        {{ subItem.threeStylesName }}
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
                      <!-- <div class="price" style="color: #ff2814">
                        <span>￥</span>{{ subItem.pro_price }}
                      </div>
                      <div
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
                      <van-tag color="#ECF8FF" text-color="#09C0FF"
                        >24小时内发货</van-tag
                      >
                    </div>
                  </template>
                </van-card>
              </div>
              <div class="item-total">
                <span
                  >共{{ item.goods_num }}件商品 总价<span>￥</span
                  >{{ item.total_price
                  }}<span v-if="item.coupon_price > 0">
                    优惠<span>￥</span>{{ item.coupon_price }}</span
                  ></span
                >
                <span class="price"
                  >需付款 <span>￥</span
                  ><span style="font-weight: bold">{{
                    item.real_price
                  }}</span></span
                >
              </div>

              <div style="display: flex; padding: 14px">
                <div
                  style="display: inline-block; flex: 1"
                  v-if="item.order_status == 1"
                >
                  <span>等待支付，剩余</span>
                  <van-count-down
                    :time="item.cur_time"
                    @click="finish()"
                    style="
                      display: inline-block;
                      color: #ff6010;
                      font-size: 14px;
                    "
                  >
                    <template v-slot="timeData">
                      <span class="block">{{ timeData.minutes }}</span>
                      <em>分</em>
                      <span class="colon">:</span>
                      <span class="block">{{ timeData.seconds }}</span>
                      <em>秒</em>
                    </template>
                  </van-count-down>
                </div>

                <div class="btn-con" v-if="item.order_status == 1">
                  <van-button
                    type="default"
                    plain
                    hairline
                    round
                    color="#676767"
                    size="small"
                    style="margin-right: 15px"
                    @click="cancelOrder(item.order_id, index)"
                    >取消</van-button
                  >
                  <van-button
                    type="primary"
                    plain
                    hairline
                    round
                    color="#09C0FF"
                    size="small"
                    @click="goPay(item)"
                    >付款</van-button
                  >
                </div>
                <div class="btn-con" v-if="item.order_status == 2">
                  <van-button
                    type="primary"
                    plain
                    hairline
                    round
                    color="#09C0FF"
                    size="small"
                    @click="refundOrder(item.order_id)"
                    >退换货</van-button
                  >
                </div>
                <div class="btn-con" v-if="item.order_status == 7">
                  <van-button
                    type="primary"
                    plain
                    hairline
                    round
                    color="#09C0FF"
                    size="small"
                    style="margin-right: 15px"
                    @click="refundOrder(item.order_id)"
                    >退换货</van-button
                  >
                  <van-button
                    type="primary"
                    plain
                    hairline
                    round
                    color="#09C0FF"
                    size="small"
                    @click="confirmOrder(item.order_id)"
                    >确认收货</van-button
                  >
                </div>
                <div class="btn-con" v-if="item.order_status == 10">
                  <van-button
                    type="default"
                    plain
                    hairline
                    round
                    color="#676767"
                    size="small"
                    style="margin-right: 15px"
                    @click="deleteOrder(item.order_id, index)"
                    >删除</van-button
                  >
                  <van-button
                    type="primary"
                    plain
                    hairline
                    round
                    color="#09C0FF"
                    size="small"
                    @click="refundOrder(item.order_id)"
                    >退换货</van-button
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </van-list>
    </div>
    <div class="no-data" v-if="(payment.length === 0 || isErr) && !isWait">
      <div class="no-data-con">
        <img :src="isErr ? errImg : noDataImg" alt="" />
        <p class="no-title">{{ isErr ? "网络竟然崩溃了" : "无订单" }}</p>
        <p class="no-desc">
          {{
            isErr ? "别紧张,试试看刷新页面" : '"还没订单,快点忙里偷闲下一单"'
          }}
        </p>
        <van-button
          size="small"
          plain
          round
          color="#7FD5FC"
          @click="handleErr"
          >{{ isErr ? "刷新" : "去逛逛" }}</van-button
        >
      </div>
    </div>

    <van-overlay
      :show="isWait"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2222;
      "
    >
      <van-loading vertical>请求中，请等待...</van-loading>
    </van-overlay>
  </div>
</template>
<script>
export default {
  name: "orderMy",
  data() {
    return {
      status: "", //订单状态
      payment: [], //待付款
      isErr: false,
      isWait: true,
      noDataImg: require("../../../images/shop/ucenter/no-order-data.png"),
      errImg: require("../../../images/shop/ucenter/err.png"),

      page: 1,
      orderLoading: false,
      finished: false, // 列表是否请求完成
    };
  },
  mounted() {
    this.status = this.$route.query.status;
    this.getOrderLists();

    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.$router.push('/personal')
    },
    //获取订单状态
    getOrderLists() {
      this.$api
        .coopera_order_lists({
          page: this.page,
          order_status: this.status,
        })
        .then((res) => {
          this.isWait = false;
          this.isErr = false;
          this.orderLoading = false;
          this.isFullLoading = false;
          if (res.errno === 0) {
            if (res.data.length != 0) {
              let data = res.data;
              if (res.total_page == 1) {
                this.payment = data;
              } else {
                this.payment = this.payment.concat(data);
              }
              if (this.page < res.total_page) {
                this.page++;
              }
              this.orderLoading = false;
            } else {
              if (res.total_page == 0) {
                this.payment = [];
              }
              this.orderLoading = false;
              this.finished = true;
            }
            // 数据全部加载完成
            if (this.payment.length == res.count) {
              this.finished = true;
            }

            this.payment.forEach((ele) => {
              if (ele.order_status == 1) {
                ele.order_status_name = "未付款";
                let time1 = ele.overdue_time + "";
                ele.overdue_time = this.dateFormat(
                  "yyyy-MM-dd HH:mm:ss",
                  new Date(time1.length == 10 ? time1 * 1000 : time1)
                );
                var endTime = new Date(
                  String(ele.overdue_time).replace(/\-/g, "/")
                ).getTime();
                let time2 = ele.now_time + "";
                ele.now_time = this.dateFormat(
                  "yyyy-MM-dd HH:mm:ss",
                  new Date(time2.length == 10 ? time2 * 1000 : time2)
                );
                var newTime = new Date(
                  String(ele.now_time).replace(/\-/g, "/")
                ).getTime();
                ele.cur_time = endTime - newTime;
              }
              if (ele.order_status == 2) {
                ele.order_status_name = "待发货";
              }
              if (ele.order_status == 3) {
                ele.order_status_name = "支付失败";
              }
              if (ele.order_status == 5) {
                ele.order_status_name = "已取消";
              }
              if (ele.order_status == 6) {
                ele.order_status_name = "已退款";
              }
              if (ele.order_status == 7) {
                ele.order_status_name = "待收货";
              }
              if (ele.order_status == 8) {
                ele.order_status_name = "退换货";
              }
              if (ele.order_status == 10) {
                ele.order_status_name = "已完成";
              }
              if (ele.order_status == 13) {
                ele.order_status_name = "订单支付超时交易关闭";
              }
              let time = ele.add_time + "";
              ele.add_time = this.dateFormat(
                "yyyy-MM-dd HH:mm:ss",
                new Date(time.length == 10 ? time * 1000 : time)
              );
            });
          } else {
            this.finished = true;
          }
        })
        .catch(() => {
          // this.isErr = true;
          this.isFullLoading = false;
          this.orderLoading = false;
        });
    },
    dateFormat(fmt, date) {
      date = date ? date : new Date();
      let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        S: date.getMilliseconds(), //毫秒
      };
      let week = {
        0: "/u65e5",
        1: "/u4e00",
        2: "/u4e8c",
        3: "/u4e09",
        4: "/u56db",
        5: "/u4e94",
        6: "/u516d",
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (date.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
      if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          (RegExp.$1.length > 1
            ? RegExp.$1.length > 2
              ? "/u661f/u671f"
              : "/u5468"
            : "") + week[date.getDay() + ""]
        );
      }
      for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
      return fmt;
    },
    handleErr() {
      if (this.isErr) {
        this.getOrderLists();
      } else {
        this.$router.push("/speedBuy");
      }
    },

    //取消订单
    cancelOrder(val, index) {
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认取消订单吗?",
        })
        .then(() => {
          that.$api
            .order_cancel({
              order_id: val,
            })
            .then((res) => {
              if (res.errno == 0) {
                that.$toast.success("取消成功");
                setTimeout(function () {
                  if (that.status) {
                    that.payment.splice(index, 1);
                  } else {
                    that.page = 1;
                    that.payment = [];
                    that.getOrderLists();
                  }
                }, 2000);
              }
            });
        });
    },
    //删除订单
    deleteOrder(val) {
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认删除此订单吗?",
        })
        .then(() => {
          that.$api
            .order_del({
              order_id: val,
            })
            .then((res) => {
              if (res.errno === 0) {
                that.page = 1;
                that.payment = [];
                that.getOrderLists();
              }
            });
        });
    },
    // 订单申请退款
    refundOrder(val) {
      var that = this;
      that.orderCancel.order_id = val;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认申请退换货吗?",
        })
        .then(() => {
          this.$api
            .order_refund({
              order_id: val,
            })
            .then((res) => {
              if (res.errno == 0) {
                that.$toast.success(res.errmsg);
                that.page = 1;
                that.payment = [];
                that.getOrderLists();
              } else {
                that.$toast.fail(res.errmsg);
              }
            })
            .catch(function (error) {
              //请求失败
              console.log("error", error);
            });
        });
    },
    //确认收货
    confirmOrder(val) {
      var that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认收货吗?",
        })
        .then(() => {
          this.$api
            .order_receiving({
              order_id: val,
            })
            .then((res) => {
              if (res.errno === 0) {
                that.$toast.success("收货成功");
                that.page = 1;
                that.payment = [];
                that.getOrderLists();
              }
            });
        });
    },
    //确认订单
    goPay(item) {
      if (item.prom_type == 6) {
        let nowTime = new Date().getTime();
        if (nowTime >= item.found_end_time * 1000) {
          this.$toast("拼团已结束");
          return;
        }
        this.$router.push({
          path: "/shopPay",
          query: {
            order_id: item.order_id,
            orderMy: 1,
            payType: 1,
          },
        });
      } else {
        this.$router.push({
          path: "/shopPay",
          query: {
            order_id: item.order_id,
            orderMy: 1,
          },
        });
      }
    },
    finish() {
      let that = this;
      this.$api.coopera_close_overdue_prepay_order().then((res) => {
        if (res.errno == 0) {
          setTimeout(function () {
            if (that.order_status) {
              that.payment.splice(index, 1);
            } else {
              this.page = 1;
              this.payment = [];
              this.getOrderLists();
            }
          }, 2000);
        } else {
          that.$toast.fail(res.errmsg);
        }
      });
    },
    // 切换订单状态
    handleClick(name) {
      this.page = 1;
      this.payment = [];
      this.status = name;
      this.isWait = true
      this.getOrderLists();
    },

    //跳转订单详情
    detailsOrder(val) {
      var status = this.status;
      if (status) {
        this.$router.push({
          path: "/orderDetails",
          query: {
            order_id: val,
            status: this.status,
          },
        });
      } else {
        this.$router.push({
          path: "/orderDetails",
          query: {
            order_id: val,
          },
        });
      }
    },
  },
};
</script>
<style lang="less">
.orderMy {
  background: #f5f5f5;
  min-height: 100%;
  .van-nav-bar {
    .van-icon {
      color: #444;
    }
  }

  /* 商品列表 */
  .order-group {
    .price-icon,
    .coupon_price {
      color: #ee0a24;
      font-size: 14px;
    }
    .goods-card {
      background: rgba(255, 255, 255, 1);
      width: 94%;
      margin: 0 auto;
      margin-top: 15px;
      border-radius: 8px;
      .top-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        .time {
          color: #888888;
          font-size: 14px;
        }
        .status-name {
          font-size: 14px;
          font-weight: 400;
          color: #09c0ff;
        }
        img {
          height: 30px;
        }
      }
      .van-card {
        padding: 0 15px;
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
          margin-right: 12px;
        }
        .van-card__title {
          width: 70%;
          font-size: 14px;
          font-weight: 600;
          color: rgba(53, 53, 53, 1);
          padding-bottom: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .desc {
          width: 100%;
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
            width: 40ox;
            text-align: right;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .price2 {
            position: absolute;
            bottom: 0;
            right: 0;
            width: 50px;
            text-align: right;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 14px;
            font-weight: 400;
            color: #888888;
          }
        }
      }
      .item-total {
        padding: 14px;
        text-align: right;
        color: #888;
        .price {
          font-size: 14px;
          color: #333;
        }
      }
      .btn-con {
        padding: 14px;
        padding-top: 0;
        text-align: right;
      }
    }
  }

  /* 无数据 */
  .no-data {
    position: fixed;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    .no-data-con {
      position: absolute;
      width: 90%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      img {
        width: 100%;
      }
      .no-title {
        font-size: 15px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
      }
      .no-desc {
        font-size: 14px;
        font-weight: 400;
        color: rgba(136, 136, 136, 1);
        padding: 14px 0;
      }
      .van-button {
        font-size: 14px;
        font-weight: 400;
        color: rgba(1, 195, 39, 1);
      }
    }
  }
}
</style>