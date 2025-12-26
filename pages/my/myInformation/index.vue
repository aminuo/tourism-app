<template>
	<view class="my-information">
		<!-- 头部区域 -->
		<view class="header">
			<view class="back-btn" @click="goBack">
				<uni-icons type="back" size="20" color="#333"></uni-icons>
			</view>
			<view class="title">个人信息</view>
			<view class="save-btn" @click="saveInfo">保存</view>
		</view>

		<!-- 头像区域 -->
		<view class="avatar-section">
			<view class="avatar-label">头像</view>
			<view class="avatar-wrapper">
				<button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
					<image class="avatar-img" :src="userInfo.avatarUrl || '/static/tabbar/my.png'" mode="aspectFill"></image>
					<view class="avatar-mask">
						<uni-icons type="camera" size="24" color="#fff"></uni-icons>
					</view>
				</button>
			</view>
		</view>

		<!-- 信息列表 -->
		<view class="info-list">
			<view class="info-item">
				<view class="info-label">昵称</view>
				<input class="info-input" v-model="userInfo.nickName" placeholder="请输入昵称" placeholder-class="placeholder" />
			</view>

			<view class="info-item">
				<view class="info-label">性别</view>
				<picker mode="selector" :range="genderOptions" @change="onGenderChange">
					<view class="info-value">
						{{ userInfo.gender || '请选择性别' }}
						<uni-icons type="right" size="16" color="#999"></uni-icons>
					</view>
				</picker>
			</view>

			<view class="info-item">
				<view class="info-label">手机号</view>
				<input class="info-input" v-model="userInfo.phone" type="number" maxlength="11" placeholder="请输入手机号" placeholder-class="placeholder" />
			</view>

			<view class="info-item">
				<view class="info-label">邮箱</view>
				<input class="info-input" v-model="userInfo.email" type="text" placeholder="请输入邮箱" placeholder-class="placeholder" />
			</view>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from 'vue'
	import { onLoad } from '@dcloudio/uni-app'

	// 用户信息
	const userInfo = reactive({
		avatarUrl: '',
		nickName: '',
		gender: '',
		phone: '',
		email: ''
	})

	// 性别选项
	const genderOptions = ['男', '女', '保密']

	// 页面加载
	onLoad(() => {
		// 从本地存储获取用户信息
		const storedUserInfo = uni.getStorageSync('userInfo')
		if (storedUserInfo) {
			const parsedInfo = JSON.parse(storedUserInfo)
			userInfo.avatarUrl = parsedInfo.avatarUrl || ''
			userInfo.nickName = parsedInfo.nickName || ''
			userInfo.gender = parsedInfo.gender || ''
			userInfo.phone = parsedInfo.phone || ''
			userInfo.email = parsedInfo.email || ''
		}
	})

	// 返回上一页
	const goBack = () => {
		uni.navigateBack()
	}

	// 选择头像
	const onChooseAvatar = (e) => {
		userInfo.avatarUrl = e.detail.avatarUrl
	}

	// 选择性别
	const onGenderChange = (e) => {
		userInfo.gender = genderOptions[e.detail.value]
	}

	// 保存信息
	const saveInfo = () => {
		// 简单验证
		if (!userInfo.nickName) {
			uni.showToast({
				title: '请输入昵称',
				icon: 'none'
			})
			return
		}

		if (userInfo.phone && !/^1[3-9]\d{9}$/.test(userInfo.phone)) {
			uni.showToast({
				title: '请输入正确的手机号',
				icon: 'none'
			})
			return
		}

		if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
			uni.showToast({
				title: '请输入正确的邮箱',
				icon: 'none'
			})
			return
		}

		// 保存到本地存储
		uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		
		uni.showToast({
			title: '保存成功',
			icon: 'success'
		})

		// 延迟返回
		setTimeout(() => {
			uni.navigateBack()
		}, 1500)
	}
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
