<template>
  <div class="applikation-container">
    <div class="innovationtest">
      <h1>Tag innovationstesten</h1>
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

      <SimpleForm :value="initialValues" :validate="validate" @submit="handleSubmit">
        <template slot-scope="{ values, errors, touched, input, blur, setValue, setTouched, handleSubmit, submitted, submitting }">
          {{ values }}
          <form>
            <input type="email" v-on="{ input, blur }" name="email" :value="values.email" />
            <span class="error" v-if="touched('email') && errors('email')">{{ errors('email') }}</span>

            <button @click.prevent="handleSubmit">Submit</button>

            <template v-for="(step, index) in response">
              <div class="row" v-if="currentStep === index + 1" :key="index">
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
                    <div
                      v-for="field in response[index].fields"
                      v-bind:key="field._id"
                      :class="['formWrapper', field.width == 50 ? 'col-6' : 'col-12']"
                    >
                      <div class="form-group" v-if="field._type === 'textinput'">
                        <label class="form-label" :for="field.key">
                          {{ field.label }}
                        </label>

                        <input class="form-input" v-on="{ input, blur }" :id="field.key" :value="values[field.key]" :name="field.key" type="text" />
                      </div>

                      <div class="form-group" v-else-if="field._type === 'select'">
                        <label class="form-label" for="options">{{ field.label }}</label>
                        <select class="form-select" :name="field.key" id="options">
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
                              <input :id="field.key + '_' + index" type="radio" :name="field.key" :value="option" class="form-radio radio-large" />
                              <label :for="field.key + '_' + index" id="form-label-radio-1" class="">{{ option }}</label>
                            </li>
                          </ul>
                        </fieldset>
                      </div>

                      <div class="form-group" v-else-if="field._type === 'slider'">
                        <label class="form-label" :for="field.key">{{ field.label }}</label>
                        <p class="formWrapper_description">{{ field.description }}</p>
                        <input type="range" class="slider" :id="field.key" :max="field.options.length" min="1" />
                        <div class="sliderOptions active">
                          <div class="sliderBackground" />
                          <div v-for="(option, index) in field.options" class="sliderOptions_item" :key="option">
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
            </template>
          </form>
        </template>
      </SimpleForm>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import axios from 'axios';
import sanityClient from '@sanity/client';
import blocksToHtml from '@sanity/block-content-to-html';
import SimpleForm from 'vue-simpleform';

const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28', // use current UTC date - see "specifying API version"!
  // token: 'sanity-auth-token', // or leave blank for unauthenticated usage
  useCdn: true // `false` if you want to ensure fresh data
});

export default {
  components: { SimpleForm },
  data() {
    return {
      currentStep: 1,
      loadingResponse: false,
      error: {},
      response: {},
      initialValues: {
        virk_navn: 'Test',
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
      }
    };
  },
  created() {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  methods: {
    handleSubmit({ values, errors, setSubmitting, setSubmitted }) {
      // if form is valid, errors will be undefined
    },
    validate(values) {
      console.log(values);
      return {
        email: 'Email is invalid'
      };
    },
    sanityBlocks: function (blocks) {
      return blocksToHtml({
        blocks: blocks
      });
    },
    fetchData() {
      // this.error = this.post = null;
      this.loadingResponse = true;
      // replace `getPost` with your data fetching util / API wrapper
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
    }
  }
};

// @Component({
//   name: 'Applikation',
//   data() {
//     return {
//       initialValues: {
//         email: null
//       }
//     };
//   },
//   methods: {
//     sanityBlocks: function (blocks) {
//       return blocksToHtml({
//         blocks: blocks
//       });
//     },
//     handleSubmit({ values, errors, setSubmitting, setSubmitted }) {
//       // if form is valid, errors will be undefined
//     },
//     validate(values) {
//       return {
//         email: 'Email is invalid'
//       };
//     }
//   },
//   components: { SimpleForm }
// })
// export default class Applikation extends Vue {
//   private currentStep = 1;
//   private response = {};
//   private error = {};

//   private loadingResponse = false;

//   mounted() {
//     this.loadingResponse = true;
//     this.callExternalApi();
//   }

//   private async callExternalApi() {
//     const query = `*[_type == "test1"] | order(order asc)`;

//     client
//       .fetch(query)
//       .then(response => {
//         console.log(response);
//         this.loadingResponse = false;
//         this.response = response;
//       })
//       .catch((error: any) => {
//         this.error = error;
//       });

//     // axios
//     //   .get('https://httpbin.org/get')
//     //   .then((rsp: any) => {
//     //     this.response = rsp;
//     //     this.loadingResponse = false;
//     //   })
//     //   .catch((error: any) => {
//     //     this.error = error;
//     //   });
//   }
// }
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
    top: -10px;
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
    margin-top: 8px;
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
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: $colorWhite;
    cursor: ew-resize;
    box-shadow: 0px 0px 8px rgba($colorBlack, 0.4);
    z-index: 10;
  }

  &::-moz-range-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
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
      width: 40px;
      display: block;
      position: absolute;
      background-color: $colorGrey;
      left: 12px;
      height: 2px;
    }
  }
}

input[type='range'] {
  width: 100%;
  margin: 8px 0;
  background-color: transparent;
  -webkit-appearance: none;
}
input[type='range']:focus {
  outline: none;
}
input[type='range']::-webkit-slider-runnable-track {
  background: #d23f1e;
  border: 1px solid #d23f1e;
  border-radius: 2px;
  width: 100%;
  height: 4px;
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb {
  margin-top: -9px;
  width: 20px;
  height: 20px;
  background: #ffffff;
  border: 0px solid rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  -webkit-appearance: none;
}
input[type='range']:focus::-webkit-slider-runnable-track {
  background: #df4320;
}
input[type='range']::-moz-range-track {
  background: #d23f1e;
  border: 1px solid #d23f1e;
  border-radius: 2px;
  width: 100%;
  height: 4px;
  cursor: pointer;
}
input[type='range']::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border: 0px solid rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 10px;
  cursor: pointer;
}
input[type='range']::-ms-track {
  background: transparent;
  border-color: transparent;
  border-width: 9px 0;
  color: transparent;
  width: 100%;
  height: 4px;
  cursor: pointer;
}
input[type='range']::-ms-fill-lower {
  background: #c53b1c;
  border: 1px solid #d23f1e;
  border-radius: 4px;
}
input[type='range']::-ms-fill-upper {
  background: #d23f1e;
  border: 1px solid #d23f1e;
  border-radius: 4px;
}
input[type='range']::-ms-thumb {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border: 0px solid rgba(255, 255, 255, 0);
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 0px;
  /*Needed to keep the Edge thumb centred*/
}
input[type='range']:focus::-ms-fill-lower {
  background: #d23f1e;
}
input[type='range']:focus::-ms-fill-upper {
  background: #df4320;
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
</style>
