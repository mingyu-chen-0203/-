const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const DAY_LABEL = {
  Mon: "一",
  Tue: "二",
  Wed: "三",
  Thu: "四",
  Fri: "五"
};
const COURSE_TYPE_LABEL = {
  required: "必修",
  elective: "選修"
};
const ROLE_LABEL = {
  teacher: "老師",
  student: "學生"
};
const STORAGE_KEY = "ine_scheduler_v1";
const AUTH_STORAGE_KEY = "ine_scheduler_user_v1";
const TEACHER_FILL_PREFIX = "ine_teacher_fill_";
const TEACHER_SYLLABUS_PREFIX = "ine_teacher_syllabus_";
const TEACHER_MONITOR_PREFIX = "ine_teacher_monitor_";
const STUDENT_CART_PREFIX = "ine_student_cart_";
const START_HOUR = 8;
const END_HOUR = 20;
const PERIOD_MINUTES = 60;
const TEACHER_MAX_CONSECUTIVE_PERIODS = 3;
const BLOCK_PERIODS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const FRIDAY_AFTERNOON = [7, 8, 9, 10];
const MOCK_STUDENTS = [
  { id: "D1124182001", name: "林冠宇", dept: "資網三A" },
  { id: "D1124182012", name: "陳思妤", dept: "資網三A" },
  { id: "D1124182028", name: "王柏鈞", dept: "資網三B" },
  { id: "D1124182036", name: "張芷晴", dept: "資網三B" }
];
const STUDENT_COURSE_POOL = [
  {
    id: "GEH101",
    name: "人文思辨",
    teacher: "林美君",
    category: "通識-人文",
    day: "Mon",
    period: 3,
    credits: 2,
    capacity: 80,
    selected: 77,
    syllabusUrl: "#"
  },
  {
    id: "GEN220",
    name: "自然科學概論",
    teacher: "王志明",
    category: "通識-自然",
    day: "Wed",
    period: 5,
    credits: 2,
    capacity: 80,
    selected: 64,
    syllabusUrl: "#"
  },
  {
    id: "SOC130",
    name: "社會觀察",
    teacher: "陳怡安",
    category: "通識-社會",
    day: "Wed",
    period: 6,
    credits: 2,
    capacity: 80,
    selected: 79,
    syllabusUrl: "#"
  },
  {
    id: "PE201",
    name: "羽球進階",
    teacher: "張育誠",
    category: "體育",
    day: "Fri",
    period: 7,
    credits: 1,
    capacity: 40,
    selected: 38,
    syllabusUrl: "#"
  },
  {
    id: "INE402",
    name: "雲端網路架構",
    teacher: "謝承翰",
    category: "專業",
    day: "Thu",
    period: 4,
    credits: 3,
    capacity: 60,
    selected: 45,
    syllabusUrl: "#"
  }
];
const USER_CREDENTIALS = [
  // 老師帳號
  { username: "T001", password: "Wang@2025",   name: "王大明",   dept: "資訊工程學系", role: "teacher" },
  { username: "T002", password: "Lee@2025",    name: "李雅婷",   dept: "資訊工程學系", role: "teacher" },
  { username: "T003", password: "Chen@2025",   name: "陳志豪",   dept: "電機工程學系", role: "teacher" },
  { username: "T004", password: "Lin@2025",    name: "林淑芬",   dept: "電機工程學系", role: "teacher" },
  { username: "T005", password: "Huang@2025",  name: "黃建國",   dept: "資訊管理學系", role: "teacher" },
  // 學生帳號
  { username: "D1124182001", password: "Stu@001", name: "張小明", dept: "資訊工程學系 一年級", role: "student" },
  { username: "D1124182002", password: "Stu@002", name: "林美華", dept: "資訊工程學系 一年級", role: "student" },
  { username: "D1124182003", password: "Stu@003", name: "陳俊傑", dept: "資訊工程學系 一年級", role: "student" },
  { username: "D1124182004", password: "Stu@004", name: "王雅琪", dept: "電機工程學系 一年級", role: "student" },
  { username: "D1124182005", password: "Stu@005", name: "李志遠", dept: "電機工程學系 一年級", role: "student" },
  { username: "D1124182006", password: "Stu@006", name: "黃淑娟", dept: "資訊管理學系 一年級", role: "student" },
  { username: "D1124182007", password: "Stu@007", name: "吳建宏", dept: "資訊管理學系 一年級", role: "student" },
  { username: "D1124182008", password: "Q224620840", name: "陳明玉", dept: "資訊工程學系 三年級", role: "student" },
  { username: "D1124182009", password: "Stu@009", name: "蔡明哲", dept: "資訊工程學系 二年級", role: "student" },
  { username: "D1124182010", password: "Stu@010", name: "鄭佳玲", dept: "電機工程學系 二年級", role: "student" },
];

const state = {
  courses: [],
  editingId: null,
  currentUser: null,
  captchaCode: "",
  teacherFill: null,
  teacherSyllabus: null,
  teacherMonitor: null,
  activeTeacherPhase: "fill",
  studentCart: []
};

