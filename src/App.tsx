import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  BookOpen,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Search,
  Volume2,
  Bookmark,
  RotateCcw,
  Download,
  Eye,
  EyeOff,
  Shuffle,
  Layers,
  ListFilter,
  Copy,
  Check,
  Table2,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { exercisesData, ExerciseItem } from './data/exercisesData';
import {
  methodologicalIntro,
  theoryChapters,
  synopticGeneralTable,
  suffixDerivationTable,
  suppletivePairsTable,
  aktionsartTable,
  bibliographyList
} from './data/theoryAndTablesData';
import { downloadStandaloneHtmlFile } from './utils/exportSingleHtml';

type ActiveSection = 'esercizi' | 'foglio' | 'teoria' | 'tabelle' | 'dataset';
type StatusFilter = 'ALL' | 'TODO' | 'CORRECT' | 'WRONG' | 'BOOKMARKED';
type PracticeLayout = 'focus' | 'list';
type SynopticTab = 'generale' | 'suffissi' | 'suppletive' | 'aktionsart' | 'bibliografia';

const STORAGE_ANSWERS_KEY = 'vid_abu_lafia_answers_v1';
const STORAGE_BOOKMARKS_KEY = 'vid_abu_lafia_bookmarks_v1';
const STORAGE_DSA_KEY = 'vid_abu_lafia_dsa_v1';

