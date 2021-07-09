<template>
  <div class="applikation-container">
    <div class="innovationtest">
      <template v-if="frontPageMatter && currentSection == 'frontpage'">
        <template>
          <div class="hero-element">
            <div
              alt='""'
              class="hero"
              :data-src="apiBaseUrl + '/img/heroImage.jpg'"
              lazy="loaded"
              style="background-image: url('https://innovationbenchmark.dk/img/heroImage.jpg');"
            ></div>
          </div>
          <div class="row">
            <div class="col-12 col-xs-12 col-sm-8 col-md-6 offset-md-6 col-lg-6 offset-lg-6 col-xl-6">
              <div class="hero-boks">
                <p class="h1" v-html="frontPageMatter.headline"></p>
                <p class="hero-boks-beskrivelse">
                  {{ frontPageMatter.lead }}
                </p>
                <div class="link">
                  <div>
                    <a class="arrowLink" @click.prevent="currentSection = 'test1'">
                      {{ frontPageMatter.cta_text }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <div class="hero-padding mb-8"></div>
        <div class="row">
          <div class="col-md-6" v-for="(card, index) of frontPageMatter.cards" :key="index">
            <div :class="['card', [0, 3, 4, 5, 6].includes(index) ? 'card-transparent' : '']">
              <div class="card-header">
                <h2>{{ card.cardHeadline }}</h2>
              </div>
              <div class="card-text" v-html="sanityBlocks(card.cardBody)"></div>
              <div class="card-footer card-action" v-if="card.cardButtonText">
                <a
                  :href="card.cardButtonUrl.includes('http') || card.cardButtonUrl == '/test' ? card.cardButtonUrl : apiBaseUrl + card.cardButtonUrl"
                  :data-url="card.cardButtonUrl"
                  :target="card.cardButtonUrl.includes('http') || card.cardButtonUrl !== '/test' ? '_blank' : ''"
                  @click="resolveUrl"
                  :class="[
                    'button',
                    'custom-button',
                    [0].includes(index) ? ['button-primary', 'custom-button-primary'] : ['button-secondary', 'custom-button-secondary']
                  ]"
                  >{{ card.cardButtonText }}</a
                >
              </div>
            </div>
          </div>
        </div>
        <!-- <img :src="apiBaseUrl + '/img/heroImage.jpg'" /> -->
      </template>

      <template v-if="currentSection == 'test1'">
        <h1>Tag innovationstesten</h1>
        <SimpleForm :value="initialValues" :validate="validate" @submit="handleSubmit">
          <template slot-scope="{ values, errors, touched, input, blur, setValue, setTouched, handleSubmit, submitted, submitting }">
            <nav>
              <ul class="nav-list">
                <li v-for="(page, index) in response" v-bind:key="index">
                  <button
                    :class="['nav-button', currentStep > index + 1 ? 'nav-button-past' : '', currentStep === index + 1 ? 'nav-button-current' : '']"
                    :disabled="currentStep < index && currentStep > maxStep"
                    type="button"
                    :data-step="currentStep"
                    @click.prevent="index == pageCount ? handleSubmit() : (currentStep = index + 1)"
                  >
                    <svg v-if="currentStep > index + 1" class="icon-svg" focusable="false" aria-hidden="true"><use xlink:href="#check"></use></svg>
                    {{ page.shortTitle }}
                  </button>
                </li>
              </ul>
            </nav>

            <div class="spinner" v-if="isLoading" aria-label="Henter indhold" />

            <div class="alert alert-error" role="alert" aria-atomic="true" v-if="error">
              <div class="alert-body">
                <p class="alert-heading">{{ errorHeading }}</p>
                <p class="alert-text" v-html="error" />
              </div>
            </div>

            <form v-if="!isLoading">
              <!-- <input type="email" v-on="{ input, blur }" name="email" :value="values.email" />
            <span class="error" v-if="touched('email') && errors('email')">{{ errors('email') }}</span> -->

              <template v-for="(step, index) in response">
                <div v-if="currentStep === index + 1" :key="index">
                  <div class="row">
                    <div class="col-md-6 col-xs-12">
                      <div class="card">
                        <div class="card-header">
                          <h2 class="">{{ response[index].headline }}</h2>
                        </div>
                        <div class="card-text" v-html="sanityBlocks(response[index].text)"></div>
                      </div>
                    </div>
                    <div class="col-md-6 col-xs-12">
                      <fieldset :class="['row', step.calculatingSliders ? 'calculatingSliders' : '']" v-if="response[index].fields.length > 0">
                        <div
                          v-for="field in response[index].fields"
                          v-bind:key="field._id"
                          :class="['formWrapper', field.width == 50 ? 'col-6' : 'col-12']"
                        >
                          <div class="form-group" v-if="field._type === 'textinput'">
                            <label class="form-label" :for="field.key">
                              {{ field.label }}
                            </label>

                            <input
                              class="form-input"
                              v-on="{ input, blur }"
                              :id="field.key"
                              :value="values[field.key]"
                              :name="field.key"
                              type="text"
                              :placeholder="field.placeholder"
                            />
                          </div>

                          <div class="form-group" v-else-if="field._type === 'select'">
                            <label class="form-label" for="options">{{ field.label }}</label>
                            <select
                              :class="['form-select', values[field.key] !== 0 ? 'active' : '']"
                              :name="field.key"
                              id="options"
                              v-on="{ input, blur }"
                            >
                              <option disabled selected value="0">{{ field.placeholder }}</option>
                              <option v-for="(option, index) in field.options" :value="index + 1" :key="index + 1">{{ option }}</option>
                            </select>
                          </div>

                          <div class="form-group" v-else-if="field._type === 'radiobuttons'">
                            <fieldset>
                              <legend class="h5">{{ field.label }}</legend>
                              <p>{{ field.description }}</p>
                              <ul class="nobullet-list">
                                <li v-for="(option, index) in field.options" :key="index">
                                  <input
                                    v-on="{ input, blur }"
                                    :id="field.key + '_' + index"
                                    type="radio"
                                    :name="field.key"
                                    :value="index + 1"
                                    class="form-radio"
                                    :checked="values[field.key] === (index + 1).toString()"
                                  />
                                  <label :for="field.key + '_' + index" id="form-label-radio-1" class="">{{ option }}</label>
                                </li>
                              </ul>
                            </fieldset>
                          </div>

                          <div class="form-group" v-else-if="field._type === 'slider'">
                            <label class="form-label" :for="field.key">{{ field.label }}</label>
                            <p class="formWrapper_description">{{ field.description }}</p>
                            <input
                              v-on="{ input, blur }"
                              type="range"
                              class="slider"
                              :id="field.key"
                              :name="field.key"
                              :value="values[field.key]"
                              :max="field.options.length"
                              min="1"
                              @change="step.calculatingSliders ? calculateSliders(field.key, values, step.fields, setValue) : null"
                            />
                            <div :class="['sliderOptions', values[field.key] !== 0 ? 'active' : '']">
                              <div
                                class="sliderBackground"
                                :style="{
                                  width:
                                    values[field.key] === 0
                                      ? 'calc(100% - 20px)'
                                      : `calc(100% - ${((values[field.key] - 1) / (field.options.length - 1)) * 100}% - ${
                                          20 * (1 - (values[field.key] - 1) / (field.options.length - 1))
                                        }px)`,
                                  left:
                                    values[field.key] === 0
                                      ? '20px'
                                      : `calc(${((values[field.key] - 1) / (field.options.length - 1)) * 100}% + ${
                                          20 * (1 - (values[field.key] - 1) / (field.options.length - 1))
                                        }px)`
                                }"
                              />
                              <div
                                v-for="(option, index) in field.options"
                                :class="['sliderOptions_item', index + 1 == values[field.key] ? 'selected' : '']"
                                :key="option"
                              >
                                {{ option }}
                              </div>
                            </div>
                          </div>

                          <div class="form-group" v-else>
                            {{ field.type }}
                          </div>
                        </div>
                      </fieldset>
                      <div v-else>
                        <apexchart
                          v-if="results.simpleList"
                          height="500px"
                          type="radar"
                          :options="radarOptions"
                          :series="[
                            {
                              name: 'Din vurdering',
                              data: [
                                results.simpleList.prod_vurd,
                                results.simpleList.mar_vurd,
                                results.simpleList.org_vurd,
                                results.simpleList.prcs_vurd
                              ]
                            },
                            {
                              name: 'Dit resultat',
                              data: [
                                results.simpleList.prod_gruppe,
                                results.simpleList.mar_gruppe,
                                results.simpleList.org_gruppe,
                                results.simpleList.prcs_gruppe
                              ]
                            },
                            {
                              name: 'Andre virksomheder',
                              data: [
                                results.simpleList.prod_andre,
                                results.simpleList.mar_andre,
                                results.simpleList.org_andre,
                                results.simpleList.prcs_andre
                              ]
                            }
                          ]"
                        ></apexchart>
                      </div>
                    </div>
                  </div>
                  <div class="row" v-if="currentStep === pageCount + 1 && results.simpleList" :key="index">
                    <div class="col-sm-3" v-for="(chart, index) of barCharts" :key="index">
                      <apexchart height="200px" type="bar" :options="chart.options" :series="chart.series"></apexchart>
                    </div>
                  </div>
                </div>
              </template>
            </form>

            <nav>
              <ul class="nav-bottom">
                <li>
                  <button
                    class="button button-primary custom-button custom-button-primary"
                    v-on:click="handleNextClick"
                    v-if="currentStep !== pageCount"
                  >
                    Næste
                  </button>
                  <button v-else @click.prevent="handleSubmit" class="button button-primary custom-button custom-button-primary">
                    Næste
                    <span class="spinner" />
                  </button>

                  <!-- <Button isLoading="{isLoading}" submitDisabled="{submitDisabled}" title="Næste" onClick="{handleNextClick}" /> -->
                </li>
                <li>
                  <!-- <Button buttonStyle="neutral" disabled={!showSkip} style={{ visibility: showSkip ? 'visible' : 'hidden' }}
                title="Spring over" onClick={handleSkip} /> -->
                </li>
                <li>
                  <button
                    class="button button-secondary custom-button custom-button-secondary"
                    v-on:click="handlePreviousClick"
                    :disabled="currentStep === 1"
                    :style="{ visibility: currentStep !== 1 ? 'visible' : 'hidden' }"
                  >
                    Tilbage
                  </button>
                  <!-- <Button buttonStyle="secondary" disabled={currentPage === 1} style={{ visibility: currentPage !== 1 ? 'visible' : 'hidden' }}
                title="Tilbage" onClick={handlePreviousClick} /> -->
                </li>
              </ul>
            </nav>
          </template>
        </SimpleForm>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator';
