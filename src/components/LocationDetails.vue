<template>
  <div class="horiz self-right" style="width:100vw;">
    <div class="nes-container is-dark content dialog-container">
      <button class="self-end" @click="close">X</button>
      <div>
        <p>{{location.name}}</p>
        <p>Wallet Funds</p>
        <p>${{location.wallet.funds}}</p>
        <p>Inventory</p>
        <div
          class="horiz items-space-between"
          v-for="item in location.inventory.items"
          :key="item.id"
        >
            <div class="weight-1 m-2">{{item.name}}</div>
            <div class="weight-1">{{item.quantity}}</div>
        </div>
        <p>Needs</p>
        <div class="horiz items-space-between" v-for="item in location.needs.items" :key="item.id">
            <div class="weight-1 m-2">{{item.item.name}}</div>
            <div class="weight-1">{{item.item.quantity}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LocationDetails extends Vue {
  @Prop() private location?: Location;

  close() {
    this.$emit('close');
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
