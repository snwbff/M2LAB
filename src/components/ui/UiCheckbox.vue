<script setup>
const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  hideMark: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

function updateCheckBox() {
  const newModelValue = [...props.modelValue]

  if (!newModelValue.includes(props.value)) {
    newModelValue.push(props.value)
  } else {
    newModelValue.splice(newModelValue.indexOf(props.value), 1)
  }

  emit('update:modelValue', newModelValue)
}
</script>

<template>
  <label class="checkbox">
    <span
      v-if="!hideMark"
      class="checkbox__checkmark"
      :class="{ checkbox__checkmark_selected: modelValue.includes(value) }"
    >
    </span>

    <span
      class="checkbox__title"
      :class="{ checkbox__title_single: !hideMark }"
    >
      <slot></slot>
    </span>

    <input
      class="checkbox__input_hidden"
      type="checkbox"
      :checked="modelValue.includes(value)"
      :value="value"
      @change="updateCheckBox"
    />
  </label>
</template>

<style scoped>
.checkbox {
  position: relative;
  display: block;
  font-size: 15px;
  cursor: pointer;
}
.checkbox__title_single {
  padding-left: 32px;
}

.checkbox__checkmark {
  position: absolute;
  height: 1.2em;
  width: 1.2em;
  border: 1px solid var(--border-color);
  border-radius: 2px;
  background-color: var(--white-primary);
}
.checkbox__checkmark_selected {
  background-color: var(--green-primary);
}
.checkbox__checkmark_selected::before {
  content: '';
  position: absolute;
  top: 47%;
  left: 48%;
  width: 40%;
  height: 60%;
  box-sizing: border-box;
  border: solid var(--white-primary);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translate(-100%, -25%);
}

.checkbox__input_hidden {
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}
</style>
