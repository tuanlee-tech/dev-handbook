<template>
  <div class="alert-pending">
    <div class="icon">⚠️</div>
    <div class="content">
      <div class="title">{{ title }}</div>
      <div class="desc">{{ description }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: "Bài học chưa có nội dung" },
  description: {
    type: String,
    default:
      "Nội dung của ngày hôm nay chưa được soạn. Vui lòng quay lại sau để cập nhật.",
  },
});
</script>

<style scoped>
.alert-pending {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 20px;
  background-color: #fff8e1;
  border-left: 5px solid #ffc107;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  font-family: sans-serif;
  color: #856404;
  margin: 20px 0;
}
.alert-pending .icon {
  font-size: 24px;
  line-height: 1;
}
.alert-pending .content .title {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 5px;
}
.alert-pending .content .desc {
  font-size: 14px;
  line-height: 1.5;
}
</style>
