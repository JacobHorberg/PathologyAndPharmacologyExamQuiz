import { useState, useEffect, useCallback, useMemo } from "react";
import basalPatologi from "./questions/basal-patologi.json";
import lungesygdomme from "./questions/lungesygdomme.json";
import neurologi from "./questions/neurologi.json";
import psykiatri from "./questions/psykiatri.json";

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
];

/* ============================================================================
   Below is the quiz engine. You normally don't need to touch anything here.
   ============================================================================ */

const LETTERS = ["A", "B", "C", "D", "E", "F"];
const ALL = "__ALLE_EMNER__";

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
  // Build the list of topics (name + count), in first-seen order.
  const topics = useMemo(() => {
    const map = new Map();
    QUESTIONS.forEach((q) => {
      const t = topicOf(q);
      map.set(t, (map.get(t) || 0) + 1);
    });
    return [...map.entries()].map(([name, count]) => ({ name, count }));
  }, []);

  const [screen, setScreen] = useState("menu"); // "menu" | "quiz" | "summary"
  const [shuffleOn, setShuffleOn] = useState(false);
  const [activeTopic, setActiveTopic] = useState(ALL);
  const [deck, setDeck] = useState([]);
  const [pos, setPos] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });

  const total = deck.length;
  const q = total > 0 && pos < total ? deck[pos] : null;
  const correctIndex = q
    ? LETTERS.indexOf(String(q.correct).trim().toUpperCase())
    : -1;
  const malformed =
    q && (correctIndex < 0 || correctIndex >= (q.options?.length ?? 0));
  const answered = selected !== null;

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
      setScreen("quiz");
    },
    [buildDeck]
  );

  const handleAnswer = useCallback(
    (i) => {
      if (answered || malformed) return;
      setSelected(i);
      setScore((s) =>
        i === correctIndex
          ? { ...s, correct: s.correct + 1 }
          : { ...s, wrong: s.wrong + 1 }
      );
    },
    [answered, malformed, correctIndex]
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

  const topicLabel = activeTopic === ALL ? "Alle emner" : activeTopic;

  // ---------- Empty state ----------
  if (QUESTIONS.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-slate-800 mb-2">
            Ingen spørgsmål endnu
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Tilføj spørgsmål i <span className="font-mono">QUESTIONS</span>-listen
            øverst i koden, så dukker de op her.
          </p>
        </div>
      </div>
    );
  }

  // ---------- Menu screen ----------
  if (screen === "menu") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6">
        <div className="w-full max-w-xl">
          <header className="mb-6 pt-2">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800">
              Patologi &amp; Farmakologi
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Vælg et emne at træne.
            </p>
          </header>

          <label className="mb-4 flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={shuffleOn}
              onChange={(e) => setShuffleOn(e.target.checked)}
              className="h-4 w-4 accent-teal-700"
            />
            Bland spørgsmålenes rækkefølge
          </label>

          {/* All topics */}
          <button
            onClick={() => startTopic(ALL, shuffleOn)}
            className="w-full mb-3 flex items-center justify-between rounded-2xl border border-teal-200 bg-teal-50 px-5 py-4 text-left hover:bg-teal-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          >
            <span>
              <span className="block font-semibold text-teal-900">
                Alle emner
              </span>
              <span className="block text-xs text-teal-700 mt-0.5">
                Alle {QUESTIONS.length} spørgsmål blandet sammen
              </span>
            </span>
            <span className="text-teal-700 text-xl" aria-hidden>
              →
            </span>
          </button>

          {/* Topic list */}
          <div className="flex flex-col gap-2">
            {topics.map((t) => (
              <button
                key={t.name}
                onClick={() => startTopic(t.name, shuffleOn)}
                className="w-full flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-left hover:border-teal-400 hover:bg-teal-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <span className="font-medium text-slate-800">{t.name}</span>
                <span className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {t.count} {t.count === 1 ? "spørgsmål" : "spørgsmål"}
                  </span>
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ---------- Summary screen ----------
  if (screen === "summary") {
    const pct = total > 0 ? Math.round((score.correct / total) * 100) : 0;
    const radius = 52;
    const circ = 2 * Math.PI * radius;
    const dash = (pct / 100) * circ;
    const message =
      pct >= 80
        ? "Flot! Du er godt klædt på."
        : pct >= 50
        ? "Godt på vej — kør en runde til."
        : "Bare rolig — repetition gør mester. Prøv igen.";

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <p className="text-sm font-medium uppercase tracking-wide text-teal-700 mb-1">
            Resultat
          </p>
          <p className="text-xs text-slate-400 mb-6">{topicLabel}</p>

          <div className="flex justify-center mb-6">
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#0d9488"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                transform="rotate(-90 70 70)"
              />
              <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fontSize="30" fontWeight="700" fill="#1e293b">
                {pct}%
              </text>
            </svg>
          </div>

          <p className="text-slate-800 text-lg font-medium mb-1">
            {score.correct} af {total} rigtige
          </p>
          <p className="text-slate-500 text-sm mb-8">{message}</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => startTopic(activeTopic, shuffleOn)}
              className="w-full rounded-xl bg-teal-700 px-4 py-3 text-white font-medium hover:bg-teal-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Tag samme emne igen
            </button>
            <button
              onClick={() => setScreen("menu")}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-700 font-medium hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              Vælg andet emne
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Quiz screen ----------
  const progressPct = ((pos + (answered ? 1 : 0)) / total) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-6">
      <div className="w-full max-w-xl">
        <header className="mb-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <button
              onClick={() => setScreen("menu")}
              className="text-sm text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
            >
              <span aria-hidden>←</span> {topicLabel}
            </button>
            <div className="flex items-center gap-3 text-sm shrink-0">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {score.correct}
              </span>
              <span className="inline-flex items-center gap-1 font-medium text-rose-600">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                {score.wrong}
              </span>
            </div>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full bg-teal-600 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="mt-2 block text-xs text-slate-500">
            Spørgsmål {pos + 1} af {total}
          </span>
        </header>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          {malformed ? (
            <p className="text-rose-600 text-sm">
              Dette spørgsmål er sat forkert op: det rigtige svar ("
              {String(q.correct)}") passer ikke til svarmulighederne. Tjek{" "}
              <span className="font-mono">correct</span> for dette spørgsmål i koden.
            </p>
          ) : (
            <>
              <h2 className="text-lg sm:text-xl font-medium text-slate-800 leading-snug mb-5">
                {q.question}
              </h2>

              <div className="flex flex-col gap-2.5">
                {q.options.map((opt, i) => {
                  const isCorrect = i === correctIndex;
                  const isPicked = i === selected;

                  let cls = "border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50";
                  if (answered) {
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-50";
                    else if (isPicked) cls = "border-rose-400 bg-rose-50";
                    else cls = "border-slate-200 bg-white opacity-60";
                  }

                  let badgeCls = "bg-slate-100 text-slate-500";
                  if (answered && isCorrect) badgeCls = "bg-emerald-500 text-white";
                  else if (answered && isPicked) badgeCls = "bg-rose-500 text-white";

                  return (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      disabled={answered}
                      className={`flex items-start gap-3 w-full text-left rounded-xl border px-4 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${cls} ${
                        answered ? "cursor-default" : "cursor-pointer"
                      }`}
                    >
                      <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${badgeCls}`}>
                        {LETTERS[i]}
                      </span>
                      <span className="text-slate-800 text-sm sm:text-base leading-snug">
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {answered && (
                <div className="mt-5" aria-live="polite">
                  <p className={`text-sm font-semibold mb-1 ${selected === correctIndex ? "text-emerald-700" : "text-rose-600"}`}>
                    {selected === correctIndex ? "Rigtigt!" : "Forkert"}
                  </p>
                  {q.explanation && (
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {answered ? "Tryk Enter for næste" : "Vælg et svar"}
            </span>
            <button
              onClick={next}
              disabled={!answered}
              className="rounded-xl bg-teal-700 px-5 py-2.5 text-white text-sm font-medium hover:bg-teal-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {pos + 1 >= total ? "Se resultat" : "Næste"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
