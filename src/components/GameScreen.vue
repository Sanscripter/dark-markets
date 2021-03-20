<template>
  <div>
    <button @click="nextTurn">presss</button>
    <div class="flex" v-if="gameState.length > 0">
      <div v-for="city in gameState" :key="city.id">
        <p>{{ city.name }}</p>
        <h4>Inventory</h4>
        <ul v-if="city.inventory.items">
          <li v-for="key in Object.keys(city.inventory.items)" :key="key">
            {{ city.inventory.items[key].name }} -
            {{ city.inventory.items[key].quantity }}
          </li>
        </ul>
      </div>
    </div>

    <h1>Ledger</h1>
    <table>
      <thead>
        <th>Id</th>
        <th>Buyer</th>
        <th>Seller</th>
        <th>Price ($)</th>
        <th>Day</th>
      </thead>
      <tbody>
        <tr v-for="transaction in gameTransactions.slice().reverse()" :key="transaction.id">
          <td>{{ transaction.id }}</td>
          <td>{{ transaction.buyer.name }}</td>
          <td>{{ transaction.seller.name }}</td>
          <td>{{ transaction.price }}</td>
          <td>{{ transaction.day }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Vue } from "vue-class-component";
import Game from "@/game/classes/controllers/Game";
import World from "@/game/classes/World";
import GameService from "@/game/classes/services/GameService";

export default class GameScreen extends Vue {
  private world = new World();
  private gameService = new GameService();
  private game = new Game(this.world, this.gameService);
  public gameState = {};
  public gameTransactions = [];
  private interval = 0;

  nextTurn() {
    this.game.turn();
    this.gameTransactions = this.game.getTransactions();
    this.gameState = this.game.getSimulationAgents();
    if (this.interval > 0) {
      clearInterval(this.interval);
      this.interval = 0;
      return;
    }
    this.interval = setInterval(() => {
      this.game.turn();
      this.gameTransactions = this.game.getTransactions();
      this.gameState = this.game.getSimulationAgents();
    }, 100);
  }
}
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.flex > div {
  width: 200px;
}
p {
  overflow-y: scroll;
  height: 300px;
}
pre {
  font-family: Consolas, "courier new";
  color: crimson;
  background-color: #f1f1f1;
  width: 80%;
}
</style>
