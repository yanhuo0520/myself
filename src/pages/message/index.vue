<template>
	<div class="message" :style='{height: deviceHeight + "px"}'>
		<van-nav-bar title="消息" left-arrow fixed @click-left="leftBack">
			<!-- 取消选择 -->
			<template #right v-if="ifSelSome">
			  <p @click="ifSelSome = false, cancelSel()">取消</p>
			 </template>
			 <template #right v-else>
			  <img src="../../images/more.png" alt="" class="rightIcon" @click="seleShow=!seleShow" />
			 </template>
		</van-nav-bar>
		<div class="rightClickCont" v-if="seleShow">
			<!-- 没有需要读的消息是灰色的 -->
			<div class="item" :class="ifAllRead? 'gary' : ''" @click="allRead()"><img src="../../images/mesClik1.png" alt="" class="Icon" />全部已读</div>
			<div class="item" :class="ifHasMess? '' : 'gary'" @click="allDelete()"><img src="../../images/mesClik2.png" alt="" class="Icon" />全部删除</div>
			<div class="item" :class="ifHasMess? '' : 'gary'" @click="someSel()"><img src="../../images/mesClik3.png" alt="" class="Icon" />部分选择</div>
		</div>
		<van-grid class="grid" :column-num="4" :border="false">
			<van-grid-item v-for="(item, index) in grid" :key="index" @click="girdId= item.id, goGridItem()">
				<img :src="item.icon" alt="" />
				<p class="title" :class="girdId==item.id ? 'active' : ''">{{ item.name }}</p>
			</van-grid-item>
		</van-grid>
		<div class="msgCont" :class="ifSelSome && ifHasMess ? 'addPaddBottom' : ''" @scroll="scrollEvent($event)" v-if="list.length > 0">
			<div v-for="(item, index) in list" :key="index">
				<van-checkbox class="item itemCheck" :name="item.a_id" v-model="item.tag" @click="checkSel(item.a_id, item.state)" v-if="ifSelSome">
					<img src="../../images/messLeft2.png" class="leftIcon" v-if="item.type == 2" />
					<img src="../../images/messLeft3.png" class="leftIcon" v-else-if="item.type == 3" />
					<img src="../../images/messLeft4.png" class="leftIcon" v-else-if="item.type == 1" />
					<van-badge dot v-if="item.state == 0 ">
						<div class="child" />
					</van-badge>
					<div class="content">
						<div class="top">
							<p class="title">
								<template v-if="item.type == 2">
									账户通知
								</template>
								<template v-else-if="item.type == 3">
									圈子互动
								</template>
								<template v-else-if="item.type == 1">
									系统消息
								</template>
							</p>
							<p class="time">{{item.short_add_date}}</p>
						</div>
						<p class="desc">{{item.content}}</p>
					</div>
				</van-checkbox>
				<template v-else>
					<div class="item" @click.stop="detail(item.a_id, item.type)">
						<img src="../../images/messLeft2.png" class="leftIcon" v-if="item.type == 2" />
						<img src="../../images/messLeft3.png" class="leftIcon" v-else-if="item.type == 3" />
						<img src="../../images/messLeft4.png" class="leftIcon" v-else-if="item.type == 1" />
						<van-badge dot v-if="item.state == 0 ">
							<div class="child" />
						</van-badge>
						<div class="content">
							<div class="top">
								<p class="title">
									<template v-if="item.type == 2">
										账户通知
									</template>
									<template v-else-if="item.type == 3">
										圈子互动
									</template>
									<template v-else-if="item.type == 1">
										系统消息
									</template>
								</p>
								<p class="time">{{item.short_add_date}}</p>
							</div>
							<p class="desc">{{item.content}}</p>
						</div>
					</div>
					
				</template>
				
			</div>
			<!-- 加载中 -->
			<van-loading v-if="isLoading" size="24px">{{deviceTip}}</van-loading>
			<!-- 没有更多了 -->
			<p v-if="!isLoading" class="noMore">{{deviceTip}}</p>

			<!-- 部分选择按钮 -->
			<div class="btnCont" v-if="ifSelSome && ifHasMess">
				<van-checkbox icon-size="16" v-model="allCheck" @click="selAll()">全选</van-checkbox>
				<!-- 没有选择可标记的置灰 -->
				<div class="btnItem" :class="(selectIdArray.length > 0 && selectStateArray.length > 0) ? '' : 'gary'" @click="readSome()">
					<img src="../../images/mesClik1.png" alt="" />标记已读
				</div>
				<div class="btnItem" :class="selectIdArray.length > 0 ? '' : 'gary'" @click="deleteSome()">
					<img src="../../images/mesClik2.png" alt="" />删除选中
				</div>
			</div>
		</div>
		<!-- 暂无内容 -->
		<div class="msgCont null" v-else-if="list.length == 0 && !isLoading">
			<img src="../../images/messNull.png" alt="" />
		</div>

		<van-popup v-model="deleteTip" class="TipCont">
			<img src="../../images/danTip.png" class="IMg" />
			<p class="tipTitle">消息删除后不能找回<br /> 您确定要删除吗?</p>
			<div class="btnCont">
				<p class="btn cancel" @click="deleteTip = false">取消</p>
				<p class="btn sure" @click="sureDelete()">确定</p>
			</div>
		</van-popup>
	</div>
