import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const questionsDir = join(__dirname, "../src/questions");

const LETTERS = ["A", "B", "C", "D", "E", "F"];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const files = readdirSync(questionsDir).filter((f) => f.endsWith(".json"));

let totalQuestions = 0;
let alreadyNonA = 0;

for (const file of files) {
  const path = join(questionsDir, file);
  const questions = JSON.parse(readFileSync(path, "utf8"));

  const updated = questions.map((q) => {
    const correctIndex = LETTERS.indexOf(String(q.correct).trim().toUpperCase());
    if (correctIndex < 0 || correctIndex >= q.options.length) return q;

    const correctOption = q.options[correctIndex];

    const newOptions = shuffle(q.options);

    const newCorrectIndex = newOptions.indexOf(correctOption);
    return { ...q, options: newOptions, correct: LETTERS[newCorrectIndex] };
  });

  const before = questions.filter((q) => q.correct !== "A").length;
  alreadyNonA += before;
  totalQuestions += questions.length;

  writeFileSync(path, JSON.stringify(updated, null, 2) + "\n", "utf8");
  console.log(`✓ ${file} (${questions.length} questions)`);
}

console.log(`\nDone. ${totalQuestions} questions updated across ${files.length} files.`);
