<template>
  <div class="dashboard-card h-full flex flex-col">
    <h2 class="text-lg font-bold text-white mb-2">今日入場身份</h2>

    <div class="flex-1 flex items-center">
      <!-- 圓餅圖 -->
      <div class="flex-1 h-full" ref="chartRef"></div>

      <!-- 圖例 -->
      <div class="w-28 space-y-2">
        <div
          v-for="item in vehicleIdentity?.categories"
          :key="item.name"
          class="flex items-center gap-2"
        >
          <div
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: item.color }"
          ></div>
          <div class="flex-1">
            <div class="text-xs text-dashboard-muted">{{ item.name }}</div>
            <div class="text-sm font-number font-bold text-white">{{ item.value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 總計 -->
    <div class="mt-2 pt-2 border-t border-dashboard-border text-center">
      <span class="text-sm text-dashboard-muted">總計 </span>
      <span class="text-lg font-number font-bold text-white">
        {{ vehicleIdentity?.total?.toLocaleString() || 0 }}
      </span>
      <span class="text-sm text-dashboard-muted"> 車次</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'
import * as echarts from 'echarts'

const store = useDashboardStore()
const vehicleIdentity = computed(() => store.vehicleIdentity)

const chartRef = ref(null)
let chart = null

function initChart() {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value, 'dark')
  updateChart()
}

function updateChart() {
  if (!chart || !vehicleIdentity.value) return

  const data = vehicleIdentity.value.categories.map(item => ({
    name: item.name,
    value: item.value,
    itemStyle: {
      color: item.color,
    },
  }))

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      textStyle: {
        color: '#e2e8f0',
      },
      formatter: '{b}: {c} ({d}%)',
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#1e293b',
          borderWidth: 2,
        },
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#e2e8f0',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        data,
      },
    ],
  }

  chart.setOption(option)
}

// 監聽資料變化
watch(vehicleIdentity, () => {
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
