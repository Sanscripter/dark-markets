<template>
  <div class="app verti items-center-top items-space-around text">
    <DialogBox />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DialogBox from "../DialogBox.vue";

@Component({
  components: {
    DialogBox
  }
})
export default class SplashScreen extends Vue {}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";

.text {
  color: white;
}
</style>