const dom = {
  loginView: document.getElementById("loginView"),
  appShell: document.getElementById("appShell"),
  loginForm: document.getElementById("loginForm"),
  roleButtons: document.getElementById("roleButtons"),
  captchaText: document.getElementById("captchaText"),
  captchaRefreshBtn: document.getElementById("captchaRefreshBtn"),
  logoutBtn: document.getElementById("logoutBtn"),
  userBadge: document.getElementById("userBadge"),
  teacherPortal: document.getElementById("teacherPortal"),
  teacherPhaseNav: document.getElementById("teacherPhaseNav"),
  teacherWarnText: document.getElementById("teacherWarnText"),
  phaseFill: document.getElementById("phaseFill"),
  phaseManage: document.getElementById("phaseManage"),
  phaseMonitor: document.getElementById("phaseMonitor"),
  schedulerSections: document.getElementById("schedulerSections"),
  willingForm: document.getElementById("willingForm"),
  fillStageStatus: document.getElementById("fillStageStatus"),
  blockGrid: document.getElementById("blockGrid"),
  syllabusForm: document.getElementById("syllabusForm"),
  syllabusWeekBody: document.getElementById("syllabusWeekBody"),
  gradeFormulaText: document.getElementById("gradeFormulaText"),
  selectedCountInput: document.getElementById("selectedCountInput"),
  capacityInput: document.getElementById("capacityInput"),
  quotaText: document.getElementById("quotaText"),
  studentListBody: document.getElementById("studentListBody"),
  generateAuthCodeBtn: document.getElementById("generateAuthCodeBtn"),
  authCodeText: document.getElementById("authCodeText"),
  studentPortal: document.getElementById("studentPortal"),
  studentNoticeText: document.getElementById("studentNoticeText"),
  phase1Countdown: document.getElementById("phase1Countdown"),
  phase2Countdown: document.getElementById("phase2Countdown"),
  addDropCountdown: document.getElementById("addDropCountdown"),
  lotteryRate: document.getElementById("lotteryRate"),
  creditProgressText: document.getElementById("creditProgressText"),
  creditBar: document.getElementById("creditBar"),
  studentKeyword: document.getElementById("studentKeyword"),
  studentCategory: document.getElementById("studentCategory"),
  studentSlot: document.getElementById("studentSlot"),
  studentSearchBody: document.getElementById("studentSearchBody"),
  studentCartWarn: document.getElementById("studentCartWarn"),
  studentCartBody: document.getElementById("studentCartBody"),
  studentTimetable: document.getElementById("studentTimetable"),
  form: document.getElementById("courseForm"),
  submitBtn: document.getElementById("submitBtn"),
  resetBtn: document.getElementById("resetBtn"),
  seedBtn: document.getElementById("seedBtn"),
  clearBtn: document.getElementById("clearBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importInput: document.getElementById("importInput"),
  courseTableBody: document.getElementById("courseTableBody"),
  timetable: document.getElementById("timetable"),
  stats: document.getElementById("stats"),
  statTemplate: document.getElementById("statTemplate")
};

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function generateCaptcha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function formatRemaining(target) {
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return "已開始";
  const totalSec = Math.floor(diff / 1000);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function getStudentStorageKey(prefix) {
  if (!state.currentUser || state.currentUser.role !== "student") return "";
  return `${prefix}${state.currentUser.username}`;
}

function loadStudentData() {
  state.studentCart = [];
  const key = getStudentStorageKey(STUDENT_CART_PREFIX);
  if (!key) return;
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) state.studentCart = parsed;
    }
  } catch {
    console.warn("學生購物車資料解析失敗");
  }
}

function saveStudentData() {
  const key = getStudentStorageKey(STUDENT_CART_PREFIX);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(state.studentCart));
}

function courseTimeText(course) {
  return `週${DAY_LABEL[course.day]} 第${course.period}節`;
}

function getFilteredCourses() {
  const keyword = dom.studentKeyword.value.trim().toLowerCase();
  const category = dom.studentCategory.value;
  const slot = dom.studentSlot.value;

  return STUDENT_COURSE_POOL.filter((course) => {
    const keywordOk =
      !keyword || course.name.toLowerCase().includes(keyword) || course.teacher.toLowerCase().includes(keyword);
    const categoryOk = category === "all" || course.category === category;
    const slotOk =
      slot === "all" ||
      (() => {
        const [day, periodText] = slot.split("-");
        return course.day === day && course.period === Number(periodText);
      })();
    return keywordOk && categoryOk && slotOk;
  });
}

function renderStudentSearch() {
  const list = getFilteredCourses();
  dom.studentSearchBody.textContent = "";
  if (!list.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="7">查無符合課程</td>';
    dom.studentSearchBody.appendChild(tr);
    return;
  }

  for (const course of list) {
    const remain = Math.max(course.capacity - course.selected, 0);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${course.id} ${course.name}</td>
      <td>${course.teacher}</td>
      <td>${course.category}</td>
      <td>${courseTimeText(course)}</td>
      <td>${remain}/${course.capacity}</td>
      <td><a href="${course.syllabusUrl}" target="_blank">課綱/評價</a></td>
      <td><button type="button" class="btn btn-ghost" data-action="add-cart" data-id="${course.id}">加入追蹤</button></td>
    `;
    dom.studentSearchBody.appendChild(tr);
  }
}

function isCartConflict(target) {
  return state.studentCart.find((item) => item.day === target.day && item.period === target.period);
}

function addCourseToCart(courseId) {
  const target = STUDENT_COURSE_POOL.find((c) => c.id === courseId);
  if (!target) return;
  if (state.studentCart.some((item) => item.id === target.id)) {
    dom.studentCartWarn.textContent = "此課程已在追蹤清單中";
    return;
  }

  const conflict = isCartConflict(target);
  if (conflict) {
    dom.studentCartWarn.textContent = `課程衝堂，請擇一選擇：${target.name} 與 ${conflict.name}`;
    dom.studentCartWarn.classList.add("error");
    return;
  }

  state.studentCart.push({ ...target });
  dom.studentCartWarn.textContent = "已加入追蹤清單";
  dom.studentCartWarn.classList.remove("error");
  saveStudentData();
  renderStudentCart();
  renderStudentDashboard();
  renderStudentTimetable();
}

function moveCartItem(index, offset) {
  const next = index + offset;
  if (next < 0 || next >= state.studentCart.length) return;
  const clone = [...state.studentCart];
  const [item] = clone.splice(index, 1);
  clone.splice(next, 0, item);
  state.studentCart = clone;
  saveStudentData();
  renderStudentCart();
}

function removeCartItem(index) {
  state.studentCart.splice(index, 1);
  saveStudentData();
  renderStudentCart();
  renderStudentDashboard();
  renderStudentTimetable();
}

function renderStudentCart() {
  dom.studentCartBody.textContent = "";
  if (!state.studentCart.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="5">目前購物車是空的</td>';
    dom.studentCartBody.appendChild(tr);
    return;
  }

  state.studentCart.forEach((course, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>第 ${index + 1} 志願</td>
      <td>${course.id} ${course.name}</td>
      <td>${courseTimeText(course)}</td>
      <td>${course.credits}</td>
      <td>
        <div class="row-actions">
          <button type="button" class="btn btn-ghost" data-action="up" data-index="${index}">上移</button>
          <button type="button" class="btn btn-ghost" data-action="down" data-index="${index}">下移</button>
          <button type="button" class="btn btn-danger" data-action="remove" data-index="${index}">移除</button>
        </div>
      </td>
    `;
    dom.studentCartBody.appendChild(tr);
  });
}

