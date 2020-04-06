<template>
  <div class="app verti items-center-top items-space-around">
    <SplashScreen/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SplashScreen from "./components/SplashScreen.vue";

@Component({
  components: {
    SplashScreen,
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";
@import "./src/assets/styles/styles.scss";

.app {
  background-color: black;
  height: 100vh;
  width: 100%;
  word-wrap: break-word;
}
</style>
