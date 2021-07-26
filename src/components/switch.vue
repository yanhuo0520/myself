<template>
	<div class="switchSwi">
		<input type="checkbox" id="toggle-button" name="switch" :checked="checked"
			@change="onChange" />
		<label for="toggle-button" class="button-label">
			<div class="circleCont">
				<span class="circle">{{ checked ? onText : offText }}</span>
				<img :src="checked ? onText.default : offText.default " alt="" />
			</div>
			
		</label>
	</div>
</template>

<script>
	export default {
		name: 'switchSwi',
		inheritAttrs: false,
		props: {
			onText: {
				type: String,
				default: '过'
			},
			offText: {
				type: String,
				default: '拒'
			},
			propsChecked: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				checked: true
			}
		},
		methods: {
			onChange(e) {
				this.checked = e.target.checked
				this.$emit('change', e.target.checked)
			}
		},
		created() {
			this.checked = this.propsChecked
		}
	}
</script>

<style lang="less" scoped>
	#toggle-button {
		display: none;
	}

	.circleCont {
		position: absolute;
		top: 0;
		width: 18px;
		height: 18px;
		line-height: 20px;
		overflow: hidden;
		border-radius: 30px;
		text-align: center;
		transition: all 0.3s ease;
	}
	.button-label {
		position: relative;
		display: inline-block;
		width: 34px;
		height: 20px;
		background: #ffffff;
		border: 1px solid #f13838;
		background: #f13838;
		border-radius: 30px;
		box-sizing: border-box;
	}
	.button-label .circleCont {
		color: #f13838;
		background: #FFFFFF;
	}
	.button-label .circle {
		font-size: 12px;
		transform: scale(0.7, 1);
		display: block;
		font-weight: 600;
		background: transparent;
		box-shadow: 0 5px 15px rgba(250, 96, 127, 0.4);
	}

	#toggle-button:checked+label.button-label {
		border: 1px solid #386af1;
		background: #386af1;;
	}

	#toggle-button:checked+label.button-label .circleCont{
		right: 0;
		color: #386af1;
		background: #FFFFFF;
	}
	#toggle-button:checked+label.button-label .circle {
		font-size: 12px;
		transform: scale(0.7, 1);
		display: block;
		font-weight: 600;
		background: transparent;
		box-shadow: 0 5px 15px 0 rgba(94, 111, 250, 0.4);
	}
</style>