function renderStudentTimetable() {
  dom.studentTimetable.textContent = "";

  const corner = document.createElement("div");
  corner.className = "student-slot head";
  corner.textContent = "節次";
  dom.studentTimetable.appendChild(corner);

  for (const day of DAY_ORDER) {
    const head = document.createElement("div");
    head.className = "student-slot head";
    head.textContent = `週${DAY_LABEL[day]}`;
    dom.studentTimetable.appendChild(head);
  }

  for (let period = 1; period <= 10; period += 1) {
    const time = document.createElement("div");
    time.className = "student-slot time";
    time.textContent = `第${period}節`;
    dom.studentTimetable.appendChild(time);

    for (const day of DAY_ORDER) {
      const slot = document.createElement("div");
      slot.className = "student-slot";
      const found = state.studentCart.find((c) => c.day === day && c.period === period);
      slot.innerHTML = found ? `<div class="student-chip">${found.id}<br/>${found.name}</div>` : "";
      dom.studentTimetable.appendChild(slot);
    }
  }
}

function renderStudentDashboard() {
  const phase1 = new Date("2026-03-20T10:00:00");
  const phase2 = new Date("2026-03-27T10:00:00");
  const addDrop = new Date("2026-04-03T10:00:00");
  dom.phase1Countdown.textContent = formatRemaining(phase1);
  dom.phase2Countdown.textContent = formatRemaining(phase2);
  dom.addDropCountdown.textContent = formatRemaining(addDrop);

  const firstWish = state.studentCart[0];
  if (firstWish) {
    const remain = Math.max(firstWish.capacity - firstWish.selected, 0);
    dom.lotteryRate.textContent = `${remain}/${firstWish.capacity}`;
  } else {
    dom.lotteryRate.textContent = "0/0";
  }

  const credits = state.studentCart.reduce((sum, c) => sum + Number(c.credits || 0), 0);
  const goal = 25;
  dom.creditProgressText.textContent = `學分進度：${credits} / ${goal}`;
  const ratio = Math.min((credits / goal) * 100, 100);
  dom.creditBar.style.width = `${ratio}%`;
}

function setupStudentPortal() {
  loadStudentData();
  renderStudentSearch();
  renderStudentCart();
  renderStudentTimetable();
  renderStudentDashboard();
}

function refreshCaptcha() {
  state.captchaCode = generateCaptcha();
  dom.captchaText.textContent = state.captchaCode;
}

function isCaptchaValid(input) {
  return input.trim().toUpperCase() === state.captchaCode;
}

function defaultTeacherFill() {
  return {
    courseName: "",
    courseCode: "",
    roomNeed: "none",
    coTeacher: "",
    ratioA: 100,
    ratioB: 0,
    blockedSlots: []
  };
}

function defaultTeacherSyllabus() {
  return {
    weekTopics: Array.from({ length: 18 }, () => ""),
    capabilities: [],
    finalRatio: 40,
    midtermRatio: 30,
    attendanceRatio: 30
  };
}

function defaultTeacherMonitor() {
  return {
    selectedCount: 52,
    capacity: 60,
    authCode: ""
  };
}

function getTeacherStorageKey(prefix) {
  if (!state.currentUser || state.currentUser.role !== "teacher") return "";
  return `${prefix}${state.currentUser.username}`;
}

function maxConsecutivePeriods(periods) {
  if (!periods.length) return 0;
  const sorted = [...periods].sort((a, b) => a - b);
  let best = 1;
  let streak = 1;
  for (let i = 1; i < sorted.length; i += 1) {
    if (sorted[i] === sorted[i - 1] + 1) {
      streak += 1;
      best = Math.max(best, streak);
    } else {
      streak = 1;
    }
  }
  return best;
}

function validateBlockedRules(blockedSlots) {
  for (const day of DAY_ORDER) {
    const dayPeriods = blockedSlots
      .filter((slot) => slot.day === day)
      .map((slot) => Number(slot.period));

    if (dayPeriods.length > 4) {
      return `週${DAY_LABEL[day]} 擋排超過 4 個時段`;
    }
    if (maxConsecutivePeriods(dayPeriods) >= 6) {
      return `週${DAY_LABEL[day]} 擋排不可連續 6 節`;
    }
  }

  const fridayBlocked = blockedSlots
    .filter((slot) => slot.day === "Fri")
    .map((slot) => Number(slot.period));
  const isFridayAfternoonAllBlocked = FRIDAY_AFTERNOON.every((p) => fridayBlocked.includes(p));
  if (isFridayAfternoonAllBlocked) {
    return "週五下午不可全部擋排";
  }

  return "";
}

