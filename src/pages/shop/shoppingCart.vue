<template>
  <div class="shoppingCart">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="购物车"
      left-arrow
      @click-left="$router.push('/shopIndex')"
    ></van-nav-bar>

    <!-- 通知 -->
    <van-sticky v-if="!hasAddress && isToken" offset-top="45px">
      <van-cell
        class="notify-address"
        title="请填写收货人信息"
        value="去填写"
        is-link
        @click="jump(1)"
      >
      </van-cell>
    </van-sticky>

    <div
      style="padding: 10px 15px 0 20px"
      v-for="(item, index) in cartList"
      :key="index"
    >
      <div style="display: inline-block; margin-left: 5px">
        <van-checkbox
          v-model="item.checked"
          checked-color="#41C3FF"
          @click="changeGroupAll(item)"
        >
          <img
            src="../../images/shop/tubiao.png"
            width="30"
            height="30"
            style="vertical-align: bottom"
            alt=""
          />
          <h2
            style="display: inline-block; font-weight: 600; line-height: 20px"
          >
            {{ item.coopera_name }}
          </h2>
        </van-checkbox>
      </div>
      <div style="float: right; margin-top: 5px" @click="deleteGoods(item)">
        <img
          src="../../images/shop/shanchu.png"
          width="20"
          height="20"
          alt=""
        />
      </div>
      <!-- 购物车列表 -->
      <div class="shopping-con">
        <template v-if="cartList && cartList.length > 0">
          <div
            class="shopping-item"
            v-for="(innerItem, idx) in item.goods"
            :key="idx"
          >
            <div
              :class="
                innerItem.on_sale == 0 || innerItem.storage == 0
                  ? 'left filter'
                  : 'left'
              "
            >
              <van-checkbox
                v-model="innerItem.checked"
                :name="innerItem"
                checked-color="#41C3FF"
                :disabled="innerItem.on_sale == 0 || innerItem.storage == 0"
                @click="changeGroup(item, idx)"
              ></van-checkbox>
            </div>
            <div
              :class="
                innerItem.on_sale == 0 || innerItem.storage == 0
                  ? 'right filter'
                  : 'right'
              "
            >
              <van-swipe-cell style="border-radius: 8px">
                <van-card
                  centered
                  :title="innerItem.goods_name"
                  :thumb="innerItem.thumb"
                >
                  <template #thumb>
                    <img
                      :src="
                        innerItem.thumb
                          ? innerItem.thumb
                          : 'http://sy.xfd365.com/public/uploads/exp.jpg'
                      "
                      width="100%"
                      height="100%"
                      alt=""
                    />
                    <template
                      v-if="innerItem.on_sale == 0 || innerItem.storage == 0"
                    >
                      <div class="no-sale">
                        {{ innerItem.on_sale == 0 ? "已下架" : "已售罄" }}
                      </div>
                    </template>
                  </template>
                  <template #tags>
                    <van-tag plain v-if="innerItem.oneStylesName">{{
                      innerItem.oneStylesName
                    }}</van-tag>
                    <van-tag plain v-if="innerItem.twoStylesName">{{
                      innerItem.twoStylesName
                    }}</van-tag>
                    <van-tag plain v-if="innerItem.threeStylesName">{{
                      innerItem.threeStylesName
                    }}</van-tag>
                  </template>
                  <template #price>
                    <template
                      v-if="
                        innerItem.on_sale != 0 &&
                        innerItem.two == 1 &&
                        innerItem.storage != 0
                      "
                    >
                      <p class="price-two-con">
                        <van-tag type="danger">促销</van-tag>
                        <span class="price-icon">￥</span>
                        <span class="price">{{ innerItem.pro_price }}</span>
                        <span class="mark">x</span>
                        <span class="num">{{ innerItem.pro_number }}</span>
                      </p>
                      <p class="price-two-con">
                        <van-tag type="success">原价</van-tag>
                        <span class="price-icon">￥</span>
                        <span class="price">{{ innerItem.retail_price }}</span>
                        <span class="mark">x</span>
                        <span class="num">{{ innerItem.retail_number }}</span>
                      </p>
                    </template>
                    <p class="price-one-con" v-else>
                      <span class="price-icon">￥</span>
                      <span class="price">{{ innerItem.retail_price }}</span>
                    </p>
                  </template>
                  <template #num>
                    <van-stepper
                      v-if="innerItem.on_sale != 0 && innerItem.storage != 0"
                      min="0"
                      theme="round"
                      button-size="22"
                      :disable-plus="innerItem.number >= innerItem.storage"
                      v-model="innerItem.number"
                      disable-input
                      integer
                      @overlimit="disableBtnClick"
                      @plus="
                        addChange(
                          innerItem.goods_id,
                          innerItem.spcifi_id,
                          innerItem.number,
                          innerItem.promotion_num,
                          innerItem.has_buy,
                          innerItem.storage
                        )
                      "
                      @minus="
                        reduceChange(
                          innerItem.goods_id,
                          innerItem.spcifi_id,
                          index
                        )
                      "
                    ></van-stepper>
                    <van-stepper
                      v-if="innerItem.on_sale == 0 || innerItem.storage == 0"
                      min="0"
                      theme="round"
                      button-size="22"
                      disabled
                      v-model="innerItem.number"
                    ></van-stepper>
                  </template>
                  <template
                    v-if="innerItem.on_sale == 0 || innerItem.storage == 0"
                    #footer
                  >
                    <van-button
                      size="mini"
                      type="danger"
                      round
                      @click="deleteOnSale(innerItem.cart_id)"
                      >删除</van-button
                    >
                  </template>
                </van-card>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    @click="deleteOnSale(innerItem.cart_id)"
                    type="danger"
                    class="delete-button"
                  />
                </template>
              </van-swipe-cell>
            </div>
          </div>
        </template>
      </div>
    </div>
    <!-- 清空全部失效商品按钮占位符 -->
    <div style="height: 100px" v-if="failGoods && failGoods.length > 1"></div>
    <!-- 清空全部失效商品按钮 -->
    <div class="clear-btn-con" v-if="failGoods && failGoods.length > 1">
      <van-button plain type="default" round @click.stop="clearFailGoods"
        >清空全部失效商品</van-button
      >
    </div>
    <!-- 全选操作占位 -->
    <div style="height: 100px"></div>
    <!-- 全选结算 -->
    <div class="footer-btn-type-1" v-if="manageFlag">
      <div class="left">
        <van-checkbox
          v-model="isCheckAll"
          checked-color="#41C3FF"
          @click="checkTotal()"
          >全选</van-checkbox
        >
        <div class="choose-info">
          <div class="price"><span>￥</span>{{ amount }}</div>
          <div class="num">
            <span>共{{ checkedGoodsCount }}件</span>
            <span>运费￥{{ post_fee }}</span>
          </div>
        </div>
      </div>
      <div class="right" @click.stop="settlement()">结算</div>
    </div>
    <!-- 全选删除 -->
    <div class="footer-btn-type-2" v-if="!manageFlag">
      <div class="left">
        <van-checkbox
          v-model="isCheckAll"
          checked-color="#41C3FF"
          @click.stop="checkTotal()"
          >全选</van-checkbox
        >
      </div>
      <div class="center" @click.stop="addCollect()">移入收藏夹</div>
      <div class="right" @click.stop="deleteCart()">删除</div>
    </div>

    <div
      class="no-data"
      v-if="(cartList.length === 0 || isErr) && !isFullLoading"
    >
      <div class="no-data-con">
        <img :src="isErr ? errImg : noDataImg" alt="" />
        <p class="no-title">{{ isErr ? "网络竟然崩溃了" : "购物车空空的" }}</p>
        <p class="no-desc">
          {{ isErr ? "别紧张,试试看刷新页面" : "赶紧慰劳下自己吧" }}
        </p>
        <van-button
          size="small"
          plain
          round
          color="#41C3FF"
          @click.stop="handleErr"
          >{{ isErr ? "刷新" : "去逛逛" }}</van-button
        >
      </div>
    </div>

    <shopBottom :idx="2" :count="count"></shopBottom>
  </div>
