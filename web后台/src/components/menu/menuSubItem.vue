<template>
  <menuItem :item="item" :index="index" />
</template>

<script lang="ts" setup>
import menuItem from './menuItem.vue'
const props = defineProps(['item', 'index'])
</script>
