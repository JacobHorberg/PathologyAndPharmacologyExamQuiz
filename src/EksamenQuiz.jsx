import { useState, useEffect, useCallback, useMemo } from "react";
import basalPatologi from "./questions/basal-patologi.json";
import lungesygdomme from "./questions/lungesygdomme.json";
import neurologi from "./questions/neurologi.json";
import psykiatri from "./questions/psykiatri.json";
import karoghjerte from "./questions/kar-og-hjerte.json";
import endokrinologi from "./questions/endokrinologi.json";
import onkologi from "./questions/onkologi.json";
import reumatologi from "./questions/reumatologi.json";
import ortopædkirurgi from "./questions/ortopaedkirurgi.json";
import operationspatienten from "./questions/operationspatienten.json";
import livsstilsrelateredetilstande from "./questions/livsstilsrelaterede-tilstande.json";
import graviditet from "./questions/graviditet.json";
import aldring from "./questions/aldring.json";

/* ============================================================================
   HOW TO ADD QUESTIONS
   ----------------------------------------------------------------------------
   Questions live in src/questions/ - one JSON file per topic.
   To add questions to an existing topic, open the relevant file and append
   objects to the array. To add a new topic, create a new JSON file and import
   it below, then add it to the QUESTIONS spread.

   Each question object looks like this:
   {
     "topic": "Hjerte og kar",
     "question": "The question text goes here?",
     "options": ["First answer", "Second answer", "Third answer", "Fourth answer"],
     "correct": "C",
     "explanation": "Why this answer is correct. Shown after answering."
   }

   - "correct" is the LETTER of the correct answer (A = first option, etc.).
   - The letter is not case-sensitive.
   - Leave "explanation" as "" if you don't have one yet.
   ============================================================================ */

const QUESTIONS = [
  ...basalPatologi,
  ...lungesygdomme,
  ...neurologi,
  ...psykiatri,
  ...karoghjerte,
  ...endokrinologi,
  ...onkologi,
  ...reumatologi,
  ...ortopædkirurgi,
  ...operationspatienten,
  ...livsstilsrelateredetilstande,
  ...graviditet,
  ...aldring,
];

/* ============================================================================
   Below is the quiz engine. You normally don't need to touch anything here.
   ============================================================================ */

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const ALL = "__ALLE_EMNER__";
const CUSTOM = "__TILPASSET__";
const GITHUB_REPO = "https://github.com/JacobHorberg/PathologyAndPharmacologyExamQuiz";

function flagIssueUrl(q) {
  const shortQ = q.question.length > 60 ? q.question.slice(0, 60) + "…" : q.question;
  const title = `Ret spørgsmål: "${shortQ}" (emne: ${q.topic})`;
  const optionLines = q.options.map((opt, i) => `- **${LETTERS[i]}:** ${opt}`).join("\n");
  const body =
    `**Emne:** ${q.topic}\n\n` +
    `**Spørgsmål:**\n${q.question}\n\n` +
    `**Svarmuligheder:**\n${optionLines}\n\n` +
    `**Korrekt svar:** ${q.correct}\n\n` +
    `---\n\n**Hvad er forkert med spørgsmålet?**\n\n<!-- Beskriv problemet her -->`;
  return `${GITHUB_REPO}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}&labels=Question%20fix`;
}

