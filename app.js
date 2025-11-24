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
    "⚠️ 이 브라우저에서는 음성 재생(TTS)이 지원되지 않습니다. Chrome이나 Safari로 열어주세요.";
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
  if (!ttsSupported) return;
  if (!text) return;

  // 기존 음성 중단
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = ttsRate;

  window.speechSynthesis.speak(utterance);
}

// === 4. 텍스트 파싱 ===
// rawText: 전체 파일 내용
// targetUnit: "1" ~ "4" (문자열)
function parseWordText(rawText, targetUnit) {
  // 줄 단위로 나누고 trim
  const linesRaw = rawText.split(/\r?\n/).map((l) => l.trim());

  // 완전 빈 줄은 일단 유지했다가, UNIT 경계 기준으로 나눔
  const lines = linesRaw.filter((l) => l.length > 0);

  // 1) 원하는 UNIT 블록 찾기
  const unitHeader = `UNIT${targetUnit}`;
  let startIndex = -1;
  let endIndex = lines.length;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toUpperCase() === unitHeader) {
      startIndex = i + 1;
      break;
    }
  }

  if (startIndex === -1) {
    return [];
  }

  for (let i = startIndex; i < lines.length; i++) {
    if (/^UNIT[1-4]$/i.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  const unitLines = lines.slice(startIndex, endIndex);

  const result = [];
  let i = 0;

  while (i < unitLines.length) {
    let line = unitLines[i];
    if (!line) {
      i++;
      continue;
    }

    // --- 형식 1: 한 줄 파이프식 ---
    // "1. word | pos | def | ex" 또는 "word | pos | def | ex"
    let content = line;
    const m = line.match(/^(\d+)\.\s*(.+)$/); // "1. word | ..."
    if (m) {
      content = m[2];
    }

    const parts = content.split("|").map((p) => p.trim());

    if (parts.length >= 4) {
      const [word, pos, definition, ...rest] = parts;
      const example = rest.join(" | ").trim();

      result.push({
        word,
        pos,
        definition,
        example,
      });
      i += 1;
      continue;
    }

    // --- 형식 2: 4줄 블록식 ---
    // word
    // pos
    // definition
    // example
    if (i + 3 < unitLines.length) {
      const wordLine = unitLines[i];
      const posLine = unitLines[i + 1];
      const defLine = unitLines[i + 2];
      const exLine = unitLines[i + 3];

      // 혹시 다음 UNIT 헤더를 잘못 읽는 경우 방지
      if (/^UNIT[1-4]$/i.test(wordLine.toUpperCase())) {
        break;
      }

      result.push({
        word: wordLine,
        pos: posLine,
        definition: defLine,
        example: exLine,
      });

      i += 4;
      continue;
    }

    // 그 외 나머지는 스킵
    i += 1;
  }

  return result;
}

// === 5. 파일 경로 ===
function getFilePath(level) {
  return `data/${level}.txt`;
}

// === 6. 렌더링 ===
function renderWordList(words) {
  wordListEl.innerHTML = "";

  if (!words || words.length === 0) {
    wordListEl.innerHTML =
      "<div style='text-align:center;color:#666;font-size:0.85rem;'>단어 데이터가 없습니다.</div>";
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
            <span class="pos-badge">${item.pos}</span>
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

    const btns = card.querySelectorAll(".speak-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        speakText(btn.dataset.text);
      });
    });

    wordListEl.appendChild(card);
  });
}

// === 7. 레벨/UNIT 선택에 따라 데이터 로딩 ===
async function loadCurrentWordList() {
  const level = levelSelect.value;
  const unit = unitSelect.value;

  const filePath = getFilePath(level);

  wordSectionTitleEl.textContent = `${level} · UNIT ${unit}`;
  dataStatusEl.style.color = "#666";
  dataStatusEl.textContent = "단어 데이터를 불러오는 중입니다...";

  wordListEl.innerHTML = "";

  try {
    const res = await fetch(filePath);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const text = await res.text();
    const words = parseWordText(text, unit);
    renderWordList(words);

    dataStatusEl.textContent = "";
  } catch (err) {
    console.error(err);
    renderWordList([]);
    dataStatusEl.style.color = "#c00";
    dataStatusEl.textContent =
      "단어 파일을 불러오지 못했습니다. 파일 이름/위치를 확인해주세요.";
  }
}

levelSelect.addEventListener("change", loadCurrentWordList);
unitSelect.addEventListener("change", loadCurrentWordList);

// 초기 로드
loadCurrentWordList();
