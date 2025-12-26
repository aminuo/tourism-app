<template>
	<view class="detail">
		<up-navbar title="" bg-color="#00000000" :autoBack="true" left-icon-color="#fff" />
		<view class="d-con">
			<image :src="details.dt.img" mode="aspectFill"></image>
			<view class="d-content">
				<view class="j-con">
					<view class="tit" style="display: flex;">
						<text style="margin-right:7px;font-size:17px">{{ details.dt.title }}</text>
						<up-tag text="5A级景区" size="mini" shape="circle"></up-tag>
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

	const details = reactive({
		dt: ''
	})

	const projectList = ref([])

	const goLine = (item) => {
		uni.navigateTo({
			url: `/pages/line/index?id=${item.id}`
		})
	}

	onLoad((opt) => {
		detailProject().then(res => {
			projectList.value = res
			console.log(projectList.value)
		})
		// console.log(JSON.parse(decodeURIComponent(opt.item)))
		details.dt = JSON.parse(decodeURIComponent(opt.item))
	})
</script>
<style lang="scss">
@import "./index.scss";
</style>
