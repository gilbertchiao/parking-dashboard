// 停車場基本配置
export const PARKING_CONFIG = {
  name: '台北智慧停車場',
  floors: ['B1', 'B2', 'B3', 'B4'],

  // 車格配置
  slots: {
    car: { total: 1500, perFloor: [400, 400, 400, 300] },
    motorcycle: { total: 3000, perFloor: [800, 800, 800, 600] },
    mediumBus: { total: 11, perFloor: [3, 3, 3, 2] },
    largeBus: { total: 5, perFloor: [2, 1, 1, 1] },
    heavyMotorcycle: { total: 4, perFloor: [1, 1, 1, 1] },
  },

  // 特殊車格
  specialSlots: {
    charging: { total: 15, icon: 'bolt' },
    family: { total: 15, icon: 'child' },
    disabled: { total: 15, icon: 'wheelchair' },
  },

  // 出入口
  gates: {
    car: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
    motorcycle: ['M1', 'M2', 'M3', 'M4', 'M5'],
  },

  // 設施
  facilities: {
    elevators: 10,
    stairs: 6,
  }
}

// 產生隨機數值（帶波動）
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 產生各樓層車位使用狀況
function generateFloorOccupancy(type) {
  const config = PARKING_CONFIG.slots[type]
  const floors = PARKING_CONFIG.floors

  return floors.map((floor, index) => {
    const total = config.perFloor[index]
    // 模擬不同樓層的使用率（B1 最高，B4 最低）
    const baseRate = 0.8 - (index * 0.15)
    const variance = 0.1
    const rate = Math.min(Math.max(baseRate + (Math.random() * variance * 2 - variance), 0.1), 0.95)
    const occupied = Math.floor(total * rate)

    return {
      floor,
      total,
      occupied,
      available: total - occupied,
      rate: Math.round(rate * 100)
    }
  })
}

// 產生出入口狀態
function generateGateStatus(gateIds) {
  return gateIds.map(id => {
    const statusRandom = Math.random()
    let status = 'normal'
    if (statusRandom > 0.95) status = 'fault'
    else if (statusRandom > 0.85) status = 'busy'

    return {
      id,
      status,
      flow: status === 'fault' ? 0 : randomBetween(5, 80),
      entryCount: randomBetween(50, 200),
      exitCount: randomBetween(40, 180),
    }
  })
}

// 產生電梯狀態
function generateElevatorStatus(count) {
  const floors = ['B1', 'B2', 'B3', 'B4']
  return Array.from({ length: count }, (_, i) => {
    const statusRandom = Math.random()
    let status = 'running'
    if (statusRandom > 0.95) status = 'fault'
    else if (statusRandom > 0.9) status = 'maintenance'

    return {
      id: `E${i + 1}`,
      status,
      currentFloor: status === 'fault' ? '--' : floors[randomBetween(0, 3)],
    }
  })
}

// 產生樓梯狀態
function generateStairStatus(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: `S${i + 1}`,
    status: Math.random() > 0.98 ? 'blocked' : 'normal',
  }))
}

// 產生特殊車格狀態
function generateSpecialSlots() {
  const { specialSlots, slots } = PARKING_CONFIG

  return {
    charging: {
      total: specialSlots.charging.total,
      occupied: randomBetween(8, 14),
      charging: randomBetween(5, 10),
    },
    family: {
      total: specialSlots.family.total,
      occupied: randomBetween(5, 12),
    },
    disabled: {
      total: specialSlots.disabled.total,
      occupied: randomBetween(3, 10),
    },
    heavyMotorcycle: {
      total: slots.heavyMotorcycle.total,
      occupied: randomBetween(1, 4),
    }
  }
}

// 產生今日進出統計（按小時）
function generateHourlyStats() {
  const hours = []
  const now = new Date()
  const currentHour = now.getHours()

  // 尖峰時段定義
  const peakHours = [8, 9, 12, 13, 17, 18, 19]

  for (let h = 6; h <= 22; h++) {
    const isPeak = peakHours.includes(h)
    const baseEntry = isPeak ? randomBetween(60, 100) : randomBetween(20, 50)
    const baseExit = isPeak ? randomBetween(50, 90) : randomBetween(15, 45)

    hours.push({
      hour: h,
      label: `${h}:00`,
      entry: h <= currentHour ? baseEntry : null,
      exit: h <= currentHour ? baseExit : null,
      isPeak,
    })
  }

  return hours
}

