// === 1. 단어 데이터 (40개) ===
const words = [
  {
    word: "tousle",
    pos: "verb",
    definition: "to make (someone’s hair) messy or untidy",
    example: "He tousled his hair after the long race."
  },
  {
    word: "clench",
    pos: "verb",
    definition: "to close (your fists or teeth) tightly especially when you are angry or determined",
    example: "She clenched her fists when she heard the bad news."
  },
  {
    word: "lurch",
    pos: "verb",
    definition: "to make an abrupt, unsteady, uncontrolled movement or series of movements",
    example: "The boat lurched to one side because of the big wave."
  },
  {
    word: "drone",
    pos: "verb / noun",
    definition: "(verb) to speak in a low, steady, boring tone; (noun) a continuous low humming sound",
    example: "The teacher droned on and the students started to nod off."
  },
  {
    word: "supine",
    pos: "adjective",
    definition: "lying flat on your back facing upward",
    example: "He lay supine on the grass and watched the clouds go by."
  },
  {
    word: "mirth",
    pos: "noun",
    definition: "laughter, joy, or happiness shown by smiling or laughing",
    example: "The room filled with mirth when the joke was told."
  },
  {
    word: "silhouette",
    pos: "noun",
    definition: "the dark shape of someone or something visible against a lighter background",
    example: "We saw the silhouette of a tree against the sunset."
  },
  {
    word: "extenuating",
    pos: "adjective",
    definition: "(used before a noun) making a fault or offence less serious",
    example: "The judge considered the extenuating circumstances before giving the sentence."
  },
  {
    word: "requisition",
    pos: "noun",
    definition: "an official request or demand for something needed",
    example: "The army sent a requisition for more supplies."
  },
  {
    word: "conscript",
    pos: "verb / noun",
    definition: "(verb) to force someone to serve in the army; (noun) someone who is forced into service",
    example: "During the war, many young men were conscripted into the army."
  },
  {
    word: "fodder",
    pos: "noun",
    definition: "food, especially dried hay or straw, for cattle and other livestock; also people or things that are useful only for a limited purpose",
    example: "The haystack served as fodder for the horses."
  },
  {
    word: "flotilla",
    pos: "noun",
    definition: "a small fleet of ships or boats",
    example: "A flotilla of boats set off across the lake at dawn."
  },
  {
    word: "renounce",
    pos: "verb",
    definition: "to formally give up a claim, right, or belief",
    example: "She renounced her title as princess."
  },
  {
    word: "assimilation",
    pos: "noun",
    definition: "the process of becoming part of a group or society, or of making someone or something part of a group",
    example: "The assimilation of cultures takes time."
  },
  {
    word: "evade",
    pos: "verb",
    definition: "to escape or avoid something, especially in a clever or dishonest way",
    example: "He tried to evade the question by changing the subject."
  },
  {
    word: "lithe",
    pos: "adjective",
    definition: "(of a person’s body) thin, supple and graceful",
    example: "The ballet dancer moved in a lithe and elegant way."
  },
  {
    word: "feeble",
    pos: "adjective",
    definition: "very weak; not effective or successful",
    example: "His argument was so feeble that nobody opposed it."
  },
  {
    word: "scrupulously",
    pos: "adverb",
    definition: "in a way that shows great care and attention to detail, especially to be fair or honest",
    example: "She scrupulously checked every entry in the ledger."
  },
  {
    word: "opaque",
    pos: "adjective",
    definition: "not able to be seen through; not transparent; also difficult to understand",
    example: "The glass was opaque, so we couldn’t see inside."
  },
  {
    word: "tactical",
    pos: "adjective",
    definition: "relating to or involving the careful planning and use of action in order to achieve a goal",
    example: "They made a tactical decision to wait until dawn."
  },
  {
    word: "extricate",
    pos: "verb",
    definition: "to free someone or something from a difficult or tangled situation",
    example: "They managed to extricate the car from the snowbank."
  },
  {
    word: "martyr",
    pos: "noun",
    definition: "a person who is killed or suffers greatly for a cause, often religious; by extension someone who suffers to make a point",
    example: "He became a martyr for his beliefs."
  },
  {
    word: "chafe",
    pos: "verb",
    definition: "to rub and cause irritation or annoyance, especially by tightness or friction",
    example: "The rough collar chafed his neck during the race."
  },
  {
    word: "tumult",
    pos: "noun",
    definition: "a loud or confused noise, especially one caused by a large mass of people; also a state of confusion or disorder",
    example: "There was a tumult in the stadium when the team scored the goal."
  },
  {
    word: "grisly",
    pos: "adjective",
    definition: "very unpleasant and shocking, especially because it involves death or injury",
    example: "They discovered a grisly scene after the accident."
  },
  {
    word: "malleable",
    pos: "adjective",
    definition: "able to be changed or influenced; able to be hammered or pressed into a new shape",
    example: "Gold is a malleable metal."
  },
  {
    word: "submerge",
    pos: "verb",
    definition: "to put something completely under the surface of water or another liquid",
    example: "The submarine can submerge to great depths."
  },
  {
    word: "rescind",
    pos: "verb",
    definition: "to officially cancel something, such as a law, order, or agreement",
    example: "The company rescinded the job offer when they found the mistake."
  },
  {
    word: "vengeance",
    pos: "noun",
    definition: "punishment inflicted or retribution exacted for an injury or wrong",
    example: "He swore vengeance on those who betrayed him."
  },
  {
    word: "vivisect",
    pos: "verb",
    definition: "to perform surgery on a living organism (for experiment) or to examine something in detail in a ruthless way",
    example: "Scientists refused to vivisect animals without justification."
  },
  {
    word: "quarrel",
    pos: "noun / verb",
    definition: "(noun) an angry argument or disagreement; (verb) to argue",
    example: "The two friends had a quarrel about the game."
  },
  {
    word: "incredulous",
    pos: "adjective",
    definition: "unwilling or unable to believe something; skeptical",
    example: "She gave him an incredulous look when he said he saw a UFO."
  },
  {
    word: "charade",
    pos: "noun",
    definition: "an act or event that is clearly false but presented as genuine; also a game where you act out a word for others to guess",
    example: "The meeting was just a charade and nobody took it seriously."
  },
  {
    word: "ambiguous",
    pos: "adjective",
    definition: "having more than one possible meaning; unclear or inexact",
    example: "His instructions were ambiguous, so we didn’t know what to do."
  },
  {
    word: "purge",
    pos: "verb / noun",
    definition: "(verb) to remove people or things that are undesirable from an organization; (noun) the act of doing so",
    example: "They attempted to purge the list of incorrect names."
  },
  {
    word: "despicable",
    pos: "adjective",
    definition: "deserving hatred and contempt",
    example: "His behaviour was despicable, and everyone condemned him."
  },
  {
    word: "pall",
    pos: "noun / verb",
    definition: "(noun) something that covers or conceals; (verb) to lose strength or interest, or to become less appealing",
    example: "The excitement began to pall after many hours."
  },
  {
    word: "queue",
    pos: "noun / verb",
    definition: "(noun) a line of people waiting their turn; (verb) to wait in line",
    example: "We queued for our tickets at the entrance."
  },
  {
    word: "somber",
    pos: "adjective",
    definition: "dark or dull in tone; showing a serious, sad mood",
    example: "The room looked somber after the news of his departure."
  },
  {
    word: "asphyxiate",
    pos: "verb",
    definition: "to kill or cause someone to die by stopping them from breathing; to suffocate",
    example: "Without oxygen, the miners risked asphyxiating in the tunnel."
  }
];

