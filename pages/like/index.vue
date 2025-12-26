<template>
	<view class="like">
		<view class="jj tj-list">
			<view class="item" v-for="(item, index) in linkList" :key="index">
				<image :src="item.img" mode="aspectFill"></image>
				<view class="topFixed">喜欢</view>
				<view class="infos">
					<view class="tit">{{ item.title }}</view>
					<view class="desc">
						<text class="text">{{ item.introduce }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'
	import {
		likeList
	} from '../../api/api.js'

	const linkList = ref([])
	onLoad(() => {
		likeList().then(res => {
			console.log(res)
			linkList.value = res
		})
	})
</script>
<style lang="scss">
@import "./index.scss";
</style>

