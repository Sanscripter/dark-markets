<template>
  <div class="horiz self-right" style="width:100vw;">
    <h1>Agent Debug Screen</h1>
    <ul style="width: 100%">
      <li class="horiz split-5-gutter-10 w-200" v-for="agent in locationList" :key="agent.id">
        <span @click="selectLocation(agent)">{{agent.name}}</span> <span>${{agent.wallet.getFunds()}}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Economy from "../game/classes/EconomySimulation";

@Component
export default class LocationList extends Vue {
  @Prop() private locationList?: string;

  public selectedLocation: Location | null = null;

  selectLocation(location: Location) {
    this.$emit("selectLocation", location);
  }
}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";

.mugshot {
  width: 70px;
  height: 200px;
  margin-top: 45px !important;
}

.content {
  background-color: black;
}

.dialog-container {
  // margin: 20px !important;
  // margin-right: 30px !important;
  // margin-left: 5px !important;
  height: 95vh;
  overflow-x: hidden;
  width: 90%;
  overflow-y: scroll;
  font-size: 10px;
}

.dialog-container::-webkit-scrollbar {
  width: 5px;
}
.dialog-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.dialog-container::-webkit-scrollbar-thumb {
  background-color: grey;
  outline: 1px solid slategrey;
}
</style>
