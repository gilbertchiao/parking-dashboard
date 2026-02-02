<template>
  <div class="dashboard-card h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-white">今日進出統計</h2>
      <div class="flex items-center gap-4 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-dashboard-accent"></div>
          <span class="text-dashboard-muted">進場</span>
          <span class="text-white font-bold font-number">{{ todayTotal.entry.toLocaleString() }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-dashboard-success"></div>
          <span class="text-dashboard-muted">出場</span>
          <span class="text-white font-bold font-number">{{ todayTotal.exit.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <div class="flex-1" ref="chartRef"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'
import * as echarts from 'echarts'

const store = useDashboardStore()
const hourlyStats = computed(() => store.hourlyStats)
const todayTotal = computed(() => store.todayTotal)

const chartRef = ref(null)
let chart = null

function initChart() {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value, 'dark')

  updateChart()
}

function updateChart() {
  if (!chart || !hourlyStats.value.length) return

  const hours = hourlyStats.value.map(h => h.label)
  const entryData = hourlyStats.value.map(h => h.entry)
  const exitData = hourlyStats.value.map(h => h.exit)

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: {
        color: '#e2e8f0',
      },
    },
    legend: {
      show: false,
    },
    grid: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 40,
    },
    xAxis: {
      type: 'category',
      data: hours,
      axisLine: {
        lineStyle: {
          color: '#334155',
        },
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: '#334155',
          type: 'dashed',
        },
      },
      axisLabel: {
        color: '#94a3b8',
        fontSize: 10,
      },
    },
    series: [
      {
        name: '進場',
        type: 'line',
        data: entryData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#3b82f6',
        },
        itemStyle: {
          color: '#3b82f6',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0)' },
          ]),
        },
      },
      {
        name: '出場',
        type: 'line',
        data: exitData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3,
          color: '#22c55e',
        },
        itemStyle: {
          color: '#22c55e',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0)' },
          ]),
        },
      },
    ],
  }

  chart.setOption(option)
}

// 監聽資料變化
watch(hourlyStats, () => {
  updateChart()
})

// 監聽視窗大小變化
function handleResize() {
  chart?.resize()
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chart?.dispose()
})
</script>
