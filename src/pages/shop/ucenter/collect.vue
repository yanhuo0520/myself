<template>
  <div class="collectMy">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="我的收藏"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="setDel()"
    >
      <template #right>
        <span>管理</span>
      </template>
    </van-nav-bar>

    <!-- <van-tabs title-active-color="#59CAFD" background="#f5f5f5" color="#59CAFD">
          <van-tab title="全部" ></van-tab>
          <van-tab title="有优惠"></van-tab>
          <van-tab title="已买过"></van-tab>
        </van-tabs> -->

    <div class="goods-group" v-if="collectList && collectList.length > 0">
      <van-card
        v-for="(item, index) in collectList"
        :key="index"
        :desc="item.desc"
        :title="item.goods_name"
        :thumb="item.thumb"
        @click="jump(item.goods_id)"
      >
        <template #price>
          <span class="price-icon">￥</span>
          <span class="price">{{ item.retail_price }}</span>
        </template>
        <template #footer>
          <van-button
            type="danger"
            size="small"
            round
            @click.stop="delCollect(index)"
            v-show="isDel"
            >删除</van-button
          >
        </template>
      </van-card>
    </div>

    <div class="no-data" v-if="collectList.length === 0 || isErr">
      <div class="no-data-con">
        <img :src="isErr ? errImg : noDataImg" alt="" />
        <p class="no-title">{{ isErr ? "网络竟然崩溃了" : "收藏空空的" }}</p>
        <p class="no-desc">
          {{ isErr ? "别紧张,试试看刷新页面" : "赶紧慰劳下自己吧" }}
        </p>
        <van-button
          size="small"
          plain
          round
          color="#7ED5FC"
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
  name: "collectMy",
  data() {
    return {
      isDel: false,
      collectList: [],
      noDataImg: require("../../../images/shop/ucenter/no-goods.png"),
      errImg: require("../../../images/shop/ucenter/err.png"),
      isErr: false,
      isWait:true
    };
  },
  mounted() {
    this.getCollectList();

    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    handleErr() {
      if (this.isErr) {
        // this.getCollectList()
      } else {
        this.$router.push("/shopIndex");
      }
    },
    setDel() {
      this.isDel = !this.isDel;
    },
    getCollectList() {
      this.$api
        .shop_goods_col_lists({
          page: 1,
          size: 100,
        })
        .then((res) => {
          this.isWait = false
          if (res.errno === 0) {
            this.isErr = false;
            this.collectList = res.data;
          }
        })
        .catch(() => {
          this.isErr = true;
          this.isWait = false
        });
    },
    //取消收藏
    delCollect(index) {
      this.$api.addordelete({
        goods_id: this.collectList[index].goods_id
      }).then(res=>{
        if(res.errno === 0){
          this.collectList.splice(index,1)
          this.$toast('删除成功')
        }
      })
    },
    jump(id){
      this.$router.push({
        path: '/goodsDetails',
        query:{
          id: id
        }
      })
    }
  },
};
</script>
<style lang="less">
.collectMy {
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
  /* 商品列表 */
  .goods-group {
    padding: 14px;
    .van-card {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
      .van-card__title {
        font-size: 14px;
        font-weight: bold;
      }
      .van-card__desc {
        margin-top: 8px;
      }
      .van-card__bottom {
        .van-card__price {
          color: rgb(243, 96, 101);
          .price-icon {
            font-size: 14px;
          }
          .price {
            font-size: 18px;
            font-weight: bold;
          }
        }
      }
    }
  }
  /* 无数据 */
  .no-data {
    position: fixed;
    top: 100px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 99;
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
}
</style>