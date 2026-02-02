<template>
  <div class="h-screen w-screen bg-dashboard-bg p-4 flex flex-col gap-4">
    <!-- 載入中 -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 border-4 border-dashboard-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div class="text-dashboard-muted">載入中...</div>
      </div>
    </div>

    <!-- 主要內容 -->
    <template v-else>
      <!-- [A] 頂部資訊列 -->
      <DashboardHeader />

      <!-- 中間主要區塊 -->
      <div class="flex-1 grid grid-cols-12 gap-4 min-h-0">
        <!-- 左側欄 -->
        <div class="col-span-2 flex flex-col gap-4">
          <!-- [B] 車位總覽 -->
          <div class="flex-1">
            <ParkingOverview />
          </div>
          <!-- [E] 特殊車格 -->
          <div class="flex-1">
            <SpecialSlots />
          </div>
        </div>

        <!-- 中間區域 -->
        <div class="col-span-7 flex flex-col gap-4">
          <!-- 上半部 -->
          <div class="flex-1 grid grid-cols-2 gap-4">
            <!-- [C] 樓層車位分布圖 -->
            <FloorMap />
            <!-- [D] 出入口監控 -->
            <GateMonitor />
          </div>

          <!-- 下半部：[F] 今日進出統計 -->
          <div class="flex-1">
            <Statistics />
          </div>
        </div>

        <!-- 右側欄（保留空間給未來擴充） -->
        <div class="col-span-3 flex flex-col gap-4">
          <!-- 統計摘要卡片 -->
          <div class="dashboard-card">
            <h2 class="text-lg font-bold text-white mb-4">今日摘要</h2>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-dashboard-bg rounded-lg p-4 text-center">
                <div class="text-3xl font-number font-bold text-dashboard-accent">
                  {{ todayTotal.entry.toLocaleString() }}
                </div>
                <div class="text-sm text-dashboard-muted mt-1">進場車次</div>
              </div>
              <div class="bg-dashboard-bg rounded-lg p-4 text-center">
                <div class="text-3xl font-number font-bold text-dashboard-success">
                  {{ todayTotal.exit.toLocaleString() }}
                </div>
                <div class="text-sm text-dashboard-muted mt-1">出場車次</div>
              </div>
            </div>
            <div class="mt-4 bg-dashboard-bg rounded-lg p-4 text-center">
              <div class="text-4xl font-number font-bold text-white">
                {{ currentVehicles.toLocaleString() }}
              </div>
              <div class="text-sm text-dashboard-muted mt-1">場內車輛數</div>
            </div>
          </div>

          <!-- 車位使用率排行 -->
          <div class="flex-1 dashboard-card">
            <h2 class="text-lg font-bold text-white mb-4">車位使用率</h2>
            <div class="space-y-4">
              <div v-for="item in usageRanking" :key="item.type" class="flex items-center gap-3">
                <span class="text-2xl">{{ item.icon }}</span>
                <div class="flex-1">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm text-white">{{ item.name }}</span>
                    <span :class="['text-sm font-medium', getRateTextColor(item.rate)]">
                      {{ item.rate }}%
                    </span>
                  </div>
                  <div class="h-2 bg-dashboard-border rounded-full overflow-hidden">
                    <div
                      :class="['h-full rounded-full transition-all duration-500', getRateBarColor(item.rate)]"
                      :style="{ width: `${item.rate}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- [H] 底部告警通知列 -->
      <AlertBar />
    </template>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useDashboardStore } from './stores/dashboard'

// 引入元件
import DashboardHeader from './components/Header/DashboardHeader.vue'
import ParkingOverview from './components/ParkingOverview/ParkingOverview.vue'
import FloorMap from './components/FloorMap/FloorMap.vue'
import GateMonitor from './components/GateMonitor/GateMonitor.vue'
import SpecialSlots from './components/SpecialSlots/SpecialSlots.vue'
import Statistics from './components/Statistics/Statistics.vue'
import AlertBar from './components/AlertBar/AlertBar.vue'

const store = useDashboardStore()
const isLoading = computed(() => store.isLoading)
const overview = computed(() => store.overview)
const todayTotal = computed(() => store.todayTotal)

// 計算場內車輛數
const currentVehicles = computed(() => {
  if (!overview.value) return 0
  return (overview.value.car?.occupied || 0) +
         (overview.value.motorcycle?.occupied || 0) +
         (overview.value.bus?.occupied || 0)
})

// 使用率排行
const usageRanking = computed(() => {
  if (!overview.value) return []

  return [
    { type: 'car', name: '汽車', icon: '🚗', rate: overview.value.car?.rate || 0 },
    { type: 'motorcycle', name: '機車', icon: '🏍️', rate: overview.value.motorcycle?.rate || 0 },
    { type: 'bus', name: '巴士', icon: '🚌', rate: overview.value.bus?.rate || 0 },
  ].sort((a, b) => b.rate - a.rate)
})

function getRateTextColor(rate) {
  if (rate >= 90) return 'text-dashboard-danger'
  if (rate >= 75) return 'text-dashboard-warning'
  return 'text-dashboard-success'
}

function getRateBarColor(rate) {
  if (rate >= 90) return 'bg-dashboard-danger'
  if (rate >= 75) return 'bg-dashboard-warning'
  return 'bg-dashboard-success'
}

onMounted(() => {
  // 初始化 Dashboard 資料
  store.init()
})
</script>