// 產生告警訊息
function generateAlerts() {
  const alertTypes = [
    { level: 'danger', messages: ['E4 電梯故障待修', 'A5 出口閘門異常', 'B2 消防警報觸發'] },
    { level: 'warning', messages: ['汽車車位剩餘不足 10%', 'A3 出口車流量偏高', 'B1 機車區即將滿位'] },
    { level: 'info', messages: ['系統運作正常', '今日已服務 2,847 車次', '充電樁 #3 充電完成'] },
  ]

  const alerts = []
  const now = new Date()

  // 隨機產生 3-6 則告警
  const count = randomBetween(3, 6)
  for (let i = 0; i < count; i++) {
    const typeIndex = Math.random() > 0.7 ? 0 : Math.random() > 0.5 ? 1 : 2
    const type = alertTypes[typeIndex]
    const message = type.messages[randomBetween(0, type.messages.length - 1)]
    const minutesAgo = randomBetween(1, 60)
    const time = new Date(now - minutesAgo * 60000)

    alerts.push({
      id: i + 1,
      level: type.level,
      message,
      time: time.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
    })
  }

  return alerts.sort((a, b) => b.timestamp - a.timestamp)
}

// 產生天氣資料
function generateWeather() {
  const conditions = ['sunny', 'cloudy', 'rainy', 'overcast']
  const condition = conditions[randomBetween(0, 3)]

  return {
    condition,
    temperature: randomBetween(18, 32),
    humidity: randomBetween(50, 85),
    rainChance: condition === 'rainy' ? randomBetween(60, 90) : randomBetween(0, 30),
  }
}

// 產生道路擁擠度
function generateTrafficStatus() {
  const levels = ['smooth', 'normal', 'congested']
  const levelIndex = Math.random() > 0.7 ? 2 : Math.random() > 0.4 ? 1 : 0

  return {
    level: levels[levelIndex],
    description: ['順暢', '普通', '壅塞'][levelIndex],
  }
}

// 匯出模擬資料產生函式
export function generateMockData() {
  const carFloors = generateFloorOccupancy('car')
  const motorcycleFloors = generateFloorOccupancy('motorcycle')

  // 計算總和
  const carTotal = carFloors.reduce((sum, f) => sum + f.total, 0)
  const carOccupied = carFloors.reduce((sum, f) => sum + f.occupied, 0)
  const motorcycleTotal = motorcycleFloors.reduce((sum, f) => sum + f.total, 0)
  const motorcycleOccupied = motorcycleFloors.reduce((sum, f) => sum + f.occupied, 0)

  // 巴士統計
  const busTotal = PARKING_CONFIG.slots.mediumBus.total + PARKING_CONFIG.slots.largeBus.total
  const busOccupied = randomBetween(Math.floor(busTotal * 0.5), busTotal - 1)

  return {
    timestamp: Date.now(),

    // 車位總覽
    overview: {
      car: {
        total: carTotal,
        occupied: carOccupied,
        available: carTotal - carOccupied,
        rate: Math.round((carOccupied / carTotal) * 100),
      },
      motorcycle: {
        total: motorcycleTotal,
        occupied: motorcycleOccupied,
        available: motorcycleTotal - motorcycleOccupied,
        rate: Math.round((motorcycleOccupied / motorcycleTotal) * 100),
      },
      bus: {
        total: busTotal,
        occupied: busOccupied,
        available: busTotal - busOccupied,
        rate: Math.round((busOccupied / busTotal) * 100),
      },
    },

    // 各樓層狀況
    floors: {
      car: carFloors,
      motorcycle: motorcycleFloors,
    },

    // 特殊車格
    specialSlots: generateSpecialSlots(),

    // 出入口狀態
    gates: {
      car: generateGateStatus(PARKING_CONFIG.gates.car),
      motorcycle: generateGateStatus(PARKING_CONFIG.gates.motorcycle),
    },

    // 設施狀態
    facilities: {
      elevators: generateElevatorStatus(PARKING_CONFIG.facilities.elevators),
      stairs: generateStairStatus(PARKING_CONFIG.facilities.stairs),
    },

    // 今日統計
    hourlyStats: generateHourlyStats(),

    // 告警
    alerts: generateAlerts(),

    // 天氣
    weather: generateWeather(),

    // 道路狀況
    traffic: generateTrafficStatus(),
  }
}
