<template>
  <div>
    <Page :title="title" :head="meta">
      <div class="mb-6">
        <v-btn
          color="accent"
          class="mt-4 mr-2"
          outlined
          @click="$refs.pricingDialog.open()"
        >
          <v-icon left>{{ mdiCalculator }}</v-icon>
          Pricing
        </v-btn>

        <v-btn
          color="accent"
          href="/list-sample.zip"
          class="mt-4 mr-2"
          outlined
        >
          <v-icon left>{{ mdiDownload }}</v-icon>
          Sample list
        </v-btn>

        <v-btn color="accent" class="mt-4" outlined @click="faqDialog = true">
          <v-icon left>{{ mdiForum }}</v-icon>
          FAQs
        </v-btn>
      </div>

      <h2 id="form" class="mb-2">Create your list</h2>

      <p>
        Get started by selecting one or more technologies. Optionally add
        filters and limits to customise your list. An obligation free quote will
        be created and your list is available immediately upon completing the
        order.
      </p>

      <template #content>
        <v-card class="my-4" color="secondary">
          <v-card-text v-if="error">
            <v-alert type="error">
              {{ error }}
            </v-alert>
          </v-card-text>
          <v-row>
            <v-col class="py-0 pr-sm-0" cols="12" sm="6">
              <v-card-title class="subtitle-1">
                <v-icon color="primary" left>{{ mdiFormatListChecks }}</v-icon>
                Selection
              </v-card-title>
              <v-card-text>
                <v-card>
                  <v-card-title class="subtitle-2">Technologies</v-card-title>
                  <v-card-text>
                    <p class="mb-0">
                      Choose one or more technologies (e.g. 'Shopify') or
                      categories (e.g. 'Ecommerce').
                    </p>

                    <Technologies ref="selector" @select="selectItem" />
                  </v-card-text>
                  <v-card-text
                    v-if="selectedItems.length"
                    class="px-0 pt-0 mt-n4"
                  >
                    <v-simple-table>
                      <tbody>
                        <tr>
                          <th>Technology</th>
                          <th width="30%">
                            Version

                            <v-tooltip max-width="300" top>
                              <template #activator="{ on }">
                                <sup>
                                  <v-icon small v-on="on">{{
                                    mdiHelpCircleOutline
                                  }}</v-icon>
                                </sup>
                              </template>

                              Optionaly specify a technology version in SemVer
                              notation, e.g. '2' or '2.0.0'.<br /><br />
                              <code>&gt;=</code> Equal to or greater than<br />
                              <code>=&nbsp;</code> Exact match<br />
                              <code>&lt;=</code> Equal to or lower than<br /><br />
                              Leave blank to include all versions.<br /><br />
                              Not available on all technologies.
                            </v-tooltip>
                          </th>
                          <th width="1"></th>
                        </tr>
                        <tr v-for="item in selectedItems" :key="item.slug">
                          <td>
                            <div
                              v-if="item.type === 'technology'"
                              class="d-flex align-center py-2"
                            >
                              <TechnologyIcon :icon="item.icon" />
                              <span>{{ item.name }}</span>
                            </div>
                            <v-row v-else>
                              <v-col>
                                {{ item.name }}
                              </v-col>
                              <v-col class="pr-0 text-right">
                                <small
                                  >{{
                                    item.technologiesCount
                                  }}
                                  technologies</small
                                >
                              </v-col>
                            </v-row>
                          </td>
                          <td>
                            <v-row v-if="item.type === 'technology'">
                              <v-col class="py-0 pr-2">
                                <v-select
                                  v-model="item.operator"
                                  :items="[
                                    { text: '>=', value: '>=' },
                                    { text: '=', value: '=' },
                                    { text: '<=', value: '<=' },
                                  ]"
                                  class="my-0"
                                  hide-details="auto"
                                  dense
                                />
                              </v-col>
                              <v-col class="pa-0">
                                <v-text-field
                                  v-model="item.version"
                                  placeholder="Any"
                                  class="ma-0"
                                  hide-details="auto"
                                  :rules="[
                                    (v) => !v || /^(\d.?){1,3}$/.test(v),
                                  ]"
                                  dense
                                />
                              </v-col>
                            </v-row>
                            <span v-else class="text--disabled">-</span>
                          </td>
                          <td class="pl-0">
                            <v-btn icon @click="removeItem(item)">
                              <v-icon>{{ mdiCloseCircleOutline }}</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-simple-table>
                  </v-card-text>

                  <template v-if="selectedItems.length === 2">
                    <v-divider />

                    <v-card-text>
                      Create a list of websites that use...
                      <v-radio-group
                        v-model="matchAllTechnologies"
                        hide-details
                        :disabled="
                          selectedItems.length !== 2 ||
                          selected.technologies.length !== 2
                        "
                      >
                        <v-radio class="mt-0" value="or" hide-details>
                          <template #label>
                            <div>
                              {{ selectedItems[0].name }} <strong>or</strong>
                              {{ selectedItems[1].name }}
                            </div>
                          </template>
                        </v-radio>
                        <v-radio class="mt-0" value="and" hide-details>
                          <template #label>
                            <div>
                              {{ selectedItems[0].name }} <strong>and</strong>
                              {{ selectedItems[1].name }}
                            </div>
                          </template>
                        </v-radio>
                        <v-radio class="mt-0" value="not" hide-details>
                          <template #label>
                            <div>
                              {{ selectedItems[0].name }} and
                              <strong>not</strong>
                              {{ selectedItems[1].name }}
                            </div>
                          </template>
                        </v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </template>
                </v-card>
              </v-card-text>

              <v-card-text>
                <v-expansion-panels
                  v-model="panelsSelection"
                  :disabled="!selectedItems.length"
                  multiple
                >
                  <v-expansion-panel ref="industries">
                    <v-expansion-panel-header class="subtitle-2">
                      Industries
                      <span class="grey--text font-weight-regular ml-1"
                        >(optional)</span
                      >
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>Choose which website industries to include.</p>

                      <v-select
                        ref="industry"
                        v-model="selectedIndustry"
                        :items="industries"
                        class="mb-4 pt-0"
                        label="Select an industry"
                        hide-details
                        eager
                      />

                      <v-select
                        v-if="subIndustries"
                        ref="subIndustry"
                        :items="subIndustries"
                        class="mb-4 pt-0"
                        label="Select a secondary industry"
                        hide-details
                        eager
                      >
                        <template #prepend-item>
                          {{
                            (item = selected.industries.find(
                              ({ value }) => value === selectedIndustry
                            ) || {
                              text: industries.find(
                                ({ value }) => value === selectedIndustry
                              ).text,
                              value: selectedIndustry,
                            }) && null
                          }}
                          <v-list-item ripple @click="toggleIndustry(item)">
                            <v-list-item-action>
                              <v-icon
                                :color="item && item.active ? 'primary' : ''"
                                >{{
                                  item && item.active
                                    ? mdiCheckboxMarked
                                    : mdiCheckboxBlankOutline
                                }}</v-icon
                              >
                            </v-list-item-action>
                            <v-list-item-content
                              >{{ item.text }} (all)</v-list-item-content
                            >
                          </v-list-item>

                          <v-divider class="mt-3 mb-2"></v-divider>
                        </template>
                        <template #item="{ item }">
                          <v-list-item ripple @click="toggleIndustry(item)">
                            <v-list-item-action>
                              <v-icon :color="item.active ? 'primary' : ''">{{
                                item.active
                                  ? mdiCheckboxMarked
                                  : mdiCheckboxBlankOutline
                              }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                              {{ item.text }}
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-chip-group
                        v-if="selected.industries.length"
                        class="mt-n1 mb-2"
                        column
                      >
                        <v-chip
                          v-for="item in selected.industries"
                          :key="item.value"
                          color="primary"
                          outlined
                          close
                          @click:close="toggleIndustry(item)"
                        >
                          {{ item.text }}
                        </v-chip>
                      </v-chip-group>

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-8 mb-2"
                        dense
                      >
                        <small>
                          We classify website content using machine learning to
                          best-guess industry. For best results, select all or
                          as many secondary industries as possible.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="attributes">
                    <v-expansion-panel-header class="subtitle-2">
                      Required attributes
                      <span class="grey--text font-weight-regular ml-1"
                        >(optional)</span
                      >
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Only include results that have <strong>any</strong> of
                        these attributes available.
                      </p>

                      <v-checkbox
                        v-model="requiredSets.email"
                        label="Email address"
                        hide-details
                        :disabled="australia"
                      />
                      <v-checkbox
                        v-model="requiredSets.phone"
                        label="Phone number"
                        hide-details
                        :disabled="australia"
                      />
                      <v-checkbox
                        v-model="requiredSets.social"
                        label="Social media profiles"
                        hide-details
                      />

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-8 mb-2"
                        dense
                      >
                        <small>
                          Contact details are obtained from websites' contact
                          pages. Leave blank to include all results, including
                          websites for which we don't have contact information.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="compliance">
                    <v-expansion-panel-header class="subtitle-2">
                      Compliance
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-radio-group
                        v-model="compliance"
                        class="my-0"
                        mandatory
                      >
                        <v-radio
                          value="include"
                          class="mt-0"
                          hide-details
                          :disabled="australia"
                        >
                          <template #label>Include contact details</template>
                        </v-radio>
                        <v-radio
                          value="excludeEU"
                          class="mt-0"
                          hide-details
                          :disabled="australia"
                        >
                          <template #label>
                            Exclude contact details of EU websites
                          </template>
                        </v-radio>
                        <v-radio value="exclude" class="mt-0" hide-details>
                          <template #label>
                            Exclude all contact details
                          </template>
                        </v-radio>
                      </v-radio-group>

                      <v-checkbox
                        v-model="australia"
                        label="I'm in or do business in Australia"
                        class="mt-0"
                        hide-details
                      />

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-8 mb-2"
                        dense
                      >
                        <small>
                          We're unable to supply email addresses and phone
                          numbers if you're in Australia or carry on business or
                          activities in Australia.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>
            </v-col>
            <v-col class="py-0 pl-sm-0" cols="12" sm="6">
              <v-card-title
                :class="`subtitle-1 ${
                  selectedItems.length ? '' : 'text--disabled'
                }`"
              >
                <v-icon :color="selectedItems.length ? 'primary' : ''" left>{{
                  mdiArrowCollapseVertical
                }}</v-icon>
                Limits <span class="grey--text ml-1">(optional)</span>
              </v-card-title>
              <v-card-text>
                <v-expansion-panels
                  v-model="panelsLimits"
                  :disabled="!selectedItems.length"
                  multiple
                >
                  <v-expansion-panel ref="subset">
                    <v-expansion-panel-header class="subtitle-2">
                      List size &amp; website traffic
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Optionally limit the size of the list to a number of
                        high or low traffic websites per technology.
                      </p>

                      <div style="max-width: 150px">
                        <v-text-field
                          v-model="subset"
                          label="Size limit"
                          :rules="[
                            (v) =>
                              !v ||
                              /^[0-9]+$/.test(v) ||
                              'Value must be numeric',
                            (v) =>
                              !v ||
                              (parseInt(v, 10) >= 500 &&
                                (isAdmin || parseInt(v, 10) <= 1000000)) ||
                              'Subset size must be between at 500 and 1M. For larger lists, please contact us.',
                          ]"
                          class="mt-6 mb-8 pt-0"
                          placeholder="500000"
                          hide-details="auto"
                        />
                      </div>

                      <v-slider
                        v-model="subsetSlice"
                        label="Traffic"
                        :tick-labels="['Highest', '', 'Medium', '', 'Lowest']"
                        :disabled="!subset"
                        min="0"
                        max="4"
                        hide-details="auto"
                        class="mb-10"
                      />

                      <v-checkbox
                        v-model="excludeNoTraffic"
                        label="Exclude websites without traffic data"
                        hide-details
                      />

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-6 mb-2"
                        dense
                      >
                        <small>
                          Set a list size limit to control your budget or to
                          only include less trafficked websites. The default
                          limit is 500,000 most trafficked websites per
                          technology.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="age">
                    <v-expansion-panel-header class="subtitle-2">
                      Data age
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Choose a range in months to only include websites
                        verified within this range. Recommended range is 0-3.
                      </p>

                      <v-row class="mt-6">
                        <v-col>
                          <v-slider
                            v-model="minAge"
                            label="Min"
                            min="0"
                            max="11"
                            thumb-size="20"
                            thumb-label="always"
                            hint="A non-zero minimum returns historical results only"
                            :rules="[
                              (v) => v < maxAge || 'Must be lower than max age',
                            ]"
                            :persistent-hint="minAge > 0"
                            hide-details="auto"
                          />
                        </v-col>
                        <v-col>
                          <v-slider
                            v-model="maxAge"
                            label="Max"
                            min="1"
                            max="12"
                            thumb-size="20"
                            thumb-label="always"
                            :rules="[
                              (v) =>
                                v > minAge || 'Must be greater than min age',
                            ]"
                            hide-details="auto"
                          />
                        </v-col>
                      </v-row>

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-6 mb-2"
                        dense
                      >
                        <small>
                          We attempt to analyse every website at least once a
                          month. A range of 0-3 means we include websites that
                          have been verified at least once in the last three
                          months.<br /><br />
                          A lower maximum yields fresher but fewer results.<br />
                          A higher maximum yields more but possibly outdated
                          results.<br />
                          A higher minimum yields historic data.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="exclusions">
                    <v-expansion-panel-header class="subtitle-2">
                      Exclusions
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>
                        Upload a .txt file with domain names to exclude, each on
                        a new line.
                      </p>

                      <v-file-input
                        :error-messages="fileErrors"
                        placeholder="Select a file..."
                        accept="text/plain"
                        hide-details="auto"
                        class="mb-4 pt-0"
                        @change="fileChange"
                      />

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-6 mb-2"
                        dense
                      >
                        <small>
                          If you purchased a similar list before and want to
                          avoid duplicates, upload a list of websites to
                          exclude. This way you only pay for results you don't
                          already have.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-card-text>

              <v-card-title
                :class="`subtitle-1 ${
                  selectedItems.length ? '' : 'text--disabled'
                }`"
              >
                <v-icon :color="selectedItems.length ? 'primary' : ''" left>{{
                  mdiFilterOutline
                }}</v-icon>
                Filters <span class="grey--text ml-1">(optional)</span>
              </v-card-title>
              <v-card-text>
                <v-expansion-panels :disabled="!selectedItems.length" multiple>
                  <v-expansion-panel ref="ipCountries">
                    <v-expansion-panel-header class="subtitle-2">
                      IP countries
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>Target countries by website IP address.</p>

                      <v-select
                        ref="country"
                        :items="geoIps"
                        class="mb-4 pt-0"
                        label="Select a country"
                        hide-details
                        eager
                      >
                        <template #prepend-item>
                          <v-list-item
                            ripple
                            @click="toggleGeoIps(countriesEurope)"
                          >
                            <v-list-item-content>Europe</v-list-item-content>
                          </v-list-item>
                          <v-list-item
                            ripple
                            @click="toggleGeoIps(countriesEU)"
                          >
                            <v-list-item-content>
                              European Union
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider class="mt-3 mb-2"></v-divider>
                        </template>

                        <template #item="{ item }">
                          <v-list-item ripple @click="toggleGeoIp(item)">
                            <v-list-item-action>
                              <v-icon :color="item.active ? 'primary' : ''">{{
                                item.active
                                  ? mdiCheckboxMarked
                                  : mdiCheckboxBlankOutline
                              }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                              <v-row class="align-center">
                                <v-col class="py-0">
                                  {{ item.text }}
                                </v-col>
                                <v-col
                                  class="py-0 nowrap text-right body-2 flex-grow-0"
                                >
                                  {{ item.value }}
                                </v-col>
                              </v-row>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-chip-group
                        v-if="selected.geoIps.length"
                        class="mt-n1 mb-2"
                        column
                      >
                        <v-tooltip
                          v-for="(item, i) in selected.geoIps"
                          :key="i"
                          bottom
                        >
                          <template #activator="{ on }">
                            <v-chip
                              color="primary"
                              outlined
                              close
                              v-on="on"
                              @click:close="toggleGeoIp(item)"
                            >
                              {{ item.value }}
                            </v-chip>
                          </template>

                          {{
                            item.parent && item.parent !== item.text
                              ? `${item.parent} (${item.text})`
                              : item.text
                          }}
                        </v-tooltip>
                      </v-chip-group>

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-6 mb-2"
                        dense
                      >
                        <small>
                          We perform a lookup on a website's IP address to
                          determine the country it's hosted in. This may be
                          different from the country a business operates from.
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="tlds">
                    <v-expansion-panel-header class="subtitle-2">
                      Top-level domains
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>Target countries by top-level domain.</p>

                      <v-row>
                        <v-col>
                          <v-select
                            ref="country"
                            v-model="selectedCountry"
                            :items="countries"
                            class="mb-4 pt-0"
                            label="Select a country"
                            hide-details
                            eager
                          />
                        </v-col>
                        <v-col>
                          <v-form ref="form" @submit.prevent="addTld">
                            <v-text-field
                              v-model="tld"
                              :error-messages="tldErrors"
                              :append-icon="mdiPlus"
                              placeholder=".com"
                              class="pt-0"
                              hide-details="auto"
                              @click:append="addTld"
                            />
                          </v-form>
                        </v-col>
                      </v-row>

                      <v-select
                        v-if="selectedCountry"
                        ref="tld"
                        :items="tlds"
                        class="mb-8"
                        label="Select a top-level-domain"
                        hide-details
                        eager
                      >
                        <template #prepend-item>
                          <v-list-item ripple @click="toggleTlds">
                            <v-list-item-action>
                              <v-icon
                                :color="
                                  selected.tlds.length > 0 ? 'primary' : ''
                                "
                                >{{
                                  tlds.every(({ active }) => active)
                                    ? mdiCheckboxMarked
                                    : tlds.some(({ active }) => active)
                                    ? mdiMinusBoxOutline
                                    : mdiCheckboxBlankOutline
                                }}</v-icon
                              >
                            </v-list-item-action>

                            <v-list-item-content>
                              <v-list-item-title>Select All</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider class="mt-2"></v-divider>
                        </template>

                        <template #item="{ item }">
                          <v-list-item ripple @click="toggleTld(item)">
                            <v-list-item-action>
                              <v-icon :color="item.active ? 'primary' : ''">{{
                                item.active
                                  ? mdiCheckboxMarked
                                  : mdiCheckboxBlankOutline
                              }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                              {{ item.text }}
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-chip-group
                        v-if="selected.tlds.length"
                        class="mt-n1 mb-4"
                        column
                      >
                        <v-tooltip
                          v-for="(item, i) in selected.tlds"
                          :key="i"
                          bottom
                        >
                          <template #activator="{ on }">
                            <v-chip
                              color="primary"
                              outlined
                              close
                              v-on="item.parent ? on : undefined"
                              @click:close="toggleTld(item)"
                            >
                              {{ item.value }}
                            </v-chip>
                          </template>

                          {{ item.parent }}
                        </v-tooltip>
                      </v-chip-group>

                      <v-alert
                        color="secondary"
                        border="left"
                        class="mt-4 mb-2"
                        dense
                      >
                        <small>
                          The top-level domain is the last part of a domain name
                          (e.g. '.com'). This can be used to target websites in
                          specific countries (e.g. '.com.au' for Australia).
                        </small>
                      </v-alert>
                    </v-expansion-panel-content>
                  </v-expansion-panel>

                  <v-expansion-panel ref="languages">
                    <v-expansion-panel-header class="subtitle-2">
                      Languages
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <p>Target websites using specific languages.</p>

                      <v-select
                        ref="language"
                        v-model="selectedLanguage"
                        :items="languages"
                        class="mb-4 pt-0"
                        label="Select a language"
                        hide-details
                        eager
                      >
                        <template #item="{ item }">
                          <v-list-item ripple @click="toggleLanguage(item)">
                            <v-list-item-action>
                              <v-icon :color="item.active ? 'primary' : ''">{{
                                typeof item.value === 'object'
                                  ? mdiDotsHorizontal
                                  : item.active
                                  ? mdiCheckboxMarked
                                  : mdiCheckboxBlankOutline
                              }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                              <v-row class="align-center">
                                <v-col class="py-0">
                                  {{ item.text }}
                                </v-col>
                                <v-col
                                  class="py-0 nowrap text-right body-2 flex-grow-0"
                                >
                                  {{
                                    typeof item.value === 'object'
                                      ? item.value[Object.keys(item.value)[0]]
                                      : item.value
                                  }}
                                </v-col>
                              </v-row>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-select
                        v-if="variants"
                        ref="variant"
                        :items="variants"
                        class="mb-4"
                        label="Select a language country"
                        hide-details
                        eager
                      >
                        <template #prepend-item>
                          <v-list-item ripple @click="toggleVariants">
                            <v-list-item-action>
                              <v-icon
                                :color="
                                  selected.languages.length > 0 ? 'primary' : ''
                                "
                                >{{
                                  variants.every(({ active }) => active)
                                    ? mdiCheckboxMarked
                                    : variants.some(({ active }) => active)
                                    ? mdiMinusBoxOutline
                                    : mdiCheckboxBlankOutline
                                }}</v-icon
                              >
                            </v-list-item-action>

                            <v-list-item-content>
                              <v-list-item-title>Select All</v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>

                          <v-divider class="mt-2"></v-divider>
                        </template>

                        <template #item="{ item }">
                          <v-list-item ripple @click="toggleVariant(item)">
                            <v-list-item-action>
                              <v-icon :color="item.active ? 'primary' : ''">{{
                                item.active
                                  ? mdiCheckboxMarked
                                  : mdiCheckboxBlankOutline
                              }}</v-icon>
                            </v-list-item-action>

                            <v-list-item-content>
                              <v-row class="align-center">
                                <v-col class="py-0">
                                  {{ item.text }}
                                </v-col>
                                <v-col
                                  class="py-0 nowrap text-right body-2 flex-grow-0"
                                  >{{ item.value }}</v-col
                                >
                              </v-row>
                            </v-list-item-content>
                          </v-list-item>
                        </template>
                      </v-select>

                      <v-chip-group
                        v-if="selected.languages.length"
                        class="mt-n1"
                        column
                      >
                        <v-tooltip
                          v-for="(item, i) in selected.languages"
                          :key="i"
                          bottom
                        >
                          <template #activator="{ on }">
                            <v-chip
                              color="primary"
                              outlined
                              close
                              v-on="on"
                              @click:close="toggleVariant(item)"
                            >
                              {{ item.value }}
                            </v-chip>
                          </template>

                          {{
                            item.parent && item.parent !== item.text
                              ? `${item.parent} (${item.text})`
                              : item.text
                          }}
                        </v-tooltip>
                      </v-chip-group>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

                <v-checkbox
                  v-model="matchAll"
                  class="mb-4"
                  label="Match all filters (yields fewer results)"
                  :disabled="!selectedItems.length"
                  hide-details
                ></v-checkbox>
              </v-card-text>
            </v-col>
          </v-row>
        </v-card>

        <v-btn
          :disabled="!selectedItems.length"
          :loading="creating"
          color="primary"
          class="mt-4 mb-4"
          large
          @click="submit()"
          >Create list <v-icon right>{{ mdiArrowRight }}</v-icon>
        </v-btn>

        <p class="mb-8 text--disabled">
          <small>
            By using our services, you agree to our
            <nuxt-link to="/terms/" target="_blank">terms of service</nuxt-link
            >.
          </small>
        </p>
      </template>

      <v-dialog v-model="confirmDialog" max-width="500px">
        <v-card>
          <v-card-title> No filters or limits specified </v-card-title>
          <v-card-text class="pb-0">
            This list could be very large. Set a list size limit or add a filter
            to narrow down the results.
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="accent"
              text
              @click="
                confirmDialog = false
                creating = false
              "
              >Return to form</v-btn
            >
            <v-btn color="accent" text @click="submit(true)"
              >Continue anyway</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="signInDialog" max-width="400px">
        <SignIn mode-continue mode-sign-up />
      </v-dialog>

      <PricingDialog ref="pricingDialog" product="list" />

      <v-dialog v-model="faqDialog" max-width="600px">
        <v-card>
          <v-card-title> Frequently asked questions </v-card-title>
          <v-card-text class="pb-0">
            <Faqs topic="lists" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="accent" text @click="faqDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <template #footer>
        <Logos />
      </template>
    </Page>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  mdiCalculator,
  mdiDownload,
  mdiForum,
  mdiFormatListChecks,
  mdiCloseCircleOutline,
  mdiHelpCircleOutline,
  mdiCheckboxMarked,
  mdiCheckboxBlankOutline,
  mdiMinusBoxOutline,
  mdiDotsHorizontal,
  mdiPlus,
  mdiArrowRight,
  mdiFilterOutline,
  mdiArrowCollapseVertical,
} from '@mdi/js'
import Page from '~/components/Page.vue'
import Technologies from '~/components/Technologies.vue'
import TechnologyIcon from '~/components/TechnologyIcon.vue'
import Logos from '~/components/Logos.vue'
import SignIn from '~/components/SignIn.vue'
import PricingDialog from '~/components/PricingDialog.vue'
import Faqs from '~/components/Faqs.vue'
import { lists as meta } from '~/assets/json/meta.json'
import languages from '~/assets/json/languages.json'
import tlds from '~/assets/json/tlds.json'
import countries from '~/assets/json/countries.json'
import industries from '~/assets/json/iab.json'

const countriesEU = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
]

const countriesEurope = [
  ...countriesEU,
  'AL',
  'AD',
  'AM',
  'BY',
  'BA',
  'FO',
  'GE',
  'GI',
  'IS',
  'IM',
  'LI',
  'MK',
  'MD',
  'MC',
  'Mo',
  'NO',
  'RU',
  'SM',
  'RS',
  'CH',
  'TR',
  'UA',
  'GB',
  'VA',
]

export default {
  components: {
    Page,
    Technologies,
    TechnologyIcon,
    Logos,
    SignIn,
    PricingDialog,
    Faqs,
  },
  data() {
    return {
      title: meta.title,
      industries: industries.reduce(
        (industries, { id, category }) => [
          ...industries,
          {
            text: category,
            value: id,
          },
        ],
        []
      ),
      australia: false,
      compliance: 'include',
      countries: Object.keys(tlds),
      countriesEU,
      countriesEurope,
      confirmDialog: false,
      error: false,
      requiredSets: {
        email: false,
        phone: false,
        social: false,
      },
      createDialog: false,
      faqDialog: false,
      file: '',
      fileErrors: [],
      matchAll: false,
      matchAllTechnologies: 'or',
      mdiCalculator,
      mdiDownload,
      mdiForum,
      mdiFormatListChecks,
      mdiCloseCircleOutline,
      mdiHelpCircleOutline,
      mdiCheckboxMarked,
      mdiCheckboxBlankOutline,
      mdiMinusBoxOutline,
      mdiDotsHorizontal,
      mdiPlus,
      mdiArrowRight,
      mdiFilterOutline,
      mdiArrowCollapseVertical,
      minAge: 0,
      maxAge: 3,
      meta,
      panelsSelection: [],
      panelsLimits: [],
      panelsFilters: [],
      signInDialog: false,
      selectedCountry: '',
      selectedIndustry: '',
      selectedLanguage: {},
      selected: {
        categories: [],
        technologies: [],
        industries: [],
        geoIps: [],
        tlds: [],
        languages: [],
      },
      subset: null,
      subsetSlice: 0,
      excludeNoTraffic: false,
      updateQueryTimeout: null,
      list: false,
      creating: false,
      tld: '',
      tldErrors: [],
      languages: Object.keys(languages).reduce(
        (list, text) => [...list, { text, value: languages[text] }],
        []
      ),
    }
  },
  computed: {
    ...mapState({
      user: ({ user }) => user.attrs,
      isSignedIn: ({ user }) => user.isSignedIn,
      isAdmin: ({ user }) =>
        user.attrs.admin || (user.impersonator && user.impersonator.admin),
    }),
    selectedItems() {
      return [...this.selected.categories, ...this.selected.technologies]
    },
    variants() {
      if (typeof this.selectedLanguage.value === 'object') {
        return Object.keys(this.selectedLanguage.value).reduce(
          (list, text) => [
            ...list,
            {
              text,
              parent: this.selectedLanguage.text,
              value: this.selectedLanguage.value[text],
            },
          ],
          []
        )
      } else {
        return false
      }
    },
    subIndustries() {
      const industry = industries.find(({ id }) => id === this.selectedIndustry)

      if (industry && industry.children) {
        return industry.children.reduce(
          (industries, { id, category }) => [
            ...industries,
            {
              text: category,
              value: id,
            },
          ],
          []
        )
      } else {
        return false
      }
    },
    tlds() {
      return tlds[this.selectedCountry].map((tld) => ({
        text: tld,
        active: this.selected.tlds.some(({ value }) => value === tld),
        parent: this.selectedCountry,
        value: tld,
      }))
    },
    geoIps() {
      return countries.map(({ value, text }) => ({
        text,
        active: this.selected.geoIps.some(
          ({ value: _value }) => _value === value
        ),
        value,
      }))
    },
  },
  watch: {
    isSignedIn() {
      if (this.isSignedIn) {
        if (this.user.billingCountry.toLowerCase() === 'au') {
          this.australia = true
        }
      }

      if (this.isSignedIn && this.creating) {
        this.signInDialog = false

        this.submit()
      }
    },
    australia() {
      if (this.australia) {
        this.compliance = 'exclude'

        this.requiredSets.email = false
        this.requiredSets.phone = false
      }
    },
    selectedCountry() {
      this.$nextTick(() => {
        this.$watch('$refs.tld.isMenuActive', (active) => {
          if (!active) {
            this.selectedCountry = ''

            this.$refs.country.blur()
          }
        })
      })
    },
    selected: {
      handler() {
        this.updateQuery()
      },
      deep: true,
    },
    requiredSets: {
      handler() {
        this.updateQuery()
      },
      deep: true,
    },
    subset() {
      this.updateQuery()
    },
    subsetSlice() {
      this.updateQuery()
    },
    excludeNoTraffic() {
      this.updateQuery()
    },
    minAge() {
      this.updateQuery()
    },
    maxAge() {
      this.updateQuery()
    },
    matchAll() {
      this.updateQuery()
    },
    matchAllTechnologies() {
      this.updateQuery()
    },
    compliance() {
      this.updateQuery()
    },
  },
  async mounted() {
    const {
      categories,
      technologies,
      attributes,
      min,
      max,
      subset,
      traffic,
      notraffic,
      countries,
      tlds,
      languages,
      industries: _industries,
      filters,
      selection,
      contacts,
    } = this.$route.query

    if (Object.keys(this.$route.query).length) {
      this.scrollTo('h1')
    }

    if (typeof attributes !== 'undefined') {
      const _attributes = attributes.split(',')

      if (_attributes.includes('email')) {
        this.requiredSets.email = true
      }

      if (_attributes.includes('phone')) {
        this.requiredSets.phone = true
      }

      if (_attributes.includes('social')) {
        this.requiredSets.social = true
      }

      this.$refs.attributes.toggle()
    }

    if (typeof min !== 'undefined') {
      this.minAge = Math.max(0, Math.min(11, parseInt(min || 0, 10)))
    }

    if (typeof max !== 'undefined') {
      this.maxAge = Math.max(1, Math.min(12, parseInt(max || 0, 10)))
    }

    if (typeof min !== 'undefined' || typeof max !== 'undefined') {
      this.$refs.age.toggle()
    }

    if (typeof subset !== 'undefined' && subset !== '500000') {
      this.subset =
        Math.min(1000000, Math.max(500, parseInt(subset || 0, 10))) || null

      this.$refs.subset.toggle()
    }

    if (typeof traffic !== 'undefined') {
      this.subsetSlice = Math.max(0, Math.min(4, parseInt(traffic || 0, 10)))
    }

    if (typeof notraffic !== 'undefined') {
      this.excludeNoTraffic = notraffic === 'exclude'
    }

    if (typeof filters !== 'undefined') {
      this.matchAll = filters === 'and'
    }

    if (contacts === 'exclude' || contacts === 'excludeEU') {
      this.compliance = contacts

      this.$refs.compliance.toggle()
    }

    this.matchAllTechnologies =
      selection === 'and' || selection === 'not' ? selection : 'or'

    if (typeof countries !== 'undefined') {
      countries.split(',').forEach((ipCountry) => {
        const item = this.geoIps.find(
          ({ value }) => value === ipCountry.trim().toUpperCase()
        )

        this.toggleGeoIp(item)
      })

      if (this.selected.geoIps.length) {
        this.$refs.ipCountries.toggle()
      }
    }

    if (tlds) {
      tlds
        .toString()
        .split(',')
        .filter((tld) => tld)
        .forEach((tld) => {
          this.tld = tld

          this.addTld()
        })

      if (this.selected.tlds.length) {
        this.$refs.tlds.toggle()
      }
    }

    if (languages) {
      languages.split(',').forEach((language) => {
        language = language.trim().toLowerCase()

        let selected

        this.languages.forEach((item) => {
          if (typeof item.value === 'object') {
            Object.keys(item.value).forEach((name) => {
              if (item.value[name].toLowerCase() === language) {
                selected = {
                  parent: item.text,
                  text: name,
                  value: item.value[name],
                  active: true,
                }
              }
            })
          } else if (item.value.toLowerCase() === language) {
            item.active = true

            selected = item
          }
        })

        if (selected) {
          this.selected.languages.push(selected)
        }
      })

      if (this.selected.languages.length) {
        this.$refs.languages.toggle()
      }
    }

    if (_industries) {
      _industries.split(',').forEach((id) => {
        const industry = this.industries.find(({ value }) => value === id)

        if (industry) {
          this.toggleIndustry(industry, false)
        } else {
          industries
            .filter(({ children }) => children)
            .forEach(({ children }) => {
              children.forEach(({ id: _id, category: text }) => {
                if (_id === id) {
                  this.toggleIndustry({ text, value: id }, false)
                }
              })
            })
        }
      })

      if (this.selected.industries.length) {
        this.$refs.industries.toggle()
      }
    }

    try {
      if (technologies) {
        for (let technologySlug of technologies.toString().split(',')) {
          let operator = '='
          let version = ''

          if (technologySlug.includes('=')) {
            operator = '='
          }

          if (technologySlug.includes('>=')) {
            operator = '>='
          }

          if (technologySlug.includes('<=')) {
            operator = '<='
          }

          if (operator) {
            ;[technologySlug, version] = technologySlug.split(operator)
          }

          const { slug, name, icon, categories } = (
            await this.$axios.get(`technologies/${technologySlug}`)
          ).data

          this.selected.technologies.push({
            type: 'technology',
            slug,
            name,
            categories,
            icon,
            operator,
            version,
          })
        }
      }

      if (categories) {
        for (const categorySlug of categories.toString().split(',')) {
          const { slug, name, technologies } = (
            await this.$axios.get(`categories/${categorySlug}`)
          ).data

          this.selected.categories.push({
            type: 'category',
            slug,
            name,
            technologiesCount: Object.keys(technologies).length,
          })
        }
      }
    } catch (error) {
      this.error = this.getErrorMessage(error)
    }

    if (this.isSignedIn && this.user.billingCountry.toLowerCase() === 'au') {
      this.australia = true
    }
  },
  methods: {
    async submit(confirmed = false) {
      this.error = ''
      this.creating = true

      if (!this.isSignedIn) {
        this.signInDialog = true

        return
      }

      const totalHostnames = this.selected.technologies.reduce(
        (sum, { hostnames }) => sum + hostnames,
        0
      )

      if (
        !confirmed &&
        (totalHostnames > 100000 || this.selected.categories.length) &&
        !this.selected.languages.length &&
        !this.selected.geoIps.length &&
        !this.selected.tlds.length &&
        !this.selected.industries.length &&
        parseInt(this.subset || 500000, 10) >= 500000
      ) {
        this.confirmDialog = true

        return
      } else {
        this.confirmDialog = false
      }

      this.createDialog = true

      try {
        const list = (
          await this.$axios.put('lists', {
            query: {
              technologies: this.selected.technologies.map(
                ({ slug, name, icon, categories, operator, version }) => ({
                  slug,
                  name,
                  icon,
                  categories,
                  operator,
                  version,
                })
              ),
              categories: this.selected.categories.map(({ slug, name }) => ({
                slug,
                name,
              })),
              languages: this.selected.languages.map(
                ({ text, parent, value }) => ({
                  text:
                    parent && parent !== text ? `${parent} (${text})` : text,
                  value,
                })
              ),
              industries: this.selected.industries.map(({ text, value }) => ({
                text,
                value,
              })),
              geoIps: this.selected.geoIps.map(({ value, text }) => ({
                value,
                text,
              })),
              tlds: this.selected.tlds.map(({ value }) => value),
              matchAll: this.matchAll,
              matchAllTechnologies:
                this.selectedItems.length === 2 &&
                this.selected.technologies.length === 2
                  ? this.matchAllTechnologies
                  : '',
              subset: this.subset || 500000,
              subsetSlice: this.subsetSlice || 0,
              excludeNoTraffic: this.excludeNoTraffic,
              minAge: this.minAge,
              maxAge: this.maxAge,
              requiredSets: Object.keys(this.requiredSets).filter(
                (set) => this.requiredSets[set]
              ),
              compliance: this.compliance,
            },
            exclusions: this.file,
          })
        ).data

        this.$router.push(`/lists/${list.id}`)
      } catch (error) {
        this.error = this.getErrorMessage(error)

        this.creating = false
      }
    },
    selectItem(item) {
      item.active = true
      item.operator = '='
      item.version = ''

      if (item.type === 'technology') {
        this.selected.technologies.push(item)
      } else {
        this.selected.categories.push(item)
      }

      this.categories = this.selected.categories.filter(
        ({ slug }, index) =>
          this.selected.categories.findIndex(
            (category) => slug === category.slug
          ) === index
      )

      this.selected.technologies = this.selected.technologies.filter(
        ({ slug, categories }, index) =>
          this.selected.technologies.findIndex(
            (technology) => slug === technology.slug
          ) === index &&
          !categories.some(({ slug }) =>
            this.selected.categories.some((category) => slug === category.slug)
          )
      )

      this.$refs.selector.clear()
    },
    removeItem(item) {
      item.active = false

      if (item.type === 'technology') {
        this.selected.technologies = this.selected.technologies.filter(
          ({ slug }) => slug !== item.slug
        )
      } else {
        this.selected.categories = this.selected.categories.filter(
          ({ slug }) => slug !== item.slug
        )
      }
    },
    toggleLanguage(item) {
      if (typeof item.value !== 'object') {
        this.toggleVariant(item)

        this.$nextTick(() => {
          this.selectedLanguage = ''

          this.$refs.language.blur()
        })
      } else {
        this.selectedLanguage = item

        this.$nextTick(() => {
          this.$watch('$refs.variant.isMenuActive', (active) => {
            if (!active) {
              this.selectedLanguage = ''

              this.$refs.language.blur()
            }
          })

          this.$refs.language.blur()
        })
      }
    },
    toggleVariants() {
      const active = this.variants.every(({ active }) => active)

      this.variants.forEach((item) => this.toggleVariant(item, active))
    },
    toggleVariant(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.languages = this.selected.languages.filter(
          (language) => language.value !== item.value
        )
      } else {
        item.active = true

        this.selected.languages.push(item)
      }
    },
    toggleTlds() {
      const active = this.tlds.every(({ active }) => active)

      this.tlds.forEach((item) => this.toggleTld(item, active))
    },
    toggleTld(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.tlds = this.selected.tlds.filter(
          (tld) => tld.value !== item.value
        )
      } else {
        item.active = true

        this.selected.tlds.push(item)
      }

      this.selected.tlds = this.selected.tlds.filter(
        ({ value }, index) =>
          this.selected.tlds.findIndex((tld) => tld.value === value) === index
      )
    },
    toggleGeoIp(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.geoIps = this.selected.geoIps.filter(
          ({ value }) => value !== item.value
        )
      } else {
        item.active = true

        this.selected.geoIps.push(item)
      }

      this.selected.geoIps = this.selected.geoIps.filter(
        ({ value }, index) =>
          this.selected.geoIps.findIndex(
            ({ value: _value }) => _value === value
          ) === index
      )
    },
    toggleIndustry(item, active) {
      if (active !== undefined ? active : item.active) {
        item.active = false

        this.selected.industries = this.selected.industries.filter(
          ({ value }) => value !== item.value
        )
      } else {
        item.active = true

        this.selected.industries.push(item)
      }

      this.selected.industries = this.selected.industries.filter(
        ({ value }, index) =>
          this.selected.industries.findIndex(
            ({ value: _value }) => _value === value
          ) === index
      )

      this.$nextTick(() => {
        this.$watch('$refs.subIndustry.isMenuActive', (active) => {
          if (!active) {
            this.selectedIndustry = ''

            this.$refs.industry.blur()
          }
        })

        this.$refs.industry.blur()
      })
    },
    toggleGeoIps(ipCountries) {
      ipCountries.forEach((ipCountry) => {
        const item = this.geoIps.find(
          ({ value }) => value === ipCountry.trim().toUpperCase()
        )

        this.toggleGeoIp(item)
      })
    },
    addTld() {
      const value = this.tld.toLowerCase()

      if (!/^.[a-z0-9.]*[a-z0-9]+$/.test(value)) {
        this.tldErrors = ['E.g. .com.au']

        return
      }

      const tld = {
        text: value,
        active: true,
        parent: '',
        value,
      }

      Object.keys(tlds).forEach((country) => {
        if (tlds[country].includes(tld.value)) {
          tld.parent = country
        }
      })

      this.selected.tlds.push(tld)

      this.selected.tlds = this.selected.tlds.filter(
        ({ value }, index) =>
          this.selected.tlds.findIndex((tld) => tld.value === value) === index
      )

      this.tld = ''
      this.tldErrors = []
    },
    async fileChange(file) {
      this.file = ''
      this.fileErrors = []

      if (!file) {
        return
      }

      this.file = (await file.text())
        .trim()
        .split('\n')
        .map((line, i) => {
          const a = document.createElement('a')

          a.href = (line.startsWith('http') ? line : `http://${line}`).trim()

          const { hostname } = a

          if (!hostname) {
            this.fileErrors.push(`Invalid URL on line ${i + 1}: ${line}`)
          }

          return a.href
        })

      this.fileErrors = this.fileErrors.slice(0, 10)

      if (this.file.length > 100000) {
        this.fileErrors.push('Limit of 100,000 URLs exceeded')
      }

      this.file = this.file.join('\n')
    },
    updateQuery() {
      clearTimeout(this.updateQueryTimeout)

      this.updateQueryTimeout = setTimeout(() => {
        const attributes = Object.keys(this.requiredSets).filter(
          (set) => this.requiredSets[set]
        )

        const query = {
          attributes: attributes.length ? attributes.join(',') : undefined,
          technologies: this.selected.technologies
            .map(
              ({ slug, operator, version }) =>
                `${slug}${version ? `${operator}${version}` : ''}`
            )
            .join(','),
          categories: this.selected.categories
            .map(({ slug }) => slug)
            .join(','),
          tlds: this.selected.tlds.map(({ value }) => value).join(','),
          countries: this.selected.geoIps
            .map(({ value }) => value)
            .join(',')
            .toLowerCase(),
          languages: this.selected.languages
            .map(({ value }) => value)
            .join(','),
          industries: this.selected.industries
            .map(({ value }) => value)
            .join(','),
          subset:
            this.subset && this.subset !== 500000
              ? this.subset.toString()
              : undefined,
          traffic: this.subsetSlice ? this.subsetSlice.toString() : undefined,
          notraffic: this.excludeNoTraffic ? 'exclude' : undefined,
          min: this.minAge !== 0 ? this.minAge.toString() : undefined,
          max: this.maxAge !== 3 ? this.maxAge.toString() : undefined,
          filters: this.matchAll ? 'and' : undefined,
          selection:
            this.matchAllTechnologies === 'and' ||
            this.matchAllTechnologies === 'not'
              ? this.matchAllTechnologies
              : undefined,
          contacts:
            this.compliance === 'exclude' || this.compliance === 'excludeEU'
              ? this.compliance
              : undefined,
        }

        this.$router.replace({
          path: this.$route.path,
          query: Object.keys(query).reduce((filtered, key) => {
            if (
              typeof query[key] !== 'undefined' &&
              query[key] !== '' &&
              query[key] !== null &&
              query[key].length <= 100
            ) {
              filtered[key] = query[key]
            }

            return filtered
          }, {}),
        })
      }, 100)
    },
  },
}
</script>

<style>
.nowrap {
  white-space: nowrap;
}
</style>
