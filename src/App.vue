<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
$headings-font-family: "Slabo 27px", Serif;
$font-family-sans-serif: "Open Sans Condensed", sans-serif;
$fa-font-path: "~font-awesome/fonts";
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
  @include media-breakpoint-up(sm) {
    width: 48px;
    height: 48px;
  }
}
</style>

<script>
export default {
  name: "app"
};
</script>
