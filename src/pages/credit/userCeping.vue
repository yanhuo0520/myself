<template>
  <div class="userCepings" :style='{height: deviceHeight + "px"}'>
    <img src="../../images/xiexianBg.png" class="bgxiexian" />
    <img v-if="active==0" :src="MtitleImg" class="main-title" />
    <img v-else-if="active==1" :src="WorkImg" class="main-title" />
    <img v-else-if="active==2" :src="zichanImg" class="main-title" />
    <img v-else-if="active==3" :src="fuzhaiImg" class="main-title" />
    <van-grid class="grid" :column-num="4" :border="false">
      <van-grid-item v-for="(item, index) in grid" :key="index" @click="$router.push(item.path)">
        <img :src="item.icon" alt="" />
        <p>{{ item.name }}</p>
      </van-grid-item>
    </van-grid>
    <div class="itemCont" v-if="active == 0">
      <!-- 年龄 -->
      <van-field v-model="age" label="年龄（周岁）" placeholder="请输入" input-align="right">
        <template #left-icon>
          <img src="../../images/credit/age.png" alt="" width="15">
        </template>
      </van-field>
      <!-- <props :propContent="ageList" :xjdi.sync="age" :indexs.sync="ageindex" :label="agelabel" type="short"
        iconUrl="age" /> -->
      <!-- 婚姻状况 -->
      <props :propContent="marriageList" :xjdi.sync="marriage" :indexs.sync="marrindex" :label="marrlabel" type="short"
        iconUrl="hunyin" />
      <!-- 户籍 -->
      <props :propContent="hujiList" :xjdi.sync="huji" :indexs.sync="hujiindex" :label="hujilabel" type="short"
        iconUrl="huji" />
      <!-- 学历 -->
      <props :propContent="xueliList" :xjdi.sync="xueli" :indexs.sync="xueliindex" :label="xuelilabel" type="short"
        iconUrl="xueli" />
      <!-- 现居住地 -->
      <props :propContent="xjdiList" :xjdi.sync="xjdi" :indexs.sync="xjdiindex" :label="xjdilabel" type="short"
        iconUrl="xjdi" />
      <div class="go_next">
        <van-button class="go_next_btn" type="info" @click="nextStep">下一步
        </van-button>
      </div>
      <p class="go_back" @click="goBack">不想测了,返回信用评分</p>
    </div>
    <div class="itemCont" v-else-if="active == 1">
      <!-- 工作单位 -->
      <props :propContent="jobList" :xjdi.sync="job" :indexs.sync="jobindex" :label="joblabel" type="long"
        iconUrl="worklx" />
      <!-- 职级 -->
      <props :propContent="zhijiList" :xjdi.sync="zhiji" :indexs.sync="zhijiindex" :label="zhijilabel" type="short"
        iconUrl="zhiji" />
      <!-- 职称 -->
      <props :propContent="zhichengList" :xjdi.sync="zhicheng" :indexs.sync="zhichengindex" :label="zhichenglabel"
        type="short" iconUrl="zhicheng" />
      <!-- 现单位工作时间 -->
      <props :propContent="workingList" :xjdi.sync="working" :indexs.sync="workingindex" :label="workinglabel"
        type="long" iconUrl="worktime" />
      <div class="go_next">
        <van-button class="go_next_btn" type="info" @click="nextTwo">下一步</van-button>
      </div>
      <p class="go_back" @click="goBack(1)">返回上一步</p>
    </div>
    <div class="itemCont" v-else-if="active == 2">
      <!-- 房产信息 -->
      <props :propContent="houseList" :xjdi.sync="house" :indexs.sync="houseindex" :label="houselabel" type="short"
        iconUrl="house" />
      <!-- 存款 -->
      <props :propContent="depoistList" :xjdi.sync="depoist" :indexs.sync="depoistindex" :label="depoistlabel"
        type="short" iconUrl="cunkuan" />
      <!-- 保险信息 -->
      <props :propContent="insuranceList" :xjdi.sync="insurance" :indexs.sync="insuranceindex" :label="insurancelabel"
        type="long" iconUrl="baoxian" />
      <div class="go_next">
        <van-button class="go_next_btn" type="info" @click="nextThree">下一步
        </van-button>
      </div>
      <p class="go_back" @click="goBack(2)">返回上一步</p>
    </div>
    <div class="itemCont" v-else-if="active == 3">
      <!-- 负债比 -->
      <props :propContent="liabilitiesList" :xjdi.sync="liabilities" :indexs.sync="liabilitiesindex"
        :label="liabilitieslabel" type="short" iconUrl="fzb"></props>
      <!-- 家庭年收入 -->
      <props :propContent="incomeList" :xjdi.sync="income" :indexs.sync="incomeindex" :label="incomelabel" type="short"
        iconUrl="nsr"></props>
      <div class="go_next">
        <van-button class="go_next_btn" type="info" @click="nextFour">立即提交
        </van-button>
      </div>
      <p class="go_back" @click="goBack(3)">返回上一步</p>
    </div>

    <van-popup v-model="ifTipJie" class="tipCont2">
      <img src="../../images/jietip.png" class="IMg" />
      <p class="tipTitle">我们将在1-3个工作日<br /> 反馈结果,请您耐心等待!</p>
      <p class="btn" @click="goIndex">确定</p>
    </van-popup>
  </div>
