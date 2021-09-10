<template>
	<view class="index">
		<view class="wrap" v-if="showPage">
			<image :src="detail.coverUrl" mode="" @click="sclcImg"></image>
			<view class="title">
				{{detail.title}}
			</view>
			<view class="desc">
				{{detail.abstract}}
			</view>
		</view>
	</view>
</template>

<script>
	import cloudApi from '../../common/cloudAPi.js';
	export default {
		data() {
			return {
				detail:{},
				showPage:false
			}
		},
		onLoad(option) {
			this.getDetail(option.id)
		},
		methods: {
			sclcImg(){
				uni.previewImage({
					urls:[this.detail.coverUrl]
				})
			},
			getDetail(_id){
				cloudApi.call({
					name:'isbn',
					data:{
						data:{
							action:'detail',
							_id
						}
					},
					success:res => {
						this.showPage = true
						this.detail = res.result[0]
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.wrap{
	text-align: center;
	
	.title{
		margin: 10rpx;
	}
	.desc{
		color:#ccc;
	}
}
</style>
