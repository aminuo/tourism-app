<template>
	<view class="content">
		<view class="topBox">
			<view class="setbox">
				<view class="set-left">
					<uni-icons type="calendar" size="30" color="#fff"></uni-icons>
					<view class="txt">
						签到
					</view>
				</view>
				<view class="set-right">
					<uni-icons type="gear" size="30" color="#fff"></uni-icons>
					<uni-icons type="chat" size="30" color="#fff"></uni-icons>
				</view>
			</view>
			<view class="users" @click="setFun">
				<view class="u-top">
					<template v-if="!userInfo.nickName">
						<image src="/static/tabbar/my.png" mode="aspectFill"></image>
						<view class="tit">
							注册/登录
						</view>
					</template>
					<template v-else="!userInfo.nickName">
						<image :src="userInfo.avatarUrl" mode="aspectFill"></image>
						<view class="tit">
							{{userInfo.nickName}}
						</view>
					</template>
				</view>
				<view class="u-bottom">
					<view class="u-item">
						<view class="num">
							12
						</view>
						<view class="u-tit">
							点赞
						</view>
					</view>
					<view class="u-item">
						<view class="num">
							12
						</view>
						<view class="u-tit">
							喜欢
						</view>
					</view>
					<view class="u-item">
						<view class="num">
							12
						</view>
						<view class="u-tit">
							浏览
						</view>
					</view>
					<view class="u-item">
						<view class="num">
							12
						</view>
						<view class="u-tit">
							收藏
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="listBox">
			<view class="lists">
				<uni-list>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon1" showArrow title="个人信息"
						clickable @click="goToMyInformation"></uni-list-item>
					<uni-list-item thumb="/static/my/footprints.png" thumb-size="44" showArrow title="旅游足迹"
						clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon3" showArrow title="我的评价"
						clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon4" showArrow title="我的邮件"
						clickable></uni-list-item>
					<uni-list-item :show-extra-icon="true" :extra-icon="extraIcon5" showArrow title="分享有礼"
						clickable></uni-list-item>
				</uni-list>
			</view>
		</view>
		<up-popup closeable @close="close" :show="show" round="20">
			<view class="popup">
				<view class="title">获取您的昵称、头像</view>
				<view class="flex">
					<view class="label">获取用户头像：</view>
					<button class="avatar-warpper" open-type="chooseAvatar" @chooseavatar="onChooseavatar">
						<image class="avatar" :src="userInfo.avatarUrl"></image>
					</button>
				</view>
				<view class="flex">
					<view class="label">获取用户昵称：</view>
					<input @input="changeName" type="nickname">
				</view>
				<button size="default" type="primary" @click="userSubmit">确定</button>
			</view>
		</up-popup>
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
		login
	} from '../../api/login/index.js'
	import {
		getUserInfo
	} from '../../api/api.js'

	onLoad(async () => {
		// 免登逻辑
		if (uni.getStorageSync('token') && !uni.getStorageSync('userInfo')) {
			const {
				avatarUrl,
				nickName
			} = await getUserInfo()
			userInfo.avatarUrl = avatarUrl
			userInfo.nickName = nickName
		} else if (uni.getStorageSync('token') && uni.getStorageSync('userInfo')) {
			const {
				avatarUrl,
				nickName
			} = JSON.parse(uni.getStorageSync('userInfo'))
			userInfo.avatarUrl = avatarUrl
			userInfo.nickName = nickName
		}
	})

	const extraIcon1 = reactive({
		color: '#666666',
		size: '22',
		type: 'auth'
	})
	const extraIcon2 = reactive({
		color: '#666666',
		size: '22',
		type: 'cart'
	})
	const extraIcon3 = reactive({
		color: '#666666',
		size: '22',
		type: 'chatboxes'
	})
	const extraIcon4 = reactive({
		color: '#666666',
		size: '22',
		type: 'email'
	})

	const extraIcon5 = reactive({
		color: '#666666',
		size: '22',
		type: 'gift'
	})

	const userInfo = reactive({
		nickName: '',
		avatarUrl: ''
	})


	// 控制弹出层的显示
	const show = ref(false)

	const close = () => {
		show.value = false
	}

	const userSubmit = () => {
		uni.setStorageSync('userInfo', JSON.stringify(userInfo))
		show.value = false
	}

	const onChooseavatar = (e) => {
		userInfo.avatarUrl = e.detail.avatarUrl
	}
	const changeName = (e) => {
		userInfo.nickName = e.detail.value
	}

	const setFun = () => {
		uni.showModal({
			title: '温馨提示',
			content: '亲，授权微信登录后才能正常使用小程序',
			success(res) {
				if (res.confirm) {
					// uni.getUserProfile({
					// 	desc: "获取用户头像和昵称",
					// 	success(res) {
					// 		console.log(res, 'success')
					// 	},
					// 	fail(err) {
					// 		console.log(err, 'fail')
					// 	}
					// })
					uni.login({
						success: async (data) => {
							console.log(data)
							const {
								token
							} = await login(data.code)
							console.log(token, 'token')
							uni.setStorageSync('token', token)
							// 根据token获取用户信息
							const {
								avatarUrl,
								nickName
							} = await getUserInfo()
							userInfo.avatarUrl = avatarUrl
							userInfo.nickName = nickName
							show.value = true
						}
					})

				}
			}
		})
	}

	// 跳转到个人信息页面
	const goToMyInformation = () => {
		uni.navigateTo({
			url: '/pages/my/myInformation/index'
		})
	}

</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>