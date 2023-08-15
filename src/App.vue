<template>
  <div id="app">
    <router-view />
  </div>
</template>
<style lang="scss">
$headings-font-family: "Slabo 27px", Serif;
$font-family-sans-serif: "Open Sans Condensed", sans-serif;
$tooltip-font-size: 1.25rem;
$tooltip-bg: rgba(0, 0, 0, 0.8);
$link-decoration: none;
$input-btn-focus-width: 0;
$input-focus-border-color: #ced4da; // $grey-400, but variables dont exist yet...
@import "~bootstrap";
@import "~../public/css/textures.css";

@import "@/components/McSidebar.scss";
@import "@/components/McRecipe.scss";
@import "@/components/McItem.scss";

.dark-mode-toggle {
  position: absolute;
  top: -80px;
  left: -80px;
  background: rgba(var(--bs-dark-rgb), 0.7);
  transition: background ease 0.25s;
  fill: white;
  width: 160px;
  height: 160px;
  transform: rotate(-45deg);
  cursor: pointer;
  &:hover {
    background: rgba(var(--bs-dark-rgb), 0.9);
  }

  svg {
    position: relative;
    bottom: -112px;
    left: 60px;
    width: 40px;
    height: 40px;
    display: none;
  }
  svg.light {
    display: block;
  }
}

.header-wrapper {
  padding: 7rem 0 0.5rem;
  margin-bottom: 1.5rem;
  background-color: var(--bs-dark-bg-subtle);

  @include media-breakpoint-up(sm) {
    padding: 3rem 0 2rem;
  }
}

@include color-mode(dark) {
  body {
    background-color: $dark;
    color: $light;
  }
  .list-group-item-action,
  .list-group-item {
    background-color: darken($dark, 5);
    color: $light;
  }
  .list-group-item-action,
  .list-group-item {
    border-color: rgba($light, 0.125);
    &:active,
    &:focus {
      background-color: lighten($dark, 5);
      color: $light;
    }
    &:hover {
      background-color: lighten($dark, 1);
      color: $light;
    }
  }
  .card {
    background-color: var(--bs-gray-800);
    color: $light;
  }
  .card-footer,
  .card-header {
    background-color: var(--bs-gray-900);
  }
  .text-muted {
    color: $light !important;
  }
  .dark-mode-toggle {
    svg.light {
      display: none;
    }
    svg.dark {
      display: block;
    }
  }
  .tooltip {
    --bs-tooltip-color: var(--bs-body-color);
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
.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}
@keyframes octocat-wave {
  0%,
  100% {
    transform: rotate(0);
  }
  20%,
  60% {
    transform: rotate(-25deg);
  }
  40%,
  80% {
    transform: rotate(10deg);
  }
}
@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }
  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}
</style>

<script>
export default {
  name: "app",
};
</script>
