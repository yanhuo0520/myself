<template>
  <div class="props">
    <van-field v-model="xjdi" type="textarea" :border="false" :label="label" input-align="right" placeholder="请选择"
      rows="1" readonly is-link autosize class="field" @click="showGender = true">
      <template v-if="iconUrl != undefined" #left-icon>
        <img :src="require('../../images/credit/'+iconUrl +'.png')" alt="" width="15" height="15">
      </template>
    </van-field>
    <van-popup class="picker-con" v-if="type == 'short'" v-model="showGender" position="bottom" round >
      <div class="title">
        <p>{{label}}</p>
        <p class="text"></p>
      </div>
      <div class="picker_content"> 
        <van-grid :gutter="10" :column-num="3">
          <van-grid-item  v-for="(item, index) in propContent" :key="index" @click="selectCity(index, item.title,item.id)"  :class="index == idx ? 'spanact' : ''"  :text="item.title" />
        </van-grid>

      </div>
      <van-button class="btns" @click="getPeople()">确定</van-button>
    </van-popup>

    <van-action-sheet v-else v-model="showGender" :title="label" class="selSheet" :closeable="false">
      <template>
        <van-radio-group v-model="radioSel1">
          <van-cell :title="item.title" clickable v-for="(item, index) in propContent" :key="index"
            :class="(radioSel1 == item.title) ? 'active' : ''" @click="selectRadio(index, item.title,item.id)">
            <template #right-icon>
              <van-radio :name="item.title">
                <template #icon="props">
                  <img class="img-icon" :src="props.checked == 1 ? radioActiveIcon : radioIcon" />
                </template>
              </van-radio>
            </template>
          </van-cell>
        </van-radio-group>
      </template>
      <van-button style="margin-top: 20px;" round block type="info" @click="getlong()">确定</van-button>
    </van-action-sheet>
  </div>
</template>

<script>
  export default {
    name: 'props',
    data() {
      return {
        radio: "1",
        showGender: false,
        genderInput: '',
        genderIndex: 0,
        genderId: 0,
        idx: 456,
        title: '',
        tit_id: 0,
        team_id: 0,
        radioIcon: require("../../images/radio.png"),
        radioActiveIcon: require("../../images/radioSel.png"),
        radioSel1: '',
        radioIndex: 789,
        ids: '',
      }
    },
    props: {
      propContent: Array,
      label: String,
      xjdi: String,
      indexs: Number,
      iconUrl: String,
      type: String,
      peopleId: Number,
    },
    created() {
      if (this.type == 'long') {
        this.propContent.forEach(item => {
          item.checked = 1;
        })
      }
      this.genderInput = this.xjdi;
      this.genderIndex = this.indexs;
    },
    methods: {
      getPeople() {
        this.genderIndex = (this.idx + 1);
        this.genderInput = this.title;
        this.genderId = this.tit_id;
        console.log(this.genderIndex);
        console.log(this.genderInput);
        this.$emit("update:indexs", this.genderIndex);
        this.$emit("update:xjdi", this.genderInput);
        if(this.peopleId != undefined){
           this.$emit("update:peopleId", this.genderId);
        }
       
        this.showGender = false;
        this.title = "";
        this.idx = 369;
        this.tit_id = 0;
      },
      selectCity(index, title,tid) {
        this.title = title;
        this.idx = index;
        if(tid != undefined){
          this.tit_id = tid;
        }
      },
      selectRadio(index, title,tid) {
        this.radioIndex = index;
        this.radioSel1 = title;
        if(tid != undefined) {
          this.team_id = tid;
        }
      },
      getlong() {
        this.genderIndex = (this.radioIndex + 1);
        this.genderInput = this.radioSel1;
        this.genderId = this.team_id;
        console.log(this.genderIndex);
        console.log(this.genderInput);
        console.log(this.genderId);
        this.$emit("update:indexs", this.genderIndex);
        this.$emit("update:xjdi", this.genderInput);
        if(this.peopleId != undefined){
        this.$emit("update:peopleId", this.genderId);
         }
        this.showGender = false;
        this.radioSel1 = "";
        this.radioIndex = 789;
        this.team_id = 0;
      }
    }
  }
</script>

<style lang="less">
  .props {
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
            color: #3B6AF1!important;
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
            color: #9AA8B6!important;
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

  .van-field__label {
    width: 39%;
  }
</style>