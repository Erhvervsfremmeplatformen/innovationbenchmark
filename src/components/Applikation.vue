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
                              <button
                                class="button custom-button button-secondary custom-button-secondary custom-button-right"
                                @click.prevent="getPDF(chart.id)"
                              >
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
                              :class="[
                                'button',
                                'custom-button',
                                currentSection === 'test1' && [0].includes(index)
                                  ? ['button-primary', 'custom-button-primary']
                                  : ['button-secondary', 'custom-button-secondary']
                              ]"
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
                              :class="[
                                'button',
                                'custom-button',
                                [0].includes(index) ? ['button-primary', 'custom-button-primary'] : ['button-secondary', 'custom-button-secondary']
                              ]"
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
              <button v-if="currentStep < pageCount" class="button button-primary custom-button custom-button-primary" @click="handleNextClick">
                Næste
              </button>
              <button
                v-else-if="currentStep === pageCount"
                class="button button-primary custom-button custom-button-primary"
                @click.prevent="handleSubmit"
              >
                Næste
                <span class="spinner" />
              </button>
            </li>
            <li></li>
            <li>
              <button
                class="button button-secondary custom-button custom-button-secondary"
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
    /*
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
      */

     const response: any = [
      {
        _createdAt: '2021-06-15T13:23:45Z',
        _id: 'frontpage',
        _rev: 'S143LkEaWFWhdHVwOrlhSI',
        _type: 'frontpage',
        _updatedAt: '2021-09-24T08:46:49Z',
        cards: [
          {
            _key: 'e9385e4bdd70',
            _type: 'card',
            cardBody: [
              {
                _key: '8c527affbc25',
                _type: 'block',
                children: [
                  {
                    _key: '8e4ba850ebbc0',
                    _type: 'span',
                    marks: [],
                    text: 'Platformen henvender sig til små og mellemstore produktionsvirksomheder (SMV) og deres rådgivere.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              },
              {
                _key: '0367f17269dc',
                _type: 'block',
                children: [{ _key: 'a86e4c3f91700', _type: 'span', marks: [], text: 'Hvad er benchmarking, og hvordan bruges det?' }],
                markDefs: [],
                style: 'h3'
              },
              {
                _key: '8dbcf421c98c',
                _type: 'block',
                children: [
                  {
                    _key: '478ef7d2b99c0',
                    _type: 'span',
                    marks: [],
                    text: 'Den grundlæggende idé ved benchmarking er at sammenligne sin virksomhed med andre virksomheder. Det kan både være inden for ens egen branche, men også med virksomheder fra helt andre brancher. Benchmarking er en oplagt mulighed for at finde forbedringsmuligheder og for at tænke nyt i virksomheden.'
                  }
                ],
                markDefs: []
              },
              {
                _key: 'ff8f402024b8',
                _type: 'block',
                children: [
                  {
                    _key: '8b1e8ee0238f0',
                    _type: 'span',
                    marks: [],
                    text: 'Testen tager kun få minutter, hvorefter du vil blive præsenteret for resultaterne for den samlede innovationsindsats i virksomheden.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Tag innovationstesten',
            cardButtonUrl: '/test',
            cardHeadline: 'Hvem henvender platformen sig til?'
          },
          {
            _key: '854830ebc79a',
            _type: 'card',
            cardBody: [
              {
                _key: 'e0e6c2d6570e',
                _type: 'block',
                children: [{ _key: '548783925eee', _type: 'span', marks: [], text: 'Testen giver dig:' }],
                markDefs: [],
                style: 'normal'
              },
              {
                _key: '8b926f9d85f3',
                _type: 'block',
                children: [
                  {
                    _key: 'c0396b8c4232',
                    _type: 'span',
                    marks: [],
                    text: 'En overordnet vurdering af innovationsniveauet i din virksomhed og den potentielle effekt af at øge indsatsen.'
                  }
                ],
                level: 1,
                listItem: 'bullet',
                markDefs: [],
                style: 'normal'
              },
              {
                _key: '8fd705c319f8',
                _type: 'block',
                children: [
                  { _key: '72814270b8b2', _type: 'span', marks: [], text: 'Inspiration til diskussion af innovationsmulighederne hos jer.' }
                ],
                level: 1,
                listItem: 'bullet',
                markDefs: [],
                style: 'normal'
              },
              {
                _key: '3710cbb136be',
                _type: 'block',
                children: [
                  { _key: '0a2644a96cd3', _type: 'span', marks: [], text: 'Til gengæld skal du ' },
                  { _key: 'f542ea3c9583', _type: 'span', marks: ['strong'], text: 'ikke' },
                  { _key: '48ca5e94188f', _type: 'span', marks: [], text: ' forvente:' }
                ],
                markDefs: [],
                style: 'normal'
              },
              {
                _key: '7ecb9e1c1c39',
                _type: 'block',
                children: [{ _key: '00a0db9484ec', _type: 'span', marks: [], text: 'Vurderinger, som er præcise til sidste decimal.' }],
                level: 1,
                listItem: 'bullet',
                markDefs: [],
                style: 'normal'
              },
              {
                _key: 'c8b08d4398ac',
                _type: 'block',
                children: [{ _key: 'ba4dd9a68239', _type: 'span', marks: [], text: 'Helt nøjagtige anvisninger til, hvad din virksomhed bør gøre.' }],
                level: 1,
                listItem: 'bullet',
                markDefs: [],
                style: 'normal'
              }
            ],
            cardHeadline: 'Det får du ud af innovationstesten:'
          },
          {
            _key: '6a61f9ff186f',
            _type: 'card',
            cardBody: [
              {
                _key: 'f779b0feb60b',
                _type: 'block',
                children: [
                  {
                    _key: 'c4c3715ccbbd',
                    _type: 'span',
                    marks: [],
                    text: 'Lær, hvordan konkrete virksomheder har håndteret forskellige innovationsudfordringer.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Se cases',
            cardButtonUrl: '/inspiration',
            cardHeadline: 'Vi har samlet en masse virksomhedscases'
          },
          {
            _key: 'a780e01ff7db',
            _type: 'card',
            cardBody: [
              {
                _key: '7089a81e6280',
                _type: 'block',
                children: [
                  {
                    _key: 'b79ee7f784aa',
                    _type: 'span',
                    marks: [],
                    text: 'Find ud af, hvor din virksomhed står i forhold til digitalisering af forretningsmodellen. Med udgangspunkt i Business Model Canvas får du indblik i områder, hvor din virksomhed kan forbedre sin digitale formåen – prøv den nye digitaliseringstest her.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Se mere',
            cardButtonUrl: 'http://ibensoft.com/DIGI3',
            cardHeadline: 'Test din virksomheds digitale formåen'
          },
          {
            _key: '11b577533f03',
            _type: 'card',
            cardBody: [
              {
                _key: '7a4da6a8d261',
                _type: 'block',
                children: [
                  {
                    _key: '368445a5a001',
                    _type: 'span',
                    marks: [],
                    text: 'Benchmark din virksomheds automatiseringsniveau og se, hvad øget automatisering kan gøre for produktiviteten i din virksomhed.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Se mere',
            cardButtonUrl: 'http://ibensoft.com/AIM',
            cardHeadline: 'Test din virksomheds automatiseringsniveau'
          },
          {
            _key: '54b0021ae799',
            _type: 'card',
            cardBody: [
              {
                _key: '927e9935840e',
                _type: 'block',
                children: [
                  {
                    _key: '83147073a2aa',
                    _type: 'span',
                    marks: [],
                    text: 'I denne simple applikation kan du benchmarke din virksomheds vigtigste økonomiske nøgletal med andre virksomheder i samme branche mv.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Se mere',
            cardButtonUrl: 'http://ibensoft.com/OEKO_PERF',
            cardHeadline: 'Benchmark din økonomiske formåen'
          },
          {
            _key: 'a13ef54d059f',
            _type: 'card',
            cardBody: [
              {
                _key: '1ec22b0987ce',
                _type: 'block',
                children: [
                  {
                    _key: '12ecb7b44c87',
                    _type: 'span',
                    marks: [],
                    text: 'Forskerne står til rådighed, hvis du har spørgsmål eller ønsker at arbejde videre med jeres udvikling og innovation.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Se mere',
            cardButtonUrl: '/om',
            cardHeadline: 'Kontaktpersoner, om projektet og menneskene bag'
          },
          {
            _key: '9abf1b16f43b',
            _type: 'card',
            cardBody: [
              {
                _key: '37638686483e',
                _type: 'block',
                children: [
                  {
                    _key: '42fca5752bf8',
                    _type: 'span',
                    marks: [],
                    text: 'Du kan læse om forskelle i innovationsaktiviteter i virksomheder, der klarer sig godt, og i virksomheder, der klarer sig mindre godt.'
                  }
                ],
                markDefs: [],
                style: 'normal'
              }
            ],
            cardButtonText: 'Hent rapporter',
            cardButtonUrl: '/rapporter',
            cardHeadline: 'Analyser af danske fremstillingsvirksomheders innovation'
          }
        ],
        cta_text: 'Tag testen',
        headline: '<span>Benchmark</span> virksomhedens innovation',
        lead: 'Alle virksomheder har mulighed for at forbedre sig, uanset hvordan det går. Med denne innovationstest kan du tage pulsen på innovationsniveauet i din virksomhed og få indblik i de indsatsområder, der kan forbedres. Du kan også se, hvordan virksomheden placerer sig i forhold til 1.876 andre sammenlignelige virksomheder.'
      },
      [
        {
          _createdAt: '2021-06-04T12:34:39Z',
          _id: '9672880a-7968-45f8-9d3b-53f14b9a2c92',
          _rev: 'qlba4EhmVXT0VHiEt7GZFJ',
          _type: 'test1',
          _updatedAt: '2021-09-22T12:36:28Z',
          fields: [
            {
              _key: 'c16cf56192cf',
              _type: 'textinput',
              key: 'virk_navn',
              label: 'Navn på virksomheden',
              page: '1',
              placeholder: '(Valgfrit)',
              width: 50
            },
            {
              _key: '163771e0a296',
              _type: 'select',
              key: 'industri',
              label: 'Vælg branche',
              options: [
                'CA - Føde-, drikke- og tobaksvareindustri',
                'CB - Tekstil- og læderindustri',
                'CC - Træ- og papirindustri, trykkerier',
                'CE - Kemisk industri',
                'CF - Medicinalindustri',
                'CG - Plast-, glas- og betonindustri',
                'CH - Metalindustri',
                'CI - Elektronikindustri',
                'CJ - Fremst. af elektrisk udstyr',
                'CK - Maskinindustri',
                'CL - Transportindustri',
                'CM - Møbel og anden industri mv.'
              ],
              page: '1',
              placeholder: '(Valgfrit)',
              width: 50
            },
            { _key: '5d6eb1302050', _type: 'helptext', description: 'Hvor innovativ vurderer du, at virksomheden er på følgende parametre' },
            {
              _key: '878111653c8e',
              _type: 'slider',
              description: 'I hvilken grad er virksomheden god til at udvikle eller introducere nye produkter?',
              key: 'prod_vurd',
              label: 'Produkter',
              options: ['Slet ikke', 'I mindre grad', 'I nogen grad', 'I høj grad', 'I meget høj grad'],
              page: '1'
            },
            {
              _key: 'a7c18eade1a2',
              _type: 'slider',
              description: 'I hvilken grad er virksomheden god til at automatisere fremstillings-, paknings- og lagringsprocesserne?',
              key: 'prcs_vurd',
              label: 'Proces',
              options: ['Slet ikke', 'I mindre grad', 'I nogen grad', 'I høj grad', 'I meget høj grad'],
              page: '1'
            },
            {
              _key: 'a9e712ceee21',
              _type: 'slider',
              description: 'I hvilken grad er virksomheden god til at introducere nye og decentrale løsninger?',
              key: 'org_vurd',
              label: 'Organisation',
              options: ['Slet ikke', 'I mindre grad', 'I nogen grad', 'I høj grad', 'I meget høj grad'],
              page: '1'
            },
            {
              _key: '170ccce94ac6',
              _type: 'slider',
              description: 'I hvilken grad er virksomheden god til at introducere nye designs og markedsføringsmetoder?',
              key: 'mar_vurd',
              label: 'Markedsføring',
              options: ['Slet ikke', 'I mindre grad', 'I nogen grad', 'I høj grad', 'I meget høj grad'],
              page: '1'
            }
          ],
          headline: 'Inden du går i gang',
          order: 0,
          shortTitle: 'Start',
          text: [
            {
              _key: '1326b2d5e5f1',
              _type: 'block',
              children: [
                { _key: '4cc26b849db2', _type: 'span', marks: ['strong'], text: 'Vi behandler dine data fortroligt.' },
                {
                  _key: 'da183aea237a',
                  _type: 'span',
                  marks: [],
                  text: ' Vi bruger dem til at vurdere innovationsindsatsen i din virksomhed, og dine resultater bliver udelukkende vist på din skærm og via de rapporter, du kan downloade. Du behøver ikke engang oplyse virksomhedens navn mv.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '6c3f3cd10dab',
              _type: 'block',
              children: [
                { _key: 'd626bec267700', _type: 'span', marks: ['strong'], text: 'Dine data bliver anonymiserede' },
                {
                  _key: 'd626bec267701',
                  _type: 'span',
                  marks: [],
                  text: ', og vi vil på baggrund af disse have mulighed for at lave forskningsmæssige analyser, der gør innovationsværktøjet endnu bedre i fremtiden.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '474b062257ef',
              _type: 'block',
              children: [
                {
                  _key: 'b97d9365aab30',
                  _type: 'span',
                  marks: [],
                  text: 'Testen vil afdække virksomhedens innovationsniveau på følgende fire områder:'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: 'd57c656a55e4',
              _type: 'block',
              children: [{ _key: '3c6919066d5f0', _type: 'span', marks: [], text: 'Produkt' }],
              level: 1,
              listItem: 'bullet',
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '3f09026dc201',
              _type: 'block',
              children: [{ _key: '7302414c6a3f0', _type: 'span', marks: [], text: 'Proces' }],
              level: 1,
              listItem: 'bullet',
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '975658f20438',
              _type: 'block',
              children: [{ _key: 'b35f2f9da7c60', _type: 'span', marks: [], text: 'Organisation' }],
              level: 1,
              listItem: 'bullet',
              markDefs: [],
              style: 'normal'
            },
            {
              _key: 'ab99de4e2f42',
              _type: 'block',
              children: [{ _key: 'f188628f56010', _type: 'span', marks: [], text: 'Markedsføring' }],
              level: 1,
              listItem: 'bullet',
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '5afa946d8a6c',
              _type: 'block',
              children: [
                {
                  _key: 'dc2d0df981d60',
                  _type: 'span',
                  marks: [],
                  text: 'Efter du har vurderet indsatsen på de forskellige områder, vil du modtage et samlet resultat over innovationsindsatsen i virksomheden.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        },
        {
          _createdAt: '2021-06-04T12:42:26Z',
          _id: '40bc5993-85b7-47df-a3fe-e9c63d585378',
          _rev: 'qlba4EhmVXT0VHiEt7H6pe',
          _type: 'test1',
          _updatedAt: '2021-09-22T12:37:40Z',
          calculatingSliders: true,
          fields: [
            {
              _key: '8ce7c3efa709',
              _type: 'slider',
              description:
                'Hvor stor en del af virksomhedens omsætning stammer i dag fra produkter, der er introduceret i de seneste tre år, og som er nye på verdensplan?',
              key: 'prod1',
              label: 'Produkter, der er nye på verdensplan',
              options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
              page: '2'
            },
            {
              _key: 'a9a113557675',
              _type: 'slider',
              description:
                'Hvor stor en del af virksomhedens omsætning stammer i dag fra produkter, der er introduceret i de seneste tre år, og som er nye på virksomhedens marked, men ikke på verdensplan?',
              key: 'prod2',
              label: 'Produkter, der er nye for virksomhedens marked',
              options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
              page: '2'
            },
            {
              _key: '25741c515a98',
              _type: 'slider',
              description:
                'Hvor stor en del af virksomhedens omsætning stammer i dag fra produkter, der er introduceret i de seneste tre år, og som er nye for virksomheden, men ikke på markedet generelt?',
              key: 'prod3',
              label: 'Produkter, der er nye for virksomheden',
              options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
              page: '2'
            }
          ],
          headline: 'Produktinnovation',
          order: 1,
          shortTitle: 'Produkt',
          text: [
            {
              _key: '096b0a695115',
              _type: 'block',
              children: [
                {
                  _key: '1b9c7edd2278',
                  _type: 'span',
                  marks: [],
                  text: 'En produktinnovation er en introduktion på markedet af et nyt eller væsentligt forbedret produkt, fx med forbedrede komponenter og subsystemet eller forbedret software eller brugervenlighed.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '57c34e45faf5',
              _type: 'block',
              children: [
                {
                  _key: 'a7b64d02e8ec0',
                  _type: 'span',
                  marks: [],
                  text: 'Innovation skal være ny for virksomheden, men behøver ikke at være ny for branchen eller markedet.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: 'fd2ea8912488',
              _type: 'block',
              children: [
                {
                  _key: 'a93a1639f2340',
                  _type: 'span',
                  marks: [],
                  text: 'Vi stiller spørgsmål til, hvor stor en del af virksomhedens omsætning, der kommer fra nye produkter.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        },
        {
          _createdAt: '2021-06-04T12:42:20Z',
          _id: '6600e6d1-66ea-4131-aa7a-dbc3fb0609fc',
          _rev: 'VYCih99bbn2QGtErPJ9uW4',
          _type: 'test1',
          _updatedAt: '2021-06-16T14:31:33Z',
          fields: [
            {
              _key: 'fed0358195ac',
              _type: 'radiobuttons',
              description: 'Hvor stor en del af fremstillings-/bearbejdnings-/behandlingsprocesserne er automatiserede?',
              key: 'prcs1',
              label: 'Fremstilling',
              options: [
                'Ingen',
                'Mindst en proces',
                'Flere, men under halvdelen af processerne',
                'Mere end halvdelen, men ikke alle processerne',
                'Alle processer'
              ],
              page: '3',
              processColor: true
            },
            {
              _key: 'aec02dfcd6d2',
              _type: 'radiobuttons',
              description: 'Hvor mange af montage- og pakkeprocesserne er automatiserede?',
              key: 'prcs2',
              label: 'Pakning',
              options: [
                'Ingen',
                'Mindst en proces',
                'Flere, men under halvdelen af processerne',
                'Mere end halvdelen, men ikke alle processerne',
                'Alle processer'
              ],
              page: '3',
              processColor: true
            },
            {
              _key: 'a781136aa627',
              _type: 'radiobuttons',
              description: 'Hvor mange af lagerprocesserne (montage, pluk, palletering, forsendelse) er automatiserede?',
              key: 'prcs3',
              label: 'Lagring',
              options: [
                'Ingen',
                'Mindst en proces',
                'Flere, men under halvdelen af processerne',
                'Mere end halvdelen, men ikke alle processerne',
                'Alle processer'
              ],
              page: '3',
              processColor: true
            }
          ],
          headline: 'Procesinnovation',
          order: 2,
          shortTitle: 'Proces',
          text: [
            {
              _key: '6a29349697a8',
              _type: 'block',
              children: [
                {
                  _key: '2e249fa97d93',
                  _type: 'span',
                  marks: [],
                  text: 'En produktionsproces er inddelt i tre forskellige stadier. Det første stadie er fremstilling, bearbejdning og behandling, hvori alle dele af produktet fremstilles. Andet stadie er montage og pakning, hvor alle dele af produktet samles til et færdigt produkt og pakkes til kunderne. Tredje stadie er lager.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '1fb775854e6f',
              _type: 'block',
              children: [
                {
                  _key: 'bd54fab0c8730',
                  _type: 'span',
                  marks: [],
                  text: 'Vi spørger i denne del ind til virksomhedens automatisering af fremstillings-, pakning- og lagerprocesser.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        },
        {
          _createdAt: '2021-05-31T10:46:23Z',
          _id: 'test1',
          _rev: 'lfz9Ij5vGxiSu411pkVIss',
          _type: 'test1',
          _updatedAt: '2021-09-22T12:38:56Z',
          fields: [
            {
              _key: 'faca4cedc2cf',
              _type: 'radiobuttons',
              description: 'Hvem bestemmer hovedsageligt, hvordan opgaverne skal udføres (forslag til procesforbedringer, maskinvalg osv.)?',
              key: 'org1',
              label: 'Løsningsansvar',
              options: [
                'Lederen af produktionen bestemmer alt',
                'Lederen af produktionen bestemmer, men benytter mellemledere',
                'Samarbejde mellem mellemledere og medarbejdere',
                'Medarbejderne i produktionen bestemmer hovedsageligt',
                'Fuld automatisk produktion. Bestemt af afsætningen'
              ],
              page: '4',
              processColor: true
            },
            {
              _key: 'e6603f8c9d30',
              _type: 'radiobuttons',
              description: 'Hvem bestemmer, hvornår produktionsopgaverne skal udføres?',
              key: 'org2',
              label: 'Tidsplanlægning',
              options: [
                'Lederen af produktionen bestemmer alt',
                'Lederen af produktionen bestemmer, men benytter mellemledere',
                'Samarbejde mellem mellemledere og medarbejdere',
                'Medarbejderne i produktionen bestemmer hovedsageligt',
                'Fuld automatisk produktion. Bestemt af afsætningen'
              ],
              page: '4',
              processColor: true
            },
            {
              _key: '5e0f253eed12',
              _type: 'radiobuttons',
              description:
                'I hvilket omfang benytter virksomheden selvstyrende grupper i produktionen, som selv tager beslutninger, fx om bemanding, oplæring, materialebestilling eller håndtering af problemer?',
              key: 'org3',
              label: 'Selvstyrende grupper',
              options: [
                'Benyttes ikke',
                'Benyttes i lav grad',
                'De ansatte i organisationen er overvejende organiseret i selvstyrende grupper',
                'Selvstyrende grupper har nogen autonomi',
                'De selvstyrende grupper har omfattende autonomi'
              ],
              page: '4',
              processColor: true
            }
          ],
          headline: 'Organisations­innovation',
          order: 3,
          shortTitle: 'Organisation',
          text: [
            {
              _key: '54b1a52925cf',
              _type: 'block',
              children: [
                {
                  _key: '4b0e253247bd',
                  _type: 'span',
                  marks: [],
                  text: 'Organisationsinnovation handler om, at virksomheden udvikler nye forretningsgange, rutiner osv., som skaber nye værdier for organisationen. En måde at udvikle sig på er ved at kigge på arbejdets indhold og tilrettelæggelse for medarbejdere, hvor decentralisering af beslutningstagning og selvstyrende grupper har vist sig at være vigtige parametre for den samlede virksomhedsperformance.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: 'f269c00d87c4',
              _type: 'block',
              children: [
                {
                  _key: '68ded5c639650',
                  _type: 'span',
                  marks: [],
                  text: 'Du bliver spurgt om, hvem beslutningstagerne er i virksomheden, samt hvordan de forskellige roller fordeler sig.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        },
        {
          _createdAt: '2021-06-04T12:51:37Z',
          _id: '0f82cf08-4f5b-4da1-b7d1-e24c6c3aabe3',
          _rev: 'qlba4EhmVXT0VHiEt7I4fF',
          _type: 'test1',
          _updatedAt: '2021-09-22T12:39:37Z',
          fields: [
            {
              _key: 'c46dc87dcc93',
              _type: 'radiobuttons',
              description: 'Introducerede virksomheden i de seneste tre år nye eller væsentligt ændrede produktdesigns?',
              key: 'mar1',
              label: 'Produktdesign',
              options: ['Ja', 'Nej'],
              page: '5',
              processColor: false
            },
            {
              _key: 'b9c9af24ffdb',
              _type: 'radiobuttons',
              description: 'Introducerede virksomheden i de seneste tre år nye eller væsentligt ændrede indpakninger?',
              key: 'mar2',
              label: 'Indpakning',
              options: ['Ja', 'Nej'],
              page: '5',
              processColor: false
            },
            {
              _key: 'f90684bc6469',
              _type: 'radiobuttons',
              description: 'Introducerede virksomheden i de seneste tre år nye eller væsentligt ændrede markedsføringsstrategier?',
              key: 'mar3',
              label: 'Markedsføringsstrategier',
              options: ['Ja', 'Nej'],
              page: '5',
              processColor: false
            },
            {
              _key: '702bb5d691f0',
              _type: 'radiobuttons',
              description: 'Introducerede virksomheden i de seneste tre år nye medier/teknikker til promovering af produkter?',
              key: 'mar4',
              label: 'Promovering af produkter',
              options: ['Ja', 'Nej'],
              page: '5',
              processColor: false
            },
            {
              _key: 'cfe4879fe5c6',
              _type: 'radiobuttons',
              description: 'Introducerede virksomheden i de seneste tre år nye salgskanaler/metoder til eksponering af produkter?',
              key: 'mar5',
              label: 'Eksponering',
              options: ['Ja', 'Nej'],
              page: '5',
              processColor: false
            },
            {
              _key: 'e2cab3ad8ba0',
              _type: 'radiobuttons',
              description: 'Introducerede virksomheden i de seneste tre år nye metoder til prissætning af varer/serviceydelser?',
              key: 'mar6',
              label: 'Prissætning',
              options: ['Ja', 'Nej'],
              page: '5',
              processColor: false
            }
          ],
          headline: 'Markedsførings­innovation',
          order: 4,
          shortTitle: 'Markedsføring',
          text: [
            {
              _key: 'f269c00d87c4',
              _type: 'block',
              children: [
                {
                  _key: '3c593f7ff8dc',
                  _type: 'span',
                  marks: [],
                  text: 'Markedsføringsinnovation drejer sig om implementeringen af nye markedsføringsmetoder, der adskiller sig væsentligt fra virksomhedens eksisterende markedsføringsmetoder, og som er en del af en ny strategi eller et nyt marketingkoncept. Det kan fx være væsentlige ændringer i produktets design, indpakning, salgskanaler, promovering eller prissætning.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: '1f08a7536ae7',
              _type: 'block',
              children: [
                {
                  _key: 'f25dc83e85310',
                  _type: 'span',
                  marks: [],
                  text: 'Der spørges derfor i denne del af testen ind til, hvorvidt virksomheden har introduceret nye eller væsentligt ændrede designs, indpakninger, prissætninger mv. inden for de seneste tre år.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        },
        {
          _createdAt: '2021-06-04T12:52:03Z',
          _id: '092e4323-9119-4167-8bd3-c725eb1096af',
          _rev: 'Mb6klbe5Gn4xs4Fo49euES',
          _type: 'test1',
          _updatedAt: '2021-07-12T07:56:00Z',
          cards: [
            {
              _key: '20de54b33849',
              _type: 'card',
              cardBody: [
                {
                  _key: '7d5f95479870',
                  _type: 'block',
                  children: [
                    {
                      _key: '776894af6c44',
                      _type: 'span',
                      marks: [],
                      text: 'Hvad er jeres innovationsparathed, og hvad kan det betyde for jeres profitabilitet og produktivitet?'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                }
              ],
              cardButtonText: 'Mål resultatet',
              cardButtonUrl: '/test2',
              cardHeadline: 'Gå videre med dit resultat og mål din innovationsparathed og -effekter'
            },
            {
              _key: 'aeb11b052c8f',
              _type: 'card',
              cardBody: [
                {
                  _key: 'd045317580a0',
                  _type: 'block',
                  children: [
                    { _key: 'cbf4abbeddb5', _type: 'span', marks: ['strong'], text: 'Innovationsparatheden' },
                    {
                      _key: '11b1a89a7a93',
                      _type: 'span',
                      marks: [],
                      text: ' er et tal mellem 0% og 100%. Hvis din parathed fx er 30%, så betyder det, at en virksomhed med dine karakteristika har 30% sandsynlighed for at lave innovation.'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                },
                {
                  _key: '90319bb03fc5',
                  _type: 'block',
                  children: [
                    { _key: 'f7bcb3d2fab10', _type: 'span', marks: ['strong'], text: 'Innovationseffekterne' },
                    {
                      _key: 'f7bcb3d2fab11',
                      _type: 'span',
                      marks: [],
                      text: ' handler om, hvorledes innovation forventes at påvirke produktiviteten (værditilvæksten i forhold til produktionsfaktorer) og profitabiliteten (profitten per medarbejder) i en virksomhed med dine karakteristika.'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                },
                {
                  _key: 'de39be9a8c93',
                  _type: 'block',
                  children: [
                    {
                      _key: '5b4a1273ad520',
                      _type: 'span',
                      marks: [],
                      text: 'Testen tager kun få minutter, hvorefter du vil få et bud på virksomhedens innovationsparathed og de forventede innovationseffekter. Du vil bl.a. kunne se, hvordan medarbejdernes uddannelsesniveau er relateret til innovationsparathed og innovationseffekter.'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                }
              ]
            }
          ],
          fields: [],
          headline: 'Samlet innovationsniveau',
          order: 5,
          shortTitle: 'Resultat',
          text: [
            {
              _key: 'f269c00d87c4',
              _type: 'block',
              children: [
                {
                  _key: '4b8e2c2aae9a',
                  _type: 'span',
                  marks: [],
                  text: 'I diagrammet kan du se, hvordan virksomheden samlet set placerer sig på de fire forskellige innovationsområder.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        }
      ],
      [
        {
          _createdAt: '2021-06-16T09:31:01Z',
          _id: 'f36b65ca-c7f4-4be5-952a-246da9c82c37',
          _rev: 'lfz9Ij5vGxiSu411pkWfXy',
          _type: 'test2',
          _updatedAt: '2021-09-22T12:42:46Z',
          calculatingSliders: true,
          fields: [
            {
              _key: 'd5d4410a45f9',
              _type: 'radiobuttons',
              description: 'Har virksomheden haft innovationsaktiviteter inden for de seneste tre år?',
              key: 'feature2_inno',
              label: 'Virksomhedens innovation',
              options: ['Ja', 'Nej'],
              required: true,
              width: 100
            },
            {
              _key: 'ee7d78d71959',
              _type: 'radiobuttons',
              description: 'Vælg den industri, som passer bedst til din virksomhed.',
              key: 'feature2_industri',
              label: 'Virksomhedens industri',
              options: [
                'Fremstilling af fødevarer',
                'Fremstilling af tekstiler, læder og møbler',
                'Træ og papir, kemisk, plast, metal',
                'Fremstilling af maskiner og transportmidler',
                'Elektronik og elektrisk udstyr',
                'Anden fremstillingsvirksomhed'
              ],
              required: true,
              width: 100
            },
            {
              _key: 'e156b96e8dec',
              _type: 'radiobuttons',
              description: 'Hvor mange ansatte har virksomheden?',
              key: 'feature2_storrelse',
              label: 'Antal ansatte',
              options: ['0-9 ansatte', '10-49 ansatte', '50-249 ansatte', '250 ansatte eller derover'],
              processColor: true,
              required: true,
              width: 100
            },
            {
              _key: '88e1b586bcbc',
              _type: 'slider',
              description: 'Hvor mange % af virksomhedens ansatte har en kort videregående uddannelse?',
              key: 'feature2_kvu',
              label: 'Ansatte med kort videregående uddannelse',
              options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
              required: true,
              width: 100
            },
            {
              _key: 'b1924bac3e15',
              _type: 'slider',
              description: 'Hvor mange % af virksomhedens ansatte har en mellemlang eller lang videregående uddannelse?',
              key: 'feature2_mlvu',
              label: 'Ansatte med mellemlang eller lang videregående uddannelse',
              options: ['0%', '10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'],
              required: true,
              width: 100
            }
          ],
          headline: 'Test din innovationsparathed og -effekter',
          order: 0,
          text: [
            {
              _key: 'ffe88cdf206c',
              _type: 'block',
              children: [
                {
                  _key: '30f75a5988a7',
                  _type: 'span',
                  marks: [],
                  text: 'Virksomheders kapacitet til at tilegne, optage og udnytte viden er en nøglefaktor for succesfuld innovation. Denne kapacitet er i høj grad relateret til de ansattes kvalifikationer. Det er generelt udfordrende at måle kvalifikationer og derfor anvendes et tilnærmet mål for virksomhedens kapacitet til at tilegne, optage og udnytte viden. Dette er andelen af ansatte med videregående uddannelse ud af virksomhedens samlede antal ansatte. Desto højere denne andel er, desto højere er virksomhedens evne til at tilegne sig, optage og udnytte ny viden.'
                }
              ],
              markDefs: [],
              style: 'normal'
            },
            {
              _key: 'c132b41d75fc',
              _type: 'block',
              children: [
                {
                  _key: '36c0fa33f7770',
                  _type: 'span',
                  marks: [],
                  text: 'I det følgende stiller vi bl.a. spørgsmål til virksomhedens andel af ansatte med videregående uddannelse. Denne andel benyttes til at udregne et mål for virksomhedens innovationsparathed og et mål for den forventede gevinst i produktivitet og profit af at have innovationsaktiviteter.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        },
        {
          _createdAt: '2021-06-16T09:43:31Z',
          _id: '0ba3930d-81d5-4e85-9026-94f1384c7132',
          _rev: 'lfz9Ij5vGxiSu411pkWlnc',
          _type: 'test2',
          _updatedAt: '2021-09-22T12:43:16Z',
          calculatingSliders: false,
          cards: [
            {
              _key: '2a8ceb0c58bc',
              _type: 'card',
              cardBody: [
                {
                  _key: '3977fce82329',
                  _type: 'block',
                  children: [
                    {
                      _key: '9dabf7bb911e',
                      _type: 'span',
                      marks: [],
                      text: 'Forskerne står til rådighed hvis du har spørgsmål eller ønsker at arbejde videre med jeres udvikling og innovation.'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                }
              ],
              cardButtonText: 'Se mere',
              cardButtonUrl: '/om',
              cardHeadline: 'Kontaktpersoner, om projektet og menneskerne bag'
            },
            {
              _key: '98c9b5f9a692',
              _type: 'card',
              cardBody: [
                {
                  _key: 'a2efe91d9564',
                  _type: 'block',
                  children: [
                    {
                      _key: 'b8d19cb2895e',
                      _type: 'span',
                      marks: [],
                      text: 'Lær hvordan konkrete virksomheder har håndteret forskellige innovationsudfordringer.'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                }
              ],
              cardButtonText: 'Se cases',
              cardButtonUrl: '/inspiration',
              cardHeadline: 'Vi har samlet en masse virksomhedscases'
            },
            {
              _key: 'b9c49dad8200',
              _type: 'card',
              cardBody: [
                {
                  _key: 'cee904dd45fc',
                  _type: 'block',
                  children: [{ _key: '3b65a175e18f', _type: 'span', marks: [], text: 'Ønsker du at tage testen igen? Gå tilbage til forsiden her.' }],
                  markDefs: [],
                  style: 'normal'
                }
              ],
              cardButtonText: 'Tilbage til forsiden',
              cardButtonUrl: '/frontpage',
              cardHeadline: 'Tag testen igen?'
            },
            {
              _key: 'a1548254b344',
              _type: 'card',
              cardBody: [
                {
                  _key: '92e124d81310',
                  _type: 'block',
                  children: [
                    {
                      _key: 'e92dafef50e8',
                      _type: 'span',
                      marks: [],
                      text: 'Ønsker du inspiration til at komme videre med dine innovationsaktiviteter? Kom i kontakt og få vejledning.'
                    }
                  ],
                  markDefs: [],
                  style: 'normal'
                }
              ],
              cardButtonText: 'Se mere',
              cardButtonUrl:
                'https://virksomhedsguiden.dk/content/ydelser/faa-gratis-sparring-om-innovation-i-dit-erhvervshus/e22b09b0-57a3-4525-b2e2-a613b95ec6af/',
              cardHeadline: 'Hjælp til dine innovationsudfordringer'
            }
          ],
          headline: 'Her er resultatet',
          order: 1,
          text: [
            {
              _key: '4b9c48900533',
              _type: 'block',
              children: [
                {
                  _key: '818198de657f',
                  _type: 'span',
                  marks: [],
                  text: 'Nedenfor kan du se, hvad din virksomheds innovationsparathed er, og du kan se de forventede effekter af innovation for netop din virksomhed.'
                }
              ],
              markDefs: [],
              style: 'normal'
            }
          ]
        }
      ]
    ];
    this.isLoading = false;
    this.frontPageMatter = response[0];
    this.test1 = response[1];
    this.test2 = response[2];
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
@import '../styles/components/_applikation.scss';
</style>
