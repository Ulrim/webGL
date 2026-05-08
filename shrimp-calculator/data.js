// 토하(민물새우) 수질 기준 데이터
const SHRIMP_DATA = {
  params: {
    temp: {
      label: '수온',
      unit: '°C',
      min: 0, max: 35, step: 0.5, default: 20,
      safe: [17, 22],
      warn: [15, 25],
      icon: '🌡️',
      advice: {
        low:  '수온이 너무 낮습니다. 히터를 확인하거나 실내 온도를 올려주세요.',
        warn_low: '수온이 약간 낮습니다. 토하는 서늘한 물을 좋아하지만 15°C 이하는 스트레스를 줍니다.',
        safe: '수온이 적정 범위입니다. 토하가 가장 활발하게 활동하는 온도입니다.',
        warn_high: '수온이 약간 높습니다. 환기를 강화하거나 선풍기를 이용해 수면을 식혀주세요.',
        high: '수온이 너무 높습니다! 즉시 물을 식혀주세요. 25°C 이상에서는 면역력이 크게 저하됩니다.',
      }
    },
    ph: {
      label: 'pH',
      unit: '',
      min: 4, max: 10, step: 0.1, default: 7.0,
      safe: [6.8, 7.2],
      warn: [6.5, 7.5],
      icon: '⚗️',
      advice: {
        low:  'pH가 너무 낮습니다(산성). 산호사나 KH 증진제를 소량 추가해보세요.',
        warn_low: 'pH가 약간 낮습니다. 수돗물로 소량 환수하거나 KH를 확인하세요.',
        safe: 'pH가 적정 범위입니다.',
        warn_high: 'pH가 약간 높습니다. 이탄수나 pH 조정제를 고려해보세요.',
        high: 'pH가 너무 높습니다(알칼리성). 토하에게 매우 유해합니다. 즉시 원인을 찾아 조치하세요.',
      }
    },
    ammonia: {
      label: '암모니아',
      unit: 'ppm',
      min: 0, max: 5, step: 0.05, default: 0,
      safe: [0, 0],
      warn: [0, 0.25],
      icon: '⚠️',
      advice: {
        low:  '', // not applicable
        warn_low: '',
        safe: '암모니아가 검출되지 않습니다. 좋은 상태입니다.',
        warn_high: '미량의 암모니아가 검출됩니다. 과잉 먹이나 사체를 제거하고 환수를 진행하세요.',
        high: '암모니아 수치가 위험합니다! 즉시 50% 이상 환수하고 먹이를 중단하세요. 새우가 폐사할 수 있습니다.',
      }
    },
    nitrite: {
      label: '아질산염',
      unit: 'ppm',
      min: 0, max: 5, step: 0.05, default: 0,
      safe: [0, 0],
      warn: [0, 0.1],
      icon: '🔬',
      advice: {
        low:  '',
        warn_low: '',
        safe: '아질산염이 검출되지 않습니다. 여과 사이클이 완성된 상태입니다.',
        warn_high: '아질산염이 검출됩니다. 사이클이 진행 중이거나 여과 박테리아가 부족할 수 있습니다. 환수를 진행하세요.',
        high: '아질산염 수치가 위험합니다! 즉시 대량 환수하고 새우를 임시 이동을 고려하세요.',
      }
    },
    nitrate: {
      label: '질산염',
      unit: 'ppm',
      min: 0, max: 100, step: 1, default: 5,
      safe: [0, 10],
      warn: [0, 20],
      icon: '📊',
      advice: {
        low:  '',
        warn_low: '',
        safe: '질산염이 낮은 수준입니다. 이상적인 상태입니다.',
        warn_high: '질산염이 약간 높습니다. 주 1회 10-15% 환수로 유지해주세요.',
        high: '질산염이 높습니다. 즉시 30% 환수를 하고 수초나 여과 시스템을 점검하세요.',
      }
    },
    kh: {
      label: 'KH (탄산경도)',
      unit: 'dKH',
      min: 0, max: 20, step: 0.5, default: 3,
      safe: [2, 5],
      warn: [1, 7],
      icon: '🪨',
      advice: {
        low:  'KH가 너무 낮습니다. pH가 불안정해집니다. 탄산칼슘이나 산호사를 추가해보세요.',
        warn_low: 'KH가 약간 낮습니다. pH 변동이 커질 수 있습니다.',
        safe: 'KH가 적정 범위입니다. pH 완충 능력이 충분합니다.',
        warn_high: 'KH가 약간 높습니다. 물이 딱딱해 토하 탈피에 영향을 줄 수 있습니다.',
        high: 'KH가 너무 높습니다. RO수나 정수된 물로 환수해서 낮춰주세요.',
      }
    },
    gh: {
      label: 'GH (총경도)',
      unit: 'dGH',
      min: 0, max: 20, step: 0.5, default: 6,
      safe: [4, 8],
      warn: [2, 10],
      icon: '💎',
      advice: {
        low:  'GH가 너무 낮습니다. 미네랄 부족으로 탈피 불량이 발생할 수 있습니다. 미네랄 보충제를 추가하세요.',
        warn_low: 'GH가 약간 낮습니다. 칼슘, 마그네슘이 부족할 수 있습니다.',
        safe: 'GH가 적정 범위입니다. 새우의 탈피와 성장에 필요한 미네랄이 충분합니다.',
        warn_high: 'GH가 약간 높습니다.',
        high: 'GH가 너무 높습니다. 연수로 환수하거나 RO수를 혼합해서 낮춰주세요.',
      }
    },
    tds: {
      label: 'TDS',
      unit: 'ppm',
      min: 0, max: 600, step: 5, default: 200,
      safe: [150, 250],
      warn: [100, 300],
      icon: '💧',
      advice: {
        low:  'TDS가 너무 낮습니다. 필요한 미네랄이 부족한 상태입니다.',
        warn_low: 'TDS가 약간 낮습니다. 미네랄 보충을 고려하세요.',
        safe: 'TDS가 적정 범위입니다.',
        warn_high: 'TDS가 약간 높습니다. 환수 주기를 늘려보세요.',
        high: 'TDS가 너무 높습니다. 50% 이상 환수를 권장합니다.',
      }
    }
  },

  // 포란 기간 (수온별 일수)
  gestationDays: function(temp) {
    if (temp <= 15) return 42;
    if (temp <= 16) return 38;
    if (temp <= 17) return 35;
    if (temp <= 18) return 32;
    if (temp <= 19) return 30;
    if (temp <= 20) return 28;
    if (temp <= 21) return 26;
    if (temp <= 22) return 24;
    if (temp <= 23) return 22;
    if (temp <= 24) return 21;
    return 20;
  },

  // 개체수 추천 (수조 용량 기준)
  stockingGuide: function(liters) {
    return {
      recommended: Math.floor(liters / 2.5),
      max: Math.floor(liters / 1.5),
      comfortable: Math.floor(liters / 3),
    };
  },

  // 여과기 유량 추천
  filterFlow: function(liters) {
    return {
      min: Math.round(liters * 5),
      recommended: Math.round(liters * 8),
      max: Math.round(liters * 10),
    };
  }
};
