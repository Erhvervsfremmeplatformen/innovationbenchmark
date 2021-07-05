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
          <div class="col-md-6" v-if="frontPageMatter.cards" v-html="sanityBlocks(frontPageMatter.cards[0].cardBody)"></div>
          <div class="col-md-6" v-if="frontPageMatter.cards">
            <div class="card">
              <div class="card-header">
                <h2>{{ frontPageMatter.cards[1].cardHeadline }}</h2>
              </div>
              <div class="card-text" v-html="sanityBlocks(frontPageMatter.cards[1].cardBody)"></div>
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
                    :disabled="currentStep < index"
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
                <p class="alert-heading">Fejl</p>
                <p class="alert-text">{{ error }}</p>
              </div>
            </div>

            <form v-if="!isLoading">
              <!-- <input type="email" v-on="{ input, blur }" name="email" :value="values.email" />
            <span class="error" v-if="touched('email') && errors('email')">{{ errors('email') }}</span> -->

              <template v-for="(step, index) in response">
                <div class="row" v-if="currentStep === index + 1" :key="index">
                  <div class="col-md-6 col-xs-12">
                    <div class="card">
                      <div class="card-header">
                        <h2 class="">{{ response[index].headline }}</h2>
                      </div>
                      <div class="card-text" v-html="sanityBlocks(response[index].text)"></div>
                    </div>
                    <pre>

                  <!-- {{ values }} -->
                  </pre>
                  </div>
                  <div class="col-md-6 col-xs-12">
                    <fieldset class="row" v-if="response[index].fields.length > 0">
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
                          <select class="form-select" :name="field.key" id="options" v-on="{ input, blur }">
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
                      <!-- <apexchart
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
                      ></apexchart> -->
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
// import VueApexCharts from 'vue-apexcharts';
import * as DKFDS from 'dkfds';

// Vue.use(VueApexCharts);

