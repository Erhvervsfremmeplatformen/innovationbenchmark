<template>
  <ul class="nav-primary">
    <li id="vejledning-menu-item">
      <a
        id="vejledning-menu-link"
        href="#"
        class="nav-link"
        data-cy="nav-vejledning"
      >
        <span>Vejledning</span>
      </a>
    </li>
    <li id="temaer-menu-item">
      <a
        id="temaer-menu-link"
        href="#"
        class="nav-link"
        data-cy="nav-temaer"
      >
        <span>Temaer</span>
      </a>
    </li>
    <li id="skabeloner-menu-item">
      <a
        id="skabeloner-menu-link"
        href="#"
        class="nav-link"
        data-cy="nav-skabeloner"
      >
        <span>Skabeloner</span>
      </a>
    </li>
    <li id="tilbud-menu-item">
      <a href="#" class="nav-link" data-cy="nav-tilbud-search">
        <span>Events og tilbud</span>
      </a>
    </li>
    <li id="soeg-menu-item">
      <a href="#" class="nav-link search" data-cy="nav-artikel-search">
        <svg class="icon-svg search-logo">
          <use xlink:href="#magnify" />
        </svg>
        <span>Søg</span>
      </a>
    </li>
  </ul>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'MenuItems'
})
export default class MenuItems extends Vue {

}
</script>
