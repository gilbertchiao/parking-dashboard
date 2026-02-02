// 停車場基本配置
export const PARKING_CONFIG = {
  name: '新北智慧停車場',
  floors: ['B1', 'B2', 'B3', 'B4'],

  // 車格配置
  // B1: 機車、大巴、中巴、重機、VIP汽車
  // B2-B4: 汽車
  slots: {
    car: {
      total: 1500,
      vipInB1: 23,  // B1 VIP 專屬車格
      // B2, B3, B4 汽車車格分配
      perFloor: { B2: 500, B3: 500, B4: 477 }
    },
    motorcycle: { total: 3000, floor: 'B1' },  // 全部在 B1
    mediumBus: { total: 11, floor: 'B1' },     // 全部在 B1
    largeBus: { total: 5, floor: 'B1' },       // 全部在 B1
    heavyMotorcycle: { total: 4, floor: 'B1' }, // 全部在 B1
  },

  // 特殊車格
  specialSlots: {
    charging: { total: 15, icon: 'bolt' },
    family: { total: 15, icon: 'child' },
    disabled: { total: 15, icon: 'wheelchair' },
  },

  // 出入口（各 3 個，皆有即時串流）
  gates: {
    car: [
      { id: 'A1', name: '汽車入口 A1', streamUrl: '/streams/car-a1.m3u8' },
      { id: 'A2', name: '汽車入口 A2', streamUrl: '/streams/car-a2.m3u8' },
      { id: 'A3', name: '汽車入口 A3', streamUrl: '/streams/car-a3.m3u8' },
    ],
    motorcycle: [
      { id: 'M1', name: '機車入口 M1', streamUrl: '/streams/moto-m1.m3u8' },
      { id: 'M2', name: '機車入口 M2', streamUrl: '/streams/moto-m2.m3u8' },
      { id: 'M3', name: '機車入口 M3', streamUrl: '/streams/moto-m3.m3u8' },
    ],
  },
}