function loadTeacherPortalData() {
  state.teacherFill = defaultTeacherFill();
  state.teacherSyllabus = defaultTeacherSyllabus();
  state.teacherMonitor = defaultTeacherMonitor();

  const fillKey = getTeacherStorageKey(TEACHER_FILL_PREFIX);
  const syllabusKey = getTeacherStorageKey(TEACHER_SYLLABUS_PREFIX);
  const monitorKey = getTeacherStorageKey(TEACHER_MONITOR_PREFIX);

  try {
    if (fillKey) {
      const raw = localStorage.getItem(fillKey);
      if (raw) state.teacherFill = { ...state.teacherFill, ...JSON.parse(raw) };
    }
  } catch {
    console.warn("填報資料解析失敗");
  }

  try {
    if (syllabusKey) {
      const raw = localStorage.getItem(syllabusKey);
      if (raw) state.teacherSyllabus = { ...state.teacherSyllabus, ...JSON.parse(raw) };
    }
  } catch {
    console.warn("課綱資料解析失敗");
  }

  try {
    if (monitorKey) {
      const raw = localStorage.getItem(monitorKey);
      if (raw) state.teacherMonitor = { ...state.teacherMonitor, ...JSON.parse(raw) };
    }
  } catch {
    console.warn("監控資料解析失敗");
  }
}

function saveTeacherPortalData(prefix, payload) {
  const key = getTeacherStorageKey(prefix);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(payload));
}

function setTeacherWarning(text, isError = false) {
  dom.teacherWarnText.textContent = text;
  dom.teacherWarnText.classList.toggle("error", isError);
}

function renderBlockGrid() {
  dom.blockGrid.textContent = "";
  const blockedSet = new Set((state.teacherFill?.blockedSlots || []).map((s) => `${s.day}_${s.period}`));

  const corner = document.createElement("div");
  corner.className = "block-cell head";
  corner.textContent = "節次";
  dom.blockGrid.appendChild(corner);

  for (const day of DAY_ORDER) {
    const dayHead = document.createElement("div");
    dayHead.className = "block-cell head";
    dayHead.textContent = `週${DAY_LABEL[day]}`;
    dom.blockGrid.appendChild(dayHead);
  }

  for (const period of BLOCK_PERIODS) {
    const rowHead = document.createElement("div");
    rowHead.className = "block-cell row-head";
    rowHead.textContent = `第${period}節`;
    dom.blockGrid.appendChild(rowHead);

    for (const day of DAY_ORDER) {
      const key = `${day}_${period}`;
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `block-cell slot${blockedSet.has(key) ? " blocked" : ""}`;
      cell.dataset.day = day;
      cell.dataset.period = String(period);
      cell.textContent = blockedSet.has(key) ? "擋排" : "";
      dom.blockGrid.appendChild(cell);
    }
  }
}

function toggleBlockedSlot(day, period) {
  const list = state.teacherFill.blockedSlots || [];
  const index = list.findIndex((slot) => slot.day === day && slot.period === period);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push({ day, period });
  }
  state.teacherFill.blockedSlots = list;
  const warning = validateBlockedRules(state.teacherFill.blockedSlots);
  dom.fillStageStatus.textContent = warning || "已更新擋排設定";
  dom.fillStageStatus.classList.toggle("error", Boolean(warning));
  renderBlockGrid();
}

function renderSyllabusWeeks() {
  dom.syllabusWeekBody.textContent = "";
  const topics = state.teacherSyllabus.weekTopics || [];
  for (let week = 1; week <= 18; week += 1) {
    const tr = document.createElement("tr");
    const topic = topics[week - 1] || "";
    tr.innerHTML = `
      <td>第 ${week} 週</td>
      <td><input data-week="${week}" class="week-topic-input" value="${topic}" placeholder="請填寫本週教學主題" /></td>
    `;
    dom.syllabusWeekBody.appendChild(tr);
  }
}

function renderGradeFormula() {
  const finalRatio = Number(dom.syllabusForm.elements.finalRatio.value || 0);
  const midtermRatio = Number(dom.syllabusForm.elements.midtermRatio.value || 0);
  const attendanceRatio = Number(dom.syllabusForm.elements.attendanceRatio.value || 0);
  dom.gradeFormulaText.textContent = `Final = ${finalRatio}% + Midterm = ${midtermRatio}% + Attendance = ${attendanceRatio}%`;
}

