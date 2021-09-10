<template>
	<view class="index">
		<view class="" v-if="pageShow">
			<view class="search">
				<uni-easyinput suffixIcon="search" v-model="bookName" 
				trim="all"
				placeholder="请输入书名"
				:focus="true"
				@iconClick="onClick"
				@input="input"
				@confirm='onClick'>
				</uni-easyinput>
			</view>
			<view class="img-empty" v-if="emptyShow">
				<image src="../../static/empty.png" mode=""></image>
				<view class="tip">
					暂无数据
				</view>
			</view>
			
			<view class="book-list" v-if="bookList.length">
				<view class="img" v-for="(bookItem,index) in bookList" :key="index" @click="toBookDetail(bookItem)">
					<image :src="bookItem.coverUrl" mode=""></image>
					<view class="text">{{bookItem.title}}</view>
				</view>
			</view>
			<view class="no-more" v-if="notMore">
				没有更多啦...
			</view>
		</view>
		<view class="back-top" @click="scrollTop" v-if="scrollShow">
			<image src="../../static/backTop.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	import cloudApi from '../../common/cloudAPi.js';
	export default {
		data() {
			return {
				pageShow: false,
				bookList: [],
				bookName: '',
				total: 0,
				pageSize: 20,
				scrollShow:false,
				emptyShow:false,
			}
		},
		computed: {
			notMore() {
				return this.bookList.length && this.bookList.length == this.total;
			}
		},
		onShow() {
			this.bookName = '';
			this.bookList = []
			this.getBookList()
		},
		//监听页面滚动 显示返回顶部图片
		onPageScroll(e) {
			this.scrollShow = e.scrollTop>300 ? true : false;
		},
		//触底加载更多
		onReachBottom() {
			if (!this.notMore) {
				this.pageSize += 10;
				this.getBookList()
			}
		},
		methods: {
			toBookDetail(item){
				uni.navigateTo({
					url:'../bookDetail/bookDetail?id='+item._id
				})
			},
			//返回顶部
			scrollTop(){
				uni.pageScrollTo({
					scrollTop:0
				})
			},
			input(){
				if(!this.bookName) this.getBookList()
			},
			//搜书书本
			onClick() {
				cloudApi.call({
					name: 'isbn',
					data: {
						data: {
							action: 'search',
							bookName: this.bookName
						}
					},
					success: res => {
						this.bookList = res.result
					}
				})
			},
			//获取书本列表
			getBookList() {
				cloudApi.call({
					name: 'isbn',
					data: {
						data: {
							action: 'getAllBookList',
							page: 1,
							pageSize: this.pageSize
						}
					},
					success: res => {
						this.pageShow = true;
						this.bookList = res.result.list;
						this.total = res.result.total
						this.emptyShow = this.bookList.length?false:true
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index {
		.back-top{
			position: fixed;
			width: 100rpx;
			height: 100rpx;
			bottom: 30rpx;
			right: 30rpx;
			>image{
				width: 100%;
				height: 100%;
			}
		}
		.search {
			margin: 0 0 20rpx 0;
		}

		.img-empty {
			margin-top: 200rpx;
			text-align: center;

			image {
				width: 400rpx;
				height: 300rpx;
			}
		}

		.tip {
			text-align: center;
			color: #ccc
		}

		.no-more {
			text-align: center;
			color: #ccc;
			margin-bottom: 20rpx;
		}

		.book-list {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.text {
				width: 100%;
				display: flex;
				text-align: center;
				text-overflow: -o-ellipsis-lastline;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				line-clamp: 1;
				-webkit-box-orient: vertical;

			}

			.img {
				height: 250rpx;
				width: 31.4%;
				position: relative;
				margin-right: 20rpx;
				margin-bottom: 20rpx;

				image {
					width: 100%;
					height: 200rpx;
				}
			}

			.img:nth-child(3n+3) {
				margin-right: 0;
			}
		}
	}
</style>
