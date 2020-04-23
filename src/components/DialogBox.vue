<template>
  <div class="horiz self-right" style="width:100vw;">
    <!-- <div class="nes-container is-dark mugshot mt-50 weight-1">a square</div>     -->
    <div class="nes-container is-dark content dialog-container">
      <table style="width: 100%">
        <th></th>
        <th></th>
        <th></th>
        <th></th>
        <tbody>
          <tr class="mb-3" v-for="agent in economy.agents" :key="agent.id">
            <td>
             {{agent.name}}
            </td>
            <td>
              <p>Wallet Funds</p>
              <p>${{agent.wallet.funds}}</p>
            </td>
            <td>
              <p>Inventory</p>
              <div class="horiz items-space-between" v-for="item in agent.inventory.items" :key="item.id">
                <div class="weight-1 m-2">{{item.name}}</div>
                <div class="weight-1">{{item.quantity}}</div>
              </div>
            </td>
            <td>
              <p>Needs</p>
              <div class="horiz items-space-between" v-for="item in agent.needs.items" :key="item.id">
                <div class="weight-1 m-2  ">{{item.item.name}}</div>
                <div class="weight-1">{{item.item.quantity}}</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