function renderMonitorBoard() {
  dom.selectedCountInput.value = String(state.teacherMonitor.selectedCount);
  dom.capacityInput.value = String(state.teacherMonitor.capacity);
  dom.quotaText.textContent = `已選人數 / 課容量：${state.teacherMonitor.selectedCount} / ${state.teacherMonitor.capacity}`;
  dom.authCodeText.textContent = state.teacherMonitor.authCode || "尚未產生授權碼";

  dom.studentListBody.textContent = "";
  for (const student of MOCK_STUDENTS) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="avatar-chip">${student.name.slice(0, 1)}</span></td>
      <td>${student.id}</td>
      <td>${student.name}</td>
      <td>${student.dept}</td>
    `;
    dom.studentListBody.appendChild(tr);
  }
}

function fillTeacherPortalForms() {
  const fill = state.teacherFill || defaultTeacherFill();
  const syllabus = state.teacherSyllabus || defaultTeacherSyllabus();

  dom.willingForm.elements.courseName.value = String(fill.courseName || "");
  dom.willingForm.elements.courseCode.value = String(fill.courseCode || "");
  dom.willingForm.elements.roomNeed.value = String(fill.roomNeed || "none");
  dom.willingForm.elements.coTeacher.value = String(fill.coTeacher || "");
  dom.willingForm.elements.ratioA.value = String(fill.ratioA ?? 100);
  dom.willingForm.elements.ratioB.value = String(fill.ratioB ?? 0);

  renderBlockGrid();
  dom.fillStageStatus.textContent = "填報中";
  dom.fillStageStatus.classList.remove("error");

  renderSyllabusWeeks();
  const selectedCaps = new Set(syllabus.capabilities || []);
  const capChecks = dom.syllabusForm.querySelectorAll('input[name="capability"]');
  for (const check of capChecks) {
    check.checked = selectedCaps.has(check.value);
  }
  dom.syllabusForm.elements.finalRatio.value = String(syllabus.finalRatio ?? 40);
  dom.syllabusForm.elements.midtermRatio.value = String(syllabus.midtermRatio ?? 30);
  dom.syllabusForm.elements.attendanceRatio.value = String(syllabus.attendanceRatio ?? 30);
  renderGradeFormula();

  renderMonitorBoard();
}

function setTeacherPhase(phase) {
  state.activeTeacherPhase = ["fill", "manage", "monitor"].includes(phase) ? phase : "fill";
  dom.phaseFill.hidden = state.activeTeacherPhase !== "fill";
  dom.phaseManage.hidden = state.activeTeacherPhase !== "manage";
  dom.phaseMonitor.hidden = state.activeTeacherPhase !== "monitor";

  const items = dom.teacherPhaseNav.querySelectorAll(".tree-item");
  for (const item of items) {
    if (item.dataset.phase) {
      item.classList.toggle("active", item.dataset.phase === state.activeTeacherPhase);
    }
  }
}

function saveFillStage() {
  const data = new FormData(dom.willingForm);
  const ratioA = Number(data.get("ratioA") || 0);
  const ratioB = Number(data.get("ratioB") || 0);
  const coTeacher = String(data.get("coTeacher") || "").trim();

  if (!String(data.get("courseName") || "").trim() || !String(data.get("courseCode") || "").trim()) {
    alert("請填寫課程名稱與課程代碼");
    return;
  }

  if (coTeacher) {
    if (ratioA + ratioB !== 100 || ratioA <= 0 || ratioB <= 0) {
      alert("合授比例需為 A+B=100 且雙方皆大於 0");
      return;
    }
  } else if (ratioA !== 100 || ratioB !== 0) {
    alert("未填合授老師時，比例需為 A=100、B=0");
    return;
  }

  const blockedSlots = state.teacherFill.blockedSlots || [];
  const warning = validateBlockedRules(blockedSlots);
  if (warning) {
    dom.fillStageStatus.textContent = warning;
    dom.fillStageStatus.classList.add("error");
    alert(`儲存失敗：${warning}`);
    return;
  }

  state.teacherFill = {
    courseName: String(data.get("courseName") || "").trim(),
    courseCode: String(data.get("courseCode") || "").trim(),
    roomNeed: String(data.get("roomNeed") || "none"),
    coTeacher,
    ratioA,
    ratioB,
    blockedSlots
  };

  saveTeacherPortalData(TEACHER_FILL_PREFIX, state.teacherFill);
  dom.fillStageStatus.textContent = "填報資料已儲存";
  dom.fillStageStatus.classList.remove("error");
  setTeacherWarning("填報資料已更新，請於截止日前再次確認。", false);
}

function saveSyllabusStage() {
  const weekInputs = dom.syllabusWeekBody.querySelectorAll(".week-topic-input");
  const weekTopics = Array.from(weekInputs).map((input) => input.value.trim());
  const selectedCaps = Array.from(dom.syllabusForm.querySelectorAll('input[name="capability"]:checked')).map(
    (item) => item.value
  );
  const finalRatio = Number(dom.syllabusForm.elements.finalRatio.value || 0);
  const midtermRatio = Number(dom.syllabusForm.elements.midtermRatio.value || 0);
  const attendanceRatio = Number(dom.syllabusForm.elements.attendanceRatio.value || 0);
  const total = finalRatio + midtermRatio + attendanceRatio;

  if (!weekTopics[0]) {
    alert("請至少填寫第 1 週教學主題");
    return;
  }
  if (!selectedCaps.length) {
    alert("請至少勾選一項核心能力");
    return;
  }
  if (total !== 100) {
    alert("成績配比總和需為 100%");
    return;
  }

  state.teacherSyllabus = {
    weekTopics,
    capabilities: selectedCaps,
    finalRatio,
    midtermRatio,
    attendanceRatio
  };
  saveTeacherPortalData(TEACHER_SYLLABUS_PREFIX, state.teacherSyllabus);
  renderGradeFormula();
  setTeacherWarning("課綱與成績配比已儲存。", false);
}

function saveMonitorStage() {
  const selectedCount = Number(dom.selectedCountInput.value || 0);
  const capacity = Number(dom.capacityInput.value || 1);
  state.teacherMonitor.selectedCount = selectedCount;
  state.teacherMonitor.capacity = capacity;
  saveTeacherPortalData(TEACHER_MONITOR_PREFIX, state.teacherMonitor);
  renderMonitorBoard();
}

function generateAuthCode() {
  const code = Math.random().toString().slice(2, 10);
  state.teacherMonitor.authCode = code;
  saveTeacherPortalData(TEACHER_MONITOR_PREFIX, state.teacherMonitor);
  dom.authCodeText.textContent = `授權碼：${code}`;
}

function toMinutes(timeText) {
  const [hour, minute] = timeText.split(":").map(Number);
  return hour * 60 + minute;
}

function toTimeText(minutes) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function sortCourses(list) {
  return [...list].sort((a, b) => {
    const dayCompare = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
    if (dayCompare !== 0) return dayCompare;
    return toMinutes(a.start) - toMinutes(b.start);
  });
}

function validateCourse(course) {
  if (!course.code || !course.name || !course.teacher || !course.room) {
    return "請完整填寫課程資訊";
  }
  if (!Object.keys(COURSE_TYPE_LABEL).includes(course.type)) {
    return "課程類型必須為必修或選修";
  }
  if (toMinutes(course.end) <= toMinutes(course.start)) {
    return "結束時間必須晚於開始時間";
  }
  return "";
}

function checkConflict(target, ignoreId = null, baseList = state.courses) {
  return baseList.find((course) => {
    if (course.id === ignoreId) return false;
    if (course.day !== target.day) return false;

    const s1 = toMinutes(course.start);
    const e1 = toMinutes(course.end);
    const s2 = toMinutes(target.start);
    const e2 = toMinutes(target.end);

    return s1 < e2 && s2 < e1;
  });
}

function checkTeacherConsecutiveLimit(target, ignoreId = null, baseList = state.courses) {
  const sameTeacherDay = baseList
    .filter((course) => {
      if (course.id === ignoreId) return false;
      return course.day === target.day && course.teacher === target.teacher;
    })
    .map((course) => ({ start: toMinutes(course.start), end: toMinutes(course.end) }));

  sameTeacherDay.push({ start: toMinutes(target.start), end: toMinutes(target.end) });
  sameTeacherDay.sort((a, b) => a.start - b.start);

  const merged = [];
  for (const slot of sameTeacherDay) {
    const last = merged[merged.length - 1];
    if (!last || slot.start > last.end) {
      merged.push({ ...slot });
      continue;
    }
    last.end = Math.max(last.end, slot.end);
  }

  const limitMinutes = (TEACHER_MAX_CONSECUTIVE_PERIODS + 1) * PERIOD_MINUTES;
  const violation = merged.find((slot) => slot.end - slot.start >= limitMinutes);
  if (!violation) return null;

  return {
    start: toTimeText(violation.start),
    end: toTimeText(violation.end)
  };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.courses));
}

function saveAuth() {
  if (!state.currentUser) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state.currentUser));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      state.courses = parsed;
    }
  } catch {
    console.warn("課程資料解析失敗");
  }
}

function loadAuth() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.username === "string" &&
      typeof parsed.name === "string" &&
      Object.keys(ROLE_LABEL).includes(parsed.role)
    ) {
      state.currentUser = parsed;
    }
  } catch {
    console.warn("登入資料解析失敗");
  }
}

function setRoleButtons(role) {
  const selectedRole = Object.keys(ROLE_LABEL).includes(role) ? role : "teacher";
  dom.loginForm.elements.role.value = selectedRole;
  const buttons = dom.roleButtons.querySelectorAll(".role-btn");
  for (const btn of buttons) {
    btn.classList.toggle("active", btn.dataset.role === selectedRole);
  }
}

function setViewByAuth() {
  const isLogin = Boolean(state.currentUser);
  dom.loginView.hidden = isLogin;
  dom.appShell.hidden = !isLogin;
  const roleText = isLogin ? ROLE_LABEL[state.currentUser.role] || "使用者" : "";
  dom.userBadge.textContent = isLogin
    ? `目前登入：${roleText} ${state.currentUser.name}（${state.currentUser.username}）${state.currentUser.dept ? ` ／ ${state.currentUser.dept}` : ""}`
    : "";

  const isTeacher = isLogin && state.currentUser.role === "teacher";
  const isStudent = isLogin && state.currentUser.role === "student";
  dom.teacherPortal.hidden = !isTeacher;
  dom.studentPortal.hidden = !isStudent;
  dom.schedulerSections.hidden = isTeacher || isStudent;

  if (isTeacher) {
    loadTeacherPortalData();
    fillTeacherPortalForms();
    setTeacherPhase(state.activeTeacherPhase);
    setTeacherWarning("請於 3/20 前完成本學期填報，違反排課上限會阻擋存檔。", true);
  }

  if (isStudent) {
    setupStudentPortal();
    dom.studentNoticeText.textContent = "系統公告：請在時限內完成志願序提交。";
  }
}

function login(username, password, role) {
  const selectedRole = Object.keys(ROLE_LABEL).includes(role) ? role : "teacher";
  const matched = USER_CREDENTIALS.find(
    (account) =>
      account.username === username && account.password === password && account.role === selectedRole
  );
  if (!matched) return false;

  state.currentUser = { username: matched.username, name: matched.name, role: matched.role, dept: matched.dept || "" };
  saveAuth();
  setViewByAuth();
  return true;
}

function logout() {
  state.currentUser = null;
  saveAuth();
  setViewByAuth();
  dom.loginForm.reset();
  setRoleButtons("teacher");
  refreshCaptcha();
}

function resetForm() {
  state.editingId = null;
  dom.form.reset();
  dom.form.elements.credits.value = "3";
  dom.form.elements.type.value = "required";
  dom.form.elements.day.value = "Mon";
  dom.form.elements.start.value = "09:00";
  dom.form.elements.end.value = "12:00";
  dom.submitBtn.textContent = "新增課程";
}

function readForm() {
  const formData = new FormData(dom.form);
  return {
    code: String(formData.get("code") || "").trim(),
    name: String(formData.get("name") || "").trim(),
    teacher: String(formData.get("teacher") || "").trim(),
    credits: Number(formData.get("credits") || 3),
    type: String(formData.get("type") || "required"),
    day: String(formData.get("day") || "Mon"),
    start: String(formData.get("start") || "09:00"),
    end: String(formData.get("end") || "12:00"),
    room: String(formData.get("room") || "").trim()
  };
}

function fillForm(course) {
  dom.form.elements.code.value = course.code;
  dom.form.elements.name.value = course.name;
  dom.form.elements.teacher.value = course.teacher;
  dom.form.elements.credits.value = String(course.credits);
  dom.form.elements.type.value =
    Object.keys(COURSE_TYPE_LABEL).includes(course.type) ? course.type : "required";
  dom.form.elements.day.value = course.day;
  dom.form.elements.start.value = course.start;
  dom.form.elements.end.value = course.end;
  dom.form.elements.room.value = course.room;
}

function statData() {
  const totalCredits = state.courses.reduce((sum, c) => sum + c.credits, 0);
  const teachers = new Set(state.courses.map((c) => c.teacher)).size;
  const rooms = new Set(state.courses.map((c) => c.room)).size;

  return [
    { label: "課程數量", value: String(state.courses.length) },
    { label: "總學分", value: String(totalCredits) },
    { label: "教師人數", value: String(teachers) },
    { label: "使用教室", value: String(rooms) }
  ];
}

function renderStats() {
  dom.stats.textContent = "";
  for (const item of statData()) {
    const node = dom.statTemplate.content.cloneNode(true);
    node.querySelector(".label").textContent = item.label;
    node.querySelector(".value").textContent = item.value;
    dom.stats.appendChild(node);
  }
}

function renderTable() {
  const sorted = sortCourses(state.courses);
  dom.courseTableBody.textContent = "";

  if (!sorted.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = '<td colspan="8">目前沒有課程，請先新增。</td>';
    dom.courseTableBody.appendChild(tr);
    return;
  }

  for (const course of sorted) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${course.code}</td>
      <td>${course.name}</td>
      <td>${course.teacher}</td>
      <td>${course.credits}</td>
      <td>${COURSE_TYPE_LABEL[course.type] || "必修"}</td>
      <td>週${DAY_LABEL[course.day]} ${course.start}-${course.end}</td>
      <td>${course.room}</td>
      <td>
        <div class="row-actions">
          <button class="btn btn-ghost" data-action="edit" data-id="${course.id}">編輯</button>
          <button class="btn btn-danger" data-action="delete" data-id="${course.id}">刪除</button>
        </div>
      </td>
    `;
    dom.courseTableBody.appendChild(tr);
  }
}

