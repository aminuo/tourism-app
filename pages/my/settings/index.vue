<template>
  <view class="settings">
    <uni-list>
      <uni-list-item title="退出登录" showArrow @click="handleLogout"></uni-list-item>
    </uni-list>
  </view>
</template>

<script setup>
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('userInfo')
        uni.showToast({
          title: '已退出登录',
          icon: 'success'
        })
        setTimeout(() => {
          uni.switchTab({
            url: '/pages/home/index'
          })
        }, 1000)
      }
    }
  })
}
</script>

<style lang="scss">
.settings {
  padding: 20rpx;
}
</style>