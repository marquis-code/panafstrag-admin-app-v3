<template>
  <CustomDatePicker
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :label="label"
    type="time"
    :has-error="hasError"
  />
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  label?: string
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: 'Time',
  hasError: false
})

defineEmits(['update:modelValue'])
</script>
