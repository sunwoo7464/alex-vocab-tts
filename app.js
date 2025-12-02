// === 공통 DOM 요소 ===
const ttsSupported = "speechSynthesis" in window;

const wordListEl = document.getElementById("word-list");
const dataStatusEl = document.getElementById("data-status");
const ttsWarningEl = document.getElementById("tts-warning");
const wordSectionTitleEl = document.getElementById("word-section-title");

const speedRange = document.getElementById("speed-range");
const speedDisplay = document.getElementById("speed-display");
const levelSelect = document.getElementById("level-select");
const unitSelect = document.getElementById("unit-select");

let ttsRate = 1.0;

// === 1. TTS 안내 ===
if (!ttsSupported) {
  ttsWarningEl.textContent =
    "⚠️ 이 브라우저에서는 음성 재생(TTS)이 지원되지 않습니다.";
} else {
  ttsWarningEl.textContent =
    "🔊 Word / Definition / Example 옆 버튼을 누르면 발음이 재생됩니다.";
}

// === 2. 재생 속도 슬라이더 ===
speedDisplay.textContent = "1.0x";

speedRange.addEventListener("input", () => {
  ttsRate = parseFloat(speedRange.value);
  speedDisplay.textContent = ttsRate.toFixed(1) + "x";
});

// === 3. TTS 재생 함수 ===
function speakText(text) {
  if (!ttsSupported || !text) return;

  window.speechSynthesis.cancel();

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.rate = ttsRate;

  window.speechSynthesis.speak(utter);
}

// === 4. 줄 나누기 (CR/LF 전부 대응) ===
function splitLines(rawText) {
  return rawText.split(/\r\n|\n|\r/).map((l) => l.trim());
}

