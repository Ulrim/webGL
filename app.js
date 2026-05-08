function initTabs() {
  const btns = document.querySelectorAll('.tab-btn');
  const pages = document.querySelectorAll('.page');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      btns.forEach(b => b.classList.toggle('active', b.dataset.tab === target));
      pages.forEach(p => p.classList.toggle('active', p.id === target));
    });
  });
}

function getStatus(key, value) {
  const p = SHRIMP_DATA.params[key];
  if (!p) return 'safe';
  const [safeMin, safeMax] = p.safe;
  const [warnMin, warnMax] = p.warn;
  if (safeMin === safeMax && safeMax === 0) {
    if (value <= 0) return 'safe';
    if (value <= warnMax) return 'warn';
    return 'danger';
  }
  if (value >= safeMin && value <= safeMax) return 'safe';
  if (value >= warnMin && value <= warnMax) return 'warn';
  return 'danger';
}

function getAdvice(key, status, value) {
  const p = SHRIMP_DATA.params[key];
  if (!p) return '';
  const [safeMin, safeMax] = p.safe;
  const isZeroTarget = safeMin === 0 && safeMax === 0;
  if (isZeroTarget) {
    if (status === 'safe') return p.advice.safe;
    if (status === 'warn') return p.advice.warn_high;
    return p.advice.high;
  }
  if (status === 'safe') return p.advice.safe;
  if (value < safeMin) return status === 'warn' ? p.advice.warn_low : p.advice.low;
  return status === 'warn' ? p.advice.warn_high : p.advice.high;
}

function statusLabel(s) {
  return s === 'safe' ? '✅ 안전' : s === 'warn' ? '⚠️ 주의' : '🚨 위험';
}

