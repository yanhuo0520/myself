<template>
  <div class="gxShop">
    <iframe :src="url" frameborder="0"></iframe>
    <div class="back" @click.stop="backIndex()">
      返回三位一体
    </div>
  </div>
</template>
<script>
export default {
  name: "gxShop",
  data() {
    return {
      url: "http://coopera.xfd365.com/threeinone/#/shopIndex", // 在首页进行了缓存
      // url: "http://172.168.0.80:8081/#/shopIndex",
    };
  },
  methods: {
    backIndex(){
      if(typeof android != 'undefined'){
        android.localUrl('/index.html')
      }else{
        this.$router.push('/')
      }
    }
  }
};
</script>
<style lang="less">
.gxShop {
  iframe {
    width: 100%;
    height: 100vh;
  }
  .back {
    position: fixed;
    top: calc(50% - 100px);
    left: 0;
		background: url(../images/backBg.png);
		background-size: 100% 100%;
    font-size: 14px;
    color: #fff;
    text-align: center;
    letter-spacing: 2px;
    width: 20px;
    height: 180px;
    padding-left: 1px;
    writing-mode: vertical-lr;
    text-align: center;
  }
}
</style>