<template>
  <div class="bottom">
    <van-tabbar
        active-color="#0a79ea"
        inactive-color="#333"
        router
        fixed
    >
        <van-tabbar-item v-for="(item,index) of items" @click="toRouter(item.name, item.push)" :key="index">
            <span :style="{color: index == idx ? '#30B39C' : '#99A1AE'}">{{item.name}}</span>
            <img
                slot="icon"
                :src="index === idx ?item.iconSelect: item.icon"
            >
            <!-- <img
                slot="icon"
                slot-scope="props"
                :src="index === idx ?item.iconSelect: item.icon"
            > -->
        </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "bottom",
  props: ["idx"],
  data() {
    return {
      items: [
        {
          name: "",
          push: "/",
          icon: require("../images/tab/index.png"),
          iconSelect: require("../images/tab/index-h.png")
        },
        {
          name: "合作经济",
          push: "/",
          // push: "/hezuoIndexMass", // 群众
					// push: "/hezuoIndexPresid", // 社长
					// push: "/hezuoIndexState", // 站长
          icon: require("../images/tab/hzjj.png"),
          iconSelect: require("../images/tab/hzjj-h.png")
        },
        {
          name: "互助圈子",
          push: "/mutualCircle",
          icon: require("../images/tab/hzjj.png"),
          iconSelect: require("../images/tab/hzjj-h.png")
        },
        {
          name: "个人中心",
          push: "/ucenter",
          icon: require("../images/tab/hzjj.png"),
          iconSelect: require("../images/tab/hzjj-h.png")
        }
      ]
    };
  },
  methods: {
    toRouter(name, path) {
			if(name == "合作经济"){
				// 记住选择身份,直接跳转页面
        if(typeof android != "undefined"){
          if(android.load('cooperaCode') && android.load('jobId')){ 
            this.$router.push('/hezuoIndexPresid');
            return
          }else if(android.load('isMass')){
            this.$router.push('/hezuoIndexMass');
            return
          }else if(android.load('isOwnTeam')){
            // 用户是否是团长判断（我所拥有的团队） ,,,有团长转让的情况
            this.$api.user_team_owner_check().then(res => {
              if (res.errno == 0) {
                this.$router.push('/hezuoIndexState');
              } else {
                this.$router.push('/chooseIdentity');
                // this.$toast(res.errmsg)
              }
            }).catch(err => {
                  
            })
            return
          }else if(localStorage.getItem('teamId')){
            this.$router.push('/indexYuan'); // 团员页面
            return
          }
        }else{
          if(localStorage.getItem('cooperaCode') && localStorage.getItem('jobId')){ 
            this.$router.push('/hezuoIndexPresid');
            return
          }else if(localStorage.getItem('isMass')){
            this.$router.push('/hezuoIndexMass');
            return
          }else if(localStorage.getItem('isOwnTeam')){
            // 用户是否是团长判断（我所拥有的团队） ,,,有团长转让的情况
            this.$api.user_team_owner_check().then(res => {
              if (res.errno == 0) {
                this.$router.push('/hezuoIndexState');
              } else {
                this.$router.push('/chooseIdentity');
                // this.$toast(res.errmsg)
              }
            }).catch(err => {
                  
            })
            return
          }else if(localStorage.getItem('teamId')){
            this.$router.push('/indexYuan'); // 团员页面
            return
          }
        }
				
				if(typeof android != "undefined"){
          android.del("identityId")
        }else{
          localStorage.removeItem("identityId")
        } 
				this.$api.user_role().then(res=>{
						// "if_qz": 0,//是否为群众：0否，1是（没有其他三种任何身份）
						// "coopera_role": 0,//合作社身份：0社员1管理员账号2区域管理3联社社长4社长5员工10没有合作社
						// "if_tz": 1,//是否为团长：0否，1是
						// "if_ty": 0,//是否为团员：0否，1是
					if(res.if_qz == 1){ //群众身份
            if(typeof android != "undefined"){
              android.del('cooperaId');
              android.del('cooperaCode');
              android.del('jobId');
              android.del('organName');
              android.del('organIdentity');
              android.del('isOwnTeam');
              android.del('ownTeamId');
              android.del('teamId');

              android.save("isMass", 1)
            }else{
              localStorage.removeItem('cooperaId');
              localStorage.removeItem('cooperaCode');
              localStorage.removeItem('jobId');
              localStorage.removeItem('organName');
              localStorage.removeItem('organIdentity');
              localStorage.removeItem('isOwnTeam');
              localStorage.removeItem('ownTeamId');
              localStorage.removeItem('teamId');

              localStorage.setItem("isMass", 1)
            }

						this.$router.push('/hezuoIndexMass');
					}else if(res.if_qz == 0 && res.coopera_role == 10 && res.if_tz == 1 && res.if_ty == 0){ // 仅仅是团长身份
						// 用户是否是团长判断（我所拥有的团队） ,,,有团长转让的情况
						this.$api.user_team_owner_check().then(res => {
							if (res.errno == 0) {
                if(typeof android != 'undefined'){
                  android.del('isMass');
                  android.del('cooperaCode');
                  android.del('jobId');
                  android.del('teamId');

                  android.save("isOwnTeam", 1)
                  android.save("ownTeamId", res.data.team_id)
                }else{
                  localStorage.removeItem('isMass');
                  localStorage.removeItem('cooperaCode');
                  localStorage.removeItem('jobId');
                  localStorage.removeItem('teamId');

                  localStorage.setItem("isOwnTeam", 1)
                  localStorage.setItem("ownTeamId", res.data.team_id)
                }

								this.$router.push('/hezuoIndexState');
							} else {
								this.$router.push('/chooseIdentity');
								// this.$toast(res.errmsg)
							}
						}).catch(err => {
									
						})
						
						
					}else if(res.if_qz == 0 && res.coopera_role == 10 && res.if_tz == 0 && res.if_ty == 1){ // 仅仅是团员身份
            if(typeof android != 'undefined'){
              android.save("identityId", 1)
            }else{
              localStorage.setItem("identityId", 1)
            }
						this.$router.push('/chooseIdentity'); // 进入选择合作社/合作联社页面--团员--选择页面
					}else if(res.if_qz == 0 && res.coopera_role != 10 && res.if_tz == 0 && res.if_ty == 0){ // 仅仅是合作社身份
            if(typeof android != 'undefined'){
              android.save("identityId", 2)
            }else{
              localStorage.setItem("identityId", 2)
            }
						this.$router.push('/chooseIdentity'); // 进入选择合作社/合作联社页面--团员--选择页面
					}else{ // 多种身份【团员+合作社】
            if(res.if_tz == 1 && res.if_ty == 0){ // 团长，不在其他团长团队
              if(typeof android != 'undefined'){
                android.save("identityId", 3)
              }else{
                localStorage.setItem("identityId", 3)
              }
              this.$router.push('/chooseIdentity');
            }else if(res.if_tz == 0 && res.if_ty == 1){ // 不是团长，只在其他团员团队
              if(typeof android != 'undefined'){
                android.save("identityId", 4)
              }else{
                localStorage.setItem("identityId", 4)
              }
              this.$router.push('/chooseIdentity'); 
            }else{ // 团长+团员+合作社
              if(typeof android != 'undefined'){
                android.save("identityId", 5)
              }else{
                localStorage.setItem("identityId", 5)
              }
              this.$router.push('/chooseIdentity'); 
            }
						
					}
				})
			}else{
				this.$router.push(path);
			}
      
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
.bottom {
  height: 50px;
  .van-tabbar {
    // box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 50px;
    background-size: 100% 100%;
    .van-tabbar-item {
      justify-content: flex-end;
      padding-bottom: 5px;
    }
    .van-tabbar-item:first-of-type {
      padding-bottom: 0;
      .van-tabbar-item__icon{
          margin-bottom: 0;
      }
      img {
        height: 70px;
      }
    }
    .van-tabbar-item--active {
      background: transparent;
    }
  }
  .van-hairline--top-bottom::after,
  .van-hairline-unset--top-bottom::after {
    border-width: 0;
  }
}
</style>