function courseCellContent(courses) {
  if (!courses.length) return "";
  return courses
    .map((c) => {
      return `
      <article class="course-chip">
        <strong>${c.code} ${c.name}</strong>
        <span>${COURSE_TYPE_LABEL[c.type] || "必修"} | ${c.start}-${c.end} | ${c.room}</span>
      </article>
    `;
    })
    .join("");
}

function renderTimetable() {
  dom.timetable.textContent = "";

  const corner = document.createElement("div");
  corner.className = "cell head";
  corner.textContent = "時間";
  dom.timetable.appendChild(corner);

  for (const day of DAY_ORDER) {
    const head = document.createElement("div");
    head.className = "cell head";
    head.textContent = `週${DAY_LABEL[day]}`;
    dom.timetable.appendChild(head);
  }

  for (let hour = START_HOUR; hour <= END_HOUR; hour += 1) {
    const timeCell = document.createElement("div");
    timeCell.className = "cell time";
    timeCell.textContent = `${String(hour).padStart(2, "0")}:00`;
    dom.timetable.appendChild(timeCell);

    for (const day of DAY_ORDER) {
      const coursesInCell = sortCourses(state.courses).filter((c) => {
        if (c.day !== day) return false;
        const cStart = toMinutes(c.start);
        const cEnd = toMinutes(c.end);
        const slotStart = hour * 60;
        const slotEnd = (hour + 1) * 60;
        return cStart < slotEnd && slotStart < cEnd;
      });
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.innerHTML = courseCellContent(coursesInCell);
      dom.timetable.appendChild(cell);
    }
  }
}