// === 5. UNIT N의 단어 목록 파싱 ===
//   - NOVEL UNIT N Vocab list ~ (다음 UNIT / Present / FILL IN THE BLANK) 사이만 사용
//   - Rewrite / 밑줄 / 기타 지시문 제거
//   - 남은 라인을 4줄 세트(단어/정의/품사/예문)로 파싱
// === 5. UNIT N의 단어 목록 파싱 ===
function parseWordText(rawText, targetUnit) {
  const allLines = splitLines(rawText);

  // 5-1. "NOVEL UNIT N Vocab list" 또는 "UNIT N Vocab list" 헤더 찾기
  const headerReg = new RegExp(
    `^(?:NOVEL\\s+)?UNIT\\s+${targetUnit}\\b.*VOCAB`,
    "i"
  );

  let startIndex = -1;
  for (let i = 0; i < allLines.length; i++) {
    if (headerReg.test(allLines[i])) {
      startIndex = i + 1; // 헤더 바로 다음 줄부터 내용 시작
      break;
    }
  }
  if (startIndex === -1) return [];

  // 5-2. 종료 지점: 다음 UNIT, Present(3단 변화 표), SENTENCE WRITING, FILL IN THE BLANK
  const nextUnitReg = /^(?:NOVEL\s+)?UNIT\s+\d+\b.*VOCAB/i;
  const fillReg = /FILL\s+IN\s+THE\s+BLANK/i;
  const presentTableReg = /^present$/i;
  const sentenceWritingReg = /SENTENCE\s+WRITING/i;
  const rewriteSentenceReg = /REWRITE\s+THE\s+SENTENCE/i;

  let endIndex = allLines.length;
  for (let i = startIndex; i < allLines.length; i++) {
    const line = allLines[i];
    if (
      nextUnitReg.test(line) ||
      fillReg.test(line) ||
      presentTableReg.test(line) ||
      sentenceWritingReg.test(line) ||
      rewriteSentenceReg.test(line)
    ) {
      endIndex = i;
      break;
    }
  }

  // 5-3. 본문 후보 줄 추출 + 공백 제거
  let lines = allLines
    .slice(startIndex, endIndex)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return [];

  // 5-4. 지시문/잡음 제거 (Rewrite, 밑줄, Directions 등)
  const instructionPatterns = [
    /rewrite/i,                    // Rewrite the Sample sentence above ...
    /^_{5,}$/,                     // 밑줄로만 이루어진 줄
    /^direction[s]?:?/i,           // Directions:
    /^comprehension\s*\(/i,        // COMPREHENSION (H/W)
    /^summary\s*\(/i,              // SUMMARY (H/W)
    /^unit\s+\d+\s*note/i          // UNIT 1 NOTE
  ];

  lines = lines.filter(
    (line) => !instructionPatterns.some((re) => re.test(line))
  );

  // 5-5. 중간 헤더/템플릿 라인 제거 (WORD, DEFINITION & EXAMPLE, 1. WORD: _____ 등)
  const headerLinePatterns = [
    /^word[s]?:?/i,
    /^definition/i,
    /^meaning/i,
    /^example[s]?:?/i,
    /^vocab/i,
    /^vocabulary/i,
    /^ch\.\s*\d+/i,              // Ch. 1-4
    /^chap(?:ter)?\b/i,          // CHAP 5-7, Chapter ...
    /^\d+\.\s*word\s*:/i,        // 1. WORD:
    /word:\s*_{3,}/i             // WORD: ________
  ];

  lines = lines.filter(
    (line) => !headerLinePatterns.some((re) => re.test(line))
  );

  // 5-6. word/definition/pos/example 4줄씩 반복이라고 보고 파싱
  const result = [];

  for (let i = 0; i + 3 < lines.length; i += 4) {
    const word = lines[i];
    const definition = lines[i + 1];
    const pos = lines[i + 2];
    const example = lines[i + 3];

    if (!word || !definition) continue;

    result.push({
      word,
      definition,
      pos,
      example,
    });
  }

  return result;
}


// === 6. 이 TXT 안에 존재하는 UNIT 번호 자동 추출 ===
function findUnitList(rawText) {
  const lines = splitLines(rawText);
  const unitNumbers = new Set();

  // "NOVEL UNIT 1 Vocab list" 또는 "UNIT 1 Vocab list" 모두 잡기
  lines.forEach((line) => {
    const m = line.match(/^(?:NOVEL\s+)?UNIT\s+(\d+)\b.*VOCAB/i);
    if (m) {
      unitNumbers.add(parseInt(m[1], 10));
    }
  });

  return Array.from(unitNumbers).sort((a, b) => a - b);
}

// === 7. 파일 경로 ===
function getFilePath(level) {
  return `data/${level}.txt`;
}

// === 8. 단어 카드 렌더링 ===
function renderWordList(words) {
  wordListEl.innerHTML = "";

  if (!words || words.length === 0) {
    wordListEl.innerHTML =
      "<div style='padding:12px;text-align:center;color:#666;'>단어 데이터가 없습니다.</div>";
    return;
  }

  words.forEach((item) => {
    const card = document.createElement("div");
    card.className = "word-card";

    card.innerHTML = `
      <table class="word-table">
        <tr>
          <td class="cell-label">Word</td>
          <td class="cell-content">
            <span class="text-main">${item.word}</span>
            <button class="speak-btn" data-text="${item.word}">🔊</button>
          </td>
        </tr>
        <tr>
          <td class="cell-label">POS</td>
          <td class="cell-content">
            <span class="pos-badge">${item.pos || "-"}</span>
          </td>
        </tr>
        <tr>
          <td class="cell-label">Definition</td>
          <td class="cell-content">
            <span>${item.definition}</span>
            <button class="speak-btn" data-text="${item.definition}">🔊</button>
          </td>
        </tr>
        <tr>
          <td class="cell-label">Example</td>
          <td class="cell-content">
            <span>${item.example}</span>
            <button class="speak-btn" data-text="${item.example}">🔊</button>
          </td>
        </tr>
      </table>
    `;

    card.querySelectorAll(".speak-btn").forEach((btn) => {
      btn.addEventListener("click", () => speakText(btn.dataset.text));
    });

    wordListEl.appendChild(card);
  });
}

// === 9. 레벨 선택 시: UNIT 목록 자동 세팅 + 첫 UNIT 로딩 ===
async function loadCurrentWordList() {
  const level = levelSelect.value;
  const file = getFilePath(level);

  dataStatusEl.style.color = "#666";
  dataStatusEl.textContent = "불러오는 중…";
  wordListEl.innerHTML = "";

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();

    // ① 이 파일 안에 존재하는 UNIT 번호 목록 찾기
    const units = findUnitList(text);

    if (units.length === 0) {
      unitSelect.innerHTML = "";
      dataStatusEl.style.color = "#c00";
      dataStatusEl.textContent = "UNIT 정보를 찾을 수 없습니다.";
      return;
    }

    // ② UNIT 셀렉터 옵션을 이 목록으로 재구성
    unitSelect.innerHTML = "";
    units.forEach((u) => {
      const opt = document.createElement("option");
      opt.value = String(u);
      opt.textContent = `UNIT ${u}`;
      unitSelect.appendChild(opt);
    });

    // ③ 첫 번째 UNIT으로 단어 로딩
    const firstUnit = String(units[0]);
    unitSelect.value = firstUnit;

    const words = parseWordText(text, firstUnit);
    wordSectionTitleEl.textContent = `${level} · UNIT ${firstUnit}`;
    renderWordList(words);

    dataStatusEl.textContent = "";
  } catch (err) {
    console.error(err);
    dataStatusEl.style.color = "#c00";
    dataStatusEl.textContent =
      "파일을 불러올 수 없습니다. (경로나 파일명을 확인하세요)";
    wordListEl.innerHTML = "";
  }
}

// === 10. UNIT 변경 시: 다시 파싱 ===
unitSelect.addEventListener("change", async () => {
  const level = levelSelect.value;
  const unit = unitSelect.value;
  const file = getFilePath(level);

  dataStatusEl.style.color = "#666";
  dataStatusEl.textContent = "불러오는 중…";
  wordListEl.innerHTML = "";

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error();
    const text = await res.text();

    const words = parseWordText(text, unit);
    wordSectionTitleEl.textContent = `${level} · UNIT ${unit}`;
    renderWordList(words);

    dataStatusEl.textContent = "";
  } catch (err) {
    console.error(err);
    dataStatusEl.style.color = "#c00";
    dataStatusEl.textContent = "파일을 불러올 수 없습니다.";
  }
});

// === 11. 레벨 변경 시 ===
levelSelect.addEventListener("change", loadCurrentWordList);

// 초기 로드
loadCurrentWordList();
