<template>
  <div class="home">
    <p>首页</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {

  },
})
export default class Home extends Vue {}
</script>
