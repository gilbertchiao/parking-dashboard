import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { generateMockData, PARKING_CONFIG } from '../services/mockData'

export const useDashboardStore = defineStore('dashboard', () => {
  // 狀態
  const data = ref(null)
  const isLoading = ref(true)
  const lastUpdate = ref(null)
  const config = ref(PARKING_CONFIG)

  // 計算屬性
  const overview = computed(() => data.value?.overview || null)
  const floors = computed(() => data.value?.floors || null)
  const specialSlots = computed(() => data.value?.specialSlots || null)
  const gates = computed(() => data.value?.gates || null)
  const hourlyStats = computed(() => data.value?.hourlyStats || [])
  const alerts = computed(() => data.value?.alerts || [])
  const weather = computed(() => data.value?.weather || null)
  const traffic = computed(() => data.value?.traffic || null)

  // 今日累計
  const todayTotal = computed(() => {
    if (!hourlyStats.value.length) return { entry: 0, exit: 0 }

    return hourlyStats.value.reduce((acc, h) => ({
      entry: acc.entry + (h.entry || 0),
      exit: acc.exit + (h.exit || 0),
    }), { entry: 0, exit: 0 })
  })

  // 取得資料狀態等級
  const getStatusLevel = (rate) => {
    if (rate >= 90) return 'danger'
    if (rate >= 75) return 'warning'
    return 'normal'
  }

  // 動作
  function fetchData() {
    // 模擬 API 請求
    data.value = generateMockData()
    lastUpdate.value = new Date()
    isLoading.value = false
  }

  // 初始化
  function init() {
    fetchData()

    // 設定定時更新（每 5 秒）
    setInterval(() => {
      fetchData()
    }, 5000)
  }

  return {
    // 狀態
    data,
    isLoading,
    lastUpdate,
    config,

    // 計算屬性
    overview,
    floors,
    specialSlots,
    gates,
    hourlyStats,
    alerts,
    weather,
    traffic,
    todayTotal,

    // 方法
    getStatusLevel,
    fetchData,
    init,
  }
})