// 產生隨機數值（帶波動）
function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 產生樓層車位使用狀況（新設計）
function generateFloorData() {
  // B1: 機車、大巴、中巴、重機、VIP汽車
  const b1Data = {
    floor: 'B1',
    vehicleTypes: {
      motorcycle: {
        total: PARKING_CONFIG.slots.motorcycle.total,
        occupied: randomBetween(2000, 2800),
      },
      largeBus: {
        total: PARKING_CONFIG.slots.largeBus.total,
        occupied: randomBetween(2, 5),
      },
      mediumBus: {
        total: PARKING_CONFIG.slots.mediumBus.total,
        occupied: randomBetween(5, 10),
      },
      heavyMotorcycle: {
        total: PARKING_CONFIG.slots.heavyMotorcycle.total,
        occupied: randomBetween(1, 4),
      },
      vipCar: {
        total: PARKING_CONFIG.slots.car.vipInB1,
        occupied: randomBetween(10, 20),
      },
    },
  }

  // 計算 B1 各類型使用率
  Object.keys(b1Data.vehicleTypes).forEach(type => {
    const data = b1Data.vehicleTypes[type]
    data.available = data.total - data.occupied
    data.rate = Math.round((data.occupied / data.total) * 100)
  })

  // B2, B3, B4: 汽車
  const carFloors = ['B2', 'B3', 'B4'].map((floor, index) => {
    const total = PARKING_CONFIG.slots.car.perFloor[floor]
    // 模擬不同樓層的使用率（B2 最高，B4 最低）
    const baseRate = 0.75 - (index * 0.15)
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

  return {
    b1: b1Data,
    carFloors,
  }
}

// 產生出入口狀態（含串流資訊）
function generateGateStatus(gateConfigs) {
  return gateConfigs.map(gate => {
    const statusRandom = Math.random()
    let status = 'normal'
    if (statusRandom > 0.95) status = 'fault'
    else if (statusRandom > 0.85) status = 'busy'

    return {
      id: gate.id,
      name: gate.name,
      streamUrl: gate.streamUrl,
      status,
      flow: status === 'fault' ? 0 : randomBetween(5, 80),
      entryCount: randomBetween(50, 200),
      exitCount: randomBetween(40, 180),
    }
  })
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
    { level: 'danger', messages: ['A1 出口閘門異常', 'B2 消防警報觸發', 'M2 機車入口故障'] },
    { level: 'warning', messages: ['汽車車位剩餘不足 10%', 'A2 出口車流量偏高', 'B1 機車區即將滿位'] },
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

// 產生道路擁擠度（3 個出入口各自的狀況）
function generateTrafficStatus() {
  const levels = ['smooth', 'normal', 'congested']
  const descriptions = ['順暢', '普通', '壅塞']

  // 為每個汽車出入口產生獨立的道路狀況
  const gates = PARKING_CONFIG.gates.car.map(gate => {
    const levelIndex = Math.random() > 0.7 ? 2 : Math.random() > 0.4 ? 1 : 0
    return {
      id: gate.id,
      name: gate.name,
      level: levels[levelIndex],
      description: descriptions[levelIndex],
    }
  })

  return gates
}

// 產生今日入場車輛身份統計
function generateVehicleIdentityStats() {
  // 身份類型：臨停、月租、公務車、員工、其他
  const totalVehicles = randomBetween(800, 1500)

  // 各類型比例（模擬真實情況）
  const monthlyRate = randomBetween(35, 45) / 100  // 月租 35-45%
  const tempRate = randomBetween(25, 35) / 100     // 臨停 25-35%
  const employeeRate = randomBetween(10, 15) / 100 // 員工 10-15%
  const officialRate = randomBetween(5, 10) / 100  // 公務車 5-10%
  // 其他為剩餘

  const monthly = Math.round(totalVehicles * monthlyRate)
  const temp = Math.round(totalVehicles * tempRate)
  const employee = Math.round(totalVehicles * employeeRate)
  const official = Math.round(totalVehicles * officialRate)
  const other = totalVehicles - monthly - temp - employee - official

  return {
    total: totalVehicles,
    categories: [
      { name: '臨停', value: temp, color: '#3b82f6' },
      { name: '月租', value: monthly, color: '#22c55e' },
      { name: '公務車', value: official, color: '#f59e0b' },
      { name: '員工', value: employee, color: '#8b5cf6' },
      { name: '其他', value: other, color: '#6b7280' },
    ]
  }
}

// 匯出模擬資料產生函式
export function generateMockData() {
  const floorData = generateFloorData()

  // 計算汽車總和（B1 VIP + B2-B4）
  const carTotal = PARKING_CONFIG.slots.car.vipInB1 +
    floorData.carFloors.reduce((sum, f) => sum + f.total, 0)
  const carOccupied = floorData.b1.vehicleTypes.vipCar.occupied +
    floorData.carFloors.reduce((sum, f) => sum + f.occupied, 0)

  // 機車總和（全在 B1）
  const motorcycleTotal = floorData.b1.vehicleTypes.motorcycle.total
  const motorcycleOccupied = floorData.b1.vehicleTypes.motorcycle.occupied

  // 巴士總和（全在 B1）
  const busTotal = floorData.b1.vehicleTypes.largeBus.total + floorData.b1.vehicleTypes.mediumBus.total
  const busOccupied = floorData.b1.vehicleTypes.largeBus.occupied + floorData.b1.vehicleTypes.mediumBus.occupied

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

    // 各樓層狀況（新結構）
    floors: floorData,

    // 特殊車格
    specialSlots: generateSpecialSlots(),

    // 出入口狀態（含串流資訊）
    gates: {
      car: generateGateStatus(PARKING_CONFIG.gates.car),
      motorcycle: generateGateStatus(PARKING_CONFIG.gates.motorcycle),
    },

    // 今日統計
    hourlyStats: generateHourlyStats(),

    // 告警
    alerts: generateAlerts(),

    // 天氣
    weather: generateWeather(),

    // 道路狀況（3 個出入口）
    traffic: generateTrafficStatus(),

    // 今日入場車輛身份統計
    vehicleIdentity: generateVehicleIdentityStats(),
  }
}
