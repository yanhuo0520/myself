<template>
  <div class="addEditAddress">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      :title="(modifyAdd ? '添加' : '编辑') + '收货地址'"
      left-arrow
      @click-left="$router.go(-1)"
      @click-right="$router.push('/shopIndex')"
    >
      <template #right>
        <img src="../../../images/shop/ucenter/shouye.png" alt="" width="20" />
      </template>
    </van-nav-bar>
    <van-cell-group :border="false" style="margin-bottom: 15px">
      <van-field v-model="parameter.name" placeholder="收货人姓名" clearable>
        <template #right-icon>
          <img
            src="../../../images/shop/ucenter/user-icon.png"
            width="20"
            alt=""
          />
        </template>
      </van-field>
      <van-field
        v-model="parameter.mobile"
        maxlength="11"
        placeholder="手机号码"
        type="tel"
        is-link
        clearable
      ></van-field>
      <van-cell is-link @click="show = true" :title="location"></van-cell>
      <van-field
        v-model="parameter.address"
        placeholder="详细地址: 如道路、门牌号、小区、楼栋号"
        rows="2"
        autosize
        type="textarea"
        clearable
      ></van-field>
    </van-cell-group>

    <van-cell center title="设置默认地址">
      <template #right-icon>
        <van-switch
          v-model="parameter.is_default"
          size="24"
          active-color="#41C3FF"
        />
      </template>
    </van-cell>

    <van-tabbar>
      <div
        style="
          display: flex;
          margin: auto;
          width: 70%;
          height: 80%;
          border-radius: 99px;
          overflow: hidden;
        "
      >
        <div style="flex: 1" v-if="!modifyAdd">
          <van-button
            style="width: 100%; height: 100%; line-height: 100%"
            type="danger"
            block
            round
            @click="deleteAddress()"
            >删除地址</van-button
          >
        </div>
        <div style="flex: 1">
          <van-button
            style="
              width: 100%;
              height: 100%;
              line-height: 100%;
              background: linear-gradient(#66d6fc, #00beff);
              border: 0;
            "
            type="primary"
            block
            round
            @click="keepGoods()"
            >保存地址</van-button
          >
        </div>
      </div>
    </van-tabbar>
    <van-popup v-model="show" round position="bottom">
      <van-cascader
        v-model="cascaderValue"
        title="请选择所在地区"
        :options="options"
        :field-names="fieldNames"
        active-color="#1989fa"
        @close="show = false"
        @finish="onFinish"
        @change="changeAddress"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  name: "addEditAddress",
  data() {
    return {
      modifyAdd: true,
      parameter: {
        is_default: 0,
        name: "",
        mobile: "",
        provinceCode: "", //省id
        cityCode: "", //市id
        areaCode: "", //县id
        streetCode: "", //乡镇id
        villageCode: "", // 村委会id
        address: "",
        id: "",
      },
      location: "请选择地区",

      cascaderValue: "",
      options: [],
      fieldNames: {
        text: "name",
        value: "code",
      },
      show: false,

      optionId1: 0,
      optionId2: 0,
      optionId3: 0,
      optionId4: 0,

      flag: 0,
    };
  },
  mounted() {
    this.getAddress(1, "");
    this.parameter.id = this.$route.query.address_id;
    let from = this.$route.query.add;
    if (from) {
      this.modifyAdd = true;
    } else {
      this.modifyAdd = false;
    }
    if (this.parameter.id) {
      this.singleAddress();
    }

    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.$router.go(-1)
    },
    showAddrPopup() {},
    onFinish({ selectedOptions }) {
      this.show = false;
      this.location = selectedOptions.map((option) => option.name).join("/");

      this.parameter.provinceCode = selectedOptions[0].code;
      this.parameter.cityCode = selectedOptions[1].code;
      this.parameter.areaCode = selectedOptions[2].code;
      this.parameter.streetCode = selectedOptions[3].code;
      this.parameter.villageCode = selectedOptions[4].code;
    },
    changeAddress({ value, selectedOptions, tabIndex }) {
      if (tabIndex == 0) {
        this.optionId1 = selectedOptions[0].id;
      } else if (tabIndex == 1) {
        this.optionId2 = selectedOptions[1].id;
      } else if (tabIndex == 2) {
        this.optionId3 = selectedOptions[2].id;
      } else if (tabIndex == 3) {
        this.optionId4 = selectedOptions[3].id;
      }
      if (tabIndex > 3) {
        return;
      }
      this.$api
        .address({
          level: tabIndex + 2,
          code: value,
        })
        .then((res) => {
          this.$toast.clear();
          if (res.errno == 0) {
            if (res.data.length > 0) {
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].id = i;
                if (tabIndex < 3) {
                  res.data[i].children = [];
                }
              }
            } else {
              let array = {};
              array.id = 0;
              array.code = "";
              array.name = "暂无";
              res.data.push(array);
            }

            this.$nextTick(() => {
              if (tabIndex == 0) {
                this.options[this.optionId1].children = res.data;
              } else if (tabIndex == 1) {
                let children1 = this.options[this.optionId1].children;
                children1[this.optionId2].children = res.data;
              } else if (tabIndex == 2) {
                let children1 = this.options[this.optionId1].children;
                let children2 = children1[this.optionId2].children;
                children2[this.optionId3].children = res.data;
              } else if (tabIndex == 3) {
                let children1 = this.options[this.optionId1].children;
                let children2 = children1[this.optionId2].children;
                let children3 = children2[this.optionId3].children;
                children3[this.optionId4].children = res.data;
              }
            });
          } else {
            this.$toast(res.errmsg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    // 选择地址
    getAddress(level, code) {
      this.$api
        .address({
          level: level,
          code: code,
        })
        .then((res) => {
          this.$toast.clear();
          if (res.errno == 0) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].id = i;
              res.data[i].children = [];
            }
            this.options = res.data;
          } else {
            this.$toast(res.errmsg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //获取单个地址
    singleAddress() {
      let that = this;
      this.$api
        .address_detail({
          id: this.parameter.id,
        })
        .then((res) => {
          if (res.errno === 0) {
            that.parameter.provinceCode = res.data.provinceCode;
            that.parameter.cityCode = res.data.cityCode;
            that.parameter.areaCode = res.data.areaCode;
            that.parameter.streetCode = res.data.streetCode;
            that.parameter.villageCode = res.data.villageCode;
            that.parameter.address = res.data.address;
            that.parameter.mobile = res.data.mobile;
            that.parameter.name = res.data.name;
            that.location =
              res.data.province +
              res.data.city +
              res.data.area +
              res.data.street +
              res.data.village;
            that.parameter.is_default = res.data.is_default ? true : false;
          }
        });
    },
    //删除地址
    deleteAddress() {
      let that = this;
      that.$dialog
        .confirm({
          title: "提示",
          message: "确认删除吗?",
        })
        .then(() => {
          that.$api
            .address_delete({
              id: that.parameter.id,
            })
            .then((res) => {
              if (res.errno === 0) {
                that.$toast("删除成功!");
                that.$router.go(-1);
              }
            });
        });
    },

    // 添加/编辑地址
    keepGoods() {
      let that = this;
      if (!this.parameter.name) {
        this.$toast("请输入收货人姓名");
        return;
      }
      if (this.$validatePhone(this.parameter.mobile) != true) {
        this.$toast(this.$validatePhone(this.parameter.mobile));
        return;
      }
      if (!this.parameter.provinceCode) {
        this.$toast("请选择省");
        return;
      }
      this.parameter.is_default = Number(this.parameter.is_default);

      this.$api.address_save(this.parameter).then((res) => {
        if (res.errno == 0) {
          that.$toast("保存成功");
          setTimeout(function () {
            if (that.from == "cart") {
              that.$router.push({
                path: "/collectAddress",
                query: {
                  from: "cart",
                  isMy: that.isNoRadio,
                },
              });
            } else if (that.from == "speedBuy") {
              that.$router.push({
                path: "/collectAddress",
                query: {
                  from: "speedBuy",
                  isMy: that.isNoRadio,
                },
              });
            } else if (that.from == "is_now") {
              that.$router.push({
                path: "/collectAddress",
                query: {
                  from: "is_now",
                  isMy: that.isNoRadio,
                },
              });
            } else if (that.from == "order") {
              that.$router.push({
                path: "/collectAddress",
                query: {
                  from: "order",
                },
              });
            } else {
              that.$router.go(-1);
            }
          }, 1000);
        } else {
          this.$toast(res.data.msg ? res.data.msg : "保存失败");
        }
      });
    },
  },
};
</script>
<style lang="less">
.addEditAddress {
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

  .van-button--danger {
    background: #dfeff3;
    color: #08bffe;
    border: 0;
  }
  .van-button--round {
    border-radius: 0;
  }
}
</style>