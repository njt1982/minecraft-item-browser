<template>
  <router-link
    :to="{
      name: 'Home',
      params: { item_name: item.name }
    }"
    class="item-link"
    :data-item-id="item.id"
  >
    <img v-bind:src="textureSrc()" :alt="item.displayName" class="mc-block" />
    <span v-if="showName" class="text-muted">{{ item.displayName }}</span>
  </router-link>
</template>

<script>
/* eslint-env jquery */

export default {
  props: {
    item: Object,
    showName: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    textureSrc() {
      return "data:image/png;base64," + this.item.texture;
    }
  },
  mounted() {
    if (!this.showName) {
      $(this.$el).tooltip({
        title: this.item.displayName,
        position: "top"
      });
    }
  },
  beforeDestroy() {
    $(this.$el).tooltip("dispose");
  }
};
</script>
