<template>
  <div class="eachothers">
    <van-nav-bar title="组织团体互评" left-arrow fixed @click-left="returnLast()" />
    <div class="top_title">
      <p>您正在评价<span>“团体成员”</span>请认真选择以下信息</p>
      <img src="../../images/credit/top_title.png" alt="" class="title_img">
    </div>
    <props :propContent="teamList" :xjdi.sync="team" :indexs.sync="teamindex" :label="teamlabel" :peopleId.sync="teamid"
      type="long" iconUrl="zuzhi">
    </props>
    <van-field v-model="team" label="被评人所在组织" :placeholder="groupStr" input-align="right" readonly>
      <template #left-icon>
        <img src="../../images/credit/zuzhi1.png" alt="" width="15">
      </template>
    </van-field>
    <props :propContent="bypeopleList" :xjdi.sync="bypeople" :indexs.sync="bypeopleindex" :peopleId.sync="bypeopleId"
      :label="bypeoplelabel" type="short" :iconUrl="icon">
    </props>
    <van-field v-model="relation" label="与被评人的关系" placeholder="请输入" input-align="right">
      <template #left-icon>
        <img src="../../images/credit/guanxi.png" alt="" width="15">
      </template>
    </van-field>
    <van-cell center>
      <template #title>
        <img src="../../images/credit/niming.png" alt="" width="15">
        <span class="custom-title">是否匿名评价</span>
      </template>
      <template #right-icon>
        <van-switch v-model="checked" size="24" />
      </template>
    </van-cell>
    <van-button class="dafen" type="info" @click="addCredit">开始评分
      <template #icon>
        <img src="../../images/credit/pfStart.png" alt="" width="15">
      </template>
    </van-button>

       <van-popup v-model="ifTipJie" class="tipCont">
      <img src="../../images/credit/cp-tip.png" class="IMg" />
      <img src="../../images/credit/tanhao.png" alt="" class="tan">
      <p class="tipTitle" v-html="tipTitle"></p>
      <div class="btnCont">
        <p class="btn cancel" @click="ifTipJie = false">我知道了</p>
      </div>

      <img src="../../images/close.png" @click="ifHasReal = false" class="closeIMg" />
    </van-popup>
  </div>
