<template>
  <div class="dashboard-card h-full flex flex-col">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-white">樓層車位分布</h2>
    </div>

    <div class="flex-1 flex flex-col gap-3 overflow-auto">
      <!-- B1 樓層（特殊配置：機車、巴士、重機、VIP汽車） -->
      <div class="bg-dashboard-bg rounded-lg p-3">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 bg-dashboard-accent/20 rounded-lg flex items-center justify-center">
            <span class="text-xl font-bold text-dashboard-accent">B1</span>
          </div>
          <div class="text-sm text-dashboard-muted">機車 / 巴士 / 重機 / VIP</div>
        </div>

        <!-- B1 各類型車格 -->
        <div class="grid grid-cols-2 gap-2">
          <!-- 機車 -->
          <div class="bg-dashboard-card rounded p-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-dashboard-muted flex items-center gap-1">
                <span>🏍️</span> 機車
              </span>
              <span :class="['text-xs font-medium', getRateTextColor(b1Data?.vehicleTypes?.motorcycle?.rate)]">
                {{ b1Data?.vehicleTypes?.motorcycle?.rate || 0 }}%
              </span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-number font-bold text-white">
                {{ b1Data?.vehicleTypes?.motorcycle?.available?.toLocaleString() || '--' }}
              </span>
              <span class="text-xs text-dashboard-muted">
                / {{ b1Data?.vehicleTypes?.motorcycle?.total?.toLocaleString() || '--' }}
              </span>
            </div>
            <div class="h-1.5 bg-dashboard-border rounded-full mt-1 overflow-hidden">
              <div
                :class="['h-full rounded-full', getRateBarColor(b1Data?.vehicleTypes?.motorcycle?.rate)]"
                :style="{ width: `${b1Data?.vehicleTypes?.motorcycle?.rate || 0}%` }"
              ></div>
            </div>
          </div>

          <!-- VIP 汽車 -->
          <div class="bg-dashboard-card rounded p-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-dashboard-muted flex items-center gap-1">
                <span>⭐</span> VIP 汽車
              </span>
              <span :class="['text-xs font-medium', getRateTextColor(b1Data?.vehicleTypes?.vipCar?.rate)]">
                {{ b1Data?.vehicleTypes?.vipCar?.rate || 0 }}%
              </span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-number font-bold text-white">
                {{ b1Data?.vehicleTypes?.vipCar?.available || '--' }}
              </span>
              <span class="text-xs text-dashboard-muted">
                / {{ b1Data?.vehicleTypes?.vipCar?.total || '--' }}
              </span>
            </div>
            <div class="h-1.5 bg-dashboard-border rounded-full mt-1 overflow-hidden">
              <div
                :class="['h-full rounded-full', getRateBarColor(b1Data?.vehicleTypes?.vipCar?.rate)]"
                :style="{ width: `${b1Data?.vehicleTypes?.vipCar?.rate || 0}%` }"
              ></div>
            </div>
          </div>

          <!-- 大巴 -->
          <div class="bg-dashboard-card rounded p-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-dashboard-muted flex items-center gap-1">
                <span>🚌</span> 大巴
              </span>
              <span :class="['text-xs font-medium', getRateTextColor(b1Data?.vehicleTypes?.largeBus?.rate)]">
                {{ b1Data?.vehicleTypes?.largeBus?.rate || 0 }}%
              </span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-number font-bold text-white">
                {{ b1Data?.vehicleTypes?.largeBus?.available || '--' }}
              </span>
              <span class="text-xs text-dashboard-muted">
                / {{ b1Data?.vehicleTypes?.largeBus?.total || '--' }}
              </span>
            </div>
            <div class="h-1.5 bg-dashboard-border rounded-full mt-1 overflow-hidden">
              <div
                :class="['h-full rounded-full', getRateBarColor(b1Data?.vehicleTypes?.largeBus?.rate)]"
                :style="{ width: `${b1Data?.vehicleTypes?.largeBus?.rate || 0}%` }"
              ></div>
            </div>
          </div>

          <!-- 中巴 -->
          <div class="bg-dashboard-card rounded p-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-dashboard-muted flex items-center gap-1">
                <span>🚐</span> 中巴
              </span>
              <span :class="['text-xs font-medium', getRateTextColor(b1Data?.vehicleTypes?.mediumBus?.rate)]">
                {{ b1Data?.vehicleTypes?.mediumBus?.rate || 0 }}%
              </span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-number font-bold text-white">
                {{ b1Data?.vehicleTypes?.mediumBus?.available || '--' }}
              </span>
              <span class="text-xs text-dashboard-muted">
                / {{ b1Data?.vehicleTypes?.mediumBus?.total || '--' }}
              </span>
            </div>
            <div class="h-1.5 bg-dashboard-border rounded-full mt-1 overflow-hidden">
              <div
                :class="['h-full rounded-full', getRateBarColor(b1Data?.vehicleTypes?.mediumBus?.rate)]"
                :style="{ width: `${b1Data?.vehicleTypes?.mediumBus?.rate || 0}%` }"
              ></div>
            </div>
          </div>

          <!-- 重機 -->
          <div class="bg-dashboard-card rounded p-2 col-span-2">
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-dashboard-muted flex items-center gap-1">
                <span>🏍️</span> 重型機車
              </span>
              <span :class="['text-xs font-medium', getRateTextColor(b1Data?.vehicleTypes?.heavyMotorcycle?.rate)]">
                {{ b1Data?.vehicleTypes?.heavyMotorcycle?.rate || 0 }}%
              </span>
            </div>
            <div class="flex items-baseline gap-1">
              <span class="text-lg font-number font-bold text-white">
                {{ b1Data?.vehicleTypes?.heavyMotorcycle?.available || '--' }}
              </span>
              <span class="text-xs text-dashboard-muted">
                / {{ b1Data?.vehicleTypes?.heavyMotorcycle?.total || '--' }}
              </span>
            </div>
            <div class="h-1.5 bg-dashboard-border rounded-full mt-1 overflow-hidden">
              <div
                :class="['h-full rounded-full', getRateBarColor(b1Data?.vehicleTypes?.heavyMotorcycle?.rate)]"
                :style="{ width: `${b1Data?.vehicleTypes?.heavyMotorcycle?.rate || 0}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- B2, B3, B4 汽車樓層 -->
      <div
        v-for="floor in carFloors"
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
              <span class="text-sm text-dashboard-muted flex items-center gap-1">
                <span>🚗</span> 汽車
                <span class="text-white font-medium ml-1">剩餘 {{ floor.available }} 格</span>
              </span>
              <span :class="['text-sm font-medium', getRateTextColor(floor.rate)]">
                {{ floor.rate }}%
              </span>
            </div>
            <div class="h-4 bg-dashboard-border rounded-full overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-500', getRateBarColor(floor.rate)]"
                :style="{ width: `${floor.rate}%` }"
              >
                <div class="h-full w-full bg-gradient-to-r from-transparent to-white/20"></div>
              </div>
            </div>
          </div>

          <!-- 數字顯示 -->
          <div class="text-right min-w-[70px]">
            <div class="text-xl font-number font-bold text-white">{{ floor.occupied }}</div>
            <div class="text-xs text-dashboard-muted">/ {{ floor.total }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖例 -->
    <div class="mt-3 pt-3 border-t border-dashboard-border flex justify-center gap-6 text-xs">
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
import { computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const floors = computed(() => store.floors)

// B1 特殊樓層資料
const b1Data = computed(() => floors.value?.b1 || null)

// B2-B4 汽車樓層
const carFloors = computed(() => floors.value?.carFloors || [])

function getRateTextColor(rate) {
  if (!rate) return 'text-dashboard-success'
  if (rate >= 90) return 'text-dashboard-danger'
  if (rate >= 75) return 'text-dashboard-warning'
  return 'text-dashboard-success'
}

function getRateBarColor(rate) {
  if (!rate) return 'bg-dashboard-success'
  if (rate >= 90) return 'bg-dashboard-danger'
  if (rate >= 75) return 'bg-dashboard-warning'
  return 'bg-dashboard-success'
}
</script>
