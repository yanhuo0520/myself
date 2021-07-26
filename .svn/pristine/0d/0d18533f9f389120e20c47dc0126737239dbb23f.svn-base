<template>
  <div class="lookupGoods">
    <van-sticky>
      <form action="/" class="search-con">
        <van-search
          v-model="goods_name"
          shape="round"
          show-action
          placeholder="请输入搜索关键词"
          @search="goodslookup"
          @focus="isSearch = false"
          @blur="inputBlur"
          @cancel="$router.go(-1)"
        ></van-search>
      </form>
    </van-sticky>

    <div class="search-history" v-if="!isSearch">
      <div class="tit" @click="clearHistory">
        <span>历史记录</span>
        <img
          v-if="historyWord.length > 0"
          src="../../images/shop/del.png"
          alt=""
        />
      </div>
      <div
        class="item"
        v-for="(item, index) in historyWord"
        :key="index"
        @click="clickItem(item)"
      >
        {{ item }}
      </div>
    </div>

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
              @click="details(item.goods_id)"
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
            </div>
          </div>
        </div>
      </div>
    </van-list>

    <shopBottom :idx="4"></shopBottom>
  </div>
</template>
<script>
import shopBottom from "@/components/shopBottom";
export default {
  name: "lookupGoods",
  components: {
    shopBottom,
  },
  data() {
    return {
      goods_name: "",
      isSearch: false,
      historyWord: [],

      page: 1,
      loading: false,
      finished: false,
      goods_list: [], //商品列表
      goods_sort: [], //所有商品分类
      num: 1,
      isStep: false,

      son_assort_id: "",
    };
  },
  mounted() {
    var searchWord = localStorage.getItem("searchWord");
    if (searchWord) {
      this.historyWord = searchWord.split(",");
    }

    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    //   搜索商品
    goodslookup() {
      let searchWord = localStorage.getItem("searchWord");

      if (searchWord == null) {
        localStorage.setItem("searchWord", this.goods_name);
        if (this.goods_name != "") {
          this.historyWord.push(this.goods_name);
        }
      } else {
        let arr = localStorage.getItem("searchWord");
        arr = arr.split(",");
        if (arr.indexOf(this.goods_name) != -1) {
          arr = arr;
        } else if (this.goods_name != "") {
          arr.unshift(this.goods_name);
        }
        this.historyWord = arr;
        if (this.historyWord.length > 10) {
          this.historyWord.pop();
        }
        localStorage.setItem("searchWord", this.historyWord);
      }
      this.page = 1;
      this.goods_list = [];
      this.goodsList();
    },
    //   搜索框失焦
    inputBlur() {},

    // 点击历史记录搜素
    clickItem(item) {
      this.page = 1;
      this.goods_name = item;
      this.goods_list = [];
      this.goodsList();
    },
    //删除历史记录
    clearHistory() {
      localStorage.removeItem("searchWord");
      this.historyWord = [];
    },

    // 商品列表
    goodsList() {
      this.$api
        .shop_goodslists({
          assort_id: this.$route.query.assort_id
            ? this.$route.query.assort_id
            : "",
          son_assort_id: this.$route.query.son_assort_id
            ? this.$route.query.son_assort_id
            : "",
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
          }
        });
    },

    onLoad() {
      this.goodsList();
    },

    //商品详情
    details(id) {
      this.$router.push({
        path: "/goodsDetails",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>
<style lang="less">
.lookupGoods {
  min-height: 100%;
  background: #f5f5f5;
  /* 搜索框 */
  .search-con {
    background: #fff;
    .van-search__action {
      color: #999;
    }
    .van-field__control {
      caret-color: #2ccf75;
    }
  }
  /* 历史记录 */
  .search-history {
    background: #fff;
    padding: 12px;
    .tit {
      font-size: 12px;
      font-weight: bold;
      color: #000;
      padding-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      img {
        width: 15px;
      }
    }
    .item {
      display: inline-block;
      padding: 6px 12px;
      margin-right: 10px;
      margin-bottom: 12px;
      background: #f5f5f5;
      color: #333;
      font-size: 12px;
      border-radius: 100px;
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
    }
  }
}
</style>