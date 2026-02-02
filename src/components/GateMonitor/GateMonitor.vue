<template>
  <div class="dashboard-card h-full flex flex-col">
    <h2 class="text-lg font-bold text-white mb-4">出入口監控</h2>

    <div class="flex-1 flex flex-col gap-4">
      <!-- 汽車出入口 -->
      <div class="flex-1">
        <div class="text-sm text-dashboard-muted mb-2">汽車出入口（6 處）</div>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="gate in carGates"
            :key="gate.id"
            class="bg-dashboard-bg rounded-lg p-3 text-center"
          >
            <div class="text-sm font-medium text-white mb-1">{{ gate.id }}</div>
            <div :class="['status-dot mx-auto mb-1', getStatusClass(gate.status)]"></div>
            <div class="text-lg font-number font-bold text-white">{{ gate.flow }}</div>
            <div class="text-xs text-dashboard-muted">車次/10分</div>
          </div>
        </div>
      </div>

      <!-- 機車出入口 -->
      <div class="flex-1">
        <div class="text-sm text-dashboard-muted mb-2">機車出入口（5 處）</div>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="gate in motorcycleGates"
            :key="gate.id"
            class="bg-dashboard-bg rounded-lg p-3 text-center"
          >
            <div class="text-sm font-medium text-white mb-1">{{ gate.id }}</div>
            <div :class="['status-dot mx-auto mb-1', getStatusClass(gate.status)]"></div>
            <div class="text-lg font-number font-bold text-white">{{ gate.flow }}</div>
            <div class="text-xs text-dashboard-muted">車次/10分</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖例 -->
    <div class="mt-3 pt-3 border-t border-dashboard-border flex justify-center gap-4 text-xs">
      <div class="flex items-center gap-1">
        <div class="status-dot normal"></div>
        <span class="text-dashboard-muted">正常</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="status-dot warning"></div>
        <span class="text-dashboard-muted">擁擠</span>
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
const gates = computed(() => store.gates)

const carGates = computed(() => gates.value?.car || [])
const motorcycleGates = computed(() => gates.value?.motorcycle || [])

function getStatusClass(status) {
  const classes = {
    normal: 'normal',
    busy: 'warning',
    fault: 'danger',
  }
  return classes[status] || 'normal'
}
</script>
