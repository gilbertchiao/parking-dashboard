<template>
  <header class="dashboard-card flex items-center justify-between px-6 py-3">
    <!-- 標題 -->
    <div class="flex items-center gap-4">
      <div class="w-10 h-10 bg-dashboard-accent rounded-lg flex items-center justify-center">
        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <div>
        <h1 class="text-xl font-bold text-white">{{ config.name }}</h1>
        <p class="text-sm text-dashboard-muted">智慧中控台</p>
      </div>
    </div>

    <!-- 中間資訊 -->
    <div class="flex items-center gap-6">
      <!-- 即時時間 -->
      <div class="text-center">
        <div class="text-2xl font-number font-bold text-white">{{ currentTime }}</div>
        <div class="text-sm text-dashboard-muted">{{ currentDate }}</div>
      </div>

      <!-- 天氣狀況 -->
      <div v-if="weather" class="flex items-center gap-3 px-4 py-2 bg-dashboard-bg rounded-lg">
        <div class="text-3xl">{{ weatherIcon }}</div>
        <div>
          <div class="text-lg font-bold text-white">{{ weather.temperature }}°C</div>
          <div class="text-xs text-dashboard-muted">
            降雨 {{ weather.rainChance }}%
          </div>
        </div>
      </div>

      <!-- 道路狀況（3 個出入口） -->
      <div class="flex items-center gap-2 px-4 py-2 bg-dashboard-bg rounded-lg">
        <div class="text-xs text-dashboard-muted mr-2">周邊道路</div>
        <div
          v-for="gate in traffic"
          :key="gate.id"
          class="flex flex-col items-center px-3 py-1 rounded bg-dashboard-card"
        >
          <div class="text-xs text-dashboard-muted">{{ gate.id }}</div>
          <div class="flex items-center gap-1">
            <div :class="['w-2 h-2 rounded-full', getTrafficDotClass(gate.level)]"></div>
            <span :class="['text-sm font-bold', getTrafficTextClass(gate.level)]">
              {{ gate.description }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 右側狀態 -->
    <div class="flex items-center gap-4">
      <div class="text-right">
        <div class="text-xs text-dashboard-muted">最後更新</div>
        <div class="text-sm text-white">{{ lastUpdateTime }}</div>
      </div>
      <div class="w-3 h-3 rounded-full bg-dashboard-success animate-pulse"></div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'
import dayjs from 'dayjs'

const store = useDashboardStore()
const config = computed(() => store.config)
const weather = computed(() => store.weather)
const traffic = computed(() => store.traffic)

// 即時時間
const currentTime = ref('')
const currentDate = ref('')
let timeInterval = null

function updateTime() {
  const now = dayjs()
  currentTime.value = now.format('HH:mm:ss')
  currentDate.value = now.format('YYYY/MM/DD ddd')
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

// 最後更新時間
const lastUpdateTime = computed(() => {
  if (!store.lastUpdate) return '--:--:--'
  return dayjs(store.lastUpdate).format('HH:mm:ss')
})

// 天氣圖示
const weatherIcon = computed(() => {
  if (!weather.value) return ''
  const icons = {
    sunny: '☀️',
    cloudy: '⛅',
    rainy: '🌧️',
    overcast: '☁️',
  }
  return icons[weather.value.condition] || '☀️'
})

// 道路狀況樣式
function getTrafficDotClass(level) {
  const classes = {
    smooth: 'bg-dashboard-success',
    normal: 'bg-dashboard-warning',
    congested: 'bg-dashboard-danger animate-pulse',
  }
  return classes[level] || 'bg-dashboard-success'
}

function getTrafficTextClass(level) {
  const classes = {
    smooth: 'text-dashboard-success',
    normal: 'text-dashboard-warning',
    congested: 'text-dashboard-danger',
  }
  return classes[level] || 'text-dashboard-success'
}
</script>
