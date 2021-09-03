<template>
	<view class="index">
		<operate v-if="operateShow" @dismiss="dismiss" @selected="selected" />
		<view class="book-list">
			<view class="img" v-for="(bookItem,index) in bookList" :key="index" @click="toBookDetail(bookItem)">
				<image :src="bookItem.coverUrl" mode=""></image>
				<view class="del" v-if="deleteShow" @click.stop="deleteOperate(bookItem._id)">
					<uni-icons type="closeempty" color="red" size="30">
					</uni-icons>
				</view>
			</view>
		</view>
		<view>
			<view class="wrap">
				<view @click="operateShow= true" class="iconfont icon-share">
					<uni-icons type="redo" color="#fff">
					</uni-icons>
				</view>
				<view @click="btnScan" class="add-book">添加图书</view>
				<view @click="deleteShow = !deleteShow" class="iconfont">
					<uni-icons type="gear" color="#fff" v-if="!deleteShow">
					</uni-icons>
					<view class="" v-else>
						关闭
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import cloudApi from '../../common/cloudAPi.js';
	import operate from '../../components/operate.vue'
	export default {
		components: {
			operate
		},
		data() {
			return {
				id: '',
				operateShow: false,
				bookList:[],
				deleteShow:false
			}
		},
		onLoad(ops) {
			const {
				id,
				name
			} = ops;
			this.id = id;
			uni.setNavigationBarTitle({
				title: name
			})
			this.getBookList()
		},
		methods: {
			toBookDetail(item){
				console.log(item,'item')
			},
			//
			/*
			9787557021115
			9787107168024
			*/
		   //添加书本
			btnScan() {
				if(this.deleteShow) return;
				uni.scanCode({
					onlyFromCamera:false,
					success: (res) => {
						const {result} = res;
						cloudApi.call({
							name: 'isbn',
							data: {
								data: {
									action: 'add',
									isbn: result,
									id: this.id
								}
							},
							success: res => {
								uni.showToast({
									title:'添加成功',
									success: () => {
										this.getBookList()
									}
								})
							}
						})	
					},
					fail: () => {
						cloudApi.call({
							name: 'isbn',
							data: {
								data: {
									action: 'add',
									isbn: '9787557021115',
									id: this.id
								}
							},
							success: res => {
								uni.showToast({
									title:'添加成功',
									success: () => {
										this.getBookList()
									}
								})
							}
						})	
					}
				})
			},
			dismiss() {
				this.operateShow = false
			},
			selected(index) {
				console.log(index, 'index')
			},
			//获取书房书本
			getBookList(){
				cloudApi.call({
					name: 'isbn',
					data: {
						data: {
							action: 'getbookList',
							_id:this.id
						}
					},
					success:res => {
						this.bookList = res.result;
					}
				})
			},
			//删除
			deleteOperate(_id) {
				cloudApi.call({
					name: 'isbn',
					data: {
						data: {
							action: 'delete',
							_id,
							id:this.id
						}
					},
					success: res => {
						if (res.result.affectedDocs) {
							uni.showToast({
								title: '删除成功',
								success: () => {
									this.getBookList()
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.index{
		margin-bottom: 100rpx;
		padding: 12rpx;
		.book-list{
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.img{
				width: 31.4%;
				position: relative;
				margin-right: 20rpx;
				margin-bottom: 20rpx;
				image{
					width: 100%;
					height: 200rpx;
				}
				.del{
					position: absolute;
					right: -26rpx;
					top:-30rpx
				}
			}
			.img:nth-child(3n+3){
				margin-right: 0;
			}
		}
	}
	.wrap {
		background-color: #000;
		width: 100%;
		height: 50px;
		border-radius: 25px;
		padding: 0 10rpx;
		display: flex;
		box-sizing: border-box;
		line-height: 50px;
		color: #fff;
		justify-content: space-between;
		position: fixed;
		bottom: 20rpx;
		left: 0;

		.icon-app {
			width: 50px;
			height: 50px;
			text-align: center;
		}

		.iconfont {
			width: 50px;
			height: 50px;
			text-align: center;
		}

		.add-book {
			flex: 1;
			text-align: center;
		}
	}
</style>
