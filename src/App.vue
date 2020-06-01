<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
$headings-font-family: "Slabo 27px", Serif;
$font-family-sans-serif: "Open Sans Condensed", sans-serif;
$fa-font-path: "~font-awesome/fonts";
$tooltip-font-size: 1.25rem;
$tooltip-bg: rgba(0, 0, 0, 0.8);
@import "~bootstrap";
@import "~font-awesome/scss/font-awesome";

@import "@/components/Sidebar.scss";
@import "@/components/Recipe.scss";

@media (prefers-color-scheme: dark) {
  body {
    background-color: theme-color("dark");
    color: theme-color("light");
  }
  .list-group-item-action,
  .list-group-item,
  .jumbotron {
    background-color: darken(theme-color("dark"), 10);
    color: theme-color("light");
  }
  .list-group-item-action,
  .list-group-item {
    border-color: rgba(theme-color("light"), 0.125);
    &:active,
    &:focus {
      background-color: lighten(theme-color("dark"), 10);
      color: theme-color("light");
    }
    &:hover {
      background-color: lighten(theme-color("dark"), 1);
      color: theme-color("light");
    }
  }
  .card {
    background-color: lighten(theme-color("dark"), 5);
    color: theme-color("light");
  }
  .card-header {
    background-color: lighten(theme-color("dark"), 10);
  }
}
img.mc-block {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
  @include media-breakpoint-up(md) {
    width: 24px;
    height: 24px;
  }
  @include media-breakpoint-up(lg) {
    width: 32px;
    height: 32px;
  }
}
.invslot {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 2px solid;
  border-color: #888 #eee #eee #888;
  background: #ccc;
  @include media-breakpoint-up(md) {
    width: 36px;
    height: 36px;
  }
  @include media-breakpoint-up(lg) {
    width: 44px;
    height: 44px;
  }
}
</style>

<script>
export default {
  name: "app"
};
</script>
