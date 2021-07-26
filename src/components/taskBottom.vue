<template>
  <div class="taskBottom">
    <img class="absolute-bg" src="../images/bountyTask/tabBar-bg.png" />
    <div class="bottom-con">
      <div class="bot-item-con" v-for="(item, index) in items" :key="index" @click="toRouter(item.name, item.push)" >
        <img class="icon" :class="{'send-icon': index == 1}" :src="index === idx ?item.iconSelect: item.icon" alt="">
        <span class="text" :style="{color: index == idx ? '#444' : '#9aa8b6'}">{{item.name}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "taskBottom",
  props: ["idx"],
  data() {
    return {
      items: [{
          name: "赏金任务",
          push: "/taskIndex",
          icon: require("../images/bountyTask/tabbar-icon1.png"),
          iconSelect: require("../images/bountyTask/tabbar-select-icon1.png")
        },
        {
          name: "发布任务",
          push: "/addTask",
          icon: require('../images/bountyTask/send-img.png'),
          iconSelect: require('../images/bountyTask/send-select-img.png'),
        },
        {
          name: "我的任务",
          push: "/taskCenter",
          icon: require("../images/bountyTask/tabbar-icon2.png"),
          iconSelect: require("../images/bountyTask/tabbar-select-icon1.png")
        }
      ]
    };
  },
  methods: {
    toRouter(name, path) {
		this.$router.push(path);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.taskBottom {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100vw;
  height: 1.73rem;
  z-index: 999;
  .absolute-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
  .bottom-con {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.33rem;
    background: #fff;
    .bot-item-con {
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      .icon {
        width: 0.42rem;
      }
      .send-icon {
        width: 0.93rem;
        margin-top: -0.44rem;
      }
      .text {
        margin-top: 0.1rem;
        font-size: 0.32rem;
        font-family: Microsoft YaHei, Microsoft YaHei-Regular;
        font-weight: 400;
        color: #9aa8b6;
      }
    }
  }
  .van-tabbar {
    // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
    // width: 100%;
    // height: 50px;
    // background-size: 100% 100%;
    // .van-tabbar-item {
    //   justify-content: flex-end;
    //   padding-bottom: 5px;
    //   position: relative;
    // }
    // .van-tabbar-item:nth-of-type(2) {
    //   .icon-con {
    //     position: absolute;
    //     top:0;
    //     left: 50%;
    //     transform: translate(-50%, -50%);
    //     background: #fff;
    //     width: 50px;
    //     padding: 6px;
    //     height: 50px;
    //     box-sizing: border-box;
    //     border-radius: 50%;
    //     box-shadow: 0 -2px 6px 0px #ccc;
    //     .icon {
    //       width: 100%;
    //       height: 100%;
    //     }
    //   }
    //   .van-tabbar-item__icon {
    //     width: 100%;
    //     height: 100%;
    //   }
    // }
    // .van-tabbar-item--active {
    //   background: transparent;
    // }
  }
}
</style>

