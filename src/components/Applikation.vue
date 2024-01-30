<template>
  <div class="applikation-container">
    <GlobalSvgIcons />
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
                    :class="['button', [0].includes(index) ? ['button-primary'] : ['button-secondary']]"
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
        <nav v-if="currentSection == 'test1'">
          <ul class="nav-list">
            <li v-for="(page, index) in test1" :key="index">
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
        <div v-if="isLoading" class="spinner" aria-label="Henter indhold" />

        <form v-if="!isLoading">
          <template v-for="(currentTest, index) of [test1, test2]" :key="index">
            <div :class="'test' + (index + 1)">
              <template v-if="currentSection == 'test' + (index + 1)">
                <template v-for="(step, index) in currentTest">
                  <div v-if="currentStep === index + 1" :key="index">
                    <div class="row">
                      <div class="col-md-6 col-xs-12">
                        <!-- left column -->
                        <div class="card">
                          <div class="card-header">
                            <h2 class="">{{ currentTest[index].headline }}</h2>
                          </div>
                          <div class="card-text" v-html="sanityBlocks(currentTest[index].text)"></div>
                        </div>
                      </div>
                      <div class="col-md-6 col-xs-12">
                        <!-- right column -->

                        <fieldset
                          v-if="currentTest[index].fields && currentTest[index].fields.length > 0"
                          :class="['row', step.calculatingSliders ? 'calculatingSliders' : '']"
                        >
                          <div v-if="error && !isLoading" class="alert alert-error" role="alert" aria-atomic="true">
                            <div class="alert-body">
                              <p class="alert-heading">{{ errorHeading }}</p>
                              <p class="alert-text" v-html="error" />
                            </div>
                          </div>
                          <div
                            v-for="field in currentTest[index].fields"
                            :key="field._id"
                            :class="[
                              'formWrapper',
                              field.width == 50 ? 'col-lg-6' : 'col-12',
                              field._type == 'slider' && step.calculatingSliders ? 'calculatingSlider' : ''
                            ]"
                          >
                            <div v-if="field._type === 'textinput'" class="form-group">
                              <label class="form-label" :for="field.key"> {{ field.label }}</label>

                              <input
                                :id="field.key"
                                class="form-input"
                                v-model="initialValues[field.key]"
                                :name="field.key"
                                type="text"
                                :placeholder="field.placeholder"
                              />
                            </div>

                            <div v-else-if="field._type === 'select'" class="form-group">
                              <label class="form-label" for="options">{{ field.label }}</label>
                              <select
                                id="options"
                                :class="['form-select ', initialValues[field.key] !== 0 ? 'active' : '']"
                                :name="field.key"
                                v-model="initialValues[field.key]"
                              >
                                <option disabled selected value="0">{{ field.placeholder }}</option>
                                <option v-for="(option, index) in field.options" :key="index + 1" :value="index + 1">{{ option }}</option>
                              </select>
                            </div>

                            <div v-else-if="field._type === 'radiobuttons'" class="form-group">
                              <fieldset>
                                <legend>{{ field.label }}</legend>
                                <p :id="`label-description-${field.key}`">{{ field.description }}</p>
                                <ul class="nobullet-list">
                                  <li v-for="(option, index) in field.options" :key="index">
                                    <input
                                      :id="field.key + '_' + index"
                                      type="radio"
                                      :name="field.key"
                                      :aria-describedby="`label-description-${field.key}`"
                                      v-model="initialValues[field.key]"
                                      :value="index + 1 + ''"
                                      class="form-radio"
                                    />
                                    <label id="form-label-radio-1" :for="field.key + '_' + index" class="">{{ option }}</label>
                                  </li>
                                </ul>
                              </fieldset>
                            </div>

                            <div v-else-if="field._type === 'slider'" class="form-group">
                              <label class="form-label" :for="field.key">{{ field.label }}</label>
                              <p :id="`label-description-${field.key}`" class="formWrapper_description">{{ field.description }}</p>
                              <input
                                :id="field.key"
                                type="range"
                                class="slider"
                                :name="field.key"
                                v-model="initialValues[field.key]"
                                :max="field.options.length"
                                :aria-valuemax="field.options.length"
                                aria-valuemin="1"
                                :aria-describedby="`label-description-${field.key}`"
                                min="1"
                                aria-role="slider"
                                :aria-valuenow="initialValues[field.key]"
                                :aria-valuetext="field.options[initialValues[field.key] - 1]"
                                @change="step.calculatingSliders ? calculateSliders(field.key, initialValues, step.fields, setValue) : null"
                              />
                              <div :class="['sliderOptions', initialValues[field.key] !== 0 ? 'active' : '']">
                                <div
                                  class="sliderBackground"
                                  :style="{
                                    width:
                                      initialValues[field.key] === 0
                                        ? 'calc(100% - 20px)'
                                        : `calc(100% - ${((initialValues[field.key] - 1) / (field.options.length - 1)) * 100}% - ${
                                            20 * (1 - (initialValues[field.key] - 1) / (field.options.length - 1))
                                          }px)`,
                                    left:
                                      initialValues[field.key] === 0
                                        ? '20px'
                                        : `calc(${((initialValues[field.key] - 1) / (field.options.length - 1)) * 100}% + ${
                                            20 * (1 - (initialValues[field.key] - 1) / (field.options.length - 1))
                                          }px)`
                                  }"
                                />
                                <div
                                  v-for="(option, index) in field.options"
                                  :key="option"
                                  :class="['sliderOptions_item', index + 1 == initialValues[field.key] ? 'selected' : '']"
                                >
                                  {{ option }}
                                </div>
                              </div>
                            </div>

                            <legend v-else-if="field._type === 'helptext'">
                              <strong>{{ field.description }}</strong>
                            </legend>

                            <div v-else class="form-group">
                              {{ field._type }}
                            </div>
                          </div>
                        </fieldset>
                        <div v-else-if="currentSection == 'test1' && results1.simpleList">
                          <apexchart
                            v-if="results1.simpleList"
                            height="500px"
                            type="radar"
                            :options="radarOptions"
                            :series="[
                              {
                                name: 'Din vurdering',
                                data: [
                                  results1.simpleList.prod_vurd,
                                  results1.simpleList.mar_vurd,
                                  results1.simpleList.org_vurd,
                                  results1.simpleList.prcs_vurd
                                ]
                              },
                              {
                                name: 'Dit resultat',
                                data: [
                                  results1.simpleList.prod_gruppe,
                                  results1.simpleList.mar_gruppe,
                                  results1.simpleList.org_gruppe,
                                  results1.simpleList.prcs_gruppe
                                ]
                              },
                              {
                                name: 'Andre virksomheder',
                                data: [
                                  results1.simpleList.prod_andre,
                                  results1.simpleList.mar_andre,
                                  results1.simpleList.org_andre,
                                  results1.simpleList.prcs_andre
                                ]
                              }
                            ]"
                          ></apexchart>
                        </div>
                      </div>
                    </div>
                    <template v-if="currentSection == 'test1' && currentStep === pageCount + 1 && results1.simpleList">
                      <div :key="index" class="row">
                        <div
                          v-for="(chart, index) of test1BarCharts"
                          :key="index"
                          :class="['col-6', 'col-sm-3', expandedContent === chart.id ? 'expandedChart' : '']"
                        >
                          <apexchart height="200px" type="bar" :options="chart.options" :series="chart.series"></apexchart>
                          <div class="chartBottom">
                            <button
                              class="expandButton button button-unstyled"
                              @click.prevent="expandedContent == chart.id ? (expandedContent = '') : (expandedContent = chart.id)"
                            >
                              <svg class="icon-svg" focusable="false" aria-hidden="true">
                                <use :xlink:href="expandedContent === chart.id ? '#minus' : '#plus'"></use>
                              </svg>
                              {{ expandedContent === chart.id ? 'Skjul' : 'Uddybende information' }}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div ref="expandedContentArea">
                        <div v-for="(chart, index) of test1BarCharts" :key="index" class="row">
                          <div class="col-sm-12">
                            <template v-if="expandedContent === chart.id">
                              <div class="row expandedContent isExpanded">
                                <div class="col-sm-6">
                                  <p class="intro">{{ chart.intro }}</p>
                                </div>
                                <div class="col-sm-6" />
                                <div
                                  v-for="(chart, index) of chart.expands"
                                  :key="chart.id + '_' + index"
                                  :class="[chart.width == 25 ? 'col-sm-3' : 'col-sm-6']"
                                >
                                  <apexchart height="200" type="bar" :options="chart.options" :series="chart.series"></apexchart>
                                </div>
                              </div>
                              <button class="button button-secondary custom-button-right" @click.prevent="getPDF(chart.id)">
                                <svg class="icon-svg" focusable="false" aria-hidden="true">
                                  <use xlink:href="#download"></use></svg
                                >Hent PDF-rapport
                              </button>
                            </template>
                          </div>
                        </div>
                      </div>
                    </template>

                    <template v-if="currentSection == 'test2' && currentStep === pageCount + 1 && results2.simpleList">
                      <div :key="index" class="row">
                        <div class="col-md-12">
                          <button
                            class="arrowLink arrowLink_back"
                            @click.prevent="
                              currentStep = 1;
                              $forceUpdate();
                            "
                          >
                            Ret dine svar
                          </button>
                        </div>
                        <div class="col-md-12">
                          <h2>Innovationsparathed i din virksomhed</h2>
                          <p>
                            Innovationsparatheden er et tal mellem 0 og 100%. Hvis din værdi er 30, så betyder det, at en virksomhed med dine
                            karakteristika har 30% sandsynlighed for at lave innovation.
                          </p>
                        </div>
                        <div
                          v-for="chart of test2BarCharts.feature2"
                          :key="chart.id"
                          :class="['col-sm-6', expandedContent === chart.id ? 'expandedChart' : '']"
                        >
                          <apexchart type="bar" height="300" :options="chart.options" :series="chart.series"></apexchart>
                          <div class="chartBottom">
                            <p class="chartBottom-subtitle">{{ chart.subtitle }}</p>
                            <button
                              class="expandButton button button-unstyled"
                              @click.prevent="expandedContent == chart.id ? (expandedContent = '') : (expandedContent = chart.id)"
                            >
                              <svg class="icon-svg" focusable="false" aria-hidden="true">
                                <use :xlink:href="expandedContent === chart.id ? '#minus' : '#plus'"></use>
                              </svg>
                              {{ expandedContent === chart.id ? 'Skjul' : 'Uddybende information' }}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div ref="expandedContentArea">
                        <div v-for="chart of test2BarCharts.feature2" :key="chart.id" class="row">
                          <div class="col-sm-12">
                            <template v-if="expandedContent === chart.id">
                              <div class="row expandedContent isExpanded">
                                <div v-for="(chart, index) of chart.expands" :key="chart.id + '_' + index" class="col-sm-6">
                                  <template v-if="chart.series[0].data[0] !== '#N/A' && chart.series[0].data[0] !== '#VALUE!'">
                                    <apexchart type="bar" height="300" :options="chart.options" :series="chart.series"></apexchart>
                                    <div class="chartBottom">
                                      <p class="chartBottom-subtitle">{{ chart.subtitle }}</p>
                                    </div>
                                  </template>

                                  <div v-else style="font-size: 14">
                                    <apexchart
                                      type="bar"
                                      height="300"
                                      :series="[{ data: [1, 2, 3, 4, 5], name: chart.series[0].name }]"
                                      :options="
                                        barOptions(
                                          false,
                                          undefined,
                                          chart.options.xaxis.categories,
                                          [chartColors.green],
                                          5,
                                          true,
                                          [chartColors.greenSolid],
                                          chart.series[0].name,
                                          true,
                                          undefined,
                                          '',
                                          ''
                                        )
                                      "
                                    />
                                    <div
                                      style="
                                        position: absolute;
                                        top: 2rem;
                                        width: 100%;
                                        height: calc(100% - 2rem);
                                        background: #f5f5f5;
                                        opacity: 0.8;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-size: 12px;
                                      "
                                    >
                                      <p style="margin-top: -32px">Det var ikke muligt at udregne effekten for din industri/din størrelse</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </div>
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-md-12">
                          <hr />
                          <h2>Innovationseffekter i din virksomhed</h2>
                          <p>
                            Innovationseffekter viser, hvordan innovation forventes at påvirke profit pr. medarbejder og produktiviteten (vækst i
                            værditilvækst i forhold til produktionsfaktorer).
                          </p>
                        </div>
                        <div
                          v-for="chart of test2BarCharts.feature3"
                          :key="chart.id"
                          :class="['col-sm-6', expandedContent === chart.id ? 'expandedChart' : '']"
                        >
                          <apexchart type="bar" height="300" :options="chart.options" :series="chart.series"></apexchart>
                          <div class="chartBottom">
                            <p class="chartBottom-subtitle">{{ chart.subtitle }}</p>
                            <button
                              class="expandButton button button-unstyled"
                              @click.prevent="expandedContent == chart.id ? (expandedContent = '') : (expandedContent = chart.id)"
                            >
                              <svg class="icon-svg" focusable="false" aria-hidden="true">
                                <use :xlink:href="expandedContent === chart.id ? '#minus' : '#plus'"></use>
                              </svg>
                              {{ expandedContent === chart.id ? 'Skjul' : 'Uddybende information' }}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div v-for="chart of test2BarCharts.feature3" :key="chart.id" class="row">
                        <div class="col-sm-12">
                          <template v-if="expandedContent === chart.id">
                            <div :ref="chart.id" class="row expandedContent isExpanded">
                              <div v-for="(chart, index) of chart.expands" :key="chart.id + '_' + index" class="col-sm-6">
                                <template v-if="chart.series[0].data[0] !== '#N/A' && chart.series[0].data[0] !== '#VALUE!'">
                                  <apexchart type="bar" height="300" :options="chart.options" :series="chart.series"></apexchart>
                                  <div class="chartBottom">
                                    <p class="chartBottom-subtitle">{{ chart.subtitle }}</p>
                                  </div>
                                </template>
                                <div v-else style="font-size: 14">
                                  <apexchart
                                    type="bar"
                                    height="300"
                                    :series="[{ data: [1, 2, 3, 4, 5], name: chart.series[0].name }]"
                                    :options="
                                      barOptions(
                                        false,
                                        undefined,
                                        chart.options.xaxis.categories,
                                        [chartColors.green],
                                        5,
                                        true,
                                        [chartColors.greenSolid],
                                        chart.series[0].name,
                                        true,
                                        undefined,
                                        '',
                                        ''
                                      )
                                    "
                                  />
                                  <div
                                    style="
                                      position: absolute;
                                      top: 2rem;
                                      width: 100%;
                                      height: calc(100% - 2rem);
                                      background: #f5f5f5;
                                      opacity: 0.8;
                                      display: flex;
                                      align-items: center;
                                      justify-content: center;
                                    "
                                  >
                                    <p style="margin-top: -2rem">Det var ikke muligt at udregne effekten for din industri/din størrelse</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </div>
                      </div>
                    </template>

                    <div v-if="currentStep === pageCount + 1" class="row">
                      <div id="line1" class="col-md-12">
                        <hr />
                        <h2 v-if="currentSection === 'test2'">Mere inspiration til din virksomhed</h2>
                      </div>

                      <div v-for="(card, index) of step.cards" :key="index" class="col-md-6 mb-6">
                        <div :class="['card', currentSection === 'test1' && [0].includes(index) ? 'card-transparent' : '']">
                          <div class="card-header">
                            <h3 v-if="card.cardHeadline">{{ card.cardHeadline }}</h3>
                          </div>
                          <div v-if="card.cardBody" class="card-text" v-html="sanityBlocks(card.cardBody)"></div>
                          <div v-if="card.cardButtonText && card.cardButtonUrl" class="card-footer card-action">
                            <a
                              :href="
                                card.cardButtonUrl.includes('http') || card.cardButtonUrl == '/test'
                                  ? card.cardButtonUrl
                                  : apiBaseUrl + card.cardButtonUrl
                              "
                              :data-url="card.cardButtonUrl"
                              target="_blank"
                              :class="['button', currentSection === 'test1' && [0].includes(index) ? ['button-primary'] : ['button-secondary']]"
                              :title="card.cardButtonText === 'Se mere' ? `Se mere om ${card.cardHeadline}` : card.cardButtonText"
                              @click="resolveUrl"
                            >
                              <svg
                                v-if="
                                  card.cardButtonUrl.includes('http') ||
                                  (card.cardButtonUrl !== '/test' && card.cardButtonUrl !== '/test2' && card.cardButtonUrl !== '/frontpage')
                                "
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
                      <div v-if="step.cards && currentSection === 'test1'" id="line2" class="col-md-12">
                        <hr />
                      </div>
                      <div v-if="currentSection === 'test1'" class="col-md-6">
                        <div :class="['card', 'card-transparent']">
                          <div class="card-header">
                            <h2>{{ frontPageMatter.cards[frontPageMatter.cards.length - 2].cardHeadline }}</h2>
                          </div>
                          <div class="card-text" v-html="sanityBlocks(frontPageMatter.cards[frontPageMatter.cards.length - 2].cardBody)"></div>
                          <div v-if="frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonText" class="card-footer card-action">
                            <a
                              :href="
                                frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonUrl.includes('http') ||
                                frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonUrl == '/test'
                                  ? frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonUrl
                                  : apiBaseUrl + frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonUrl
                              "
                              :data-url="frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonUrl"
                              target="_blank"
                              :class="['button', [0].includes(index) ? ['button-primary'] : ['button-secondary']]"
                              @click="resolveUrl"
                            >
                              {{ frontPageMatter.cards[frontPageMatter.cards.length - 2].cardButtonText }}</a
                            >
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </template>
        </form>

        <nav>
          <ul v-if="!isLoading && currentStep !== pageCount + 1" class="nav-bottom">
            <li>
              <button v-if="currentStep < pageCount" class="button button-primary" @click="handleNextClick">Næste</button>
              <button v-else-if="currentStep === pageCount" class="button button-primary" @click.prevent="handleSubmit">
                Næste
                <span class="spinner" />
              </button>
            </li>
            <li></li>
            <li>
              <button
                class="button button-secondary"
                :disabled="currentStep === 1"
                :style="{ visibility: currentStep !== 1 && currentStep <= pageCount ? 'visible' : 'hidden' }"
                @click="handlePreviousClick"
              >
                Tilbage
              </button>
            </li>
          </ul>
        </nav>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { FrontPageMatter, Results1, Results2, Test1, Test2 } from '@/types/response';
