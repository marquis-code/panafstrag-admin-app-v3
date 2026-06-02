<template>
  <div class="relative w-full" ref="containerRef">
    <div 
      class="cursor-pointer"
      @click="showPicker = !showPicker"
    >
      <slot :value="formattedValue" :label="label" :is-focused="showPicker">
        <!-- Default Trigger -->
        <div 
          :class="[
            'w-full py-2.5 px-3.5 bg-white border border-gray-300 transition-all duration-200 rounded-lg relative flex justify-between items-center group-hover:border-gray-400',
            showPicker ? 'ring-2 ring-blue-500/20 border-blue-600' : '',
            hasError ? 'border-red-500 ring-2 ring-red-500/20' : ''
          ]"
        >
          <div :class="['text-sm font-medium', modelValue ? 'text-gray-900' : 'text-gray-400']">
            {{ formattedValue || placeholder || label }}
          </div>
          <div class="text-gray-400">
            <svg v-if="type === 'date'" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <svg v-else width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        </div>
      </slot>
    </div>

    <Teleport to="body">
      <Transition name="picker-fade">
        <div 
          v-if="showPicker"
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/50 p-4"
          @click="showPicker = false"
        >
          <div 
            class="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-sm overflow-hidden transform"
            @click.stop
          >
            <!-- Header -->
            <div class="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-gray-900">{{ type === 'date' ? 'Select Date' : 'Select Time' }}</h3>
                <p class="text-gray-500 text-xs mt-0.5">{{ currentHeader }}</p>
              </div>
              <button 
                type="button" 
                @click="showPicker = false"
                class="p-2 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-lg transition-all"
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <!-- Date Picker -->
            <div v-if="type === 'date'" class="p-4">
              <div class="flex items-center justify-between mb-4">
                <button type="button" @click="prevMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6"/>
                  </svg>
                </button>
                <div class="flex gap-2">
                  <select v-model="currentMonth" class="text-sm border-none bg-transparent font-bold focus:ring-0 cursor-pointer">
                    <option v-for="(m, i) in months" :key="i" :value="i">{{ m }}</option>
                  </select>
                  <select v-model="currentYear" class="text-sm border-none bg-transparent font-bold focus:ring-0 cursor-pointer">
                    <option v-for="y in yearRange" :key="y" :value="y">{{ y }}</option>
                  </select>
                </div>
                <button type="button" @click="nextMonth" class="p-2 hover:bg-gray-100 rounded-lg transition-all text-gray-600">
                  <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-7 gap-1 mb-1">
                <div v-for="d in weekDays" :key="d" class="text-center text-[10px] font-bold text-gray-400 py-1 uppercase tracking-wider">
                  {{ d }}
                </div>
              </div>

              <div class="grid grid-cols-7 gap-1">
                <button 
                  v-for="(day, i) in calendarDays" 
                  :key="i"
                  type="button"
                  :disabled="!day.isCurrentMonth"
                  :class="[
                    'aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-all',
                    day.isCurrentMonth ? 'hover:bg-gray-100 cursor-pointer text-gray-700' : 'text-gray-200 cursor-not-allowed',
                    day.isSelected ? 'bg-blue-600 text-white font-bold' : '',
                    day.isToday && !day.isSelected ? 'text-blue-600 font-bold border border-blue-100' : ''
                  ]"
                  @click="selectDate(day)"
                >
                  {{ day.date }}
                </button>
              </div>
            </div>

            <!-- Time Picker -->
            <div v-else class="p-6">
              <div class="flex items-center justify-center gap-4 mb-6">
                <div class="flex flex-col items-center gap-1">
                  <button type="button" @click="incHour" class="p-1 hover:bg-gray-100 rounded-md text-gray-400"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>
                  <input type="text" v-model="selectedHour" @blur="valHour" class="w-16 text-center text-3xl font-bold border border-gray-100 focus:border-blue-500 focus:ring-0 bg-gray-50 rounded-lg py-2" maxlength="2" />
                  <button type="button" @click="decHour" class="p-1 hover:bg-gray-100 rounded-md text-gray-400"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
                </div>
                <span class="text-3xl font-bold text-gray-300">:</span>
                <div class="flex flex-col items-center gap-1">
                  <button type="button" @click="incMin" class="p-1 hover:bg-gray-100 rounded-md text-gray-400"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M18 15l-6-6-6 6"/></svg></button>
                  <input type="text" v-model="selectedMinute" @blur="valMin" class="w-16 text-center text-3xl font-bold border border-gray-100 focus:border-blue-500 focus:ring-0 bg-gray-50 rounded-lg py-2" maxlength="2" />
                  <button type="button" @click="decMin" class="p-1 hover:bg-gray-100 rounded-md text-gray-400"><svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg></button>
                </div>
              </div>
              <div class="flex gap-2">
                <button 
                  v-for="p in ['AM', 'PM']" 
                  :key="p"
                  type="button"
                  @click="selectedPeriod = p"
                  :class="[
                    'flex-1 py-2 text-sm font-bold rounded-lg transition-all',
                    selectedPeriod === p ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  ]"
                >
                  {{ p }}
                </button>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-4 py-3 bg-gray-50 border-t border-gray-100 flex justify-between gap-3">
              <button 
                type="button" 
                @click="setToNow"
                class="px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                {{ type === 'date' ? 'Go to Today' : 'Use Now' }}
              </button>
              <div class="flex gap-2">
                <button 
                  type="button" 
                  @click="clear"
                  class="px-3 py-2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  {{ t('Clear') }}
                </button>
                <button 
                  v-if="type === 'time'"
                  type="button" 
                  @click="confirmTime"
                  class="px-5 py-2 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                >
                  {{ t('Confirm') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n';
const { t } = useI18n();
import { ref, computed, onMounted } from 'vue'

interface Props {
  modelValue?: string | number | Date
  label: string
  placeholder?: string
  type?: 'date' | 'time'
  hasError?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  type: 'date',
  hasError: false
})

const emit = defineEmits(['update:modelValue'])

const showPicker = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// Date logic
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const syncPickerToValue = () => {
  if (props.modelValue) {
    const d = new Date(props.modelValue)
    if (!isNaN(d.getTime())) {
      currentMonth.value = d.getMonth()
      currentYear.value = d.getFullYear()
    }
  }
}

watch(() => props.modelValue, syncPickerToValue)

onMounted(() => {
  syncPickerToValue()
  if (props.modelValue && props.type === 'time') {
    // Parse initial time if exists
  }
})

const yearRange = computed(() => {
  const current = new Date().getFullYear()
  return Array.from({ length: 121 }, (_, i) => current - 100 + i)
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const prevLastDay = new Date(currentYear.value, currentMonth.value, 0)
  const firstDayOfWeek = firstDay.getDay()
  const days = []
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const selected = props.modelValue ? new Date(props.modelValue) : null
  if(selected) selected.setHours(0,0,0,0)

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({ date: prevLastDay.getDate() - i, isCurrentMonth: false })
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const fullDate = new Date(currentYear.value, currentMonth.value, i)
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: fullDate.getTime() === today.getTime(),
      isSelected: selected ? fullDate.getTime() === selected.getTime() : false
    })
  }
  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ date: i, isCurrentMonth: false })
  }
  return days
})

