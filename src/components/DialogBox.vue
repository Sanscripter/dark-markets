<template>
  <div class="horiz self-right" style="width:45vw;">
    <div class="nes-container is-dark mugshot mt-50 weight-1">a square</div>    
    <div class="nes-container is-dark content dialog-container weight-4">
      <!-- <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse rutrum est odio, non varius elit porttitor eu. Mauris non odio tempor, imperdiet mi interdum, lacinia arcu. Nullam interdum libero nec volutpat imperdiet. Donec porta maximus metus dapibus ultrices. Suspendisse gravida mauris neque, eget luctus tortor volutpat vel. Proin ut rhoncus arcu, non tincidunt nulla. Suspendisse vulputate, metus eget vehicula porta, nisi neque ornare massa, ac tempus elit libero ut mauris. In hac habitasse platea dictumst. Pellentesque tellus elit, auctor at viverra ut, tempor et lacus. Vestibulum pretium orci est. Proin consectetur, turpis id vulputate mollis, tellus purus tempus tellus, in dignissim velit urna quis justo.
        Maecenas lorem massa, eleifend vel congue sit amet, convallis at nisl. Duis tempus viverra mattis. Donec quis venenatis libero, non iaculis felis. Vestibulum suscipit cursus ligula, vitae lacinia justo. Donec eu dapibus nunc. Donec porta enim libero, eu volutpat libero efficitur vitae. Nam elementum ultricies iaculis.
      </p> -->
      <div class="mt-50">
        <label>
          <input
            type="radio"
            class="nes-radio is-dark"
            name="answer-dark"
            checked
            v-on:click="append"
          />
          <span>Start</span>
        </label>
  
        <label>
          <input type="radio" v-on:click="stepSimulation" class="nes-radio is-dark" name="answer-dark" />
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
export default class TitleSplash extends Vue {
  @Prop() private content?: string;

  public appendageOn = false;
  private economy = new Economy();

  append() {
    this.appendageOn = true;
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

.content {  background-color: unset;
}

.dialog-container {
  margin: 20px !important;
  margin-right: 30px !important;
  margin-left: 5px !important;
  height: 95vh;
  overflow-x: hidden;

  overflow-y: scroll;
  font-size: 14px;
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