</template>

<script>
  import props from "@/pages/credit/props";
  export default {
    name: "userCepings",
    components: {
      props
    },
    data() {
      return {
        ifTipJie: false,
        tipTitle: '',
        deviceHeight: document.body.clientHeight,
        MtitleImg: require("../../images/credit/cp-jbxx.png"),
        WorkImg: require("../../images/credit/cp-gzxx.png"),
        zichanImg: require("../../images/credit/cp-zcxx.png"),
        fuzhaiImg: require("../../images/credit/cp-fubl.png"),
        grid: [{
            name: "基本信息",
            icon: require("../../images/credit/jbxx.png"),
          },
          {
            name: "工作信息",
            icon: require("../../images/credit/work.png"),
          },
          {
            name: "资产信息",
            icon: require("../../images/credit/zichan.png"),
          },
          {
            name: "负债比例",
            icon: require("../../images/credit/fuzhai.png"),
          }
        ],
        active: 0,
        // 第一部分 基础信息
        ageList: [{
          title: '18-24'
        }, {
          title: '25-29'
        }, {
          title: '30-44'
        }, {
          title: '45-54'
        }, {
          title: '55-59'
        }, {
          title: '60以上'
        }],
        agelabel: '年龄 (周岁)',
        age: '',
        ageindex: 0,

        marrlabel: '婚姻状态',
        marriage: '',
        marrindex: 0,
        marriageList: [{
          title: '未婚'
        }, {
          title: '已婚'
        }, {
          title: '已婚有子女'
        }, {
          title: '已婚无子女'
        }, {
          title: '离异有子女'
        }, {
          title: '离异无子女'
        }],
        xueliList: [{
          title: '研究生及以上'
        }, {
          title: '本科'
        }, {
          title: '大专'
        }, {
          title: '高中及中专'
        }, {
          title: '其他'
        }],
        xuelilabel: '学历',
        xueli: '',
        xueliindex: 0,
        hujiList: [{
          title: '本地户籍'
        }, {
          title: '外地户籍'
        }],
        hujilabel: '户籍',
        huji: '',
        hujiindex: 0,
        xjdiList: [{
          title: '1年以内'
        }, {
          title: '1-3年'
        }, {
          title: '3-5年'
        }, {
          title: '5年以上'
        }],
        xjdilabel: '现居住地居住年限',
        xjdi: '',
        xjdiindex: 0,
        // 第二部分 工作信息
        jobList: [{
          title: '公务员、事业单位、教师、医师、银行、银证从业人员'
        }, {
          title: '国企大型上市企业员工'
        }, {
          title: '公检法系统人员'
        }, {
          title: '一般上市企业、股份制企业、私企'
        }, {
          title: '个体户及个体户从业人员'
        }, {
          title: '自由职业者（无业人员）'
        }],
        joblabel: '职业类型',
        job: '',
        jobindex: 0,
        zhijiList: [{
          title: '高级领导'
        }, {
          title: '中级领导'
        }, {
          title: '普通员工'
        }],
        zhijilabel: '职级',
        zhiji: '',
        zhijiindex: 0,
        zhichengList: [{
          title: '高级职称'
        }, {
          title: '中级职称'
        }, {
          title: '初级职称'
        }],
        zhichenglabel: '职称',
        zhicheng: '',
        zhichengindex: 0,
        workingList: [{
          title: '6个月以内'
        }, {
          title: '6个月-1年'
        }, {
          title: '1-3年'
        }, {
          title: '3-5年'
        }, {
          title: '5年以上'
        }, {
          title: '无单位'
        }],
        workinglabel: '现单位工作时长',
        working: '',
        workingindex: 0,
        // 第二部分 资产信息
        houseList: [{
          title: '自有全款房'
        }, {
          title: '自有按揭房'
        }, {
          title: '自建房'
        }, {
          title: '租房'
        }],
        houselabel: '房产信息',
        house: '',
        houseindex: 0,
        depoistList: [{
          title: '50万以下'
        }, {
          title: '50-100万'
        }, {
          title: '100-200 万'
        }, {
          title: '200万以上'
        }],
        depoistlabel: '资产存款',
        depoist: '',
        depoistindex: 0,
        insuranceList: [{
          title: '购买人寿、医疗、健康、分红、理财保险1年'
        }, {
          title: '购买人寿、医疗、健康、分红、理财保险1-2年'
        }, {
          title: '购买人寿、医疗、健康、分红、理财保险2年以上'
        }, {
          title: '参加五险'
        }, {
          title: '参加五险一金'
        }],
        insurancelabel: '保险信息',
        insurance: '',
        insuranceindex: 0,
        // 第三部分 负债比
        liabilitiesList: [{
          title: '10%以内'
        }, {
          title: '10%-20%'
        }, {
          title: '20%-40%'
        }, {
          title: '40%-60%'
        }, {
          title: '60%-80%'
        }, {
          title: '80%以上'
        }],
        liabilitieslabel: '负债比',
        liabilities: '',
        liabilitiesindex: 0,
        incomeList: [{
          title: '5万元以下'
        }, {
          title: '6-9万'
        }, {
          title: '10-15万'
        }, {
          title: '16-20万'
        }, {
          title: '20-30万'
        }, {
          title: '30万元以上'
        }],
        incomelabel: '家庭年收入',
        income: '',
        incomeindex: 0,
        peopleId: '',
        isRefresh: 1,
        lastPath: '',
      };
    },
    mounted() {
      let lastPath = this.$route.query.lastPath;
      if (lastPath) {
        this.lastPath = lastPath;
      }

      window.leftBack = this.leftBack
    },
    methods: {
     leftBack() {
        this.returnLast()
      },
      returnLast(){
        this.$router.push({
            path:this.lastPath,
            query:{
                isRefresh: this.isRefresh
            }
        })
      },
      goBack(type) {
        if (type == 1) {
          this.active = 0;
        } else if (type == 2) {
          this.active = 1;
        } else if (type == 3) {
          this.active = 2;
        } else {
          this.returnLast()
        }
      },
      // 第一部分
      nextStep() {
        let that = this;
        if (that.age == "") {
          that.$toast('请输入您的年龄')
          return
        } else if (that.marriage == "") {
          that.$toast('请选择婚姻状况')
          return
        } else if (that.huji == "") {
          that.$toast('请选择户籍')
          return
        } else if (that.xueli == "") {
          that.$toast('请选择学历')
          return
        } else if (that.xjdi == "") {
          that.$toast('请选择现居住地址')
          return
        } else {
          that.$api.bankCreditAddOne({
            age: that.age,
            marriage_status: that.marrindex,
            cunsus: that.hujiindex,
            edu: that.xueliindex,
            current: that.xjdiindex,
          }).then(res => {
            if (res.errno == 0) {
              that.peopleId = res.data;
              that.active = 1;
            } else {
              that.$toast(res.errmsg)
            }
          }).catch(err => {})
        }
      },
      // 第二部分
      nextTwo() {
        let that = this;
        if (that.job == "") {
          that.$toast('请选择工作单位')
          return
        } else if (that.zhiji == "") {
          that.$toast('请选择职级')
          return
        } else if (that.zhicheng == "") {
          that.$toast('请选择职称')
          return
        } else if (that.working == "") {
          that.$toast('请选择现单位工作时间')
          return
        } else {
          that.$api.bankCreditAddTwo({
            work: that.jobindex,
            rank: that.zhijiindex,
            profes: that.zhichengindex,
            work_hous: that.workingindex,
            bank_credit_id: that.peopleId,
          }).then(res => {
            if (res.errno == 0) {
              that.active = 2;
            } else {
              that.$toast(res.errmsg)
            }
          }).catch(err => {

          })
        }
      },
      // 第三部分
      nextThree() {
        let that = this;
        if (that.house == "") {
          that.$toast('请选择房产信息')
          return
        } else if (that.depoist == "") {
          that.$toast('请选择资产信息')
          return
        } else if (that.insurance == "") {
          that.$toast('请选择保险信息')
          return
        } else {
          that.$api.bankCreditAddThree({
            house: that.houseindex,
            asset: that.depoistindex,
            insure: that.insuranceindex,
            bank_credit_id: that.peopleId,
          }).then(res => {
            if (res.errno == 0) {
              that.active = 3;
            } else {
              that.$toast(res.errmsg)
            }
          }).catch(err => {})
        }
      },
      // 第四部分
      nextFour() {
        let that = this;
        if (that.liabilities == "") {
          that.$toast('请选择负债比')
          return
        } else if (that.income == "") {
          that.$toast('请选择家庭年收入')
          return
        } else {
          that.$api.bankCreditAddFour({
            debt: that.liabilitiesindex,
            house_income: that.incomeindex,
            bank_credit_id: that.peopleId,
          }).then(res => {
            if (res.errno == 0) {
              that.ifTipJie = true;
            } else {
              that.$toast(res.errmsg)
            }
          }).catch(err => {

          })
        }
      },
      goIndex() {
        this.$router.push({
          path: this.lastPath,
          query: {
            isRefresh: this.isRefresh
          }
        })

      }

    },
  }
