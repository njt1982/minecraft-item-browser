<template>
  <router-link
    :to="{
      name: 'Home',
      params: { item_name: item.name }
    }"
    class="item-link"
    :data-item-id="item.id"
    :title="item.displayName"
  >
    <div
      v-for="(tid, index) in item.textures"
      :key="tid"
      :class="`mc-block texture-${tid}`"
      :style="textureStyles(index)"
    />
    <span v-if="showName" class="text-muted">{{ item.displayName }}</span>
  </router-link>
</template>

<script>
/* eslint-env jquery */

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    showName: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    textureStyles: function(layer) {
      const styles = {};
      if (this.item.tint && this.item.tint[layer]) {
        styles.backgroundColor =
          "rgba(" + this.item.tint[layer].join(",") + ")";
      }
      return styles;
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
  beforeUnmount() {
    $(this.$el).tooltip("dispose");
  }
};
</script>
