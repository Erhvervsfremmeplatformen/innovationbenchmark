<template>
  <div class="applikation-container">
    <div class="innovationtest">
      <h1 class="sr-only">Innovation Benchmark</h1>
      <template v-if="frontPageMatter && currentSection == 'frontpage'">
        <div class="hero-element">
          <div
            alt='""'
            class="hero"
            :data-src="apiBaseUrl + '/img/heroImage.jpg'"
            lazy="loaded"
            style="background-image: url('https://innovationbenchmark.dk/img/heroImage.jpg')"
          ></div>
        </div>
        <div class="row">
          <div class="col-12 col-xs-12 col-sm-8 col-md-6 offset-md-6 col-lg-6 offset-lg-6 col-xl-6">
            <div class="hero-boks">
              <h2 class="h1" v-html="frontPageMatter.headline"></h2>
              <p class="hero-boks-beskrivelse">
                {{ frontPageMatter.lead }}
              </p>
              <div class="link">
                <div>
                  <button class="arrowLink" @click.prevent="goToTest1">
                    {{ frontPageMatter.cta_text }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-padding mb-8"></div>
        <div class="row frontPageMatter">
          <template v-for="(card, index) of frontPageMatter.cards" :key="'frontPageMatterCards' + index">
            <div class="col-md-6" style="margin-bottom: 32px">
              <div :class="['card', [0, 6, 7].includes(index) ? 'card-transparent' : '', [1].includes(index) ? 'prosAndCons' : '']">
                <div class="card-header">
                  <h2 v-if="[0].includes(index)">{{ card.cardHeadline }}</h2>
                  <h3 v-else-if="card.cardHeadline">{{ card.cardHeadline }}</h3>
                </div>
                <div class="card-text" v-html="sanityBlocks(card.cardBody)"></div>
                <div v-if="card.cardButtonText" class="card-footer card-action">
                  <a
                    :href="
                      card.cardButtonUrl.includes('http') || card.cardButtonUrl == '/test' ? card.cardButtonUrl : apiBaseUrl + card.cardButtonUrl
                    "
                    :data-url="card.cardButtonUrl"
                    target="_blank"
                    :class="[
                      'button',
                      'custom-button',
                      [0].includes(index) ? ['button-primary', 'custom-button-primary'] : ['button-secondary', 'custom-button-secondary']
                    ]"
                    :title="card.cardButtonText === 'Se mere' ? `Se mere om ${card.cardHeadline}` : card.cardButtonText"
                    @click="resolveUrl"
                  >
                    <svg
                      v-if="card.cardButtonUrl.includes('http') || card.cardButtonUrl !== '/test'"
                      class="icon-svg"
                      focusable="false"
                      aria-hidden="true"
                    >
                      <use xlink:href="#open-in-new"></use></svg
                    >{{ card.cardButtonText }}</a
                  >
                </div>
              </div>
            </div>
            <div v-if="[1, 5].includes(index)" :key="index" class="col-md-12" style="margin-bottom: 0">
              <hr />
              <h2 v-if="[1].includes(index)">Mere inspiration til din virksomhed</h2>
            </div>
          </template>
        </div>
      </template>

      <template v-if="currentSection == 'test1' || currentSection == 'test2'">
        <!-- ADD SIMPLE FORM -->
        TODO: AJP - ERF-7566 - handle simple form
      </template>
    </div>
  </div>
</template>

// TODO: AJP - ERF-7566 - use mock data ...

<script lang="ts">
import { Watch, Vue, Options } from 'vue-property-decorator';
import axios, { AxiosError, AxiosResponse } from 'axios';
import sanityClient from '@sanity/client';
const blocksToHtml = require('@sanity/block-content-to-html');
import SimpleForm from 'vue-simpleform';
import VueApexCharts from 'vue3-apexcharts';
import { FrontPageMatter, Results1, Results2, Test1, Test2 } from '@/types/response';
import { SanityBlock } from '@/types/sanity-block';
import { SliderField } from '@/types/types';
import { barOptions, chartColors } from '../bar-utils';
import { data1, data2, data3 } from '../mock-data';
import { nextTick } from 'vue';

