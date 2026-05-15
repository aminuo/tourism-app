<template>
  <view class="my-information">
    <!-- 头像区域 -->
    <view class="avatar-section">
      <view class="avatar-label">头像</view>
      <view class="avatar-wrapper">
        <button class="avatar-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image
            class="avatar-img"
            :src="userInfo.avatarUrl || '/static/tabbar/my.png'"
            mode="aspectFill"
          ></image>
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
        <input
          class="info-input"
          v-model="userInfo.nickName"
          placeholder="请输入昵称"
          placeholder-class="placeholder"
        />
      </view>

      <view class="info-item">
        <view class="info-label">性别</view>
        <picker mode="selector" :range="genderOptions" :value="genderIndex" @change="onGenderChange">
          <view class="info-value">
            {{ displayGender || '请选择性别' }}
            <uni-icons type="right" size="16" color="#999"></uni-icons>
          </view>
        </picker>
      </view>

      <view class="info-item">
        <view class="info-label">手机号</view>
        <input
          class="info-input"
          v-model="userInfo.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号"
          placeholder-class="placeholder"
        />
      </view>

      <view class="info-item">
        <view class="info-label">邮箱</view>
        <input
          class="info-input"
          v-model="userInfo.email"
          type="text"
          placeholder="请输入邮箱"
          placeholder-class="placeholder"
        />
      </view>
    </view>
    <!-- 保存按钮 -->
    <view class="save-btn-container">
      <button class="save-btn" @click="saveInfo">保存</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getUserInfo, updateUserInfo } from '../../../api/login/index.js';

// 用户信息
const userInfo = reactive({
  avatarUrl: '',
  nickName: '',
  gender: 0, // 存储数字：0-未知，1-男，2-女
  phone: '',
  email: '',
});

// 性别选项（显示用）
const genderOptions = ['男', '女', '保密'];

// 性别索引（picker选中索引：0-男，1-女，2-保密）
const genderIndex = ref(2);

// 性别映射：数字 -> 中文
const genderMap = {
  0: '',
  1: '男',
  2: '女',
};

// 显示的性别（中文）
const displayGender = computed(() => {
  return genderMap[userInfo.gender] || '';
});

// 页面加载
onLoad(async () => {
  await fetchUserInfo()
});

onShow(async () => {
  await fetchUserInfo()
});

const fetchUserInfo = async () => {
  // 检查登录状态
  if (!uni.getStorageSync('token')) {
    userInfo.avatarUrl = ''
    userInfo.nickName = ''
    userInfo.gender = 0
    userInfo.phone = ''
    userInfo.email = ''
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
    return
  }

  try {
    // 从接口获取用户信息
    const userData = await getUserInfo();
    if (userData) {
      userInfo.avatarUrl = userData.avatarUrl || '';
      userInfo.nickName = userData.nickName || '';
      // 后端返回数字，直接赋值
      userInfo.gender = userData.gender ?? 0;
      // 设置picker索引
      setGenderIndex(userInfo.gender);
      userInfo.phone = userData.phone || '';
      userInfo.email = userData.email || '';
    }
  } catch (error) {
    console.error('获取用户信息失败:', error);
    // 失败时从本地存储获取
    const storedUserInfo = uni.getStorageSync('userInfo');
    if (storedUserInfo) {
      const parsedInfo = JSON.parse(storedUserInfo);
      userInfo.avatarUrl = parsedInfo.avatarUrl || '';
      userInfo.nickName = parsedInfo.nickName || '';
      userInfo.gender = parsedInfo.gender ?? 0;
      // 设置picker索引
      setGenderIndex(parsedInfo.gender);
      userInfo.phone = parsedInfo.phone || '';
      userInfo.email = parsedInfo.email || '';
    }
  }
};

// 根据gender值设置picker索引
const setGenderIndex = (gender) => {
  switch (gender) {
    case 1:
      genderIndex.value = 0; // 男
      break;
    case 2:
      genderIndex.value = 1; // 女
      break;
    default:
      genderIndex.value = 2; // 保密
  }
};

// 选择头像
const onChooseAvatar = (e) => {
  userInfo.avatarUrl = e.detail.avatarUrl;
};

// 选择性别
const onGenderChange = (e) => {
  // e.detail.value 是字符串，需要转换为数字
  const index = parseInt(e.detail.value, 10);
  genderIndex.value = index;
  
  if (index === 0) {
    userInfo.gender = 1; // 男
  } else if (index === 1) {
    userInfo.gender = 2; // 女
  } else {
    userInfo.gender = 0; // 未知/保密
  }
};

// 保存信息
const saveInfo = async () => {
  // 简单验证
  if (!userInfo.nickName) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none',
    });
    return;
  }

  if (userInfo.phone && !/^1[3-9]\d{9}$/.test(userInfo.phone)) {
    uni.showToast({
      title: '请输入正确的手机号',
      icon: 'none',
    });
    return;
  }

  if (userInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) {
    uni.showToast({
      title: '请输入正确的邮箱',
      icon: 'none',
    });
    return;
  }

  try {
    // 调用接口更新用户信息（gender已经是数字）
    await updateUserInfo(userInfo);

    // 保存到本地存储
    uni.setStorageSync('userInfo', JSON.stringify(userInfo));

    uni.showToast({
      title: '保存成功',
      icon: 'success',
    });

    // 延迟返回
    setTimeout(() => {
      uni.navigateBack();
    }, 1500);
  } catch (error) {
    console.error('更新用户信息失败:', error);
    uni.showToast({
      title: error || '保存失败',
      icon: 'none',
    });
  }
};
</script>

<style scoped lang="scss">
@import './index.scss';
</style>
