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
import * as DKFDS from 'dkfds';
import Applikation from '@/components/Applikation.vue';
import GlobalSvgIcons from '@/components/GlobalSvgIcons.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    GlobalSvgIcons,
    Applikation
  },

  mounted() {
    DKFDS.init();
  }
});
</script>
<style lang="scss">
@use 'styles/_app.scss';
</style>