import axios from 'axios';
import sanityClient from '@sanity/client';
const blocksToHtml = require('@sanity/block-content-to-html');
import SimpleForm from 'vue-simpleform';
import VueApexCharts from 'vue-apexcharts';
import * as DKFDS from 'dkfds';

const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28', // use current UTC date - see "specifying API version"!
  // token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true // `false` if you want to ensure fresh data
});

@Component({
  name: 'Applikation',
  components: {
    SimpleForm,
    apexchart: VueApexCharts
  }
})
export default class Applikation extends Vue {
  currentSection = 'test1'; // frontpage, test1, test2
  currentStep = 5;
  maxStep = 1;
  // apiBaseUrl = 'https://innovation-benchmark-git-dev-innovationbenchmark.vercel.app';
  apiBaseUrl = 'http://localhost:3002';
  isLoading = false;
  error = '';
  errorHeading = '';
  sessionId = this.generateId(32);
  pageCount = 5;
  response = [];
  values = [];
  frontPageMatter = {};
  results = {} as any;
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
    mar6: 0
  };
  radarOptions = {
    colors: ['rgba(13, 66, 255, 0.2)', 'rgba(251, 162, 28, 0.2)', 'rgba(26, 183, 89, 0.2)'],
    chart: {
      id: 'radar',
      // background: '#fff',
      foreColor: '#292929',
      // fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
      fontFamily: 'IBMPlexSans, system',
      offsetY: -25,
      toolbar: {
        show: false
      }
      // events: {
      //   mounted: function () {
      //     window.scrollTo(0, 0);
      //   }
      // }
    },
    stroke: {
      width: 1,
      colors: ['#0D42FF', '#FBA21C', '#1AB759']
    },
    xaxis: {
      categories: ['Produkt', 'Markedsføring', 'Organisatorisk', 'Proces'],
      labels: {
        style: {
          colors: ['#292929', '#292929', '#292929', '#292929']
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: 8,
        style: {
          colors: ['#E3593B', '#E3593B', '#E3593B', '#E3593B', '#E3593B', '#E3593B'],
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
        radius: 5
        // strokeWidth: 1,
        // strokeColor: ['#0D42FF', '#FBA21C', '#1AB759']
      }
    }
  };

  barOptions(
    animationsEnabled = true,
    annotation = [],
    categories = [] as any,
    colors = [] as any,
    max = 5,
    showXLabels = true,
    strokes = [] as any,
    title = '',
    tooltipEnabled = false,
    tooltips = '',
    types = [] as any,
    xaxis = ''
  ) {
    return {
      chart: {
        id: 'basic-bar',
        fontFamily: 'IBMPlexSans, system',
        toolbar: {
          show: false
        },
        animations: {
          enabled: animationsEnabled
        }
      },
      plotOptions: {
        bar: {
          barHeight: '70%',
          dataLabels: {
            // position: 'top',
          },
          distributed: true
        }
      },
      fill: {
        opacity: 1,
        type: types,
        pattern: {
          style: 'slantedLines',
          // width: '100%',
          height: 8,
          strokeWidth: 1
        },
        colors: colors
      },
      stroke: {
        width: 1,
        colors: strokes
      },
      legend: {
        show: false
      },
      dataLabels: {
        style: {
          colors: ['#292929'],
          fontWeight: 'normal'
        }
      },
      yaxis: {
        min: 0,
        max: max,
        tickAmount: 6,
        forceNiceScale: true,
        decimalsInFloat: 0,
        axisBorder: {
          show: true,
          color: '#D0CFCF',
          offsetY: -2
        },
        title: {
          text: title ? title : '',
          style: {
            fontWeight: 400
          }
        },
        axisTicks: {
          show: true,
          borderType: 'solid',
          color: '#D0CFCF',
          width: 6,
          offsetX: 0,
          offsetY: 0
        },
        labels: {
          style: {
            colors: ['#5F5F5F']
          },
          formatter: function (value: any) {
            if (max || max !== 100) return value;

            return !tooltipEnabled ? value + '%' : value;
          }
        }
      },
      grid: {
        show: false
      },
      title: {
        text: title
      },
      annotations: {
        position: 'back',
        xaxis: [
          {
            x: annotation && annotation[0] ? annotation[0] : '',
            borderColor: '#0D42FF',
            // offsetX: -16,
            // offsetY: -12,
            label: {
              text: 'Din vurdering',
              offsetY: 16,
              orientation: 'horizontal',
              borderColor: 'transparent',
              style: {
                background: '#fafafa',
                padding: {
                  top: 24,
                  right: 12
                }
              }
            }
          },
          {
            x: annotation && annotation[1] ? annotation[1] : '',
            borderColor: '#FBA21C',
            // offsetX: 8,
            // offsetY: 24,
            label: {
              text: annotation && annotation[1] === annotation[0] ? 'Dit resultat &' : 'Dit resultat',
              orientation: 'horizontal',
              borderColor: 'transparent',
              style: {
                background: '#fafafa',
                padding: {
                  top: 24,
                  right: 12
                }
              }
            }
          }
        ]
      },
      xaxis: {
        labels: {
          show: showXLabels
        },
        axisBorder: {
          show: true,
          color: '#D0CFCF',
          offsetY: -1
        },
        title: {
          text: xaxis ? xaxis : '',
          style: {
            fontWeight: 400
          }
        },
        // title: {
        //   text: !tooltipEnabled ? 'Du er en del af den orange søjle' : '',
        //   offsetX: -120
        // },
        // tickAmount: 0,
        categories: categories,
        axisTicks: {
          show: false
        }
      },
      tooltip: {
        enabled: tooltipEnabled,
        followCursor: false,
        y: {
          title: {
            formatter: (value: any) => {
              if (title) return title;

              return value;
            }
          }
        },
        x: {
          formatter: (value: any, { dataPointIndex }: any) => {
            if (tooltips) {
              if (value === tooltips[dataPointIndex]) return tooltips[dataPointIndex];

              return tooltips && value + ': ' + tooltips[dataPointIndex];
            }

            return value;
          }
        }
      }
    };
  }

  get barCharts() {
    if (!this.results) return null;
    return [
      {
        series: [
          {
            name: 'Produkt',
            data: [this.results.simpleList.prod_vurd, this.results.simpleList.prod_gruppe, this.results.simpleList.prod_andre]
          }
        ],
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          ['rgba(13, 66, 255, 0.2)', 'rgba(251, 162, 28, 0.2)', 'rgba(26, 183, 89, 0.2)'],
          5,
          false,
          ['#0D42FF', '#FBA21C', '#1AB759'],
          '',
          true,
          undefined,
          'Produkt'
        )
      },
      {
        series: [
          {
            name: 'Proces',
            data: [this.results.simpleList.prcs_vurd, this.results.simpleList.prcs_gruppe, this.results.simpleList.prcs_andre]
          }
        ],
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          ['rgba(13, 66, 255, 0.2)', 'rgba(251, 162, 28, 0.2)', 'rgba(26, 183, 89, 0.2)'],
          5,
          false,
          ['#0D42FF', '#FBA21C', '#1AB759'],
          '',
          true,
          undefined,
          'Proces'
        )
      },
      {
        series: [
          {
            name: 'Organisatorisk',
            data: [this.results.simpleList.org_vurd, this.results.simpleList.org_gruppe, this.results.simpleList.org_andre]
          }
        ],
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          ['rgba(13, 66, 255, 0.2)', 'rgba(251, 162, 28, 0.2)', 'rgba(26, 183, 89, 0.2)'],
          5,
          false,
          ['#0D42FF', '#FBA21C', '#1AB759'],
          '',
          true,
          undefined,
          'Organisatorisk'
        )
      },
      {
        series: [
          {
            name: 'Markedsføring',
            data: [this.results.simpleList.mar_vurd, this.results.simpleList.mar_gruppe, this.results.simpleList.mar_andre]
          }
        ],
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          ['rgba(13, 66, 255, 0.2)', 'rgba(251, 162, 28, 0.2)', 'rgba(26, 183, 89, 0.2)'],
          5,
          false,
          ['#0D42FF', '#FBA21C', '#1AB759'],
          '',
          true,
          undefined,
          'Markedsføring'
        )
      }
    ];
  }

  generateId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  mounted() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();

    window.scrollTo(0, 0);
  }

  @Watch('currentStep')
  @Watch('currentSection')
  onPropertyChanged(value: string, oldValue: string) {
    // updated
    window.scrollTo(0, 0);
    this.maxStep = this.maxStep > this.currentStep ? this.maxStep : this.currentStep;
    this.error = '';
    this.errorHeading = '';
  }

  resolveUrl(event: Event) {
    console.log(event.target);
    const target = event.target as HTMLTextAreaElement;
    const url = target.getAttribute('data-url');
    if (url && url.includes('http')) {
      return;
    }

    if (url === '/test') {
      event.preventDefault();
      this.currentSection = 'test1';
      return;
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
  handleSubmit({ values, errors, setSubmitting, setSubmitted }: any) {
    console.log(this.values);
    this.isLoading = true;
    axios
      .post(`${this.apiBaseUrl}/api/put`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...this.values, session_id: this.sessionId })
      })
      .then((rsp: any) => {
        // this.response = rsp;
        console.log(rsp);
        this.errorHeading = '';
        this.error = '';
        this.isLoading = false;
        if (!rsp.data.error) {
          // setResults(rsp.data);
          this.results = rsp.data;
          this.currentStep = this.pageCount + 1;
          this.isLoading = false;
        }
      })
      .catch((error: any) => {
        console.log(error);
        this.isLoading = false;
        this.errorHeading = 'Fejl';
        this.error = 'Noget gik galt. Prøv venligst igen.';
      });

    // if form is valid, errors will be undefined
  }

  validate(values: any) {
    console.log(values);
    this.values = values;
    return {
      email: 'Email is invalid'
    };
  }

  sanityBlocks(blocks: Array<any>) {
    return blocksToHtml({
      blocks: blocks
    });
  }

  fetchData() {
    // this.error = this.post = null;
    this.isLoading = true;
    // replace `getPost` with your data fetching util / API wrapper
    const query = `*[_type == "test1"] | order(order asc)`;
    const frontpageQuery = '*[_type == "frontpage"][0]';

    Promise.all([client.fetch(query), client.fetch(frontpageQuery)])
      .then(response => {
        console.log(response);
        this.isLoading = false;
        this.response = response[0];
        this.frontPageMatter = response[1];
      })
      .catch((error: any) => {
        console.log(error);
        // this.error = error;
      });
  }

  calculateSliders(name: string, values: Array<String>, fields: Array<Object>, setValue: any) {
    const sliders = fields.filter((field: any) => field._type === 'slider');
    const sum = sliders.reduce((accumulator: any, field: any) => accumulator + (Number(values[field.key]) - 1), 0);
    if (sum > 10) {
      setValue(name, 0);
      this.errorHeading = 'Bemærk!';
      this.error = `Svarprocenten for de ${sliders.length === 3 ? 'tre' : 'to'} spørgsmål må max. give 100% i alt`;
    } else {
      this.errorHeading = '';
      this.error = '';
    }
  }
}
</script>

