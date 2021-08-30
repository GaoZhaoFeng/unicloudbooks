<template>
	<view class="study">
		<view class="wrap">
			<input type="text" v-model="studyName" placeholder="请输入书房名称"/>
			<view class="select-address" @click="selectAddress">
				<text>{{selectAddressTip}}</text>
				<uni-icons type="arrowright" size="30"></uni-icons>
			</view>
		</view>
		<view class="submit" @click="createStudy">
			{{btnText}}
		</view>
	</view>
</template>

<script>
	import cloudApi from '../../common/cloudAPi.js';
	export default {
		data() {
			return {
				studyName:"",
				selectAddressTip:'选择地址',
				address:{
					address:'',
					longitude:'',
					latitude:''
				},
				btnText:'保存',
				id:''
			}
		},
		onLoad(option) {
			if(option.id){
				this.id = option.id;
				uni.setNavigationBarTitle ({
					title:'编辑书房'
				});
				this.getCurrentStudy(option.id)
			}
		},
		methods: {
			//获取当前书房
			getCurrentStudy(_id){
				cloudApi.call({
					name:'studys',
					data:{
						action:'detail',
						data:{
							_id
						}
					},
					success:res => {
						const { result } = res;
						this.studyName = result[0].name;
						this.selectAddressTip = result[0].address;
						this.address = {
							address:result[0].address,
							longitude:result[0].geopoint.coordinates[0],
							latitude:result[0].geopoint.coordinates[1]
						}
					}
				})
			},
			//选择地址
			selectAddress(){
				uni.chooseLocation({
					latitude:this.address.latitude,
					longitude:this.address.longitude,
					success: (res) => {
						this.address.latitude = res.latitude;
						this.address.longitude = res.longitude;
						this.address.address = res.address;
						this.selectAddressTip = res.address?res.address:'选择地址'
					}
				})
			},
			//创建书房
			createStudy(){
				if(!this.studyName){
					return uni.showToast({
						title:'请输入书房名称',
						icon:'none'
					})
				}
				if(this.studyName.length>12){
					return uni.showToast({
						title:'书房名称太长',
						icon:'none'
					})
				}
				if(!this.address.address){
					return uni.showToast({
						title:'请选择地址',
						icon:'none'
					})
				}
				
				let params = {
					name:this.studyName,
					...this.address
				}
				this.id && (params._id = this.id);
				cloudApi.call({
					name:'studys',
					data:{
						action:this.id ? 'update' : 'add',
						data:params
					},
					success:res => {
						uni.reLaunch({
							url:'../mine/mine'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.study{
	padding: 20rpx;
	box-sizing: border-box;
	.wrap{
		border-radius: 10rpx;
		input{
			border-bottom: 1rpx solid #ccc;
			height: 60rpx;
			padding: 10rpx;
			
		}
		.select-address{
			height: 60rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 10rpx ;
		}
		border: 1rpx solid #ccc;
	}
	.submit{
		text-align: center;
		color:#fff;
		background-color: #000;
		width: 95%;
		margin: 0 auto;
		padding: 20rpx;
		border-radius: 10rpx;
		margin-top: 20rpx;
	}
}
</style>
