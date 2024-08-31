<template>
  <el-sub-menu
    v-if="item.children && item.children.filter((child) => !child.hide).length"
    :index="index"
  >
    <template #title>
      <span>{{ item.name }}</span>
    </template>
    <menu-subItem
      v-for="(subItem, subIndex) in item.children"
      :item="subItem"
      :index="index + '-' + subIndex"
      :key="index + '-' + subIndex"
    />
  </el-sub-menu>
  <el-menu-item
    v-if="
      (!item.children || (item.children && !item.children.filter((child) => !child.hide).length)) &&
      !item.hide
    "
    :index="item.path"
    :route="{ ...item }"
  >
    {{ item.name }}
  </el-menu-item>
</template>

<script lang="ts" setup>
import menuSubItem from './menuSubItem.vue'
defineProps(['item', 'index'])
</script>
