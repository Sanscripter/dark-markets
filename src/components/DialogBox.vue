<template>
  <div class="horiz self-right" style="width:100vw;">
    <div class="nes-container is-dark content dialog-container">

      <ul style="width: 100%">
        <li v-for="agent in economy.agents" :key="agent.id" >
             <span @click="selectLocation(agent)">{{agent.name}}</span>
        </li>
      </ul>
      <div class="mt-50">
        <label>
          <input
            type="radio"
            class="nes-radio is-dark"
            name="answer-dark"
            checked
            v-on:click="stepSimulation"
          />
          <span>Step</span>
        </label>
  
        <label>
          <input type="radio"  class="nes-radio is-dark" name="answer-dark" />
          <span>About</span>
        </label>
      </div>
      
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Economy from '../game/classes/EconomySimulation';

@Component
export default class DialogBox extends Vue {
  @Prop() private content?: string;

  public appendageOn = false;
  public selectedLocation: Location | null = null;
  private economy = new Economy();

  append() {
    this.appendageOn = true;
  }

  selectLocation(location: Location){
    this.$emit('selectLocation', location)
  }

  stepSimulation() {
    this.economy.step();

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