function fmt(n, dec = 1) { return Number(n).toFixed(dec); }

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(d) {
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

function bindSlider(sliderId, numberId, callback) {
  const slider = document.getElementById(sliderId);
  const number = document.getElementById(numberId);
  if (!slider || !number) return;
  const sync = (src, dst) => {
    let v = parseFloat(src.value);
    if (isNaN(v)) v = parseFloat(src.min) || 0;
    v = Math.max(parseFloat(src.min || 0), Math.min(parseFloat(src.max || 9999), v));
    dst.value = v;
    if (callback) callback(v);
  };
  slider.addEventListener('input', () => sync(slider, number));
  number.addEventListener('input', () => sync(number, slider));
  number.addEventListener('change', () => sync(number, slider));
}

function initHome() {
  document.querySelectorAll('.quick-card').forEach(card => {
    card.addEventListener('click', () => {
      const tab = card.dataset.goto;
      if (tab) document.querySelector(`.tab-btn[data-tab="${tab}"]`).click();
    });
  });
}

function initWaterQuality() {
  const keys = ['temp', 'ph', 'ammonia', 'nitrite', 'nitrate', 'kh', 'gh', 'tds'];
  keys.forEach(key => {
    bindSlider(`${key}-slider`, `${key}-num`, () => updateParam(key));
  });

  function updateParam(key) {
    const val = parseFloat(document.getElementById(`${key}-num`).value);
    if (isNaN(val)) return;
    const card = document.getElementById(`param-${key}`);
    const badgeEl = document.getElementById(`badge-${key}`);
    const adviceEl = document.getElementById(`advice-${key}`);
    const status = getStatus(key, val);
    card.className = `param-card ${status}`;
    badgeEl.className = `badge ${status}`;
    badgeEl.textContent = statusLabel(status);
    adviceEl.textContent = getAdvice(key, status, val);
    updateOverallStatus(keys);
  }

  keys.forEach(k => updateParam(k));
}

function updateOverallStatus(keys) {
  const statuses = keys.map(k => {
    const v = parseFloat(document.getElementById(`${k}-num`)?.value);
    return isNaN(v) ? 'safe' : getStatus(k, v);
  });
  const overall = statuses.includes('danger') ? 'danger' : statuses.includes('warn') ? 'warn' : 'safe';
  const el = document.getElementById('overall-status');
  if (!el) return;
  el.className = `overall-status ${overall}`;
  const msgs = {
    safe: '🟢 수질이 좋습니다! 토하가 건강하게 지내고 있어요.',
    warn: '🟡 일부 수치에 주의가 필요합니다.',
    danger: '🔴 위험한 수치가 있습니다. 즉시 조치하세요!'
  };
  el.querySelector('.os-text').textContent = msgs[overall];
}

function initWaterChange() {
  bindSlider('wc-vol-slider', 'wc-vol-num', calcWaterChange);
  bindSlider('wc-cur-slider', 'wc-cur-num', calcWaterChange);
  bindSlider('wc-target-slider', 'wc-target-num', calcWaterChange);
  calcWaterChange();
}

function calcWaterChange() {
  const vol    = parseFloat(document.getElementById('wc-vol-num').value) || 0;
  const curNO3 = parseFloat(document.getElementById('wc-cur-num').value) || 0;
  const tgtNO3 = parseFloat(document.getElementById('wc-target-num').value) || 5;

  if (curNO3 <= tgtNO3 || curNO3 === 0) {
    document.getElementById('wc-result-text').textContent = '현재 질산염이 목표치 이하입니다. 환수가 필요하지 않습니다.';
    document.getElementById('wc-pct').textContent = '0%';
    document.getElementById('wc-liters').textContent = '0 L';
    document.getElementById('wc-tank-before').style.height = '90%';
    document.getElementById('wc-tank-after').style.height = '90%';
    return;
  }

  const pct = Math.min(100, ((curNO3 - tgtNO3) / curNO3) * 100);
  const liters = (vol * pct / 100);
  document.getElementById('wc-pct').textContent = `${fmt(pct, 0)}%`;
  document.getElementById('wc-liters').textContent = `${fmt(liters, 1)} L`;
  document.getElementById('wc-result-text').textContent =
    `전체 수조 ${vol}L 중 ${fmt(liters, 1)}L(${fmt(pct, 0)}%)를 환수하면 질산염이 ${curNO3}ppm → ${fmt(tgtNO3, 0)}ppm으로 낮아집니다.`;

  const beforeH = 88;
  const afterH  = Math.max(20, beforeH * (1 - pct / 100));
  document.getElementById('wc-tank-before').style.height = `${beforeH}%`;
  document.getElementById('wc-tank-after').style.height  = `${afterH}%`;

  let freq = '주 1회 10-15%';
  if (curNO3 > 30) freq = '주 2회 20%씩';
  else if (curNO3 < 10) freq = '2주 1회 10%';
  document.getElementById('wc-freq').textContent = freq;
}

function initStocking() {
  bindSlider('tank-vol-slider', 'tank-vol-num', calcStocking);
  bindSlider('shrimp-cnt-slider', 'shrimp-cnt-num', calcFeeding);
  calcStocking();
  calcFeeding();
}

function calcStocking() {
  const vol = parseFloat(document.getElementById('tank-vol-num').value) || 0;
  const guide = SHRIMP_DATA.stockingGuide(vol);
  const filter = SHRIMP_DATA.filterFlow(vol);
  document.getElementById('stock-comfortable').textContent = `${guide.comfortable}마리`;
  document.getElementById('stock-recommended').textContent = `${guide.recommended}마리`;
  document.getElementById('stock-max').textContent         = `${guide.max}마리`;
  document.getElementById('filter-min').textContent        = `${filter.min} L/h`;
  document.getElementById('filter-rec').textContent        = `${filter.recommended} L/h`;
  const cntSlider = document.getElementById('shrimp-cnt-slider');
  if (cntSlider) cntSlider.max = Math.max(guide.max, parseInt(cntSlider.value || 0));
}

function calcFeeding() {
  const cnt  = parseInt(document.getElementById('shrimp-cnt-num').value) || 0;
  const feed = Math.max(1, Math.round(cnt / 5));
  document.getElementById('feed-amount').textContent = `하루 ${feed}정 (직경 5mm 펠렛 기준)`;
  document.getElementById('feed-times').textContent  = '하루 1-2회, 3시간 내 먹을 양만';
  const display = document.getElementById('shrimp-icon-display');
  if (!display) return;
  const show = Math.min(cnt, 50);
  display.innerHTML = Array(show).fill('<span class="shrimp-icon">🦐</span>').join('') +
    (cnt > 50 ? `<span style="font-size:0.75rem;color:var(--text-muted);padding:4px">+${cnt - 50}마리</span>` : '');
}

function initBreeding() {
  document.getElementById('berried-date').addEventListener('change', calcBreeding);
  bindSlider('breed-temp-slider', 'breed-temp-num', calcBreeding);
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('berried-date').value = today;
  calcBreeding();
}

function calcBreeding() {
  const dateVal = document.getElementById('berried-date').value;
  const temp    = parseFloat(document.getElementById('breed-temp-num').value) || 20;
  if (!dateVal) return;

  const startDate = new Date(dateVal);
  const days      = SHRIMP_DATA.gestationDays(temp);
  const hatchDate = addDays(startDate, days);
  const today     = new Date(); today.setHours(0, 0, 0, 0);
  const elapsed   = Math.max(0, Math.floor((today - startDate) / 86400000));
  const remaining = Math.max(0, days - elapsed);
  const progress  = Math.min(100, (elapsed / days) * 100);

  document.getElementById('hatch-date-text').textContent = formatDate(hatchDate);
  document.getElementById('remaining-days').textContent  = remaining;
  document.getElementById('elapsed-days').textContent    = `${elapsed}일 경과 / 총 ${days}일`;
  document.getElementById('breed-progress').style.width  = `${progress}%`;

  const statusEl = document.getElementById('breed-status');
  if (remaining === 0 && elapsed >= days) {
    statusEl.textContent = '🎉 부화 시기가 됐어요! 치새우를 확인해보세요.';
    statusEl.className   = 'badge safe';
  } else if (remaining <= 3 && remaining > 0) {
    statusEl.textContent = `⏰ 곧 부화합니다! (${remaining}일 남음)`;
    statusEl.className   = 'badge warn';
  } else if (elapsed === 0) {
    statusEl.textContent = '🫧 포란 시작! 잘 돌봐주세요.';
    statusEl.className   = 'badge info';
  } else {
    statusEl.textContent = `🥚 포란 중 (${remaining}일 남음)`;
    statusEl.className   = 'badge info';
  }
}

function initTankVolume() {
  const shapeBtns = document.querySelectorAll('.shape-btn');
  shapeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      shapeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const isRect = btn.dataset.shape === 'rect';
      document.getElementById('rect-inputs').style.display = isRect ? 'block' : 'none';
      document.getElementById('cyl-inputs').style.display  = isRect ? 'none' : 'block';
      calcTankVolume();
    });
  });
  ['tank-w', 'tank-d', 'tank-h', 'tank-r', 'tank-h2'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calcTankVolume);
  });
  calcTankVolume();
}

