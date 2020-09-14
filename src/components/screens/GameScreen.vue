<template>
  <div class="app verti items-center-top items-space-around text">
    <LocationDetails v-if="selectionMade" :location="selectedLocation" @close="closeDetails" />
    <TransactionsLedger v-if="showLedger" :transactions="game.getTransactions()" @close="closeLedger" />

    <div v-if="showMain" class="horiz self-right" style="width:100vw;">
      <div class="nes-container is-dark content dialog-container">
        <LocationList :locationList="game.getSimulationAgents()" @selectLocation="selectLocationHandler" />
        <div class="mt-50">
          <label>
            <input
              type="radio"
              class="nes-radio is-dark"
              name="answer-dark"
              checked
              v-on:click="gameTurn"
            />
            <span>Step</span>
          </label>

          <label>
            <input type="radio" class="nes-radio is-dark" name="answer-dark" v-on:click="showTransactions" />
            <span>Transactions</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LocationList from "../LocationList.vue";
import LocationDetails from "../LocationDetails.vue";
import TransactionsLedger from "../TransactionsLedger.vue";
import Game from "@/game/classes/Game";
import World from '@/game/classes/World';
import GameService from '@/game/services/GameService';

@Component({
  components: {
    LocationList,
    LocationDetails,
    TransactionsLedger
  },
})
export default class GameScreen extends Vue {
  public selectedLocation: Location | null = null;
  public selectionMade = false;
  public showLedger = false;
  public showMain = true;
  private game = new Game(new World(), new GameService());

  gameTurn() {
    this.game.turn();
  }

  showTransactions(){
    console.log('showing transactions')
    this.showLedger = true;
    this.showMain = false;
  }

  selectLocationHandler(location: Location) {
    this.selectedLocation = location;
    this.selectionMade = true;
    this.showMain = false;
  }

  closeDetails() {
    this.selectionMade = false;
    this.showMain = true;
  }

  closeLedger() {
    this.showLedger = false;
    this.showMain = true;
  }
}
</script>

<style lang="scss">
@import "./node_modules/linelay/defaultBuild.scss";

.text {
  color: white;
}
</style>