</template>
<script>
  import props from "@/pages/credit/props";
  export default {
    name: "eachothers",
    components: {
      props
    },

    data() {
      return {
        checked: true,
        bygradelabel: '被评人所在的组织',
        bygrade: '',
        bygradeindex: 0,
        bypeopleList: [],
        bypeoplelabel: '被评人姓名',
        bypeople: '',
        bypeopleindex: 0,
        bypeopleId: 0,
        relationlabel: '您和被评人的关系',
        relation: '',
        relationindex: 0,
        isGroup: 0,
        groupStr: '',
        teamList: [],
        teamlabel: '您所在组织',
        team: '',
        teamindex: 0,
        teamid: 0,
        is_n: 0,
        userID: '',
        teamId: '',
        icon: 'bpren',
        isRefresh: 1,
        lastPath: '',
        isTZ: false,
         ifTipJie: false,
          tipTitle: '',
      };
    },
    mounted() {
      let is_group = this.$route.query.is_group
      let lastPath = this.$route.query.lastPath;
      if (lastPath) {
        this.lastPath = lastPath;
      }
      if (is_group == 1) {
        this.isGroup = 1;
        this.getHzList()
      } else if (is_group == 2) {
        this.isGroup = 2;
        this.getTtList()
      }
      window.leftBack = this.leftBack
    },
    created() {
      this.getInfo()
    },
    watch: {
      teamid: {
        handler: function () {
          if (this.teamid != '') {
            this.bypeople = '';
            this.getTeamLists()
          }
        },
      },
    },

    methods: {
      leftBack() {
        this.returnLast()
      },
      returnLast(){
         this.$router.push({
          path: this.lastPath,
          query: {
            isRefresh: this.isRefresh
          }
        })
      },
      addCredit() {
        let that = this;
        if(that.team == ""){
           that.$toast('请选择您所在组织');
           return
        }else if (that.bypeople == "") {
          that.$toast('请选择被评人姓名');
          return
        } else if (that.relation == "") {
          that.$toast('请输入您和被评人的关系');
          return
        }
        if (that.checked) {
          that.is_n = 2;
        } else {
          that.is_n = 1;
        }
        that.$api.addCredit({
          type: that.isGroup,
          is_n: that.is_n,
          b_user_id: that.bypeopleId,
          relation: that.relation,
          id: that.userID
        }).then(res => {
          if (res.errno == 0) {
            localStorage.setItem('id', res.data)
            that.$router.push({
              path: '/eachFlows',
              query: {
                lastPath: "/eachOthers",
              }
            });
          } else {
            that.$toast(res.errmsg)
          }
        }).catch(err => {

        })
      },
      getTeamLists() {
        let that = this;
        that.bypeopleList = [];
        that.$api.teamLists({
          type: that.isGroup,
          coopera_id: this.teamid
        }).then(res => {
          if (res.errno == 0) {
           if(res.data.length > 0){
              res.data.forEach(item => {
              this.userID = item.id;
              var items = {};
              items.title = item.name;
              items.id = item.user_id;
              that.bypeopleList.push(items)
            });
           }else {
                that.tipTitle = '当前所选合作社，没有可评分成员';
                that.ifTipJie = true;
              }
          } else {
            that.$toast(res.errmsg)
          }
        }).catch(err => {

        })
      },
      getInfo() {
        let that = this;
        that.$api.user_role({}).then(res => {
          // "if_qz": 0,//是否为群众：0否，1是（没有其他三种任何身份）
          // "coopera_role": 0,//合作社身份：0社员1管理员账号2区域管理3联社社长4社长5员工10没有合作社
          // "if_tz": 1,//是否为团长：0否，1是
          // "if_ty": 0,//是否为团员：0否，1是
          // console.log(res);
          if (res.errno == 0) {
            console.log(res);
            if (res.if_tz == 1 || res.if_ty == 1) { //团长
              that.isTZ = true;
            }
          }
        })
      },
      getHzList() {
        let that = this;
        that.teamList = [];
        that.$api.user_coopera_lists({}).then(res => {
          if (res.errno == 0) {
              if(res.data.length > 0){
                   res.data.forEach(item => {
                  var items = {};
                  items.title = item.coopera_name,
                    items.id = item.coopera_id;
                  that.teamList.push(items)
                })
              }
          }
        })
      },
      getTtList() {
        let that = this;
        that.$api.user_as_member_team_lists({}).then(res => {
          if (res.errno == 0) {
            if (this.isGroup == 2) {
              res.data.forEach(item => {
                var items = {};
                items.title = item.team_name,
                  items.id = item.team_id;
                this.teamList.push(items)
              })
            }
          }
        })
      },
    },
  }
</script>

<style lang="less">
  .eachothers {
    padding-top: 46px;

    .van-nav-bar {
      background: #F0F6FC;

      .van-icon {
        color: #222222;

      }

      .van-nav-bar__title {
        font-size: 16px;
        font-weight: bold;
      }

    }

    .top_title {
      display: flex;
      height: 37px;
      font-size: 13px;
      background: #F0F6FC;

      >p {
        flex: 1;
        padding: 0 0 0 15px;
        margin-top: 10px;

        >span {
          color: #3B6AF1;
        }
      }

      .title_img {
        float: right;
        height: 100%;
        margin-right: 15px;
      }
    }

    .van-cell::after {
      border: 0;
    }

    .van-field__control--right {
      color: #9AA8B6;
    }

    .dafen {
      position: absolute;
      bottom: 0;
      width: 100%;
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
  }
</style>