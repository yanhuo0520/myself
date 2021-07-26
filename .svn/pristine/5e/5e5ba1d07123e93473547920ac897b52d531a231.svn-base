<template>
	<div class="reportTask">
		<div class="header"></div>
        <van-nav-bar :border="false"  title="举报任务" left-arrow  @click-left="leftBack"/>
        <div class="task-box">
            <div class="task-group">
                <div class="task-item"></div>
            </div>
        </div>
	</div>
</template>
<script>
	export default {
		name: "reportTask",
		data() {
			return {
               
			};
		},
		mounted() {
          window.leftBack = this.leftBack
		},
		methods: {
            leftBack() {
				this.$router.push('/taskCenter');
            },
        }
	};
</script>
<style lang="less">
	.reportTask {
		background: #f0f6fc;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        
        .van-nav-bar {
            background: transparent;
			.van-icon {
				color: #222222;
			}
			.van-nav-bar__title {
				font-size: 16px;
				font-weight: bold;
			}
		}
		.header {
            position: fixed;
            top: 0;
            left: 0;
			background: url(../../images/bgHeader1.png) no-repeat;
			background-size: 100% 100%;
			width: 100%;
			height: 115px;
        }
        .task-box {
            position: relative;
            flex: 1;
            overflow-y: auto;
            
        }
	}
</style>