const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28',
  useCdn: true
});

@Options({
  name: 'Applikation',
  components: {
    SimpleForm,
    apexchart: VueApexCharts
  },
  methods: {
    barOptions
  }
})
export default class Applikation extends Vue {
  // initial data values
  currentSection = 'frontpage'; // frontpage, test1, test2 - initial frontpage
  currentStep = 1; // initial 1
  pageCount = 1; // initial 1
  maxStep = 1;
  apiBaseUrl = 'https://innovationbenchmark.dk';
  isLoading = false;
  error = '';
  errorHeading = '';
  sessionId = this.generateId(32);
  test1: Test1 | null = null;
  test2: Test2 | null = null;
  values: string[] = [];
  frontPageMatter: FrontPageMatter | null = null;
  results1: Results1 | null = null;
  results2: Results2 | null = null;
  initialValues = {
    virk_navn: '',
    industri: 0,
    navn: '',
    stilling: '',
    prod_vurd: 1,
    prcs_vurd: 1,
    org_vurd: 1,
    mar_vurd: 1,
    prod1: 1,
    prod2: 1,
    prod3: 1,
    prcs1: 0,
    prcs2: 0,
    prcs3: 0,
    org1: 0,
    org2: 0,
    org3: 0,
    mar1: 0,
    mar2: 0,
    mar3: 0,
    mar4: 0,
    mar5: 0,
    mar6: 0,
    feature2_inno: 0,
    feature2_industri: 0,
    feature2_storrelse: 0,
    feature2_kvu: '1',
    feature2_mlvu: '1'
  };
  radarOptions = {
    colors: [chartColors.blue, chartColors.orange, chartColors.green],
    chart: {
      id: 'radar',
      foreColor: chartColors.textColor,
      fontFamily: 'IBMPlexSans, system',
      offsetY: -25,
      toolbar: {
        show: false
      },
      events: {
        mounted: function () {
          const radarPolygon = document.querySelector('.innovationtest .apexcharts-radar-series polygon') as HTMLInputElement;
          if (radarPolygon) {
            radarPolygon.style.fill = 'white';
          }
          document.querySelectorAll<HTMLElement>('.innovationtest .apexcharts-legend-marker').forEach(marker => {
            marker.style.borderWidth = '1px';
            marker.style.marginRight = '8px';
          });
        },
        updated: function () {
          const radarPolygon = document.querySelector('.innovationtest .apexcharts-radar-series polygon') as HTMLInputElement;
          if (radarPolygon) {
            radarPolygon.style.fill = 'white';
          }
          document.querySelectorAll<HTMLElement>('.innovationtest .apexcharts-legend-marker').forEach(marker => {
            marker.style.borderWidth = '1px';
            marker.style.marginRight = '8px';
          });
        }
      }
    },
    stroke: {
      width: 1,
      colors: [chartColors.blueSolid, chartColors.orangeSolid, chartColors.greenSolid]
    },
    xaxis: {
      categories: ['Produkt', 'Markedsføring', 'Organisation', 'Proces'],
      labels: {
        style: {
          colors: [chartColors.textColor, chartColors.textColor, chartColors.textColor, chartColors.textColor]
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: 8,
        style: {
          colors: [chartColors.textColor],
          fontWeight: 700,
          fontSize: 14
        }
      }
    },
    legend: {
      fontSize: '14px',
      itemMargin: {
        horizontal: 8,
        vertical: 8
      },
      offsetY: -25,
      markers: {
        width: 20,
        height: 20,
        radius: 5,
        strokeWidth: 1,
        strokeColor: [chartColors.blueSolid, chartColors.orangeSolid, chartColors.greenSolid]
      }
    }
  };
  expandedContent = '';

  get test1BarCharts() {
    if (!this.results1) {
      return null;
    }

    return [
      {
        id: 'prod',
        series: [
          {
            name: 'Produkt',
            data: [this.results1.simpleList.prod_vurd, this.results1.simpleList.prod_gruppe, this.results1.simpleList.prod_andre]
          }
        ],
        options: barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [chartColors.blue, chartColors.orange, chartColors.green],
          5,
          false,
          [chartColors.blueSolid, chartColors.orangeSolid, chartColors.greenSolid],
          'Produkt',
          true,
          undefined,
          '',
          ''
        ),
        intro:
          'Nedenfor kan du se, hvor produktinnovativ din virksomhed er sammenlignet med andre danske fremstillingsvirksomheder. Fordelingerne for de enkelte brancher er relativt ens, og derfor er der ingen yderligere opdeling.',
        expands: [...Array(4)].map((_, index) => {
          const labels = [
            'Produkter, der er nye på verdensplan',
            'Produkter, der er nye for virksomhedens marked',
            'Produkter, der er nye for virksomheden',
            'Virksomhedens samlede placering'
          ];
          return {
            series: [
              {
                name: labels[index],
                data: this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => item.Value)
              }
            ],
            options: barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`prod_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]
                ) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`]) {
                  return chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blue;
                }

                return chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`]) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blueSolid;
                }

                return chartColors.greenSolid;
              }), // strokes
              labels[index], // title
              true, // tooltipsenabled
              this.results1?.histogramList[`prod_hist${index + 1}_tooltip`].map(item => item.Value), // tooltips
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]
                ) {
                  return 'pattern';
                }

                return 'solid';
              }), // types
              '', // xasis
              this.results1?.simpleList[`prod_hist${index + 1}_text_left`] // yasis
            )
          };
        })
      },
      {
        id: 'prcs',
        series: [
          {
            name: 'Proces',
            data: [this.results1?.simpleList.prcs_vurd, this.results1?.simpleList.prcs_gruppe, this.results1?.simpleList.prcs_andre]
          }
        ],
        options: barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [chartColors.blue, chartColors.orange, chartColors.green],
          5,
          false,
          [chartColors.blueSolid, chartColors.orangeSolid, chartColors.greenSolid],
          'Proces',
          true,
          undefined,
          '',
          ''
        ),
        intro:
          'Nedenfor kan du se, hvor procesinnovativ og automatiseret din virksomhed er sammenlignet med andre danske fremstillingsvirksomheder. Fordelingerne for de enkelte brancher er relativt ens, og derfor er der ingen yderligere opdeling.',
        expands: [...Array(4)].map((_, index) => {
          const labels = ['Fremstillingen', 'Pakningen', 'Lagringen', 'Virksomhedens samlede placering'];
          return {
            series: [
              {
                name: labels[index],
                data: this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => item.Value)
              }
            ],
            options: barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]
                ) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`]) {
                  return chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blue;
                }

                return chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`]) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blueSolid;
                }

                return chartColors.greenSolid;
              }), // strokes
              labels[index], // title
              true, // tooltipsenabled
              this.results1?.histogramList[`prcs_hist${index + 1}_tooltip`].map(item => item.Value), // tooltips
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]
                ) {
                  return 'pattern';
                }

                return 'solid';
              }), // types
              '', // xasis
              this.results1?.simpleList[`prcs_hist${index + 1}_text_left`] // yasis
            )
          };
        })
      },
      {
        id: 'org',
        series: [
          {
            name: 'Organisation',
            data: [this.results1?.simpleList.org_vurd, this.results1?.simpleList.org_gruppe, this.results1?.simpleList.org_andre]
          }
        ],
        options: barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [chartColors.blue, chartColors.orange, chartColors.green],
          5,
          false,
          [chartColors.blueSolid, chartColors.orangeSolid, chartColors.greenSolid],
          'Organisation',
          true,
          undefined,
          '',
          ''
        ),
        intro:
          'Nedenfor kan du se, hvor organisatorisk innovativ og decentraliseret din virksomhed er sammenlignet med andre danske fremstillingsvirksomheder. Fordelingerne for de enkelte brancher er relativt ens, og derfor er der ingen yderligere opdeling.',
        expands: [...Array(4)].map((_, index) => {
          const labels = ['Løsningsansvar', 'Tidsplanlægning', 'Selvstyrende grupper', 'Virksomhedens samlede placering'];
          return {
            series: [
              {
                name: labels[index],
                data: this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => item.Value)
              }
            ],
            options: barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`org_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]
                ) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`]) {
                  return chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blue;
                }

                return chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`]) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blueSolid;
                }

                return chartColors.greenSolid;
              }), // strokes
              labels[index], // title
              true, // tooltipsenabled
              this.results1?.histogramList[`org_hist${index + 1}_tooltip`].map(item => item.Value), // tooltips
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]
                ) {
                  return 'pattern';
                }

                return 'solid';
              }), // types
              '', // xasis
              this.results1?.simpleList[`org_hist${index + 1}_text_left`] // yasis
            )
          };
        })
      },
      {
        id: 'mar',
        series: [
          {
            name: 'Markedsføring',
            data: [this.results1?.simpleList.mar_vurd, this.results1?.simpleList.mar_gruppe, this.results1?.simpleList.mar_andre]
          }
        ],
        options: barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [chartColors.blue, chartColors.orange, chartColors.green],
          5,
          false,
          [chartColors.blueSolid, chartColors.orangeSolid, chartColors.greenSolid],
          'Markedsføring',
          true,
          undefined,
          '',
          ''
        ),
        intro:
          'Nedenfor kan du se, hvor innovativ virksomheden er ifm. introduktion af nye markedsføringstiltag sammenlignet med andre danske fremstillingsvirksomheder. Fordelingerne for de enkelte brancher er relativt ens, og derfor er der ingen yderligere opdeling.',
        expands: [...Array(7)].map((_, index) => {
          const labels = [
            'Produktdesign',
            'Indpakning',
            'Markedsføringsstrategier',
            'Promovering af produkter',
            'Eksponering',
            'Prissætning',
            'Virksomhedens samlede placering'
          ];
          return {
            series: [
              {
                name: labels[index],
                data: this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => item.Value)
              }
            ],
            width: index === 6 ? 50 : 25,
            options: barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`mar_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]
                ) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`]) {
                  return chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blue;
                }

                return chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`]) {
                  return chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]) {
                  return chartColors.blueSolid;
                }

                return chartColors.greenSolid;
              }), // strokes
              labels[index], // title
              true, // tooltipsenabled
              this.results1?.histogramList[`mar_hist${index + 1}_tooltip`].map(item => item.Value), // tooltips
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]
                ) {
                  return 'pattern';
                }

                return 'solid';
              }), // types
              '', // xasis
              this.results1?.simpleList[`mar_hist${index + 1}_text_left`] // yasis
            )
          };
        })
      }
    ];
  }

  get test2BarCharts() {
    if (!this.results2) {
      return null;
    }

    return {
      feature2: [
        {
          id: 'hist1_samlet_bins',
          title: `Alle virksomheder - Din sandsynlighed er ${this.results2.simpleList.din_ssh_samlet}%`,
          width: 50,
          subtitle: `Værdien for din virksomhed betyder, at af 100 virksomheder, som ligner din, vil ${this.results2.simpleList.din_ssh_samlet} have innovationsaktiviteter. Sammenligningen er udført med fremstillingsvirksomheder af alle størrelser og fra alle industrier. Under "Uddybende information" kan du se en sammenligning med virksomheder af din størrelse eller fra din industri (der tages forbehold for, at disse  beregninger forudsætter data af en vis mængde)`,
          myScore: this.results2.simpleList.hist1_my_bin,
          series: [
            {
              name: `Alle virksomheder - Din sandsynlighed er ${this.results2.simpleList.din_ssh_samlet}%`,
              data: this.results2.histogramList.hist1_samlet_bins.map(item => item.Value)
            }
          ],
          options: barOptions(
            true, // annimationenabled
            [undefined, this.results2.simpleList.hist1_my_bin], // annotation
            this.results2.histogramList.hist1_samlet_bins.map(item => item.Variable), // categories
            this.results2.histogramList.hist1_samlet_bins.map(item => {
              // colors
              if (item.Variable === this.results2?.simpleList.hist1_my_bin) {
                return chartColors.orange;
              }
              return chartColors.green;
            }),
            undefined, // max
            true, // showXLabels
            this.results2?.histogramList.hist1_samlet_bins.map(item => {
              // strokes
              if (item.Variable === this.results2?.simpleList.hist1_my_bin) {
                return chartColors.orangeSolid;
              }

              return chartColors.greenSolid;
            }),
            `Alle virksomheder - Din sandsynlighed er ${this.results2?.simpleList.din_ssh_samlet}%`, // title
            false, // tooltipenabled
            undefined, // tooltips
            undefined, // types
            this.results2?.simpleList.hist1_samlet_text_x_axis, // xaxis,
            this.results2?.simpleList.hist1_samlet_text_left // yaxis,
          ),
          expands: ['hist2_str', 'hist3_industri'].map((chartId, index) => {
            const labels = [
              `Samme størrelse - Din sandsynlighed er ${this.results2?.simpleList.din_ssh_str}%`,
              `Samme industri - Din sandsynlighed er ${this.results2?.simpleList.din_ssh_industri}%`
            ];
            const chartPrefix = ['hist2', 'hist3'];
            return {
              series: [
                {
                  name: labels[index],
                  data: this.results2?.histogramList[`${chartId}_bins`].map(item => item.Value)
                }
              ],
              subtitle: [
                `Værdien for din virksomhed betyder, at af 100 virksomheder, som ligner din, vil ${this.results2?.simpleList.din_ssh_str} have innovationsaktiviteter. Sammenligningen er udført med fremstillingsvirksomheder af alle industrier for din størrelsesgruppe.`,
                `Værdien for din virksomhed betyder, at af 100 virksomheder, som ligner din, vil ${this.results2?.simpleList.din_ssh_industri} have innovationsaktiviteter. Sammenligningen er udført med fremstillingsvirksomheder af alle størrelser i din industrigruppe.`
              ][index],
              value: this.results2?.simpleList[`${chartPrefix[index]}_my_bin`],
              options: barOptions(
                true, // animationsEnabled
                [undefined, this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]], // annotation
                this.results2?.histogramList[`${chartId}_bins`].map(item => item.Variable), // categories
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return chartColors.orange;
                  }

                  return chartColors.green;
                }), // colors
                undefined, // max
                true, // showXLabels
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return chartColors.orangeSolid;
                  }

                  return chartColors.greenSolid;
                }), // strokes
                labels[index], // title
                false, // tooltipsenabled
                undefined, // tooltips
                undefined, // types
                this.results2?.simpleList[`${chartId}_text_x_axis`], // xasis
                this.results2?.simpleList[`${chartId}_text_left`] // yasis
              )
            };
          })
        }
      ],
      feature3: [
        {
          id: 'hist7_samlet_bins',
          title: 'Ændring i profit pr. medarbejder',
          width: 50,
          subtitle: `Værdien for din virksomhed betyder, at din profit pr. medarbejder er ${this.results2?.histogramList.hist7_samlet_bins
            .filter(column => column.Variable === this.results2?.simpleList.hist7_my_bin)
            .map(
              column => column.Value
            )} kr. højere efter tre år med innovation end uden. De øvrige søjler viser værdien, hvis andelen af ansatte med videregående uddannelse havde været anderledes. Under "Uddybende information" kan du se en sammenligning med virksomheder af din størrelse eller fra din industri (der tages forbehold for, at disse beregninger forudsætter data af en vis mængde).`,
          myScore: this.results2?.simpleList.hist7_my_bin,
          series: [
            {
              name: 'Ændring i profit pr. medarbejder',
              data: this.results2?.histogramList.hist7_samlet_bins.map(item => item.Value)
            }
          ],
          options: barOptions(
            true, // annimationenabled
            [undefined, this.results2?.simpleList.hist7_my_bin], // annotation
            this.results2?.histogramList.hist7_samlet_bins.map(item => item.Variable), // categories
            this.results2?.histogramList.hist7_samlet_bins.map(item => {
              // colors
              if (item.Variable === this.results2?.simpleList.hist7_my_bin) {
                return chartColors.orange;
              }
              return chartColors.green;
            }),
            undefined, // max
            true, // showXLabels
            this.results2?.histogramList.hist7_samlet_bins.map(item => {
              // strokes
              if (item.Variable === this.results2?.simpleList.hist7_my_bin) {
                return chartColors.orangeSolid;
              }

              return chartColors.greenSolid;
            }),
            'Ændring i profit pr. medarbejder', // title
            false, // tooltipenabled
            undefined, // tooltips
            undefined, // types
            this.results2?.simpleList.hist7_samlet_text_x_axis, // xaxis,
            this.results2?.simpleList.hist7_samlet_text_left // yaxis,
          ),
          expands: ['hist8_str', 'hist9_industri'].map((chartId, index) => {
            const labels = ['Samme størrelse - Ændring i profit pr. medarbejder', 'Samme industri - Ændring i profit pr. medarbejder'];
            const chartPrefix = ['hist8', 'hist9'];
            return {
              series: [
                {
                  name: labels[index],
                  data: this.results2?.histogramList[`${chartId}_bins`].map(item => item.Value)
                }
              ],
              subtitle: `Værdien for din virksomhed betyder, at din profit pr. medarbejder er ${this.results2?.histogramList[`${chartId}_bins`]
                .filter(column => column.Variable === this.results2?.simpleList[`${chartId}_my_bin`])
                .map(
                  column => column.Value
                )} kr. højere efter tre år med innovation end uden. De øvrige søjler viser værdien, hvis andelen af ansatte med videregående uddannelse havde været anderledes.`,
              value: this.results2?.simpleList[`${chartPrefix[index]}_my_bin`],
              options: barOptions(
                true, // animationsEnabled
                [undefined, this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]], // annotation
                this.results2?.histogramList[`${chartId}_bins`].map(item => item.Variable), // categories
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return chartColors.orange;
                  }

                  return chartColors.green;
                }), // colors
                undefined, // max
                true, // showXLabels
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return chartColors.orangeSolid;
                  }

                  return chartColors.greenSolid;
                }), // strokes
                labels[index], // title
                false, // tooltipsenabled
                undefined, // tooltips
                undefined, // types
                this.results2?.simpleList[`${chartId}_text_x_axis`], // xasis
                this.results2?.simpleList[`${chartId}_text_left`] // yasis
              )
            };
          })
        },
        {
          id: 'hist4_samlet_bins',
          title: 'Ændring i produktivitetsvækst',
          width: 50,
          subtitle: `Værdien for din virksomhed betyder, at din produktivitetsvækst over tre år ${this.results2?.histogramList.hist4_samlet_bins
            .filter(column => column.Variable === this.results2?.simpleList.hist4_my_bin)
            .map(
              column => column.Value
            )}%-point med innovation end uden. De øvrige søjler viser værdien, hvis andelen af ansatte med videregående uddannelse havde været anderledes. Under "Uddybende information" kan du se en sammenligning med virksomheder af din størrelse eller fra din industri (der tages forbehold for, at disse beregninger forudsætter data af en vis mængde).`,
          myScore: this.results2?.simpleList.hist4_my_bin,
          series: [
            {
              name: 'Ændring i produktivitetsvækst',
              data: this.results2?.histogramList.hist4_samlet_bins.map(item => item.Value)
            }
          ],
          options: barOptions(
            true, // annimationenabled
            [undefined, this.results2?.simpleList.hist4_my_bin], // annotation
            this.results2?.histogramList.hist4_samlet_bins.map(item => item.Variable), // categories
            this.results2?.histogramList.hist4_samlet_bins.map(item => {
              // colors
              if (item.Variable === this.results2?.simpleList.hist4_my_bin) {
                return chartColors.orange;
              }
              return chartColors.green;
            }),
            undefined, // max
            true, // showXLabels
            this.results2?.histogramList.hist4_samlet_bins.map(item => {
              // strokes
              if (item.Variable === this.results2?.simpleList.hist4_my_bin) {
                return chartColors.orangeSolid;
              }

              return chartColors.greenSolid;
            }),
            'Ændring i produktivitetsvækst', // title
            false, // tooltipenabled
            undefined, // tooltips
            undefined, // types
            this.results2?.simpleList.hist4_samlet_text_x_axis, // xaxis,
            this.results2?.simpleList.hist4_samlet_text_left // yaxis,
          ),
          expands: ['hist5_str', 'hist6_industri'].map((chartId, index) => {
            const labels = ['Samme størrelse - Ændring i produktivitetsvækst', 'Samme industri - Ændring i produktivitetsvækst'];
            const chartPrefix = ['hist5', 'hist6'];
            return {
              series: [
                {
                  name: labels[index],
                  data: this.results2?.histogramList[`${chartId}_bins`].map(item => item.Value)
                }
              ],
              subtitle: `Værdien for din virksomhed betyder, at din produktivitetsvækst over tre år er ${this.results2?.histogramList[
                `${chartId}_bins`
              ]
                .filter(column => column.Variable === this.results2?.simpleList[`${chartId}_my_bin`])
                .map(
                  column => column.Value
                )}%-point med innovation end uden. De øvrige søjler viser værdien, hvis andelen af ansatte med videregående uddannelse havde været anderledes.`,
              value: this.results2?.simpleList[`${chartPrefix[index]}_my_bin`],
              options: barOptions(
                true, // animationsEnabled
                [undefined, this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]], // annotation
                this.results2?.histogramList[`${chartId}_bins`].map(item => item.Variable), // categories
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return chartColors.orange;
                  }

                  return chartColors.green;
                }), // colors
                undefined, // max
                true, // showXLabels
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return chartColors.orangeSolid;
                  }

                  return chartColors.greenSolid;
                }), // strokes
                labels[index], // title
                false, // tooltipsenabled
                undefined, // tooltips
                undefined, // types
                this.results2?.simpleList[`${chartId}_text_x_axis`], // xasis
                this.results2?.simpleList[`${chartId}_text_left`] // yasis
              )
            };
          })
        }
      ]
    };
  }

  generateId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  mounted() {
    if (window.location.hash.length > 0) {
      const hashLocation = window.location.hash.replace('#', '');

      if (hashLocation === 'test1') {
        this.goToTest1();
      } else if (hashLocation === 'test2') {
        this.goToTest2();
      } else if (hashLocation === 'frontpage') {
        this.goToFrontpage();
      }
    }

    this.fetchData();

    window.scrollTo(0, 0);
  }

  updated() {
    if (document.querySelectorAll('.innovationtest .calculatingSlider').length > 0) {
      const newElem = document.createElement('div');
      newElem.classList.add('calculatingSliders');
      const sliderArray: Element[] = [...document.querySelectorAll('.innovationtest .calculatingSlider')];
      const position = sliderArray[0].parentNode;
      sliderArray.forEach(item => {
        newElem.appendChild(item);
      });

      if (position) {
        position.appendChild(newElem);
      }
    }
  }

  @Watch('currentStep')
  @Watch('currentSection')
  onStepChanged() {
    window.scrollTo(0, 0);
    this.maxStep = this.maxStep > this.currentStep ? this.maxStep : this.currentStep;
    this.error = '';
    this.errorHeading = '';
  }

  @Watch('expandedContent')
  onExpandChanged(value: string) {
    if (value) {
      nextTick(() => {
        const element = this.$refs.expandedContentArea as HTMLElement[];
        const top = element[0].offsetTop;
        window.scrollTo(0, top);
      });
    }
  }

  goToFrontpage() {
    this.currentSection = 'frontpage';
    this.pageCount = 1;
    this.currentStep = 1;
  }

  goToTest1() {
    this.currentSection = 'test1';
    this.pageCount = 5;
    this.currentStep = 1;
  }

  goToTest2() {
    this.currentSection = 'test2';
    this.pageCount = 1;
    this.currentStep = 1;
  }

  resolveUrl(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const url = target.getAttribute('data-url');
    if (url && url.includes('http')) {
      return;
    }

    if (url === '/test') {
      event.preventDefault();
      this.goToTest1();
      return;
    }

    if (url === '/test2') {
      event.preventDefault();
      this.goToTest2();
      return;
    }

    if (url === '/frontpage') {
      event.preventDefault();
      this.goToFrontpage();
      return;
    }
  }

  getPDF(id: string) {
    this.isLoading = true;
    const pdfWindow = window.open('', '_blank');
    if (pdfWindow && pdfWindow.document) {
      pdfWindow.document.write('Henter PDF');
      const body = pdfWindow.document.querySelector('body');
      if (body) {
        body.style.cursor = 'wait';
        axios
          // TODO: som const
          .post(`${this.apiBaseUrl}/api/pdf`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...this.values, id, session_id: this.sessionId })
          })
          .then((rsp: AxiosResponse) => {
            if (!rsp.data.error) {
              const { PDFURL } = rsp.data;
              pdfWindow.location.href = PDFURL;
              body.style.cursor = 'auto';
            }
            this.isLoading = true;
          })
          .catch((error: AxiosError) => {
            pdfWindow.close();
          });
      }
    }
  }

  handleNextClick(event: Event) {
    event.preventDefault();
    this.currentStep++;
  }
  handlePreviousClick(event: Event) {
    event.preventDefault();
    this.currentStep--;
  }
  handleSubmit() {
    this.isLoading = true;
    // TODO: som const
    const url = this.currentSection === 'test1' ? `${this.apiBaseUrl}/api/put` : `${this.apiBaseUrl}/api/put-parathed`;
    axios
      .post(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...this.values, session_id: this.sessionId })
      })
      .then((rsp: AxiosResponse) => {
        this.errorHeading = '';
        this.error = '';
        this.isLoading = false;
        if (!rsp.data.error) {
          if (this.currentSection === 'test1') {
            this.results1 = rsp.data;
          }
          if (this.currentSection === 'test2') {
            this.results2 = rsp.data;
          }
          this.currentStep = this.pageCount + 1;
          this.isLoading = false;
        }
      })
      .catch((error: AxiosError) => {
        this.isLoading = false;
        this.errorHeading = 'Fejl';
        this.error = 'Noget gik galt. Prøv venligst igen.';
      });
  }

  validate(values: string[]) {
    this.values = values;
    return {
      email: 'Email is invalid'
    };
  }

  sanityBlocks(blocks: SanityBlock[]) {
    return blocksToHtml({
      blocks: blocks
    });
  }

  fetchData() {
    this.isLoading = true;
    const query = '*[_type == "test1"] | order(order asc)';
    const query2 = '*[_type == "test2"] | order(order asc)';
    const frontpageQuery = '*[_type == "frontpage"][0]';

    // TODO: AJP - ERF-7566 - Use API
    this.frontPageMatter = data1.result;
    this.test1 = data2.result as any;
    this.test2 = data3.result as any;

    // TODO: AJP - ERF-7566 - use mock data ...
    /*
    Promise.all<FrontPageMatter, Test1, Test2>([client.fetch(frontpageQuery), client.fetch(query), client.fetch(query2)])
      .then(response => {
        this.isLoading = false;
        this.frontPageMatter = response[0];
        this.test1 = response[1];
        this.test2 = response[2];
      })
      .catch((error: AxiosError) => {
        this.error = error.message;
      });
      */
  }

  calculateSliders(name: string, values: string[], fields: SliderField[], setValue: any) {
    const sliders = fields.filter(field => field._type === 'slider');
    const sum = sliders.reduce((accumulator, field: any) => accumulator + (Number(values[field.key]) - 1), 0);
    if (sum > 10) {
      setValue(name, '1');
      this.errorHeading = 'Bemærk!';
      this.error = `Svarprocenten for de ${sliders.length === 3 ? 'tre' : 'to'} spørgsmål må max. give 100% i alt`;
      window.scrollTo(0, 0);
    } else {
      this.errorHeading = '';
      this.error = '';
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/components/_applikation.scss';
</style>
