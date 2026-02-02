<template>
  <div class="dashboard-card py-2 px-4">
    <div class="flex items-center gap-4 overflow-hidden">
      <!-- 告警標籤 -->
      <div class="flex items-center gap-2 shrink-0">
        <div class="w-2 h-2 rounded-full bg-dashboard-danger animate-pulse"></div>
        <span class="text-sm font-medium text-white">即時告警</span>
      </div>

      <!-- 告警內容（滾動） -->
      <div class="flex-1 overflow-hidden relative">
        <div class="flex gap-8 animate-marquee whitespace-nowrap">
          <div
            v-for="alert in displayAlerts"
            :key="alert.id"
            class="flex items-center gap-2"
          >
            <span :class="['text-lg', getAlertIcon(alert.level)]">
              {{ getLevelEmoji(alert.level) }}
            </span>
            <span class="text-sm text-dashboard-muted">{{ alert.time }}</span>
            <span :class="['text-sm', getAlertTextClass(alert.level)]">
              {{ alert.message }}
            </span>
          </div>
          <!-- 重複一次以實現無縫滾動 -->
          <div
            v-for="alert in displayAlerts"
            :key="'repeat-' + alert.id"
            class="flex items-center gap-2"
          >
            <span :class="['text-lg', getAlertIcon(alert.level)]">
              {{ getLevelEmoji(alert.level) }}
            </span>
            <span class="text-sm text-dashboard-muted">{{ alert.time }}</span>
            <span :class="['text-sm', getAlertTextClass(alert.level)]">
              {{ alert.message }}
            </span>
          </div>
        </div>
      </div>

      <!-- 告警統計 -->
      <div class="flex items-center gap-3 shrink-0 border-l border-dashboard-border pl-4">
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-dashboard-danger"></div>
          <span class="text-sm text-white font-number">{{ dangerCount }}</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-dashboard-warning"></div>
          <span class="text-sm text-white font-number">{{ warningCount }}</span>
        </div>
        <div class="flex items-center gap-1">
          <div class="w-2 h-2 rounded-full bg-dashboard-success"></div>
          <span class="text-sm text-white font-number">{{ infoCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const alerts = computed(() => store.alerts)

// 最多顯示 6 則
const displayAlerts = computed(() => alerts.value.slice(0, 6))

// 各等級數量
const dangerCount = computed(() => alerts.value.filter(a => a.level === 'danger').length)
const warningCount = computed(() => alerts.value.filter(a => a.level === 'warning').length)
const infoCount = computed(() => alerts.value.filter(a => a.level === 'info').length)

function getLevelEmoji(level) {
  const emojis = {
    danger: '🔴',
    warning: '🟡',
    info: '🟢',
  }
  return emojis[level] || '🟢'
}

function getAlertIcon(level) {
  return '' // 使用 emoji 代替
}

function getAlertTextClass(level) {
  const classes = {
    danger: 'text-dashboard-danger',
    warning: 'text-dashboard-warning',
    info: 'text-dashboard-muted',
  }
  return classes[level] || 'text-dashboard-muted'
}
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