</template>
<script>
import shopBottom from "@/components/shopBottom";
export default {
  name: "shoppingCart",
  components: {
    shopBottom,
  },
  data() {
    return {
      hasAddress: true,
      isToken: true,

      cartList: [],
      checked_list: {
        cart_ids: "",
        isChecked: 1,
      },
      checkedGoodsCount: 0,

      isErr: false,
      isFullLoading: true,
      noDataImg: require("../../images/shop/ucenter/no-shopping-car.png"),
      errImg: require("../../images/shop/ucenter/err.png"),

      failGoods: [{}],
      isCheckAll: false,
      manageFlag: true,
      amount: 0, //总价
      post_fee: 0, //运费
      count: 0,

      addGoods: {
        goods_id: "",
        spcifi_id: 0,
        number: 0,
      },
    };
  },
  mounted() {
    this.myCart();
  },
  methods: {
    // 页面跳转 type 1-跳转添加地址也 2-跳转我的优惠券
    jump(type) {
      if (type == 1) {
        this.$router.push({
          path: "/addEditAddress",
          query: {
            add: 1,
            isMy: 1,
          },
        });
      }
    },
    //获取购物车内容
    myCart() {
      //请求返回改为false
      // 购物车数量
      let that = this;
      this.$api.coopera_shop_cart().then((res) => {
        that.judgeCheckStore(res);
        if (res.errno == 0) {
          this.cartList = res.data.cartList;
          for (var i = 0; i < this.cartList.length; i++) {
            this.goods_list = this.cartList[i].goods;
          }
          this.amount = res.data.cartTotal.checkedGoodsAmount;
          this.count = res.data.cartTotal.checkedGoodsCount;
          this.checkedGoodsCount = res.data.cartTotal.checkedGoodsCount;
          this.post_fee = res.data.post_fee;
          let failGoods = [];
          var idMuster = "";
          let checkArray = [];
          that.cartList.forEach((ele) => {
            ele.goods.forEach((item) => {
              idMuster += item.goods_id + ",";
              that.checked_list.cart_ids = idMuster;
              if (item.on_sale == 0 || item.storage == 0) {
                failGoods.push(item.cart_id);
              }
              checkArray.push(item.checked);
            });
          });
          that.failGoods = failGoods;
          if (checkArray.indexOf(1) < 0) {
            that.checked_list.isChecked = 0;
          } else {
            that.checked_list.isChecked = 1;
          }

          that.checkedGoods();
        }
      });
    },
    // 购物车商品选中或取消选中状态
    checkedGoods() {
      let that = this;
      let length = that.cartList.length;
      let checkedLength = 0;

      for (var i = 0; i < that.cartList.length; i++) {
        var list = that.cartList[i].goods;
        for (var j = 0; j < list.length; j++) {
          if (list[j].checked == 1) {
            checkedLength += 1;
          }
        }
      }

      if (length == checkedLength) {
        that.flag = 1;
      } else {
        that.flag = 0;
      }
      if (length == 0) {
        that.flag = 0;
      }
    },
    judgeCheckStore(res) {
      let cartList = res.data.cartList || [];
      let tempArr = [];
      cartList.forEach(function (item) {
        let storeIsChecked = item.goods.every((each) => each.checked);
        var shop_info = {};
        shop_info.checked = storeIsChecked;
        item.shop_info = shop_info;
        tempArr.push(item);
      });
      this.isCheckAll = tempArr.every((item) => item.shop_info.checked);
      this.shoppingList = tempArr;
      if (tempArr.length == 0) {
        this.isCheckAll = false;
      }
      this.checkedGoodsAmount = res.data.cartTotal.checkedGoodsAmount;
      this.checkedGoodsCount = res.data.cartTotal.checkedGoodsCount;
    },

    // 点击不可以按钮
    disableBtnClick(e) {
      if (e == "plus") {
        this.$toast.fail("库存不足");
      }
    },
    //添加商品
    addChange(goods_id, spcifi_id, number, promotion_num, has_buy, storage) {
      console.log(1111111111);
      let that = this;
      let canBuyName = promotion_num - has_buy;
      if (number >= storage) {
        this.$toast.fail("库存不足");
      } else {
        if (number == canBuyName && has_buy != -1) {
          this.$toast.fail(`每人限购${promotion_num}件，超出数量将按原价累加`);
          // that.message = {
          //   show: 1,
          //   text: "每人限购" + promotion_num + "件，超出数量将按原价累加",
          // };

          // setTimeout(function () {
          //   that.message.show = 0;
          // }, 2000);
        }
        that.addGoods.goods_id = goods_id;
        that.addGoods.spcifi_id = spcifi_id;
        that.addGoods.number = 1;
        that.addOrDelete();
      }
    },
    //减去商品
    reduceChange(goods_id, spcifi_id) {
      this.addGoods.goods_id = goods_id;
      this.addGoods.spcifi_id = spcifi_id;
      this.addGoods.number = -1;
      this.addOrDelete();
    },
    // 增加删除购物车商品
    addOrDelete() {
      this.$api.add_cart(this.addGoods).then((res) => {
        this.myCart();
      });
    },
    // 选中店铺
    changeGroupAll(item) {
      let cooperaId = item.coopera_id;
      let currentCheck = item.checked || false;
      let cartIds = [];
      item.goods.forEach(function (each) {
        cartIds.push(each.cart_id);
      });
      this.proCheckedFun(currentCheck, cartIds, cooperaId);
    },
    //删除商品
    deleteGoods(item) {
      var that = this;
      let gids = [];
      item.goods.forEach(function (v) {
        if (v.checked == 1) {
          gids.push(v.cart_id);
        }
      });
      if (gids.length > 1) {
        var goodsId = gids.join(",");
      } else if (gids.length == 0) {
        that.$toast("请选择商品");
        return;
      } else {
        var goodsId = Number(gids);
      }
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认删除商品吗?",
        })
        .then(() => {
          that.$api
            .cart_delete({
              cart_ids: goodsId,
            })
            .then((res) => {
              if (res.errno === 0) {
                that.$toast.success("删除成功");
                that.myCart();
              }
            });
        });
    },
    // // 更改选择状态
    proCheckedFun(checked, cartIds, cooperaId) {
      var that = this;
      if (cooperaId) {
        this.$api
          .cart_coopera_checked({
            coopera_id: cooperaId,
            isChecked: Number(checked),
          })
          .then((res) => {
            if (res.errno === 0) {
              that.myCart();
            }
          });
      } else {
        let cartIdsStr = cartIds.join(",");
        this.$api
          .cart_checked({
            cart_ids: cartIdsStr,
            isChecked: Number(checked),
          })
          .then((res) => {
            if (res.errno === 0) {
              that.myCart();
            }
          });
      }
    },
    // 单选
    changeGroup(item, index) {
      let currentCheck = item.goods[index].checked || false;
      let id = [item.goods[index].cart_id];
      this.proCheckedFun(currentCheck, id);
    },
    //全选
    checkTotal() {
      var that = this;
      let tempArr = [];
      let cooArr = [];
      this.cartList.forEach(function (item) {
        cooArr.push(item.coopera_id);
        item.goods.forEach(function (each) {
          tempArr.push(each.cart_id);
        });
      });
      if (tempArr.length > 1) {
        var cooperaId = tempArr.join(",");
      } else {
        var cooperaId = Number(tempArr);
      }
      this.$api
        .cart_checked({
          cart_ids: cooperaId,
          isChecked: Number(that.isCheckAll),
        })
        .then((res) => {
          that.myCart();
        });
    },

    handleErr() {
      if (this.isErr) {
        this.myCart();
      } else {
        this.$router.push("/speedBuy");
      }
    },
    // 清空全部失效商品
    clearFailGoods() {},
    //结算
    settlement() {
      let that = this;
      if (this.cartList.length == 0) {
        that
          .$confirm("暂无商品,是否去选购?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            center: true,
          })
          .then(() => {
            that.dialogFormVisible = false;
            that.$router.push('/speedBuy')
          })
          .catch(() => {});
      } else {
        let checkArray = [];
        that.cartList.forEach(element => {
          let items = element.goods
          items.forEach(item=>{
            if(item.storage == 0){
              that.$toast.fail('请先删除已售完商品')
              return
            }
            checkArray.push(item.checked)
          })
        });
        if (checkArray.indexOf(1) < 0) {
          that.checked_list.isChecked = 0;
        } else {
          that.checked_list.isChecked = 1;
        }

        console.log(this.checked_list.isChecked);
        if (this.checked_list.isChecked == 1) {
          that.$router.push({
            path: '/confirmOrder',
            query:{
              source: 'cart'
            }
          })
        } else {
          that.$toast.fail('请选择商品')
        }
      }
    },
    //移入收藏夹
    addCollect() {},
    //删除
    deleteCart() {},
  },
};
</script>
<style lang="less">
.shoppingCart {
  min-height: 100%;
  background: #f5f5f5;
  .van-nav-bar {
    .van-icon,
    .van-nav-bar__text {
      color: #444;
    }
  }
  /* 通知 无地址 */
  .notify-address {
    background: #ecf8ff;
    padding: 5px 16px;
    .van-cell__title {
      margin-left: 10px;
      font-size: 14px;
      color: #41c3ff;
    }
    .van-cell__value,
    .van-icon {
      font-size: 14px;
      color: #41c3ff;
    }
  }

  /* 购物车列表 */
  .filter-gray {
    filter: grayscale(100%);
  }
  .shopping-con {
    padding: 14px 0;
    .shopping-item {
      display: flex;
      align-items: center;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      margin-bottom: 12px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
      .left {
        margin-left: 10px;
      }
      .right {
        flex: 1;
        .van-card {
          background: #fff;
          padding-left: 10px;
          padding-right: 10px;
          .van-card__thumb {
            width: 96px;
            height: 96px;
          }
          .van-card__title {
            font-size: 14px;
            margin-bottom: 10px;
            font-weight: bold;
          }
          .van-tag {
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .van-card__price {
            .price-one-con {
              font-size: 14px;
              .price-icon {
                color: #ee0a24;
              }
              .price {
                font-size: 18px;
                font-weight: bold;
                color: #ee0a24;
              }
            }
            .price-two-con {
              font-size: 14px;
              .van-tag {
                margin-right: 0;
                margin-bottom: 0;
              }
              .price-icon {
                color: #ee0a24;
              }
              .price {
                font-size: 18px;
                font-weight: bold;
                color: #ee0a24;
              }
              .num {
                font-size: 14px;
              }
            }
            .price-two-con:first-child {
              margin-bottom: 2px;
            }
            .cuxiao-desc {
              font-size: 14px;
              color: #ee0a24;
            }
          }
          .van-card__num {
            .van-stepper {
              display: flex;
              width: 72px;
              input {
                flex: 1;
              }
              .van-stepper__minus,
              .van-stepper__plus {
                color: #c5c5c5;
                background-color: #fff;
                border: 1px solid #f9f9f9;
              }
            }
          }
          .van-card__header {
            .van-card__content {
              .van-card__bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
              }
            }
          }
        }
      }

      .filter {
        .van-card {
          .van-card__thumb {
            position: relative;
            opacity: 0.6;
            .no-sale {
              position: absolute;
              top: 50%;
              left: 50%;
              background: rgba(0, 0, 0, 0.6);
              transform: translate(-50%, -50%);
              width: 30px;
              height: 28px;
              border-radius: 4px;
              color: #fff;
              font-size: 14px;
              text-align: center;
              line-height: 28px;
            }
          }
          .van-card__num {
            .van-stepper {
              .van-stepper__minus {
                color: #e7e7e7;
                background-color: #f9f9f9;
                border: 1px solid #e7e7e7;
              }
              .van-stepper__plus {
                background: #e7e7e7;
              }
              .van-stepper--round {
                .van-stepper__minus--disabled,
                .van-stepper__plus--disabled {
                  opacity: 1;
                }
              }
              .van-stepper__input:disabled {
                color: #333;
              }
            }
          }
          .van-card__title,
          .van-tag {
            opacity: 0.6;
          }
        }
        .price-one-con {
          opacity: 0.6;
        }
      }
    }
  }

  /* 无数据 */
  .no-data {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
    height: 85vh;
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
        font-size: 16px;
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

  /* 清空全部失效商品按钮 */
  .clear-btn-con {
    position: fixed;
    left: 0;
    bottom: 120px;
    width: 100%;
    text-align: center;
  }
  /* 全选 结算操作*/
  .footer-btn-type-1 {
    position: fixed;
    bottom: 50px;
    left: 0;
    width: 100%;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    background-color: #fff;
    .left {
      width: 55%;
      height: 100%;
      background: linear-gradient(#ffffff, #ffffff);
      display: flex;
      align-items: center;
      padding-left: 14px;
      .van-checkbox__label {
        color: #575757;
        font-size: 14px;
      }
      .choose-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-left: 10px;
        .price {
          font-size: 14px;
          color: #ee0a24;
          span {
            font-size: 14px;
          }
        }
        .num {
          color: #575757;
          font-size: 14px;
          span {
            margin-right: 10px;
          }
        }
      }
    }
    .right {
      width: 20%;
      height: 60%;
      background: linear-gradient(#61d4fc, #06bffe);
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 30px;
      margin-right: 12px;
      border-radius: 14px;
    }
  }

  /* 全选 删除操作*/
  .footer-btn-type-2 {
    position: fixed;
    bottom: 65px;
    left: 0;
    width: 100%;
    height: 46px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    .left {
      width: 30%;
      height: 100%;
      background: linear-gradient(#454545, #212121);
      border-radius: 58px 0px 0px 58px;
      display: flex;
      align-items: center;
      padding-left: 14px;
      .van-checkbox__label {
        color: #d8d8d8;
        font-size: 14px;
      }
    }
    .center,
    .right {
      width: 35%;
      height: 100%;
      color: #fff;
      font-size: 14px;
      text-align: center;
      line-height: 46px;
    }
    .center {
      background: #41c3ff;
    }
    .right {
      background: #ee0a24;
      border-radius: 0px 58px 58px 0px;
    }
  }
}
</style>