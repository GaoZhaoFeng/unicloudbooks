<template>
	<view class="page">
		<view class="header" @click="updateUserInfo">
			<view class="img mg-b2">
				<image :src="userInfo.avatarUrl" mode=""></image>
			</view>
			<view class="nickname mg-b2" v-if="userInfo.nickname">
				{{userInfo.nickname}}
			</view>
			<text class="text">更新微信信息</text>
		</view>
		<view class="book-list">
			<uni-card
			v-for="(item,index) in studyInfoList"
			:key="index"
			is-full="true" :title="item.name" 
			:thumbnail="item.userInfo.avatarUrl"
			@click="toAddBooks(item)"
			:extra="`${item.totalStudys}本`" >
			
			    <image :src="'http://api.map.baidu.com/staticimage/v2?ak=6ae2e0c384df712820d0a2fa4ddcffc6&zoom=17&coordtype=gcj02ll&center='+item.geopoint.coordinates[0]+','+item.geopoint.coordinates[1]" 
				class="address-img"
				></image>
				<view class="operate" @click.stop="more(item._id)">
					更多
				</view>
			</uni-card>
		</view>
		<view class="add-btn" @click="btnCreateStudy">
			<uni-icons type="plus-filled" color="#000" size="50">
			</uni-icons>
		</view>
		<view class="no-more mg-b2" v-if="noMore">
			没有更多了呢...
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
				page:1,
				pageSize:10
			}
		},
		computed:{
			noMore(){
				return this.studyInfoList.length && (this.pageSize > this.studyInfoList.length)
			}
		},
		onLoad() {
			this.getUserInfo();
		},
		onShow() {
			this.userInfo.token && this.getStudyList()
		},
		onReachBottom() {
			if(!this.noMore){
				this.pageSize+=10;
				this.getStudyList()
			}
		},
		methods: {
			toAddBooks({_id,name}){
				uni.navigateTo({
					url:`/pages/books/books?id=${_id}&name=${name}`
				})
			},
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
						action:'get',
						data:{
							page:this.page,
							pageSize:this.pageSize
						}
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
		position: relative;
		.add-btn{
			position: fixed;
			bottom: 30rpx;
			right: 30rpx;
			z-index: 999;
		}
	}
	.mg-b {
		margin-bottom: 10rpx;
	}
	.no-more{
		text-align: center;
		width: 100%;
		font-size: 32rpx;
		color:#999
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
