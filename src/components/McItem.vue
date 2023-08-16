<template>
  <span
    :class="showName ? '' : 'invslot'"
    :data-visible-item="visibleItemIndex"
  >
    <router-link
      v-for="item in items"
      :key="item.id"
      :to="{
        name: 'Home',
        params: { item_name: item.name },
      }"
      class="item-link"
      :data-item-id="item.id"
      :data-bs-toggle="showName ? null : 'tooltip'"
      :data-bs-title="visibleName(item)"
      :title="visibleName(item)"
    >
      <div
        v-for="(tid, index) in item.textures"
        :key="tid"
        :class="`mc-block texture-${tid}`"
        :style="textureStyles(item, index)"
      />
      <span v-if="showName" class="text-muted">{{ visibleName(item) }}</span>
    </router-link>
  </span>
</template>

<script>
/* eslint-env jquery */

export default {
  props: {
    items: {
      type: Object,
      required: true,
    },
    showName: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      interval: null,
      visibleItemIndex: 0,
    };
  },
  mounted() {
    if (this.items && this.items.length > 1) {
      this.interval = setInterval(() => {
        this.visibleItemIndex += 1;
        if (this.visibleItemIndex >= this.items.length) {
          this.visibleItemIndex = 0;
        }
      }, 1000);
    }
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    visibleName: function (item) {
      return item.displayName ? item.displayName : item.name;
    },
    textureStyles: function (item, layer) {
      const styles = {};
      if (item.tint && item.tint[layer]) {
        styles.backgroundColor = "rgba(" + item.tint[layer].join(",") + ")";
      }
      return styles;
    },
  },
};
</script>