function calcTankVolume() {
  const activeShape = document.querySelector('.shape-btn.active')?.dataset.shape || 'rect';
  let totalL;
  if (activeShape === 'rect') {
    const w = parseFloat(document.getElementById('tank-w').value) || 0;
    const d = parseFloat(document.getElementById('tank-d').value) || 0;
    const h = parseFloat(document.getElementById('tank-h').value) || 0;
    totalL = (w * d * h) / 1000;
  } else {
    const r = parseFloat(document.getElementById('tank-r').value) || 0;
    const h = parseFloat(document.getElementById('tank-h2').value) || 0;
    totalL = (Math.PI * r * r * h) / 1000;
  }
  const usableL = totalL * 0.85;
  document.getElementById('tank-total-l').textContent   = `${fmt(totalL, 1)} L`;
  document.getElementById('tank-usable-l').textContent  = `${fmt(usableL, 1)} L`;
  document.getElementById('tank-total-gal').textContent = `${fmt(totalL / 3.785, 2)} 갤런`;
  const guide = SHRIMP_DATA.stockingGuide(usableL);
  document.getElementById('tank-stock-rec').textContent = `권장 ${guide.recommended}마리 (최대 ${guide.max}마리)`;
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initHome();
  initWaterQuality();
  initWaterChange();
  initStocking();
  initBreeding();
  initTankVolume();
});
