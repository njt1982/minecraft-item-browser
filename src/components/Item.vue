<template>
  <router-link
    :to="{
      name: 'Home',
      params: { item_name: item.name }
    }"
  >
    <img :src="item.texture" class="mc-block" />
  </router-link>
</template>

<script>
/* eslint-env jquery */

export default {
  props: {
    item: Object
  },
  mounted() {
    $(this.$el).tooltip({
      title: this.item.displayName,
      position: "top"
    });
  }
};
</script>
