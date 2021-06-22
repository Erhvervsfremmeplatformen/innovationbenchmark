<template>
  <div class="applikation-container">
    <div class="innovationtest">
      <h1>Tag innovationstesten</h1>
      nu på: {{ currentStep }}
      <div class="spinner" v-if="loadingResponse" aria-label="Henter indhold" />

      <nav>
        <ul class="nav-list">
          <li v-for="(page, index) in response" v-bind:key="index">
            <button
              :class="currentStep === index + 1 ? 'nav-button_current' : ''"
              class="nav-button"
              :disabled="currentStep < index"
              type="button"
              v-on:click="currentStep = index + 1"
            >
              {{ page.shortTitle }}
            </button>
          </li>
        </ul>
      </nav>

      <div v-for="(step, index) in response" v-bind:key="index">
        <div class="row" v-if="currentStep === index + 1">
          <div class="col-md-6 col-xs-12">
            <div class="card">
              <div class="card-header">
                <h2 class="">{{ response[index].headline }}</h2>
              </div>
              <div class="card-text" v-html="sanityBlocks(response[index].text)"></div>
            </div>
          </div>
          <div class="col-md-6 col-xs-12">
            <fieldset class="row">
              <div v-for="field in response[index].fields" v-bind:key="field._id" :class="['formWrapper', field.width == 50 ? 'col-6' : 'col-12']">
                <div class="form-group" v-if="field._type === 'textinput'">
                  <label class="form-label" :for="field.name">
                    {{ field.label }}
                  </label>

                  <input class="form-input" :id="field.name" value="" :name="field.name" type="text" />
                </div>

                <div class="form-group" v-else-if="field._type === 'select'">
                  <label class="form-label" for="options">{{ field.label }}</label>
                  <select class="form-select" :name="field.name" id="options">
                    <option disabled value="0">Vælg</option>
                    <option v-for="option in field.options" :value="option" :key="option">{{ option }}</option>
                  </select>
                </div>

                <div class="form-group" v-else-if="field._type === 'radiobuttons'">
                  <fieldset>
                    <legend class="h5">{{ field.label }}</legend>
                    <p>{{ field.description }}</p>
                    <ul class="nobullet-list">
                      <li v-for="(option, index) in field.options" :key="index">
                        <input :id="field.name + '_' + index" type="radio" :name="field.name" :value="option" class="form-radio radio-large" />
                        <label :for="field.name + '_' + index" id="form-label-radio-1" class="">{{ option }}</label>
                      </li>
                    </ul>
                  </fieldset>
                </div>

                <div class="form-group" v-else-if="field._type === 'slider'">
                  <label class="form-label" :for="field.name">{{ field.label }}</label>
                  <p class="formWrapper_description">{{ field.description }}</p>
                  <input type="range" class="slider" :id="field.name" :max="field.options.length" min="1" />
                  <div class="sliderOptions active">
                    <div class="sliderBackground" />
                    <div v-for="(option, index) in field.options" class="selected" :key="option">
                      {{ option }}
                    </div>
                  </div>
                </div>

                <div class="form-group" v-else="field._type === 'radio'">
                  {{ field.type }}
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import sanityClient from '@sanity/client';
const blocksToHtml = require('@sanity/block-content-to-html');

const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28', // use current UTC date - see "specifying API version"!
  // token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true // `false` if you want to ensure fresh data
});

@Component({
  name: 'Applikation',
  methods: {
    sanityBlocks: function (blocks) {
      return blocksToHtml({
        blocks: blocks
      });
    }
  }
})
export default class Applikation extends Vue {
  private currentStep = 1;
  private response = {};
  private error = {};

  private loadingResponse = false;

  mounted() {
    this.loadingResponse = true;
    this.callExternalApi();
  }

  private async callExternalApi() {
    const query = `*[_type == "test1"] | order(order asc)`;

    client
      .fetch(query)
      .then(response => {
        console.log(response);
        this.loadingResponse = false;
        this.response = response;
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
$colorGrey: #d0cfcf;
$colorBackground: #f5f5f5;
$colorGrey_light: #fafafa;
$colorGrey_dark: #797272;
$colorWhite: #ffffff;
$colorBlack: #292929;

$baseFontSize: 16;

@function rem($pixels) {
  @return $pixels / $baseFontSize * 1rem;
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
  }

  &_current {
    color: inherit;
    &:before {
      background-color: $colorPrimary;
      color: $colorGrey_light;
    }
  }

  &_past {
    &:before {
      content: '';
      // color: $colorGrey_light;
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
    top: calc(-0.5rem - 2px);
    // left: 25%;
    pointer-events: none;

    @-moz-document url-prefix() {
      // Target Firefox
      background: none;
    }
  }

  .thumbBackground {
    width: rem(20);
    height: 4px;
    background-color: $colorWhite;
    display: block;
    position: absolute;
    top: calc(-0.5rem - 2px);
    left: calc(75% - 13px);
    pointer-events: none;
  }

  &_item {
    display: flex;
    justify-content: center;
    text-align: center;
    width: 1px;
    margin-top: 0.5rem;
    white-space: nowrap;
    position: relative;
    visibility: hidden;
    font-size: rem(14);

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
      top: calc(-0.5rem - 10px);
      z-index: 0;

      @-moz-document url-prefix() {
        // Target Firefox
        top: calc(-0.5rem - 12px);
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
  appearance: none;
  width: 100%;
  border-radius: 2px;
  height: 4px;
  cursor: pointer;
  background: $colorPrimary;
  z-index: 0;

  &:focus {
    box-shadow: none;
  }

  &::-webkit-slider-runnable-track {
    cursor: pointer;
  }

  &::-moz-range-track {
    background-color: $colorGrey_dark;
    height: 4px;
    border-radius: 2px;
  }

  &::-moz-range-progress {
    background-color: $colorPrimary;
    height: 4px;
    border-radius: 2px;
  }

  &::-webkit-slider-thumb {
    appearance: none;
    height: rem(20);
    width: rem(20);
    border-radius: 50%;
    background: $colorWhite;
    cursor: ew-resize;
    box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
    z-index: 10;
  }

  &::-moz-range-thumb {
    appearance: none;
    height: rem(20);
    width: rem(20);
    border-radius: 50%;
    background: $colorWhite;
    cursor: ew-resize;
    box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
    z-index: 10;
    border: none;
  }

  &:focus {
    outline: none;

    &::-webkit-slider-thumb {
      // border: 1px solid $colorFocus;
    }

    &::-moz-range-thumb {
      // border: 1px solid $colorFocus;
    }
  }

  @at-root .calculatingSliders & {
    &:after {
      content: '';
      width: rem(40);
      display: block;
      position: absolute;
      background-color: $colorGrey;
      left: 12px;
      height: 2px;
    }
  }
}
</style>
