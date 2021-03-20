<template>
  <div class="home">
    <GameScreen/>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GameScreen from '@/components/GameScreen.vue'; // @ is an alias to /src

@Options({
  components: {
    GameScreen,
  },
})
export default class Home extends Vue {

}
</script>