function rerender() {
  renderStats();
  renderTable();
  renderTimetable();
}

function upsertCourse() {
  const draft = readForm();
  const errorText = validateCourse(draft);
  if (errorText) {
    alert(errorText);
    return;
  }

  const conflict = checkConflict(draft, state.editingId);
  if (conflict) {
    alert(
      `衝堂警告：與 ${conflict.code} ${conflict.name} 時間重疊（週${DAY_LABEL[conflict.day]} ${conflict.start}-${conflict.end}）`
    );
    return;
  }

  const consecutiveViolation = checkTeacherConsecutiveLimit(draft, state.editingId);
  if (consecutiveViolation) {
    alert(
      `排課限制：${draft.teacher} 在週${DAY_LABEL[draft.day]} 連續授課時段達四節（${consecutiveViolation.start}-${consecutiveViolation.end}），請調整課程時間。`
    );
    return;
  }

  if (state.editingId) {
    state.courses = state.courses.map((course) => {
      if (course.id !== state.editingId) return course;
      return { ...course, ...draft };
    });
  } else {
    state.courses.push({ id: uid(), ...draft });
  }

  saveState();
  resetForm();
  rerender();
}

function deleteCourse(id) {
  state.courses = state.courses.filter((c) => c.id !== id);
  saveState();
  rerender();
}

function editCourse(id) {
  const target = state.courses.find((c) => c.id === id);
  if (!target) return;
  state.editingId = id;
  fillForm(target);
  dom.submitBtn.textContent = "更新課程";
}

function loadSeedData() {
  state.courses = [
    {
      id: uid(),
      code: "INE201",
      name: "資料通訊",
      teacher: "林老師",
      credits: 3,
      type: "required",
      day: "Mon",
      start: "09:00",
      end: "12:00",
      room: "E402"
    },
    {
      id: uid(),
      code: "INE317",
      name: "雲端網路實務",
      teacher: "張老師",
      credits: 3,
      type: "elective",
      day: "Tue",
      start: "13:00",
      end: "16:00",
      room: "N302"
    },
    {
      id: uid(),
      code: "INE333",
      name: "網路安全",
      teacher: "王老師",
      credits: 3,
      type: "required",
      day: "Thu",
      start: "10:00",
      end: "12:00",
      room: "E501"
    },
    {
      id: uid(),
      code: "INE350",
      name: "交換路由技術",
      teacher: "陳老師",
      credits: 3,
      type: "elective",
      day: "Fri",
      start: "14:00",
      end: "17:00",
      room: "N401"
    }
  ];
  saveState();
  resetForm();
  rerender();
}

