<template>
  <div class="creditIndex">
    <van-nav-bar title="信用评分" left-arrow fixed @click-left="returnLast('/')" :class="isScroll ? 'nav' : 'van-nav-bar' " />
    <div class="loading_box" v-if="isLoading">
      <van-loading size="24px" color="#c9c9c9" vertical>评估中...</van-loading>
    </div>
    <div v-else class="center">
      <div class="center_box">
        <!-- <div v-if="!isUnreviewed" class="text"></div> -->
        <div v-if="isUnreviewed || isFirst" class="text1">
          <img v-if="!isResult" src="../../images/credit/fen.png" alt="" class="fen">
          <p v-if="!isResult" class="credit_fen">
            {{mycredit}}
            <span class="credit_str">{{mycredit_str}}</span>
          </p>
          <p v-else class="credit_fen1"> 信息提交成功，<br />将在1 ~ 3个工作日反馈结果</p>
        </div>
      </div>
      <div style="background: #fff;">
        <div v-if="isResult" class="ceping1" @click="clickAgain">
          <img v-if="!isUnreviewed && isFirst" src="../../images/credit/cp-btn3.png" alt="">
          <img v-else src="../../images/credit/cp-btn2.png" alt="">
        </div>
        <div v-else class="ceping1" @click="returnLast('/userCepings')">
          <img v-if="!isUnreviewed && isFirst" src="../../images/credit/cp-btn3.png" alt="">
          <img v-else src="../../images/credit/cp-btn2.png" alt="">
        </div>
        <div class="cp_text">测评据中国人民银行权威数据标准制定<br /> 具有认可性和有效性</div>
      </div>
      <div class="cp_bottom">
        <div class="you_can">
          <div class="yc_title"></div>
          <div class="border"></div>
        </div>
        <div class="tuanti" @click="insideMark">
          <img src="../../images/credit/cp-tuanti1.png" alt="" class="leftImg">
          <img src="../../images/credit/cp-tuanti2.png" alt="" class="centerImg">
          <img src="../../images/credit/cp-tuanti3.png" alt="" class="rightImg">
          <img src="../../images/light3.png" alt="" class="right-top">
        </div>
        <div class="tuanti ziping" @click="returnLast('/scoringRecord')">
          <img src="../../images/credit/cp-ziping1.png" alt="" class="leftImg">
          <img src="../../images/credit/cp-ziping2.png" alt="" class="centerImg">
          <img src="../../images/credit/cp-ziping3.png" alt="" class="rightImg">
          <img src="../../images/light3.png" alt="" class="right-top">
        </div>
      </div>
      <div style="height: 20px;background-color: #F0F6FC;"></div>
    </div>
    <van-popup v-model="ifTipJie" class="tipCont">
      <img src="../../images/credit/cp-tip.png" class="IMg" />
      <img src="../../images/credit/tanhao.png" alt="" class="tan">
      <p class="tipTitle" v-html="tipTitle"></p>
      <div class="btnCont">
        <p class="btn cancel" @click="ifTipJie = false">我知道了</p>
      </div>

      <img src="../../images/close.png" @click="ifHasReal = false" class="closeIMg" />
    </van-popup>
    <van-popup class="picker-con" v-model="showGender" position="bottom" round>
      <div class="title">
        <p>选择您要评分的组织</p>
        <p class="text"></p>
      </div>
      <div class="picker_content">
        <van-grid :gutter="10" :column-num="2">
          <van-grid-item v-for="(item, index) in propContent" :key="index" @click="selectCity(index, item.title)"
            :class="index == idx ? 'spanact' : ''" :text="item.title" />
        </van-grid>

      </div>
      <van-button class="btns" @click="getPeople()">确定</van-button>
    </van-popup>

  </div>

</template>

