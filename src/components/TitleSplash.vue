<template>
  <p class="title center">{{content}}</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TitleSplash extends Vue {
  @Prop() private content?: string;
}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";

.title {
  font-family: "Press Start 2P";
  font-size: 4rem;
  color: white;
  text-align: center;
  max-width: 500px;
}

@media only screen and (max-width: 600px) {
  .title {
    font-family: "Press Start 2P";
    font-size: 3rem;
    color: white;
    text-align: center;
  } 
}
</style>
