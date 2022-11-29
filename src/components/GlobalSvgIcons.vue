<template>
  <div class="hide-base-svg">
    <svg xmlns="http://www.w3.org/2000/svg">
      <symbol id="open-in-new" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z" />
      </symbol>
      <symbol id="check" viewBox="0 0 24 24">
        <path fill="currentColor" d="M21 7L9 19l-5.5-5.5 1.41-1.41L9 16.17 19.59 5.59 21 7z" />
      </symbol>
      <symbol id="minus" viewBox="0 0 24 24">
        <path d="M19 13H5v-2h14v2z" />
      </symbol>
      <symbol id="plus" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </symbol>
      <symbol id="download" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"
        />
        <path fill="none" d="M0 0h24v24H0z" />
      </symbol>
    </svg>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-property-decorator';

@Options({
  name: 'GlobalSvgIcons'
})
export default class GlobalSvgIcons extends Vue {}
</script>

<style scoped lang="scss"></style>
