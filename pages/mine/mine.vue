<template>
	<view class="page">
		<view class="header" @click="updateUserInfo">
			<view class="img mg-b2">
				<image :src="userInfo.avatarUrl" mode=""></image>
			</view>
			<view class="nickname mg-b2">
				{{userInfo.nickname}}
			</view>
			<text class="text">更新微信信息</text>
		</view>
		<view class="btn-add" @click="btnCreateStudy" v-if="!studyInfoList.length">
			新建书房
		</view>
		<view class="book-list">
			<uni-card
			v-for="(item,index) in studyInfoList"
			:key="index"
			is-full="true" :title="item.name" 
			:thumbnail="item.userInfo.avatarUrl"
			:extra="`${item.totalStudys}本`" >
			    <image :src="'http://api.map.baidu.com/staticimage/v2?ak=6ae2e0c384df712820d0a2fa4ddcffc6&zoom=17&coordtype=gcj02ll&center='+item.geopoint.coordinates[0]+','+item.geopoint.coordinates[1]" 
				class="address-img"
				></image>
				<view class="operate" @click="more(item._id)">
					更多
				</view>
			</uni-card>
		</view>
	</view>
</template>

<script>
	import cloudApi from '../../common/cloudAPi.js';
	const amapFile  = require('../../common/amap-wx.js')
	export default {
		data() {
			return {
				userInfo: {},
				studyInfoList:[],
				
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		onShow() {
			this.userInfo.token && this.getStudyList()
		},
		methods: {
			//更多操作
			more(_id){
				uni.showActionSheet({
					itemList:['删除','编辑'],
					itemColor:'#4CD964',
					success: res => {
						const { tapIndex } = res;
						if(tapIndex == 0){
							cloudApi.call({
								name:'studys',
								data:{
									action:'delete',
									data:{
										_id
									}
								},
								success:res => {
									uni.showToast({
										title:'删除成功',
										icon:'none',
										success: () => {
											this.getStudyList()
										}
									})
								}
							})
						}else{
							uni.navigateTo({
								url:`../add-study/add-study?id=${_id}`
							})
						}
					}
				})
			},
			btnCreateStudy(){
				uni.navigateTo({
					url:'../add-study/add-study'
				})
			},
			//更新用户信息
			updateUserInfo() {
				uni.getUserProfile({
					desc: '获取用户信息',
					success: (res) => {
						cloudApi.call({
							name: 'updateUserInfo',
							data: {
								userInfo: Object.assign(this.userInfo, res.userInfo),
								token: this.userInfo.token
							},
							success: res => {
								this.getUserInfo()
							}
						})
					}
				})
			},
			//获取用户信息
			getUserInfo() {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						cloudApi.call({
							name: 'login',
							data: {
								code: res.code
							},
							success: (result) => {
								this.userInfo = result.result;
								uni.setStorageSync('token',this.userInfo.token);
								this.getStudyList()
							}
						})
					}
				})
			},
			//获取当前用户创建的书房
			getStudyList(){
				cloudApi.call({
					name:'studys',
					data:{
						action:'get'
					},
					success:res => {
						this.studyInfoList = res.result
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
    .page{
		box-sizing: border-box;
	}
	.mg-b {
		margin-bottom: 10rpx;
	}

	.mg-b2 {
		margin-bottom: 20rpx;
	}
	.book-list{
		padding: 20rpx;
		box-sizing: border-box;
	}
	.address-img{
		width: 100%;
		margin-bottom: 10rpx;
	}
	.header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #F8F8F8;
		margin-bottom: 20rpx;
		padding: 40px;

		.img {
			width: 100rpx;
			height: 100rpx;

			>image {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}

		.text {
			color: #999;
		}
	}
	.btn-add{
		text-align: center;
		color:#fff;
		background-color: #000;
		width: 80%;
		margin: 0 auto;
		padding: 20rpx;
		border-radius: 10rpx;
	}
</style>
