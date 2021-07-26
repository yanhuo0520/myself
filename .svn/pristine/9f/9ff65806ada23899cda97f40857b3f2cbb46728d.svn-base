<template>
  <div class="shopIndex">
    <div class="top">
      <div>
        <img src="../../images/shop/logo.png" alt="" />
        <van-field
          v-model="searchText"
          placeholder="请输入商品名称或关键字"
          :left-icon="require('../../images/shop/search.png')"
          @click="$router.push('/lookupGoods')"
          readonly
        />
        <img
          src="../../images/shop/goBack.png"
          alt=""
          @click="$router.push('/')"
        />
      </div>
    </div>
    <!-- 秒杀 -->
    <!-- <div class="func">
            <van-grid :border="false">
                <van-grid-item text="领券">
                    <img src="../../images/shop/lingquan.png" alt="">
                    <span>领券</span>
                </van-grid-item>
                <van-grid-item text="拼团">
                    <img src="../../images/shop/pintuan.png" alt="">
                    <span>拼团</span>
                </van-grid-item>
                <van-grid-item text="直播">
                    <img src="../../images/shop/zhibo.png" alt="">
                    <span>直播</span>
                </van-grid-item>
                <van-grid-item text="秒杀">
                    <img src="../../images/shop/miaosha.png" alt="">
                    <span>秒杀</span>
                </van-grid-item>
            </van-grid>

            <div class="miaosha">
                <div class="head">
                    <img src="../../images/shop/xianshimiaosha.png" alt="">
                    <p>
                        <span>27</span>
                        <img src="../../images/shop/maohao.png" alt="">
                        <span>30</span>
                        <img src="../../images/shop/maohao.png" alt="">
                        <span>56</span>
                    </p>
                </div>
                <van-grid :border="false" :column-num="3">
                    <van-grid-item>
                        <img src="../../images/shop/yumi.png" alt="">
                        <p>刚上市大玉米棒</p>
                        <p>
                            <span>￥15.9</span>
                            <span>￥29.9</span>
                        </p>
                    </van-grid-item>
                    <van-grid-item>
                        <img src="../../images/shop/yumi.png" alt="">
                        <p>刚上市大玉米棒</p>
                        <p>
                            <span>￥15.9</span>
                            <span>￥29.9</span>
                        </p>
                    </van-grid-item>
                    <van-grid-item>
                        <img src="../../images/shop/yumi.png" alt="">
                        <p>刚上市大玉米棒</p>
                        <p>
                            <span>￥15.9</span>
                            <span>￥29.9</span>
                        </p>
                    </van-grid-item>
                </van-grid>
            </div>
        </div> -->

    <div class="jingxuan">
      <div class="left">
        <div class="top" @click="$router.push('/nongziShop')">
          <img src="../../images/shop/nongziText.png" alt="" class="topImg" />
          <img src="../../images/shop/nongziPic.png" alt="" class="rightImg" />
          <img
            src="../../images/shop/nongziJiantou.png"
            alt=""
            class="leftImg"
          />
        </div>
        <div class="bottom" @click="$router.push('/baopinShop')">
          <img src="../../images/shop/baopinText.png" alt="" class="topImg" />
          <img src="../../images/shop/baopinPic.png" alt="" class="rightImg" />
          <img
            src="../../images/shop/baopinJiantou.png"
            alt=""
            class="leftImg"
          />
        </div>
      </div>
      <div class="right" @click="$router.push('/youzhiShop')">
        <div class="cont">
          <img src="../../images/shop/hezuosheText.png" alt="" class="topImg" />
          <img
            src="../../images/shop/hezuoshePic.png"
            alt=""
            class="bottomImg"
          />
          <img
            src="../../images/shop/hezuosheJiantou.png"
            alt=""
            class="leftImg"
          />
        </div>
      </div>
    </div>

    <!-- 分类 -->
    <van-sticky class="cate">
      <van-tabs v-model="active" line-height="0" @change="changeCate">
        <van-tab
          :title="item.assort_name"
          v-for="(item, index) in goods_sort"
          :key="index"
        ></van-tab>
        <van-tab title="全部分类" to="allCate"></van-tab>
      </van-tabs>
    </van-sticky>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div class="shopCont">
        <div class="shop" v-for="(item, index) in goods_list" :key="index">
          <div class="img-cont">
            <p class="saleNum">已抢购{{ item.sales_num }}</p>
            <img
              :src="
                item.thumb
                  ? item.thumb
                  : 'http://sy.xfd365.com/public/uploads/exp.jpg'
              "
              class="shop-img"
              :style="item.storage <= 0 ? 'opacity:0.4' : ''"
              @click="details(item.goods_id, item.spcifi_name)"
            />
            <div class="no-sale" v-if="item.storage <= 0">已售罄</div>
          </div>
          <div
            class="bottom-cont"
            :style="item.storage <= 0 ? 'opacity:0.6' : ''"
          >
            <p class="name">{{ item.goods_name }}</p>
            <p class="from">{{ item.coopera_name }}</p>
            <div class="price-cont">
              <p class="price">
                <span class="new">￥</span>{{ item.retail_price }}
                <span class="old">￥{{ item.discount_price }}</span>
              </p>
              <img
                src="../../images/shop/shouqin.png"
                alt=""
                v-if="item.storage <= 0"
              />
              <img
                src="../../images/addgood.png"
                alt=""
                v-if="item.num == 0 && item.storage != 0"
                @click="
                  addG(
                    item.goods_id,
                    item.spcifi_id,
                    item.promotion_num,
                    item.has_buy,
                    item.storage
                  )
                "
              />
              <van-stepper
                v-model="item.num"
                button-size="18px"
                v-if="item.num > 0 && item.storage > 0"
                @overlimit="overLimit(item.goods_id, item.spcifi_id, index)"
                @plus="
                  addG(
                    item.goods_id,
                    item.spcifi_id,
                    item.promotion_num,
                    item.has_buy,
                    item.storage
                  )
                "
                @minus="reduceChange(item.goods_id, item.spcifi_id)"
              />
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <shopBottom :idx="0" :count="count"></shopBottom>
  </div>
