<template>
  <div class="goodsDetails">
    <van-nav-bar
      :border="false"
      :fixed="true"
      :placeholder="true"
      z-index="9999"
      title="商品详情"
      left-arrow
      @click-left="returnLast()"
      @click-right="$router.push('/shopIndex')"
    >
      <template #right>
        <img src="../../images/shop/ucenter/shouye.png" alt="" width="20" />
      </template>
    </van-nav-bar>

    <!-- 图片轮播 -->
    <van-swipe style="height: 300px" indicator-color="transparent">
      <van-swipe-item v-if="info.thumb && videoUrl">
        <video
          id="video"
          width="100%"
          height="100%"
          x5-video-player-type="h5-page"
          playsinline
          webkit-playsinline
          :poster="info.thumb"
          controls
        >
          <source :src="videoUrl" />
        </video>
      </van-swipe-item>

      <van-swipe-item v-if="info.thumb && !videoUrl">
        <a href="javascript:;">
          <img
            :src="info.thumb"
            style="width: 100%; height: 100%; object-fit: contain"
          />
        </a>
      </van-swipe-item>
      <van-swipe-item v-for="(item, index) in info.album" :key="index">
        <a href="javascript:;">
          <img
            :src="item"
            style="width: 100%; height: 100%; object-fit: contain"
          />
        </a>
      </van-swipe-item>
    </van-swipe>

    <!-- 商品介绍 -->
    <div style="background-color: #fff; margin: 14px; border-radius: 10px">
      <div class="clearfix goodspp">
        <div style="display: flex; justify-content: space-between">
          <span class="textTitle">{{ info.goods_name }}</span>
          <span
            style="
              width: 35px;
              height: 35px;
              border-radius: 50%;
              text-align: center;
              box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.24);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-size: 10px;
            "
            v-if="lock_mem_id && ifShare == 0"
            @click="shareGoods"
            >分享<van-icon name="share-o"
          /></span>
        </div>
        <div
          class="share-poster"
          v-if="info.booking == 1"
          style="display: block"
        >
          <span
            v-if="info.deliver_start && info.deliver_start"
            style="color: gray; margin-top: 5px; font-size: 14px"
            >此商品预售，预计发货时间段为{{ info.deliver_start }}~{{
              info.deliver_end
            }}</span
          >
          <span v-else style="color: gray; margin-top: 5px; font-size: 14px"
            >此商品预售，预计发货时间为{{ info.booking_date }}</span
          >
        </div>
      </div>

      <div
        v-if="decPrice > 0"
        style="padding: 0 10px; color: red; font-weight: bold"
      >
        每人限购{{ promotion_num }}件
      </div>
      <!-- 价格 -->
      <div class="clearfix goodspp">
        <div class="fl" v-if="decPrice > 0">
          <span style="color: #f36065; font-weight: 700" v-if="info.unit"
            >￥{{ decPrice }}/{{ info.unit }}
          </span>
          <span style="color: #f36065; font-weight: 700" v-else
            >￥{{ decPrice }}</span
          >

          <span
            style="color: gray; text-decoration: line-through; font-size: 12px"
            v-if="info.unit"
            >￥{{ price }}/{{ info.unit }}
          </span>
          <span
            style="color: gray; text-decoration: line-through; font-size: 12px"
            v-else
            >￥{{ price }}</span
          >
        </div>
        <div class="fl" v-else>
          <span style="color: #f36065; font-weight: 700" v-if="info.unit"
            >￥{{ price }}/{{ info.unit }}
          </span>
          <span style="color: #f36065; font-weight: 700" v-else
            >￥{{ price }}</span
          >
        </div>
        <div
          class="fr"
          style="
            padding: 0 5px;
            margin-right: 10px;
            background: #eee;
            border-radius: 10px;
          "
        >
          <span v-if="salesShow == 1">
            销量{{ info.sales_num }}{{ info.unit }}
          </span>
        </div>
      </div>
    </div>

    <div class="choose-spec" @click="joinGoods">
      <span class="title">选择</span>
      <span class="value" v-if="spcifiList && spcifiList[0].name">{{
        spcifiList[0].name
      }}</span>
      <span class="value" v-if="spcifiList && spcifiList[1].name">{{
        spcifiList[1].name
      }}</span>
      <span class="value" v-if="spcifiList && spcifiList[2].name">{{
        spcifiList[2].name
      }}</span>
      <van-icon name="arrow" />
    </div>

    <!-- 商品详情 -->
    <div class="goods-info">
      <p>
        <img src="../../images/shop/spxx_left.png" alt="" /> 商品信息
        <img src="../../images/shop/spxx_left.png" alt="" />
      </p>
      <div class="goods_content" v-html="info.content"></div>
    </div>

    <van-goods-action>
      <van-goods-action-icon
        style="font-weight: bold; color: #b5b5b5"
        color="#333"
        text="首页"
        @click="$router.push('/shopIndex')"
      >
        <template #icon>
          <img src="../../images/shop/shop.png" alt="" />
        </template>
      </van-goods-action-icon>
      <van-goods-action-icon
        style="font-weight: bold; color: #b5b5b5"
        color="#333"
        icon="shopping-cart"
        text="客服"
      >
        <template #icon>
          <img src="../../images/shop/kefu.png" alt="" />
        </template>
      </van-goods-action-icon>
      <van-goods-action-icon
        style="font-weight: bold; color: #b5b5b5"
        :color="isCollect == 1 ? '#43CDFC' : '#B5B5B5'"
        :icon="isCollect == 1 ? 'like' : 'like-o'"
        :text="isCollect == 1 ? '已收藏' : '收藏'"
        @click="addCollect()"
      ></van-goods-action-icon>

      <van-goods-action-button
        color="linear-gradient(#E7F9FF, #E7F9FF)"
        style="color: #73d2ff; font-weight: bold"
        type="warning"
        text="加入购物车"
        @click="joinGoods"
      ></van-goods-action-button>
      <van-goods-action-button
        color="linear-gradient(#5CD3FC, #0BC0FE)"
        style="font-weight: bold"
        type="danger"
        text="立即购买"
        @click="atOnce()"
      ></van-goods-action-button>
    </van-goods-action>

    <van-popup
      v-model="dialogFormVisible"
      position="bottom"
      closeable
      close-icon="close"
      round
      :style="
        simulatedDATA.specifications.length == 3
          ? { height: '75%' }
          : simulatedDATA.specifications.length == 2
          ? { height: '65%' }
          : { height: '55%' }
      "
      class="choose-spec-popup"
    >
      <van-card
        :thumb="
          showImg ? showImg : 'http://sy.xfd365.com/public/uploads/exp.jpg'
        "
        class="van-hairline--bottom"
      >
        <template #title>
          <div class="price">
            <template v-if="decPrice > 0">
              <span>￥{{ decPrice }}</span>
              <span class="line-price">￥{{ price }}</span>
            </template>
            <template v-else>
              <span>￥{{ price }}</span>
            </template>
          </div>
        </template>
        <template #desc>
          <div class="desc" style="box-sizing: border-box">
            <template v-if="hasStep">
              <span v-for="(item, index) in priceStepList" :key="index">
                <span v-if="item.most != 0">
                  购买数量
                  {{ item.least }}
                  ~
                  {{ item.most }}
                  ，单价为
                  {{ item.price }}
                  元
                </span>
                <span v-else-if="item.most == 0">
                  购买数量
                  {{ item.least }}
                  及以上，单价为
                  {{ item.price }}元
                </span>
              </span>
            </template>

            <div
              style="text-align: right; width: 67%; color: #999"
              v-if="stepList.length > 3"
              v-on:click="changeFoldState"
            >
              <span>{{ brandFold ? "展开" : "收起" }}</span>
            </div>
          </div>
        </template>
        <template #price>
          <span v-if="decPrice > 0" class="xian-gou"
            >每人限购{{ promotion_num }}件</span
          >
          <span>库存 {{ storage }}</span>
        </template>
      </van-card>
      <div class="product-content" v-if="simulatedDATA.difference.length > 0">
        <div
          class="product-delcom"
          v-for="(ProductItem, n) in simulatedDATA.specifications"
          :key="n"
        >
          <p>{{ ProductItem.name }}</p>
          <ul class="product-footerlist">
            <li
              v-for="(oItem, index) in ProductItem.item"
              :key="index"
              v-on:click="specificationBtn(oItem.name, n, $event, index)"
              v-bind:class="[
                oItem.isShow ? '' : 'noneActive',
                subIndex[n] == index ? 'productActive' : '',
              ]"
            >
              {{ oItem.name }}
            </li>
          </ul>
        </div>
      </div>
      <div v-if="simulatedDATA.difference.length == 0" class="spec-no">
        <span class="title">规格</span>
        <span class="value">{{ info.spec }}</span>
      </div>
      <div class="pay-num-con">
        <span>购买数量</span>
        <div class="step-con">
          <img
            src="../../images/shop/jian.png"
            alt=""
            class="fl"
            width="22px"
            @click="reduceChange(info.goods_id, spcifi_id, amount)"
          />
          <div
            class="fl"
            style="
              margin-left: 20px;
              margin-right: 20px;
              height: 22px;
              line-height: 22px;
            "
          >
            {{ amount }}
          </div>
          <img
            src="../../images/shop/jia.png"
            alt=""
            class="fl"
            width="22px"
            @click="addChange(info.goods_id, spcifi_id, amount)"
          />
        </div>
      </div>

      <div class="footer-btn">
        <div class="btn" @click="joinCart(info.goods_id)">{{ gouwu }}</div>
      </div>
      <div style="height: 4rem"></div>
    </van-popup>

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
  name: "goodsDetails",
  data() {
    return {
      isWait: true,
      info: {},
      videoUrl: "",
      decPrice: "", // 促销价格
      decSavePrce: "", // 保存促销价格（无规格）
      price: 0,
      promotion_num: 0, //限购数量
      salesShow: 0,

      spcifiList: [{ name: "" }, { name: "" }, { name: "" }],
      isCollect: 0,
      dialogFormVisible: false,
      simulatedDATA: { specifications: [], difference: [] },
      stepList: [],
      priceStepList: [],
      showImg: "",
      storage: "",
      gouwu: "",
      switch: "",
      goodsXq: {
        goods_id: "",
        spcifi_id: 0, // 商品规格id,没有规格可为0
        number: 1,
        is_now: "",
      },
      hasStep: false,

      picList: [],
      cartList: [],
      amount: 1,
      spcifi_id: 0,

      selectArr: [], //存放被选中的值
      shopItemInfo: [], //存放要和选中的值进行匹配的数据
      subIndex: [], //是否选中 因为不确定是多规格还是单规格，所以这里定义数组来判断

      lock_mem_id: "", //加密后的团员id
      ifShare: 0,
      openId: "",

      brandFold: true,
    };
  },
  mounted() {
    this.getDetails();
    this.myCart();
    this.goodsXq.goods_id = this.$route.query.id;

    // 是否分销 ifShare 等于0 且 lock_mem_id有值 分销
    this.ifShare = this.$route.query.ifShare;
    this.lock_mem_id = this.$route.query.lock_mem_id;
    this.getOpenid();

    window.leftBack = this.leftBack
  },
  methods: {
    leftBack() {
      this.returnLast()
    },
    returnLast() {
      if (this.$route.query.cate_id) {
        this.$router.push({
          path: "/speedBuy",
          query: {
            cate_id: this.$route.query.cate_id,
            tabIndex: this.$route.query.tabIndex,
          },
        });
      } else if (this.$route.query.index) {
        this.$router.push("/shopIndex");
      } else {
        this.$router.go(-1);
      }
      localStorage.removeItem("dataPromotion");
    },
    changeFoldState() {
      this.brandFold = !this.brandFold;
      var list = this.stepList;
      var arr = [];
      if (this.brandFold && this.hasStep) {
        if (list.length > 3) {
          for (var i = 0; i < 3; i++) {
            arr.push(list[i]);
          }
          this.priceStepList = arr;
        } else {
          this.priceStepList = list;
        }
      } else if (!this.brandFold) {
        this.priceStepList = list;
      }
    },
    getOpenid() {
      this.$api.get_user_openid().then((res) => {
        if (res.errno === 0) {
          this.openId = res.data;
        }
      });
    },
    getBase64Image(image, ext) {
      var canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      var context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, image.width, image.height);

      // 这里是不支持跨域的
      var base64 = canvas.toDataURL("image/" + ext);
      return base64;
    },
    shareGoods() {
      // info.thumb
      let that = this
      let picBase64 = this.getBase64Image(that.info.thumb,"jpg") ? this.getBase64Image(that.info.thumb,"jpg") : ''
      android.wxShareUrl(
        this.openId,
        window.location.href,
        this.info.goods_name,
        "",
        picBase64
      );
    },
    // 购物车列表
    myCart() {
      this.$api.coopera_shop_cart().then((res) => {
        if (res.errno == 0) {
          this.cartList = res.data.cartList;
        }
      });
    },
    // 立即购买
    atOnce() {
      this.switch = "yes";
      this.gouwu = "立即购买";
      this.goodsXq.is_now = 1;
      this.dialogFormVisible = true;
    },
    // 加入购物车
    joinGoods() {
      this.switch = "no";
      this.gouwu = "加入购物车";
      this.goodsXq.is_now = 0;
      this.dialogFormVisible = true;
    },
    joinCart(goods_id) {
      var that = this;
      var message = [];
      var length = 0;
      that.simulatedDATA.specifications.forEach((ele) => {
        if (ele.length != 0) {
          length += 1;
          message.push(ele.name);
        }
      });
      for (var i = 0; i < length; i++) {
        if (that.selectArr[i] == "") {
          this.$toast("请选择" + message[i]);
          return;
        }
      }
      let canBuyName = that.promotion_num - that.has_buy;
      let carNum = 0;
      that.cartList.forEach(function (ele) {
        if (ele.spcifi_id == that.spcifi_id) {
          carNum = ele.number;
        }
      });
      if (that.amount + carNum > that.storage && that.goodsXq.is_now == 0) {
        that.$toast.fail("库存不足");
      } else {
        // if (that.amount + carNum > canBuyName && that.has_buy != -1) {
        //   that.$toast(
        //     "每人限购" + that.promotion_num + "件，超出数量将按原价累加"
        //   );
        //   return
        // }
        that.goodsXq.goods_id = goods_id;
        that.goodsXq.number = that.amount;
        that.goodsXq.spcifi_id = that.spcifi_id;
        that.$api.add_cart(this.goodsXq).then((res) => {
          if (res.errno === 0) {
            that.myCart();
            that.dialogFormVisible = false;
            if (that.switch == "yes") {
              if (
                that.goodsXq.number > that.storage &&
                that.goodsXq.is_now == 1
              ) {
                that.$toast.fail("库存不足");
                return;
              }
              if (!that.cate_id) {
                this.$router.push({
                  path: "/confirmOrder",
                  query: {
                    is_now: 1,
                    id: goods_id,
                    lock_mem_id: this.lock_mem_id,
                  },
                });
              } else {
                this.$router.push({
                  path: "/confirmOrder",
                  query: {
                    is_now: 1,
                    id: goods_id,
                    cate_id: that.cate_id,
                    lock_mem_id: this.lock_mem_id,
                  },
                });
              }
            } else {
              that.$toast.success("添加成功");
              that.amount = 1;
            }
          } else {
            this.$toast.fail(res.errmsg);
          }
        });
      }
    },
    // 购物车列表
    myCart() {
      this.$api.coopera_shop_cart().then((res) => {
        if (res.errno == 0) {
          this.cartList = res.data.cartList;
        }
      });
    },
    addCollect() {
      this.$api
        .addordelete({
          goods_id: this.goodsXq.goods_id,
        })
        .then((res) => {
          if (res.errno === 0) {
            if (res.data.type == "add") {
              this.$toast.success("添加收藏成功");
              this.isCollect = 1;
            } else {
              this.$toast.success("取消收藏成功");
              this.isCollect = 0;
            }
          } else if (res.errno === 1) {
            this.$toast.fail(res.errmsg);
          }
        });
    },
    addChange(goods_id, sid, num) {
      let that = this;
      num++;
      for (var i = 0; i < that.stepList.length; i++) {
        var stepItem = that.stepList[i];
        if (num >= stepItem.least) {
          if (num < stepItem.most) {
            that.price = stepItem.price;
          } else if (stepItem.most == 0) {
            that.price = stepItem.price;
          }
        }
      }
      let canBuyName = that.promotion_num - that.has_buy;
      let carNum = 0;
      that.cartList.forEach(function (ele) {
        if (ele.spcifi_id == that.spcifi_id && ele.goods_id == that.goodId) {
          carNum = ele.number;
        }
      });
      if (that.amount + carNum >= that.storage && that.goodsXq.is_now == 0) {
        that.$toast.fail("库存不足");
      } else if (num > that.storage && that.goodsXq.is_now == 1) {
        that.$toast.fail("库存不足");
      } else {
        if (that.amount + carNum == canBuyName && that.has_buy != -1) {
          that.$toast(
            "每人限购" + that.promotion_num + "件，超出数量将按原价累加"
          );
          that.decPrice = "";
        }
        that.amount = that.amount + 1;
      }
    },
    reduceChange(goods_id, sid, num) {
      let that = this;
      num--;
      that.stepList.forEach((ele) => {
        if (num > ele.least) {
          if (num <= ele.most) {
            that.price = ele.price;
          } else if (ele.most == 0) {
            that.price = ele.price;
          }
        }
      });
      that.amount = that.amount - 1;
      if (that.amount < 1) {
        that.amount = 1;
      }
      let canBuyName = that.promotion_num - that.has_buy;
      let carNum = 0;
      that.cartList.forEach(function (ele) {
        if (ele.spcifi_id == that.spcifi_id && ele.goods_id == that.goods_id) {
          carNum = ele.number;
        }
      });
      if (that.amount + carNum <= canBuyName && that.has_buy != -1) {
        if (that.spcifi_id == 0) {
          that.decPrice = that.decSavePrce;
        } else {
          that.checkItem();
        }
      }
    },
    checkItem() {
      var self = this;
      var option = self.simulatedDATA.specifications;
      var result = []; //定义数组储存被选中的值
      for (var i in option) {
        result[i] = self.selectArr[i] ? self.selectArr[i] : "";
      }
      for (var i in option) {
        var last = result[i]; //把选中的值存放到字符串last去
        for (var k in option[i].item) {
          result[i] = option[i].item[k].name; //赋值，存在直接覆盖，不存在往里面添加name值
          option[i].item[k].isShow = self.isMay(result); //在数据里面添加字段isShow来判断是否可以选择
        }
        result[i] = last; //还原，目的是记录点下去那个值，避免下一次执行循环时被覆盖
      }
      if (this.shopItemInfo[result]) {
        this.price = this.shopItemInfo[result].retail_price;
        this.decPrice = this.shopItemInfo[result].promotion_price;
        this.discountPrice = this.shopItemInfo[result].discount_price;
        if (this.shopItemInfo[result].has_step_price == 1) {
          this.hasStep = true;
          let list = this.shopItemInfo[result].step_price_arr;
          this.stepList = this.shopItemInfo[result].step_price_arr;
          var arr = [];
          if (this.brandFold) {
            if (list.length > 3) {
              for (var i = 0; i < 3; i++) {
                arr.push(list[i]);
              }
              this.priceStepList = arr;
            } else {
              this.priceStepList = list;
            }
          } else {
            this.priceStepList = list;
          }
        } else {
          this.priceStepList = [];
          this.stepList = [];
        }
        this.spcifi_id = this.shopItemInfo[result].spcifi_id;
        // this.storage = this.shopItemInfo[result].storage || ''
        this.storage = this.shopItemInfo[result].storage;
        this.showImg = this.shopItemInfo[result].pic;
        this.promotion_num = this.shopItemInfo[result].promotion_num;
        this.has_buy = this.shopItemInfo[result].has_buy;
      }
      self.$forceUpdate(); //重绘
    },
    isMay(result) {
      for (var i in result) {
        if (result[i] == "") {
          return true; //如果数组里有为空的值，那直接返回true
        }
      }
      if (this.shopItemInfo[result]) {
        return this.shopItemInfo[result].storage == 0 ? false : true; //匹配选中的数据的库存，若不为空返回true反之返回false
      } else {
        return false;
      }
    },
    specificationBtn(item, n, event, index) {
      var self = this;
      self.amount = 1; // 重置数量
      if (self.selectArr[n] != item) {
        self.selectArr[n] = item;
        self.subIndex[n] = index;
      } else {
        self.selectArr[n] = "";
        self.subIndex[n] = -1; //去掉选中的颜色
      }
      self.checkItem();
    },
    getDetails() {
      let that = this;
      this.$api
        .shop_goodsdetail({
          goods_id: this.$route.query.id,
        })
        .then((res) => {
          this.isWait = false;
          if (res.errno === 0) {
            //返回数据
            that.info = res.data.info;
            let thumb = res.data.info.thumb;
            that.thumbImg = thumb
              ? thumb
              : "http://sy.xfd365.com/public/uploads/exp.jpg";
            that.videoUrl = res.data.info.video_url;
            that.qrcode = res.data.qrcode;
            res.data.attribute.forEach((ele) => {
              var item = {};
              item.src = ele.pic;
              that.picList.push(item);
              if (ele.difference.charAt(ele.difference.length - 1) == ",") {
                // 一个属性最后两个逗号，两个属性最后一个逗号，三个属性最后没有逗号
                ele.difference = ele.difference.substr(
                  0,
                  ele.difference.length - 1
                );
                if (ele.difference.charAt(ele.difference.length - 1) == ",") {
                  ele.difference = ele.difference.substr(
                    0,
                    ele.difference.length - 1
                  );
                }
              }
            });
            res.data.spcifi.forEach((ele) => {
              if (ele != "") {
                that.simulatedDATA.specifications.push(ele);
              }
            });
            that.simulatedDATA.difference = res.data.attribute;
            that.spcifiList = res.data.spcifi;
            // that.simulatedDATA.specifications = res.data.data.spcifi
            that.showImg = res.data.info.thumb;
            that.price = res.data.info.retail_price;
            that.decPrice = res.data.info.promotion_price;
            that.decSavePrce = res.data.info.promotion_price;
            that.promotion_num = res.data.info.promotion_num;
            that.storage = res.data.info.storage;
            that.has_buy = res.data.info.has_buy;

            let dataPromotion = localStorage.getItem("dataPromotion");
            if (dataPromotion) {
              dataPromotion = JSON.parse(dataPromotion);
              // console.log(dataPromotion.spcifi_name)
              if (dataPromotion.spcifi_name) {
                let array1 = [];
                let array2 = [];
                let array3 = [];
                if (that.simulatedDATA.specifications.length == 1) {
                  that.simulatedDATA.specifications[0].item.forEach((ele) => {
                    array1.push(ele.name);
                  });
                  // that.selectArr = dataPromotion.spcifi_name.substr(0, dataPromotion.spcifi_name.length - 2).split(",");
                  that.selectArr = dataPromotion.spcifi_name.split(",");
                }
                if (that.simulatedDATA.specifications.length == 2) {
                  that.simulatedDATA.specifications[0].item.forEach((ele) => {
                    array1.push(ele.name);
                  });
                  that.simulatedDATA.specifications[1].item.forEach((ele) => {
                    array2.push(ele.name);
                  });
                  // that.selectArr = dataPromotion.spcifi_name.substr(0, dataPromotion.spcifi_name.length - 1).split(",");
                  that.selectArr = dataPromotion.spcifi_name.split(",");
                }
                if (that.simulatedDATA.specifications.length == 3) {
                  that.simulatedDATA.specifications[0].item.forEach((ele) => {
                    array1.push(ele.name);
                  });
                  that.simulatedDATA.specifications[1].item.forEach((ele) => {
                    array2.push(ele.name);
                  });
                  that.simulatedDATA.specifications[2].item.forEach((ele) => {
                    array3.push(ele.name);
                  });
                  // that.selectArr = dataPromotion.spcifi_name.substr(0, dataPromotion.spcifi_name.length).split(",");
                  that.selectArr = dataPromotion.spcifi_name.split(",");
                }

                if (that.selectArr.length == 1) {
                  that.subIndex = [array1.indexOf(that.selectArr[0]), 0, 0];
                } else if (that.selectArr.length == 2) {
                  that.subIndex = [
                    array1.indexOf(that.selectArr[0]),
                    array2.indexOf(that.selectArr[1]),
                    0,
                  ];
                } else {
                  that.subIndex = [
                    array1.indexOf(that.selectArr[0]),
                    array2.indexOf(that.selectArr[1]),
                    array3.indexOf(that.selectArr[2]),
                  ];
                }
                // console.log(that.subIndex)
              }
            } else {
              that.subIndex = [0, 0, 0];
              if (res.data.attribute.length > 0) {
                if (res.data.attribute[0].threeStylesName) {
                  that.selectArr = [
                    res.data.attribute[0].oneStylesName,
                    res.data.attribute[0].twoStylesName,
                    res.data.attribute[0].threeStylesName,
                  ];
                } else if (
                  res.data.attribute[0].twoStylesName &&
                  !res.data.attribute[0].threeStylesName
                ) {
                  that.selectArr = [
                    res.data.attribute[0].oneStylesName,
                    res.data.attribute[0].twoStylesName,
                  ];
                } else if (!res.data.attribute[0].twoStylesName) {
                  that.selectArr = [res.data.attribute[0].oneStylesName];
                }
              }
            }
            console.log(that.simulatedDATA);

            that.isCollect = res.data.userHasCollect;
            that.salesShow = res.data.salesShow;

            for (var i in that.simulatedDATA.difference) {
              that.shopItemInfo[that.simulatedDATA.difference[i].difference] =
                that.simulatedDATA.difference[i]; //修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
            }
            // console.log(that.simulatedDATA)
            that.checkItem();
            // 判断购物车是否已添加及数量
            let carNum = 0;
            that.cartList.forEach(function (ele) {
              if (
                ele.spcifi_id == that.spcifi_id &&
                ele.goods_id == that.goodId
              ) {
                carNum = ele.number;
              }
            });
            if (carNum >= that.promotion_num - that.has_buy) {
              that.decPrice = "";
            }
          } else if (res.errno == 1) {
            that.$toast(res.data.errmsg);
            setTimeout(function () {
              this.$router.push("/shopIndex");
            }, 2000);
          }
        })
        .catch(() => {
          this.isWait = false;
        });
    },
  },
};
</script>
<style lang="less">
.goodsDetails {
  min-height: 100%;
  background: #f5f5f5;
  .van-nav-bar {
    .van-icon,
    .van-nav-bar__text {
      color: #444;
    }
  }

  .goodspp {
    padding: 10px;
    font-size: 14px;
    .share-poster {
      display: flex;
    }
    .el-icon-share {
      font-size: 14px;
    }
  }

  /* 商品介绍 */
  .choose-spec {
    margin: 0 14px;
    background: #fff;
    border-radius: 10px;
    height: 46px;
    line-height: 46px;
    padding: 0 10px;
    padding-right: 30px;
    align-items: center;
    position: relative;
    overflow: hidden;
    .title {
      color: #888;
      margin-right: 10px;
    }
    .value {
      margin-right: 10px;
    }
    .van-icon-arrow {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      color: #888;
    }
  }

  /* 商品详情 */
  .goods-info {
    margin: 14px;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom:50px;
    > p:first-of-type {
      height: 35px;
      font-size: 14px;
      color: #4b4b4b;
      font-weight: bold;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #fff;
      img {
        width: 15px;
        height: 15px;
        margin: 0 10px;
      }
      img:last-of-type {
        transform: rotate(180deg);
      }
    }
    .goods_content {
      background: #fff;
      padding: 0 14px;
      word-break: break-word;
      font-size: 14px;
      p {
        font-size: 14px;
        video {
          width: 100%;
        }
        video::-webkit-media-controls-mute-button {
          display: none !important;
        }
        video::-internal-media-controls-overflow-button {
          display: none !important;
        }
        video::-webkit-media-controls-current-time-display {
          display: none !important;
        }
        video::-webkit-media-controls-time-remaining-display {
          display: none !important;
        }
        video::-webkit-media-controls-toggle-closed-captions-button {
          display: none !important;
        }
        video::-webkit-media-controls-volume-slider {
          display: none !important;
        }
      }
      img {
        padding: 10px;
        display: block;
        margin: 0 auto;
        max-width: 100%;
      }
    }
  }

  /* 底部 */
  .van-goods-action {
    .van-icon {
      font-weight: bold;
    }

    img {
      width: 18px;
      height: 18px;
    }
    .van-goods-action-button--first {
      margin-left: 20px;
    }
  }

  /* 选择规格弹窗 */
  .choose-spec-popup {
    .van-card {
      background: #fff;
      padding-top: 16px;
      .van-card__header {
        .van-card__thumb {
          width: 90px;
          height: 90px;
        }
        .van-card__content {
          .price {
            font-size: 20px;
            color: #ff2814;
            font-weight: bold;
            height: auto;
            line-height: initial;
          }
          .price-step {
            float: right;
          }
          .line-price {
            font-size: 14px;
            color: #b2b2b2;
            text-decoration: line-through;
          }
          .desc {
            display: flex;
            flex-direction: column;
            font-size: 14px;
            color: #fb4934;
            padding: 10px 0;
            .xian-gou {
              font-size: 14px;
              color: #ff5722;
              font-weight: bold;
            }
          }
        }
      }
      .van-card__thumb {
        img {
          object-fit: contain !important;
        }
      }
    }
    .product-content {
      padding: 8px 16px;
      .product-delcom {
        margin-bottom: 10px;
        p {
          font-size: 14px;
          color: #353535;
        }
        .product-footerlist {
          display: flex;
          flex-wrap: wrap;
          li {
            border-radius: 4px;
            color: #333;
            text-align: center;
            padding: 5px 10px;
            margin-top: 10px;
            margin-right: 20px;
            cursor: pointer;
            background: #f9f9f9;
            font-size: 14px;
          }
          li.productActive {
            background-color: #1a1a29;
            color: #fff;
          }
          li.noneActive {
            background-color: #ccc;
            opacity: 0.4;
            color: #000;
            pointer-events: none;
          }
        }
      }
    }
    .spec-no {
      padding: 16px;
      display: flex;
      align-items: center;
      .title {
        font-size: 20px;
        margin-right: 5px;
      }
      .value {
        font-size: 15px;
        color: #999;
      }
    }
    .pay-num-con {
      display: flex;
      padding: 8px 16px;
      align-items: center;
      justify-content: space-between;
      span {
        flex: 1;
      }
      .step-con {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .footer-btn {
      position: fixed;
      bottom: 16px;
      left: 0;
      width: calc(100% - 32px);
      height: 40px;
      padding: 0 16px;
      .btn {
        width: 100%;
        height: 100%;
        color: #fff;
        background: linear-gradient(#66d5fb, #03befe);
        border-radius: 1000px;
        font-size: 14px;
        line-height: 40px;
        text-align: center;
      }
    }
  }
}
</style>