function exportJson() {
  const data = JSON.stringify(sortCourses(state.courses), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ine-schedule.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

function importJson(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result || "[]"));
      if (!Array.isArray(imported)) {
        alert("匯入失敗：JSON 格式必須是陣列");
        return;
      }

      const normalized = [];
      for (const row of imported) {
        const candidate = {
          id: uid(),
          code: String(row.code || "").trim(),
          name: String(row.name || "").trim(),
          teacher: String(row.teacher || "").trim(),
          credits: Number(row.credits || 3),
          type: Object.keys(COURSE_TYPE_LABEL).includes(row.type)
            ? row.type
            : row.type === "必修"
              ? "required"
              : row.type === "選修"
                ? "elective"
                : "required",
          day: DAY_ORDER.includes(row.day) ? row.day : "Mon",
          start: String(row.start || "09:00"),
          end: String(row.end || "12:00"),
          room: String(row.room || "").trim()
        };
        const err = validateCourse(candidate);
        if (err) continue;
        if (checkConflict(candidate, null, normalized)) continue;
        if (checkTeacherConsecutiveLimit(candidate, null, normalized)) continue;
        normalized.push(candidate);
      }

      state.courses = normalized;
      saveState();
      resetForm();
      rerender();
    } catch {
      alert("匯入失敗：無法解析 JSON");
    }
  };
  reader.readAsText(file);
}

dom.form.addEventListener("submit", (event) => {
  event.preventDefault();
  upsertCourse();
});

dom.willingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveFillStage();
});

dom.syllabusForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveSyllabusStage();
});

dom.blockGrid.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button.slot");
  if (!(button instanceof HTMLButtonElement)) return;
  const day = button.dataset.day;
  const period = Number(button.dataset.period || 0);
  if (!day || !period) return;
  toggleBlockedSlot(day, period);
});

dom.teacherPhaseNav.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button.tree-item");
  if (!(button instanceof HTMLButtonElement) || !button.dataset.phase) return;
  setTeacherPhase(button.dataset.phase);
});

dom.syllabusForm.elements.finalRatio.addEventListener("input", () => renderGradeFormula());
dom.syllabusForm.elements.midtermRatio.addEventListener("input", () => renderGradeFormula());
dom.syllabusForm.elements.attendanceRatio.addEventListener("input", () => renderGradeFormula());

dom.selectedCountInput.addEventListener("input", () => saveMonitorStage());
dom.capacityInput.addEventListener("input", () => saveMonitorStage());
dom.generateAuthCodeBtn.addEventListener("click", () => generateAuthCode());

dom.studentKeyword.addEventListener("input", () => renderStudentSearch());
dom.studentCategory.addEventListener("change", () => renderStudentSearch());
dom.studentSlot.addEventListener("change", () => renderStudentSearch());

dom.studentSearchBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement)) return;
  if (button.dataset.action !== "add-cart") return;
  const id = button.dataset.id;
  if (!id) return;
  addCourseToCart(id);
});

dom.studentCartBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const button = target.closest("button");
  if (!(button instanceof HTMLButtonElement)) return;
  const action = button.dataset.action;
  const index = Number(button.dataset.index || -1);
  if (index < 0) return;

  if (action === "up") moveCartItem(index, -1);
  if (action === "down") moveCartItem(index, 1);
  if (action === "remove") removeCartItem(index);
});

dom.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(dom.loginForm);
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "teacher");
  const captchaInput = String(formData.get("captchaInput") || "");

  if (!isCaptchaValid(captchaInput)) {
    alert("登入失敗：驗證碼錯誤");
    dom.loginForm.elements.captchaInput.value = "";
    refreshCaptcha();
    return;
  }

  if (!login(username, password, role)) {
    alert(`登入失敗：${ROLE_LABEL[role] || "此角色"}帳號或密碼錯誤`);
    dom.loginForm.elements.captchaInput.value = "";
    refreshCaptcha();
    return;
  }

  dom.loginForm.elements.captchaInput.value = "";
  refreshCaptcha();
});

dom.captchaRefreshBtn.addEventListener("click", () => {
  dom.loginForm.elements.captchaInput.value = "";
  refreshCaptcha();
});

dom.roleButtons.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const btn = target.closest("button");
  if (!(btn instanceof HTMLButtonElement)) return;
  const role = btn.dataset.role;
  if (!role) return;
  setRoleButtons(role);
});

dom.logoutBtn.addEventListener("click", () => logout());

dom.resetBtn.addEventListener("click", () => resetForm());

dom.seedBtn.addEventListener("click", () => loadSeedData());

dom.clearBtn.addEventListener("click", () => {
  const pass = confirm("確定要清空所有課程嗎？");
  if (!pass) return;
  state.courses = [];
  saveState();
  resetForm();
  rerender();
});

dom.exportBtn.addEventListener("click", () => exportJson());

dom.importInput.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  importJson(file);
  dom.importInput.value = "";
});

dom.courseTableBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.dataset.action;
  const id = target.dataset.id;
  if (!action || !id) return;

  if (action === "edit") {
    editCourse(id);
  }
  if (action === "delete") {
    deleteCourse(id);
  }
});

loadState();
loadAuth();
resetForm();
rerender();
setViewByAuth();
setRoleButtons("teacher");
refreshCaptcha();
setInterval(() => {
  if (state.currentUser?.role === "student") {
    renderStudentDashboard();
  }
}, 1000);
