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
            style="background-image: url('https://innovationbenchmark.dk/img/heroImage.jpg');"
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
          <template v-for="(card, index) of frontPageMatter.cards">
            <div :key="'frontPageMatterCards' + index" class="col-md-6" style="margin-bottom: 32px;">
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
            <div v-if="[1, 5].includes(index)" :key="index" class="col-md-12" style="margin-bottom: 0;">
              <hr />
              <h2 v-if="[1].includes(index)">Mere inspiration til din virksomhed</h2>
            </div>
          </template>
        </div>
      </template>

      <template v-if="currentSection == 'test1' || currentSection == 'test2'">
        <SimpleForm :value="initialValues" :validate="validate" @submit="handleSubmit">
          <template slot-scope="{ values, input, blur, setValue, handleSubmit }">
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
              <template v-for="(currentTest, index) of [test1, test2]">
                <div :key="index" :class="'test' + (index + 1)">
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
                                  <label class="form-label" :for="field.key">
                                    {{ field.label }}
                                  </label>

                                  <input
                                    :id="field.key"
                                    class="form-input"
                                    :value="values[field.key]"
                                    :name="field.key"
                                    type="text"
                                    :placeholder="field.placeholder"
                                    v-on="{ input, blur }"
                                  />
                                </div>

                                <div v-else-if="field._type === 'select'" class="form-group">
                                  <label class="form-label" for="options">{{ field.label }}</label>
                                  <select
                                    id="options"
                                    :class="['form-select ', values[field.key] !== 0 ? 'active' : '']"
                                    :name="field.key"
                                    v-on="{ input, blur }"
                                  >
                                    <option disabled sel ec te d va lu e=" 0 ">{{ field.placeholder }}</option>
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
                                          :value="index + 1"
                                          class="form-radio"
                                          :checked="values[field.key] === (index + 1).toString()"
                                          v-on="{ input, blur }"
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
                                    :value="values[field.key]"
                                    :max="field.options.length"
                                    :aria-valuemax="field.options.length"
                                    aria-valuemin="1"
                                    :aria-describedby="`label-description-${field.key}`"
                                    min="1"
                                    aria-role="slider"
                                    :aria-valuenow="values[field.key]"
                                    :aria-valuetext="field.options[values[field.key] - 1]"
                                    v-on="{ input, blur }"
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
                                      :key="option"
                                      :class="['sliderOptions_item', index + 1 == values[field.key] ? 'selected' : '']"
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

                                      <div v-else style="font-size: 14;">
                                        <apexchart
                                          type="bar"
                                          height="300"
                                          :series="[{ data: [1, 2, 3, 4, 5], name: chart.series[0].name }]"
                                          :options="barOptions( false,
                                      undefined, chart.options.xaxis.categories, [chartColors.green], 5, true, [chartColors.greenSolid],
                                      chart.series[0].name, true, undefined, '', '' ),"
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
                                          <p style="margin-top: -32px;">Det var ikke muligt at udregne effekten for din industri/din størrelse</p>
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
                                    <div v-else style="font-size: 14;">
                                      <apexchart
                                        type="bar"
                                        height="300"
                                        :series="[{ data: [1, 2, 3, 4, 5], name: chart.series[0].name }]"
                                        :options="barOptions( false,
                                      undefined, chart.options.xaxis.categories, [chartColors.green], 5, true, [chartColors.greenSolid],
                                      chart.series[0].name, true, undefined, '', '' ),"
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
                                        <p style="margin-top: -2rem;">Det var ikke muligt at udregne effekten for din industri/din størrelse</p>
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
                                    [0].includes(index)
                                      ? ['button-primary', 'custom-button-primary']
                                      : ['button-secondary', 'custom-button-secondary']
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
        </SimpleForm>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export interface SliderField {
  _key: string;
  _type: string;
  description: string;
  key: string;
  label: string;
  options: string[];
  page: string;
}

export interface FrontPageMatter {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: string;
  cards?: Card[] | null;
  cta_text: string;
  headline: string;
  lead: string;
}