function topicOf(q) {
  return q.topic && String(q.topic).trim() ? String(q.topic).trim() : "Andet";
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const topics = useMemo(() => {
    const map = new Map();
    QUESTIONS.forEach((q) => {
      const t = topicOf(q);
      map.set(t, (map.get(t) || 0) + 1);
    });
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, []);

  const [screen, setScreen] = useState("menu");
  const [shuffleOn, setShuffleOn] = useState(true);
  const [activeTopic, setActiveTopic] = useState(ALL);
  const [deck, setDeck] = useState([]);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [customCounts, setCustomCounts] = useState({});
  const [randomCount, setRandomCount] = useState(20);
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    return stored === null ? true : stored === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  const total = deck.length;
  const q = total > 0 && pos < total ? deck[pos] : null;
  const correctIndex = q
    ? LETTERS.indexOf(String(q.correct).trim().toUpperCase())
    : -1;
  const malformed =
    q && (correctIndex < 0 || correctIndex >= (q.options?.length ?? 0));
  const answered = selected !== null;
  const progressPct = ((pos + (answered ? 1 : 0)) / total) * 100;

  const buildDeck = useCallback((topic, doShuffle) => {
    const filtered =
      topic === ALL ? QUESTIONS : QUESTIONS.filter((x) => topicOf(x) === topic);
    return doShuffle ? shuffle(filtered) : [...filtered];
  }, []);

  const startTopic = useCallback(
    (topic, doShuffle) => {
      setActiveTopic(topic);
      setDeck(buildDeck(topic, doShuffle));
      setPos(0);
      setSelected(null);
      setScore({ correct: 0, wrong: 0 });
      setWrongAnswers([]);
      setScreen("quiz");
    },
    [buildDeck]
  );

  const openCustomScreen = useCallback(() => {
    setCustomCounts((prev) => {
      const next = { ...prev };
      topics.forEach((t) => { if (!(t.name in next)) next[t.name] = 0; });
      return next;
    });
    setScreen("custom");
  }, [topics]);

  const startCustomQuiz = useCallback((counts) => {
    const combined = [];
    topics.forEach((t) => {
      const n = counts[t.name] || 0;
      if (n > 0) {
        const topicQs = QUESTIONS.filter((x) => topicOf(x) === t.name);
        combined.push(...shuffle(topicQs).slice(0, n));
      }
    });
    if (combined.length === 0) return;
    setActiveTopic(CUSTOM);
    setDeck(shuffleOn ? shuffle(combined) : combined);
    setPos(0);
    setSelected(null);
    setScore({ correct: 0, wrong: 0 });
    setWrongAnswers([]);
    setScreen("quiz");
  }, [topics, shuffleOn]);

  const handleAnswer = useCallback(
    (i) => {
      if (answered || malformed) return;
      setSelected(i);
      if (i === correctIndex) {
        setScore((s) => ({ ...s, correct: s.correct + 1 }));
      } else {
        setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
        setWrongAnswers((wa) => [...wa, { question: q, pickedIndex: i, correctIndex }]);
      }
    },
    [answered, malformed, correctIndex, q]
  );

  const next = useCallback(() => {
    if (!answered) return;
    if (pos + 1 >= total) {
      setScreen("summary");
    } else {
      setPos((p) => p + 1);
      setSelected(null);
    }
  }, [answered, pos, total]);

  const startRandomQuiz = useCallback((n) => {
    const count = Math.max(1, Math.min(n, QUESTIONS.length));
    setActiveTopic(CUSTOM);
    setDeck(shuffle([...QUESTIONS]).slice(0, count));
    setPos(0);
    setSelected(null);
    setScore({ correct: 0, wrong: 0 });
    setWrongAnswers([]);
    setScreen("quiz");
  }, []);

  const retakeSameDeck = useCallback(() => {
    setPos(0);
    setSelected(null);
    setScore({ correct: 0, wrong: 0 });
    setWrongAnswers([]);
    setScreen("quiz");
  }, []);

  // Keyboard: number/letter to answer, Enter/→ for next.
  useEffect(() => {
    if (screen !== "quiz") return;
    function onKey(e) {
      if (!q) return;
      if (!answered) {
        const n = parseInt(e.key, 10);
        if (!Number.isNaN(n) && n >= 1 && n <= q.options.length) {
          handleAnswer(n - 1);
          return;
        }
        const li = LETTERS.indexOf(e.key.toUpperCase());
        if (li >= 0 && li < q.options.length) handleAnswer(li);
      } else if (e.key === "Enter" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [screen, q, answered, handleAnswer, next]);

  const topicLabel =
    activeTopic === ALL ? "Alle emner" :
    activeTopic === CUSTOM ? "Tilpasset quiz" :
    activeTopic;

  const themeToggle = (
    <button
      onClick={() => setDarkMode((d) => !d)}
      aria-label="Skift tema"
      title="Skift tema"
      style={{
        position: "fixed", top: 18, right: 18, zIndex: 50,
        width: 42, height: 42,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: "50%",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
        color: "var(--text-dim)",
        fontSize: 18, cursor: "pointer",
        transition: "background .15s",
      }}
    >
      {darkMode ? "☀" : "☾"}
    </button>
  );

  const pageWrap = (content) => (
    <div className={darkMode ? "dark" : ""}>
      <div style={{
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
        transition: "background .25s ease",
      }}>
        {themeToggle}
        {content}
      </div>
    </div>
  );

  // ---------- Empty state ----------
  if (QUESTIONS.length === 0) {
    return pageWrap(
      <div className="flex items-center justify-center min-h-screen p-6">
        <div style={{
          maxWidth: 400, textAlign: "center",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 20, boxShadow: "var(--shadow)", padding: 32,
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>
            Ingen spørgsmål endnu
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "var(--text-dim)", lineHeight: 1.6 }}>
            Tilføj spørgsmål i <code>QUESTIONS</code>-listen øverst i koden, så dukker de op her.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Menu screen ----------
  if (screen === "menu") {
    return pageWrap(
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "48px 20px 64px" }}>
        {/* Header */}
        <header style={{ marginBottom: 28 }}>
          <p style={{
            margin: "0 0 8px", fontSize: 12, fontWeight: 700,
            letterSpacing: ".14em", textTransform: "uppercase",
            color: "var(--teal)",
          }}>Eksamenstræning</p>
          <h1 style={{
            margin: 0, fontSize: 34, fontWeight: 800,
            letterSpacing: "-.02em", lineHeight: 1.1,
            color: "var(--text)",
          }}>Patologi &amp; Farmakologi</h1>
          <p style={{ margin: "10px 0 0", fontSize: 16, color: "var(--text-dim)" }}>
            Vælg et emne eller byg din egen quiz.
          </p>
        </header>

        {/* Mode cards — 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <button
            onClick={() => startTopic(ALL, shuffleOn)}
            className="q-card-lift"
            style={{
              display: "flex", flexDirection: "column", textAlign: "left",
              padding: 20, borderRadius: 20,
              border: "1.5px solid var(--teal-tint-bd)",
              background: "var(--teal-tint)",
              minHeight: 138, cursor: "pointer",
            }}
          >
            <span style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 12,
              background: "var(--teal)", color: "#fff", fontSize: 20,
              marginBottom: "auto",
            }}>⚡</span>
            <span style={{ display: "block", fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 14 }}>
              Alle emner
            </span>
            <span style={{ display: "block", fontSize: 13, color: "var(--text-dim)", marginTop: 3 }}>
              {QUESTIONS.length} spørgsmål i én blandet runde
            </span>
          </button>

          <button
            onClick={openCustomScreen}
            className="q-card-lift"
            style={{
              display: "flex", flexDirection: "column", textAlign: "left",
              padding: 20, borderRadius: 20,
              border: "1.5px solid var(--violet-tint-bd)",
              background: "var(--violet-tint)",
              minHeight: 138, cursor: "pointer",
            }}
          >
            <span style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 40, height: 40, borderRadius: 12,
              background: "var(--violet)", color: "#fff", fontSize: 20,
              marginBottom: "auto",
            }}>⚙</span>
            <span style={{ display: "block", fontSize: 18, fontWeight: 700, color: "var(--text)", marginTop: 14 }}>
              Tilpasset quiz
            </span>
            <span style={{ display: "block", fontSize: 13, color: "var(--text-dim)", marginTop: 3 }}>
              Vælg antal spørgsmål fra hvert emne
            </span>
          </button>
        </div>

        {/* Shuffle toggle */}
        <button
          onClick={() => setShuffleOn((s) => !s)}
          style={{
            display: "flex", alignItems: "center", gap: 12,
            width: "100%", padding: "13px 16px", borderRadius: 14,
            border: "1px solid var(--border)",
            background: "var(--surface)",
            marginBottom: 26, textAlign: "left", cursor: "pointer",
          }}
        >
          <span style={{
            flexShrink: 0, position: "relative",
            width: 42, height: 24, borderRadius: 99,
            background: shuffleOn ? "var(--teal)" : "var(--border-strong)",
            transition: "background .18s",
          }}>
            <span style={{
              position: "absolute", top: 3, left: 3,
              width: 18, height: 18, borderRadius: "50%",
              background: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,.3)",
              transition: "transform .18s",
              transform: shuffleOn ? "translateX(18px)" : "translateX(0)",
            }} />
          </span>
          <span style={{ display: "block" }}>
            <span style={{ display: "block", fontSize: 14, fontWeight: 600, color: "var(--text)" }}>
              Bland rækkefølgen
            </span>
            <span style={{ display: "block", fontSize: 12, color: "var(--text-faint)" }}>
              Stil spørgsmålene i tilfældig rækkefølge
            </span>
          </span>
        </button>

        {/* Section label */}
        <p style={{
          margin: "0 0 14px", fontSize: 12, fontWeight: 700,
          letterSpacing: ".1em", textTransform: "uppercase",
          color: "var(--text-faint)",
        }}>Eller vælg ét emne</p>

        {/* Topic grid — 2-col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {topics.map((t) => (
            <button
              key={t.name}
              onClick={() => startTopic(t.name, shuffleOn)}
              className="q-topic-btn"
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 10, textAlign: "left", padding: "15px 16px", borderRadius: 14,
                border: "1px solid var(--border)",
                background: "var(--surface)",
                minHeight: 62, cursor: "pointer",
              }}
            >
              <span style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.25 }}>
                {t.name}
              </span>
              <span style={{
                flexShrink: 0, fontSize: 12, fontWeight: 700,
                color: "var(--teal)", background: "var(--teal-tint)",
                borderRadius: 99, padding: "3px 9px",
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p style={{ margin: "28px 0 0", fontSize: 12, lineHeight: 1.6, color: "var(--text-faint)", textAlign: "center" }}>
          Spørgsmålene er genereret med AI og kan indeholde fejl.{" "}
          <a
            href={`${GITHUB_REPO}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--teal)", textDecoration: "underline" }}
          >Rapportér et problem</a>{" "}
          hvis du finder noget forkert.
        </p>
      </div>
    );
  }

  // ---------- Custom screen ----------
  if (screen === "custom") {
    const totalCustom = Object.values(customCounts).reduce((s, n) => s + n, 0);

    const setAll = (n) => {
      const next = {};
      topics.forEach((t) => { next[t.name] = n === null ? t.count : Math.min(n, t.count); });
      setCustomCounts(next);
    };

    const setCount = (name, val, max) => {
      const n = Math.min(max, Math.max(0, val));
      setCustomCounts((prev) => ({ ...prev, [name]: n }));
    };

    return pageWrap(
      <>
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 20px 130px" }}>
          {/* Back */}
          <button
            onClick={() => setScreen("menu")}
            className="q-nav-btn"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "none", border: "none", padding: 0,
              cursor: "pointer", fontSize: 14,
              color: "var(--text-dim)", marginBottom: 18,
            }}
          >← Tilbage</button>

          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-.02em", color: "var(--text)" }}>
            Byg din egen quiz
          </h1>
          <p style={{ margin: "8px 0 22px", fontSize: 15, color: "var(--text-dim)" }}>
            Vælg et tilfældigt antal, eller sæt præcis hvor mange fra hvert emne.
          </p>

          {/* Random total section */}
          <div style={{
            borderRadius: 16, border: "1px solid var(--border)",
            background: "var(--surface)", padding: "14px 16px", marginBottom: 22,
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12, marginBottom: 11,
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
                  Tilfældig blanding
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-faint)" }}>
                  Trækker fra alle {QUESTIONS.length} spørgsmål
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button
                  onClick={() => setRandomCount((c) => Math.max(1, c - 1))}
                  aria-label="Færre"
                  style={{
                    width: 30, height: 30,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 9, border: "1px solid var(--border-strong)",
                    background: "var(--surface-2)", color: "var(--text)",
                    fontSize: 18, lineHeight: 1, cursor: "pointer",
                  }}
                >−</button>
                <span style={{
                  minWidth: 26, textAlign: "center", fontSize: 16, fontWeight: 700,
                  color: "var(--violet)",
                }}>{randomCount}</span>
                <button
                  onClick={() => setRandomCount((c) => Math.min(QUESTIONS.length, c + 1))}
                  aria-label="Flere"
                  style={{
                    width: 30, height: 30,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    borderRadius: 9, border: "1px solid var(--border-strong)",
                    background: "var(--surface-2)", color: "var(--text)",
                    fontSize: 18, lineHeight: 1, cursor: "pointer",
                  }}
                >+</button>
              </div>
            </div>
            <input
              type="range"
              min={1}
              max={QUESTIONS.length}
              value={randomCount}
              onChange={(e) => setRandomCount(parseInt(e.target.value, 10))}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
              <button
                onClick={() => startRandomQuiz(randomCount)}
                className="q-btn-teal"
                style={{
                  border: "none", borderRadius: 10,
                  background: "var(--teal)", color: "#fff",
                  fontSize: 14, fontWeight: 700, padding: "9px 18px",
                  cursor: "pointer",
                }}
              >Start tilfældig →</button>
            </div>
          </div>

          {/* Per-topic section label */}
          <p style={{
            margin: "0 0 14px", fontSize: 12, fontWeight: 700,
            letterSpacing: ".1em", textTransform: "uppercase",
            color: "var(--text-faint)",
          }}>Eller vælg per emne</p>

          {/* Quick-action chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            {[
              { label: "Nulstil", action: () => setAll(0) },
              { label: "5 fra hver", action: () => setAll(5) },
              { label: "10 fra hver", action: () => setAll(10) },
              { label: "15 fra hver", action: () => setAll(15) },
              { label: "Alle", action: () => setAll(null) },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="q-chip-btn"
                style={{
                  borderRadius: 99, border: "1px solid var(--border)",
                  background: "var(--surface)", padding: "7px 14px",
                  fontSize: 13, fontWeight: 600,
                  color: "var(--text-dim)", cursor: "pointer",
                }}
              >{label}</button>
            ))}
          </div>

          {/* Topic rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topics.map((t) => {
              const val = customCounts[t.name] || 0;
              return (
                <div
                  key={t.name}
                  style={{
                    borderRadius: 16, border: "1px solid var(--border)",
                    background: "var(--surface)", padding: "14px 16px",
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    gap: 12, marginBottom: 11,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
                        {t.name}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--text-faint)" }}>
                        {t.count} tilgængelige
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => setCount(t.name, val - 1, t.count)}
                        disabled={val === 0}
                        aria-label="Færre"
                        style={{
                          width: 30, height: 30,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 9, border: "1px solid var(--border-strong)",
                          background: "var(--surface-2)", color: "var(--text)",
                          fontSize: 18, lineHeight: 1,
                          cursor: val === 0 ? "not-allowed" : "pointer",
                          opacity: val === 0 ? 0.4 : 1,
                        }}
                      >−</button>
                      <span style={{
                        minWidth: 26, textAlign: "center", fontSize: 16, fontWeight: 700,
                        color: val > 0 ? "var(--violet)" : "var(--text-faint)",
                      }}>{val}</span>
                      <button
                        onClick={() => setCount(t.name, val + 1, t.count)}
                        disabled={val >= t.count}
                        aria-label="Flere"
                        style={{
                          width: 30, height: 30,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 9, border: "1px solid var(--border-strong)",
                          background: "var(--surface-2)", color: "var(--text)",
                          fontSize: 18, lineHeight: 1,
                          cursor: val >= t.count ? "not-allowed" : "pointer",
                          opacity: val >= t.count ? 0.4 : 1,
                        }}
                      >+</button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={t.count}
                    value={val}
                    onChange={(e) => setCount(t.name, parseInt(e.target.value, 10), t.count)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Sticky footer bar */}
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          boxShadow: "0 -4px 20px rgba(0,0,0,.08)",
        }}>
          <div style={{
            maxWidth: 620, margin: "0 auto", padding: "14px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-dim)" }}>
              {totalCustom === 0 ? "Ingen spørgsmål valgt" : `${totalCustom} spørgsmål valgt`}
            </span>
            <button
              onClick={() => startCustomQuiz(customCounts)}
              disabled={totalCustom === 0}
              className={totalCustom > 0 ? "q-btn-violet" : ""}
              style={{
                border: "none", borderRadius: 13,
                fontSize: 15, fontWeight: 700, padding: "12px 22px",
                transition: "opacity .14s, background-color .14s",
                ...(totalCustom === 0
                  ? { background: "var(--surface-2)", color: "var(--text-faint)", cursor: "not-allowed" }
                  : { background: "var(--violet)", color: "#fff", cursor: "pointer" }
                ),
              }}
            >Start quiz →</button>
          </div>
        </div>
      </>
    );
  }

  // ---------- Summary screen ----------
  if (screen === "summary") {
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const r = 58;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;

    return pageWrap(
      <div style={{ maxWidth: 520, margin: "0 auto", padding: "48px 20px 64px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Result card */}
        <div style={{
          textAlign: "center",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 24, boxShadow: "var(--shadow)", padding: "36px 28px",
        }}>
          <p style={{
            margin: "0 0 4px", fontSize: 12, fontWeight: 700,
            letterSpacing: ".12em", textTransform: "uppercase",
            color: "var(--teal)",
          }}>Resultat</p>
          <p style={{ margin: "0 0 22px", fontSize: 13, color: "var(--text-faint)" }}>{topicLabel}</p>

          {/* Donut ring */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 22 }}>
            <svg width="150" height="150" viewBox="0 0 150 150">
              <circle cx="75" cy="75" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="13" />
              <circle
                cx="75" cy="75" r={r} fill="none"
                stroke="var(--teal)" strokeWidth="13" strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 75 75)"
              />
              <text
                x="75" y="75" textAnchor="middle" dominantBaseline="central"
                fontSize="34" fontWeight="800"
                fontFamily="Manrope, system-ui, sans-serif"
                fill="var(--text)"
              >{pct}%</text>
            </svg>
          </div>

          <p style={{ margin: "0 0 26px", fontSize: 19, fontWeight: 700, color: "var(--text)" }}>
            {score.correct} af {total} rigtige
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={retakeSameDeck}
              className="q-btn-teal"
              style={{
                width: "100%", border: "none", borderRadius: 14,
                background: "var(--teal)", color: "#fff",
                fontSize: 15, fontWeight: 700, padding: 14,
                cursor: "pointer",
              }}
            >Tag quizzen igen</button>
            <button
              onClick={() => setScreen("menu")}
              className="q-btn-outline"
              style={{
                width: "100%", border: "1px solid var(--border-strong)", borderRadius: 14,
                background: "transparent", color: "var(--text-dim)",
                fontSize: 15, fontWeight: 600, padding: 13,
                cursor: "pointer",
              }}
            >Til forsiden</button>
          </div>
        </div>

        {/* Wrong answers */}
        {wrongAnswers.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h2 style={{
              margin: 0, fontSize: 13, fontWeight: 700,
              letterSpacing: ".1em", textTransform: "uppercase",
              color: "var(--text-faint)",
            }}>Forkerte svar ({wrongAnswers.length})</h2>

            {wrongAnswers.map(({ question: wq, pickedIndex, correctIndex: ci }, idx) => (
              <div key={idx} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                borderRadius: 18, boxShadow: "var(--shadow)", padding: 20,
              }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 600, color: "var(--teal)" }}>
                  {wq.topic}
                </p>
                <p style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, lineHeight: 1.4, color: "var(--text)" }}>
                  {wq.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {wq.options.map((opt, i) => {
                    const isCorrect = i === ci;
                    const isPicked = i === pickedIndex;
                    let badgeBg = "var(--surface-2)", badgeColor = "var(--text-faint)";
                    let tc = "var(--text-dim)", fw = 400;
                    if (isCorrect) { badgeBg = "var(--emerald)"; badgeColor = "#fff"; tc = "var(--text)"; fw = 600; }
                    else if (isPicked) { badgeBg = "var(--rose)"; badgeColor = "#fff"; }
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <span style={{
                          flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          width: 22, height: 22, borderRadius: 6,
                          fontSize: 11, fontWeight: 700,
                          background: badgeBg, color: badgeColor,
                        }}>{LETTERS[i]}</span>
                        <span style={{ fontSize: 14, lineHeight: 1.4, color: tc, fontWeight: fw }}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {wq.explanation && (
                  <p style={{
                    margin: "14px 0 0", paddingTop: 13,
                    borderTop: "1px solid var(--border)",
                    fontSize: 13.5, lineHeight: 1.55, color: "var(--text-dim)",
                  }}>{wq.explanation}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---------- Quiz screen ----------
  return pageWrap(
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "36px 20px 56px" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, marginBottom: 14,
      }}>
        <button
          onClick={() => setScreen("menu")}
          className="q-nav-btn"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", padding: 0,
            cursor: "pointer", fontSize: 14, fontWeight: 600,
            color: "var(--text-dim)", minWidth: 0,
          }}
        >
          ← <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {topicLabel}
          </span>
        </button>
        <div style={{
          display: "flex", alignItems: "center", gap: 14,
          flexShrink: 0, fontSize: 14, fontWeight: 700,
        }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--emerald)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--emerald)", display: "inline-block" }} />
            {score.correct}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--rose)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--rose)", display: "inline-block" }} />
            {score.wrong}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 7, width: "100%", borderRadius: 99, background: "var(--surface-2)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 99, background: "var(--teal)",
          transition: "width .3s ease", width: `${progressPct}%`,
        }} />
      </div>
      <p style={{ margin: "9px 0 20px", fontSize: 12.5, fontWeight: 600, color: "var(--text-faint)" }}>
        Spørgsmål {pos + 1} af {total}
      </p>

      {/* Question card */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 22, boxShadow: "var(--shadow)", padding: "26px 24px",
      }}>
        {malformed ? (
          <p style={{ fontSize: 14, color: "var(--rose)" }}>
            Dette spørgsmål er sat forkert op: det rigtige svar ("{String(q.correct)}") passer ikke
            til svarmulighederne. Tjek <code>correct</code> for dette spørgsmål i koden.
          </p>
        ) : (
          <>
            {/* Topic eyebrow */}
            <p style={{
              margin: "0 0 8px", fontSize: 12, fontWeight: 700,
              letterSpacing: ".08em", textTransform: "uppercase",
              color: "var(--teal)",
            }}>{q.topic}</p>

            {/* Question */}
            <h2 style={{
              margin: "0 0 22px", fontSize: 21, fontWeight: 700,
              lineHeight: 1.32, letterSpacing: "-.01em", color: "var(--text)",
            }}>{q.question}</h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {q.options.map((opt, i) => {
                const isCorrect = i === correctIndex;
                const isPicked = i === selected;
                let bg = "var(--surface)", bd = "var(--border)";
                let badgeBg = "var(--surface-2)", badgeColor = "var(--text-dim)";
                if (answered) {
                  if (isCorrect) {
                    bg = "var(--emerald-tint)"; bd = "var(--emerald)";
                    badgeBg = "var(--emerald)"; badgeColor = "#fff";
                  } else if (isPicked) {
                    bg = "var(--rose-tint)"; bd = "var(--rose)";
                    badgeBg = "var(--rose)"; badgeColor = "#fff";
                  }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={answered}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 13,
                      width: "100%", textAlign: "left",
                      padding: "14px 16px", borderRadius: 14,
                      border: `1.5px solid ${bd}`, background: bg,
                      cursor: answered ? "default" : "pointer",
                      transition: "border-color .14s, background-color .14s",
                    }}
                  >
                    <span style={{
                      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                      width: 26, height: 26, borderRadius: 8,
                      fontSize: 13, fontWeight: 700,
                      background: badgeBg, color: badgeColor,
                    }}>{LETTERS[i]}</span>
                    <span style={{ fontSize: 15.5, lineHeight: 1.4, color: "var(--text)", paddingTop: 2 }}>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback block */}
            {answered && (
              <div
                style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--border)" }}
                aria-live="polite"
              >
                <p style={{
                  margin: 0, fontSize: 15, fontWeight: 700,
                  color: selected === correctIndex ? "var(--emerald)" : "var(--rose)",
                }}>
                  {selected === correctIndex ? "✓ Rigtigt!" : "✗ Forkert"}
                </p>
                {q.explanation && (
                  <p style={{ margin: "6px 0 0", fontSize: 14.5, lineHeight: 1.55, color: "var(--text-dim)" }}>
                    {q.explanation}
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Bottom row */}
        <div style={{
          marginTop: 24, display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 12,
        }}>
          <a
            href={flagIssueUrl(q)}
            target="_blank"
            rel="noopener noreferrer"
            className="q-flag-link"
            style={{
              fontSize: 12.5, color: "var(--text-faint)",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >⚑ Rapportér fejl</a>
          <button
            onClick={next}
            disabled={!answered}
            style={{
              border: "none", borderRadius: 12,
              fontSize: 14.5, fontWeight: 700, padding: "11px 20px",
              transition: "opacity .14s",
              ...(answered
                ? { background: "var(--teal)", color: "#fff", cursor: "pointer" }
                : { background: "var(--surface-2)", color: "var(--text-faint)", cursor: "not-allowed" }
              ),
            }}
          >{pos + 1 >= total ? "Se resultat" : "Næste →"}</button>
        </div>
      </div>
    </div>
  );
}