import { SanityBlock } from '@/types/sanity-block';
import { SliderField } from '@/types/types';
import sanityClient from '@sanity/client';
import GlobalSvgIcons from './GlobalSvgIcons.vue';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { nextTick } from 'vue';
import { Options, Vue, Watch } from 'vue-property-decorator';
import VueApexCharts from 'vue3-apexcharts';
import { barOptions, chartColors } from '../utils/bar-utils';
const blocksToHtml = require('@sanity/block-content-to-html');

const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28',
  useCdn: true
});

@Options({
  name: 'Applikation',
  components: {
    GlobalSvgIcons,
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
          .post(`${this.apiBaseUrl}/api/pdf`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...this.initialValues, id, session_id: this.sessionId })
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
          })
          .finally(() => {
            this.isLoading = false;
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
    const url = this.currentSection === 'test1' ? `${this.apiBaseUrl}/api/put` : `${this.apiBaseUrl}/api/put-parathed`;
    axios
      .post(url, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...this.initialValues, session_id: this.sessionId })
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

    Promise.all([client.fetch(frontpageQuery), client.fetch(query), client.fetch(query2)])
      .then(response => {
        this.isLoading = false;
        this.frontPageMatter = response[0];
        this.test1 = response[1];
        this.test2 = response[2];
      })
      .catch((error: AxiosError) => {
        this.error = error.message;
      });
  }

  calculateSliders(name: string, values: string[], fields: SliderField[], setValue: any) {
    const sliders = fields.filter(field => field._type === 'slider');
    const sum = sliders.reduce((accumulator, field: any) => accumulator + (Number(values[field.key]) - 1), 0);
    if (sum > 10) {
      (this.initialValues as any)[name] = '1';
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
// AJP: Hele stylesheet bør importeres under .innovationtest via deep selector, men der er underlig styling, så har kun overskrevet en enkelt klasse.
:deep(.innovationtest) {
  .apexcharts-legend-marker {
    border-width: 1px;
  }
}
@import '../styles/components/_applikation.scss';
</style>
