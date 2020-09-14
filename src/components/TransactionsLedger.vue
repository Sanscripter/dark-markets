<template>
  <div class="horiz self-right" style="width:100vw;">
    <div class="nes-container is-dark content dialog-container">
      <div class="horiz">
        <div class="weight-4">
          <table>
            <thead>
              <th class="w-200">Buyer</th>
              <th class="w-200">Seller</th>
              <th class="w-200">Item</th>
              <th class="w-200">Price</th>
            </thead>
            <tbody>
              <tr v-for="transaction in transactions" :key="transaction.id">
                <td>{{transaction.buyer.name}}</td>
                <td>{{transaction.seller.name}}</td>
                <td>{{transaction.item.name}}</td>
                <td>{{transaction.price}}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <button class="self-start" @click="close">X</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Transaction from '@/game/classes/Transactions';
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class TransactionsLedger extends Vue {
  @Prop() private transactions?: Transaction[];

  close() {
    this.$emit("close");
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
