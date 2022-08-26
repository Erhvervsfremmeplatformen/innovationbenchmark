<template>
  <div>
    <div id="app" class="app-body" tabindex="-1">
      <GlobalSvgIcons></GlobalSvgIcons>
      <div class="flexgrow container pt-8 pb-8">
        <Applikation />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-property-decorator';
import * as DKFDS from 'dkfds';
import Applikation from '@/components/Applikation.vue';
import GlobalSvgIcons from '@/components/GlobalSvgIcons.vue';

@Options({
  components: {
    GlobalSvgIcons,
    Applikation
  }
})
export default class App extends Vue {
  mounted() {
    DKFDS.init();
  }
}
</script>
<style lang="scss">
@import 'styles/_app.scss';
</style>