<style lang="scss" scoped>
$colorOrange: #d23f1e;
$colorPrimary: $colorOrange;
$colorHover: darken($colorPrimary, 10%);
$colorGrey: #d0cfcf;
$colorBackground: #f5f5f5;
$colorGrey_light: #fafafa;
$colorGrey_dark: #797272;
$colorWhite: #ffffff;
$colorBlack: #292929;

$baseFontSize: 16;

$baseUrl: 'https://innovationbenchmark.dk';
html {
  scroll-behavior: smooth;
}

ul.nav-list {
  margin: 0;
  padding: 24px 0 16px;
  list-style: none;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid $colorGrey;
  color: #292929;
  counter-reset: page;
  position: relative;
  max-width: none !important;
  margin-bottom: 48px;

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
    margin-top: 0;

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

ul.nav-bottom {
  margin: 0;
  padding: 24px 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
  max-width: none !important;
  padding-top: 32px;
  margin-top: 32px;
  border-top: 1px solid $colorGrey;

  li {
    padding: 0;
    &:before {
      content: none;
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
  font-family: inherit;

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
    background-color: $colorBackground;
    z-index: 1;
    box-sizing: content-box;
  }

  &-current {
    color: inherit;
    &:before {
      background-color: $colorPrimary;
      color: $colorGrey_light;
    }
  }

  &-past {
    svg {
      position: absolute;
      top: 4px;
      fill: $color-white;
      z-index: 1;
      height: 20px;
    }
    &:before {
      background: $colorPrimary;
      content: '';
      color: $colorGrey_light;
      // background: $colorPrimary url('../../public/img/check-white.svg') center/16px no-repeat;
    }
  }

  &[disabled] {
    pointer-events: none;
  }
}

.sliderOptions {
  display: flex !important;
  justify-content: space-between;
  position: relative;

  .sliderBackground {
    // width: calc(100% - 25%);
    height: 4px;
    background-color: $colorGrey_dark;
    display: block;
    position: absolute;
    top: -28px;
    // left: 25%;
    pointer-events: none;

    @-moz-document url-prefix() {
      // Target Firefox
      background: none;
    }
  }

  .thumbBackground {
    width: 20px;
    height: 4px;
    background-color: $colorWhite;
    display: block;
    position: absolute;
    top: calc(-10px);
    left: calc(75% - 13px);
    pointer-events: none;
  }

  &_item {
    display: flex;
    justify-content: center;
    text-align: center;
    width: 1px;
    margin-top: -8px;
    white-space: nowrap;
    position: relative;
    visibility: hidden;
    font-size: 14px;

    &:nth-of-type(2) {
      justify-content: flex-start;
    }

    &:last-of-type {
      justify-content: flex-end;
    }

    &:before {
      content: '';
      width: 4px;
      height: 4px;
      border-radius: 50%;
      display: block;
      background-color: $colorGrey;
      position: absolute;
      visibility: visible;
      top: -20px;
      z-index: 0;

      @-moz-document url-prefix() {
        // Target Firefox
        top: calc(-8px - 12px);
      }
    }

    &.selected {
      visibility: visible;

      &:before {
        visibility: hidden !important;
      }
    }
  }
}

input[type='range'] {
  width: 100%;
  margin: 8px 0;
  background-color: transparent;
  padding: 16px 0;
  -webkit-appearance: none;

  @at-root .calculatingSliders & {
    &:after {
      content: '';
      width: 40px;
      display: block;
      position: absolute;
      background-color: $colorGrey;
      left: -32px;
      height: 2px;
    }
  }

  &::-webkit-slider-runnable-track {
    background: #d23f1e;
    border: 0;
    border-radius: 2px;
    width: 100%;
    height: 4px;
    cursor: pointer;
  }

  &::-webkit-slider-thumb {
    margin-top: -8px;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border: 2px solid #797272;
    border-radius: 10px;
    cursor: pointer;
    -webkit-appearance: none;
    transition: all 220ms ease-in-out;
    box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
  }
  &:hover::-webkit-slider-thumb {
    background: #797272;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #e04b29;
  }
  &::-moz-range-track {
    background: #d23f1e;
    border: 0;
    border-radius: 2px;
    width: 100%;
    height: 4px;
    cursor: pointer;
  }
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #ffffff;
    border: 2px solid #797272;
    border-radius: 10px;
    cursor: pointer;
    box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
  }
  &::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 20.8px 0;
    color: transparent;
    width: 100%;
    height: 4px;
    cursor: pointer;
  }
  &::-ms-fill-lower {
    background: #bc381b;
    border: 0;
    border-radius: 4px;
  }
  &::-ms-fill-upper {
    background: #d23f1e;
    border: 0;
    border-radius: 4px;
  }
  &::-ms-thumb {
    width: 20px;
    height: 20px;
    background: #ffffff;
    border: 2px solid #797272;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 0px;
    /*Needed to keep the Edge thumb centred*/
  }
  &:focus::-ms-fill-lower {
    background: #d23f1e;
  }
  &:focus::-ms-fill-upper {
    background: #e04b29;
  }
}
@supports (-ms-ime-align: auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type='range'] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}