// Time logic
const selectedHour = ref('12')
const selectedMinute = ref('00')
const selectedPeriod = ref('PM')

const formattedValue = computed(() => {
  if (!props.modelValue) return ''
  const d = new Date(props.modelValue)
  if (props.type === 'date') {
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  return props.modelValue.toString() // Simplified for now
})

const currentHeader = computed(() => {
  if (props.type === 'date') {
    return props.modelValue ? new Date(props.modelValue).toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'No date selected'
  }
  return `${selectedHour.value}:${selectedMinute.value} ${selectedPeriod.value}`
})

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11; currentYear.value--
  } else currentMonth.value--
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0; currentYear.value++
  } else currentMonth.value++
}

const selectDate = (day: any) => {
  if (!day.isCurrentMonth) return
  const date = new Date(currentYear.value, currentMonth.value, day.date)
  emit('update:modelValue', date.toISOString())
  setTimeout(() => showPicker.value = false, 150)
}

const setToNow = () => {
  const now = new Date()
  if (props.type === 'date') {
    emit('update:modelValue', now.toISOString())
    showPicker.value = false
  } else {
    let h = now.getHours()
    selectedPeriod.value = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    selectedHour.value = String(h).padStart(2, '0')
    selectedMinute.value = String(now.getMinutes()).padStart(2, '0')
  }
}

const clear = () => {
  emit('update:modelValue', '')
  showPicker.value = false
}

const confirmTime = () => {
  emit('update:modelValue', `${selectedHour.value}:${selectedMinute.value} ${selectedPeriod.value}`)
  showPicker.value = false
}

const incHour = () => {
  let h = parseInt(selectedHour.value); h = h === 12 ? 1 : h + 1
  selectedHour.value = String(h).padStart(2, '0')
}
const decHour = () => {
  let h = parseInt(selectedHour.value); h = h === 1 ? 12 : h - 1
  selectedHour.value = String(h).padStart(2, '0')
}
const incMin = () => {
  let m = parseInt(selectedMinute.value); m = (m + 1) % 60
  selectedMinute.value = String(m).padStart(2, '0')
}
const decMin = () => {
  let m = parseInt(selectedMinute.value); m = m === 0 ? 59 : m - 1
  selectedMinute.value = String(m).padStart(2, '0')
}
const valHour = () => {
  let h = parseInt(selectedHour.value)
  if (isNaN(h) || h < 1 || h > 12) h = 12
  selectedHour.value = String(h).padStart(2, '0')
}
const valMin = () => {
  let m = parseInt(selectedMinute.value)
  if (isNaN(m) || m < 0 || m > 59) m = 0
  selectedMinute.value = String(m).padStart(2, '0')
}
</script>

<style scoped>
.picker-fade-enter-active, .picker-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.picker-fade-enter-from, .picker-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