export default function App() {
  const [activeNav, setActiveNav] = useState<ActiveSection>('esercizi');
  const [practiceLayout, setPracticeLayout] = useState<PracticeLayout>('focus');
  const [selectedModulo, setSelectedModulo] = useState<string>('ALL');
  const [selectedSezione, setSelectedSezione] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [jumpIdInput, setJumpIdInput] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [listPage, setListPage] = useState<number>(1);
  const [foglioRevealedIds, setFoglioRevealedIds] = useState<Record<number, boolean>>({});
  const [mobileFilterSheetOpen, setMobileFilterSheetOpen] = useState<boolean>(false);

  const [dsaMode, setDsaMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_DSA_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [userAnswers, setUserAnswers] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ANSWERS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [synopticTab, setSynopticTab] = useState<SynopticTab>('generale');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [confirmReset, setConfirmReset] = useState<boolean>(false);

  // Touch swipe state for mobile Focus Card navigation
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(userAnswers));
    } catch {
      // ignore storage errors
    }
  }, [userAnswers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOOKMARKS_KEY, JSON.stringify(bookmarks));
    } catch {
      // ignore storage errors
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DSA_KEY, String(dsaMode));
    } catch {
      // ignore storage errors
    }
  }, [dsaMode]);

  // Unique modules and sections
  const allModuli = useMemo(() => {
    return Array.from(new Set(exercisesData.map((e) => e.modulo)));
  }, []);

  const availableSezioni = useMemo(() => {
    const base =
      selectedModulo === 'ALL'
        ? exercisesData
        : exercisesData.filter((e) => e.modulo === selectedModulo);
    return Array.from(new Set(base.map((e) => e.sezione)));
  }, [selectedModulo]);

  // Filtered exercises
  const filteredExercises = useMemo(() => {
    return exercisesData.filter((ex) => {
      if (selectedModulo !== 'ALL' && ex.modulo !== selectedModulo) return false;
      if (selectedSezione !== 'ALL' && ex.sezione !== selectedSezione) return false;

      const ans = userAnswers[ex.id];
      if (statusFilter === 'TODO' && ans !== undefined) return false;
      if (statusFilter === 'CORRECT' && ans !== ex.opzioneCorretta) return false;
      if (statusFilter === 'WRONG' && (ans === undefined || ans === ex.opzioneCorretta)) return false;
      if (statusFilter === 'BOOKMARKED' && !bookmarks[ex.id]) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        if (/^\d+$/.test(q)) {
          return ex.id === Number(q);
        }
        const hay = `${ex.id} ${ex.modulo} ${ex.sezione} ${ex.testoPrima} ${ex.opzione1} ${ex.opzione2} ${ex.testoDopo} ${ex.spiegazione}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }

      return true;
    });
  }, [selectedModulo, selectedSezione, statusFilter, searchQuery, userAnswers, bookmarks]);

  // Keep currentIndex in bounds
  const safeIndex = useMemo(() => {
    if (filteredExercises.length === 0) return 0;
    return Math.min(currentIndex, filteredExercises.length - 1);
  }, [currentIndex, filteredExercises.length]);

  const currentExercise: ExerciseItem | undefined = filteredExercises[safeIndex];

  // Global stats
  const stats = useMemo(() => {
    let answered = 0;
    let correct = 0;
    let wrong = 0;
    for (const ex of exercisesData) {
      const a = userAnswers[ex.id];
      if (a !== undefined) {
        answered++;
        if (a === ex.opzioneCorretta) correct++;
        else wrong++;
      }
    }
    const accuracy = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { total: exercisesData.length, answered, correct, wrong, accuracy };
  }, [userAnswers]);

  const hasActiveFilters =
    selectedModulo !== 'ALL' ||
    selectedSezione !== 'ALL' ||
    statusFilter !== 'ALL' ||
    searchQuery.trim() !== '';

  const handleSelectOption = useCallback((exerciseId: number, chosenOption: string) => {
    setUserAnswers((prev) => ({ ...prev, [exerciseId]: chosenOption }));
    setFoglioRevealedIds((prev) => ({ ...prev, [exerciseId]: true }));
  }, []);

  const toggleFoglio = useCallback((exerciseId: number) => {
    setFoglioRevealedIds((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  }, []);

  const toggleBookmark = useCallback((exerciseId: number) => {
    setBookmarks((prev) => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  }, []);

  const goNext = useCallback(() => {
    if (safeIndex < filteredExercises.length - 1) {
      setCurrentIndex(safeIndex + 1);
    }
  }, [safeIndex, filteredExercises.length]);

  const goPrev = useCallback(() => {
    if (safeIndex > 0) {
      setCurrentIndex(safeIndex - 1);
    }
  }, [safeIndex]);

  const pickRandomExercise = useCallback(() => {
    if (filteredExercises.length <= 1) return;
    const nextIdx = Math.floor(Math.random() * filteredExercises.length);
    setCurrentIndex(nextIdx);
  }, [filteredExercises.length]);

  // Touch swipe handlers for mobile single-handed navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;

    // Trigger horizontal swipe only if clearly horizontal
    if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.6) {
      if (deltaX < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Keyboard shortcuts in focus view
  useEffect(() => {
    if ((activeNav !== 'esercizi' && activeNav !== 'foglio') || practiceLayout !== 'focus') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (!currentExercise) return;

      if (e.key === '1') {
        e.preventDefault();
        handleSelectOption(currentExercise.id, currentExercise.opzione1);
      } else if (e.key === '2') {
        e.preventDefault();
        handleSelectOption(currentExercise.id, currentExercise.opzione2);
      } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key.toLowerCase() === 's' || e.key === ' ') {
        e.preventDefault();
        toggleFoglio(currentExercise.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeNav, practiceLayout, currentExercise, handleSelectOption, goNext, goPrev, toggleFoglio]);

  // Speak Russian sentence via Web Speech API
  const speakRussian = useCallback((ex: ExerciseItem) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = `${ex.testoPrima.replace(/\($/, '')} ${ex.opzioneCorretta} ${ex.testoDopo.replace(/^\)/, '')}`
      .replace(/\([^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  }, []);

  const handleJumpToNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(jumpIdInput);
    if (!num || num < 1 || num > exercisesData.length) return;
    setSelectedModulo('ALL');
    setSelectedSezione('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    setCurrentIndex(num - 1);
    setListPage(Math.ceil(num / 15));
    setMobileFilterSheetOpen(false);
  };

  const handleCopyDatasetJson = () => {
    const code = `const exercisesData = ${JSON.stringify(exercisesData, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  const resetAllFilters = () => {
    setSelectedModulo('ALL');
    setSelectedSezione('ALL');
    setStatusFilter('ALL');
    setSearchQuery('');
    setCurrentIndex(0);
    setListPage(1);
  };

  // Shared Filter & Progress Panel Content (used in Desktop Right Deck + Mobile Bottom Sheet)
  const renderFilterAndStatsControls = (isMobileSheet = false) => (
    <div className="space-y-5">
      {/* Live Telemetry & Score Deck */}
      <div className={isMobileSheet ? 'pb-4 border-b border-slate-100' : 'bg-white border border-slate-200 rounded-2xl p-5'}>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold text-slate-900">Progresso di Studio</h2>
          <span className="font-mono text-xs text-slate-500 tabular-nums">
            {stats.answered} / {stats.total} svolti
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3.5">
          <div
            className="h-full bg-sky-600 transition-all duration-200"
            style={{ width: `${Math.min(100, (stats.answered / stats.total) * 100)}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center font-mono tabular-nums">
          <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="text-base sm:text-lg font-bold text-emerald-700">{stats.correct}</div>
            <div className="text-[11px] font-sans text-slate-500">Esatti</div>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="text-base sm:text-lg font-bold text-red-600">{stats.wrong}</div>
            <div className="text-[11px] font-sans text-slate-500">Da ripassare</div>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="text-base sm:text-lg font-bold text-sky-700">{stats.accuracy}%</div>
            <div className="text-[11px] font-sans text-slate-500">Precisione</div>
          </div>
        </div>

        {stats.wrong > 0 && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter('WRONG');
              setCurrentIndex(0);
              setListPage(1);
              if (isMobileSheet) setMobileFilterSheetOpen(false);
            }}
            className="mt-3 w-full min-h-[44px] py-2.5 px-3 text-xs font-semibold text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors cursor-pointer"
          >
            Ripassa subito i {stats.wrong} esercizi errati →
          </button>
        )}
      </div>

      {/* Filter & Navigation Controls */}
      <div className={isMobileSheet ? 'space-y-4' : 'bg-white border border-slate-200 rounded-2xl p-5 space-y-4'}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-sky-600" />
            <span>Selezione Modulo e Filtri</span>
          </h2>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="min-h-[36px] px-2 text-xs text-sky-700 hover:underline font-semibold cursor-pointer"
            >
              Resetta filtri
            </button>
          )}
        </div>

        {/* Modulo Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Modulo Tematico (1–10)
          </label>
          <select
            value={selectedModulo}
            onChange={(e) => {
              setSelectedModulo(e.target.value);
              setSelectedSezione('ALL');
              setCurrentIndex(0);
              setListPage(1);
            }}
            className="w-full min-h-[44px] px-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
          >
            <option value="ALL">Tutti i 10 Moduli (Esercizi 1–801)</option>
            {allModuli.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>

        {/* Sezione Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Sezione Specifica ({availableSezioni.length})
          </label>
          <select
            value={selectedSezione}
            onChange={(e) => {
              setSelectedSezione(e.target.value);
              setCurrentIndex(0);
              setListPage(1);
            }}
            className="w-full min-h-[44px] px-3 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
          >
            <option value="ALL">Tutte le sezioni del modulo</option>
            {availableSezioni.map((sez) => (
              <option key={sez} value={sez}>
                {sez}
              </option>
            ))}
          </select>
        </div>

        {/* Status Segmented Filter */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Filtra per Stato
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'ALL', label: 'Tutti (801)' },
              { id: 'TODO', label: 'Non svolti' },
              { id: 'WRONG', label: 'Errati' },
              { id: 'BOOKMARKED', label: 'Salvati ★' }
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => {
                  setStatusFilter(st.id as StatusFilter);
                  setCurrentIndex(0);
                  setListPage(1);
                }}
                className={`min-h-[44px] px-3 py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st.id
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Cerca parola russa, regola o N° esercizio
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentIndex(0);
                setListPage(1);
              }}
              placeholder="Es. нельзя, так и не, смотри не, 268..."
              className="w-full min-h-[44px] pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-600"
            />
          </div>
        </div>

        {/* Direct Jump by ID (1-801) */}
        <form onSubmit={handleJumpToNumber} className="pt-2 border-t border-slate-100 flex gap-2">
          <input
            type="number"
            min={1}
            max={801}
            value={jumpIdInput}
            onChange={(e) => setJumpIdInput(e.target.value)}
            placeholder="Vai a N° (1–801)"
            className="flex-1 min-h-[44px] px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl"
          />
          <button
            type="submit"
            className="min-h-[44px] px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer whitespace-nowrap"
          >
            Vai →
          </button>
        </form>

        {/* Reset Progress with inline two-step confirmation */}
        <div className="pt-2 border-t border-slate-100">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[40px] inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-600 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Azzera le risposte salvate</span>
            </button>
          ) : (
            <div className="flex items-center justify-between gap-2 bg-red-50 border border-red-200 p-3 rounded-xl">
              <span className="text-xs font-semibold text-red-900">Confermi l&apos;azzeramento?</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setUserAnswers({});
                    setFoglioRevealedIds({});
                    setConfirmReset(false);
                  }}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-semibold bg-red-600 text-white rounded-lg cursor-pointer"
                >
                  Sì, azzera
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="min-h-[38px] px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg cursor-pointer"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderExerciseCard = (ex: ExerciseItem, isCompactList = false) => {
    const chosen = userAnswers[ex.id];
    const isAnswered = chosen !== undefined;
    const isCorrect = chosen === ex.opzioneCorretta;
    const isFoglioOpen = Boolean(foglioRevealedIds[ex.id]) || (isAnswered && activeNav !== 'foglio');
    const isBookmarked = Boolean(bookmarks[ex.id]);

    const isNSV =
      ex.spiegazione.includes('НСВ') ||
      ex.spiegazione.toLowerCase().includes('imperfettivo');
    const isSV =
      ex.spiegazione.includes('СВ') ||
      ex.spiegazione.toLowerCase().includes('perfettivo');

    return (
      <div
        key={ex.id}
        onTouchStart={!isCompactList ? handleTouchStart : undefined}
        onTouchEnd={!isCompactList ? handleTouchEnd : undefined}
        className={`bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 transition-colors ${
          dsaMode ? 'dsa-readable border-stone-300' : ''
        }`}
      >
        {/* Unboxed clean metadata line (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-slate-100 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              Esercizio #{ex.id}
            </span>
            <span aria-hidden="true">·</span>
            <span className="truncate max-w-[200px] sm:max-w-none">{ex.modulo.split('—')[0].trim()}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 font-medium line-clamp-1">{ex.sezione}</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => speakRussian(ex)}
              title="Ascolta pronuncia russa (ru-RU)"
              className="min-h-[44px] px-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-sky-700 active:bg-slate-100 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <Volume2 className="w-4 h-4 text-sky-600" />
              <span>Ascolta</span>
            </button>
            <button
              type="button"
              onClick={() => toggleBookmark(ex.id)}
              title="Salva esercizio per ripasso"
              className={`min-h-[44px] px-2.5 inline-flex items-center gap-1 text-xs font-semibold rounded-lg active:bg-slate-100 transition-colors cursor-pointer whitespace-nowrap ${
                isBookmarked ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span className="hidden sm:inline">{isBookmarked ? 'Salvato' : 'Segna'}</span>
            </button>
          </div>
        </div>

        {/* Russian Sentence Interactive Stage (fluid wrapping for 375px screens) */}
        <div className="my-4 sm:my-6 p-4 sm:p-5 bg-slate-50/90 border border-slate-200/80 rounded-xl">
          <p
            className={`text-slate-900 ${
              dsaMode
                ? 'text-xl sm:text-2xl leading-relaxed'
                : 'text-lg sm:text-xl md:text-2xl leading-relaxed'
            } font-medium break-words`}
          >
            <span>{ex.testoPrima}</span>
            <span className="inline-flex flex-wrap items-center gap-1 mx-1 my-0.5 px-2 py-0.5 bg-white border border-slate-300 rounded-lg align-middle">
              <button
                type="button"
                onClick={() => handleSelectOption(ex.id, ex.opzione1)}
                className={`min-h-[36px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                  isAnswered
                    ? ex.opzione1 === ex.opzioneCorretta
                      ? 'bg-emerald-100 text-emerald-900 underline decoration-2 decoration-emerald-600'
                      : chosen === ex.opzione1
                      ? 'bg-red-100 text-red-900 line-through'
                      : 'text-slate-400'
                    : 'text-sky-700 hover:bg-sky-50 active:bg-sky-100'
                }`}
              >
                {ex.opzione1}
              </button>
              <span className="text-slate-400 select-none">/</span>
              <button
                type="button"
                onClick={() => handleSelectOption(ex.id, ex.opzione2)}
                className={`min-h-[36px] px-2 py-0.5 rounded font-semibold transition-colors cursor-pointer ${
                  isAnswered
                    ? ex.opzione2 === ex.opzioneCorretta
                      ? 'bg-emerald-100 text-emerald-900 underline decoration-2 decoration-emerald-600'
                      : chosen === ex.opzione2
                      ? 'bg-red-100 text-red-900 line-through'
                      : 'text-slate-400'
                    : 'text-sky-700 hover:bg-sky-50 active:bg-sky-100'
                }`}
              >
                {ex.opzione2}
              </button>
            </span>
            <span>{ex.testoDopo}</span>
          </p>
        </div>

        {/* Two Large Accessible Thumb-Zone Option Buttons (>= 52px height on mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { keyNum: '1', label: ex.opzione1 },
            { keyNum: '2', label: ex.opzione2 }
          ].map((opt) => {
            const isThisChosen = chosen === opt.label;
            const isThisCorrect = opt.label === ex.opzioneCorretta;

            let btnStyle =
              'border-slate-200 bg-white text-slate-900 hover:border-sky-600 hover:bg-sky-50/40 active:scale-[0.98]';
            let statusIcon = null;

            if (isAnswered) {
              if (isThisCorrect) {
                btnStyle = 'border-emerald-600 bg-emerald-50/90 text-emerald-950';
                statusIcon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />;
              } else if (isThisChosen && !isThisCorrect) {
                btnStyle = 'border-red-500 bg-red-50 text-red-950';
                statusIcon = <XCircle className="w-5 h-5 text-red-600 shrink-0" />;
              } else {
                btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-75';
              }
            }

            return (
              <button
                key={opt.keyNum}
                type="button"
                onClick={() => handleSelectOption(ex.id, opt.label)}
                className={`min-h-[52px] flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-xl border-2 text-left transition-all cursor-pointer ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="font-mono text-xs font-semibold text-slate-400 tabular-nums shrink-0">
                    [{opt.keyNum}]
                  </span>
                  <span className="text-base sm:text-lg font-semibold break-words">{opt.label}</span>
                </div>
                {statusIcon}
              </button>
            );
          })}
        </div>

        {/* Foglio di copertura (Methodological Sheet Cover for DSA & self-check) */}
        <div className="mt-4 sm:mt-5">
          {!isFoglioOpen ? (
            <button
              type="button"
              onClick={() => toggleFoglio(ex.id)}
              className="w-full min-h-[48px] py-3 px-4 rounded-xl border border-dashed border-sky-400 bg-sky-50/60 hover:bg-sky-100/70 active:scale-[0.99] text-sky-900 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4 text-sky-700 shrink-0" />
              <span>
                Foglio di copertura attivo — Tocca per scoprire subito la soluzione
              </span>
            </button>
          ) : (
            <div
              className={`p-4 rounded-xl border ${
                !isAnswered
                  ? 'bg-slate-50 border-slate-300 text-slate-900'
                  : isCorrect
                  ? 'bg-emerald-50/90 border-emerald-500 text-emerald-950'
                  : 'bg-red-50/90 border-red-400 text-red-950'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  {isAnswered ? (
                    isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span>● CORRETTO — Soluzione: {ex.opzioneCorretta}</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-red-700 shrink-0" />
                        <span>
                          ▲ ERRORE (hai scelto «{chosen}») — Soluzione: {ex.opzioneCorretta}
                        </span>
                      </>
                    )
                  ) : (
                    <span>Soluzione: {ex.opzioneCorretta}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600">
                  <span>
                    Aspetto:{' '}
                    <strong>
                      {isNSV && isSV
                        ? 'НСВ + СВ'
                        : isNSV
                        ? 'НСВ (Imperfettivo)'
                        : isSV
                        ? 'СВ (Perfettivo)'
                        : 'Contestuale'}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleFoglio(ex.id)}
                    className="min-h-[36px] inline-flex items-center gap-1 text-xs underline hover:text-slate-900 cursor-pointer"
                  >
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ricopri</span>
                  </button>
                </div>
              </div>
              <p className="text-sm leading-relaxed mt-1">
                <span className="font-semibold">Spiegazione: </span>
                {ex.spiegazione}
              </p>
            </div>
          )}
        </div>

        {/* Navigation Footer for Focus Mode (Thumb-zone friendly on mobile) */}
        {!isCompactList && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={safeIndex === 0}
              className="min-h-[46px] px-3.5 sm:px-4 py-2.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] rounded-xl disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Prec.</span>
            </button>

            <div className="flex flex-col items-center text-center">
              <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
                {safeIndex + 1} / {filteredExercises.length}
              </span>
              <button
                type="button"
                onClick={pickRandomExercise}
                className="inline-flex items-center gap-1 text-[11px] text-sky-700 font-medium hover:underline mt-0.5 cursor-pointer"
              >
                <Shuffle className="w-3 h-3" />
                <span>Casuale</span>
              </button>
            </div>

            <button
              type="button"
              onClick={goNext}
              disabled={safeIndex >= filteredExercises.length - 1}
              className="min-h-[46px] px-4 sm:px-5 py-2.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:scale-[0.98] rounded-xl disabled:opacity-40 cursor-pointer whitespace-nowrap"
            >
              <span>Succ.</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col pb-20 lg:pb-0 ${
        dsaMode ? 'dsa-readable' : 'bg-[#F8FAFC] text-[#0F172A]'
      }`}
    >
      {/* TOP BAR CONTRACT: Strictly 3 Zones (Brand Wordmark — 5 Nav Links — Primary Actions) */}
      <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Zone 1: Single text element Brand Wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveNav('esercizi');
          }}
          className="font-display text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 truncate"
        >
          Вид · L&apos;Aspetto Verbale Russo
        </a>

        {/* Zone 2: 5 Single-Line Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveNav('esercizi')}
            className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeNav === 'esercizi'
                ? 'border-sky-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Esercizi (801)
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('foglio')}
            className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeNav === 'foglio'
                ? 'border-sky-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Modalità Foglio DSA
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('teoria')}
            className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeNav === 'teoria'
                ? 'border-sky-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Compendio Teorico
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('tabelle')}
            className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeNav === 'tabelle'
                ? 'border-sky-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Tabelle Sinottiche
          </button>
          <button
            type="button"
            onClick={() => setActiveNav('dataset')}
            className={`py-1 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeNav === 'dataset'
                ? 'border-sky-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            Dataset JS (801)
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Touch-Friendly >= 40px) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setDsaMode((v) => !v)}
            className={`min-h-[40px] px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
              dsaMode
                ? 'bg-amber-100 border-amber-400 text-amber-950'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {dsaMode ? 'DSA: ON' : 'DSA'}
          </button>
          <button
            type="button"
            onClick={downloadStandaloneHtmlFile}
            className="min-h-[40px] inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scarica HTML Unico</span>
            <span className="sm:hidden">HTML</span>
          </button>
        </div>
      </header>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 max-w-[1380px] w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* VIEW 1 & 2: ESERCIZI & MODALITÀ FOGLIO DSA */}
        {(activeNav === 'esercizi' || activeNav === 'foglio') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT / TOP INTERACTIVE STAGE (8 columns on desktop) */}
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              {/* Compact Mobile Progress & Filter Trigger Bar + View Switcher */}
              <div className="bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                    {activeNav === 'foglio'
                      ? 'Metodo «Foglio di Copertura» (DSA)'
                      : 'Palestra Aspetto Verbale (801 Esercizi)'}
                  </h1>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                    <span>Svolti: {stats.answered}/801</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-semibold">Esatti: {stats.correct}</span>
                    {stats.wrong > 0 && (
                      <>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('WRONG');
                            setCurrentIndex(0);
                          }}
                          className="text-red-600 font-semibold underline cursor-pointer"
                        >
                          Errati: {stats.wrong}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                  {/* Mobile Bottom-Sheet Filter Trigger Button */}
                  <button
                    type="button"
                    onClick={() => setMobileFilterSheetOpen(true)}
                    className="lg:hidden min-h-[42px] px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
                    <span>Moduli & Filtri</span>
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-sky-600" />
                    )}
                  </button>

                  {/* Interactive Segmented Control: Focus vs List */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPracticeLayout('focus')}
                      className={`min-h-[34px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        practiceLayout === 'focus'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Scheda
                    </button>
                    <button
                      type="button"
                      onClick={() => setPracticeLayout('list')}
                      className={`min-h-[34px] px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                        practiceLayout === 'list'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Lista
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Exercise Stage */}
              {filteredExercises.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3">
                  <p className="text-base font-semibold text-slate-800">
                    Nessun esercizio trovato con i filtri attuali.
                  </p>
                  <p className="text-sm text-slate-500">
                    Reimposta i filtri per tornare a tutti gli 801 esercizi del volume.
                  </p>
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 cursor-pointer"
                  >
                    Mostra tutti gli 801 esercizi
                  </button>
                </div>
              ) : practiceLayout === 'focus' && currentExercise ? (
                renderExerciseCard(currentExercise, false)
              ) : (
                <div className="space-y-4">
                  {filteredExercises
                    .slice((listPage - 1) * 15, listPage * 15)
                    .map((ex) => renderExerciseCard(ex, true))}

                  {/* List Pagination */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setListPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={listPage <= 1}
                      className="min-h-[44px] px-4 py-2 text-xs font-semibold border border-slate-200 rounded-xl disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      ← Prec.
                    </button>
                    <span className="font-mono text-xs text-slate-600 tabular-nums text-center">
                      Pag. {listPage} / {Math.max(1, Math.ceil(filteredExercises.length / 15))}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setListPage((p) =>
                          Math.min(Math.ceil(filteredExercises.length / 15), p + 1)
                        );
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={listPage >= Math.ceil(filteredExercises.length / 15)}
                      className="min-h-[44px] px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-xl disabled:opacity-40 cursor-pointer whitespace-nowrap"
                    >
                      Succ. →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT CONTROL & CONCEPT DECK (Desktop Only — on Mobile it lives in the Slide-Up Bottom Sheet) */}
            <aside className="hidden lg:block lg:col-span-4">
              {renderFilterAndStatsControls(false)}
            </aside>
          </div>
        )}

        {/* VIEW 3: COMPENDIO TEORICO (CAPITOLI I–V + INTRODUZIONE METODOLOGICA) */}
        {activeNav === 'teoria' && (
          <div className="space-y-6">
            {/* Methodological Intro Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8">
              <div className="text-xs text-slate-500 mb-2">
                <span className="font-semibold text-slate-700">{methodologicalIntro.autore}</span>
                <span className="mx-2">·</span>
                <span className="italic">{methodologicalIntro.dedica}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
                {methodologicalIntro.titolo}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 border-t border-slate-100">
                {methodologicalIntro.sezioni.map((s) => (
                  <div key={s.titolo} className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900">{s.titolo}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{s.testo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Chapters */}
            <div className="space-y-5">
              {theoryChapters.map((cap) => (
                <section
                  key={cap.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-8 space-y-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <div className="text-xs font-mono font-semibold text-sky-700">
                        {cap.numero}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">
                        {cap.titolo}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">{cap.sottotitolo}</p>
                    </div>
                    {cap.moduloCollegato && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModulo(cap.moduloCollegato!);
                          setSelectedSezione('ALL');
                          setCurrentIndex(0);
                          setActiveNav('esercizi');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-h-[44px] w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-xl cursor-pointer whitespace-nowrap"
                      >
                        Esercitati su questo Modulo →
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {cap.paragrafi.map((par) => (
                      <div key={par.codice} className="space-y-3">
                        <h3 className="text-base font-bold text-slate-900">
                          {par.codice} — {par.titolo}
                        </h3>
                        {par.contenuto.map((c, idx) => (
                          <p key={idx} className="text-sm text-slate-700 leading-relaxed max-w-[75ch]">
                            {c}
                          </p>
                        ))}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          {par.esempi.map((es, i) => (
                            <div
                              key={i}
                              className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1"
                            >
                              <div className="text-sm font-semibold text-slate-900">{es.russo}</div>
                              <div className="text-xs text-slate-600 italic">{es.italiano}</div>
                              <div className="text-[11px] font-mono text-sky-800">{es.nota}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: TABELLE SINOTTICHE E AKTIONSARTEN (Mobile-First Stacked Cards + Desktop Table) */}
        {activeNav === 'tabelle' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Tabelle Sinottiche e Aktionsarten
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Quadri di consultazione rapida tratti dal volume (pp. 34–36 e pp. 152–160)
                </p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Filtra nelle tabelle..."
                  className="w-full min-h-[42px] pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Horizontal Touch-Friendly Sub-Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-slate-100 rounded-xl">
              {[
                { id: 'generale', label: '1. Sintagmatica' },
                { id: 'suffissi', label: '2. Suffissi & Apofonia' },
                { id: 'suppletive', label: '3. Suppletive' },
                { id: 'aktionsart', label: '4. Aktionsarten' },
                { id: 'bibliografia', label: '5. Bibliografia' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSynopticTab(t.id as SynopticTab)}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    synopticTab === t.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Table 1: Synoptic General */}
            {synopticTab === 'generale' && (
              <>
                {/* Mobile Stacked Cards (< md) */}
                <div className="md:hidden space-y-3">
                  {synopticGeneralTable
                    .filter((r) =>
                      !tableSearch.trim()
                        ? true
                        : `${r.contesto} ${r.regola} ${r.esempio} ${r.valore}`
                            .toLowerCase()
                            .includes(tableSearch.toLowerCase())
                    )
                    .map((row, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                        <div className="font-bold text-slate-900 text-sm">{row.contesto}</div>
                        <div className="font-mono text-xs font-semibold text-sky-800">{row.regola}</div>
                        <div className="text-sm font-medium text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200/70">
                          {row.esempio}
                        </div>
                        <div className="text-xs text-slate-600">{row.valore}</div>
                      </div>
                    ))}
                </div>

                {/* Desktop Table (md+) */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-xs text-slate-500 bg-slate-50">
                        <th className="py-3 px-4 font-semibold">Contesto Sintattico / Morfologico</th>
                        <th className="py-3 px-4 font-semibold">Regola Operativa</th>
                        <th className="py-3 px-4 font-semibold">Esempio in Russo</th>
                        <th className="py-3 px-4 font-semibold">Valore Semantico e Pragmatico</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {synopticGeneralTable
                        .filter((r) =>
                          !tableSearch.trim()
                            ? true
                            : `${r.contesto} ${r.regola} ${r.esempio} ${r.valore}`
                                .toLowerCase()
                                .includes(tableSearch.toLowerCase())
                        )
                        .map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4 font-semibold text-slate-900">{row.contesto}</td>
                            <td className="py-3 px-4 font-mono text-xs text-sky-800">{row.regola}</td>
                            <td className="py-3 px-4 font-medium text-slate-800">{row.esempio}</td>
                            <td className="py-3 px-4 text-slate-600">{row.valore}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Table 2: Suffix Derivation */}
            {synopticTab === 'suffissi' && (
              <div className="space-y-3">
                {suffixDerivationTable.map((row, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="font-bold text-slate-900 text-sm">{row.modello}</div>
                    <div className="text-xs text-slate-600">{row.strutturaCB}</div>
                    <div className="text-sm font-semibold text-sky-900 bg-white p-2.5 rounded-lg border border-slate-200/80">
                      {row.esempi}
                    </div>
                    <div className="text-xs text-slate-600">{row.note}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Table 3: Suppletive Pairs */}
            {synopticTab === 'suppletive' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suppletivePairsTable.map((row, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold text-slate-900">
                        {row.nsv} (НСВ) / <span className="text-sky-700">{row.sv} (СВ)</span>
                      </span>
                      <span className="text-xs italic text-slate-600">{row.traduzione}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{row.note}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Table 4: Aktionsart */}
            {synopticTab === 'aktionsart' && (
              <div className="space-y-3">
                {aktionsartTable.map((row, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-slate-900 text-sm">{row.modo}</span>
                      <span className="font-mono text-xs font-semibold text-sky-800">{row.prefisso}</span>
                    </div>
                    <p className="text-xs text-slate-700">{row.significato}</p>
                    <div className="text-xs font-medium text-slate-900 bg-white p-2.5 rounded-lg border border-slate-200/70">
                      {row.esempi}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 5: Bibliography */}
            {synopticTab === 'bibliografia' && (
              <div className="space-y-3">
                {bibliographyList.map((b, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="font-bold text-slate-900 text-sm">{b.autore}</div>
                    <div className="text-sm text-sky-900 font-medium mt-0.5">{b.opera}</div>
                    <div className="text-xs text-slate-600 mt-1">{b.descrizione}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: DATASET JS */}
        {activeNav === 'dataset' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Dataset `exercisesData` ({exercisesData.length} Esercizi)
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Array JavaScript completo conforme alla struttura richiesta (`id`, `modulo`, `sezione`, `testoPrima`, `opzione1`, `opzione2`, `testoDopo`, `opzioneCorretta`, `spiegazione`).
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyDatasetJson}
                  className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl cursor-pointer"
                >
                  {copiedJson ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedJson ? 'Copiato!' : 'Copia Array JS'}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadStandaloneHtmlFile}
                  className="flex-1 sm:flex-initial min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Scarica File HTML Unico</span>
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto max-h-[460px]">
              <pre>{`const exercisesData = ${JSON.stringify(exercisesData.slice(0, 20), null, 2)}\n// ... + altri ${exercisesData.length - 20} esercizi (totale: ${exercisesData.length} esercizi integrali)`}</pre>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM SHEET DRAWER FOR FILTERS & MODULE SELECTION (Pattern 3) */}
      {mobileFilterSheetOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs">
          <div
            className="flex-1"
            onClick={() => setMobileFilterSheetOpen(false)}
          />
          <div className="bg-white rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Drag Handle & Header */}
            <div className="pt-2 pb-3 px-5 border-b border-slate-100 flex items-center justify-between">
              <div className="w-10 h-1.5 bg-slate-300 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2.5" />
              <span className="text-sm font-bold text-slate-900 mt-2">
                Moduli, Filtri e Avanzamento
              </span>
              <button
                type="button"
                onClick={() => setMobileFilterSheetOpen(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-500 hover:text-slate-900 rounded-full cursor-pointer mt-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-5 overflow-y-auto flex-1">
              {renderFilterAndStatsControls(true)}
            </div>

            {/* Sticky Sheet Action CTA */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setMobileFilterSheetOpen(false)}
                className="w-full min-h-[48px] rounded-xl bg-sky-600 text-white font-semibold text-sm flex items-center justify-center shadow-md active:scale-[0.98] transition-transform cursor-pointer"
              >
                Mostra {filteredExercises.length} esercizi selezionati
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FIXED MOBILE BOTTOM TAB BAR (Pattern 1 — Natural Thumb Zone) */}
      <nav
        aria-label="Navigazione principale mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-5 items-center"
      >
        <button
          type="button"
          onClick={() => {
            setActiveNav('esercizi');
            setMobileFilterSheetOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center cursor-pointer ${
            activeNav === 'esercizi' && !mobileFilterSheetOpen
              ? 'text-sky-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Esercizi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveNav('foglio');
            setMobileFilterSheetOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center cursor-pointer ${
            activeNav === 'foglio' && !mobileFilterSheetOpen
              ? 'text-sky-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <Eye className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Foglio DSA</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileFilterSheetOpen((o) => !o)}
          className={`h-full flex flex-col items-center justify-center relative cursor-pointer ${
            mobileFilterSheetOpen ? 'text-sky-600 font-semibold' : 'text-slate-500'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Filtri</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-sky-600 absolute top-2.5 right-1/3" />
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveNav('teoria');
            setMobileFilterSheetOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center cursor-pointer ${
            activeNav === 'teoria' && !mobileFilterSheetOpen
              ? 'text-sky-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Teoria</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveNav('tabelle');
            setMobileFilterSheetOpen(false);
          }}
          className={`h-full flex flex-col items-center justify-center cursor-pointer ${
            activeNav === 'tabelle' && !mobileFilterSheetOpen
              ? 'text-sky-600 font-semibold'
              : 'text-slate-500'
          }`}
        >
          <Table2 className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">Tabelle</span>
        </button>
      </nav>

      {/* Quiet Editorial Footer (Desktop) */}
      <footer className="hidden lg:block border-t border-slate-200 bg-white px-6 py-4 mt-12">
        <div className="max-w-[1380px] mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            L.G. Abu Lafia — <em>L&apos;aspetto verbale russo: Teoria ed esercizi per studenti italiani</em> (10 Moduli · 801 Esercizi)
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveNav('dataset')}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Ispeziona Array JS (801)
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={downloadStandaloneHtmlFile}
              className="hover:text-slate-900 underline cursor-pointer"
            >
              Esporta singolo file HTML offline
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
