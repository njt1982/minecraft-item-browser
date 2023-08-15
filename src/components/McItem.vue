<template>
  <router-link
    :to="{
      name: 'Home',
      params: { item_name: item.name },
    }"
    class="item-link"
    :data-item-id="item.id"
    :data-bs-toggle="showName ? null : 'tooltip'"
    :data-bs-title="this.visibleName"
    :title="this.visibleName"
  >
    <div
      v-for="(tid, index) in item.textures"
      :key="tid"
      :class="`mc-block texture-${tid}`"
      :style="textureStyles(index)"
    />
    <span v-if="showName" class="text-muted">{{ this.visibleName }}</span>
  </router-link>
</template>

<script>
/* eslint-env jquery */

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    showName: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visibleName() {
      return this.item.displayName ? this.item.displayName : this.item.name;
    },
  },
  methods: {
    textureStyles: function (layer) {
      const styles = {};
      if (this.item.tint && this.item.tint[layer]) {
        styles.backgroundColor =
          "rgba(" + this.item.tint[layer].join(",") + ")";
      }
      return styles;
    },
  },
};
</script>
