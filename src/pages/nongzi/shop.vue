<template>
    <div class="nongziShop">
        <div class="top">

        </div>

        <van-tabs v-model="active" line-height="0">
            <van-tab :title="item.title" v-for="(item,index) in tabs" :key="index">
                <van-list>
                    <van-grid :column-num="2">
                        <van-grid-item>
                            <template #default>
                                <div class="goods">
                                    <img src="" alt="" class="goodsImg">
                                    <p class="title">农用拖拉机大力道新品上市</p>
                                    <p>
                                        <span>限时特惠</span>
                                        <span>24小时发货</span>
                                    </p>
                                    <div class="price">
                                        <p>
                                            ￥15.9
                                            <span>￥9.9</span>
                                        </p>
                                        <p>
                                            <span>-</span>
                                            <span>1</span>
                                            <span>+</span>
                                        </p>
                                    </div>
                                </div>
                            </template>
					    </van-grid-item>
                        <van-grid-item>
                            <template #default>
                                <div class="goods">
                                    <img src="" alt="" class="goodsImg">
                                    <p class="title">农用拖拉机大力道新品上市</p>
                                    <p>
                                        <span>限时特惠</span>
                                        <span>24小时发货</span>
                                    </p>
                                    <div class="price">
                                        <p>
                                            ￥15.9
                                            <span>￥9.9</span>
                                        </p>
                                        <p>
                                            <span>-</span>
                                            <span>1</span>
                                            <span>+</span>
                                        </p>
                                    </div>
                                </div>
                            </template>
					    </van-grid-item>
                        <van-grid-item>
                            <template #default>
                                <div class="goods">
                                    <img src="" alt="" class="goodsImg">
                                    <p class="title">农用拖拉机大力道新品上市</p>
                                    <p>
                                        <span>限时特惠</span>
                                        <span>24小时发货</span>
                                    </p>
                                    <div class="price">
                                        <p>
                                            ￥15.9
                                            <span>￥9.9</span>
                                        </p>
                                        <p>
                                            <span>-</span>
                                            <span>1</span>
                                            <span>+</span>
                                        </p>
                                    </div>
                                </div>
                            </template>
					    </van-grid-item>
                    </van-grid>
                </van-list>
            </van-tab>
        </van-tabs>
    </div>
</template>
<script>
export default {
  name: "nongziShop",
  data() {
    return {
      active: 0,
      tabs: [
        { title: "全部" },
        { title: "农药" },
        { title: "化肥" },
        { title: "农机" },
        { title: "更多" }
      ]
    };
  }
};
</script>
<style lang="less">
.nongziShop {
    background: #f5f5f5;
    min-height: 100%;
  .van-tabs.van-tabs--line {
    margin-bottom: 20px;
    .van-tabs__wrap {
      height: 30px;
      margin-bottom: 20px;
      .van-tabs__nav{
          background: transparent;
      }
      .van-tab {
        padding: 0;
        margin: 0 5px;
      }
      .van-tab--active {
        background: #00bd22;
        color: #fff;
        border-radius: 20px;
      }
    }
  }

  .van-grid-item {
      flex-basis: 45% !important;
      margin-left: 3%;
      margin-bottom: 10px;
    .goods {
      > img {
        width: 100%;
        height: 128px;
      }
      > p.title {
        margin: 0;
        font-size: 16px;
      }
    }
  }
}
</style>