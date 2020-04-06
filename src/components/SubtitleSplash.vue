<template>
  <p class="subtitle center">{{content}}</p>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class SubtitleSplash extends Vue {
  @Prop() private content?: string;
}
</script>

<style lang="scss">
@import './node_modules/linelay/defaultBuild.scss';

.subtitle {
    font-family:'Press Start 2P';
    font-size: 0.60rem;
    color: white;
    text-align: center;
}
</style>