.button.custom-button {
  font-weight: 500;
  &[disabled] {
    cursor: wait;
  }

  &.disabled {
    opacity: 0.2;
    cursor: default;
  }

  &-primary {
    background-color: $colorPrimary;
    border: none;
    color: $colorWhite;

    &:hover,
    &:active {
      background-color: $colorHover;
      color: $colorWhite;
      box-shadow: 0 0 0 1px $colorHover;
    }

    &:focus {
      background-color: $colorPrimary;
      outline: none;
      box-shadow: 0 0 0 1px $colorBlack;
    }
  }

  &-secondary {
    background-color: transparent;
    color: $colorPrimary !important;
    border-color: $colorPrimary;
    transition: all 220ms ease-in-out;

    &:hover,
    &:active {
      background-color: $colorPrimary;
      color: $colorWhite !important;
      border-color: $colorPrimary;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 1px $colorBlack;
    }
  }
}

.formWrapper {
  margin-bottom: 32px;

  @at-root .calculatingSliders & {
    @include media-breakpoint-up(sm) {
      // transform: translateX(-66px);
    }

    &:not(:first-of-type) {
      &:before {
        content: '';
        width: 2px;
        position: absolute;
        background-color: $colorGrey;
        left: -32px;
        bottom: 36px;
        height: calc(100% + 16px);

        @include media-breakpoint-up(sm) {
          height: calc(100% + 32px);
        }
      }
    }
  }
}

