<template>
  <div class="collectAddress">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="收货地址管理"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="$router.push('/shopIndex')"
    >
      <template #right>
        <img src="../../../images/shop/ucenter/shouye.png" alt="" width="20" />
      </template>
    </van-nav-bar>

    <van-address-list
      v-if="allAddress && allAddress.length > 0"
      :class="isNoRadio ? 'no-radio' : ''"
      v-model="chosenAddressId"
      :list="allAddress"
      default-tag-text="默认"
      add-button-text="新建收货地址"
      @add="addAddress"
      @edit="editAddress"
      @select="selectAddress"
    ></van-address-list>
    <div class="no-data" v-if="allAddress.length === 0 || isErr">
      <div class="no-data-con">
        <img :src="isErr ? errImg : noDataImg" alt="" />
        <p class="no-title">{{ isErr ? "网络竟然崩溃了" : "无地址" }}</p>
        <p class="no-desc">
          {{ isErr ? "别紧张,试试看刷新页面" : "请先添加收货地址" }}
        </p>
        <van-button
          size="small"
          plain
          round
          color="#41C3FF"
          @click="handleErr"
          >{{ isErr ? "刷新" : "去添加" }}</van-button
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
import Cookies from "js-cookie"; // js-cookie 引入
export default {
  name: "collectAddress",
  data() {
    return {
      isNoRadio: "",
      chosenAddressId: 0,
      allAddress: [],
      noDataImg: require("../../../images/shop/ucenter/no-address.png"),
      errImg: require("../../../images/shop/ucenter/err.png"),
      isErr: false,

      isWait: true,
    };
  },
  mounted() {
    this.collectList();
    this.chosenAddressId = this.$route.query.addressid
      ? Number(this.$route.query.addressid)
      : 0;

    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    handleErr() {
      if (this.isErr) {
        this.collectList();
      } else {
        if (Cookies.get("token")) {
          this.addAddress();
        } else {
          this.$toast("请登录!");
        }
      }
    },
    //获取收货地址
    collectList() {
      this.$api
        .address_lists({
          page: 1,
          size: 100,
        })
        .then((res) => {
          this.isErr = false;
          this.isWait = false;
          if (res.errno === 0) {
            let tmpData = [];
            res.data.forEach((item) => {
              let tmpObj = {
                id: item.id,
                name: item.name,
                tel: item.mobile,
                address:
                  (item.province ? " " + item.province : "") +
                  (item.city ? " " + item.city : "") +
                  (item.area ? " " + item.area : "") +
                  (item.street ? " " + item.street : "") +
                  (item.village ? " " + item.village : "") +
                  (item.address ? " " + item.address : ""),
                isDefault: item.is_default ? true : false,
              };
              tmpData.push(tmpObj);
            });
            this.allAddress = tmpData;
            console.log(this.allAddress);
          }
        })
        .catch(() => {
          this.isErr = false;
          this.isWait = false;
        });
    },
    // 新增地址
    addAddress() {
      localStorage.setItem("editAddress", 0);
      let href = window.location.href;
      if (href.indexOf("cart") > -1) {
        this.$router.push({
          path: "/addEditAddress",
          query: {
            from: "cart",
            add: 1,
            isMy: this.isNoRadio,
          },
        });
      } else if (href.indexOf("speedBuy") > -1) {
        this.$router.push({
          path: "/addEditAddress",
          query: {
            from: "speedBuy",
            add: 1,
            isMy: this.isNoRadio,
          },
        });
      } else if (href.indexOf("is_now") > -1) {
        this.$router.push({
          path: "/addEditAddress",
          query: {
            from: "is_now",
            add: 1,
            isMy: this.isNoRadio,
          },
        });
      } else if (href.indexOf("team_id") > -1) {
        this.$router.push({
          path: "/addEditAddress",
          query: {
            from: "team_id",
            add: 1,
            isMy: this.isNoRadio,
          },
        });
      } else {
        this.$router.push({
          path: "/addEditAddress",
          query: {
            from: 1,
            add: 1,
            isMy: this.isNoRadio,
          },
        });
      }
    },
    //编辑地址
    editAddress(item, index) {
      this.$router.push({
        path: "/addEditAddress",
        query: {
          address_id: item.id,
        },
      });
    },
    selectAddress(item) {
      let href = window.location.href;
      if (href.indexOf("cart") > -1) {
        this.$router.push({
          path: "/confirmOrder",
          query: {
            source: "cart",
            address_id: item.id,
          },
        });
      } else if (href.indexOf("speedBuy") > -1) {
        this.$router.push({
          path: "/confirmOrder",
          query: {
            source: "speedBuy",
            address_id: item.id,
          },
        });
      } else if (href.indexOf("is_now") > -1) {
        if (this.$route.query.cate_id) {
          this.$router.push({
            path: "/confirmOrder",
            query: {
              source: "speedBuy",
              address_id: item.id,
              is_now: 1,
              id: this.$route.query.id,
              cate_id: this.$route.query.cate_id,
              tabIndex: this.$route.query.tabIndex,
            },
          });
        } else {
          this.$router.push({
            path: "/confirmOrder",
            query: {
              address_id: item.id,
              is_now: 1,
              id: this.$route.query.id,
            },
          });
        }
      }
    },
  },
};
</script>
<style lang="less">
.collectAddress {
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

  /* 隐藏单选按钮 */
  .no-radio {
    .van-radio__icon {
      display: none;
    }
  }
  /* 地址列表 */
  .van-address-list {
    .van-address-item .van-radio__icon--checked .van-icon {
      background-color: #41c3ff;
      border-color: #41c3ff;
    }
    .van-address-item {
      .van-tag {
        background-color: #ecf8ff;
        color: #71d2ff;
      }
    }
    .van-address-list__bottom .van-button {
      background: #5fd4fc;
      border-color: #5fd4fc;
    }
  }
  /* 无数据 */
  .no-data {
    position: fixed;
    top: 46px;
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