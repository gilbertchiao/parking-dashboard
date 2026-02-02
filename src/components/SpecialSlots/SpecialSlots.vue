<template>
  <div class="dashboard-card h-full flex flex-col">
    <h2 class="text-lg font-bold text-white mb-4">特殊車格</h2>

    <div class="flex-1 flex flex-col gap-3">
      <!-- 充電車格 -->
      <div class="bg-dashboard-bg rounded-lg p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">⚡</span>
            <span class="text-sm text-dashboard-muted">充電車格</span>
          </div>
          <div class="text-sm">
            <span class="text-white font-bold">{{ specialSlots?.charging?.occupied || 0 }}</span>
            <span class="text-dashboard-muted"> / {{ specialSlots?.charging?.total || 0 }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            :class="['progress-bar-fill', getStatusLevel(chargingRate)]"
            :style="{ width: `${chargingRate}%` }"
          ></div>
        </div>
        <div class="mt-1 text-xs text-dashboard-accent">
          充電中：{{ specialSlots?.charging?.charging || 0 }} 輛
        </div>
      </div>

      <!-- 婦幼車格 -->
      <div class="bg-dashboard-bg rounded-lg p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">👶</span>
            <span class="text-sm text-dashboard-muted">婦幼車格</span>
          </div>
          <div class="text-sm">
            <span class="text-white font-bold">{{ specialSlots?.family?.occupied || 0 }}</span>
            <span class="text-dashboard-muted"> / {{ specialSlots?.family?.total || 0 }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            :class="['progress-bar-fill', getStatusLevel(familyRate)]"
            :style="{ width: `${familyRate}%` }"
          ></div>
        </div>
      </div>

      <!-- 身障車格 -->
      <div class="bg-dashboard-bg rounded-lg p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">♿</span>
            <span class="text-sm text-dashboard-muted">身障車格</span>
          </div>
          <div class="text-sm">
            <span class="text-white font-bold">{{ specialSlots?.disabled?.occupied || 0 }}</span>
            <span class="text-dashboard-muted"> / {{ specialSlots?.disabled?.total || 0 }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            :class="['progress-bar-fill', getStatusLevel(disabledRate)]"
            :style="{ width: `${disabledRate}%` }"
          ></div>
        </div>
      </div>

      <!-- 重型機車 -->
      <div class="bg-dashboard-bg rounded-lg p-3">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xl">🏍️</span>
            <span class="text-sm text-dashboard-muted">重機車格</span>
          </div>
          <div class="text-sm">
            <span class="text-white font-bold">{{ specialSlots?.heavyMotorcycle?.occupied || 0 }}</span>
            <span class="text-dashboard-muted"> / {{ specialSlots?.heavyMotorcycle?.total || 0 }}</span>
          </div>
        </div>
        <div class="progress-bar">
          <div
            :class="['progress-bar-fill', getStatusLevel(heavyMotorcycleRate)]"
            :style="{ width: `${heavyMotorcycleRate}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const specialSlots = computed(() => store.specialSlots)

const chargingRate = computed(() => {
  if (!specialSlots.value?.charging) return 0
  const { occupied, total } = specialSlots.value.charging
  return Math.round((occupied / total) * 100)
})

const familyRate = computed(() => {
  if (!specialSlots.value?.family) return 0
  const { occupied, total } = specialSlots.value.family
  return Math.round((occupied / total) * 100)
})

const disabledRate = computed(() => {
  if (!specialSlots.value?.disabled) return 0
  const { occupied, total } = specialSlots.value.disabled
  return Math.round((occupied / total) * 100)
})

const heavyMotorcycleRate = computed(() => {
  if (!specialSlots.value?.heavyMotorcycle) return 0
  const { occupied, total } = specialSlots.value.heavyMotorcycle
  return Math.round((occupied / total) * 100)
})

function getStatusLevel(rate) {
  if (rate >= 90) return 'danger'
  if (rate >= 75) return 'warning'
  return 'normal'
}
</script>