export interface Results1 {
  simpleList: {
    [key: string]: string;
  };

  histogramList: {
    [key: string]: HistogramItem[];
  };
}

export interface Results2 {
  simpleList: {
    [key: string]: string;
  };
  histogramList: {
    [key: string]: HistogramItem[];
  };
}

export interface Test1 {
  _createdAt: Date;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: Date;
  fields: Field[];
  headline: string;
  order: number;
  shortTitle: string;
  text: Text[];
  calculatingSliders?: boolean;
  cards: Card[];
}

export interface Test2 {
  _createdAt: Date;
  _id: string;
  _rev: string;
  _type: string;
  _updatedAt: Date;
  calculatingSliders: boolean;
  fields: Field[];
  headline: string;
  order: number;
  text: Text[];
  cards: Card[];
}

export interface Field {
  _key: string;
  _type: string;
  key?: string;
  label?: string;
  page?: string;
  placeholder?: string;
  width?: number;
  options?: string[];
  description?: string;
  processColor?: boolean;
  required?: boolean;
}

export interface Card {
  _key: string;
  _type: string;
  cardBody?: CardBody[] | null;
  cardButtonText?: string | null;
  cardButtonUrl?: string | null;
  cardHeadline: string;
}
export interface CardBody {
  _key: string;
  _type: string;
  children?: CardChildren[] | null;
  markDefs?: null[] | null;
  style?: string | null;
  level?: number | null;
  listItem?: string | null;
}
export interface CardChildren {
  _key: string;
  _type: string;
  marks?: (string | null)[] | null;
  text: string;
}