</script>

<style lang="less">
  .userCepings {
    background: url(../../images/bgHeader4.png) no-repeat;
    background-size: 100% 300px;

    .bgxiexian {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 135px;
    }

    .main-title {
      margin: 30px 0 0 15px;
      width: 85px;
    }

    .grid {
      width: calc(100% - 20px);
      margin: 15px 10px 0 10px;

      .van-grid-item {
        &:first-child {
          .van-grid-item__content {
            &::before {
              height: 0;
            }
          }
        }

        &:last-child {
          .van-grid-item__content {
            &::after {
              height: 0;
            }
          }
        }
      }

      .van-grid-item__content {
        padding: 0;
        background: transparent;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: calc(50% - 15px);
          height: 30px;
          background: url(../../images/joinIconRight.png) no-repeat left;
          background-size: auto 7px;
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: -1px;
          width: calc(50% - 15px);
          height: 30px;
          background: url(../../images/joinIconLeft.png) no-repeat right;
          background-size: auto 7px;
        }

        img {
          width: 48px;
          height: 48px;
        }

        p {
          margin-top: -5px;
        }
      }
    }

    .itemCont {
      background-color: #fff;
      border-top-right-radius: 20px;
      border-top-left-radius: 20px;
      margin-top: 15px;
      // overflow: hidden;
      padding-top: 20px;

      .van-field__control:read-only {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #9AA8B6;
        font-size: 15px;

      }

      .van-field__control--right {
        color: #969799;
      }

      .go_next {
        width: 80%;
        height: 40px;
        margin: 0 auto;
        margin-top: 70px;

        .go_next_btn {
          width: 100%;
          height: 40px;
          border-radius: 20px;
          background-color: #3B6AF1;
        }

      }

      .go_back {
        text-align: center;
        margin-top: 26px;
        color: #9AA8B6;
        font-size: 15px;
      }
    }

    .van-picker-column__item {
      font-size: 15px;
    }


    .tipCont2 {
      width: calc(100% - 60px);
      max-width: 510px;
      border-radius: 10px;
      background: transparent url(../../images/danTipBg.png) no-repeat center 46px;
      background-size: 100% auto;
      text-align: center;
      font-size: 15px;
      color: #444444;

      .IMg {
        width: 100%;
      }

      .tipTitle {
        background: #FFFFFF;
        padding: 20px 0;
        line-height: 20px;
      }

      .btn {
        margin: 10px 20px 20px 20px;
        border-radius: 40px;
        font-size: 15px;
        line-height: 40px;
        text-align: center;
        background: #3b6af1;
        color: #FFFFFF;
      }
    }

  }
</style>