<script>
  export default {
    name: "creditIndex",
    data() {
      return {
        isUnreviewed: false,
        mycredit: '',
        mycredit_str: '',
        ifTipJie: false,
        isGroup: '',
        tipTitle: '',
        isLoading: false,
        isFirst: false,
        isResult: false,
        scroll: '',
        isScroll: false,
        showGender: false,
        propContent: [{
          title: '合作(联)社'
        }, {
          title: '群众团体'
        }],
        idx: 12,
        title: '',
      };
    },
    created() {
      let isRefresh = this.$route.query.isRefresh; // 1不刷新 2或者undefined刷新
      console.log(isRefresh);
      if (isRefresh != 1) {
        this.isLoading = true;
      }
      this.getmycredit()
    },
    mounted() {
      window.addEventListener('scroll', this.handleScroll)
      window.leftBack = this.leftBack
    },
    methods: {
        leftBack() {
        this.returnLast('/')
      },
      returnLast(path){
         this.$router.push({
          path: path,
          query: {
            lastPath: "/creditScore",
          }
        });
      },
      handleScroll() {
        this.scroll = document.documentElement.scrollTop || document.body.scrollTop
        if (this.scroll > 50) {
          this.isScroll = true;
        } else {
          this.isScroll = false;
        }
      },
    
      selectCity(index, title) {
        this.title = title;
        this.idx = index;
      },
      getPeople() {
        console.log(this.title);
        console.log(this.idx);
        let type = this.idx + 1;
        if (type == 2) {
          this.$api.user_as_member_team_lists({}).then(res => {
            if (res.errno == 0) {
              if (res.data.length == 0) {
                this.showGender = false;
                this.tipTitle = '未加入合作社组织或团体<br /> 不能进行团体人员打分';
                this.ifTipJie = true;

                return
              } else {
                this.$router.push({
                  path: '/eachOthers',
                  query: {
                    is_group: type,
                    lastPath: "/creditScore",
                  }
                });
              }
            }
          })
        } else {
          this.$router.push({
            path: '/eachOthers',
            query: {
              is_group: type,
              lastPath: "/creditScore",
            }
          });
        }

      },
      insideMark() {
        let that = this;
        that.showGender = true;
        },
      getTeamLists() {
        let that = this;
        that.$api.teamLists({
          type: that.isGroup
        }).then(res => {
          if (res.errno == 0) {
            if (res.data.length > 0) {
              that.$router.push({
                path: '/eachOthers',
                query: {
                  is_group: that.isGroup,
                  lastPath: "/creditScore",
                }
              });
            } else {
              that.tipTitle = '没有可评分成员';
              that.ifTipJie = true;
            }
          } else {
            that.tipTitle = res.errmsg;
            that.ifTipJie = true;
          }
        }).catch(err => {

        })
      },
      // 查看分数
      getmycredit() {
        let that = this;
        that.$api.mycredit({}).then(res => {
          setTimeout(() => {
            that.isLoading = false;
          }, 1000)
          if (res.errno == 0) {
            if (res.data.arr == 600) {
              that.mycredit = res.data.arr;
              that.mycredit_str = res.data.str;
              that.isFirst = true;
            } else {
              that.mycredit = res.data.arr;
              that.mycredit_str = res.data.str;
              that.isUnreviewed = true;
            }
          } else if (res.errno == 1) {
            that.isUnreviewed = true;
            that.isResult = true;
          } else {
            that.$toast(res.errmsg)
          }
        }).catch(err => {})
      },
      clickAgain() {
        this.$toast('您的信息已提交，无需重复提交')
      }
    },
    //销毁,否则跳到别的路由还是会出现
    destroyed() {
      window.removeEventListener('scroll', this.handleScroll)
    }
  }
</script>

