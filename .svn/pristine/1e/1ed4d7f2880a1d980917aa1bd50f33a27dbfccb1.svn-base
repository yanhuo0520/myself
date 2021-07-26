<template>
  <div class="shopBottom">
    <van-tabbar active-color="#0a79ea" inactive-color="#333" router fixed>
      <van-tabbar-item
        v-for="(item, index) of items"
        @click="toRouter(item.push)"
        :key="index"
        :badge="(index==2 && count!=0)?count:''"
      >
        <span :style="{ color: index == idx ? '#0fc1fe' : '#99A1AE' }">{{ item.name }}</span>
        <img slot="icon" :src="index === idx ? item.iconSelect : item.icon" />
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: "shopBottom",
  props: {
    idx: Number,
    count: Number
  },
  data() {
    return {
      items: [
        {
          name: "首页",
          push: "/shopIndex",
          icon: require("../images/shop/sy.png"),
          iconSelect: require("../images/shop/sy2.png"),
        },
        {
          name: "极速购买",
          push: "/speedBuy",
          icon: require("../images/shop/jsgm.png"),
          iconSelect: require("../images/shop/jsgm2.png"),
        },
        {
          name: "购物车",
          push: "/shoppingCart",
          icon: require("../images/shop/gwc1.png"),
          iconSelect: require("../images/shop/gwc2.png"),
        },
        {
          name: "我的",
          push: "/personal",
          icon: require("../images/shop/grzx.png"),
          iconSelect: require("../images/shop/grzx1.png"),
        },
      ],
    };
  },
  methods: {
    toRouter(path) {
      this.$router.push(path);
    },
  },
};
</script>
<style lang="less">
</style>