// === 2. TTS 지원 여부 및 공통 요소 ===
const ttsSupported = "speechSynthesis" in window;
const ttsWarningEl = document.getElementById("tts-warning");

const speedRange = document.getElementById("speed-range");
const speedDisplay = document.getElementById("speed-display");
const voiceSelect = document.getElementById("voice-select");

let ttsRate = 1.0;        // 공통 재생 속도
let voices = [];          // 브라우저가 가진 음성 목록
let selectedVoice = null; // 현재 선택된 음성

// 안내 문구
if (!ttsSupported) {
  if (ttsWarningEl) {
    ttsWarningEl.textContent =
      "⚠️ 이 브라우저에서는 음성 재생(TTS)을 지원하지 않습니다. 최신 브라우저에서 이용해 주세요.";
  }
} else {
  if (ttsWarningEl) {
    ttsWarningEl.textContent =
      "🔊 Word / Definition / Example 옆 스피커를 누르면, 위에서 선택한 속도·음성으로 영어 발음을 들을 수 있습니다.";
  }
}

// === 3. 속도 슬라이더 설정 ===
if (speedRange && speedDisplay) {
  // 초기 표시
  speedDisplay.textContent = ttsRate.toFixed(1) + "x";

  speedRange.addEventListener("input", () => {
    ttsRate = parseFloat(speedRange.value);
    speedDisplay.textContent = ttsRate.toFixed(1) + "x";
  });
}

// === 4. 음성(voice) 목록 로딩 및 선택 ===
function loadVoices() {
  if (!ttsSupported) return;

  voices = window.speechSynthesis.getVoices();

  if (!voiceSelect) return;

  // 기본 옵션부터 다시 채우기
  voiceSelect.innerHTML = '<option value="">기본(Default)</option>';

  // 영어 음성만 필터링 (원하면 이 줄 삭제해서 전체 사용 가능)
  const englishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("en"));

  englishVoices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

if (ttsSupported) {
  loadVoices();
  if (typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

if (voiceSelect) {
  voiceSelect.addEventListener("change", () => {
    const selectedName = voiceSelect.value;
    selectedVoice = voices.find((v) => v.name === selectedName) || null;
  });
}

// === 5. TTS로 텍스트 읽어주는 함수 ===
function speakText(text) {
  if (!ttsSupported) return;
  if (!text) return;

  // 기존 재생 중이면 멈추고 새로 재생
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = ttsRate;

  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// === 6. 단어 리스트 화면에 뿌리기 (2x2 구조 + 3개 스피커) ===
const wordListEl = document.getElementById("word-list");

if (wordListEl) {
  words.forEach((item) => {
    const card = document.createElement("div");
    card.className = "word-card";

    // 표 구조: Word → POS → Definition → Example
    card.innerHTML = `
      <table class="word-table">
        <tr>
          <td class="cell-label">Word</td>
          <td class="cell-content">
            <span class="text-main">${item.word}</span>
            <button class="speak-btn" data-text="${item.word}" data-type="word">🔊</button>
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
            <button class="speak-btn" data-text="${item.definition}" data-type="definition">🔊</button>
          </td>
        </tr>
        <tr>
          <td class="cell-label">Example</td>
          <td class="cell-content">
            <span>${item.example}</span>
            <button class="speak-btn" data-text="${item.example}" data-type="example">🔊</button>
          </td>
        </tr>
      </table>
    `;

    // 카드 안의 스피커 버튼들에 이벤트 연결
    const buttons = card.querySelectorAll(".speak-btn");

    buttons.forEach((btn) => {
      if (!ttsSupported) {
        btn.classList.add("disabled");
        btn.disabled = true;
        return;
      }

      btn.addEventListener("click", () => {
        const text = btn.getAttribute("data-text") || "";
        speakText(text);
      });
    });

    wordListEl.appendChild(card);
  });
}
