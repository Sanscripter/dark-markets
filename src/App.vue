<template>
  <div class="app verti items-center-top items-space-around">
    <SplashScreen v-if="splashScreen" v-on:start="openGameScreen" />
    <GameScreen v-if="gameScreen"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SplashScreen from "./components/screens/SplashScreen.vue";
import GameScreen from "./components/screens/GameScreen.vue";

@Component({
  components: {
    SplashScreen,
    GameScreen,
  }
})
export default class App extends Vue {
  splashScreen = true;
  gameScreen = false;

  public openGameScreen(){
    this.gameScreen = true;
    this.splashScreen = false;
  }

  //todo screen manager


}
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
