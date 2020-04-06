<template>
  <div class="app verti items-center-top items-space-around">
    <SubtitleSplash class="mt-100 mob-mt-200" content="+++Guillermo Murua's+++" />
    <TitleSplash content="Dark Markets" />

    <div class="mt-50">
      <label>
        <input type="radio" class="nes-radio is-dark" name="answer-dark" checked />
        <span>Start</span>
      </label>

      <label>
        <input type="radio" class="nes-radio is-dark" name="answer-dark" />
        <span>About</span>
      </label>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import TitleSplash from "./TitleSplash.vue";
import SubtitleSplash from "./SubtitleSplash.vue";  


@Component({
  components: {
    SubtitleSplash,
    TitleSplash
  }
})
export default class SplashScreen extends Vue {}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";

</style>
