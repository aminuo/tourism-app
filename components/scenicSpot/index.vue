<template>
  <view class="demo-waterfall-item" @click="handleClick">
    <view class="image-wrapper">
      <up-lazy-load
        threshold="-450"
        border-radius="10"
        :image="item.img"
        :index="index"
      ></up-lazy-load>
      <HotStatusBadge :status="item.hotStatus" />
    </view>
    <view class="demo-title">
      {{ item.title }}
    </view>
    <view class="demo-tag">
      <uni-tag
        v-for="(tag, tagIndex) in item.tags"
        :key="tag.id"
        :inverted="true"
        :text="tag.name"
        size="mini"
        :type="getTagType(tagIndex)"
      />
    </view>
    <view class="demo-price">
      {{ item.times }}
    </view>
    <view class="isDot" v-if="item.isDot">
      {{ item.isDot }}
    </view>
  </view>
</template>

<script setup>
import HotStatusBadge from '../hotStatusBadge/index.vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.item);
};

const getTagType = (index) => {
  const types = ['primary', 'success', 'warning', 'error'];
  return types[index % types.length];
};
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
