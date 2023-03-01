<script setup>
//components
import UiSelect from './components/ui/UiSelect.vue'
import UiMultiRangeSlider from './components/ui/UiMultiRangeSlider.vue'

import { shallowRef, reactive, onMounted, watch } from 'vue'
import { fetchData } from './composables/fetchData'

import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

//variables
const estateTypes = shallowRef([])
const priceFillter = shallowRef([])
let roomsOptions = []

const loading = shallowRef(false)

const filters = reactive({
  selectedEstateType: [],
  selectedPrice: [],
  selectedRooms: []
})

//fetch data
function fetching() {
  loading.value = true

  const url = 'http://widget-server.m2lab.ru/getVillage/4985be39-cbea-4393-beef-2115868487ef'

  fetchData(url).then(({ price, rooms, realEstateTypes }) => {
    priceFillter.value = price.split(',')
    roomsOptions = rooms.split(',')
    estateTypes.value = realEstateTypes.replace(/\s/g, '').split(',')

    loading.value = false
  })
}
onMounted(() => {
  fetching()
})

watch(filters, () => {
  router.push({
    path: route.path,
    query: {
      realEstateTypes: filters.selectedEstateType,
      rooms: filters.selectedRooms,
      price: filters.selectedPrice
    }
  })
})

watch(route, () => {
  const realEstateTypes = route.query.realEstateTypes
  const rooms = route.query.rooms

  if (typeof realEstateTypes == 'string') {
    filters.selectedEstateType = realEstateTypes ? [realEstateTypes] : []
  } else {
    filters.selectedEstateType = realEstateTypes ? realEstateTypes : []
  }

  if (typeof rooms == 'string') {
    filters.selectedRooms = rooms ? [rooms] : []
  } else {
    filters.selectedRooms = rooms ? rooms : []
  }

  filters.selectedPrice = route.query.price ? route.query.price : []
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
      :stepValue="100000"
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
