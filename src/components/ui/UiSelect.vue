<script setup>
import { shallowRef, onBeforeUnmount, computed, watch } from 'vue'

import UiCheckbox from './UiCheckbox.vue'
import IconArrow from '../icons/IconArrow.vue'
import IconCross from '../icons/IconCross.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  shortLabel: {
    type: String
  },
  multiple: {
    type: Boolean,
    default: false
  }
})

const isOpen = shallowRef(false)

const customSelectTarget = shallowRef(null)

function outSideClickHandler(event) {
  if (event.target != customSelectTarget.value) {
    isOpen.value = false
  }
}
document.addEventListener('click', outSideClickHandler)

onBeforeUnmount(() => {
  document.removeEventListener('click', outSideClickHandler)
})

const selectTitle = computed(() => {
  const formatedLabel = props.shortLabel || props.label.substring(0, 4)

  if (props.multiple) {
    return props.modelValue.join(',') + ' ' + formatedLabel
  } else {
    return props.modelValue[0]
  }
})

const selectOptions = shallowRef(props.modelValue)

const emit = defineEmits(['update:modelValue'])

watch(selectOptions, () => {
  if (props.multiple) {
    isOpen.value = true
    emit('update:modelValue', selectOptions.value)
  } else {
    emit('update:modelValue', selectOptions.value.slice(-1))
  }
})
</script>

<template>
  <div
    class="custom-select"
    ref="customSelectTarget"
  >
    <div
      class="custom-select__select"
      @click.stop="isOpen = !isOpen"
    >
      {{ props.modelValue.length ? selectTitle : props.label }}
    </div>
    <IconArrow :class="[isOpen ? 'custom-select__arrow_active' : '', 'custom-select__arrow']" />
    <IconCross
      class="custom-select__cross"
      v-if="modelValue.length"
      @click="$emit('update:modelValue', (selectOptions = []))"
    />

    <div
      class="custom-select__options"
      v-show="isOpen"
    >
      <ui-checkbox
        class="custom-select__option-item"
        :class="{ 'custom-select__option-item_selected': modelValue.includes(option) }"
        v-for="option in options"
        :key="option"
        :value="option"
        :hideMark="!multiple"
        v-model="selectOptions"
      >
        {{ option }}
      </ui-checkbox>
    </div>
  </div>
</template>

<style scoped>
.custom-select {
  width: 296px;
  position: relative;
}

.custom-select__select {
  height: 40px;
  background-color: var(--white-primary);
  border-radius: var(--radius-primary);
  border: 1px solid var(--border-color);
  outline: none;
  padding-left: 12px;
  padding: 10px 0 9px 12px;
}

.custom-select__arrow {
  position: absolute;
  top: 17px;
  right: 12px;
  color: var(--green-primary);
}
.custom-select__arrow_active {
  transform: rotate(180deg);
}
.custom-select__cross {
  position: absolute;
  top: 16px;
  right: 30px;
  color: var(--white-secondary);
  cursor: pointer;
}
.custom-select__options {
  margin-top: 6px;
  box-shadow: 0px 2px 10px rgba(40, 40, 40, 0.18);
  border-radius: var(--radius-primary);
}
.custom-select__option-item {
  padding: 10px 0 10px 20px;
}
.custom-select__option-item:last-child {
  border-radius: 0 0 var(--radius-primary) var(--radius-primary);
}
.custom-select__option-item:first-child {
  border-radius: var(--radius-primary) var(--radius-primary) 0 0;
}
.custom-select__option-item_selected {
  background: #f5f5f5;
}
</style>