</template>
<script>
	export default {
		name: "message",
		data() {
			return {
				deviceHeight: document.body.clientHeight - 46,
				ifAllRead: true,
				ifHasMess: true,
				ifSelSome: false,
				selectIdArray: [],
				selectStateArray: [],
				selIfAllRead: false,
				deleteTip: false,
				deleteId: '', // 默认为空， 1 删除全部 ， 2删除部分
				allCheck: false,
				girdId: 0,
				// 消息类型：0全部，1系统消息，2账户通知，3圈子互动（默认全部）
				grid: [{
						name: "全部消息",
						icon: require("../../images/messIcon1.png"),
						id: 0,
					},
					{
						name: "账户通知",
						icon: require("../../images/messIcon2.png"),
						id: 2,
					},
					{
						name: "圈子互动",
						icon: require("../../images/messIcon3.png"),
						id: 3
					},
					{
						name: "系统消息",
						icon: require("../../images/messIcon4.png"),
						id: 1
					},
				],
				seleShow: false,
				list: [],
				pageSize: 15, //每页显示
				page: 1, //当前页
				totalNum: 0, //总条数
				totalPage: 1, //总页数
				ifFinish: false, //是否加载完成
				isLoading: true, //是否加载更多
				deviceTip: ''
			};
		},
		mounted() {
			window.leftBack = this.leftBack;
			
			this.$toast.loading({
				message: '加载中...',
				forbidClick: true,
				duration: 0,
			});
			this.getList()
		},
		methods: {
			leftBack() {
				this.$router.go(-1);
			},
			goGridItem(){
				this.$toast.loading({
					message: '加载中...',
					forbidClick: true,
					duration: 0,
				});
				this.ifAllRead = true
				this.ifHasMess = true
				this.seleShow = false
				this.ifSelSome = false
				this.selectIdArray = []
				this.selectStateArray = []
				this.page = 1
				this.list = []
				this.isLoading = true
				this.getList()
			},
			scrollEvent(e) {
				if (e instanceof Event) {
					let el = e.target;
					let scrollTop = el.scrollTop;
					let clientHeight = el.clientHeight; // 获取可视区的高度
					let scrollHeight = el.scrollHeight; // 获取滚动条的总高度
					let height = 50;
					//到底了
					// console.log(this.isLoading, this.ifFinish);
					// console.log(scrollTop, clientHeight, scrollHeight);
					//是否继续加载且已完成加载
					if (scrollTop + clientHeight >= scrollHeight && this.isLoading && !this.ifFinish && this.page <= this
						.totalPage) {
						// 把距离顶部的距离加上可视区域的高度 等于或者大于滚动条的总高度就是到达底部
						this.isLoading = true;
						// console.log("到底了");
						setTimeout(() => {
							this.getList();
						}, 1000);
					}
				}
			},
			getList() {
				let data = {}
				data.page = this.page
				data.size = this.pageSize
				data.type = this.girdId
				this.$api.user_notify_announce_lists(data).then(res => {
					this.$toast.clear()
					if (res.errno == 0) {
						this.totalNum = res.data.count;
						this.totalPage = res.data.total_page
						if(this.totalNum > 0){
							this.ifHasMess = true
						}else{
							this.ifHasMess = false
						}

						if (this.totalNum == 0) {
							// console.log("没有数据");
							this.isLoading = false;
							this.ifFinish = true;
							this.page = 1;
							this.deviceTip = "暂无数据";
							return false;
						}
						let dataGet = res.data.data
						dataGet.forEach(ele=>{
							ele.tag = 0
							// "state": 0,//读取状态：0未读，1已读
							if(ele.state == 0){
								this.ifAllRead = false
							}
							// let index = this.selectIdArray.indexOf(ele.a_id);
							// if(index == -1){
							// 	ele.tag = 0
							// }else{
							// 	ele.tag = 1
							// }
						})
						this.list = this.list.concat(dataGet);
						// console.log(this.page, this.totalPage);
						if (this.page == this.totalPage) {
							this.isLoading = false;
							this.ifFinish = true;
							// this.page = 1;
							this.deviceTip = "没有更多了~";
							// console.log("没有更多了");
						} else {
							// console.log("下一页");
							this.isLoading = true;
							this.ifFinish = false;
							this.page++;
							this.deviceTip = "正在加载中~";
						}
					} else {
						this.list = [];
						this.isLoading = false;
						this.ifFinish = true;
						this.page = 1;
						this.deviceTip = "数据加载失败~";
					}
				}).catch(err => {
					this.$toast.clear()
				});
			},
			// 全部已读
			allRead(){
				if(this.ifAllRead){
					// this.$toast("暂无消息可标记")
					return
				}else{
					this.$api.read_all_notify_announce().then(res=>{
						if(res.errno == 0){
							this.seleShow = false
							this.page = 1
							this.list = []
							this.getList()
						}else{
							this.$toast(res.errmsg)
						}
					})
				}
			},
			sureDelete(){
				// 全部删除
				if(this.deleteId == 1){
					this.$toast.loading({
						message: '删除中...',
						forbidClick: true,
						duration: 0,
					});
					this.$api.user_clear_all_notify_announce({type: this.type}).then(res=>{
						this.$toast.clear()
						this.deleteTip = false
						this.deleteId = ''
						if(res.errno == 0){
							this.page = 1
							this.list = []
							this.getList()
						}else{
							this.$toast(res.errmsg)
						}
					}).catch(err=>{
						this.$toast.clear()
					})
				}else if(this.deleteId == 2){ // 部分删除
					this.$toast.loading({
						message: '删除中...',
						forbidClick: true,
						duration: 0,
					});
					this.$api.user_delete_choose_notify_announces({a_id_arr: this.selectIdArray}).then(res=>{
						this.$toast.clear()
						this.deleteTip = false
						if(res.errno == 0){
							this.ifSelSome = false
							this.selectIdArray = []
							this.selectStateArray = []
							this.deleteId = ''
							this.page = 1
							this.list = []
							this.getList()
						}
					}).catch(err=>{
						this.$toast.clear()
					})
				}
			},
			// 全部删除
			allDelete(){
				if(!this.ifHasMess){
					// this.$toast("暂无消息可删除")
					return
				}else{
					this.deleteTip = true
					this.seleShow = false
					this.deleteId = 1
				}
			},
			// 部分选择
			someSel(){
				if(!this.ifHasMess){
					// this.$toast("暂无消息可选择")
					return
				}else{
					this.ifSelSome = true
					this.seleShow = false
					this.allCheck = false
					this.deleteId = 2
				}
				
			},
			// 取消选择
			cancelSel(){
				this.selectIdArray = []
				this.selectStateArray = []
				this.list.forEach(ele=>{
					ele.tag = 0
				})
			},
			checkSel(id, state){
				// "state": 0,//读取状态：0未读，1已读
				let index = this.selectIdArray.indexOf(id);
				let stateIndex = this.selectStateArray.indexOf(id)
				if (index == -1) {
					this.selectIdArray.push(id)
					if(state == 0){
						this.selectStateArray.push(id)
					}
				} else {
					this.selectIdArray.splice(index, 1);
					if(state == 0){
						this.selectStateArray.splice(stateIndex, 1);
					}
				}
			},
			deleteSome(){
				if(this.selectIdArray.length <= 0){
					// this.$toast("请选择要删除的消息")
					return
				}else{
					this.deleteTip = true
				}
			},
			readSome(){
				if(this.selectStateArray.length == 0){
					return
				}
				this.allCheck = false
				this.$api.read_choose_notify_announces({a_id_arr: this.selectIdArray}).then(res=>{
					if(res.errno == 0){
						this.ifSelSome = false
						this.selectIdArray = []
						this.selectStateArray = []
						this.page = 1
						this.list = []
						this.getList()
					}
				})
			},
			selAll(){
				if(this.allCheck){
					this.list.forEach(ele=>{
						ele.tag = 1
						if(ele.state == 0){
							this.selectStateArray.push(id)	
						}
						this.selectIdArray.push(ele.a_id)
					})
				}else{
					this.list.forEach(ele=>{
						ele.tag = 0
					})
					this.selectIdArray = []
					this.selectStateArray = []
				}
			},
			detail(a_id, type){
				let title = ''
				if(type == 2){
					title = '账户通知'
				}else if(type == 3){
					title = '圈子互动'
				}else if(type == 1){
					title = '系统消息'
				}
				this.$router.push({
					path: '/messageDetail',
					query: {
						a_id: a_id,
						title: title
					}
				})
			}

		}
	}
