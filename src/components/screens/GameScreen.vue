<template>
  <div class="app verti items-center-top items-space-around text">
    <LocationDetails v-if='selectionMade' :location="selectedLocation" @close="closeDetails"/>
    <DialogBox v-if='!selectionMade' @selectLocation="selectLocationHandler" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DialogBox from "../DialogBox.vue";
import LocationDetails from "../LocationDetails.vue";

@Component({
  components: {
    DialogBox,
    LocationDetails
  }
})
export default class GameScreen extends Vue {

    public selectedLocation: Location | null = null;
    public selectionMade = false;

    selectLocationHandler(location: Location){
      this.selectedLocation = location;
      this.selectionMade = true;
    }

    closeDetails() {
      this.selectionMade = false;
    }

}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";

.text {
  color: white;
}
</style>
