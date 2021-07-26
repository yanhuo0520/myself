<template>
  <div class="fenxiaoShop">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="分销商城"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="addTeamGoods"
    >
      <template #right>
        <span>添加</span>
      </template>
    </van-nav-bar>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!--  "is_team_tg": 1,//是否分销：0否，1是
			"if_team_owner": 1,//用户是否为团长：0否，1是
            "team_owner_money": "1.00",//团长所得分佣金额（分销商品并且为团长才显示）
            "if_team_had_add": 1,//团队是否加过该商品：0否，1是（团长才显示）
     -->
      <div class="shopCont">
        <div
          class="shop"
          v-for="(item, index) in goods_list"
          :key="index"
          @click.stop="checkGoods(item)"
        >
          <div class="img-cont">
            <p class="saleNum" :style="{ opacity: item.checked ? 0.6 : 1 }">
              已抢购{{ item.sales_num }}
            </p>
            <img
              :src="
                item.thumb
                  ? item.thumb
                  : 'http://sy.xfd365.com/public/uploads/exp.jpg'
              "
              class="shop-img"
              @click.stop="details(item.goods_id, item.spcifi_name)"
              :style="{ opacity: item.checked ? 0.6 : 1 }"
            />
            <span v-if="item.checked">
              <img src="../../images/dui1.png" alt="" />
            </span>
          </div>
          <div class="bottom-cont">
            <p class="name">{{ item.goods_name }}</p>
            <p class="from">{{ item.coopera_name }}</p>
            <div class="price-cont">
              <p class="price">
                <span class="new">￥</span>{{ item.retail_price }}
                <!-- <span class="old">￥{{ item.discount_price }}</span> -->
              </p>
              <div
                class="cartCont"
                v-if="item.if_team_owner == 1 && item.is_team_tg == 1"
              >
                赚{{ item.team_owner_money }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
export default {
  name: "fenxiaoShop",
  data() {
    return {
      page: 1,
      loading: false,
      finished: false,
      goods_list: [], //商品列表
      cartList: [], //购物车列表
      num: 1,
      isStep: false,
      addGoods: {
        goods_id: "",
        spcifi_id: "",
        number: 0,
        is_now: 0, //是否是立即购买商品:1是,0否
      }, //添加购物车传参
    };
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    checkGoods(item) {
      if (item.if_team_had_add == 0 && item.if_team_owner == 1) {
        item.checked = !item.checked;
        this.$forceUpdate();
      } else {
        item.checked = false;
        if (item.if_team_owner == 0) {
          this.$toast.fail("团员不能添加");
          return;
        }
        this.$toast.fail("已添加过，无需重复添加");
      }
    },
    //添加
    addTeamGoods(){
        let arr = this.goods_list.filter((item)=>{
            return item.checked
        })
        if(arr.length === 0){
            this.$toast.fail('请先选择商品')
            return
        }
        let str = ''
        arr.forEach(item=>{
            str += item.goods_id + ','
        })
        str = str.substring(0,str.length - 1)
        this.$api.team_owner_add_good({
            goods_id_str: str
        }).then(res=>{
            if(res.errno === 0){
                this.$toast.success(res.errmsg)
            }else{
                this.$toast.fail(res.errmsg)
            }
        })
    },
    // 商品列表
    goodsList() {
      this.$api
        .shop_goodslists({
          assort_id: "",
          son_assort_id: "",
          goods_name: "",
          page: this.page,
          is_team_tg: 1,
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
            this.goods_list.forEach((ele) => {
              ele.checked = false;
            });
            console.log(this.goods_list);
          } else {
            this.$toast.fail(res.errmsg);
            this.loading = false;
            this.finished = true;
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
      this.myCart();
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
  mounted(){
    window.leftBack = this.leftBack
  }
};
</script>
<style lang="less">
.fenxiaoShop {
  min-height: 100%;
  background: #f5f5f5;
  .van-nav-bar {
    .van-icon,
    .van-nav-bar__text {
      color: #444;
    }
  }

  /* 商品列表 */
  .van-list {
    .van-list__finished-text {
      // margin-bottom: 50px;
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

          > span {
            background: #fff;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-left: -25px;
            margin-top: -25px;
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

          .cartCont {
            padding: 0 5px;
            color: #ffffff;
            height: 20px;
            line-height: 20px;
            background: url(../../images/bgBtn.png);
            background-size: 100% 20px;
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