</script>
<style lang="less">
	.message {
		padding-top: 46px;
		background: #F0F6FC;

		.van-nav-bar {
			background: #F0F6FC;

			.van-icon {
				color: #222222;
			}

			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
			
			.rightIcon{
				height: 15px;
			}
		}
		.van-hairline--bottom::after{
			border-bottom-width: 0
		}
		.rightClickCont{
			position: fixed;
			right: 16px;
			top: 40px;
			z-index: 999;
			padding: 5px 15px;
			border-radius: 10px 0 10px 10px;
			background: #FFFFFF;
			box-shadow: 0px 0px 10px 0px #d6e0ea; 
			.item{
				display: flex;
				align-items: center;
				font-size: 15px;
				color: #444444;
				line-height: 38px;
				border-bottom: 1px solid #F0F6FC;
				&.gary{
					color: #9AA8B6;
				}
				&:last-child{
					border-bottom: none;
				}
				.Icon{
					width: 15px;
					height: 15px;
					margin-right: 5px;
				}
			}
		}
		.grid{
			margin: 0 10px;
			width: calc(100% - 20px);
			.van-grid-item {
				width: 25%;
			}
			.van-grid-item__content {
				padding: 6px 8px;
				background: transparent;
			
				img {
					width: 53px;
					height: 53px;
				}
				.title{
					color: #9AA8B6;
					line-height: 20px;
					padding: 0 5px;
					border-radius: 30px;
					&.active{
						color: #5B646C;
						background: #FFFFFF;
					}
					.van-badge--fixed{
						top: -15px;
						right: 15px;
					}
				}
			}
		}
		
		.msgCont{
			height: calc(100% - 85px);
			overflow: auto;
			background: #FFFFFF;
			border-radius: 10px 10px 0 0;
			&.addPaddBottom{
				height: calc(100% - 145px);
				padding-bottom: 60px;
			}
			.item{
				margin: 0 10px;
				padding: 10px 0;
				border-bottom: 1px solid #F0F6FC;
				display: flex;
				align-items: center;
				&.itemCheck{
					.van-badge--fixed{
						top: 5px;
						right: 15px;
					}
				}
				.leftIcon{
					width: 40px;
					height: 40px;
					margin-right: 10px;
				}
				.van-badge--fixed{
					top: -15px;
					right: 15px;
				}
				.top{
					display: flex;
					justify-content: space-between;
				}
				.title{
					font-size: 15px;
					color: #444444;
				}
				.content{
					color: #9AA8B6;
					width: calc(100% - 50px);
				}
				.desc{
					margin-top: 8px;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
					
				}
			}
			&.null {
				text-align: center;

				img {
					margin-top: 30px;
					max-width: 100%;
				}
			}
			.van-checkbox__label{
				display: flex;
				width: calc(100% - 30px);
				.desc{
					margin-top: 0;
				}
			}
			
			.btnCont{
				position: fixed;
				bottom: 15px;
				left: 0;
				width: calc(100% - 40px);
				height: 45px;
				align-items: center;
				display: flex;
				justify-content: space-around;
				background: #FFFFFF;
				margin: 0 20px;
				border-radius: 50px;
				box-shadow: 0px 0px 20px 0px #e7f0fa; 
				.van-checkbox__label{
					margin-left: 4px;
					font-size: 15px;
					width: 100%;
				}
				.btnItem{
					font-size: 15px;
					display: flex;
					align-items: center;
					&.gary{
						color: #9AA8B6;
					}
					img{
						width: 15px;
						height: 15px;
						margin-right: 3px;
					}
				}
			}

			.van-loading,
			.noMore {
				padding: 10px 0;
				text-align: center;
			}
		}

		.TipCont{
			width: calc(100% - 60px);
			max-width: 510px;
			border-radius: 10px;
			background: transparent url(../../images/danTipBg.png) no-repeat center 46px;
			background-size: 100% auto;
			text-align: center;
			font-size: 15px;
			color: #444444;
			.IMg{
				width: 100%;
			}
			.tipTitle{
				background: #FFFFFF;
				padding: 20px 0;
				line-height: 20px;
			}
			.btnCont{
				display: flex;
				justify-content: space-around;
				background: #FFFFFF;
				padding: 10px 0 20px 0;
				.btn{
					border-radius: 30px;
					line-height: 34px;
					width: calc(50% - 20px);
					&.cancel{
						color: #9AA8B6;
						background: #F0F6FC;
					}
					&.sure{
						color: #FFFFFF;
						background: #3B6AF1;
					}
				}
			}
		}



	}
</style>