// Vue.component('apexchart', VueApexCharts);

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
    SimpleForm
    //  apexchart: VueApexCharts
  }
})
export default class Applikation extends Vue {
  currentSection = 'frontpage'; // frontpage, test1, test2
  currentStep = 1;
  apiBaseUrl = 'https://innovation-benchmark-git-dev-innovationbenchmark.vercel.app';
  isLoading = false;
  error = '';
  sessionId = this.generateId(32);
  pageCount = 5;
  response = {};
  frontPageMatter = {};
  results = {};
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
      foreColor: '#292929',
      fontFamily: 'Helvetica Neue, Helvetica, sans-serif',
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
        radius: 5,
        strokeWidth: 1,
        strokeColor: ['#0D42FF', '#FBA21C', '#1AB759']
      }
    }
  };

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
    window.scrollTo(0, 0);
    console.log('updated');
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
    console.log(values);
    this.isLoading = true;
    axios
      .post(`${this.apiBaseUrl}/api/put`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ ...values, sessionId: this.sessionId })
      })
      .then((rsp: any) => {
        // this.response = rsp;
        console.log(rsp);
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
        this.error = 'Noget gik galt. Prøv venligst igen.';
      });

    //   axios
    //     .post(`${this.apiBaseUrl}/api/put`, {
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json'
    //       },
    //       data: JSON.stringify({ ...values, url })
    //     })
    //     .catch(error => {
    //       // handle error
    //       console.log(error);
    //       this.isLoading = false;
    //       this.error = 'Noget gik galt. Prøv venligst igen.';
    //       // this.isLoading = false;
    //     })
    //     .then(response: any => {
    //       this.error = '';
    //       this.isLoading = false;
    //       console.log(response);
    //       if (!response.data.error) {
    //         setResults(response.data);
    //         this.currentStep = this.pageCount + 1;
    //         this.isLoading = false;
    //       }
    //     });
    // } catch (error) {
    //   // const notify = () =>
    //   //   toast.info('Noget gik galt. Prøv venligst igen.', {
    //   //     hideProgressBar: false,
    //   //     pauseOnFocusLoss: true,
    //   //     autoClose: false,
    //   //     toastId: 'alert'
    //   //   });
    //   // notify();
    // }

    // if form is valid, errors will be undefined
  }
  validate(values: Array<String>) {
    console.log(values);
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
      top: -28px;
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

// input[type='range'] {
//   appearance: none;
//   width: 100%;
//   border-radius: 2px;
//   height: 4px;
//   cursor: pointer;
//   background: $colorPrimary;
//   z-index: 0;

//   &:focus {
//     box-shadow: none;
//   }

//   &::-webkit-slider-runnable-track {
//     cursor: pointer;
//   }

//   &::-moz-range-track {
//     background-color: $colorGrey_dark;
//     height: 4px;
//     border-radius: 2px;
//   }

//   &::-moz-range-progress {
//     background-color: $colorPrimary;
//     height: 4px;
//     border-radius: 2px;
//   }

//   &::-webkit-slider-thumb {
//     appearance: none;
//     height: 20px;
//     width: 20px;
//     border-radius: 50%;
//     background: $colorWhite;
//     cursor: ew-resize;
//     box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
//     border: 2px solid #797272;
//     z-index: 10;
//   }

//   &::-moz-range-thumb {
//     appearance: none;
//     height: 20px;
//     width: 20px;
//     border-radius: 50%;
//     background: $colorWhite;
//     cursor: ew-resize;
//     box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
//     z-index: 10;
//     border: 2px solid #797272;
//     border: none;
//   }

//   &:focus {
//     outline: none;

//     &::-webkit-slider-thumb {
//       // border: 1px solid $colorFocus;
//     }

//     &::-moz-range-thumb {
//       // border: 1px solid $colorFocus;
//     }
//   }

//   @at-root .calculatingSliders & {
//     &:after {
//       content: '';
//       width: 40px;
//       display: block;
//       position: absolute;
//       background-color: $colorGrey;
//       left: 12px;
//       height: 2px;
//     }
//   }
// }

// input[type='range'] {
//   width: 100%;
//   margin: 8px 0;
//   background-color: transparent;
//   -webkit-appearance: none;
// }
// input[type='range']:focus {
//   outline: none;
// }
// input[type='range']::-webkit-slider-runnable-track {
//   background: #d23f1e;
//   border: 1px solid #d23f1e;
//   border-radius: 2px;
//   width: 100%;
//   height: 4px;
//   cursor: pointer;
// }
// input[type='range']::-webkit-slider-thumb {
//   margin-top: -9px;
//   width: 20px;
//   height: 20px;
//   background: #ffffff;
//   border: 0px solid rgba(255, 255, 255, 0);
//   border: 0;
//   border-radius: 10px;
//   cursor: pointer;
//   -webkit-appearance: none;
// }
// input[type='range']:focus::-webkit-slider-runnable-track {
//   background: #df4320;
// }
// input[type='range']::-moz-range-track {
//   background: #d23f1e;
//   border: 1px solid #d23f1e;
//   border-radius: 2px;
//   width: 100%;
//   height: 4px;
//   cursor: pointer;
// }
// input[type='range']::-moz-range-thumb {
//   width: 20px;
//   height: 20px;
//   background: #ffffff;
//   border: 0px solid rgba(255, 255, 255, 0);
//   border: 0;
//   border-radius: 10px;
//   cursor: pointer;
// }
// input[type='range']::-ms-track {
//   background: transparent;
//   border-color: transparent;
//   border-width: 9px 0;
//   color: transparent;
//   width: 100%;
//   height: 4px;
//   cursor: pointer;
// }
// input[type='range']::-ms-fill-lower {
//   background: #c53b1c;
//   border: 1px solid #d23f1e;
//   border-radius: 4px;
// }
// input[type='range']::-ms-fill-upper {
//   background: #d23f1e;
//   border: 1px solid #d23f1e;
//   border-radius: 4px;
// }
// input[type='range']::-ms-thumb {
//   width: 20px;
//   height: 20px;
//   background: #ffffff;
//   border: 0px solid rgba(255, 255, 255, 0);
//   border: 0;
//   border-radius: 10px;
//   cursor: pointer;
//   margin-top: 0px;
//   /*Needed to keep the Edge thumb centred*/
// }
// input[type='range']:focus::-ms-fill-lower {
//   background: #d23f1e;
// }
// input[type='range']:focus::-ms-fill-upper {
//   background: #df4320;
// }
// /*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
// how to remove the virtical space around the range input in IE*/
// @supports (-ms-ime-align: auto) {
//   /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
//   input[type='range'] {
//     margin: 0;
//     /*Edge starts the margin from the thumb, not the track as other browsers do*/
//   }
// }

input[type='range'] {
  width: 100%;
  margin: 8px 0;
  background-color: transparent;
  padding: 16px 0;
  -webkit-appearance: none;
}
input[type='range']:focus {
  // outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
  background: #d23f1e;
  border: 0;
  border-radius: 2px;
  width: 100%;
  height: 4px;
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb {
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
input[type='range']:hover::-webkit-slider-thumb {
  background: #797272;
}
input[type='range']:focus::-webkit-slider-runnable-track {
  background: #e04b29;
}
input[type='range']::-moz-range-track {
  background: #d23f1e;
  border: 0;
  border-radius: 2px;
  width: 100%;
  height: 4px;
  cursor: pointer;
}
input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border: 2px solid #797272;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
}
input[type='range']::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 20.8px 0;
  color: transparent;
  width: 100%;
  height: 4px;
  cursor: pointer;
}
input[type='range']::-ms-fill-lower {
  background: #bc381b;
  border: 0;
  border-radius: 4px;
}
input[type='range']::-ms-fill-upper {
  background: #d23f1e;
  border: 0;
  border-radius: 4px;
}
input[type='range']::-ms-thumb {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border: 2px solid #797272;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type='range']:focus::-ms-fill-lower {
  background: #d23f1e;
}
input[type='range']:focus::-ms-fill-upper {
  background: #e04b29;
}
/*TODO: Use one of the selectors from https://stackoverflow.com/a/20541859/7077589 and figure out
how to remove the virtical space around the range input in IE*/
@supports (-ms-ime-align: auto) {
  /* Pre-Chromium Edge only styles, selector taken from hhttps://stackoverflow.com/a/32202953/7077589 */
  input[type='range'] {
    margin: 0;
    /*Edge starts the margin from the thumb, not the track as other browsers do*/
  }
}

.button.custom-button {
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

    &:hover {
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
    background-color: $colorBackground;
    color: $colorBlack;

    &:hover {
      background-color: $colorPrimary;
      color: $colorWhite;
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
}

.card {
  box-shadow: none;
  border-color: #d7dadf;
  &-text {
    padding: 0 32px 32px;
  }
  &-header {
    padding: 32px 32px 0;
  }
}

.apexcharts-canvas svg {
  overflow: visible;
}
.apexcharts-legend-marker {
  border-width: 1px !important;
  margin-right: 0.5rem !important;
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
</style>
