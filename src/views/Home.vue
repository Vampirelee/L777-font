<template>
  <div class="home">
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import pcaCode from "@/assets/pca-code";
import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

@Component({
  components: {

  },
})

export default class Home extends Vue {
  private pcaCode =  pcaCode;
  private curShowProvinceCode = '13';
  private curShowCityCode = '1301';
  private checkProvince = [];
  private checkCities = [];
  private checkTowns = [];
  private created() {
    console.log(this.pcaCode);
  }
  private initShowArea() {

  }
}
</script>

<style lang="scss">
  .home{
    ul{
      list-style: none;
    }


  }
</style>
