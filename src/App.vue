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

        <!-- 右側欄 -->
        <div class="col-span-3 flex flex-col gap-4">
          <!-- [E] 特殊車格 -->
          <div class="flex-1">
            <SpecialSlots />
          </div>
          <!-- [G] 設施狀態 -->
          <div class="flex-1">
            <Facilities />
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
import Facilities from './components/Facilities/Facilities.vue'
import AlertBar from './components/AlertBar/AlertBar.vue'

const store = useDashboardStore()
const isLoading = computed(() => store.isLoading)

onMounted(() => {
  // 初始化 Dashboard 資料
  store.init()
})
</script>
