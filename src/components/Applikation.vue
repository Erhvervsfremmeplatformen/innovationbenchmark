<template>
  <div class="applikation-container">
    <div class="innovationtest">
      <!-- <h1>Jeg er en h1</h1>
    <h2>Jeg er en h2</h2>
    <h3>Jeg er en h3</h3>
    <h4>Jeg er en h4</h4>
    <h5>Jeg er en h5</h5>
    <hr />
    Tid lige nu: {{ currentTime }}
    <hr />
    Dynamisk komponent:
    <dynamic-component text="Jeg er en dynamisk komponent"></dynamic-component>
    <hr />
    <a href="http://www.google.com" target="_blank">Link til Google</a>
    <hr />
    <hr />
    <button class="button button-primary">Jeg er en knap</button>
    <p id="tester">Blabla dupidup</p>
    <hr />
    <div>Datovælger</div>
    <div id="datepicker"><input ref="input" /></div>
    <hr /> -->
      <nav>
        <ul class="nav-list">
          <li v-for="(page, index) in testPages" v-bind:key="index">
            <button class="nav-button" disabled="{1 < index : true}" type="button">
              {{ page.title }}
            </button>
          </li>
          <!-- {testPages.map((page, index) => (
          <li key={index}>
            <button
              className={classNames(
                styles.button,
                { [styles.button_current]: currentPage === index + 1 },
                { [styles.button_past]: currentPage > index + 1 },
                { [styles.button_disabled]: currentPage < index },
              )}
              disabled={currentPage < index}
              type="button"
              onClick={() => handleClick(index)}
            >
              {page.title}
            </button>
          </li>
        ))} -->
        </ul>
      </nav>
      <div>Response fra Sanity</div>
      <div class="spinner" v-if="loadingResponse" aria-label="Henter indhold" />
      {{ response }}

      <div class="row">
        <div class="col-md-6 col-xs-12">
          <div class="card">
            <div class="card-header">
              <h2 class="">Inden du går i gang</h2>
            </div>
            <div class="card-text">
              <p>
                <strong>Vi behandler dine data fortroligt.</strong> Vi bruger dem til at vurdere innovationsindsatsen i din virksomhed, og dine
                resultater bliver udelukkende vist på din skærm og via de rapporter, du kan downloade. Du behøver ikke engang oplyse virksomheden navn
                mv.
              </p>
              <p>
                <strong>Dine data bliver anonymiserede</strong>, og vi vil på baggrund af disse have mulighed for at lave forskningsmæssige analyser,
                der gør innovationsværktøjet endnu bedre i fremtiden.
              </p>
              <p>Testen vil afdække virksomhedens innovationsniveau på følgende fire områder:</p>
              <ul>
                <li>Produkt</li>
                <li>Proces</li>
                <li>Organisation</li>
                <li>Markedsføring</li>
              </ul>
              <p>
                Efter du har vurderet indsatsen på de forskellige områder, vil du modtage et samlet resultat over innovationsindsatsen i virksomheden.
              </p>
            </div>
          </div>
        </div>
        <div class="col-md-6 col-xs-12">
          Eksempel på grid: Højre kolonne
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import { DateTime } from 'luxon';
import Pikaday from 'pikaday';
import sanityClient from '@sanity/client';
const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28', // use current UTC date - see "specifying API version"!
  // token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true // `false` if you want to ensure fresh data
});

var dynamicComponent = {
  template: '<div>{{text}}</div>',
  props: ['text']
};

@Component({
  name: 'Applikation',
  components: {
    dynamicComponent
  }
})
export default class Applikation extends Vue {
  private currentTime = '';
  private response = {};
  private error = {};
  private testPages = [
    { title: 'Start' },
    { title: 'Produkt' },
    { title: 'Proces' },
    { title: 'Organisation' },
    { title: 'Markedsføring' },
    { title: 'Resultat' }
  ];
  private loadingResponse = false;
  private datePicker!: Pikaday;

  mounted() {
    this.currentTime = DateTime.local().toISO();
    this.loadingResponse = true;
    this.callExternalApi();

    this.datePicker = new Pikaday({
      field: this.$refs.input as HTMLElement,
      format: 'DD/MM/YYYY',
      firstDay: 1, // mandag
      minDate: new Date(),
      container: document.getElementById('datepicker'),
      i18n: {
        previousMonth: 'Forrige måned',
        nextMonth: 'Næste måned',
        months: ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'July', 'August', 'September', 'Oktober', 'November', 'December'],
        weekdays: ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],
        weekdaysShort: ['Søn', 'Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør']
      },
      onSelect: (date: Date) => this.$emit('select', date)
    });
    this.datePicker.setDate(new Date(), true);
  }

  private async callExternalApi() {
    const query = `*[_type == "test1"] {
  fields
}[0]`;
    // const params = {minSeats: 2}

    client
      .fetch(query)
      .then(cases => {
        console.log(cases);
        this.loadingResponse = false;
        this.response = cases;
        // bikes.forEach(bike => {
        //   console.log(`${bike.name} (${bike.seats} seats)`);
        // });
      })
      .catch((error: any) => {
        this.error = error;
      });

    // axios
    //   .get('https://httpbin.org/get')
    //   .then((rsp: any) => {
    //     this.response = rsp;
    //     this.loadingResponse = false;
    //   })
    //   .catch((error: any) => {
    //     this.error = error;
    //   });
  }
}
</script>
<style lang="scss" scoped>
$colorOrange: #d23f1e;
$colorPrimary: $colorOrange;

.innovationtest {
  ul.nav-list {
    margin: 0;
    padding: 24px 0 16px;
    list-style: none;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid grey;
    counter-reset: page;
    position: relative;
    max-width: none !important;

    @include media-breakpoint-up(sm) {
      padding: 24px 20%;
    }

    li {
      flex: 0 1 auto;
      width: calc(100% / 6);
      max-width: calc(100% / 6);
      text-align: center;
      display: flex;
      justify-content: center;

      &:before {
        content: none;
      }
    }

    &:after {
      content: '';
      width: 90%;
      height: 1px;
      background-color: $colorPrimary;
      position: absolute;
      left: 5%;
      right: 5%;
      top: 36px;

      @include media-breakpoint-up(sm) {
        left: 25%;
        right: 25%;
        width: 50%;
      }
    }
  }

  .nav-button {
    background: transparent;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0;
    position: relative;
    color: transparent;
    cursor: pointer;

    @include media-breakpoint-up(sm) {
      color: inherit;
    }

    &:before {
      content: counter(page);
      counter-increment: page;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: block;
      color: $colorPrimary;
      line-height: 24px;
      border: 1px solid $colorPrimary;
      margin-bottom: 4px;
      // background-color: $colorBackground;
      z-index: 1;
    }

    &_current {
      color: inherit;
      &:before {
        background-color: $colorPrimary;
        // color: $colorGrey_light;
      }
    }

    &_past {
      &:before {
        content: '';
        // color: $colorGrey_light;
        // background: $colorPrimary url('../../public/img/check-white.svg') center/16px no-repeat;
      }
    }

    &_disabled {
      pointer-events: none;
    }
  }
}
</style>