</template>
<script>
import shopBottom from "@/components/shopBottom";
export default {
  name: "shopIndex",
  components: {
    shopBottom,
  },
  data() {
    return {
      searchText: "",
      active: 0,
      page: 1,
      loading: false,
      finished: false,
      goods_list: [], //商品列表
      goods_sort: [], //所有商品分类
      cartList: [], //购物车列表

      num: 1,
      isStep: false,

      addGoods: {
        goods_id: "",
        spcifi_id: "",
        number: 0,
        is_now: 0, //是否是立即购买商品:1是,0否
      }, //添加购物车传参

      count: 0,
    };
  },
  mounted() {
    this.page = 1
    this.loading = false
    this.finished = false
    window.scrollTo(0,0)
  },
  methods: {
    //所有商品分类
    goodsSort() {
      this.$api.shop_first_category().then((res) => {
        if (res.errno === 0) {
          res.data.unshift({
            assort_id: "",
            assort_name: "全部",
          });
          this.goods_sort = res.data;

          this.myCart();
        }
      });
    },
    // 商品列表
    goodsList() {
      this.$api
        .shop_goodslists({
          assort_id: this.goods_sort[this.active].assort_id,
          son_assort_id: "",
          goods_name: "",
          page: this.page,
          is_you: 0,
          is_self: 0,
        })
        .then((res) => {
          if (res.errno === 0) {
            if (res.data.data.length != 0) {
              let data = res.data.data;
              if (res.data.total_page == 1) {
                this.goods_list = data;
              } else {
                this.goods_list = this.goods_list.concat(data);
              }
              if (this.page < res.data.total_page) {
                this.page++;
              }
              this.loading = false;
            } else {
              if (res.data.total_page == 0) {
                this.goods_list = [];
              }
              this.loading = false;
              this.finished = true;
            }
            // 数据全部加载完成
            if (this.goods_list.length == res.data.count) {
              this.finished = true;
            }
            if (this.cartList.length != 0) {
              this.cartList.forEach((item) => {
                this.goods_list.forEach((ele) => {
                  if (
                    item.goods_id == ele.goods_id &&
                    item.spcifi_id == ele.spcifi_id
                  ) {
                    ele.num = item.number;
                  }
                  if (ele.num < 0 || ele.num == undefined) {
                    ele.num = 0;
                  }
                });
              });
            } else {
              this.goods_list.forEach((ele) => {
                if (ele.num == undefined) {
                  ele.num = 0;
                }
              });
            }
          }
        });
    },
    // 购物车列表
    myCart() {
      this.$api.coopera_shop_cart().then((res) => {
        if (res.errno == 0) {
          this.cartList = res.data.cartList;
          this.count = res.data.cartTotal.checkedGoodsCount; //总共几件
          if (this.cartList.length != 0) {
            this.cartList.forEach((item) => {
              item.goods.forEach((g) => {
                this.cartList.push(g);
              });
            });
          }
          this.goodsList();
        }
      });
    },
    onLoad() {
      this.goodsSort();
    },
    // 切换分类
    changeCate() {
      this.page = 1;
      this.loading = false;
      this.finished = false;
      this.goods_list = [];
      if (this.goods_sort[this.active]) {
        this.goodsList();
      }
    },

    //添加数量为1
    addG(goods_id, spcifi_id, promotion_num, has_buy, storage) {
      let that = this;
      let canBuyName = promotion_num - has_buy;
      let carNum = 0;
      let cartList = that.cartList;
      cartList.forEach(function (ele) {
        if (ele.goods_id == goods_id && ele.spcifi_id == spcifi_id) {
          carNum = ele.number;
        }
      });
      if (carNum >= storage) {
        this.$toast.fail("库存不足");
      } else {
        if (
          (promotion_num == has_buy || carNum == canBuyName) &&
          has_buy != -1
        ) {
          // that.$toast('每人限购' + promotion_num + '件，超出数量将按原价累加')
        }
        // that.i = index;
        that.addGoods.goods_id = goods_id;
        that.addGoods.spcifi_id = spcifi_id;
        that.addGoods.number = 1;
        that.addCart();
      }
    },
    overLimit(goods_id, spcifi_id, index) {
      this.addGoods.goods_id = goods_id;
      this.addGoods.spcifi_id = spcifi_id;
      this.addGoods.number = -1;
      this.goods_list[index].num = 0;
      this.addCart();
    },
    // 减
    reduceChange(goods_id, spcifi_id) {
      this.addGoods.goods_id = goods_id;
      this.addGoods.spcifi_id = spcifi_id;
      this.addGoods.number = -1;
      this.addCart();
    },
    // 加入购物车
    addCart() {
      this.$api.add_cart(this.addGoods).then((res) => {
        if (res.errno === 0) {
          this.myCart();
        } else {
          this.$toast.fail(res.errmsg);
        }
      });
    },

    // 跳转详情页
    details(id, spcifi_name) {
      this.$router.push({
        path: "/goodsDetails",
        query: {
          id: id,
        },
      });
      if (spcifi_name) {
        var dataPromotion = {};
        dataPromotion.spcifi_name = spcifi_name;
        localStorage.setItem("dataPromotion", JSON.stringify(dataPromotion));
      } else {
        localStorage.setItem("dataPromotion", "");
      }
    },
  },
};
</script>
<style lang="less">
.shopIndex {
  position: relative;
  background: #f0f6fc;
  min-height: 100%;
  > .top {
    background: url(../../images/shop/banner.png) no-repeat;
    width: 100%;
    height: 219px;
    background-size: 100% 100%;
    > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      > img:first-of-type {
        width: 72px;
        height: 17px;
      }
      > img:last-of-type {
        width: 25px;
        height: 25px;
      }
      .van-field {
        height: 25px;
        width: 70%;
        border-radius: 20px;
        padding: 0 10px;
      }
      input {
        height: 25px;
        background: rgba(255, 255, 255, 0.8);
      }
    }
  }

  > .func {
    background: linear-gradient(to bottom, #ffffff, #f0f6fc);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    position: absolute;
    top: 200px;
    width: 100%;
    > .van-grid {
      .van-grid-item__content {
        background: transparent;
      }
      img {
        width: 53px;
        height: 53px;
      }
    }
    .miaosha {
      background: #fff;
      width: calc(90% - 30px);
      margin: 20px auto;
      padding: 15px;
      border-radius: 20px;
      .head {
        display: flex;
        justify-content: space-between;
        align-items: center;
        > img {
          width: 158px;
          height: 15px;
        }
        > p {
          display: flex;
          align-items: center;
          > span {
            width: 20px;
            height: 20px;
            background: #323f4b;
            display: inline-block;
            margin: 0 5px;
            text-align: center;
            line-height: 20px;
            color: #a2a2a2;
            border-radius: 2px;
            font-size: 12px;
          }
          img {
            width: 3px;
            height: 8px;
          }
        }
      }
      .van-grid {
        .van-grid-item__content {
          padding: 0 8px;
        }
        img {
          width: 95px;
          height: 95px;
        }
        p {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #444444;
          margin-bottom: 10px;
        }
        p:last-of-type {
          span:first-of-type {
            color: #ff3371;
          }
          span:last-of-type {
            color: #d4e2f0;
            text-decoration: line-through;
          }
        }
      }
    }
  }

  .jingxuan {
    display: flex;
    justify-content: space-between;
    margin: 10px;
    margin-bottom: 10px;

    .left {
      width: calc(50% - 5px);
      height: 170px;

      .top,
      .bottom {
        height: 80px;
        position: relative;
        padding: 0 10px 0 15px;
        border-radius: 5px;
      }

      .topImg {
        height: 15px;
        margin-top: 10px;
      }
      .leftImg {
        height: 15px;
        position: absolute;
        left: 15px;
        bottom: 15px;
      }

      .rightImg {
        position: absolute;
        right: 5px;
        bottom: 0;
        height: 45px;
      }

      .top {
        background: #fcedda;
      }

      .bottom {
        margin-top: 10px;
        background: #d4f0e9;
      }
    }
    .right {
      width: calc(50% - 5px);
      position: relative;
      background: #d7eafc;
      height: 140px;
      padding: 15px;
      border-radius: 5px;
      margin-left: 10px;

      .topImg {
        height: 53px;
      }
      .leftImg {
        height: 15px;
        position: absolute;
        left: 15px;
        bottom: 15px;
      }

      .bottomImg {
        position: absolute;
        right: 10px;
        bottom: 10px;
        height: 57px;
      }
    }
  }

  .cate {
    .van-tabs {
      .van-tabs__nav {
        background: transparent;
      }
    }
    .van-tab--active {
      span {
        background: #3b6af1;
        color: #fff;
        padding: 5px;
        border-radius: 20px;
      }
    }
  }

  /* 商品列表 */
  .van-list {
    .van-list__finished-text {
      margin-bottom: 50px;
    }
    .shopCont {
      margin: 0 10px 30px 10px;
      display: flex;
      flex-wrap: wrap;
      .shop {
        border-radius: 10px;
        margin-top: 10px;
        width: calc(50% - 5px);

        &:nth-child(2n) {
          margin-left: 10px;
        }

        .img-cont {
          text-align: center;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          height: 0;
          padding-bottom: 100%;
          background: #ffffff;

          &::after {
            position: absolute;
            content: "";
            left: 15px;
            right: 15px;
            bottom: 0;
            height: 1px;
            background: #f0f6fc;
          }

          .saleNum {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            color: #444444;
            line-height: 22px;
            padding: 0 10px;
            background: linear-gradient(#d4e2f0 0%, #eaf2f9 100%);
            border-radius: 10px 0px 10px 0px;
          }

          .shop-img {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: calc(100% - 30px);
            max-height: calc(100% - 30px);
          }

          .no-sale {
            position: absolute;
            top: 50%;
            left: 50%;
            background: rgba(0, 0, 0, 0.6);
            transform: translate(-50%, -50%);
            width: 1rem;
            height: 0.48rem;
            border-radius: 4px;
            color: #fff;
            font-size: 0.24rem;
            text-align: center;
            line-height: 0.48rem;
          }
        }

        .bottom-cont {
          background: #ffffff;
          border-radius: 10px;
          padding: 10px;

          .name,
          .from {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .name {
            color: #444444;
            font-size: 15px;
          }

          .from {
            color: #9aa8b6;
            margin-top: 5px;
          }
        }

        .price-cont {
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;

          .price {
            color: #ff3371;
            font-size: 15px;
            font-weight: bold;
          }

          .new {
            font-size: 12px;
          }

          .old {
            font-size: 12px;
            color: #d4e2f0;
            text-decoration: line-through;
          }

          img {
            height: 20px;
          }
        }
      }
      .van-stepper__input {
        width: 20px;
      }
    }
  }
}
</style>