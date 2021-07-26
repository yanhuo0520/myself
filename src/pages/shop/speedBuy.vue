<template>
  <div class="speedBuy">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="极速购买"
    ></van-nav-bar>
    <div class="search-con">
      <input
        type="text"
        placeholder="点击搜索商品"
        readonly="readonly"
        @click="search"
      />
      <img src="../../images/shop/sousuo.png" alt="" @click="search" />
    </div>

    <van-tree-select
      height="calc(100vh - 156px)"
      :items="items"
      :main-active-index.sync="active"
      @click-nav="clickActive"
    >
      <template #content>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="list" v-for="(item, index) in goods_list" :key="index">
            <div
              class="content"
              :style="item.storage <= 0 ? 'opacity:0.6' : ''"
            >
              <img
                :src="
                  item.thumb
                    ? item.thumb
                    : 'http://sy.xfd365.com/public/uploads/exp.jpg'
                "
                alt=""
                class="left"
                @click="details(item.goods_id)"
              />
              <div class="no-sale" v-if="item.storage <= 0">已售罄</div>
              <div class="right">
                <p>{{ item.goods_name }}</p>
                <p>{{ item.coopera_name }}</p>
                <div class="price-cont">
                  <p class="price">
                    <!--  -->
                    <span class="new">￥</span>{{ item.retail_price }}
                  </p>
                  <img
                    src="../../images/shop/shouqin.png"
                    alt=""
                    style="width: 20px"
                    v-if="item.storage <= 0"
                  />
                  <img
                    src="../../images/addgood.png"
                    alt=""
                    @click="
                      addG(
                        item.goods_id,
                        item.spcifi_id,
                        item.promotion_num,
                        item.has_buy,
                        item.storage
                      )
                    "
                    v-if="item.num == 0 && item.storage != 0"
                  />
                  <van-stepper
                    v-model="num"
                    button-size="20px"
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
      </template>
    </van-tree-select>

    <shopBottom :idx="1" :count="count"></shopBottom>
  </div>
</template>
<script>
import shopBottom from "@/components/shopBottom";
export default {
  name: "speedBuy",
  components: {
    shopBottom,
  },
  data() {
    return {
      active: 0,
      items: [],
      page: 1,
      loading: false,
      finished: false,

      isStep: false,
      num: 0,
      count: 0,

      goods_list: [],
      cartList: [],
      addGoods: {
        goods_id: "",
        spcifi_id: 0,
        number: 0,
      },
    };
  },
  mounted() {
    this.myCart();
    if(this.$route.query.tabIndex){
      this.active = this.$route.query.tabIndex
    }else{
      this.active = 0
    }

    this.loading = false
    this.finished = false
  },
  methods: {
    search() {
      this.$router.push('/lookupGoods')
    },
    clickActive() {
      this.page = 1;
      this.goods_list = []
      this.loading = false;
      this.finished = false;
    },
    myCart() {
      // 购物车数量
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
        }
      });
    },
    getCate() {
      this.items = [];
      this.$api.shop_first_category().then((res) => {
        if (res.errno === 0) {
          res.data.forEach((ele) => {
            this.items.push({
              text: ele.assort_name,
              id: ele.assort_id,
              children: [],
            });
          });
          this.goodsList(this.items[this.active].id);
        }
      });
    },
    onLoad() {
      this.getCate();
    },

    //商品详情
    details(id) {
      this.$router.push({
        path: "/goodsDetails",
        query: {
          id: id,
          cate_id: this.items[this.active].id,
          tabIndex: this.active
        },
      });
    },

    // 商品列表
    goodsList(id) {
      this.$api
        .shop_goodslists({
          assort_id: id,
          son_assort_id: "",
          goods_name: this.goods_name,
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
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
        });
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
  },
};
</script>
<style lang="less">
.speedBuy {
  min-height: 100%;
  background: #f5f5f5;
  /* 搜索框 */
  .search-con {
    position: fixed;
    width: 100%;
    top: 46px;
    padding: 10px 12px;
    background: #ffffff;
    box-sizing: border-box;
    input {
      border: none;
      width: 100%;
      height: 38px;
      background: rgba(243, 243, 243, 1);
      border-radius: 100px;
      font-size: 14px;
      text-align: center;
    }
    img {
      position: absolute;
      left: 31%;
      top: 50%;
      width: 15px;
      height: 15px;
      transform: translateY(-50%);
    }
  }
  .van-sidebar-item--select::before {
    background-color: #41c3ff;
    width: 2px;
    height: 48px;
  }

  .van-tree-select {
    margin-top: 70px;
    .list {
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        border-bottom: 1px solid #eee;
        position: relative;
        > img {
          width: 80px;
          height: 80px;
        }
        > .right {
          width: calc(100% - 80px);
          margin-left: 10px;
          > p:first-of-type,
          > p:last-of-type {
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-size: 14px;
            width: 100%;
          }
          > p:last-of-type {
            color: #888888;
          }
          .price-cont {
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .price {
              color: #444;
              font-size: 15px;
              font-weight: bold;
              .new {
                font-size: 12px;
              }
            }

            img {
              width: 30px;
              height: 20px;
            }
          }
        }
        .no-sale {
          position: absolute;
          top: 50%;
          left: 22%;
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
    }
  }
}
</style>