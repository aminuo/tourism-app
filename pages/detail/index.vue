<template>
	<view class="detail">
		<view class="d-con">
			<image :src="formatImageUrl(details.dt.img)" mode="aspectFill"></image>
			<view class="d-content">
				<view class="j-con">
					<view class="tit" style="display: flex; align-items: center; flex-wrap: wrap;">
					<text style="margin-right:7px;font-size:17px">{{ details.dt.title }}</text>
					<view style="display: flex; gap: 8rpx;">
						<up-tag 
							v-for="(tag, index) in details.dt.tags" 
							:key="tag.id" 
							:text="tag.name" 
							size="mini" 
							shape="circle"
						/>
					</view>
				</view>
					<view class="jj">
						<view style="font-weight:700;font-size:14px">景区介绍</view>
						<view class="nr">{{ details.dt.introduce }}</view>
					</view>
					<view class="j-con">
						<view class="jj">
							<text style="font-weight:700;font-size:14px">开放时间：</text>
							<text class="nr">{{ details.dt.times }}</text>
						</view>
					</view>
					<view class="j-con ls">
						<view class="tit" style="font-size: 34rpx">游玩推荐</view>
						<view class="jj tj-list">
							<view class="item" v-for="(item, index) in projectList" :key="index" @click="goLine(item)">
								<image :src="item.url" mode="aspectFill"></image>
								<view class="topFixed">
									{{ item.tag }}
								</view>
								<view class="infos">
									<view class="tit">{{ item.title }}</view>
									<view class="desc">
										<up-icon name="map" color="#9c9c9c" size="16"></up-icon>
										<text class="text">{{ item.desc }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		ref,
		reactive
	} from 'vue'
	import {
		detailProject
	} from '../../api/api.js'
	import {
		getDetail
	} from '../../api/home/index.js'

	const details = reactive({
		dt: {}
	})

	const projectList = ref([])

	const goLine = (item) => {
		uni.navigateTo({
			url: `/pages/line/index?id=${item.id}`
		})
	}

	// 处理图片路径，移除反引号
	const formatImageUrl = (url) => {
		if (!url) return ''
		return url.replace(/`/g, '')
	}

	onLoad(async (opt) => {
		try {
			// 从路由参数中获取景点id
			const id = opt.id
			if (!id) {
				uni.showToast({
					title: '缺少景点ID',
					icon: 'error'
				})
				return
			}

			// 调用getDetail接口获取景点详情
			const detailData = await getDetail(id)
			details.dt = detailData

			// 动态设置导航栏标题为景点名称
			if (details.dt && details.dt.title) {
				uni.setNavigationBarTitle({
					title: details.dt.title
				})
			}

			// const projectData = await detailProject()
			// projectList.value = projectData
		} catch (error) {
			console.error('获取数据失败:', error)
			uni.showToast({
				title: '获取数据失败',
				icon: 'error'
			})
		}
	})
</script>
<style lang="scss">
@import "./index.scss";
</style>
