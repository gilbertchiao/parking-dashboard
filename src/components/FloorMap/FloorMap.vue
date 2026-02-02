<template>
  <div class="dashboard-card h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-white">樓層車位分布</h2>
      <div class="flex gap-2">
        <button
          v-for="type in vehicleTypes"
          :key="type.id"
          :class="[
            'px-3 py-1 rounded text-sm transition-colors',
            activeType === type.id
              ? 'bg-dashboard-accent text-white'
              : 'bg-dashboard-bg text-dashboard-muted hover:text-white'
          ]"
          @click="activeType = type.id"
        >
          {{ type.label }}
        </button>
      </div>
    </div>

    <div class="flex-1 flex flex-col gap-3">
      <div
        v-for="(floor, index) in currentFloors"
        :key="floor.floor"
        class="bg-dashboard-bg rounded-lg p-3 transition-all hover:bg-opacity-80"
      >
        <div class="flex items-center gap-4">
          <!-- 樓層標籤 -->
          <div class="w-12 h-12 bg-dashboard-card rounded-lg flex items-center justify-center">
            <span class="text-xl font-bold text-white">{{ floor.floor }}</span>
          </div>

          <!-- 進度條區域 -->
          <div class="flex-1">
            <div class="flex justify-between mb-1">
              <span class="text-sm text-dashboard-muted">
                剩餘 <span class="text-white font-medium">{{ floor.available }}</span> 格
              </span>
              <span :class="['text-sm font-medium', getRateTextColor(floor.rate)]">
                {{ floor.rate }}%
              </span>
            </div>
            <div class="h-6 bg-dashboard-border rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-500', getRateBarColor(floor.rate)]"
                :style="{ width: `${floor.rate}%` }"
              >
                <div class="h-full w-full bg-gradient-to-r from-transparent to-white/20"></div>
              </div>
            </div>
          </div>

          <!-- 數字顯示 -->
          <div class="text-right min-w-[80px]">
            <div class="text-2xl font-number font-bold text-white">{{ floor.occupied }}</div>
            <div class="text-xs text-dashboard-muted">/ {{ floor.total }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖例 -->
    <div class="mt-4 pt-3 border-t border-dashboard-border flex justify-center gap-6 text-sm">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-dashboard-success"></div>
        <span class="text-dashboard-muted">&lt; 75% 寬裕</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-dashboard-warning"></div>
        <span class="text-dashboard-muted">75-90% 擁擠</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-dashboard-danger"></div>
        <span class="text-dashboard-muted">&gt; 90% 即將滿位</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const floors = computed(() => store.floors)

const vehicleTypes = [
  { id: 'car', label: '汽車' },
  { id: 'motorcycle', label: '機車' },
]

const activeType = ref('car')

const currentFloors = computed(() => {
  if (!floors.value) return []
  return floors.value[activeType.value] || []
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
</script>
