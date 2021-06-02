<template>
  <header class="header" data-cy="global-header">
    <div class="portal-header">
      <div class="container portal-header-inner content-header-inner">
        <a href="#"
          class="logo"
          data-cy="logo"
          aria-label="Virksomhedsguiden"
          title="Virksomhedsguiden"
        />
        <button
          id="openMenu"
          class="button button-tertiary button-menu-open js-menu-open ml-auto d-print-none button-mobilmenu"
          aria-haspopup="menu"
          title="Åben mobil menu"
        >
          <img
            src="@/assets/menu.svg"
            alt="menu-icon"
            title="Åben mobil menu"
          />
          <span>Menu</span>
        </button>
        <div class="portal-info">
          <MenuItems v-if="!showMobilMenu" />
        </div>
      </div>
    </div>
    <div class="overlay"></div>
    <nav class="nav" aria-label="Hovedmenu">
      <button
        class="button button-tertiary button-menu-close js-menu-close"
        title="Menu"
      >
        <svg class="icon-svg" focusable="false" aria-hidden="true"><use xlink:href="#close"></use></svg>
        <span>Luk</span>
      </button>
      <div class="portal-info-mobile">
        <MenuItems v-if="showMobilMenu" />
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MenuItems from '@/components/MenuItems.vue';

@Component({
  name: 'globalNav',
  components: {
    MenuItems
  }
})
export default class GlobalNav extends Vue {
  private windowWidth: number = window.innerWidth;

  private get showMobilMenu(): boolean {
    return this.windowWidth <= 992;
  }

  mounted() {
    window.addEventListener('resize', () => {
      this.windowWidth = window.innerWidth;
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import '../styles/globalNav';
</style>
