import { rawExercisesPart1, RawSectionGroup } from './rawExercises1';
import { rawExercisesPart2 } from './rawExercises2';
import { rawExercisesPart3 } from './rawExercises3';

export interface BlankSlot {
  testoPrima: string;
  opzione1: string;
  opzione2: string;
  opzioneCorretta: string;
}

export interface ExerciseItem {
  id: number;
  modulo: string;
  sezione: string;
  testoPrima: string;
  opzione1: string;
  opzione2: string;
  testoDopo: string;
  opzioneCorretta: string;
  spiegazione: string;
}

function normalizeRussian(str: string): string {
  return str.trim().toLowerCase().replace(/ё/g, 'е');
}

function matchCorrectOption(opt1: string, opt2: string, target: string): string {
  const normTarget = normalizeRussian(target);
  const norm1 = normalizeRussian(opt1);
  const norm2 = normalizeRussian(opt2);
  if (norm1 === normTarget) return opt1;
  if (norm2 === normTarget) return opt2;
  if (norm1.includes(normTarget) || normTarget.includes(norm1)) return opt1;
  if (norm2.includes(normTarget) || normTarget.includes(norm2)) return opt2;
  return opt1;
}

function buildExercisesData(groups: RawSectionGroup[]): ExerciseItem[] {
  const result: ExerciseItem[] = [];
  const choiceRegex = /\(([^()/]+?)\s*\/\s*([^()/]+?)\)/g;

  for (const group of groups) {
    for (const [id, rawSentence, rawSolution, spiegazione] of group.items) {
      const matches = Array.from(rawSentence.matchAll(choiceRegex));

      if (matches.length === 1) {
        const m = matches[0];
        const idx = m.index!;
        const opt1 = m[1].trim();
        const opt2 = m[2].trim();
        const testoPrima = rawSentence.slice(0, idx + 1);
        const testoDopo = rawSentence.slice(idx + m[0].length - 1);
        const opzioneCorretta = matchCorrectOption(opt1, opt2, rawSolution);

        result.push({
          id,
          modulo: group.modulo,
          sezione: group.sezione,
          testoPrima,
          opzione1: opt1,
          opzione2: opt2,
          testoDopo,
          opzioneCorretta,
          spiegazione: spiegazione.trim()
        });
      } else if (matches.length > 1) {
        const firstMatch = matches[0];
        const firstIdx = firstMatch.index!;
        const testoPrima = rawSentence.slice(0, firstIdx + 1);
        const testoDopo = rawSentence.slice(firstIdx + firstMatch[0].length - 1);

        const solParts = rawSolution.split(';').map((s) => s.trim());
        const correctComboParts: string[] = [];
        const altComboParts: string[] = [];

        matches.forEach((m, i) => {
          const o1 = m[1].trim();
          const o2 = m[2].trim();
          const target = solParts[i] || solParts[0] || o1;
          const corr = matchCorrectOption(o1, o2, target);
          const wrong = corr === o1 ? o2 : o1;
          correctComboParts.push(corr);
          altComboParts.push(wrong);
        });

        const correctCombo = correctComboParts.join('; ');
        const wrongCombo = altComboParts.join('; ');

        // Place options in order of the first blank's appearance
        const firstTarget = solParts[0] || firstMatch[1].trim();
        const firstCorr = matchCorrectOption(firstMatch[1].trim(), firstMatch[2].trim(), firstTarget);
        const isFirstOptCorrect = firstCorr === firstMatch[1].trim();

        const opzione1 = isFirstOptCorrect ? correctCombo : wrongCombo;
        const opzione2 = isFirstOptCorrect ? wrongCombo : correctCombo;

        result.push({
          id,
          modulo: group.modulo,
          sezione: group.sezione,
          testoPrima,
          opzione1,
          opzione2,
          testoDopo,
          opzioneCorretta: correctCombo,
          spiegazione: spiegazione.trim()
        });
      }
    }
  }

  return result;
}

export const exercisesData: ExerciseItem[] = buildExercisesData([
  ...rawExercisesPart1,
  ...rawExercisesPart2,
  ...rawExercisesPart3
]);

// Expose on window for direct inspection or scripts
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).exercisesData = exercisesData;
}
