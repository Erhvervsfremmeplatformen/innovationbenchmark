<template>
  <div>
    <div id="app" class="app-body" tabindex="-1">
      <div class="flexgrow container pt-8 pb-8">
        <Applikation />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Applikation from '@/components/Applikation.vue';
import * as DKFDS from 'dkfds';
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    Applikation
  },
  provide() {
    return {
      siteIkoner: {}
    };
  },
  mounted() {
    DKFDS.init();
  }
});
</script>
<style lang="scss">
@use 'styles/_app.scss';
</style>
