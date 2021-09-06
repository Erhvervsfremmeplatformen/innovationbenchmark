<template>
  <footer class="globalFooter" data-cy="global-footer" role="contentinfo">
    <div class="footer-header">
      <a href="#" class="logo" aria-label="Virksomhedsguiden" title="Virksomhedsguiden"></a>
      <p class="byline">Virksomhedsguiden er en fællesoffentlig digital erhvervsfremmeplatform</p>
      <p class="quotes">Find viden og værktøjer om start, drift og udvikling af din virksomhed</p>
    </div>
    <div class="links-container">
      <div class="row footer-link__row">
        <div class="container col-12 col-sm-12 col-md-4 col-lg-4">
          <h2 class="col-title">Temaer</h2>
          <div data-v-67ada9f4="">
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-bliv-klar-til-brexit" href="#" data-cy="icon-link">Bliv klar til Brexit</a></div>
            </div>
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-start-din-egen-virksomhed" href="#" data-cy="icon-link">Start din egen virksomhed</a></div>
            </div>
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-dataetik" href="#" data-cy="icon-link">Dataetik</a></div>
            </div>
          </div>
        </div>
        <div class="container col-12 col-sm-12 col-md-4 col-lg-4">
          <h2 class="col-title">Om siden</h2>
          <div data-v-67ada9f4="">
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-cookies" href="#" class="" data-cy="icon-link">Cookies</a></div>
            </div>
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-privatlivspolitik" href="#" class="" data-cy="icon-link">Privatlivspolitik</a></div>
            </div>
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div>
                <a id="external-link-tilgængelighedserklæring" rel="noopener external" href="#" data-cy="icon-link" class="icon-link">
                  Tilgængelighedserklæring
                  <svg class="icon-svg">
                    <use xlink:href="#open-in-new"></use>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div class="container col-12 col-sm-12 col-md-4 col-lg-4">
          <h2 class="col-title">Hjælp</h2>
          <div data-v-67ada9f4="">
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-om-virksomhedsguiden" href="#" class="" data-cy="icon-link">Om Virksomhedsguiden</a></div>
            </div>
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div><a id="internal-link-kontakt-vores-kundecenter" href="#" class="" data-cy="icon-link">Kontakt vores kundecenter</a></div>
            </div>
            <div data-cy="globalFooterLinkContainer" class="globalFooterLinkContainer">
              <div>
                <a id="external-link-få-siden-læst-op" rel="noopener external" href="#" data-cy="icon-link" class="icon-link">
                  Få siden læst op
                  <svg class="icon-svg">
                    <use xlink:href="#open-in-new"></use>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'globalFooter'
})
export default class GlobalFooter extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../styles/globalFooter';
</style>
