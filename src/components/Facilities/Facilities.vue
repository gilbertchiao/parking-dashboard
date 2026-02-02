<template>
  <div class="dashboard-card h-full flex flex-col">
    <h2 class="text-lg font-bold text-white mb-4">設施狀態</h2>

    <div class="flex-1 flex flex-col gap-4">
      <!-- 電梯狀態 -->
      <div class="flex-1">
        <div class="text-sm text-dashboard-muted mb-2">電梯（10 座）</div>
        <div class="grid grid-cols-5 gap-2">
          <div
            v-for="elevator in elevators"
            :key="elevator.id"
            :class="[
              'bg-dashboard-bg rounded-lg p-2 text-center transition-all',
              elevator.status === 'fault' ? 'ring-2 ring-dashboard-danger' : ''
            ]"
          >
            <div class="text-xs font-medium text-white mb-1">{{ elevator.id }}</div>
            <div :class="['status-dot mx-auto mb-1', getStatusClass(elevator.status)]"></div>
            <div class="text-sm font-number font-bold text-white">
              {{ elevator.currentFloor }}
            </div>
          </div>
        </div>
      </div>

      <!-- 樓梯狀態 -->
      <div>
        <div class="text-sm text-dashboard-muted mb-2">樓梯通道（6 處）</div>
        <div class="flex gap-2 flex-wrap">
          <div
            v-for="stair in stairs"
            :key="stair.id"
            class="flex items-center gap-2 bg-dashboard-bg rounded-lg px-3 py-2"
          >
            <span class="text-sm text-white">{{ stair.id }}</span>
            <div :class="['status-dot', stair.status === 'normal' ? 'normal' : 'danger']"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖例 -->
    <div class="mt-3 pt-3 border-t border-dashboard-border flex justify-center gap-4 text-xs">
      <div class="flex items-center gap-1">
        <div class="status-dot normal"></div>
        <span class="text-dashboard-muted">運行中</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="status-dot warning"></div>
        <span class="text-dashboard-muted">維護中</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="status-dot danger"></div>
        <span class="text-dashboard-muted">故障</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const facilities = computed(() => store.facilities)

const elevators = computed(() => facilities.value?.elevators || [])
const stairs = computed(() => facilities.value?.stairs || [])

function getStatusClass(status) {
  const classes = {
    running: 'normal',
    maintenance: 'warning',
    fault: 'danger',
  }
  return classes[status] || 'normal'
}
</script>
