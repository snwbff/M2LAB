<script setup>
//components
import UiSelect from './components/ui/UiSelect.vue'
import UiMultiRangeSlider from './components/ui/UiMultiRangeSlider.vue'

import { shallowRef, reactive, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

//variables
const estateTypes = shallowRef(['Твин-Хаус', 'Таун-Хаус', 'Дюплекс'])
const priceFillter = shallowRef([10000,20000])
let roomsOptions = [1,2,3,4]

const loading = shallowRef(false)

const filters = reactive({
  selectedEstateType: [],
  selectedPrice: [],
  selectedRooms: []
})

</script>

<template>
  <div
    class="container"
    v-if="!loading"
  >
    <UiSelect
      v-model="filters.selectedEstateType"
      :options="estateTypes"
      :label="'Тип недвижимости'"
    />
    <UiSelect
      class="red"
      v-model="filters.selectedRooms"
      :options="roomsOptions"
      :label="'Комнатность'"
      :shortLabel="'комн'"
      multiple
    />
    {{ filters.selectedRooms }}
    <UiMultiRangeSlider
      v-model="filters.selectedPrice"
      :minValue="Number(priceFillter[0])"
      :maxValue="Number(priceFillter[1])"
      :stepValue="100"
      :rangeSymbol="'₽'"
    />
    {{ filters.selectedPrice }}
    <a
      target="_blanck"
      :href="$route.fullPath"
    >
      Поделиться
    </a>
  </div>
</template>

<style>
@import url('./assets/normalize.css');
@import url('./assets/roots.css');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
}
.container {
  margin-left: 5vw;
  margin-top: 5vw;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