.calculatingSliders {
  position: relative;
  padding-left: 66px;

  &:before {
    content: 'Max 100%';
    width: auto;
    height: auto;
    position: absolute;
    bottom: 42%;
    transform: translateX(calc(-100%)) rotate(-90deg);
    font-size: 12px;
    left: 28px;

    @include media-breakpoint-up(sm) {
      left: 48px;
    }
  }
}

.card {
  box-shadow: none;
  border-color: #d7dadf;

  &-text {
    padding: 0 32px 32px;

    h2 {
      padding-top: 16px;
    }

    @at-root .card-transparent & {
      background-color: transparent;
      padding-left: 0;
      padding-right: 0;
    }
  }

  &-footer {
    padding: 0 32px 32px;

    @at-root .card-transparent & {
      background-color: transparent;
      padding-left: 0;
      padding-right: 0;
    }
  }
  &-header {
    padding: 32px 32px 0;

    @at-root .card-transparent & {
      background-color: transparent;
      padding-left: 0;
      padding-right: 0;
    }
  }

  &-transparent {
    background-color: transparent;
    border: none;
  }
}

.apexcharts-canvas svg {
  overflow: visible;
}

.apexcharts-legend-marker {
  border-width: 1px !important;
  margin-right: 0.5rem !important;

  &:nth-of-type(1) {
    border: 1px solid #0d42ff !important;
  }
  &:nth-of-type(2) {
    border: 1px solid #fba21c !important;
  }
  &:nth-of-type(3) {
    border: 1px solid #1ab759 !important;
  }
}

.hero {
  height: 65vh;
  min-height: 304px;
  background-position: 50%;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;

  &-element {
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
  }
  &-boks {
    border: 1px solid #d7dadf;
    position: absolute;
    background-color: #fff;
    padding: 40px;
    bottom: -40px;
    margin-right: 16px;
    width: calc(100% - 32px);
  }
}

.arrowLink {
  font-weight: bold;
  display: flex;
  align-items: center;
  color: $colorPrimary;
  max-width: none;
  cursor: pointer;

  &:after {
    content: '';
    display: inline-block;
    width: 16px;
    height: 24px;
    background: transparent url($baseUrl + '/img/arrow--orange.svg') center / 16px no-repeat;
    margin-left: 12px;
    transition: all 220ms ease-in-out;
  }

  &:hover {
    &:after {
      margin-left: 24px;
    }
  }
}

.hero-padding {
  padding-top: 80px !important;
}

select.form-select {
  color: rgb(117, 117, 117);

  &.active {
    color: $colorBlack;
  }
}
</style>
