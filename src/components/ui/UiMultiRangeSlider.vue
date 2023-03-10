<script setup>
import { shallowRef, computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    ruquired: true
  },
  minValue: {
    type: Number,
    ruquired: true
  },
  maxValue: {
    type: Number,
    ruquired: true
  },
  stepValue: {
    type: Number,
    ruquired: true
  },
  rangeSymbol: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const rangePercent = computed(() => {
  return (props.maxValue - props.minValue) / 100
})

const inputsCharLength = computed(() => {
  const stringLength = formatValue(String(props.maxValue)).length
  return stringLength
})

const rangeMin = shallowRef(props.modelValue[0] || props.minValue)
const rangeMax = shallowRef(props.modelValue[1] || props.maxValue)

const rangeMinVisible = shallowRef(false)
const rangeMaxVisible = shallowRef(false)

function updateFirstRange(value) {
  const normalizedValue = Number(rangeMax.value) - rangePercent.value * 6

  const condition = Number(value) >= Number(rangeMax.value) - props.stepValue * 6

  rangeMin.value = inputMin.value = condition ? normalizedValue : value

  rangeMinVisible.value = condition ? true : false
  setTimeout(rangeMinVisible.value = false, 100)
}

function updateSecondRange(value) {
  const normalizedValue = Number(rangeMin.value) + rangePercent.value * 6

  const condition = Number(value) <= Number(rangeMin.value) + props.stepValue * 6

  rangeMax.value = inputMax.value = condition ? normalizedValue : value

  rangeMaxVisible.value = condition ? true : false
  setTimeout(rangeMaxVisible.value = false, 100)
}

function cleaningWhitespace(value) {
  return String(value).replace(/\s/g, '')
}
function formatValue(value) {
  const regExp = new RegExp(/(\d)(?=(\d{3})+([^\d]|$))/g)
  return cleaningWhitespace(value).replace(regExp, '$1 ')
}

const inputMin = shallowRef(props.modelValue[0] || props.minValue)
const inputMax = shallowRef(props.modelValue[1] || props.maxValue)

function validateValue(value) {
  return props.maxValue >= value && props.minValue <= value
}
let delayTime
const debounceListener = (func,args) => {
  if (!!delayTime) {
    clearTimeout(delayTime)
  }
  delayTime = window.setTimeout(() => {
    func(args)
  }, 500)
}

function updateInputs(event) {
  const clearValue = cleaningWhitespace(event.target.value)

  const condition = validateValue(clearValue)

  if (event.target.classList.contains('range-slider__input_1')) {
    const formatedMinInput = condition ? clearValue : props.minValue

    if(clearValue < rangeMax.value) {
      console.log(rangeMax.value);
      inputMin.value = rangeMin.value = formatedMinInput
    } else {
      inputMin.value = rangeMin.value
    }

  } else {
    const formatedMaxInput = condition ? clearValue : props.maxValue

    if(clearValue > rangeMin.value) {
      inputMax.value = rangeMax.value = formatedMaxInput
    } else {
      inputMax.value = rangeMax.value
    }
  }
  emit('update:modelValue', [inputMin.value, inputMax.value])
}
</script>

<template>
  <div class="range-slider">
    <p
      class="range-slider__symbol"
      v-if="rangeSymbol"
    >
      {{ rangeSymbol }}
    </p>

    <div class="range-slider__input-area">
      <input
        class="range-slider__range range-slider__range_1"
        type="range"
        :min="minValue"
        :max="maxValue"
        :step="stepValue"
        :value="rangeMin"
        @input="updateFirstRange($event.target.value)"
        @change="$emit('update:modelValue', [rangeMin, rangeMax])"
        :style="{ display: rangeMinVisible ? 'none' : 'block'  }"
      />
      <input
        class="range-slider__range range-slider__range_2"
        type="range"
        :min="minValue"
        :max="maxValue"
        :step="stepValue"
        :value="rangeMax"
        @input="updateSecondRange($event.target.value)"
        @change="$emit('update:modelValue', [rangeMin, rangeMax])"
        :style="{ display: rangeMaxVisible ? 'none' : 'block'  }"
      />
      <div
        class="range-slider__current-range"
        :style="{
          paddingLeft: (rangeMin - props.minValue) / rangePercent + '%',
          paddingRight: (props.maxValue - rangeMax) / rangePercent + '%'
        }"
      >
        <div class="range-slider__range-line"></div>
      </div>

      <div class="range-slider__min">
        <span class="range-slider__text">????</span>
        <input
          class="range-slider__input range-slider__input_1"
          placeholder="Min"
          :maxlength="inputsCharLength"
          :value="formatValue(inputMin)"
          @input="debounceListener(updateInputs,$event),(inputMin = $event.target.value)"
        />
      </div>

      <div class="range-slider_border"></div>

      <div class="range-slider__max">
        <span class="range-slider__text">????</span>
        <input
          class="range-slider__input range-slider__input_2"
          placeholder="Max"
          :maxlength="inputsCharLength"
          :value="formatValue(inputMax)"
          @input="debounceListener(updateInputs,$event),(inputMax = $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.range-slider {
  width: 298px;
  height: 40px;
  background-color: var(--white-primary);
  border-radius: var(--radius-primary);
  border: 1px solid var(--border-color);
  padding: 0 11px;
  display: flex;
}
.range-slider__symbol {
  padding: 11px 10px 9px 0;
  border-right: 1px solid var(--border-color);
}
.range-slider__input-area {
  position: relative;
  width: 100%;
  display: flex;
}
.range-slider__min,
.range-slider__max {
  display: flex;
}
.range-slider_border {
  margin: 8px 0;
  border-right: 1px solid var(--border-color);
}
.range-slider__text {
  margin: 10px 7px;
  color: var(--white-secondary);
}

.range-slider__current-range {
  width: 100%;
  position: absolute;
  bottom: -1px;
}
.range-slider__range-line {
  height: 1px;
  background-color: var(--green-primary);
}
input[type='range'] {
  -webkit-appearance: none;
  background-color: var(--border-color);
  height: 1px;
  width: 100%;
  position: absolute;
  bottom: -1px;
  outline: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background: var(--green-primary);
  position: relative;
  bottom: 0;
  z-index: 2;
  cursor: pointer;
}
input[type='range']::-webkit-slider-thumb:active {
  height: 15px;
  width: 15px;
}
input[type='range']::-webkit-slider-thumb:focus {
  height: 15px;
  width: 15px;
}

input[type='range']::-ms-thumb {
  -webkit-appearance: none;
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background: var(--green-primary);
  position: relative;
  bottom: 0;
  z-index: 2;
  cursor: pointer;
}

input[type='range']::-ms-thumb:active {
  height: 15px;
  width: 15px;
}
input[type='range']::-ms-thumb:focus {
  height: 15px;
  width: 15px;
}

input[type='range']::-moz-range-thumb {
  -webkit-appearance: none;
  height: 13px;
  width: 13px;
  border-radius: 50%;
  background: var(--green-primary);
  position: relative;
  bottom: 0;
  z-index: 2;
  cursor: pointer;
}

input[type='range']::-moz-range-thumb:active {
  height: 15px;
  width: 15px;
}
input[type='range']::-moz-range-thumb:focus {
  height: 15px;
  width: 15px;
}
.range-slider__input {
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
}
</style>