export interface Child {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface Text {
  _key: string;
  _type: string;
  children: Child[];
  markDefs: any[];
  style?: string;
  level?: number;
  listItem?: string;
}

interface HistogramItem {
  Variable: string;
  Value: string;
}

export interface SanityChild {
  _key: string;
  _type: string;
  marks: string[];
  text: string;
}

export interface SanityBlock {
  _key: string;
  _type: string;
  children: SanityChild[];
  markDefs: any[];
  style: string;
  level?: number;
  listItem: string;
}

import { Component, Watch, Vue } from 'vue-property-decorator';
import axios, { AxiosError, AxiosResponse } from 'axios';
import sanityClient from '@sanity/client';
const blocksToHtml = require('@sanity/block-content-to-html');
import SimpleForm from 'vue-simpleform';
import VueApexCharts from 'vue-apexcharts';

const client = sanityClient({
  projectId: 'gu31rtaa',
  dataset: 'production',
  apiVersion: '2021-05-28',
  useCdn: true
});

@Component({
  name: 'Applikation',
  components: {
    SimpleForm,
    apexchart: VueApexCharts
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
  chartColors = {
    blue: 'rgba(0, 82, 255, 0.3)',
    orange: 'rgba(143, 43, 143, 0.3)',
    green: 'rgba(33, 150, 83, 0.3)',
    blueSolid: '#0052FF',
    orangeSolid: '#8F2B8F',
    greenSolid: '#219653',
    textColor: '#292929'
  };
  radarOptions = {
    colors: [this.chartColors.blue, this.chartColors.orange, this.chartColors.green],
    chart: {
      id: 'radar',
      foreColor: this.chartColors.textColor,
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
      colors: [this.chartColors.blueSolid, this.chartColors.orangeSolid, this.chartColors.greenSolid]
    },
    xaxis: {
      categories: ['Produkt', 'Markedsføring', 'Organisation', 'Proces'],
      labels: {
        style: {
          colors: [this.chartColors.textColor, this.chartColors.textColor, this.chartColors.textColor, this.chartColors.textColor]
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: 8,
        style: {
          colors: [this.chartColors.textColor],
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
        strokeColor: [this.chartColors.blueSolid, this.chartColors.orangeSolid, this.chartColors.greenSolid]
      }
    }
  };
  expandedContent = '';

  barOptions(
    animationsEnabled = true,
    annotation: XAxisAnnotations['x'][] = [],
    categories: ApexXAxis['categories'] = [],
    colors: ApexFill['colors'] = [],
    max: ApexYAxis['max'],
    showXLabels = true,
    strokes: ApexStroke['colors'] = [],
    title = '',
    tooltipEnabled = false,
    tooltips = '' as any,
    types: ApexFill['type'] = [],
    xaxis: ApexTitleSubtitle['text'] = '',
    yaxis: ApexTitleSubtitle['text'] = ''
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
        },
        events: {
          mounted: function () {
            document.querySelectorAll<HTMLElement>('.innovationtest .apexcharts-xaxis-annotations line').forEach(line => {
              line.style.strokeDasharray = '2';
            });
          }
        }
      },
      plotOptions: {
        bar: {
          barHeight: '70%',
          dataLabels: {},
          distributed: true
        }
      },
      fill: {
        opacity: 1,
        type: types,
        pattern: {
          style: 'slantedLines',
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
          colors: [this.chartColors.textColor],
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
          text: yaxis,
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
            if (max || max !== 100) {
              return value.toLocaleString('da-DK');
            }

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
            borderColor: this.chartColors.blueSolid,
            strokeDashArray: 2,
            label: {
              text: 'Din vurdering',
              offsetY: 16,
              orientation: 'horizontal',
              borderColor: 'transparent',
              style: {
                background: '#f5f5f5',
                padding: {
                  top: 24,
                  right: 12
                }
              }
            }
          },
          {
            x: annotation && annotation[1] ? annotation[1] : '',
            borderColor: this.chartColors.orangeSolid,
            label: {
              text: annotation && annotation[1] === annotation[0] ? 'Dit resultat &' : 'Dit resultat',
              orientation: 'horizontal',
              borderColor: 'transparent',
              style: {
                background: '#f5f5f5',
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
          text: xaxis,
          style: {
            fontWeight: 400
          }
        },
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
            formatter: (value: string) => {
              if (title) {
                return title;
              }

              return value;
            }
          }
        },
        x: {
          formatter: (value: number, { dataPointIndex }: ApexDiscretePoint) => {
            if (tooltips && dataPointIndex) {
              if (value === tooltips[dataPointIndex]) {
                return tooltips[dataPointIndex];
              }

              return tooltips && value + ': ' + tooltips[dataPointIndex];
            }

            return value;
          }
        }
      }
    };
  }

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
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [this.chartColors.blue, this.chartColors.orange, this.chartColors.green],
          5,
          false,
          [this.chartColors.blueSolid, this.chartColors.orangeSolid, this.chartColors.greenSolid],
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
            options: this.barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`prod_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]
                ) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blue;
                }

                return this.chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`prod_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prod_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blueSolid;
                }

                return this.chartColors.greenSolid;
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
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [this.chartColors.blue, this.chartColors.orange, this.chartColors.green],
          5,
          false,
          [this.chartColors.blueSolid, this.chartColors.orangeSolid, this.chartColors.greenSolid],
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
            options: this.barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]
                ) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blue;
                }

                return this.chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`prcs_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`prcs_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blueSolid;
                }

                return this.chartColors.greenSolid;
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
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [this.chartColors.blue, this.chartColors.orange, this.chartColors.green],
          5,
          false,
          [this.chartColors.blueSolid, this.chartColors.orangeSolid, this.chartColors.greenSolid],
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
            options: this.barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`org_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]
                ) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blue;
                }

                return this.chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`org_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`org_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blueSolid;
                }

                return this.chartColors.greenSolid;
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
        options: this.barOptions(
          true,
          undefined,
          ['Din vurdering', 'Dit resultat', 'Andre virksomheder'],
          [this.chartColors.blue, this.chartColors.orange, this.chartColors.green],
          5,
          false,
          [this.chartColors.blueSolid, this.chartColors.orangeSolid, this.chartColors.greenSolid],
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
            options: this.barOptions(
              true, // animationsEnabled
              [this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`], this.results1?.simpleList[`mar_hist${index + 1}_my_bin`]], // annotation
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => item.Variable), // categories
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => {
                if (
                  item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`] &&
                  item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]
                ) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orange;
                }

                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blue;
                }

                return this.chartColors.green;
              }), // colors
              100, // max
              true, // showXLabels
              this.results1?.histogramList[`mar_hist${index + 1}_bins`].map(item => {
                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_my_bin`]) {
                  return this.chartColors.orangeSolid;
                }

                if (item.Variable === this.results1?.simpleList[`mar_hist${index + 1}_vurd_bin`]) {
                  return this.chartColors.blueSolid;
                }

                return this.chartColors.greenSolid;
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
          options: this.barOptions(
            true, // annimationenabled
            [undefined, this.results2.simpleList.hist1_my_bin], // annotation
            this.results2.histogramList.hist1_samlet_bins.map(item => item.Variable), // categories
            this.results2.histogramList.hist1_samlet_bins.map(item => {
              // colors
              if (item.Variable === this.results2?.simpleList.hist1_my_bin) {
                return this.chartColors.orange;
              }
              return this.chartColors.green;
            }),
            undefined, // max
            true, // showXLabels
            this.results2?.histogramList.hist1_samlet_bins.map(item => {
              // strokes
              if (item.Variable === this.results2?.simpleList.hist1_my_bin) {
                return this.chartColors.orangeSolid;
              }

              return this.chartColors.greenSolid;
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
              options: this.barOptions(
                true, // animationsEnabled
                [undefined, this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]], // annotation
                this.results2?.histogramList[`${chartId}_bins`].map(item => item.Variable), // categories
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return this.chartColors.orange;
                  }

                  return this.chartColors.green;
                }), // colors
                undefined, // max
                true, // showXLabels
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return this.chartColors.orangeSolid;
                  }

                  return this.chartColors.greenSolid;
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
          options: this.barOptions(
            true, // annimationenabled
            [undefined, this.results2?.simpleList.hist7_my_bin], // annotation
            this.results2?.histogramList.hist7_samlet_bins.map(item => item.Variable), // categories
            this.results2?.histogramList.hist7_samlet_bins.map(item => {
              // colors
              if (item.Variable === this.results2?.simpleList.hist7_my_bin) {
                return this.chartColors.orange;
              }
              return this.chartColors.green;
            }),
            undefined, // max
            true, // showXLabels
            this.results2?.histogramList.hist7_samlet_bins.map(item => {
              // strokes
              if (item.Variable === this.results2?.simpleList.hist7_my_bin) {
                return this.chartColors.orangeSolid;
              }

              return this.chartColors.greenSolid;
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
              options: this.barOptions(
                true, // animationsEnabled
                [undefined, this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]], // annotation
                this.results2?.histogramList[`${chartId}_bins`].map(item => item.Variable), // categories
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return this.chartColors.orange;
                  }

                  return this.chartColors.green;
                }), // colors
                undefined, // max
                true, // showXLabels
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return this.chartColors.orangeSolid;
                  }

                  return this.chartColors.greenSolid;
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
          options: this.barOptions(
            true, // annimationenabled
            [undefined, this.results2?.simpleList.hist4_my_bin], // annotation
            this.results2?.histogramList.hist4_samlet_bins.map(item => item.Variable), // categories
            this.results2?.histogramList.hist4_samlet_bins.map(item => {
              // colors
              if (item.Variable === this.results2?.simpleList.hist4_my_bin) {
                return this.chartColors.orange;
              }
              return this.chartColors.green;
            }),
            undefined, // max
            true, // showXLabels
            this.results2?.histogramList.hist4_samlet_bins.map(item => {
              // strokes
              if (item.Variable === this.results2?.simpleList.hist4_my_bin) {
                return this.chartColors.orangeSolid;
              }

              return this.chartColors.greenSolid;
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
              options: this.barOptions(
                true, // animationsEnabled
                [undefined, this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]], // annotation
                this.results2?.histogramList[`${chartId}_bins`].map(item => item.Variable), // categories
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return this.chartColors.orange;
                  }

                  return this.chartColors.green;
                }), // colors
                undefined, // max
                true, // showXLabels
                this.results2?.histogramList[`${chartId}_bins`].map(item => {
                  if (item.Variable === this.results2?.simpleList[`${chartPrefix[index]}_my_bin`]) {
                    return this.chartColors.orangeSolid;
                  }

                  return this.chartColors.greenSolid;
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
      this.$nextTick(() => {
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
// $colorOrange: #d23f1e;
$colorOrange: #d23617;
$colorPrimary: $colorOrange;
$colorHover: darken($colorPrimary, 10%);
$colorGrey: #d0cfcf;
$colorBackground: #f5f5f5;
$colorGrey_light: #fafafa;
$colorGrey_dark: #4b4848;
$colorWhite: #ffffff;
$colorBlack: #292929;

$baseFontSize: 16;

$baseUrl: 'https://innovationbenchmark.dk';
html {
  scroll-behavior: smooth;
}

hr {
  border-color: $colorGrey;
  margin-top: 16px;

  @include media-breakpoint-up(sm) {
    margin-top: 40px;
    margin-bottom: 40px;
  }
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
  margin-top: -24px;

  .sliderBackground {
    height: 4px;
    background-color: $colorGrey_dark;
    display: block;
    position: absolute;
    top: -28px;
    pointer-events: none;

    @-moz-document url-prefix() {
      // Target Firefox
      background: none;
    }
  }

  @at-root .calculatingSliders & {
    &:after {
      content: '';
      width: 24px;
      display: block;
      position: absolute;
      background-color: $colorGrey;
      left: -32px;
      top: -28px;
      height: 2px;

      @include media-breakpoint-up(sm) {
        width: 40px;
        left: -48px;
      }
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
    }

    &.selected {
      visibility: visible;

      &:before {
        visibility: hidden !important;
      }
    }
  }
}

@-moz-document url-prefix() {
  .sliderOptions {
    .sliderBackground {
      background: none;
      top: -40px !important;
    }

    &_item {
      &:before {
        top: -32px !important;
      }
    }

    @at-root .calculatingSliders &:after {
      top: -40px !important;
    }
  }
}

input[type='range'] {
  width: 100%;
  margin: 8px 0;
  background-color: transparent;
  padding: 16px 0 40px;
  -webkit-appearance: none;

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
    width: 16px;
    height: 16px;
    background: #ffffff;
    border: 2px solid #797272;
    border-radius: 50%;
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
      background-color: transparent;
    }
  }

  &-right {
    margin-right: 0;
    margin-left: auto;
    display: block;
  }
}

.formWrapper {
  margin-bottom: 32px;

  // Vertical line
  @at-root .calculatingSliders &.calculatingSlider {
    &:not(:first-of-type) {
      &:before {
        content: '';
        width: 2px;
        position: absolute;
        background-color: $colorGrey;
        left: -16px;
        bottom: 38px;
        height: calc(100% + 32px);

        @include media-breakpoint-up(sm) {
          left: -32px;
          height: calc(100% + 32px);
        }
      }
    }

    &:nth-of-type(2) {
      &:after {
        content: 'Max 100%';
        position: absolute;
        bottom: 0;
        font-size: 12px;
        left: -56px;
        transform: rotate(-90deg) translateX(50%);

        @include media-breakpoint-up(sm) {
          left: -80px;
        }

        @at-root .test2 & {
          bottom: auto;
          top: 0;
          transform: rotate(-90deg) translateX(-50%);
        }
      }
    }
  }

  &_description {
    hyphens: auto;
  }
}

@-moz-document url-prefix() {
  .formWrapper {
    @at-root .calculatingSliders &.calculatingSlider {
      &:not(:first-of-type) {
        &:before {
          bottom: 46px !important;
        }
      }
    }
  }

  .calculatingSliders:before {
    @at-root .test2 & {
      top: 986px !important;
    }
  }

  .nav-button:before {
    line-height: 28px !important;
  }
}

.calculatingSliders {
  position: relative;
  padding-left: 40px;

  @include media-breakpoint-up(sm) {
    padding-left: 66px;
  }

  // &:before {
  //   content: 'Max 100%';
  //   width: auto;
  //   height: auto;
  //   position: absolute;
  //   bottom: 42%;
  //   transform: translateX(calc(-100%)) rotate(-90deg);
  //   font-size: 12px;
  //   left: 40px;
  //   @include media-breakpoint-up(sm) {
  //     left: 48px;
  //   }
  //   @at-root .test2 & {
  //     bottom: auto;
  //     top: 1130px;

  //     @include media-breakpoint-up(md) {
  //       top: 910px;
  //     }
  //   }
  // }
}

.card {
  box-shadow: none;
  border-color: #d7dadf;
  @at-root .frontPageMatter &,
    .test2 & {
    height: 100%;
  }
  &-text {
    padding: 0 32px 32px;

    & >>> h3 {
      margin-top: 16px;
    }

    & >>> ul {
      @at-root .prosAndCons & {
        list-style: none;
        padding: 0;
        margin-bottom: 32px;

        li {
          margin-bottom: 16px;
          padding-left: 40px;
          position: relative;

          &:before {
            content: '';
            display: block;
            position: absolute;
            width: 24px;
            height: 24px;
            left: 0;
          }
        }
      }

      @at-root .prosAndCons &:first-of-type {
        li:before {
          background: transparent url($baseUrl + '/img/listItem-pro.svg') center / contain no-repeat;
        }
      }

      @at-root .prosAndCons &:last-of-type {
        li:before {
          background: transparent url($baseUrl + '/img/listItem-con.svg') center / contain no-repeat;
        }
      }
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
    padding: 32px 32px 16px;

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

.apexcharts-xaxis-annotations line {
  stroke-dasharray: 2;
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

.apexcharts-radar-series polygon {
  fill: $colorWhite;
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
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;

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

  &_back {
    @include media-breakpoint-up(sm) {
      margin-top: 32px;
    }

    &:after {
      content: none;
    }

    &:before {
      content: '';
      display: inline-block;
      width: 16px;
      height: 24px;
      background: transparent url($baseUrl + '/img/arrow--orange.svg') center / 16px no-repeat;
      margin-right: 12px;
      transition: all 220ms ease-in-out;
      transform: rotate(180deg);
    }

    &:hover {
      text-decoration: underline;
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

.button.expandButton {
  text-decoration: none;
  position: relative;
  color: $colorOrange;
  font-size: 14px;
  min-height: auto;
  font-weight: bold;
}

.chartBottom {
  font-size: 12px;
  line-height: 16px;
  margin-top: -24px;

  @include media-breakpoint-up(sm) {
    padding-left: 36px;
  }

  &-subtitle {
    font-size: 12px;
    line-height: 16px;
    margin-top: 24px;
    color: $colorGrey_dark;
  }
}

.alert {
  width: 100%;
}

.expandedContent {
  transition: all 220ms ease-in-out;

  &.isExpanded {
    padding-top: 24px;

    @include media-breakpoint-up(sm) {
      padding-top: 64px;
    }
  }
}

.expandedChart {
  position: relative;
  @include media-breakpoint-up(sm) {
    &:after {
      content: '';
      width: 1px;
      display: block;
      position: absolute;
      left: 50%;
      bottom: -62px;
      background: $colorPrimary;
      height: 48px;
      transform: translateX(8px);
    }
  }

  @at-root .test2 & {
    @include media-breakpoint-up(sm) {
      &:after {
        left: 25%;
      }
    }
  }
}

legend {
  font-weight: 600;
  margin-bottom: 0;

  & + p {
    margin-top: 0;
  }
}

.form-select {
  background-color: $colorWhite;
}

.form-group {
  width: 100% !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
