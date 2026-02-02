<template>
  <div class="dashboard-card h-full flex flex-col">
    <h2 class="text-lg font-bold text-white mb-4">出入口監控</h2>

    <div class="flex-1 flex flex-col gap-4">
      <!-- 汽車出入口 -->
      <div class="flex-1">
        <div class="text-sm text-dashboard-muted mb-2">汽車出入口（3 處）</div>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="gate in carGates"
            :key="gate.id"
            class="bg-dashboard-bg rounded-lg p-2 cursor-pointer hover:ring-1 hover:ring-dashboard-accent transition-all"
            @click="openStream(gate)"
          >
            <!-- 模擬影像預覽 -->
            <div class="relative aspect-video bg-gray-800 rounded mb-2 overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-6 h-6 mx-auto text-dashboard-muted mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs text-dashboard-muted">LIVE</span>
                </div>
              </div>
              <!-- 狀態指示 -->
              <div class="absolute top-1 right-1">
                <div :class="['w-2 h-2 rounded-full', getStatusDotClass(gate.status)]"></div>
              </div>
              <!-- 錄影中指示 -->
              <div class="absolute top-1 left-1 flex items-center gap-1 bg-black/50 rounded px-1">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-[10px] text-white">REC</span>
              </div>
            </div>

            <div class="text-center">
              <div class="text-sm font-medium text-white">{{ gate.id }}</div>
              <div class="text-lg font-number font-bold text-white">{{ gate.flow }}</div>
              <div class="text-xs text-dashboard-muted">車次/10分</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 機車出入口 -->
      <div class="flex-1">
        <div class="text-sm text-dashboard-muted mb-2">機車出入口（3 處）</div>
        <div class="grid grid-cols-3 gap-2">
          <div
            v-for="gate in motorcycleGates"
            :key="gate.id"
            class="bg-dashboard-bg rounded-lg p-2 cursor-pointer hover:ring-1 hover:ring-dashboard-accent transition-all"
            @click="openStream(gate)"
          >
            <!-- 模擬影像預覽 -->
            <div class="relative aspect-video bg-gray-800 rounded mb-2 overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <svg class="w-6 h-6 mx-auto text-dashboard-muted mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span class="text-xs text-dashboard-muted">LIVE</span>
                </div>
              </div>
              <!-- 狀態指示 -->
              <div class="absolute top-1 right-1">
                <div :class="['w-2 h-2 rounded-full', getStatusDotClass(gate.status)]"></div>
              </div>
              <!-- 錄影中指示 -->
              <div class="absolute top-1 left-1 flex items-center gap-1 bg-black/50 rounded px-1">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-[10px] text-white">REC</span>
              </div>
            </div>

            <div class="text-center">
              <div class="text-sm font-medium text-white">{{ gate.id }}</div>
              <div class="text-lg font-number font-bold text-white">{{ gate.flow }}</div>
              <div class="text-xs text-dashboard-muted">車次/10分</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖例 -->
    <div class="mt-3 pt-3 border-t border-dashboard-border flex justify-center gap-4 text-xs">
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 rounded-full bg-dashboard-success"></div>
        <span class="text-dashboard-muted">正常</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 rounded-full bg-dashboard-warning"></div>
        <span class="text-dashboard-muted">擁擠</span>
      </div>
      <div class="flex items-center gap-1">
        <div class="w-2 h-2 rounded-full bg-dashboard-danger"></div>
        <span class="text-dashboard-muted">故障</span>
      </div>
      <div class="flex items-center gap-1">
        <svg class="w-3 h-3 text-dashboard-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span class="text-dashboard-muted">點擊開啟即時影像</span>
      </div>
    </div>

    <!-- 影像彈窗 -->
    <Teleport to="body">
      <div
        v-if="showStreamModal"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        @click.self="closeStream"
      >
        <div class="bg-dashboard-card rounded-lg overflow-hidden max-w-4xl w-full mx-4">
          <div class="flex items-center justify-between p-4 border-b border-dashboard-border">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-sm text-white font-medium">LIVE</span>
              </div>
              <h3 class="text-lg font-bold text-white">{{ selectedGate?.name }}</h3>
            </div>
            <button
              class="text-dashboard-muted hover:text-white transition-colors"
              @click="closeStream"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="aspect-video bg-gray-900 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-16 h-16 mx-auto text-dashboard-muted mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p class="text-dashboard-muted mb-2">即時串流影像</p>
              <p class="text-xs text-dashboard-muted">{{ selectedGate?.streamUrl }}</p>
            </div>
          </div>
          <div class="p-4 border-t border-dashboard-border flex items-center justify-between">
            <div class="flex items-center gap-4 text-sm">
              <div>
                <span class="text-dashboard-muted">狀態：</span>
                <span :class="getStatusTextClass(selectedGate?.status)">
                  {{ getStatusText(selectedGate?.status) }}
                </span>
              </div>
              <div>
                <span class="text-dashboard-muted">流量：</span>
                <span class="text-white font-number">{{ selectedGate?.flow }} 車次/10分</span>
              </div>
            </div>
            <button
              class="px-4 py-2 bg-dashboard-accent text-white rounded hover:bg-dashboard-accent/80 transition-colors text-sm"
              @click="closeStream"
            >
              關閉
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDashboardStore } from '../../stores/dashboard'

const store = useDashboardStore()
const gates = computed(() => store.gates)

const carGates = computed(() => gates.value?.car || [])
const motorcycleGates = computed(() => gates.value?.motorcycle || [])

// 影像彈窗狀態
const showStreamModal = ref(false)
const selectedGate = ref(null)

function openStream(gate) {
  selectedGate.value = gate
  showStreamModal.value = true
}

function closeStream() {
  showStreamModal.value = false
  selectedGate.value = null
}

function getStatusDotClass(status) {
  const classes = {
    normal: 'bg-dashboard-success',
    busy: 'bg-dashboard-warning',
    fault: 'bg-dashboard-danger animate-pulse',
  }
  return classes[status] || 'bg-dashboard-success'
}

function getStatusText(status) {
  const texts = {
    normal: '正常',
    busy: '擁擠',
    fault: '故障',
  }
  return texts[status] || '正常'
}

function getStatusTextClass(status) {
  const classes = {
    normal: 'text-dashboard-success',
    busy: 'text-dashboard-warning',
    fault: 'text-dashboard-danger',
  }
  return classes[status] || 'text-dashboard-success'
}
</script>