<style lang="less">
  .creditIndex {
    min-height: 100%;
    padding-top: 46px;
    background-color: #F0F6FC;
    position: relative;

    .loading_box {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 150px;
      height: 150px;

      >img {
        width: 100%;
        height: 100%;

      }
    }

    .nav {
      background-color: transparent;
      background-size: 0 0 !important;
    }

    .van-nav-bar {
      z-index: 10;
      background: url(../../images/credit/bg.png) no-repeat top center;
      background-size: 100% 227px;

      .van-icon {
        color: #222222;

      }

      .van-nav-bar__title {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .van-hairline--bottom::after {
      border-bottom-width: 0
    }

    .center {
      height: 300px;
      position: relative;

      .center_box {
        height: 100%;
        margin: auto;
        text-align: center;
        background-image: url(../../images/credit/bg.png);
        background-size: 100% 100%;

        .sizeQuery {
          width: 100%;
          height: 100%;
        }

        .text {
          position: absolute;
          width: 260px;
          height: 90%;
          background-image: url(../../images/credit/cp-xyy.png);
          background-size: 100% 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: #fff;
        }

        .text1 {
          position: absolute;
          width: 270px;
          height: 100%;
          background-image: url(../../images/credit/cp-xyy1.png);
          background-size: 100% 100%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;

          .fen {
            position: absolute;
            width: 14px;
            height: 10px;
            top: 80px;
            right: 80px;
          }

          .credit_fen {
            position: absolute;
            top: 29%;
            right: 35%;
            font-size: 45px;
            font-weight: 700;
            color: #fff;

            .credit_str {
              display: block;
              font-size: 14px;
              margin-top: 4px;
              font-weight: 400;
            }
          }

          .credit_fen1 {
            width: 61%;
            position: absolute;
            top: 33%;
            right: 18%;
            font-size: 13px;
            font-weight: 700;
            color: #fff;
            line-height: 20px;
          }
        }



      }

      .ceping1 {
        width: 240px;
        height: 55px;
        margin: 0 auto;

        img {
          width: 100%;
          height: 100%;
        }
      }

      .ceping2 {
        width: 70%;
        height: 55px;
        margin: 0 auto;
        margin-top: 20px;
      }

      .cp_text {
        width: 70%;
        margin: 0 auto;
        margin-top: 15px;
        padding-bottom: 20px;
        line-height: 18px;
        text-align: center;
        font-family: Microsoft YaHei;
        color: #9AA8B6;
        font-size: 12px;
      }

      .cp_bottom {
        padding: 20px 0;
        background: #F0F6FC;

        .you_can {
          .yc_title {
            width: 63px;
            height: 15px;
            margin: 0 auto;
            background-image: url(../../images/credit/cp-yc.png);
            background-size: 100% 100%;
          }

          .border {
            width: 30px;
            height: 4px;
            margin: 0 auto;
            margin-top: 13px;
            border-radius: 2px;
            background-color: #3B6AF1;
          }
        }

        .tuanti {
          width: calc(86%);
          position: relative;
          background: #FFE2DC;
          height: 85px;
          margin: 0 auto;
          margin-top: 20px;
          border-radius: 10px;

          .leftImg {
            position: absolute;
            left: 5px;
            top: 18px;
            height: 58px;
          }

          .centerImg {
            height: 36px;
            position: absolute;
            left: 90px;
            top: 26px;
          }

          .rightImg {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 18px;
          }

          .right-top {
            position: absolute;
            height: 50px;
            right: 0;
            top: 0;
          }
        }

        .ziping {
          background: #C7F9E9;
        }
      }



    }

    .tipCont {
      width: calc(100% - 50px);
      max-width: 510px;
      border-radius: 10px;
      background-size: 100% auto;
      text-align: center;
      font-size: 15px;
      color: #444444;
      overflow-y: visible;

      .IMg {
        width: 100%;
      }

      .tan {

        position: absolute;
        right: 45px;
        top: -20px;
        width: 50px;
        height: 50px;
      }

      .tipTitle {
        background: #FFFFFF;
        padding: 20px 0;
        line-height: 20px;
      }

      .btnCont {
        display: flex;
        justify-content: space-around;
        background: #FFFFFF;
        padding: 10px 0 20px 0;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;

        .btn {
          border-radius: 30px;
          line-height: 34px;
          width: calc(50% - 20px);

          &.cancel {
            color: #fff;
            background: #3B6AF1;
          }

          &.sure {
            color: #FFFFFF;
            background: #3B6AF1;
          }
        }
      }

      .closeIMg {
        position: relative;
        bottom: -50px;
        width: 20px;
      }
    }

    .picker-con {

      padding: 25px 15px 0 15px;
      box-sizing: border-box;

      .van-popup--bottom {
        height: 80%;
      }

      .van-tabs--line {
        padding: 10px;
      }

      .title {
        text-align: center;
        font-size: 16px;
        font-weight: 900;
        margin: 0 0 10px 0;

        .text {
          width: 30px;
          height: 3px;
          background-color: #3B6AF1;
          border-radius: 2px;
          margin: 10px auto 0;
        }
      }


      .picker_content {
        margin-top: 25px;
        margin-bottom: 100px;

        .spanact {
          .van-grid-item__content {
            border-radius: 18px;
            background-color: #E2F4FF;
            border: 1px solid #3B6AF1;

            >span {
              color: #3B6AF1 !important;
            }
          }
        }

        .van-grid-item__content--surround::after {
          border-color: transparent;

        }

        .van-grid-item__content {
          border-radius: 18px;
          background-color: #F0F6FC;
          border: 1px solid transparent;
          padding: 6px 3px;

          >span {
            color: #9AA8B6 !important;
            font-size: 14px;
          }


        }
      }


      .btns {
        position: fixed;
        left: 50%;
        bottom: 10px;
        transform: translate(-50%);
        width: 80%;
        height: 40px;
        margin: 0 auto;
        border-radius: 18px;
        color: #fff;
        background: #3B6AF1;
      }

    }

    // 选择
    .selSheet {
      .van-action-sheet__header {
        font-size: 15px;
        font-weight: bold;
        position: relative;
        margin-bottom: 10px;

        &::after {
          content: '';
          position: absolute;
          height: 3px;
          width: 30px;
          background: #3B6AF1;
          border-radius: 2px;
          bottom: 6px;
          left: calc(50% - 15px);
        }
      }

      .van-cell__title {
        >span {
          display: inline-block;
          width: 94%;
        }
      }

      .active {
        .van-cell__title {
          color: #3B6AF1;

        }
      }

      .van-tag--primary {
        background: #3B6AF1;
        padding: 2px 6px;
        transform: scale(0.9);
      }

      .img-icon {
        height: 20px;
      }

      .van-button--info {
        margin: 15px;
        width: calc(100% - 30px);
        height: 38px;
        background: #3B6AF1;
        border: 1px solid #3B6AF1;
      }

      .isLoadClass {
        padding: 10px 0;
        text-align: center;
      }

      .sheetNull {
        margin: 20px 0;
        color: #666666;
        text-align: center;
      }

      .content {
        padding: 20px 0;
        display: flex;
        justify-content: space-around;

        .item {
          text-align: center;

          img {
            width: 70px;
          }

          p {
            margin-top: 10px;
            font-size: 15px;
          }
        }
      }
    }

  }
</style>