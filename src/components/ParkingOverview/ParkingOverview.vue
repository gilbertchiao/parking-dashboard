<template>
  <div class="dashboard-card h-full flex flex-col">
    <h2 class="text-lg font-bold text-white mb-4">車位總覽</h2>

    <div class="flex-1 flex flex-col gap-4">
      <!-- 汽車 -->
      <div class="flex-1 bg-dashboard-bg rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🚗</span>
          <span class="text-dashboard-muted">汽車</span>
        </div>
        <div class="flex items-baseline gap-2 mb-2">
          <span :class="['text-4xl font-number font-bold', getTextColor(overview?.car?.rate)]">
            {{ overview?.car?.available?.toLocaleString() || '--' }}
          </span>
          <span class="text-dashboard-muted">
            / {{ overview?.car?.total?.toLocaleString() || '--' }}
          </span>
        </div>
        <div class="progress-bar mb-1">
          <div
            :class="['progress-bar-fill', getStatusLevel(overview?.car?.rate)]"
            :style="{ width: `${overview?.car?.rate || 0}%` }"
          ></div>
        </div>
        <div class="text-right text-sm text-dashboard-muted">
          使用率 {{ overview?.car?.rate || 0 }}%
        </div>
      </div>

      <!-- 機車 -->
      <div class="flex-1 bg-dashboard-bg rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🏍️</span>
          <span class="text-dashboard-muted">機車</span>
        </div>
        <div class="flex items-baseline gap-2 mb-2">
          <span :class="['text-4xl font-number font-bold', getTextColor(overview?.motorcycle?.rate)]">
            {{ overview?.motorcycle?.available?.toLocaleString() || '--' }}
          </span>
          <span class="text-dashboard-muted">
            / {{ overview?.motorcycle?.total?.toLocaleString() || '--' }}
          </span>
        </div>
        <div class="progress-bar mb-1">
          <div
            :class="['progress-bar-fill', getStatusLevel(overview?.motorcycle?.rate)]"
            :style="{ width: `${overview?.motorcycle?.rate || 0}%` }"
          ></div>
        </div>
        <div class="text-right text-sm text-dashboard-muted">
          使用率 {{ overview?.motorcycle?.rate || 0 }}%
        </div>
      </div>

      <!-- 巴士 -->
      <div class="flex-1 bg-dashboard-bg rounded-lg p-4">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🚌</span>
          <span class="text-dashboard-muted">巴士</span>
        </div>
        <div class="flex items-baseline gap-2 mb-2">
          <span :class="['text-4xl font-number font-bold', getTextColor(overview?.bus?.rate)]">
            {{ overview?.bus?.available || '--' }}
          </span>
          <span class="text-dashboard-muted">
            / {{ overview?.bus?.total || '--' }}
          </span>
        </div>
        <div class="progress-bar mb-1">
          <div
            :class="['progress-bar-fill', getStatusLevel(overview?.bus?.rate)]"
            :style="{ width: `${overview?.bus?.rate || 0}%` }"
          ></div>
        </div>
        <div class="text-right text-sm text-dashboard-muted">
          使用率 {{ overview?.bus?.rate || 0 }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const overview = computed(() => store.overview)

function getStatusLevel(rate) {
  if (!rate) return 'normal'
  if (rate >= 90) return 'danger'
  if (rate >= 75) return 'warning'
  return 'normal'
}

function getTextColor(rate) {
  if (!rate) return 'text-dashboard-success'
  if (rate >= 90) return 'text-dashboard-danger'
  if (rate >= 75) return 'text-dashboard-warning'
  return 'text-dashboard-success'
}
</script>
