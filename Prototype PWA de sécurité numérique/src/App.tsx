import { useEffect, useRef, useState } from "react";
import quizContent from "./content/quiz.json";
import teamQuizContent from "./content/quiz-equipes.json";
import vopContent from "./content/vrai-ou-piege.json";
import defisContent from "./content/defis.json";

type Screen =
  | "welcome"
  | "language"
  | "intro"
  | "character"
  | "home"
  | "story"
  | "scenarios"
  | "play"
  | "vop"
  | "equipes"
  | "multi"
  | "defis"
  | "mot"
  | "fake-login"
  | "phishing"
  | "resources"
  | "help"
  | "quiz"
  | "quiz-result"
  | "guide"
  | "progress"
  | "privacy"
  | "legal"
  | "install"
  | "settings"
  | "alert"
  | "carnet"
  | "alert-result";

type IconName =
  | "arrow"
  | "back"
  | "book"
  | "check"
  | "chevron"
  | "download"
  | "exit"
  | "eye"
  | "help"
  | "home"
  | "lock"
  | "menu"
  | "message"
  | "more"
  | "offline"
  | "play"
  | "search"
  | "settings"
  | "shield"
  | "spark"
  | "user"
  | "warning";

const icons: Record<IconName, React.ReactNode> = {
  arrow: (
    <>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </>
  ),
  back: <path d="m15 18-6-6 6-6" />,
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5" />
      <path d="M5 20h14" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.7 9a2.5 2.5 0 1 1 3.2 2.4c-.8.3-.9.9-.9 1.6m0 3h.01" />
    </>
  ),
  home: (
    <>
      <path d="m3 11 9-8 9 8" />
      <path d="M5 10v10h14V10M9 20v-6h6v6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </>
  ),
  message: <path d="M4 5h16v12H8l-4 4z" />,
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  offline: (
    <>
      <path d="m3 3 18 18M8.5 8.5A6 6 0 0 1 18 13M5 9a10 10 0 0 1 .9-.9M2 5a14 14 0 0 1 18.5 1" />
      <path d="M12 18h.01" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 4 6v5c0 5 3.4 8.4 8 10 4.6-1.6 8-5 8-10V6z" />
      <path d="m9 12 2 2 4-5" />
    </>
  ),
  spark: (
    <>
      <path d="m12 3 1.4 4.1L17 9l-3.6 1.9L12 15l-1.4-4.1L7 9l3.6-1.9z" />
      <path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  warning: (
    <>
      <path d="M12 3 2.5 20h19z" />
      <path d="M12 9v5m0 3h.01" />
    </>
  ),
  exit: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M10 16l-4-4 4-4M6 12h10" />
    </>
  ),
};

// ---------------------------------------------------------------------------
// Quick exit. One tap leaves for a neutral page and replaces Ayidote in the
// tab's history, so « Retour » does not bring it back. Optionally, it also
// wipes what Ayidote keeps on the phone first. The Escape key does the same.
// ---------------------------------------------------------------------------
const QUICK_EXIT_URL = "https://www.google.com/search?q=m%C3%A9t%C3%A9o+Cotonou";

/** Removes the voice clips kept for offline use (they reveal the language chosen). */
function clearOfflineAudio() {
  if (!("caches" in window)) return Promise.resolve();
  return caches
    .keys()
    .then((keys) =>
      Promise.all(
        keys.map((key) =>
          caches.open(key).then((cache) =>
            cache
              .keys()
              .then((requests) =>
                Promise.all(
                  requests
                    .filter((r) => /\.(mp3|m4a|ogg|wav)(\?|$)/i.test(r.url))
                    .map((r) => cache.delete(r)),
                ),
              ),
          ),
        ),
      ),
    )
    .then(() => undefined)
    .catch(() => undefined);
}

function quickExit() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // nothing to stop
  }
  const wipe = localStorage.getItem("naya-exit-erase") === "yes";
  const leave = () => window.location.replace(QUICK_EXIT_URL);
  if (!wipe) return leave();
  localStorage.clear();
  localStorage.setItem("naya-exit-erase", "yes");
  // Leave even if clearing the cache is slow: safety first.
  window.setTimeout(leave, 400);
  clearOfflineAudio().then(leave);
}

function QuickExitButton({ light = false }: { light?: boolean }) {
  return (
    <button
      className={`quick-exit ${light ? "light" : ""}`}
      onClick={quickExit}
      aria-label="Quitter vite Ayidote"
      title="Quitter vite (touche Échap)"
    >
      <Icon name="exit" size={18} />
      <span>Quitter</span>
    </button>
  );
}

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icons[name]}
    </svg>
  );
}

const portraitColors: Record<string, string[]> = {
  afi: ["#B96E56", "#49372D", "#F58232"],
  maya: ["#D58C72", "#49372D", "#FFB36B"],
  kevin: ["#A8705A", "#49372d", "#E8DCCB"],
  rh: ["#A8705A", "#49372d", "#E8DCCB"],
  chantal: ["#C17F63", "#49372D", "#f5efe6"],
};

function Portrait({ person = "afi", small = false }: { person?: string; small?: boolean }) {
  const colors = portraitColors[person] ?? portraitColors.afi;
  return (
    <div className={`portrait ${small ? "portrait-small" : ""}`} style={{ background: colors[2] }}>
      <svg viewBox="0 0 120 120" role="img" aria-label={`Portrait illustré de ${person}`}>
        <circle cx="60" cy="48" r="27" fill={colors[0]} />
        <path
          d="M29 49c0-25 14-39 32-39 21 0 34 17 31 43-8-8-14-18-15-27-11 11-27 17-48 17z"
          fill={colors[1]}
        />
        {person === "maya" && (
          <path
            d="M33 40C17 42 18 17 35 19c1-17 24-14 25 0 13-13 31 2 23 15 18 1 17 24 2 26"
            fill="none"
            stroke={colors[1]}
            strokeWidth="12"
            strokeLinecap="round"
          />
        )}
        {person === "kevin" && (
          <path d="M34 33c8-25 50-29 57 7-18-8-38-10-57-7z" fill={colors[1]} />
        )}
        <circle cx="50" cy="51" r="2" fill="#49372d" />
        <circle cx="70" cy="51" r="2" fill="#49372d" />
        <path
          d="M54 63c4 3 8 3 12 0"
          fill="none"
          stroke="#49372dd9"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M18 120c2-30 18-44 42-44s40 14 42 44" fill={colors[1]} />
        <path d="M51 76 60 91l9-15" fill="#f5efe6" />
      </svg>
    </div>
  );
}

function Button({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: IconName;
  disabled?: boolean;
}) {
  return (
    <button className={`button ${variant}`} onClick={onClick} disabled={disabled}>
      {children}
      {icon && <Icon name={icon} />}
    </button>
  );
}

function TopBar({
  title,
  onBack,
  action,
}: {
  title: string;
  onBack: () => void;
  action?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <button className="icon-button" onClick={onBack} aria-label="Retour">
        <Icon name="back" />
      </button>
      <strong>{title}</strong>
      <div className="top-action">{action ?? <QuickExitButton />}</div>
    </header>
  );
}

function OfflinePill() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return (
    <span className="offline-pill">
      <Icon name={online ? "check" : "offline"} size={14} />
      {online ? "Disponible hors ligne" : "Mode hors connexion"}
    </span>
  );
}

type StoryChoice = {
  label: string;
  protective: boolean;
  outcome: string;
  advice: string;
  /** Reflex cards (indexes in `reflexes`) this protective choice unlocks. */
  reflexes?: number[];
};
type Contact = { name: string; status: string; portrait: string };
type Attachment = {
  label: string;
  url: string;
  cta: string;
  pageUrl: string;
  pageTitle: string;
  pageText: string;
  clue: string;
};
type StoryStep = {
  chapter: string;
  messages: string[][];
  header?: Partial<Contact>;
  danger?: boolean;
  attachment?: Attachment;
  choices: StoryChoice[];
  feedback: string;
};
/** Theme word of a story, to guess in "Le mot du jour". */
type DailyWord = {
  mot: string;
  lecon: string;
  indices: string[];
  /** Words very close to the answer, then loosely related ones. */
  chaud: string[];
  tiede: string[];
};
type Scenario = {
  id: string;
  order: number;
  title: string;
  profile: string;
  summary: string;
  source: "équipe" | "ia";
  relu: boolean;
  mot?: DailyWord;
  contact: Contact;
  steps: StoryStep[];
};

// Every file in src/content/scenarios is a playable story. Adding a scenario
// (written by the team or generated by AI, then reviewed) is just adding a
// file; `pnpm verifier:scenarios` checks its structure and the safety rules.
const scenarios = Object.values(
  import.meta.glob<Scenario>("./content/scenarios/*.json", { eager: true, import: "default" }),
).sort((a, b) => a.order - b.order);

function readDone(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem("naya-done") || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

/** Number of the current local day; it changes at midnight. */
function today(): number {
  const now = new Date();
  return Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 86400000);
}

/** A different story is put forward each day, from the reviewed pool. */
function dailyScenario(): Scenario {
  return scenarios[today() % scenarios.length];
}

// "Le mot du jour": the word to find is the theme of the story of the day.
// Closeness comes from two hand-written lists per word (very close, loosely
// related), so the game needs no network and no language model.
type WordGame = { day: number; guesses: string[]; hints: number; found: boolean; revealed: boolean };
type Heat = "found" | "hot" | "warm" | "cold";

/** "Mots de Passe " -> "motdepasse": case, accents, spaces and plural ignored. */
function plainWord(word: string): string {
  const plain = word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^a-z]/g, "");
  return plain.length > 3 ? plain.replace(/[sx]$/, "") : plain;
}

function heatOf(guess: string, word: DailyWord): Heat {
  const plain = plainWord(guess);
  if (plain === plainWord(word.mot)) return "found";
  if (word.chaud.some((w) => plainWord(w) === plain)) return "hot";
  if (word.tiede.some((w) => plainWord(w) === plain)) return "warm";
  return "cold";
}

function readWordGame(): WordGame {
  const fresh = { day: today(), guesses: [], hints: 0, found: false, revealed: false };
  try {
    const value = JSON.parse(localStorage.getItem("naya-mot") || "null");
    if (value && value.day === fresh.day && Array.isArray(value.guesses))
      return { ...fresh, ...value };
  } catch {
    // start a new game
  }
  return fresh;
}

const profiles = [...new Set(scenarios.map((s) => s.profile))];

const START_PRESSURE = 30;
const clampPressure = (value: number) => Math.min(100, Math.max(5, value));

function readUnlocked(): number[] {
  try {
    const value = JSON.parse(localStorage.getItem("naya-reflexes") || "[]");
    return Array.isArray(value) ? value.filter((n) => Number.isInteger(n) && n >= 0 && n < 6) : [];
  } catch {
    return [];
  }
}

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function vibrate(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Vibration is a bonus; some browsers refuse it.
  }
}

const quiz = quizContent as { q: string; a: string[]; correct: number; why: string }[];

// Discreet alert. Everything here is fictional on purpose: preset contacts,
// preset messages and a made-up location. Nothing is ever sent.
const alertContacts = [
  { id: "rose", name: "Rose", role: "ta sœur", portrait: "chantal" },
  { id: "mariam", name: "Mariam", role: "ton amie", portrait: "afi" },
  { id: "ida", name: "Tante Ida", role: "ta tante", portrait: "rh" },
];
const alertMessages = [
  "J’ai besoin d’aide. Voici où je suis.",
  "Appelle-moi tout de suite, s’il te plaît.",
  "Viens me chercher. Voici où je suis.",
];
type AlertConfig = { contacts: string[]; message: number };

function readAlertConfig(): AlertConfig {
  try {
    const value = JSON.parse(localStorage.getItem("naya-alert") || "null");
    if (value && Array.isArray(value.contacts) && Number.isInteger(value.message))
      return {
        contacts: value.contacts.filter((id: string) => alertContacts.some((c) => c.id === id)),
        message: Math.min(Math.max(value.message, 0), alertMessages.length - 1),
      };
  } catch {
    // fall through to the empty configuration
  }
  return { contacts: [], message: 0 };
}

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

/** Says `text`. With `queue`, it waits for what is already being said. */
function speak(text: string, queue = false) {
  if (!canSpeak || !text) return;
  if (!queue) window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

// Languages. French is the source text. A local language comes with:
//   src/content/langues/<langue>.json   the translated texts, by key
//   src/content/audio/<langue>/<dossier>/<clé>.mp3   the matching voice clips
// Keys: <scénario>.m<situation>-<message> (message), .c<s>-<n> (answer),
// .o<s>-<n> (what happens), .a<s>-<n> (advice), .f<s> (to remember),
// .cta<s> (link button), and ui.<nom> for the few instructions.
// scripts/generer-voix.py makes the French clips, scripts/langue-locale.py the
// translations and clips of a local language. A language shows up in the app
// as soon as it has clips; anything missing falls back to French.
type Lang = "fr" | "fon" | "yo" | "mina";
const langNames: Record<Lang, string> = { fr: "Français", fon: "Fon", yo: "Yoruba", mina: "Mina" };
const localLangs: Lang[] = ["fon", "yo", "mina"];

const clips: Record<string, string> = {};
for (const [file, url] of Object.entries(
  import.meta.glob<string>("./content/audio/*/*/*.{mp3,m4a,ogg,wav,webm,aac}", {
    eager: true,
    query: "?url",
    import: "default",
  }),
)) {
  const match = file.match(/audio\/([^/]+)\/([^/]+)\/([\w-]+)\.\w+$/);
  if (match) clips[`${match[1]}/${match[2]}.${match[3]}`] = url;
}

const translations: Partial<Record<Lang, Record<string, string>>> = {};
for (const [file, data] of Object.entries(
  import.meta.glob<{ textes: Record<string, string> }>("./content/langues/*.json", {
    eager: true,
    import: "default",
  }),
)) {
  const match = file.match(/langues\/(\w+)\.json$/);
  if (match) translations[match[1] as Lang] = data.textes;
}

const canPlay = typeof Audio !== "undefined";
const recordedLangs = localLangs.filter(
  (lang) => canPlay && Object.keys(clips).some((key) => key.startsWith(`${lang}/`)),
);
const canListen = canSpeak || (canPlay && Object.keys(clips).length > 0);

/** Text of `key` in a local language, or undefined (then French is shown). */
function tr(lang: Lang, key: string): string | undefined {
  return lang === "fr" ? undefined : translations[lang]?.[key];
}

/** Clip of `key` in `lang`, else in French when `frFallback`. */
function clipOf(lang: Lang, key: string, frFallback = true): string | undefined {
  if (!canPlay) return undefined;
  return clips[`${lang}/${key}`] ?? (frFallback ? clips[`fr/${key}`] : undefined);
}

function readLang(): Lang {
  const saved = localStorage.getItem("naya-lang") as Lang | null;
  return saved && recordedLangs.includes(saved) ? saved : "fr";
}

// Clips play one after the other. Each can announce itself (to highlight the
// answer being read), and the queue says when it is done.
type Clip = { url?: string; onStart?: () => void };
const clipQueue: Clip[] = [];
let player: HTMLAudioElement | null = null;
let onDrain: (() => void) | null = null;

function playNextClip() {
  const item = clipQueue.shift();
  if (!item) {
    player = null;
    const done = onDrain;
    onDrain = null;
    done?.();
    return;
  }
  item.onStart?.();
  if (!item.url) {
    playNextClip();
    return;
  }
  const current = new Audio(item.url);
  player = current;
  let over = false;
  const advance = () => {
    if (over || player !== current) return;
    over = true;
    playNextClip();
  };
  current.onended = advance;
  current.onerror = advance;
  current.play().catch(advance);
}

/** Plays clips after what is already playing, or instead of it with `replace`. */
function playClips(items: Clip[], replace = false, drained?: () => void) {
  if (replace) stopSpeaking();
  clipQueue.push(...items.filter((item) => item.url || item.onStart));
  if (drained) onDrain = drained;
  if (!player) playNextClip();
}

/**
 * Voice of one story message: the clip in the chosen language, else the French
 * clip, else the phone's own synthetic voice.
 */
function sayMessage(lang: Lang, scenarioId: string, step: number, index: number, text: string) {
  const url = clipOf(lang, `${scenarioId}.m${step + 1}-${index + 1}`);
  if (!url) {
    speak(text, true);
    return;
  }
  playClips([{ url }]);
}

function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
  clipQueue.length = 0;
  onDrain = null;
  player?.pause();
  player = null;
}

// Installation as an app (PWA). Android/Chrome offers a native prompt; other
// browsers need the steps of the install guide.
type InstallPrompt = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
const isInstalled = () =>
  window.matchMedia?.("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;
// Browsers built into Facebook, Instagram, TikTok, Messenger… cannot install
// an app: the link has to be opened in Chrome (Android) or Safari (iPhone).
const inAppBrowser = (): string | null => {
  const ua = navigator.userAgent;
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return "Facebook";
  if (/Instagram/i.test(ua)) return "Instagram";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "TikTok";
  if (/Snapchat/i.test(ua)) return "Snapchat";
  if (/\bLine\//i.test(ua)) return "Line";
  if (/; wv\)/i.test(ua)) return "une application";
  return null;
};
const devicePlatform = (): "android" | "ios" | "other" => {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && navigator.maxTouchPoints > 1))
    return "ios";
  return /android/i.test(ua) ? "android" : "other";
};

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    // Opened from the home-screen shortcut (long press on the app icon).
    // One tap on it starts the alert if it is set up, otherwise opens the setup.
    if (new URLSearchParams(window.location.search).has("carnet"))
      return readAlertConfig().contacts.length ? "carnet" : "alert";
    return localStorage.getItem("naya-started") ? "home" : "welcome";
  });
  const [audio, setAudioState] = useState(
    () => canListen && localStorage.getItem("naya-audio") === "yes",
  );
  const setAudio = (on: boolean) => {
    const next = on && canListen;
    setAudioState(next);
    localStorage.setItem("naya-audio", next ? "yes" : "no");
    if (!next) stopSpeaking();
  };
  const [lang, setLangState] = useState<Lang>(readLang);
  const [listen, setListenState] = useState(() => localStorage.getItem("naya-ecoute") === "yes");
  const setLang = (next: Lang) => {
    stopSpeaking();
    setLangState(next);
    localStorage.setItem("naya-lang", next);
    // Choosing a recorded voice means wanting to hear it.
    if (next !== "fr") setAudio(true);
  };
  useEffect(() => {
    // Keep the voice clips that can be played available offline, once the
    // voice is on: the chosen language, French only where a clip is missing,
    // and the narration only when it is used (local language or listening).
    if (!audio || !("serviceWorker" in navigator)) return;
    const narrating = listen || lang !== "fr";
    const wanted = (key: string) => {
      const cut = key.indexOf("/");
      const [from, rest] = [key.slice(0, cut), key.slice(cut + 1)];
      if (!narrating && !/\.m\d/.test(rest)) return false;
      if (from === lang) return true;
      return from === "fr" && !clips[`${lang}/${rest}`];
    };
    const urls = Object.entries(clips)
      .filter(([key]) => wanted(key))
      .map(([, url]) => new URL(url, window.location.href).href)
      .filter((url) => url.startsWith("http"));
    navigator.serviceWorker.ready.then((registration) =>
      registration.active?.postMessage({ type: "precache", urls }),
    );
  }, [lang, audio, listen]);
  const [person, setPersonState] = useState<"afi" | "maya">(() =>
    localStorage.getItem("naya-person") === "maya" ? "maya" : "afi",
  );
  const setPerson = (p: "afi" | "maya") => {
    setPersonState(p);
    localStorage.setItem("naya-person", p);
  };
  useEffect(() => {
    if (window.location.search) window.history.replaceState(null, "", window.location.pathname);
  }, []);
  const [scenarioId, setScenarioId] = useState(
    () => localStorage.getItem("naya-scenario") || scenarios[0].id,
  );
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0];
  const total = scenario.steps.length;
  const [story, setStory] = useState(Number(localStorage.getItem("naya-story") || 0));
  const [done, setDone] = useState<string[]>(readDone);
  // main.tsx catches the browser's offer before React starts, so it is not missed.
  const [installPrompt, setInstallPrompt] = useState<InstallPrompt | null>(
    () => (window as Window & { __installPrompt?: InstallPrompt }).__installPrompt ?? null,
  );
  const [installed, setInstalled] = useState(isInstalled);
  const [installHidden, setInstallHidden] = useState(
    () => localStorage.getItem("naya-install") === "hidden",
  );
  useEffect(() => {
    const offer = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPrompt);
    };
    const done = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", offer);
    window.addEventListener("appinstalled", done);
    return () => {
      window.removeEventListener("beforeinstallprompt", offer);
      window.removeEventListener("appinstalled", done);
    };
  }, []);
  const install = async () => {
    if (!installPrompt) {
      go("install");
      return;
    }
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") setInstalled(true);
    setInstallPrompt(null);
  };
  const [wordGame, setWordGameState] = useState<WordGame>(readWordGame);
  const setWordGame = (game: WordGame) => {
    setWordGameState(game);
    localStorage.setItem("naya-mot", JSON.stringify(game));
  };
  const [alertConfig, setAlertConfigState] = useState<AlertConfig>(readAlertConfig);
  const setAlertConfig = (config: AlertConfig) => {
    setAlertConfigState(config);
    localStorage.setItem("naya-alert", JSON.stringify(config));
  };
  const openCarnet = () => {
    stopSpeaking();
    go(alertConfig.contacts.length ? "carnet" : "alert");
  };
  const [storyChoice, setStoryChoice] = useState<number | null>(null);
  // How much hold the manipulator has in the current story. It measures his
  // pressure, never the player's mistakes.
  const [pressure, setPressureState] = useState(() =>
    clampPressure(Number(localStorage.getItem("naya-pressure") ?? START_PRESSURE)),
  );
  const setPressure = (value: number) => {
    const next = clampPressure(value);
    setPressureState(next);
    localStorage.setItem("naya-pressure", String(next));
  };
  const [unlocked, setUnlocked] = useState<number[]>(readUnlocked);
  // Reflexes unlocked by the latest action, to animate them once.
  const [fresh, setFresh] = useState<number[]>([]);
  const unlock = (ids: number[]) => {
    const found = ids.filter((id) => !unlocked.includes(id));
    setFresh(found);
    if (!found.length) return;
    const next = [...unlocked, ...found];
    setUnlocked(next);
    localStorage.setItem("naya-reflexes", JSON.stringify(next));
  };
  const [timer, setTimerState] = useState(() => localStorage.getItem("naya-timer") !== "no");
  const setTimer = (on: boolean) => {
    setTimerState(on);
    localStorage.setItem("naya-timer", on ? "yes" : "no");
  };
  const [profile, setProfileState] = useState(() => localStorage.getItem("naya-profile") || "");
  const setProfile = (value: string) => {
    setProfileState(value);
    localStorage.setItem("naya-profile", value);
  };
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [saved, setSaved] = useState(localStorage.getItem("naya-guide") === "yes");
  const [toast, setToast] = useState("");
  const [eraseOpen, setEraseOpen] = useState(false);
  const [exitErase, setExitEraseState] = useState(
    () => localStorage.getItem("naya-exit-erase") === "yes",
  );
  const setExitErase = (on: boolean) => {
    setExitEraseState(on);
    localStorage.setItem("naya-exit-erase", on ? "yes" : "no");
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !eraseOpen) quickExit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [eraseOpen]);

  const go = (next: Screen) => {
    setScreen(next);
    window.scrollTo(0, 0);
  };
  const notify = (text: string) => {
    setToast(text);
    window.setTimeout(() => setToast(""), 2600);
  };
  const completeOnboarding = () => {
    localStorage.setItem("naya-started", "yes");
    go("home");
  };
  // Listening mode, for people who cannot read the screen (sight, reading):
  // one button, and the story starts aloud in the chosen language, with every
  // answer, consequence and instruction said and big numbered buttons.
  const startListening = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("naya-lang", l);
    setAudio(true);
    setListenState(true);
    localStorage.setItem("naya-ecoute", "yes");
    localStorage.setItem("naya-started", "yes");
    playClips([{ url: clipOf(l, "ui.bienvenue") }], true);
    startScenario(scenario.id);
  };
  const stopListening = () => {
    setListenState(false);
    localStorage.setItem("naya-ecoute", "no");
    stopSpeaking();
  };
  useEffect(() => {
    // The trap page is the one screen with no story text: say what it is.
    if (listen && audio && screen === "fake-login")
      playClips([{ url: clipOf(lang, "ui.piege") }], true);
  }, [screen, listen, audio]);
  const chooseStory = (choice: number) => {
    const step = scenario.steps[Math.min(story, total - 1)];
    const picked = step.choices[choice];
    setStoryChoice(choice);
    if (picked.protective) setPressure(pressure - (step.danger ? 40 : 20));
    else setPressure(pressure + 25);
    unlock(picked.protective ? (picked.reflexes ?? []) : []);
  };
  const nextStory = () => {
    if (story >= total - 1) {
      localStorage.setItem("naya-story", String(total));
      setStory(total);
      setStoryChoice(null);
      if (!done.includes(scenario.id)) {
        const next = [...done, scenario.id];
        setDone(next);
        localStorage.setItem("naya-done", JSON.stringify(next));
      }
      go("progress");
    } else {
      const n = story + 1;
      setStory(n);
      localStorage.setItem("naya-story", String(n));
      setStoryChoice(null);
      setFresh([]);
    }
  };
  const restartStory = () => {
    setStory(0);
    localStorage.setItem("naya-story", "0");
    setStoryChoice(null);
    setPressure(START_PRESSURE);
    setFresh([]);
  };
  const startScenario = (id: string) => {
    // Picking the story already in progress resumes it; another one starts over.
    if (id !== scenario.id || story >= total) {
      setScenarioId(id);
      localStorage.setItem("naya-scenario", id);
      restartStory();
    }
    go("story");
  };
  const resetAll = () => {
    localStorage.clear();
    clearOfflineAudio();
    setExitEraseState(false);
    stopSpeaking();
    setWordGameState(readWordGame());
    setAudioState(false);
    setListenState(false);
    setLangState("fr");
    setPersonState("afi");
    setScenarioId(scenarios[0].id);
    setDone([]);
    setAlertConfigState({ contacts: [], message: 0 });
    setStory(0);
    setStoryChoice(null);
    setPressureState(START_PRESSURE);
    setUnlocked([]);
    setFresh([]);
    setTimerState(true);
    setProfileState("");
    setQuizIndex(0);
    setQuizScore(0);
    setQuizChoice(null);
    setSaved(false);
    setEraseOpen(false);
    go("welcome");
    notify("Données locales effacées");
  };

  let content: React.ReactNode;
  if (screen === "welcome")
    content = <Welcome onNext={() => go("language")} onListen={startListening} />;
  else if (screen === "language")
    content = (
      <Language
        lang={lang}
        setLang={setLang}
        audio={audio}
        setAudio={setAudio}
        onNext={() => go("intro")}
        onBack={() => go("welcome")}
      />
    );
  else if (screen === "intro")
    content = <Intro onNext={() => go("character")} onBack={() => go("language")} />;
  else if (screen === "character")
    content = (
      <Character
        person={person}
        setPerson={setPerson}
        onNext={completeOnboarding}
        onBack={() => go("intro")}
      />
    );
  else if (screen === "home") content = (
      <Home
        person={person}
        story={story}
        scenario={scenario}
        go={go}
        openCarnet={openCarnet}
        daily={dailyScenario()}
        showInstall={!installed && !installHidden}
        install={install}
        hideInstall={() => {
          setInstallHidden(true);
          localStorage.setItem("naya-install", "hidden");
        }}
        wordOpen={wordGame.found || wordGame.revealed}
        listen={listen}
        lang={lang}
        startListening={startListening}
        stopListening={stopListening}
        onPick={startScenario}
        unlocked={unlocked.length}
      />
    );
  else if (screen === "mot")
    content = (
      <MotDuJour
        scenario={dailyScenario()}
        game={wordGame}
        setGame={setWordGame}
        onPlay={() => startScenario(dailyScenario().id)}
        onBack={() => go("home")}
      />
    );
  else if (screen === "play")
    content = <Play go={go} story={story} scenario={scenario} />;
  else if (screen === "vop") content = <VraiOuPiege go={go} timer={timer} />;
  else if (screen === "equipes") content = <QuizEquipes go={go} />;
  else if (screen === "multi") content = <QuizMultiApercu go={go} />;
  else if (screen === "defis") content = <DefisGroupe go={go} />;
  else if (screen === "scenarios")
    content = (
      <Scenarios
        current={scenario.id}
        story={story}
        done={done}
        onPick={startScenario}
        onBack={() => go("home")}
        profile={profile}
        setProfile={setProfile}
        daily={dailyScenario().id}
      />
    );
  else if (screen === "story")
    content = (
      <Story
        key={`${scenario.id}-${Math.min(story, total - 1)}`}
        lang={lang}
        listen={listen}
        pressure={pressure}
        fresh={fresh}
        timer={timer}
        openLink={(careful) => {
          // Rushing to open the link gives the sender a little more hold.
          if (!careful) setPressure(pressure + 15);
          go("fake-login");
        }}
        scenario={scenario}
        step={Math.min(story, total - 1)}
        choice={storyChoice}
        choose={chooseStory}
        next={nextStory}
        go={go}
        person={person}
        audio={audio}
        setAudio={setAudio}
      />
    );
  else if (screen === "fake-login")
    content = (
      <FakeLogin
        attachment={scenario.steps.find((s) => s.attachment)?.attachment}
        onDone={() => {
          unlock([0]);
          setPressure(pressure - 15);
          go("phishing");
        }}
        onBack={() => go("story")}
      />
    );
  else if (screen === "phishing")
    content = (
      <Phishing
        fresh={fresh}
        clue={scenario.steps.find((s) => s.attachment)?.attachment?.clue}
        onNext={() => {
          // Resume right after the step that carried the link.
          const after = scenario.steps.findIndex((s) => s.attachment) + 1;
          setStory(after);
          localStorage.setItem("naya-story", String(after));
          setFresh([]);
          go("story");
        }}
      />
    );
  else if (screen === "resources")
    content = <Resources go={go} />;
  else if (screen === "help")
    content = <Help go={go} />;
  else if (screen === "quiz")
    content = (
      <Quiz
        index={quizIndex}
        score={quizScore}
        choice={quizChoice}
        setChoice={setQuizChoice}
        onNext={() => {
          if (quizChoice === quiz[quizIndex].correct) setQuizScore(quizScore + 1);
          if (quizIndex === quiz.length - 1) {
            localStorage.setItem("naya-quiz", "done");
            go("quiz-result");
          } else {
            setQuizIndex(quizIndex + 1);
            setQuizChoice(null);
          }
        }}
        onBack={() => go("home")}
      />
    );
  else if (screen === "quiz-result")
    content = (
      <QuizResult
        score={quizScore}
        onRetry={() => {
          setQuizIndex(0);
          setQuizScore(0);
          setQuizChoice(null);
          go("quiz");
        }}
        go={go}
      />
    );
  else if (screen === "guide")
    content = (
      <Guide
        saved={saved}
        unlocked={unlocked}
        onSave={() => {
          setSaved(true);
          localStorage.setItem("naya-guide", "yes");
          notify("Fiche enregistrée sur ce téléphone");
        }}
        onBack={() => go("home")}
        go={go}
      />
    );
  else if (screen === "progress")
    content = (
      <Progress
        title={scenario.title}
        unlocked={unlocked}
        onOther={() => go("scenarios")}
        go={go}
        replay={() => {
          restartStory();
          go("story");
        }}
      />
    );
  else if (screen === "privacy") content = <Privacy onBack={() => go("settings")} />;
  else if (screen === "legal") content = <Legal onBack={() => go("settings")} />;
  else if (screen === "install")
    content = (
      <Install
        installed={installed}
        canPrompt={!!installPrompt}
        install={install}
        onBack={() => go("home")}
      />
    );
  else if (screen === "alert")
    content = (
      <AlertSetup
        config={alertConfig}
        setConfig={setAlertConfig}
        onTry={() => go("carnet")}
        onBack={() => go("settings")}
      />
    );
  else if (screen === "carnet")
    content = (
      <Carnet
        contact={alertContacts.find((c) => alertConfig.contacts.includes(c.id)) ?? alertContacts[0]}
        onCancel={() => {
          notify("Note fermée");
          go("home");
        }}
        onClose={() => go("home")}
        onReveal={() => go("alert-result")}
      />
    );
  else if (screen === "alert-result")
    content = (
      <AlertResult
        config={alertConfig}
        sender={person === "afi" ? "Afi" : "Maya"}
        onRetry={() => go("carnet")}
        onSetup={() => go("alert")}
        onHome={() => go("home")}
      />
    );
  else
    content = (
      <Settings
        listen={listen}
        startListening={() => startListening(lang)}
        stopListening={stopListening}
        lang={lang}
        setLang={setLang}
        person={person}
        setPerson={setPerson}
        audio={audio}
        setAudio={setAudio}
        timer={timer}
        setTimer={setTimer}
        go={go}
        erase={() => setEraseOpen(true)}
        exitErase={exitErase}
        setExitErase={setExitErase}
        notify={notify}
      />
    );

  return (
    <div className="app-bg">
      <main className={`phone-shell ${listen ? "listen-mode" : ""}`}>
        {content}
        {toast && (
          <div className="toast">
            <Icon name="check" size={18} />
            {toast}
          </div>
        )}
        {eraseOpen && (
          <div className="modal-backdrop" role="dialog" aria-modal="true">
            <div className="modal">
              <span className="modal-icon">
                <Icon name="warning" />
              </span>
              <h2>Tout effacer ?</h2>
              <p>
                Ta progression, tes préférences, ta fiche enregistrée et les voix téléchargées
                seront supprimées de ce téléphone. Cette action est définitive.
              </p>
              <Button variant="danger" onClick={resetAll}>
                Oui, tout effacer
              </Button>
              <Button variant="ghost" onClick={() => setEraseOpen(false)}>
                Annuler
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Welcome({ onNext, onListen }: { onNext: () => void; onListen: (l: Lang) => void }) {
  return (
    <section className="screen welcome">
      <div className="welcome-mark">
        <span />
        <span />
        <span />
      </div>
      <div className="welcome-copy">
        <p className="eyebrow">Mon espace</p>
        <h1>Ayidote</h1>
        <p>Un endroit calme pour faire le point, à ton rythme.</p>
      </div>
      <div>
        <OfflinePill />
        <Button onClick={onNext} icon="arrow">
          Continuer
        </Button>
        <ListenChooser onListen={onListen} />
        <p className="microcopy">Aucun compte · Rien à partager</p>
      </div>
    </section>
  );
}

/** One big button per language: the story starts aloud, no settings. */
function ListenChooser({ onListen }: { onListen: (l: Lang) => void }) {
  if (!canPlay) return null;
  return (
    <div className="listen-chooser">
      <p>
        <Icon name="play" size={16} /> Je préfère écouter
      </p>
      <div>
        {(["fr", ...recordedLangs] as Lang[]).map((l) => (
          <button key={l} onClick={() => onListen(l)} aria-label={`Écouter en ${langNames[l]}`}>
            <span aria-hidden>
              <Icon name="play" size={22} />
            </span>
            {langNames[l]}
          </button>
        ))}
      </div>
    </div>
  );
}

function Language({
  lang,
  setLang,
  audio,
  setAudio,
  onNext,
  onBack,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  audio: boolean;
  setAudio: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <section className="screen">
      <TopBar title="Tes préférences" onBack={onBack} />
      <div className="page-content">
        <p className="step">1 sur 3</p>
        <h1>Comment veux-tu explorer ?</h1>
        <p className="lead">Tu pourras changer ces choix plus tard.</p>
        <h3>Langue</h3>
        <div className="option-list">
          {(["fr", ...localLangs] as Lang[]).map((x) => (
            <button
              key={x}
              disabled={x !== "fr" && !recordedLangs.includes(x)}
              onClick={() => setLang(x)}
              className={`select-row ${lang === x ? "selected" : ""}`}
            >
              <span>
                <strong>{langNames[x]}</strong>
                {x !== "fr" && (
                  <small>
                    {recordedLangs.includes(x)
                      ? "Textes et voix traduits automatiquement · à l’essai"
                      : "En préparation"}
                  </small>
                )}
              </span>
              {lang === x && (
                <span className="radio">
                  <Icon name="check" size={14} />
                </span>
              )}
            </button>
          ))}
        </div>
        <h3>Audio</h3>
        <button className="toggle-row" onClick={() => setAudio(!audio)} disabled={!canListen}>
          <span>
            <strong>Voix des messages</strong>
            <small>
              {!canListen
                ? "Non disponible sur ce téléphone"
                : audio
                  ? "Activée · tu entends la voix de la personne qui t’écrit"
                  : "Continuer sans audio"}
            </small>
          </span>
          <span className={`toggle ${audio ? "on" : ""}`}>
            <i />
          </span>
        </button>
      </div>
      <div className="sticky-action">
        <Button onClick={onNext} icon="arrow">
          Continuer en {langNames[lang].toLowerCase()}
        </Button>
      </div>
    </section>
  );
}

function Intro({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <section className="screen intro">
      <TopBar title="" onBack={onBack} />
      <div className="intro-art">
        <div className="orbit o1" />
        <div className="orbit o2" />
        <span className="shield-big">
          <Icon name="shield" size={50} />
        </span>
        <span className="floating-card fc1">
          <Icon name="message" />
        </span>
        <span className="floating-card fc2">
          <Icon name="eye" />
        </span>
      </div>
      <div className="page-content intro-copy">
        <p className="step">2 sur 3</p>
        <h1>Les pièges ne se montrent pas toujours tout de suite.</h1>
        <p className="lead">
          Ici, tu peux vivre des situations fictives et apprendre à les reconnaître à ton rythme.
        </p>
        <div className="reassurance">
          <Icon name="spark" />
          <p>
            <strong>Explore librement.</strong>
            <br />
            Il n’y a pas de mauvaise réponse et rien n’est envoyé.
          </p>
        </div>
      </div>
      <div className="sticky-action">
        <Button onClick={onNext} icon="arrow">
          Découvrir
        </Button>
      </div>
    </section>
  );
}

function Character({
  person,
  setPerson,
  onNext,
  onBack,
}: {
  person: "afi" | "maya";
  setPerson: (p: "afi" | "maya") => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <section className="screen">
      <TopBar title="Choisis ton histoire" onBack={onBack} />
      <div className="page-content">
        <p className="step">3 sur 3</p>
        <h1>À travers qui veux-tu vivre l’histoire ?</h1>
        <p className="lead">Ton choix change le visage du personnage, pas les apprentissages.</p>
        <div className="character-grid">
          {[
            {
              id: "afi" as const,
              name: "Afi",
              age: "19 ans",
              desc: "Étudiante, passionnée de musique et de nouvelles rencontres.",
            },
            {
              id: "maya" as const,
              name: "Maya",
              age: "22 ans",
              desc: "Jeune active, créative et très présente sur les réseaux.",
            },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setPerson(p.id)}
              className={`character-card ${person === p.id ? "active" : ""}`}
            >
              <Portrait person={p.id} />
              <span className="character-info">
                <span>
                  <strong>{p.name}</strong>
                  <small>{p.age}</small>
                </span>
                {person === p.id && (
                  <span className="check-dot">
                    <Icon name="check" size={15} />
                  </span>
                )}
              </span>
              <p>{p.desc}</p>
              <span className="choose-label">
                {person === p.id ? "Personnage choisi" : "Choisir ce personnage"}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="sticky-action">
        <Button onClick={onNext} icon="play">
          Commencer avec {person === "afi" ? "Afi" : "Maya"}
        </Button>
      </div>
    </section>
  );
}

function Home({
  person,
  story,
  scenario,
  go,
  openCarnet,
  daily,
  showInstall,
  install,
  hideInstall,
  listen,
  lang,
  startListening,
  stopListening,
  wordOpen,
  onPick,
  unlocked,
}: {
  person: "afi" | "maya";
  story: number;
  scenario: Scenario;
  go: (s: Screen) => void;
  openCarnet: () => void;
  daily: Scenario;
  showInstall: boolean;
  install: () => void;
  hideInstall: () => void;
  listen: boolean;
  lang: Lang;
  startListening: (l: Lang) => void;
  stopListening: () => void;
  wordOpen: boolean;
  onPick: (id: string) => void;
  unlocked: number;
}) {
  const total = scenario.steps.length;
  const inStory = story > 0 && story < total;
  return (
    <section className="screen with-nav">
      <div className="home-header">
        <button className="home-avatar" onClick={() => go("settings")} aria-label="Paramètres">
          <Portrait person={person} small />
        </button>
        <div>
          <h1>Bonjour, {person === "afi" ? "Afi" : "Maya"}</h1>
          <p>
            Bienvenue sur <strong>Ayidote</strong>
          </p>
        </div>
        <QuickExitButton />
        <button className="carnet-button" onClick={openCarnet} aria-label="Mon carnet">
          <Icon name="book" size={20} />
        </button>
      </div>
      <div className="page-content home-content">
        {/* One job per tab: the home screen only shows today's step and where
            she stands. Every game lives in "Jouer", the reflexes in "Réflexes". */}
        {listen && (
          <div className="listen-banner" role="status">
            <Icon name="play" size={22} />
            <p>
              <strong>Mode écoute · {langNames[lang]}</strong>
              Tout est lu à voix haute.
            </p>
            <button onClick={stopListening}>Arrêter l’écoute</button>
          </div>
        )}
        {listen && (
          <button className="big-listen" onClick={() => startListening(lang)}>
            <Icon name="play" size={34} />
            {inStory ? "Reprendre l’histoire" : "Écouter une histoire"}
          </button>
        )}
        {!listen && inStory ? (
          <button className="vop-card today-card" onClick={() => go("story")}>
            <span className="eyebrow">Ton histoire en cours</span>
            <strong>{scenario.title}</strong>
            <span>
              Situation {story + 1} sur {total}. Reprends là où tu t’es arrêtée.
            </span>
            <span className="vop-card-cta">
              Reprendre <Icon name="arrow" size={18} />
            </span>
          </button>
        ) : listen ? null : daily.mot && !wordOpen ? (
          <button className="vop-card today-card" onClick={() => go("mot")}>
            <span className="eyebrow">Aujourd’hui</span>
            <strong>Le mot du jour</strong>
            <span>Trouve-le pour ouvrir l’histoire du jour.</span>
            <span className="vop-card-cta">
              Deviner le mot <Icon name="arrow" size={18} />
            </span>
          </button>
        ) : (
          <button className="vop-card today-card" onClick={() => onPick(daily.id)}>
            <span className="eyebrow">
              {daily.mot ? `Mot du jour : ${daily.mot.mot}` : "Aujourd’hui"}
            </span>
            <strong>L’histoire du jour</strong>
            <span>
              « {daily.title} » · {daily.summary}
            </span>
            <span className="vop-card-cta">
              Jouer <Icon name="arrow" size={18} />
            </span>
          </button>
        )}
        <section className="journey-card">
          <h2>Ton parcours</h2>
          <div>
            <span>
              <strong>
                {Math.min(story, total)}/{total}
              </strong>
              situations
            </span>
            <span>
              <strong>{unlocked}/6</strong>
              réflexes
            </span>
          </div>
        </section>
        {!listen && canPlay && (
          <button className="wide-link" onClick={() => startListening(lang)}>
            <span className="link-icon">
              <Icon name="play" />
            </span>
            <span>
              <strong>Écouter au lieu de lire</strong>
              <small>Tout est dit à voix haute, en français, fon ou yoruba</small>
            </span>
            <Icon name="chevron" />
          </button>
        )}
        {showInstall && (
          <div className="install-card">
            <button className="wide-link" onClick={install}>
              <span className="link-icon">
                <Icon name="download" />
              </span>
              <span>
                <strong>Installer Ayidote</strong>
                <small>Une icône sur ton téléphone, même sans réseau</small>
              </span>
              <Icon name="chevron" />
            </button>
            <button className="install-hide" onClick={hideInstall}>
              Plus tard
            </button>
          </div>
        )}
        <button className="wide-link" onClick={() => go("play")}>
          <span className="link-icon orange">
            <Icon name="spark" />
          </span>
          <span>
            <strong>Tous les jeux</strong>
            <small>Histoires, mot du jour, jeu de groupe, quiz</small>
          </span>
          <Icon name="chevron" />
        </button>
      </div>
      <BottomNav active="home" go={go} />
    </section>
  );
}

function Scenarios({
  current,
  story,
  done,
  onPick,
  onBack,
  profile,
  setProfile,
  daily,
}: {
  current: string;
  story: number;
  done: string[];
  onPick: (id: string) => void;
  onBack: () => void;
  profile: string;
  setProfile: (p: string) => void;
  daily: string;
}) {
  // Stories written for the chosen profile come first.
  const ordered = [...scenarios].sort(
    (a, b) => Number(b.profile === profile) - Number(a.profile === profile),
  );
  return (
    <section className="screen">
      <TopBar title="Les histoires" onBack={onBack} />
      <div className="page-content">
        <h1>Quelle situation veux-tu explorer ?</h1>
        <p className="lead">Chaque histoire est fictive. Choisis celle qui te ressemble le plus.</p>
        <div className="profile-picker" role="group" aria-label="Ton profil">
          <span>Ton profil</span>
          {profiles.map((p) => (
            <button
              key={p}
              className={p === profile ? "active" : ""}
              aria-pressed={p === profile}
              onClick={() => setProfile(p === profile ? "" : p)}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="scenario-list">
          {ordered.map((s) => {
            const finished = done.includes(s.id);
            const started = s.id === current && story > 0 && story < s.steps.length;
            return (
              <button key={s.id} className="scenario-card" onClick={() => onPick(s.id)}>
                <Portrait person={s.contact.portrait} small />
                <span className="scenario-text">
                  <small className="scenario-profile">
                    {s.profile}
                    {s.profile === profile && <em>Pour toi</em>}
                    {s.id === daily && <em className="daily">Histoire du jour</em>}
                  </small>
                  <strong>{s.title}</strong>
                  <span>{s.summary}</span>
                  <small className="scenario-state">
                    {started
                      ? `En cours · ${story}/${s.steps.length}`
                      : finished
                        ? "Terminée · rejouer"
                        : `${s.steps.length} situations`}
                    {s.source === "ia" && " · écrite avec l’IA"}
                  </small>
                </span>
                <Icon name="chevron" />
              </button>
            );
          })}
        </div>
        <div className="privacy-note">
          <Icon name="spark" />
          <p>
            <strong>De nouvelles histoires, sans risque.</strong>
            <br />
            Certaines histoires sont rédigées avec l’aide d’une IA, puis relues par l’équipe avant
            d’être ajoutées. Aucune n’est générée à partir de tes données : ton profil sert
            seulement à trier la liste et reste sur ce téléphone.
          </p>
        </div>
      </div>
    </section>
  );
}

function MotDuJour({
  scenario,
  game,
  setGame,
  onPlay,
  onBack,
}: {
  scenario: Scenario;
  game: WordGame;
  setGame: (g: WordGame) => void;
  onPlay: () => void;
  onBack: () => void;
}) {
  const word = scenario.mot;
  const [draft, setDraft] = useState("");
  const [note, setNote] = useState("");
  if (!word)
    return (
      <section className="screen">
        <TopBar title="Le mot du jour" onBack={onBack} />
        <div className="page-content">
          <p className="lead">Pas de mot aujourd’hui : l’histoire du jour est déjà ouverte.</p>
          <Button onClick={onPlay} icon="arrow">
            Jouer l’histoire du jour
          </Button>
        </div>
      </section>
    );

  const over = game.found || game.revealed;
  const rows = game.guesses
    .map((guess, order) => ({ guess, order, found: heatOf(guess, word) === "found" }))
    .reverse();
  const submit = () => {
    const guess = draft.trim();
    if (!plainWord(guess)) return;
    if (game.guesses.some((g) => plainWord(g) === plainWord(guess))) {
      setNote(`Tu as déjà essayé « ${guess} ».`);
      setDraft("");
      return;
    }
    const heat = heatOf(guess, word);
    setGame({ ...game, guesses: [...game.guesses, guess], found: heat === "found" });
    setNote(
      heat === "found" ? "" : `Ce n’est pas « ${guess} ». Relis l’indice, ou demande-en un autre.`,
    );
    setDraft("");
    if (heat === "found") vibrate([40, 40, 90]);
  };

  return (
    <section className="screen mot-screen">
      <TopBar title="Le mot du jour" onBack={onBack} />
      <div className="page-content">
        {over ? (
          <div className="mot-found" role="status">
            <span>
              <Icon name={game.found ? "check" : "eye"} size={30} />
            </span>
            <p className="eyebrow">{game.found ? "Bravo, tu l’as trouvé" : "Le mot était"}</p>
            <h1>{word.mot}</h1>
            {game.found && (
              <p className="mot-tries">
                en {game.guesses.length} essai{game.guesses.length > 1 ? "s" : ""}
                {` avec ${Math.max(1, game.hints)} indice${Math.max(1, game.hints) > 1 ? "s" : ""}`}
              </p>
            )}
            <div className="mot-lesson">
              <strong>La leçon du jour</strong>
              <p>{word.lecon}</p>
            </div>
            <Button onClick={onPlay} icon="arrow">
              Jouer l’histoire du jour
            </Button>
            <p className="microcopy">« {scenario.title} » · un nouveau mot demain</p>
          </div>
        ) : (
          <>
            <p className="eyebrow">Un mot, une leçon</p>
            <h1>Quel est le mot du jour ?</h1>
            <p className="lead">C’est le thème de l’histoire du jour. Lis l’indice et propose un mot.</p>
            <ol className="mot-hints">
              {word.indices.slice(0, Math.max(1, game.hints)).map((hint, i) => (
                <li key={hint}>
                  <strong>Indice {i + 1}</strong> {hint}
                </li>
              ))}
            </ol>
            <form
              className="mot-form"
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Écris un mot…"
                aria-label="Ta proposition"
                autoComplete="off"
                autoCapitalize="none"
                maxLength={30}
              />
              <button type="submit" disabled={!plainWord(draft)} aria-label="Proposer ce mot">
                <Icon name="arrow" />
              </button>
            </form>
            {note && (
              <p className="mot-note" role="status">
                {note}
              </p>
            )}
            <div className="mot-actions">
              <button
                onClick={() => setGame({ ...game, hints: Math.max(1, game.hints) + 1 })}
                disabled={Math.max(1, game.hints) >= word.indices.length}
              >
                {Math.max(1, game.hints) >= word.indices.length
                  ? "Tous les indices sont là"
                  : `Un autre indice (${Math.max(1, game.hints) + 1}/${word.indices.length})`}
              </button>
              {game.guesses.length >= 3 && (
                <button onClick={() => setGame({ ...game, revealed: true })}>Révéler le mot</button>
              )}
            </div>
          </>
        )}
        {rows.length > 0 && (
          <>
            <h2 className="section-title">
              Tes essais <small>· {rows.length}</small>
            </h2>
            <ul className="mot-guesses">
              {rows.map((row) => (
                <li key={row.guess} className={row.found ? "found" : "miss"}>
                  <strong>{row.guess}</strong>
                  <em>
                    <Icon name={row.found ? "check" : "warning"} size={14} />
                    {row.found ? "Trouvé" : "Pas encore"}
                  </em>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}

function ActionCard({
  icon,
  tone,
  title,
  text,
  onClick,
}: {
  icon: IconName;
  tone: string;
  title: string;
  text: string;
  onClick: () => void;
}) {
  return (
    <button className={`action-card ${tone}`} onClick={onClick}>
      <span>
        <Icon name={icon} />
      </span>
      <div>
        <strong>{title}</strong>
        <p>{text}</p>
      </div>
      <Icon name="chevron" size={18} />
    </button>
  );
}

function BottomNav({ active, go }: { active: string; go: (s: Screen) => void }) {
  return (
    <nav className="bottom-nav">
      <button className={active === "home" ? "active" : ""} onClick={() => go("home")}>
        <Icon name="home" />
        <span>Accueil</span>
      </button>
      <button className={active === "play" ? "active" : ""} onClick={() => go("play")}>
        <Icon name="spark" />
        <span>Jouer</span>
      </button>
      <button className={active === "guide" ? "active" : ""} onClick={() => go("guide")}>
        <Icon name="shield" />
        <span>Réflexes</span>
      </button>
      <button className={active === "settings" ? "active" : ""} onClick={() => go("settings")}>
        <Icon name="settings" />
        <span>Paramètres</span>
      </button>
    </nav>
  );
}

/** One reflex card. `flip` turns it over once, from its hidden side. */
function ReflexTile({ index, open, flip = false }: { index: number; open: boolean; flip?: boolean }) {
  const [icon, title] = reflexes[index];
  if (!open)
    return (
      <div className="reflex-tile locked">
        <span>?</span>
        <small>À trouver</small>
      </div>
    );
  return (
    <div className={`reflex-tile ${flip ? "flip" : ""}`}>
      <div className="reflex-tile-inner">
        <div className="reflex-tile-front">
          <span>
            <Icon name={icon} size={18} />
          </span>
          <small>{title}</small>
        </div>
        <div className="reflex-tile-back" aria-hidden>
          ?
        </div>
      </div>
    </div>
  );
}

/** Shown right after an action that unlocked one or more reflex cards. */
function ReflexUnlock({ fresh }: { fresh: number[] }) {
  if (!fresh.length) return null;
  return (
    <div className="reflex-unlock" role="status">
      <p>
        <Icon name="spark" size={15} />
        {fresh.length > 1 ? "Réflexes débloqués" : "Réflexe débloqué"}
      </p>
      <div>
        {fresh.map((id) => (
          <ReflexTile key={id} index={id} open flip />
        ))}
      </div>
      <small>Ajouté à ta fiche « Mes 6 réflexes ».</small>
    </div>
  );
}

/** A bar that empties. Running out never costs anything. */
/** A text in the chosen language, with the French original underneath. */
function Said({ text, local }: { text: string; local?: string }) {
  if (!local) return <span className="said">{text}</span>;
  return (
    <span className="said">
      <span lang="x-local">{local}</span>
      <small className="fr-gloss" lang="fr">
        {text}
      </small>
    </span>
  );
}

function Countdown({ seconds, onEnd }: { seconds: number; onEnd: () => void }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    if (left <= 0) {
      onEnd();
      return;
    }
    const id = window.setTimeout(() => setLeft((value) => value - 0.5), 500);
    return () => window.clearTimeout(id);
  }, [left]);
  return (
    <div
      className="countdown"
      role="progressbar"
      aria-label="Temps laissé par le maître chanteur"
      aria-valuemin={0}
      aria-valuemax={seconds}
      aria-valuenow={Math.ceil(left)}
    >
      <i style={{ width: `${(left / seconds) * 100}%` }} />
    </div>
  );
}

const COUNTDOWN_S = 15;

function Story({
  lang,
  listen,
  scenario,
  step,
  choice,
  choose,
  next,
  go,
  person,
  audio,
  setAudio,
  pressure,
  fresh,
  timer,
  openLink,
}: {
  lang: Lang;
  listen: boolean;
  scenario: Scenario;
  step: number;
  choice: number | null;
  choose: (c: number) => void;
  next: () => void;
  go: (s: Screen) => void;
  person: "afi" | "maya";
  audio: boolean;
  setAudio: (v: boolean) => void;
  pressure: number;
  fresh: number[];
  timer: boolean;
  openLink: (careful: boolean) => void;
}) {
  const data = scenario.steps[step];
  const last = step === scenario.steps.length - 1;
  const header = { ...scenario.contact, ...data.header };
  const me = person === "afi" ? "Afi" : "Maya";
  const picked = choice !== null ? data.choices[choice] : null;
  const count = data.messages.length;

  // Messages arrive one by one, like a real conversation. They are all there
  // at once when the step was already answered or motion is reduced.
  const [instant] = useState(() => choice !== null || reducedMotion());
  const [shown, setShown] = useState(instant ? count : 0);
  const arrived = shown >= count;
  const incoming = arrived ? null : data.messages[shown];
  const [expired, setExpired] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!incoming) return;
    const mine = incoming[0] === "moi";
    const delay = mine ? 550 : 800 + Math.min(incoming[1].length * 16, 1100);
    const id = window.setTimeout(() => {
      setShown((value) => value + 1);
      if (mine) return;
      // Audio is the voice of the person writing, nothing else on the screen.
      if (audio)
        sayMessage(lang, scenario.id, step, shown, incoming[1].replace(/^Image masquée · /, ""));
      // The threat itself lands harder than an ordinary message.
      vibrate(data.danger && shown === count - 1 ? [70, 50, 110] : 35);
    }, delay);
    return () => window.clearTimeout(id);
  }, [shown]);
  useEffect(() => stopSpeaking, []);
  useEffect(() => {
    if (!instant) endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [shown, arrived]);

  // In a local language, everything a player needs is also said aloud, so she
  // can play without reading: the answers (numbered, highlighted while read),
  // then what her answer leads to.
  const key = scenario.id;
  const local = listen || (lang !== "fr" && recordedLangs.includes(lang));
  const [reading, setReading] = useState<number | null>(null);
  const answerClips = (i: number) => [
    { url: clipOf(lang, `ui.r${i + 1}`, false), onStart: () => setReading(i) },
    { url: clipOf(lang, `${key}.c${step + 1}-${i + 1}`, false) },
  ];
  const readChoice = (i: number) => playClips(answerClips(i), true, () => setReading(null));
  useEffect(() => {
    if (!local || !audio || !arrived) return;
    if (data.attachment) {
      playClips([
        { url: clipOf(lang, "ui.lien", false) },
        { url: clipOf(lang, `${key}.cta${step + 1}`, false) },
      ]);
    } else if (choice === null) {
      playClips(
        [
          { url: clipOf(lang, "ui.choisis", false) },
          ...data.choices.flatMap((_, i) => answerClips(i)),
        ],
        false,
        () => setReading(null),
      );
    } else {
      setReading(null);
      playClips(
        [
          { url: clipOf(lang, `${key}.o${step + 1}-${choice + 1}`, false) },
          { url: clipOf(lang, `${key}.a${step + 1}-${choice + 1}`, false) },
          { url: clipOf(lang, "ui.retenir", false) },
          { url: clipOf(lang, `${key}.f${step + 1}`, false) },
          ...(listen ? [{ url: clipOf(lang, "ui.continuer", false) }] : []),
        ],
        true,
      );
    }
  }, [arrived, choice, local, audio]);

  // The mood follows the story: the room darkens as the pressure rises and
  // clears up again after a protective answer.
  // A threat is pressure at its highest, whatever happened before.
  const felt = Math.max(pressure, data.danger && !picked ? 85 : 0);
  const tension = felt / 100;
  const level = felt >= 65 ? "high" : felt >= 40 ? "medium" : "low";

  return (
    <section
      className={`screen story-screen ${data.danger ? "danger-mode" : ""} ${
        data.danger && arrived && !instant ? "threat-shake" : ""
      }`}
      style={{ "--tension": tension } as React.CSSProperties}
    >
      <header className="chat-header">
        <button className="icon-button" onClick={() => go("home")} aria-label="Retour à l’accueil">
          <Icon name="back" />
        </button>
        <Portrait person={header.portrait} small />
        <div>
          <strong>{header.name}</strong>
          <small>{incoming && incoming[0] !== "moi" ? "écrit…" : header.status}</small>
        </div>
        {canListen && (
          <button
            className={`icon-button ${audio ? "audio-on" : ""}`}
            onClick={() => setAudio(!audio)}
            aria-label={audio ? "Couper la voix des messages" : "Écouter la voix des messages"}
            aria-pressed={audio}
          >
            <Icon name="play" />
          </button>
        )}
      </header>
      <div className="chapter-strip">
        <span>{data.chapter}</span>
        <ol className="episode-path" aria-label={`Épisode ${step + 1} sur ${scenario.steps.length}`}>
          {scenario.steps.map((_, i) => (
            <li key={i} className={i < step ? "done" : i === step ? "current" : "locked"}>
              {i < step ? (
                <Icon name="check" size={12} />
              ) : i === step ? (
                i + 1
              ) : (
                <Icon name="lock" size={11} />
              )}
            </li>
          ))}
        </ol>
      </div>
      <div className={`pressure ${level}`}>
        <span>Pression de {scenario.contact.name}</span>
        <div
          role="meter"
          aria-label={`Pression de ${scenario.contact.name}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={felt}
        >
          <i style={{ width: `${felt}%` }} />
        </div>
      </div>
      <div className="messages" onClick={() => setShown(count)}>
        {data.messages.slice(0, shown).map(([who, text], i) => {
          const mine = who === "moi";
          return (
            <div
              key={i}
              className={`message-row ${mine ? "mine" : ""} ${instant ? "" : "arriving"}`}
              aria-label={`Message de ${mine ? me : who}`}
            >
              <div className={`bubble ${text.startsWith("Image masquée") ? "masked" : ""}`}>
                {text.startsWith("Image masquée") && (
                  <span className="masked-icon">
                    <Icon name="eye" />
                  </span>
                )}
                <Said
                  text={text}
                  local={mine ? undefined : tr(lang, `${scenario.id}.m${step + 1}-${i + 1}`)}
                />
                <small>
                  10:{24 + i * 2}
                  {mine && " · Lu"}
                </small>
              </div>
            </div>
          );
        })}
        {incoming && incoming[0] !== "moi" && (
          <div className="message-row" role="status">
            <div className="bubble typing">
              <small>{incoming[0]} écrit…</small>
              <span>
                <i />
                <i />
                <i />
              </span>
            </div>
          </div>
        )}
        {arrived && data.attachment && (
          <button
            className="album-card"
            onClick={(event) => {
              event.stopPropagation();
              openLink(false);
            }}
          >
            <span className="album-visual">
              <Icon name="eye" size={28} />
            </span>
            <span>
              <strong>{data.attachment.label}</strong>
              <small>{data.attachment.url}</small>
            </span>
            <Icon name="chevron" />
          </button>
        )}
        <div ref={endRef} />
      </div>
      {!arrived ? (
        <div className="choice-panel waiting">
          <p>Touche la conversation pour tout afficher</p>
        </div>
      ) : data.attachment ? (
        <div className="choice-panel">
          <p>{tr(lang, "ui.lien") ?? "Ce lien vient d’arriver. Que veux-tu faire ?"}</p>
          <Button onClick={() => openLink(false)} icon="arrow">
            {tr(lang, `${scenario.id}.cta${step + 1}`) ?? data.attachment.cta}
          </Button>
          <Button variant="ghost" onClick={() => openLink(true)}>
            Examiner le lien sans rien saisir
          </Button>
        </div>
      ) : (
        <div className="choice-panel">
          {!picked ? (
            <>
              {data.danger && timer && !expired && (
                <>
                  <p className="countdown-label">{scenario.contact.name} te presse de répondre</p>
                  <Countdown seconds={COUNTDOWN_S} onEnd={() => setExpired(true)} />
                </>
              )}
              {expired && (
                <div className="countdown-over" role="status">
                  <Icon name="shield" size={18} />
                  <p>
                    <strong>Le temps est écoulé, et rien ne s’est passé.</strong> Te presser est la
                    technique du maître chanteur. Prends tout le temps qu’il te faut.
                  </p>
                </div>
              )}
              <p>{local ? (tr(lang, "ui.choisis") ?? "Que réponds-tu ?") : "Que réponds-tu ?"}</p>
              {data.choices.map((c, i) => (
                <div key={c.label} className={`story-choice-row ${reading === i ? "reading" : ""}`}>
                  <button className="story-choice" onClick={() => choose(i)}>
                    <b className="choice-number" aria-hidden>
                      {i + 1}
                    </b>
                    <Said text={c.label} local={tr(lang, `${key}.c${step + 1}-${i + 1}`)} />
                    <Icon name="arrow" size={17} />
                  </button>
                  {local && canPlay && (
                    <button
                      className="choice-listen"
                      onClick={() => readChoice(i)}
                      aria-label={`Écouter la réponse ${i + 1}`}
                    >
                      <Icon name="play" size={16} />
                    </button>
                  )}
                </div>
              ))}
            </>
          ) : (
            <div className={`learning-card ${picked.protective ? "protective" : ""}`}>
              <span>
                <Icon name={picked.protective ? "shield" : "spark"} />
              </span>
              <p>
                <strong>
                  <Said text={picked.label} local={tr(lang, `${key}.c${step + 1}-${choice! + 1}`)} />
                </strong>
              </p>
              <div className="outcome">
                <Said text={picked.outcome} local={tr(lang, `${key}.o${step + 1}-${choice! + 1}`)} />
              </div>
              <div className="advice">
                <Said text={picked.advice} local={tr(lang, `${key}.a${step + 1}-${choice! + 1}`)} />
              </div>
              <ReflexUnlock fresh={fresh} />
              <div className="lesson">
                <strong>{tr(lang, "ui.retenir") ?? "À retenir."}</strong>{" "}
                <Said text={data.feedback} local={tr(lang, `${key}.f${step + 1}`)} />
              </div>
              <div className="learning-actions">
                <Button onClick={next} icon="arrow">
                  {last ? "Terminer l’histoire" : "Continuer"}
                </Button>
                {last && (
                  <Button variant="ghost" onClick={() => go("help")}>
                    Trouver de l’aide
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** The trap page. The player finds the three clues herself by touching them. */
function FakeLogin({
  attachment,
  onDone,
  onBack,
}: {
  attachment?: Attachment;
  onDone: () => void;
  onBack: () => void;
}) {
  const clues = [
    ["Une adresse étrange", "Le domaine ne correspond à aucun service attendu."],
    ["Un lien inattendu", attachment?.clue ?? "Tu n’attendais pas ce lien."],
    [
      "Elle demande ton mot de passe",
      "Un vrai service ne te demande jamais ton mot de passe par un lien reçu dans une discussion. Ferme la page et ouvre toi-même l’application officielle.",
    ],
  ];
  const [found, setFound] = useState<number[]>([]);
  const [last, setLast] = useState<number | null>(null);
  const tap = (index: number) => {
    setLast(index);
    if (found.includes(index)) return;
    setFound([...found, index]);
    vibrate(30);
  };
  const mark = (index: number) => (found.includes(index) ? "hotspot found" : "hotspot");
  const complete = found.length === clues.length;
  return (
    <section className="screen fake-page">
      <div className="hunt-banner">
        <div>
          <strong>Chasse aux indices</strong>
          <small>Touche les 3 détails qui trahissent le piège.</small>
        </div>
        <span aria-label={`${found.length} indices trouvés sur 3`}>
          {clues.map((_, i) => (
            <i key={i} className={i < found.length ? "on" : ""} />
          ))}
        </span>
      </div>
      <div className="browser-bar">
        <button onClick={onBack} aria-label="Revenir à la conversation">
          <Icon name="back" />
        </button>
        <button className={`browser-url ${mark(0)}`} onClick={() => tap(0)}>
          <Icon name="lock" size={13} /> {attachment?.pageUrl ?? "connexion-login.net"}
        </button>
        <Icon name="more" />
      </div>
      <div className="fake-content">
        <div className="generic-logo">
          <span />
          <span />
        </div>
        <button className={`fake-promise ${mark(1)}`} onClick={() => tap(1)}>
          <h1>{attachment?.pageTitle ?? "Connecte-toi"}</h1>
          <p>{attachment?.pageText ?? "Connecte-toi pour continuer."}</p>
        </button>
        <div className={`fake-form ${mark(2)}`}>
          {/* Pictures of fields, not real ones: no cursor, no keyboard, nothing
              to type. Touching them reveals the clue instead. */}
          <button className="fake-field" onClick={() => tap(2)}>
            <span>Adresse e-mail</span>
            <i>tonadresse@email.com</i>
          </button>
          <button className="fake-field" onClick={() => tap(2)}>
            <span>Mot de passe</span>
            <i>••••••••</i>
          </button>
          <Button onClick={() => tap(2)}>Se connecter</Button>
        </div>
        <small>Page fictive créée pour cet exercice. Rien ne peut y être écrit.</small>
      </div>
      <div className="hunt-panel" aria-live="polite">
        {last !== null ? (
          <p>
            <strong>
              Indice {found.indexOf(last) + 1} · {clues[last][0]}
            </strong>
            {clues[last][1]}
          </p>
        ) : complete ? (
          <p>
            <strong>Les 3 indices sont entourés.</strong>
            Touche-les pour comprendre ce qui devait t’alerter.
          </p>
        ) : (
          <p>
            <strong>Regarde bien cette page.</strong>
            Qu’est-ce qui devrait t’alerter ? Touche-le.
          </p>
        )}
        {complete ? (
          <Button onClick={onDone} icon="arrow">
            Voir ce que j’ai trouvé
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={() => {
              setFound([0, 1, 2]);
              setLast(null);
            }}
          >
            Montre-moi les indices
          </Button>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// « Vrai ou piège ? » : a group game around one phone. Everyone is on the same
// side; the app shows a message and the group decides together. Nobody ever
// plays the scammer, and points only reward spotting the signs.
// ---------------------------------------------------------------------------
type VopCard = {
  id: string;
  category: string;
  sender: string;
  status: string;
  text: string;
  link?: string;
  trap: boolean;
  help?: boolean;
  clues: string[];
  reflex: string;
};
const vopCards = vopContent as VopCard[];
type VopStats = { games: number; best: number; signs: string[] };

function readVopStats(): VopStats {
  try {
    const value = JSON.parse(localStorage.getItem("naya-vop") || "null");
    if (value && Array.isArray(value.signs))
      return { games: Number(value.games) || 0, best: Number(value.best) || 0, signs: value.signs };
  } catch {
    // fall through to empty stats
  }
  return { games: 0, best: 0, signs: [] };
}

function shuffled<T>(list: T[]): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** A deck that always mixes safe messages with traps, so "piège" is never a sure bet. */
function buildDeck(size: number): VopCard[] {
  const safe = shuffled(vopCards.filter((c) => !c.trap));
  const traps = shuffled(vopCards.filter((c) => c.trap));
  const safeCount = Math.min(safe.length, Math.max(1, Math.round(size * 0.3)));
  return shuffled([...safe.slice(0, safeCount), ...traps.slice(0, size - safeCount)]);
}

const TALK_S = 30;
const vopRanks = [
  [0, "Équipe curieuse", "Vous avez ouvert l’œil ensemble. Chaque manche vous apprend un signe de plus."],
  [0.5, "Équipe attentive", "Vous repérez déjà la plupart des signes. Continuez à en parler entre vous."],
  [0.8, "Équipe vigilante", "Presque rien ne vous échappe. Vous pouvez aider les autres à repérer les pièges."],
  [1, "Équipe sentinelle", "Sans faute. Transmettez ces réflexes autour de vous."],
] as [number, string, string][];

function VraiOuPiege({ go, timer }: { go: (s: Screen) => void; timer: boolean }) {
  const [phase, setPhase] = useState<
    "intro" | "setup" | "message" | "talk" | "vote" | "reveal" | "round" | "final"
  >("intro");
  const [size, setSize] = useState(5);
  const [deck, setDeck] = useState<VopCard[]>([]);
  const [round, setRound] = useState(0);
  const [vote, setVote] = useState<boolean | null>(null);
  const [results, setResults] = useState<boolean[]>([]);
  const [talkOver, setTalkOver] = useState(false);
  const [stats, setStats] = useState<VopStats>(readVopStats);
  const card = deck[round];
  const score = results.filter(Boolean).length;

  const to = (next: typeof phase) => {
    setPhase(next);
    window.scrollTo(0, 0);
  };
  const start = () => {
    setDeck(buildDeck(size));
    setRound(0);
    setResults([]);
    setVote(null);
    setTalkOver(false);
    to("message");
  };
  const confirmVote = () => {
    if (vote === null) return;
    const right = vote === card.trap;
    setResults([...results, right]);
    vibrate(right ? 40 : [30, 60, 30]);
    to("reveal");
  };
  const nextRound = () => {
    if (round < deck.length - 1) {
      setRound(round + 1);
      setVote(null);
      setTalkOver(false);
      to("message");
      return;
    }
    const signs = [...new Set([...stats.signs, ...deck.filter((c) => c.trap).map((c) => c.category)])];
    const next = { games: stats.games + 1, best: Math.max(stats.best, score * 10), signs };
    setStats(next);
    localStorage.setItem("naya-vop", JSON.stringify(next));
    to("final");
  };
  const quit = () => go("play");

  if (phase === "intro")
    return (
      <section className="screen vop">
        <TopBar title="Vrai ou piège ?" onBack={quit} />
        <div className="page-content">
          <div className="vop-hero">
            <VopArt />
            <p className="eyebrow">Jeu à plusieurs · un seul téléphone</p>
            <h1>Vrai ou piège ?</h1>
            <p>Un message s’affiche. Ensemble, vous décidez : peut-on lui faire confiance ?</p>
          </div>
          <ol className="vop-steps">
            <li>
              <span>1</span>
              <p>
                <strong>Lisez le message</strong>à voix haute, pour tout le groupe.
              </p>
            </li>
            <li>
              <span>2</span>
              <p>
                <strong>Discutez</strong>
                des détails qui vous rassurent ou vous alertent.
              </p>
            </li>
            <li>
              <span>3</span>
              <p>
                <strong>Votez ensemble</strong>
                puis découvrez les signes à retenir.
              </p>
            </li>
          </ol>
          <div className="tip">
            <Icon name="shield" />
            <p>
              <strong>Tout le groupe est dans la même équipe.</strong>
              <br />
              Personne ne joue le piégeur, et personne n’est jugé pour sa réponse.
            </p>
          </div>
          {stats.games > 0 && (
            <p className="vop-best">
              Meilleur score du groupe : <strong>{stats.best} points</strong> · {stats.signs.length}{" "}
              signe{stats.signs.length > 1 ? "s" : ""} déjà repéré{stats.signs.length > 1 ? "s" : ""}
            </p>
          )}
        </div>
        <div className="sticky-action">
          <Button onClick={() => to("setup")} icon="arrow">
            Préparer une partie
          </Button>
        </div>
      </section>
    );

  if (phase === "setup")
    return (
      <section className="screen vop">
        <TopBar title="Préparer la partie" onBack={() => to("intro")} />
        <div className="page-content">
          <h1>Installez-vous.</h1>
          <p className="lead">Posez le téléphone au milieu. Une personne lit, tout le monde décide.</p>
          <h2>Combien de messages ?</h2>
          <div className="vop-sizes" role="group" aria-label="Nombre de messages">
            {(
              [
                [5, "Partie courte", "environ 5 minutes"],
                [8, "Partie longue", "environ 10 minutes"],
              ] as [number, string, string][]
            ).map(([n, label, time]) => (
              <button
                key={n}
                className={size === n ? "selected" : ""}
                aria-pressed={size === n}
                onClick={() => setSize(n)}
              >
                <strong>{n}</strong>
                <span>{label}</span>
                <small>{time}</small>
                {size === n && (
                  <i>
                    <Icon name="check" size={14} />
                  </i>
                )}
              </button>
            ))}
          </div>
          <div className="vop-rules">
            <p>
              <Icon name="user" size={18} />
              De 2 à 10 personnes, à partir de 12 ans.
            </p>
            <p>
              <Icon name="message" size={18} />
              Tous les messages sont inventés pour le jeu.
            </p>
            <p>
              <Icon name="help" size={18} />
              Si une situation te touche, la page Aide est là.
            </p>
          </div>
        </div>
        <div className="sticky-action">
          <Button onClick={start} icon="arrow">
            Commencer
          </Button>
        </div>
      </section>
    );

  if (phase === "final") {
    const ratio = deck.length ? score / deck.length : 0;
    const rank = [...vopRanks].reverse().find((r) => ratio >= r[0]) ?? vopRanks[0];
    const learnt = [...new Set(deck.filter((c) => c.trap).map((c) => c.category))];
    return (
      <section className="screen vop">
        <TopBar title="Progression du groupe" onBack={quit} />
        <div className="page-content">
          <div className="vop-hero">
            <VopArt lit={score} total={deck.length} />
            <p className="eyebrow">Partie terminée</p>
            <h1>{rank[1]}</h1>
            <p>{rank[2]}</p>
          </div>
          <div className="vop-score">
            <div>
              <strong>{score * 10}</strong>
              <span>points de vigilance</span>
            </div>
            <div>
              <strong>
                {score}/{deck.length}
              </strong>
              <span>messages bien lus</span>
            </div>
          </div>
          <h2>Les signes que vous savez repérer</h2>
          <div className="vop-signs">
            {learnt.map((sign) => (
              <span key={sign}>
                <Icon name="check" size={14} />
                {sign}
              </span>
            ))}
          </div>
          <p className="microcopy">
            {stats.signs.length} signe{stats.signs.length > 1 ? "s" : ""} repéré
            {stats.signs.length > 1 ? "s" : ""} en {stats.games} partie{stats.games > 1 ? "s" : ""} ·
            meilleur score : {stats.best} points
          </p>
          <Button onClick={() => to("setup")} icon="arrow">
            Rejouer avec d’autres messages
          </Button>
          <Button variant="secondary" onClick={() => go("scenarios")}>
            Vivre une histoire
          </Button>
          <Button variant="ghost" onClick={() => go("help")}>
            Besoin d’aide ?
          </Button>
        </div>
      </section>
    );
  }

  const right = results[round];
  return (
    <section className="screen vop vop-round">
      <header className="vop-bar">
        <button className="icon-button" onClick={quit} aria-label="Quitter la partie">
          <Icon name="back" />
        </button>
        <div>
          <strong>
            Message {round + 1} sur {deck.length}
          </strong>
          <ol aria-hidden>
            {deck.map((_, i) => (
              <li
                key={i}
                className={i < results.length ? (results[i] ? "right" : "seen") : i === round ? "now" : ""}
              />
            ))}
          </ol>
        </div>
        <span className="vop-points" aria-label={`${score * 10} points`}>
          <Icon name="spark" size={14} />
          {score * 10}
        </span>
      </header>

      {phase !== "round" && (
        <div className={`vop-message ${phase === "reveal" ? "compact" : ""}`}>
          <div className="vop-sender">
            <span aria-hidden>{card.sender.charAt(0)}</span>
            <div>
              <strong>{card.sender}</strong>
              <small>{card.status}</small>
            </div>
          </div>
          <div className="bubble">
            <p>{card.text}</p>
            {card.link && (
              <span className="vop-link">
                <Icon name="lock" size={13} />
                {card.link}
              </span>
            )}
          </div>
        </div>
      )}

      {phase === "message" && (
        <div className="choice-panel vop-panel">
          <p>Lisez ce message à voix haute</p>
          <h2>Vrai, ou piège ?</h2>
          <Button onClick={() => to("talk")} icon="arrow">
            On en discute
          </Button>
        </div>
      )}

      {phase === "talk" && (
        <div className="choice-panel vop-panel">
          <p>Discutez-en ensemble</p>
          {timer && !talkOver && <Countdown seconds={TALK_S} onEnd={() => setTalkOver(true)} />}
          {talkOver && <p className="vop-ready">Le temps de discussion est passé. Prenez-en plus si besoin.</p>}
          <ul className="vop-questions">
            <li>
              <Icon name="user" size={18} />
              Qui écrit ? Le connaît-on vraiment ?
            </li>
            <li>
              <Icon name="search" size={18} />
              Que demande ce message ?
            </li>
            <li>
              <Icon name="warning" size={18} />
              Pourquoi faudrait-il répondre tout de suite ?
            </li>
          </ul>
          <Button onClick={() => to("vote")} icon="arrow">
            Passer au vote
          </Button>
        </div>
      )}

      {phase === "vote" && (
        <div className="choice-panel vop-panel">
          <p>La réponse du groupe</p>
          <div className="vop-vote" role="radiogroup" aria-label="La réponse du groupe">
            <button
              role="radio"
              aria-checked={vote === false}
              className={`safe ${vote === false ? "selected" : ""}`}
              onClick={() => setVote(false)}
            >
              <Icon name="check" size={30} />
              <strong>Vrai</strong>
              <small>On peut lui faire confiance</small>
            </button>
            <button
              role="radio"
              aria-checked={vote === true}
              className={`trap ${vote === true ? "selected" : ""}`}
              onClick={() => setVote(true)}
            >
              <Icon name="warning" size={30} />
              <strong>Piège</strong>
              <small>Quelque chose cloche</small>
            </button>
          </div>
          <Button onClick={confirmVote} disabled={vote === null} icon="arrow">
            {vote === null ? "Choisissez une réponse" : "Valider notre réponse"}
          </Button>
          <Button variant="ghost" onClick={() => to("talk")}>
            On veut encore discuter
          </Button>
        </div>
      )}

      {phase === "reveal" && (
        <div className="choice-panel vop-panel vop-reveal">
          <div className={`vop-answer ${card.trap ? "trap" : "safe"}`} role="status">
            <span>
              <Icon name={card.trap ? "warning" : "check"} size={26} />
            </span>
            <div>
              <h2>{card.trap ? "C’était un piège !" : "C’était un vrai message."}</h2>
              <small>
                {right
                  ? "Bien vu, l’équipe !"
                  : card.trap
                    ? "Celui-là était bien déguisé. Voici ce qui le trahit."
                    : "Rester prudentes était normal. Voici ce qui rassure."}
              </small>
            </div>
          </div>
          <p>{card.trap ? "Les signes qui devaient vous alerter" : "Les signes qui rassurent"}</p>
          <ul className="vop-clues">
            {card.clues.map((clue, i) => (
              <li key={clue} style={{ animationDelay: `${200 + i * 140}ms` }}>
                <span>{i + 1}</span>
                {clue}
              </li>
            ))}
          </ul>
          <Button onClick={() => to("round")} icon="arrow">
            Le réflexe à retenir
          </Button>
        </div>
      )}

      {phase === "round" && (
        <div className="vop-result">
          <span className="vop-category">{card.category}</span>
          <div className="vop-reflex">
            <span>
              <Icon name="shield" size={24} />
            </span>
            <p className="eyebrow">Le réflexe à retenir</p>
            <p>{card.reflex}</p>
          </div>
          <div className="vop-gain">
            <strong>{right ? "+10" : "+0"}</strong>
            <p>
              {right
                ? "points de vigilance pour le groupe."
                : "point cette fois, mais un signe de plus dans votre mémoire."}
            </p>
          </div>
          {card.help && (
            <button className="vop-help" onClick={() => go("help")}>
              <Icon name="help" size={18} />
              Cette situation existe vraiment. Voir qui peut aider.
              <Icon name="chevron" size={16} />
            </button>
          )}
          <Button onClick={nextRound} icon="arrow">
            {round < deck.length - 1 ? "Message suivant" : "Voir la progression du groupe"}
          </Button>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// « Le grand quiz » : teams answer the same question on one shared screen
// (phone or projector). The facilitator taps each team's answer as it is
// called out; right answers score, and faster right answers score more.
// ---------------------------------------------------------------------------
type TeamQuestion = { q: string; a: string[]; correct: number; why: string };
const teamQuestions = teamQuizContent as TeamQuestion[];
const TEAM_TIME_S = 20;
const teamsAll = [
  { name: "Soleil", color: "var(--peach)" },
  { name: "Lune", color: "var(--mist)" },
  { name: "Baobab", color: "var(--sage)" },
  { name: "Étoile", color: "var(--coral)" },
];
const answerColors = ["#F58232", "#49372D", "#FFB36B", "#E8DCCB"];

function QuizEquipes({ go }: { go: (s: Screen) => void }) {
  const [phase, setPhase] = useState<"setup" | "question" | "reveal" | "scores" | "podium">("setup");
  const [teamCount, setTeamCount] = useState(2);
  const [length, setLength] = useState(6);
  const [questions, setQuestions] = useState<TeamQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<({ choice: number; at: number } | null)[]>([]);
  const [scores, setScores] = useState<number[]>([]);
  const [gained, setGained] = useState<number[]>([]);
  const [startedAt, setStartedAt] = useState(0);
  const [left, setLeft] = useState(TEAM_TIME_S);
  const teams = teamsAll.slice(0, teamCount);
  const question = questions[index];

  const begin = () => {
    setQuestions(shuffled(teamQuestions).slice(0, length));
    setScores(teams.map(() => 0));
    setIndex(0);
    ask();
  };
  const ask = () => {
    setAnswers(teamsAll.slice(0, teamCount).map(() => null));
    setStartedAt(Date.now());
    setLeft(TEAM_TIME_S);
    setPhase("question");
    window.scrollTo(0, 0);
  };
  const reveal = (final = answers) => {
    const points = final.map((answer) => {
      if (!answer || answer.choice !== question.correct) return 0;
      const remaining = Math.max(0, TEAM_TIME_S - answer.at / 1000) / TEAM_TIME_S;
      return Math.round((500 + 500 * remaining) / 10) * 10;
    });
    setGained(points);
    setScores((current) => current.map((s, i) => s + points[i]));
    vibrate([40, 40, 80]);
    setPhase("reveal");
  };
  useEffect(() => {
    if (phase !== "question") return;
    if (left <= 0) {
      reveal();
      return;
    }
    const id = window.setTimeout(() => setLeft((value) => value - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, left]);
  const answer = (team: number, choice: number) => {
    if (answers[team]) return;
    const next = answers.map((a, i) => (i === team ? { choice, at: Date.now() - startedAt } : a));
    setAnswers(next);
    vibrate(25);
    if (next.every(Boolean)) reveal(next);
  };
  const ranking = teams
    .map((team, i) => ({ ...team, score: scores[i] ?? 0, gained: gained[i] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const best = Math.max(1, ...ranking.map((t) => t.score));

  if (phase === "setup")
    return (
      <section className="screen team-quiz">
        <TopBar title="Le grand quiz" onBack={() => go("play")} />
        <div className="page-content">
          <p className="eyebrow">En équipes · un seul écran</p>
          <h1>Qui repère le mieux les pièges ?</h1>
          <p className="lead">
            Une question, quatre réponses, {TEAM_TIME_S} secondes. Chaque équipe annonce sa
            réponse : l’animatrice la touche. Juste et rapide = plus de points.
          </p>
          <h2>Combien d’équipes ?</h2>
          <div className="segmented">
            {[2, 3, 4].map((n) => (
              <button key={n} className={teamCount === n ? "on" : ""} onClick={() => setTeamCount(n)}>
                {n} équipes
              </button>
            ))}
          </div>
          <div className="team-chips">
            {teams.map((t) => (
              <span key={t.name} style={{ background: t.color }}>
                {t.name}
              </span>
            ))}
          </div>
          <h2>Combien de questions ?</h2>
          <div className="segmented">
            {[6, 10].map((n) => (
              <button key={n} className={length === n ? "on" : ""} onClick={() => setLength(n)}>
                {n} questions
                <small>{n === 6 ? "environ 6 minutes" : "environ 10 minutes"}</small>
              </button>
            ))}
          </div>
          <div className="tip">
            <Icon name="shield" />
            <p>
              <strong>Toutes les situations sont inventées.</strong>
              <br />
              On joue contre les pièges, pas les unes contre les autres : personne n’est jugé.
            </p>
          </div>
        </div>
        <div className="sticky-action">
          <Button onClick={begin} icon="arrow">
            Commencer
          </Button>
        </div>
      </section>
    );

  if (phase === "podium")
    return (
      <section className="screen team-quiz">
        <TopBar title="Le podium" onBack={() => go("play")} />
        <div className="page-content">
          <div className="podium">
            {ranking.slice(0, 3).map((t, i) => (
              <div key={t.name} className={`place place-${i + 1}`}>
                <span style={{ background: t.color }}>{i + 1}</span>
                <strong>{t.name}</strong>
                <small>{t.score} pts</small>
              </div>
            ))}
          </div>
          <h1>Bravo à toutes les équipes.</h1>
          <p className="lead">
            Chaque bonne réponse est un réflexe de plus pour se protéger, et pour protéger les
            autres.
          </p>
          <Button onClick={() => setPhase("setup")} icon="arrow">
            Rejouer
          </Button>
          <Button variant="secondary" onClick={() => go("help")}>
            Où trouver de l’aide
          </Button>
        </div>
      </section>
    );

  if (phase === "scores")
    return (
      <section className="screen team-quiz">
        <TopBar title={`Classement · ${index + 1}/${questions.length}`} onBack={() => go("play")} />
        <div className="page-content">
          <ol className="team-board">
            {ranking.map((t, i) => (
              <li key={t.name}>
                <span className="team-rank">{i + 1}</span>
                <div>
                  <strong>{t.name}</strong>
                  <i>
                    <b style={{ width: `${(t.score / best) * 100}%`, background: t.color }} />
                  </i>
                </div>
                <span className="team-score">
                  {t.score}
                  {t.gained > 0 && <small>+{t.gained}</small>}
                </span>
              </li>
            ))}
          </ol>
          {index < questions.length - 1 ? (
            <Button
              onClick={() => {
                setIndex(index + 1);
                ask();
              }}
              icon="arrow"
            >
              Question suivante
            </Button>
          ) : (
            <Button onClick={() => setPhase("podium")} icon="arrow">
              Voir le podium
            </Button>
          )}
        </div>
      </section>
    );

  return (
    <section className="screen team-quiz">
      <header className="team-bar">
        <button className="icon-button" onClick={() => go("play")} aria-label="Quitter la partie">
          <Icon name="back" />
        </button>
        <strong>
          Question {index + 1}/{questions.length}
        </strong>
        <span className={`team-timer ${phase === "question" && left <= 5 ? "hurry" : ""}`}>
          {phase === "question" ? left : <Icon name="check" size={18} />}
        </span>
      </header>
      {phase === "question" && (
        <div className="team-time" aria-hidden>
          <i style={{ width: `${(left / TEAM_TIME_S) * 100}%` }} />
        </div>
      )}
      <div className="page-content">
        <h1 className="team-question">{question.q}</h1>
        <div className="team-answers">
          {question.a.map((text, i) => (
            <div
              key={text}
              className={`team-answer ${phase === "reveal" ? (i === question.correct ? "right" : "dim") : ""}`}
              style={{ background: answerColors[i] }}
            >
              <b>{"ABCD"[i]}</b>
              <span>{text}</span>
            </div>
          ))}
        </div>
        {phase === "question" ? (
          <>
            <p className="team-help">Quand une équipe annonce sa réponse, touche sa lettre :</p>
            {teams.map((t, ti) => (
              <div className="team-row" key={t.name}>
                <span style={{ background: t.color }}>{t.name}</span>
                <div>
                  {[0, 1, 2, 3].map((c) => (
                    <button
                      key={c}
                      className={answers[ti]?.choice === c ? "picked" : ""}
                      disabled={!!answers[ti]}
                      onClick={() => answer(ti, c)}
                      aria-label={`${t.name} répond ${"ABCD"[c]}`}
                    >
                      {"ABCD"[c]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Button variant="ghost" onClick={() => reveal()}>
              Montrer la réponse
            </Button>
          </>
        ) : (
          <>
            <div className="team-why">
              <strong>Bonne réponse : {"ABCD"[question.correct]}</strong>
              <p>{question.why}</p>
            </div>
            <div className="team-gains">
              {teams.map((t, i) => (
                <span key={t.name} style={{ background: t.color }}>
                  {t.name} {gained[i] ? `+${gained[i]}` : "+0"}
                </span>
              ))}
            </div>
            <Button onClick={() => setPhase("scores")} icon="arrow">
              Voir le classement
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Coming soon: « Le grand quiz » on several phones, Kahoot-style. The
// facilitator shows a code, each player joins from her own phone and answers
// there. This screen is only a preview: the players are simulated on this
// device, nothing is sent anywhere. The real version needs a live relay
// between phones (to be chosen: Supabase Realtime, Firebase or PeerJS).
// ---------------------------------------------------------------------------
const demoPlayers = ["Aïcha", "Grâce", "Fifamè", "Nafissa", "Mariam", "Sènami"];
const DEMO_TIME_S = 15;

function QuizMultiApercu({ go }: { go: (s: Screen) => void }) {
  const [phase, setPhase] = useState<"lobby" | "question" | "reveal" | "board">("lobby");
  const [code] = useState(() => String(Math.floor(1000 + Math.random() * 9000)));
  const [joined, setJoined] = useState(0);
  const [question, setQuestion] = useState(() => shuffled(teamQuestions)[0]);
  const [left, setLeft] = useState(DEMO_TIME_S);
  const [answers, setAnswers] = useState<({ choice: number; at: number } | null)[]>([]);
  const [mine, setMine] = useState<number | null>(null);

  // Lobby: simulated players join one after another.
  useEffect(() => {
    if (phase !== "lobby" || joined >= demoPlayers.length) return;
    const id = window.setTimeout(() => setJoined((n) => n + 1), 600 + Math.random() * 700);
    return () => window.clearTimeout(id);
  }, [phase, joined]);

  // Question: countdown, and each simulated player answers at a random moment.
  useEffect(() => {
    if (phase !== "question") return;
    if (left <= 0 || answers.every(Boolean)) {
      setPhase("reveal");
      vibrate([40, 40, 80]);
      return;
    }
    const id = window.setTimeout(() => setLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(id);
  }, [phase, left, answers]);
  useEffect(() => {
    if (phase !== "question") return;
    // Player 0 (Aïcha) is the one shown on the mock phone: she answers when you tap.
    const timers = demoPlayers.slice(1).map((_, n) => n + 1).map((i) =>
      window.setTimeout(
        () => {
          const right = Math.random() < 0.7;
          const wrong = [0, 1, 2, 3].filter((c) => c !== question.correct);
          const choice = right ? question.correct : wrong[Math.floor(Math.random() * 3)];
          setAnswers((cur) => cur.map((a, n) => (n === i && !a ? { choice, at: Date.now() } : a)));
        },
        1500 + Math.random() * 9000,
      ),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [phase, question]);

  const start = () => {
    setQuestion(shuffled(teamQuestions)[0]);
    setAnswers(demoPlayers.map(() => null));
    setMine(null);
    setLeft(DEMO_TIME_S);
    setPhase("question");
    window.scrollTo(0, 0);
  };
  const startedAt = useRef(0);
  useEffect(() => {
    if (phase === "question") startedAt.current = Date.now();
  }, [phase]);
  const points = (a: { choice: number; at: number } | null) => {
    if (!a || a.choice !== question.correct) return 0;
    const remaining = Math.max(0, DEMO_TIME_S - (a.at - startedAt.current) / 1000) / DEMO_TIME_S;
    return Math.round((500 + 500 * remaining) / 10) * 10;
  };
  const answered = answers.filter(Boolean).length;
  const ranking = demoPlayers
    .map((name, i) => ({ name, i, score: points(answers[i] ?? null) }))
    .sort((a, b) => b.score - a.score);
  const best = Math.max(1, ...ranking.map((r) => r.score));

  const banner = (
    <div className="multi-banner">
      <Icon name="spark" size={16} /> Aperçu · fonctionnalité à venir. Les joueuses sont simulées.
    </div>
  );

  if (phase === "lobby")
    return (
      <section className="screen team-quiz">
        <TopBar title="Quiz sur plusieurs téléphones" onBack={() => go("play")} />
        <div className="page-content">
          {banner}
          <p className="eyebrow">Écran de l’animatrice</p>
          <h1>Rejoignez la partie avec ce code</h1>
          <div className="multi-code" aria-label={`Code de la partie ${code}`}>
            {code.split("").map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <p className="lead">
            Chaque joueuse ouvre Ayidote sur son téléphone, touche « Rejoindre » et tape le code.
            Pas de compte, juste un prénom ou un pseudo.
          </p>
          <h2>
            {joined} joueuse{joined > 1 ? "s" : ""} connectée{joined > 1 ? "s" : ""}
          </h2>
          <div className="team-chips multi-players">
            {demoPlayers.slice(0, joined).map((n, i) => (
              <span key={n} style={{ background: teamsAll[i % teamsAll.length].color }}>
                {n}
              </span>
            ))}
          </div>
        </div>
        <div className="sticky-action">
          <Button onClick={start} icon="arrow" disabled={joined < 2}>
            Lancer la question
          </Button>
        </div>
      </section>
    );

  if (phase === "board")
    return (
      <section className="screen team-quiz">
        <TopBar title="Classement" onBack={() => go("play")} />
        <div className="page-content">
          {banner}
          <ol className="team-board">
            {ranking.map((r, i) => (
              <li key={r.name}>
                <span className="team-rank">{i + 1}</span>
                <div>
                  <strong>{r.name}</strong>
                  <i>
                    <b
                      style={{
                        width: `${(r.score / best) * 100}%`,
                        background: teamsAll[r.i % teamsAll.length].color,
                      }}
                    />
                  </i>
                </div>
                <span className="team-score">{r.score}</span>
              </li>
            ))}
          </ol>
          <div className="tip">
            <Icon name="shield" />
            <p>
              <strong>Dans la vraie version</strong>
              <br />
              Chaque joueuse voit son propre score sur son téléphone, et seul le prénom choisi est
              partagé, le temps de la partie.
            </p>
          </div>
          <Button onClick={start} icon="arrow">
            Une autre question
          </Button>
          <Button variant="secondary" onClick={() => go("equipes")}>
            Jouer sur un seul écran
          </Button>
        </div>
      </section>
    );

  return (
    <section className="screen team-quiz">
      <header className="team-bar">
        <button className="icon-button" onClick={() => go("play")} aria-label="Quitter l’aperçu">
          <Icon name="back" />
        </button>
        <strong>
          {phase === "question" ? `${answered}/${demoPlayers.length} ont répondu` : "Réponse"}
        </strong>
        <span className={`team-timer ${phase === "question" && left <= 5 ? "hurry" : ""}`}>
          {phase === "question" ? left : <Icon name="check" size={18} />}
        </span>
      </header>
      {phase === "question" && (
        <div className="team-time" aria-hidden>
          <i style={{ width: `${(left / DEMO_TIME_S) * 100}%` }} />
        </div>
      )}
      <div className="page-content">
        {banner}
        <p className="eyebrow">Écran de l’animatrice</p>
        <h1 className="team-question">{question.q}</h1>
        <div className="team-answers">
          {question.a.map((text, i) => (
            <div
              key={text}
              className={`team-answer ${phase === "reveal" ? (i === question.correct ? "right" : "dim") : ""}`}
              style={{ background: answerColors[i] }}
            >
              <b>{"ABCD"[i]}</b>
              <span>{text}</span>
              {phase === "reveal" && (
                <small className="multi-count">
                  {answers.filter((a) => a?.choice === i).length}
                </small>
              )}
            </div>
          ))}
        </div>
        {phase === "question" ? (
          <div className="multi-phone">
            <p className="eyebrow">Et sur le téléphone d’une joueuse</p>
            <div className="multi-phone-frame">
              <small>Aïcha · Question 1</small>
              <div className="multi-pad">
                {[0, 1, 2, 3].map((c) => (
                  <button
                    key={c}
                    style={{ background: answerColors[c] }}
                    className={mine === c ? "picked" : mine !== null ? "dim" : ""}
                    onClick={() => {
                      if (mine !== null) return;
                      setMine(c);
                      setAnswers((cur) =>
                        cur.map((a, n) => (n === 0 && !a ? { choice: c, at: Date.now() } : a)),
                      );
                      vibrate(25);
                    }}
                    aria-label={`Répondre ${"ABCD"[c]}`}
                  >
                    {"ABCD"[c]}
                  </button>
                ))}
              </div>
              <small>{mine === null ? "Touche ta réponse" : "Réponse envoyée ✓"}</small>
            </div>
          </div>
        ) : (
          <>
            <div className="team-why">
              <strong>Bonne réponse : {"ABCD"[question.correct]}</strong>
              <p>{question.why}</p>
            </div>
            <Button onClick={() => setPhase("board")} icon="arrow">
              Voir le classement
            </Button>
          </>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// « Défis en groupe » : one phone for the group. Each card is a true/false, a
// question to answer aloud, a situation to discuss or an action to do
// together on everyone's phone. The group decides if it succeeded: no one is
// scored individually. Content: src/content/defis.json.
// ---------------------------------------------------------------------------
type Defi = {
  theme: "loi" | "attitudes" | "alerte";
  type: "vrai-faux" | "question" | "situation" | "action";
  prompt: string;
  answer?: boolean;
  reveal: string;
};
const defis = defisContent as Defi[];
const defiThemes: { id: Defi["theme"] | "tout"; icon: IconName; title: string; text: string }[] = [
  { id: "loi", icon: "book", title: "Le Code du numérique", text: "Ce que dit la loi au Bénin" },
  { id: "attitudes", icon: "shield", title: "Les bonnes attitudes", text: "Réagir, aider, se protéger" },
  { id: "alerte", icon: "warning", title: "Le bouton d’alerte", text: "Quitter vite, alerter, qui appeler" },
  { id: "tout", icon: "spark", title: "Tout mélanger", text: "Un peu de chaque" },
];
const defiTypes: Record<Defi["type"], string> = {
  "vrai-faux": "Vrai ou faux ?",
  question: "Question",
  situation: "Que faites-vous ?",
  action: "Défi action",
};
const DEFIS_PAR_PARTIE = 6;

function DefisGroupe({ go }: { go: (s: Screen) => void }) {
  const [deck, setDeck] = useState<Defi[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState<boolean | null>(null);
  const [won, setWon] = useState<boolean[]>([]);
  const start = (theme: Defi["theme"] | "tout") => {
    const pool = theme === "tout" ? defis : defis.filter((d) => d.theme === theme);
    setDeck(shuffled(pool).slice(0, DEFIS_PAR_PARTIE));
    setIndex(0);
    setWon([]);
    setRevealed(false);
    setGuess(null);
    window.scrollTo(0, 0);
  };
  const next = (success: boolean) => {
    setWon([...won, success]);
    setIndex(index + 1);
    setRevealed(false);
    setGuess(null);
    vibrate(success ? [30, 40, 60] : 25);
    window.scrollTo(0, 0);
  };
  const defi = deck[index];

  if (!deck.length)
    return (
      <section className="screen team-quiz">
        <TopBar title="Défis en groupe" onBack={() => go("play")} />
        <div className="page-content">
          <p className="eyebrow">En groupe · un seul téléphone</p>
          <h1>Prêtes à relever les défis ?</h1>
          <p className="lead">
            {DEFIS_PAR_PARTIE} défis : des vrai ou faux, des questions, des situations à discuter et
            des actions à faire ensemble sur vos téléphones. Le groupe décide s’il a réussi.
          </p>
          {defiThemes.map((t) => (
            <button className="wide-link" key={t.id} onClick={() => start(t.id)}>
              <span className="link-icon">
                <Icon name={t.icon} />
              </span>
              <span>
                <strong>{t.title}</strong>
                <small>{t.text}</small>
              </span>
              <Icon name="chevron" />
            </button>
          ))}
          <div className="tip">
            <Icon name="shield" />
            <p>
              <strong>On joue ensemble, pas les unes contre les autres.</strong>
              <br />
              Personne n’a à raconter sa propre histoire.
            </p>
          </div>
        </div>
      </section>
    );

  if (!defi) {
    const score = won.filter(Boolean).length;
    return (
      <section className="screen team-quiz">
        <TopBar title="Défis en groupe" onBack={() => go("play")} />
        <div className="page-content">
          <div className="defi-stars" aria-label={`${score} défis réussis sur ${won.length}`}>
            {won.map((w, i) => (
              <span key={i} className={w ? "on" : ""}>
                ★
              </span>
            ))}
          </div>
          <h1>
            {score} défi{score > 1 ? "s" : ""} réussi{score > 1 ? "s" : ""} sur {won.length}
          </h1>
          <p className="lead">
            {score === won.length
              ? "Bravo, le groupe est prêt à se protéger et à protéger les autres."
              : "Chaque défi discuté est un réflexe de plus. Rejouez pour les relever tous."}
          </p>
          <Button onClick={() => setDeck([])} icon="arrow">
            Choisir d’autres défis
          </Button>
          <Button variant="secondary" onClick={() => go("help")}>
            Où trouver de l’aide
          </Button>
        </div>
      </section>
    );
  }

  const isVF = defi.type === "vrai-faux";
  return (
    <section className="screen team-quiz">
      <TopBar
        title={`Défi ${index + 1}/${deck.length}`}
        onBack={() => setDeck([])}
        action={<QuickExitButton />}
      />
      <div className="page-content">
        <span className={`defi-badge ${defi.type}`}>{defiTypes[defi.type]}</span>
        <h1 className="team-question">{defi.prompt}</h1>
        {isVF && !revealed && (
          <div className="defi-vf">
            {[true, false].map((v) => (
              <button
                key={String(v)}
                onClick={() => {
                  setGuess(v);
                  setRevealed(true);
                }}
              >
                {v ? "Vrai" : "Faux"}
              </button>
            ))}
          </div>
        )}
        {!isVF && !revealed && (
          <>
            <p className="team-help">
              {defi.type === "action"
                ? "Faites-le ensemble, puis regardez l’explication."
                : "Discutez entre vous, puis découvrez la réponse."}
            </p>
            <Button onClick={() => setRevealed(true)} icon="eye">
              {defi.type === "action" ? "C’est fait, voir l’explication" : "Voir la réponse"}
            </Button>
          </>
        )}
        {revealed && (
          <>
            <div className={`team-why ${isVF ? (guess === defi.answer ? "good" : "miss") : ""}`}>
              {isVF && <strong>{guess === defi.answer ? "Bien vu !" : "Pas tout à fait."}</strong>}
              <p>{defi.reveal}</p>
            </div>
            {isVF ? (
              <Button onClick={() => next(guess === defi.answer)} icon="arrow">
                Défi suivant
              </Button>
            ) : (
              <>
                <Button onClick={() => next(true)} icon="check">
                  Défi réussi
                </Button>
                <Button variant="secondary" onClick={() => next(false)}>
                  Pas encore, on passe
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}

/** Two speech bubbles: one checked, one flagged. Dots show the group's score. */
function VopArt({ lit, total }: { lit?: number; total?: number }) {
  return (
    <svg className="vop-art" viewBox="0 0 200 130" role="img" aria-label="Vrai ou piège ?">
      <rect x="14" y="16" width="96" height="62" rx="18" fill="var(--sage-light)" />
      <path d="M34 78v18l18-18Z" fill="var(--sage-light)" />
      <path
        d="m46 47 11 11 21-22"
        fill="none"
        stroke="var(--sage)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="92" y="40" width="96" height="62" rx="18" fill="var(--plum)" />
      <path d="M168 102v18l-18-18Z" fill="var(--plum)" />
      <path d="M140 56v20" stroke="var(--orange)" strokeWidth="7" strokeLinecap="round" />
      <circle cx="140" cy="88" r="4.5" fill="var(--orange)" />
      {total !== undefined &&
        Array.from({ length: total }, (_, i) => (
          <circle
            key={i}
            cx={100 - (total - 1) * 7 + i * 14}
            cy="124"
            r="4.5"
            fill={i < (lit ?? 0) ? "var(--orange)" : "var(--sand)"}
          />
        ))}
    </svg>
  );
}

/** The « Jouer » tab: every activity in one place, the group game first. */
function Play({
  go,
  story,
  scenario,
}: {
  go: (s: Screen) => void;
  story: number;
  scenario: Scenario;
}) {
  const inStory = story > 0 && story < scenario.steps.length;
  return (
    <section className="screen with-nav">
      <TopBar title="Jouer" onBack={() => go("home")} />
      <div className="page-content home-content">
        <button className="vop-card team-card" onClick={() => go("equipes")}>
          <span className="eyebrow">En équipes · un seul écran</span>
          <strong>Le grand quiz</strong>
          <span>Jusqu’à 4 équipes. Répondez juste et vite, le classement s’affiche à chaque question.</span>
          <span className="vop-card-cta">
            Lancer une partie <Icon name="arrow" size={18} />
          </span>
        </button>
        <button className="wide-link" onClick={() => go("vop")}>
          <span className="link-icon">
            <Icon name="message" />
          </span>
          <span>
            <strong>Vrai ou piège ?</strong>
            <small>Un message s’affiche, le groupe décide ensemble</small>
          </span>
          <Icon name="chevron" />
        </button>
        <button className="wide-link" onClick={() => go("defis")}>
          <span className="link-icon orange">
            <Icon name="check" />
          </span>
          <span>
            <strong>Défis en groupe</strong>
            <small>La loi, les bons réflexes, le bouton d’alerte : relevez les défis ensemble</small>
          </span>
          <Icon name="chevron" />
        </button>
        <h2 className="section-title">Bientôt</h2>
        <button className="wide-link soon" onClick={() => go("multi")}>
          <span className="link-icon">
            <Icon name="spark" />
          </span>
          <span>
            <strong>Le grand quiz, chacune sur son téléphone</strong>
            <small>Comme un quiz en direct : un code, et toutes répondent en même temps. Voir l’aperçu</small>
          </span>
          <Icon name="chevron" />
        </button>
        <h2 className="section-title">Jouer seule</h2>
        <button className="wide-link" onClick={() => go("mot")}>
          <span className="link-icon orange">
            <Icon name="search" />
          </span>
          <span>
            <strong>Le mot du jour</strong>
            <small>Devine le thème, ouvre l’histoire du jour</small>
          </span>
          <Icon name="chevron" />
        </button>
        <button className="wide-link" onClick={() => go(inStory ? "story" : "scenarios")}>
          <span className="link-icon">
            <Icon name="message" />
          </span>
          <span>
            <strong>Histoires interactives</strong>
            <small>{inStory ? `Reprendre « ${scenario.title} »` : "Une conversation, tes choix"}</small>
          </span>
          <Icon name="chevron" />
        </button>
        <button className="wide-link" onClick={() => go("quiz")}>
          <span className="link-icon orange">
            <Icon name="spark" />
          </span>
          <span>
            <strong>Quiz sans jugement</strong>
            <small>5 questions sur les pièges en ligne</small>
          </span>
          <Icon name="chevron" />
        </button>
      </div>
      <BottomNav active="play" go={go} />
    </section>
  );
}

function Phishing({
  onNext,
  clue,
  fresh,
}: {
  onNext: () => void;
  clue?: string;
  fresh: number[];
}) {
  return (
    <section className="screen explain-screen">
      <div className="explain-hero">
        <span>
          <Icon name="warning" size={38} />
        </span>
        <p className="eyebrow">Simulation interrompue</p>
        <h1>Cette page cherchait tes identifiants.</h1>
        <p>
          Tu n’as rien envoyé. Dans la vraie vie, un faux formulaire peut récupérer ton mot de
          passe.
        </p>
      </div>
      <div className="page-content">
        <h2>Les 3 indices que tu as repérés</h2>
        {[
          ["message", "Un lien inattendu", clue ?? "Tu n’attendais pas ce lien."],
          [
            "lock",
            "Une demande de connexion",
            "Le contenu promis est caché derrière un formulaire.",
          ],
          ["search", "Une adresse étrange", "Le domaine ne correspond à aucun service attendu."],
        ].map(([i, t, p], n) => (
          <div className="clue" key={t}>
            <span>{n + 1}</span>
            <div>
              <strong>{t}</strong>
              <p>{p}</p>
            </div>
            <Icon name={i as IconName} />
          </div>
        ))}
        <div className="password-reflex">
          <p className="eyebrow">Le réflexe mot de passe</p>
          <ol>
            <li>Je ne tape jamais mon mot de passe sur une page ouverte depuis un lien reçu.</li>
            <li>J’utilise un mot de passe différent pour chaque compte.</li>
            <li>Je choisis une phrase longue plutôt qu’un mot court : « MaSœurAime3Mangues! ».</li>
            <li>J’active la double vérification et je ne donne jamais le code reçu par SMS.</li>
            <li>Personne n’a le droit d’exiger mes codes, même mon copain ou ma famille.</li>
          </ol>
        </div>
        <div className="tip">
          <Icon name="shield" />
          <p>
            <strong>Bon réflexe</strong>
            <br />
            Ferme la page, puis ouvre toi-même le service officiel si tu dois vérifier quelque
            chose.
          </p>
        </div>
        <ReflexUnlock fresh={fresh} />
      </div>
      <div className="sticky-action">
        <Button onClick={onNext} icon="arrow">
          Comprendre et continuer
        </Button>
      </div>
    </section>
  );
}

function Resources({ go }: { go: (s: Screen) => void }) {
  const [open, setOpen] = useState(0);
  const cards = [
    {
      icon: "download" as IconName,
      title: "Conserver les preuves",
      intro: "Documenter sans faire circuler.",
      items: [
        "Fais des captures d’écran avec la date et l’heure.",
        "Garde le numéro, le profil et les liens concernés.",
        "Ne supprime pas la conversation trop vite.",
        "Ne transfère jamais une image intime.",
      ],
    },
    {
      icon: "lock" as IconName,
      title: "Protéger ses comptes",
      intro: "Reprendre le contrôle étape par étape.",
      items: [
        "Utilise un mot de passe différent par compte.",
        "Active la double authentification.",
        "Ne partage jamais un code reçu par SMS.",
        "Vérifie les sessions et paramètres de confidentialité.",
        "WhatsApp : Paramètres → Compte → Vérification en deux étapes → Activer.",
      ],
    },
    {
      icon: "eye" as IconName,
      title: "Régler qui voit quoi",
      intro: "Cinq minutes pour fermer les portes.",
      items: [
        "Facebook : Paramètres → Confidentialité → Qui peut voir mes publications → « Amis ».",
        "WhatsApp : Paramètres → Confidentialité → Photo de profil → « Mes contacts ».",
        "TikTok : Profil → Paramètres → Confidentialité → Compte privé.",
        "Ne laisse pas ton numéro visible par tout le monde.",
        "Coupe le partage de ta position dans les applications.",
        "Tape ton nom dans un moteur de recherche de temps en temps.",
      ],
    },
    {
      icon: "message" as IconName,
      title: "Bloquer et signaler",
      intro: "Couper le contact sans te justifier.",
      items: [
        "Capture d’abord les preuves, puis bloque.",
        "Facebook : ouvre le profil → « Bloquer » → « Signaler » → choisis la raison.",
        "WhatsApp : appui long sur le message → « Signaler » → « Bloquer le contact ».",
        "TikTok : appui long sur le commentaire → « Signaler » → choisis la catégorie.",
        "Si un message t’énerve, attends avant de répondre : la réponse à chaud nourrit l’escalade.",
        "Ne repartage pas un contenu haineux, même pour le dénoncer.",
      ],
    },
    {
      icon: "check" as IconName,
      title: "Les réflexes du quotidien",
      intro: "Comme se laver les mains, mais en ligne.",
      items: [
        "Verrouille ton téléphone avec un code ou ton empreinte.",
        "Sur un téléphone prêté ou au cybercafé, déconnecte tes comptes avant de partir.",
        "Pas de compte sensible ni de Mobile Money sur un Wi-Fi public.",
        "Fais les mises à jour : elles réparent des failles.",
        "N’installe des applications que depuis le store officiel.",
        "N’accepte en ami que des personnes que tu connais vraiment.",
      ],
    },
  ];
  return (
    <section className="screen with-nav resources">
      <TopBar title="Les bons gestes" onBack={() => go("help")} />
      <div className="page-content">
        <div className="resource-title">
          <span>
            <Icon name="shield" size={30} />
          </span>
          <h1>Les bons gestes, étape par étape.</h1>
          <p>Ce que tu peux faire toi-même, dès maintenant.</p>
        </div>
        {cards.map((c, i) => (
          <article className={`resource-card ${open === i ? "open" : ""}`} key={c.title}>
            <button onClick={() => setOpen(open === i ? -1 : i)}>
              <span className="resource-icon">
                <Icon name={c.icon} />
              </span>
              <span>
                <strong>{c.title}</strong>
                <small>{c.intro}</small>
              </span>
              <Icon name="chevron" />
            </button>
            {open === i && (
              <div className="resource-body">
                {c.items.map((x, n) => (
                  <div key={x}>
                    <span>{n + 1}</span>
                    <p>{x}</p>
                  </div>
                ))}
                {i === 0 && (
                  <p className="safety-first">
                    <Icon name="warning" size={16} /> Ne prends pas de risques pour conserver une
                    preuve. Ta sécurité passe avant tout.
                  </p>
                )}
              </div>
            )}
          </article>
        ))}
        <div className="help-now">
          <p className="eyebrow">Besoin de souffler ?</p>
          <h3>Pose le téléphone si tu peux.</h3>
          <p>Respire, rapproche-toi d’une personne sûre et avance une étape à la fois.</p>
        </div>
        <Button onClick={() => go("guide")} icon="download">
          Voir mes 6 réflexes
        </Button>
        <Button variant="secondary" onClick={() => go("help")} icon="help">
          Trouver de l’aide
        </Button>
      </div>
      <BottomNav active="settings" go={go} />
    </section>
  );
}

// Who to turn to in Benin. The short numbers come from the official list
// published by ARCEP Bénin (June 2026), cross-checked with the Government's
// VBG-FT platform (adovbg-ft.social.gouv.bj) and the UNFPA Bénin digital
// hygiene training; they must be checked again before each release. Ayidote never calls or writes to anyone itself.
const helpContacts = [
  {
    icon: "warning",
    name: "Police Républicaine",
    number: "117",
    when: "Tu es en danger maintenant, ou quelqu’un te menace physiquement.",
    what: "Numéro d’urgence gratuit, jour et nuit.",
  },
  {
    icon: "shield",
    name: "Institut National de la Femme (INF)",
    number: "114",
    when: "Tu subis un chantage, du harcèlement ou une violence parce que tu es une fille ou une femme, y compris en ligne.",
    what: "Écoute, orientation et accompagnement pour porter plainte.",
  },
  {
    icon: "user",
    name: "Ligne d’assistance aux enfants",
    number: "138",
    when: "Tu as moins de 18 ans et tu as besoin d’en parler, ou tu t’inquiètes pour une mineure.",
    what: "Écoute et orientation gratuites, relayées par le Guichet Unique de Protection Sociale.",
  },
  {
    icon: "user",
    name: "Brigade des mineurs",
    number: "160",
    when: "Tu as moins de 18 ans, ou la victime est mineure.",
    what: "Protection des enfants et des adolescentes.",
  },
  {
    icon: "lock",
    name: "Protection des données personnelles (APDP)",
    number: "150",
    when: "Tes photos, ton numéro ou tes informations circulent sans ton accord.",
    what: "Autorité qui fait respecter tes droits sur tes données.",
  },
  {
    icon: "search",
    name: "Centre National d’Investigations Numériques (CNIN)",
    number: "151",
    when: "Arnaque en ligne, compte piraté, chantage à la photo ou à la vidéo.",
    what: "Service d’enquête spécialisé. Le dépôt de plainte est gratuit : passe par un commissariat ou par ses canaux officiels, jamais par un inconnu qui dit le représenter.",
  },
] as { icon: IconName; name: string; number: string; when: string; what: string }[];

// Official texts, on the Government's site (Secrétariat Général du
// Gouvernement) and on the sites of the bodies concerned. Links checked on
// 13 November 2026; the summaries are ours and do not replace the texts.
const rights = [
  {
    icon: "shield",
    title: "Les violences faites aux femmes sont punies",
    text: "Une loi spéciale définit les violences faites aux femmes et aux filles, les punit et prévoit la protection des victimes.",
    law: "Loi n° 2011-26 portant prévention et répression des violences faites aux femmes",
    url: "https://sgg.gouv.bj/doc/loi-2011-26/",
    cta: "Lire la loi (site du Gouvernement)",
  },
  {
    icon: "warning",
    title: "Être visée parce que tu es une femme est une infraction",
    text: "Cette loi renforce la répression des infractions commises contre une personne à cause de son sexe et la protection des femmes.",
    law: "Loi n° 2021-11 portant dispositions spéciales de répression des infractions commises à raison du sexe des personnes et de protection de la femme",
    url: "https://sgg.gouv.bj/doc/loi-2021-11/",
    cta: "Lire la loi (site du Gouvernement)",
  },
  {
    icon: "lock",
    title: "En ligne aussi, tu as des droits",
    text: "Le Code du numérique réprime la cybercriminalité et protège tes données personnelles : ton image, ton numéro et tes informations ne peuvent pas être utilisés n’importe comment.",
    law: "Loi n° 2017-20 portant code du numérique en République du Bénin, modifiée par la loi n° 2020-35 du 6 janvier 2021",
    url: "https://sgg.gouv.bj/doc/loi-2017-20/",
    cta: "Lire le Code du numérique",
  },
  {
    icon: "user",
    title: "Faire respecter tes données",
    text: "L’Autorité de Protection des Données à caractère Personnel (APDP) reçoit les plaintes quand tes informations sont utilisées sans ton accord.",
    law: "Autorité de Protection des Données à caractère Personnel",
    url: "https://apdp.bj/",
    cta: "Site de l’APDP",
  },
  {
    icon: "help",
    title: "Être écoutée et accompagnée",
    text: "L’Institut National de la Femme écoute, oriente et accompagne les femmes victimes de violences. Appel gratuit au 114.",
    law: "Institut National de la Femme (INF)",
    url: "https://inf.bj/",
    cta: "Site de l’INF",
  },
] as { icon: IconName; title: string; text: string; law: string; url: string; cta: string }[];

// What the law guarantees to a victim during the procedure, as presented by the
// Government's VBG-FT platform (adovbg-ft.social.gouv.bj/texte-de-loi).
const victimRights = [
  ["Être informée", "On doit t’expliquer tes droits et chaque étape de la procédure."],
  ["Être protégée", "Des mesures peuvent tenir l’auteur à distance et assurer ta sécurité."],
  ["Être accompagnée", "Une aide juridique et psychologique gratuite existe."],
  ["Obtenir réparation", "Le préjudice que tu as subi peut être indemnisé."],
  ["Rester anonyme", "Ton identité peut être protégée pendant la procédure."],
  ["Faire appel", "Tu peux contester une décision qui ne te paraît pas juste."],
];

// How to support a friend, from the same platform's "Prise en charge" page.
const helpFriendDo = [
  "La croire.",
  "Respecter son rythme.",
  "L’encourager à chercher de l’aide.",
  "L’aider à garder les preuves, si c’est sans danger.",
  "Veiller à sa sécurité.",
];
const helpFriendDont = [
  "Minimiser ce qu’elle vit.",
  "La rendre responsable.",
  "La forcer à porter plainte.",
  "Faire circuler les images, même pour la défendre.",
];

function Help({ go }: { go: (s: Screen) => void }) {
  return (
    <section className="screen with-nav resources">
      <TopBar title="Trouver de l’aide" onBack={() => go("settings")} />
      <div className="page-content">
        <div className="resource-title">
          <span>
            <Icon name="help" size={30} />
          </span>
          <h1>Tu n’as pas à gérer ça seule.</h1>
          <p>Ces structures existent pour t’écouter et te protéger.</p>
        </div>
        <div className="help-first">
          <Icon name="user" />
          <p>
            <strong>D’abord, une personne de confiance.</strong>
            <br />
            Une sœur, une amie, une tante, une enseignante. En parler n’est pas une faute, et tu
            n’as pas à tout raconter pour être aidée.
          </p>
        </div>
        <h2>Les structures compétentes au Bénin</h2>
        {helpContacts.map((c) => (
          <article className="help-contact" key={c.name}>
            <span className="resource-icon">
              <Icon name={c.icon} />
            </span>
            <div>
              <strong>{c.name}</strong>
              <p className="help-when">{c.when}</p>
              <p>{c.what}</p>
              {c.number && (
                <a className="help-call" href={`tel:${c.number}`}>
                  Appeler le {c.number}
                </a>
              )}
            </div>
          </article>
        ))}
        <article className="help-contact">
          <span className="resource-icon">
            <Icon name="message" />
          </span>
          <div>
            <strong>Signaler sur l’application concernée</strong>
            <p>
              Utilise le bouton « Signaler » du compte ou du message, puis bloque. Le signalement
              reste anonyme pour la personne signalée.
            </p>
          </div>
        </article>
        <article className="help-contact">
          <span className="resource-icon">
            <Icon name="search" />
          </span>
          <div>
            <strong>La plateforme officielle VBG-FT</strong>
            <p>
              Le ministère des Affaires sociales y explique les violences en ligne, liste les
              structures de prise en charge et permet de signaler un cas.
            </p>
            <a
              className="help-link"
              href="https://adovbg-ft.social.gouv.bj/"
              target="_blank"
              rel="noopener noreferrer"
            >
              adovbg-ft.social.gouv.bj <Icon name="arrow" size={14} />
            </a>
          </div>
        </article>
        <h2>Tes droits au Bénin</h2>
        <p className="help-intro">
          Ce que tu vis est puni par la loi. Ces textes officiels le disent : l’INF ou un
          commissariat peut t’aider à les faire valoir.
        </p>
        {rights.map((r) => (
          <article className="help-contact right" key={r.law}>
            <span className="resource-icon">
              <Icon name={r.icon} />
            </span>
            <div>
              <strong>{r.title}</strong>
              <p>{r.text}</p>
              <p className="help-when">{r.law}</p>
              <a className="help-link" href={r.url} target="_blank" rel="noopener noreferrer">
                {r.cta} <Icon name="arrow" size={14} />
              </a>
            </div>
          </article>
        ))}
        <h2>Tes droits de victime</h2>
        <p className="help-intro">
          La honte doit changer de camp : ce n’est jamais la faute de la victime. Si tu portes
          plainte, la loi te garantit :
        </p>
        <ul className="help-list">
          {victimRights.map(([t, d]) => (
            <li key={t}>
              <Icon name="check" size={16} />
              <span>
                <strong>{t}.</strong> {d}
              </span>
            </li>
          ))}
        </ul>
        <h2>Une amie te confie qu’elle est victime ?</h2>
        <ul className="help-list">
          {helpFriendDo.map((x) => (
            <li key={x}>
              <Icon name="check" size={16} />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <p className="help-intro">À éviter :</p>
        <ul className="help-list avoid">
          {helpFriendDont.map((x) => (
            <li key={x}>
              <Icon name="warning" size={16} />
              <span>{x}</span>
            </li>
          ))}
        </ul>
        <div className="tip">
          <Icon name="eye" />
          <p>
            <strong>Avant d’ouvrir un lien</strong>
            <br />
            Les sites que tu visites restent dans l’historique de ton navigateur. Si quelqu’un
            surveille ton téléphone, utilise la navigation privée ou le téléphone d’une personne
            sûre.
          </p>
        </div>
        <div className="tip">
          <Icon name="eye" />
          <p>
            <strong>Avant d’appeler</strong>
            <br />
            Un appel reste visible dans le journal de ton téléphone. Si quelqu’un le surveille,
            appelle depuis le téléphone d’une personne sûre.
          </p>
        </div>
        <p className="disclaimer">
          Ayidote n’appelle et n’écrit à personne à ta place. Numéros courts de la liste officielle
          de l’ARCEP Bénin (juin 2026) et de la plateforme VBG-FT du Gouvernement : ils peuvent
          changer.
        </p>
        <Button variant="secondary" onClick={() => go("resources")} icon="shield">
          Voir les gestes à faire toi-même
        </Button>
      </div>
      <BottomNav active="settings" go={go} />
    </section>
  );
}

function Quiz({
  index,
  choice,
  setChoice,
  onNext,
  onBack,
}: {
  index: number;
  score: number;
  choice: number | null;
  setChoice: (n: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const item = quiz[index];
  return (
    <section className="screen quiz">
      <TopBar title="Quiz sans jugement" onBack={onBack} action={<strong>{index + 1}/5</strong>} />
      <div className="quiz-progress">
        {quiz.map((_, i) => (
          <i key={i} className={i <= index ? "done" : ""} />
        ))}
      </div>
      <div className="page-content">
        <p className="eyebrow">Question {index + 1}</p>
        <h1>{item.q}</h1>
        <div className="quiz-options">
          {item.a.map((a, i) => (
            <button
              key={a}
              disabled={choice !== null}
              onClick={() => setChoice(i)}
              className={
                choice === i
                  ? i === item.correct
                    ? "correct"
                    : "wrong"
                  : choice !== null && i === item.correct
                    ? "correct"
                    : ""
              }
            >
              <span>{String.fromCharCode(65 + i)}</span>
              {a}
              {choice !== null && i === item.correct && <Icon name="check" />}
            </button>
          ))}
        </div>
        {choice !== null && (
          <div className={`quiz-explain ${choice === item.correct ? "good" : "learn"}`}>
            <span>
              <Icon name={choice === item.correct ? "check" : "spark"} />
            </span>
            <div>
              <strong>{choice === item.correct ? "Bien vu !" : "À retenir"}</strong>
              <p>{item.why}</p>
            </div>
          </div>
        )}
      </div>
      <div className="sticky-action">
        <Button onClick={onNext} disabled={choice === null} icon="arrow">
          {index === 4 ? "Voir mon bilan" : "Question suivante"}
        </Button>
      </div>
    </section>
  );
}

function QuizResult({
  score,
  onRetry,
  go,
}: {
  score: number;
  onRetry: () => void;
  go: (s: Screen) => void;
}) {
  return (
    <section className="screen finish">
      <div className="confetti-lines" />
      <div className="finish-icon">
        <Icon name="spark" size={42} />
      </div>
      <p className="eyebrow">Quiz terminé</p>
      <h1>{score}/5</h1>
      <h2>
        {score >= 4 ? "Tu as déjà de bons réflexes." : "Tu es en train de construire tes réflexes."}
      </h2>
      <p>
        Continue à les appliquer dans tes conversations quotidiennes. Chaque vérification compte.
      </p>
      <div className="score-bar">
        <i style={{ width: `${score * 20}%` }} />
      </div>
      <div className="finish-actions">
        <Button onClick={() => go("guide")} icon="download">
          Voir mes 6 réflexes
        </Button>
        <Button variant="secondary" onClick={onRetry}>
          Revoir les questions
        </Button>
        <Button variant="ghost" onClick={() => go("home")}>
          Retour à l’accueil
        </Button>
      </div>
    </section>
  );
}

const reflexes = [
  ["search", "Je vérifie les liens", "Je regarde l’adresse avant de cliquer."],
  ["lock", "Je garde mes codes secrets", "Un code SMS ne se partage jamais."],
  ["shield", "Je protège mes mots de passe", "Un mot de passe long et différent par compte."],
  ["eye", "Je respecte le consentement", "Privé veut dire privé, à chaque partage."],
  ["download", "Je conserve les preuves", "Sans transférer les contenus intimes."],
  ["help", "Je demande de l’aide", "Je n’ai pas à gérer une menace seule."],
] as [IconName, string, string][];

function Guide({
  saved,
  unlocked,
  onSave,
  onBack,
  go,
}: {
  saved: boolean;
  unlocked: number[];
  onSave: () => void;
  onBack: () => void;
  go: (s: Screen) => void;
}) {
  return (
    <section className="screen with-nav guide">
      <TopBar
        title="Mes réflexes"
        onBack={onBack}
        action={
          saved ? (
            <span className="saved">
              <Icon name="check" size={13} />
              Enregistrée
            </span>
          ) : undefined
        }
      />
      <div className="guide-sheet">
        <div className="guide-heading">
          <div className="welcome-mark small">
            <span />
            <span />
            <span />
          </div>
          <p className="eyebrow">Ayidote · à garder près de toi</p>
          <h1>Mes 6 réflexes pour naviguer plus sereinement</h1>
          <p className="guide-count">
            {unlocked.length === reflexes.length
              ? "Tu les as tous débloqués."
              : `${unlocked.length} sur 6 débloqués · les autres se gagnent dans les histoires.`}
          </p>
        </div>
        <div className="reflex-list">
          {reflexes.map((r, i) => {
            const open = unlocked.includes(i);
            return (
              <div
                key={r[1]}
                className={open ? "unlocked" : "to-find"}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="reflex-number">0{i + 1}</span>
                <span className="reflex-icon">
                  <Icon name={open ? r[0] : "lock"} />
                </span>
                <p>
                  <strong>{r[1]}</strong>
                  <small>{open ? r[2] : "À débloquer en jouant une histoire."}</small>
                </p>
              </div>
            );
          })}
        </div>
        <p className="guide-footer">
          <Icon name="offline" size={15} /> Cette fiche reste disponible hors ligne sur ce
          téléphone.
        </p>
      </div>
      <div className="page-content">
        <Button onClick={() => go("resources")} icon="arrow">
          Que faire si ça m’arrive ?
        </Button>
      </div>
      <BottomNav active="guide" go={go} />
    </section>
  );
}

// The rank follows the reflexes found so far, across all stories.
const ranks = [
  [0, "Éclaireuse", "Tu as ouvert l’œil. Chaque histoire t’en apprend un peu plus."],
  [2, "Vigilante", "Tu repères déjà ce qui mérite ton attention."],
  [4, "Gardienne", "Tes réflexes te protègent, toi et celles qui t’entourent."],
  [6, "Sentinelle", "Tu connais les six réflexes. Tu peux les transmettre."],
] as [number, string, string][];

/** A medallion whose six petals light up with the reflexes found. */
function RankArt({ lit }: { lit: number }) {
  return (
    <svg className="rank-art" viewBox="0 0 160 160" role="img" aria-label={`${lit} réflexes sur 6`}>
      <circle cx="80" cy="80" r="76" fill="var(--sand)" />
      <circle cx="80" cy="80" r="60" fill="none" stroke="var(--terra)" strokeWidth="1.5" strokeDasharray="3 6" />
      {reflexes.map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            key={i}
            className={i < lit ? "petal lit" : "petal"}
            style={{ animationDelay: `${300 + i * 120}ms` }}
            cx={80 + Math.cos(angle) * 60}
            cy={80 + Math.sin(angle) * 60}
            r="11"
          />
        );
      })}
      <path
        d="M80 42 108 53v24c0 19-11 33-28 41-17-8-28-22-28-41V53Z"
        fill="var(--plum)"
      />
      <path
        d="m67 80 9 9 18-19"
        fill="none"
        stroke="var(--cream)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Progress({
  title,
  unlocked,
  onOther,
  go,
  replay,
}: {
  title: string;
  unlocked: number[];
  onOther: () => void;
  go: (s: Screen) => void;
  replay: () => void;
}) {
  const share = () => {
    if (navigator.share)
      navigator
        .share({
          title: "Ayidote",
          text: "Découvre Ayidote, une expérience pour renforcer tes réflexes numériques.",
        })
        .catch(() => undefined);
    else
      navigator.clipboard?.writeText(
        "Découvre Ayidote, une expérience pour renforcer tes réflexes numériques.",
      );
  };
  const count = unlocked.length;
  const rank = [...ranks].reverse().find((r) => count >= r[0]) ?? ranks[0];
  return (
    <section className="screen progress-screen">
      <TopBar title="Ma progression" onBack={() => go("home")} />
      <div className="page-content">
        <div className="rank-hero">
          <RankArt lit={count} />
          <p className="eyebrow">« {title} » terminée · ton rang</p>
          <h1>{rank[1]}</h1>
          <p>{rank[2]}</p>
        </div>
        <h2>
          {count} réflexe{count > 1 ? "s" : ""} sur 6 débloqué{count > 1 ? "s" : ""}
        </h2>
        <p className="lead">
          {count === 6
            ? "Ta fiche est complète."
            : "Rejoue ou essaie une autre histoire pour trouver les autres."}
        </p>
        <div className="reflex-grid">
          {reflexes.map((_, i) => (
            <ReflexTile key={i} index={i} open={unlocked.includes(i)} />
          ))}
        </div>
        <Button variant="secondary" onClick={() => go("guide")} icon="download">
          Ouvrir ma fiche
        </Button>
        <div className="replay-card">
          <p className="eyebrow">Et maintenant ?</p>
          <h2>Et si tu essayais un autre chemin ?</h2>
          <p>Les réponses changent la conversation, jamais ta valeur.</p>
          <Button onClick={onOther} icon="arrow">
            Essayer une autre histoire
          </Button>
          <Button variant="secondary" onClick={replay}>
            Rejouer cette histoire
          </Button>
          <Button variant="ghost" onClick={() => go("resources")}>
            Découvrir les ressources
          </Button>
          <Button variant="ghost" onClick={share}>
            Faire découvrir à une amie
          </Button>
        </div>
      </div>
    </section>
  );
}

function Settings({
  listen,
  startListening,
  stopListening,
  lang,
  setLang,
  person,
  setPerson,
  audio,
  setAudio,
  timer,
  setTimer,
  go,
  erase,
  exitErase,
  setExitErase,
  notify,
}: {
  listen: boolean;
  startListening: () => void;
  stopListening: () => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  person: "afi" | "maya";
  setPerson: (p: "afi" | "maya") => void;
  audio: boolean;
  setAudio: (v: boolean) => void;
  timer: boolean;
  setTimer: (v: boolean) => void;
  go: (s: Screen) => void;
  erase: () => void;
  exitErase: boolean;
  setExitErase: (v: boolean) => void;
  notify: (s: string) => void;
}) {
  return (
    <section className="screen settings-page with-nav">
      <TopBar title="Paramètres" onBack={() => go("home")} />
      <div className="page-content">
        <button className="help-shortcut" onClick={() => go("help")}>
          <span>
            <Icon name="help" size={24} />
          </span>
          <div>
            <strong>Trouver de l’aide</strong>
            <small>Numéros utiles, structures, tes droits au Bénin</small>
          </div>
          <Icon name="chevron" />
        </button>
        <div className="settings-profile">
          <div className="welcome-mark small">
            <span />
            <span />
            <span />
          </div>
          <div>
            <strong>Ayidote</strong>
            <small>Mon espace discret</small>
          </div>
          <OfflinePill />
        </div>
        <h3>Langue</h3>
        <div className="segmented" role="radiogroup" aria-label="Langue">
          {(["fr", ...localLangs] as Lang[]).map((x) => {
            const available = x === "fr" || recordedLangs.includes(x);
            return (
              <button
                key={x}
                role="radio"
                aria-checked={lang === x}
                className={lang === x ? "on" : ""}
                disabled={!available}
                onClick={() => {
                  setLang(x);
                  notify(`${langNames[x]} choisi`);
                }}
              >
                {langNames[x]}
                {!available && <small>bientôt</small>}
              </button>
            );
          })}
        </div>
        {lang !== "fr" && (
          <p className="setting-note">
            Les histoires sont affichées et lues en {langNames[lang].toLowerCase()}, avec le
            français en petit. Traduction et voix automatiques, à l’essai : pas encore relues par
            une personne qui parle {langNames[lang].toLowerCase()}.
          </p>
        )}
        {canPlay && (
          <button
            className="setting-row"
            onClick={listen ? stopListening : startListening}
            aria-pressed={listen}
          >
            <span>
              <Icon name="play" />
            </span>
            <div>
              <strong>Mode écoute</strong>
              <small>
                {listen
                  ? "Activé · tout est lu, gros boutons numérotés"
                  : "Pour jouer sans lire : tout est dit à voix haute"}
              </small>
            </div>
            <span className={`toggle ${listen ? "on" : ""}`}>
              <i />
            </span>
          </button>
        )}
        <h3>Personnage</h3>
        <div className="segmented" role="radiogroup" aria-label="Personnage">
          {(["afi", "maya"] as const).map((p) => (
            <button
              key={p}
              role="radio"
              aria-checked={person === p}
              className={person === p ? "on" : ""}
              onClick={() => setPerson(p)}
            >
              <Portrait person={p} small />
              {p === "afi" ? "Afi" : "Maya"}
            </button>
          ))}
        </div>
        <h3>Préférences</h3>
        <button className="setting-row" onClick={() => setAudio(!audio)} disabled={!canListen}>
          <span>
            <Icon name="play" />
          </span>
          <div>
            <strong>Voix des messages</strong>
            <small>
              {!canListen ? "Non disponible sur ce téléphone" : audio ? "Activée" : "Désactivée"}
            </small>
          </div>
          <span className={`toggle ${audio ? "on" : ""}`}>
            <i />
          </span>
        </button>
        <button className="setting-row" onClick={() => setTimer(!timer)} aria-pressed={timer}>
          <span>
            <Icon name="spark" />
          </span>
          <div>
            <strong>Compte à rebours</strong>
            <small>
              {timer ? "Activé dans les jeux · sans pénalité" : "Désactivé · à notre rythme"}
            </small>
          </div>
          <span className={`toggle ${timer ? "on" : ""}`}>
            <i />
          </span>
        </button>
        <h3>Sécurité et confidentialité</h3>
        <button className="setting-row" onClick={() => go("install")}>
          <span>
            <Icon name="download" />
          </span>
          <div>
            <strong>Installer l’application</strong>
            <small>Le guide pas à pas</small>
          </div>
          <Icon name="chevron" />
        </button>
        <button className="setting-row" onClick={() => go("legal")}>
          <span>
            <Icon name="book" />
          </span>
          <div>
            <strong>Informations légales</strong>
            <small>Confidentialité, conditions, mentions, crédits</small>
          </div>
          <Icon name="chevron" />
        </button>
        <button className="setting-row" onClick={() => go("privacy")}>
          <span>
            <Icon name="shield" />
          </span>
          <div>
            <strong>Nos engagements</strong>
            <small>Safety by Design</small>
          </div>
          <Icon name="chevron" />
        </button>
        <button className="setting-row" onClick={() => go("alert")}>
          <span>
            <Icon name="warning" />
          </span>
          <div>
            <strong>Alerte discrète</strong>
            <small>Simulation · aucune alerte envoyée</small>
          </div>
          <Icon name="chevron" />
        </button>
        <button
          className="setting-row"
          aria-pressed={exitErase}
          onClick={() => {
            setExitErase(!exitErase);
            notify(exitErase ? "Quitter vite garde tes données" : "Quitter vite effacera tout");
          }}
        >
          <span>
            <Icon name="exit" />
          </span>
          <div>
            <strong>Effacer en quittant vite</strong>
            <small>
              {exitErase
                ? "Activé : le bouton « Quitter » efface aussi ta progression"
                : "Désactivé : le bouton « Quitter » garde ta progression"}
            </small>
          </div>
          <span className={`toggle ${exitErase ? "on" : ""}`}>
            <i />
          </span>
        </button>
        <button className="setting-row danger-link" onClick={erase}>
          <span>
            <Icon name="warning" />
          </span>
          <div>
            <strong>Tout effacer</strong>
            <small>Supprimer les données locales</small>
          </div>
          <Icon name="chevron" />
        </button>
        <div className="privacy-note">
          <Icon name="lock" />
          <p>
            <strong>Aucun compte. Aucune collecte.</strong>
            <br />
            Ta progression et tes préférences restent sur ce téléphone.
          </p>
        </div>
        <p className="version">Ayidote · Prototype 1.0</p>
      </div>
      <BottomNav active="settings" go={go} />
    </section>
  );
}

// Legal information. Plain language, written for a hackathon prototype: to
// review with a legal adviser before any real distribution.
const LEGAL_DATE = "13 novembre 2026";
const legalSections: { title: string; intro: string; body: (string | [string, string])[] }[] = [
  {
    title: "Politique de confidentialité",
    intro: "Ayidote ne collecte aucune donnée sur toi.",
    body: [
      ["Aucun compte, aucune collecte", "Tu n’as pas de compte à créer. Ayidote n’envoie à personne ce que tu fais dans l’application : ni tes réponses, ni tes choix, ni tes messages."],
      ["Ce qui reste sur ton téléphone", "Pour que tu retrouves ta progression, l’application garde sur ton téléphone (stockage local du navigateur) : ta langue, ton personnage, ta progression dans les histoires et le quiz, tes réflexes débloqués, le mot du jour, tes réglages (voix, compte à rebours) et les réglages fictifs de l’alerte. Ces informations ne quittent jamais ton téléphone."],
      ["Tout effacer", "Paramètres › Tout effacer supprime immédiatement toutes ces informations. Désinstaller l’application ou effacer les données du navigateur les supprime aussi."],
      ["Ce que voit l’hébergeur", "Pour télécharger l’application, ton téléphone se connecte au serveur qui l’héberge (GitHub Pages). Comme tout site web, ce serveur reçoit techniquement ton adresse IP et le type de navigateur : c’est la politique de confidentialité de GitHub qui s’applique. Ayidote n’utilise ni publicité, ni statistiques de visite, ni cookies, et la police de caractères est fournie avec l’application."],
      ["Liens et appels", "Quand tu touches un lien vers un site officiel ou un numéro d’aide, tu quittes Ayidote : le site ou l’opérateur concerné applique ses propres règles. Ces liens restent dans l’historique de ton navigateur et de tes appels."],
      ["Tes droits", "La protection des données personnelles est encadrée au Bénin par le Code du numérique (loi n° 2017-20). Si un service utilise tes données sans ton accord, tu peux saisir l’Autorité de Protection des Données à caractère Personnel (APDP)."],
    ],
  },
  {
    title: "Conditions d’utilisation",
    intro: "Ayidote est un prototype pédagogique, gratuit.",
    body: [
      ["À quoi sert Ayidote", "Ayidote aide à reconnaître les pièges numériques (chantage, arnaques, piratage de compte) par des histoires fictives, des jeux et des conseils. Les personnages, messages et situations sont inventés ; toute ressemblance est fortuite."],
      ["Ce qu’Ayidote ne fait pas", "Ayidote ne remplace ni les secours, ni la police, ni un accompagnement professionnel, juridique ou médical. Il ne détecte pas les dangers à ta place. En cas de danger immédiat, appelle le 117."],
      ["Alerte discrète", "L’alerte discrète est une simulation : elle ne prévient personne et n’envoie aucun message, appel ou position. Ne compte pas sur elle en cas de danger."],
      ["Langues locales", "Les textes et voix en fon et en yoruba sont traduits et générés automatiquement, sans relecture par une personne qui parle ces langues : ils peuvent contenir des erreurs. Le français fait foi."],
      ["Conseils", "Les conseils sont généraux. Les numéros et liens d’aide ont été vérifiés à la date indiquée, mais ils peuvent changer : vérifie-les auprès des sources officielles."],
      ["Usage", "Ayidote est mis à disposition gratuitement, pour un usage personnel et non commercial, sans garantie de disponibilité. Il convient aux personnes de tout âge ; les plus jeunes peuvent l’utiliser avec un adulte de confiance."],
    ],
  },
  {
    title: "Mentions légales",
    intro: "Qui publie Ayidote, et où il est hébergé.",
    body: [
      ["Éditeur", "Équipe Ayidote, prototype réalisé dans le cadre du hackathon HACK4HER 2026 « Tech for Her Safety » (Cotonou, 12 et 13 novembre 2026). Ayidote n’est pas un service officiel de l’État ni des organisateurs du hackathon."],
      ["Contact", "Par l’intermédiaire des organisateurs du hackathon HACK4HER 2026."],
      ["Hébergement", "GitHub Pages, service de GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis."],
      ["Statut", "Prototype en phase de test. Toute utilisation réelle nécessitera des vérifications techniques, juridiques et de sécurité, et l’accord des institutions compétentes."],
    ],
  },
  {
    title: "Crédits et licences",
    intro: "Les outils et contenus libres utilisés par Ayidote.",
    body: [
      ["Voix françaises", "Générées avec Piper. Voix « siwis » (jeu de données SIWIS, licence CC BY 4.0) et voix « tom » (jeu de données sous licence AGPL v3)."],
      ["Voix en fon et en yoruba", "Générées avec les modèles MMS de Meta (facebook/mms-tts-fon et facebook/mms-tts-yor), licence CC BY-NC 4.0 : usage non commercial uniquement."],
      ["Traductions", "Traductions automatiques produites avec Google Traduction, non relues."],
      ["Police de caractères", "Nunito, licence SIL Open Font License 1.1."],
      ["Logiciels", "React et Vite, licence MIT."],
      ["Histoires", "Rédigées par l’équipe, dont certaines avec l’aide d’une intelligence artificielle puis contrôlées."],
    ],
  },
];

function Legal({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="screen resources">
      <TopBar title="Informations légales" onBack={onBack} />
      <div className="page-content">
        <p className="help-intro">Version du {LEGAL_DATE}.</p>
        {legalSections.map((section, i) => (
          <article className={`resource-card ${open === i ? "open" : ""}`} key={section.title}>
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
              <span className="resource-icon">
                <Icon name={["lock", "check", "book", "spark"][i] as IconName} />
              </span>
              <span>
                <strong>{section.title}</strong>
                <small>{section.intro}</small>
              </span>
              <Icon name="chevron" />
            </button>
            {open === i && (
              <div className="legal-body">
                {section.body.map((item) =>
                  typeof item === "string" ? (
                    <p key={item}>{item}</p>
                  ) : (
                    <div key={item[0]}>
                      <strong>{item[0]}</strong>
                      <p>{item[1]}</p>
                    </div>
                  ),
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

const installSteps: Record<"android" | "ios" | "other", { name: string; steps: [string, string][] }> = {
  android: {
    name: "Android (Chrome)",
    steps: [
      ["Ouvre le lien dans Chrome", "Le lien d’Ayidote, partagé par l’animatrice ou une amie."],
      ["Touche les trois points ⋮", "En haut à droite de l’écran."],
      ["Choisis « Installer l’application »", "Ou « Ajouter à l’écran d’accueil », selon ton téléphone."],
      ["Confirme avec « Installer »", "L’icône Ayidote apparaît avec tes autres applications."],
    ],
  },
  ios: {
    name: "iPhone (Safari)",
    steps: [
      ["Ouvre le lien dans Safari", "L’installation ne marche qu’avec Safari sur iPhone."],
      ["Touche le bouton Partager", "Le carré avec une flèche vers le haut, en bas de l’écran."],
      ["Choisis « Sur l’écran d’accueil »", "Fais défiler la liste si tu ne le vois pas."],
      ["Touche « Ajouter »", "L’icône Ayidote apparaît sur ton écran d’accueil."],
    ],
  },
  other: {
    name: "Autre navigateur",
    steps: [
      ["Samsung Internet", "Menu ≡ › « Ajouter la page à » › « Écran d’accueil »."],
      ["Ordinateur (Chrome ou Edge)", "L’icône d’installation apparaît à droite de la barre d’adresse."],
      ["Sinon", "Ouvre le lien dans Chrome sur Android ou dans Safari sur iPhone."],
    ],
  },
};

function Install({
  installed,
  canPrompt,
  install,
  onBack,
}: {
  installed: boolean;
  canPrompt: boolean;
  install: () => void;
  onBack: () => void;
}) {
  const platform = devicePlatform();
  const inApp = inAppBrowser();
  const [copied, setCopied] = useState(false);
  const copyLink = () => {
    navigator.clipboard
      ?.writeText(window.location.origin + window.location.pathname)
      .then(() => setCopied(true))
      .catch(() => undefined);
  };
  const order = [platform, ...(["android", "ios", "other"] as const).filter((p) => p !== platform)];
  return (
    <section className="screen resources">
      <TopBar title="Installer Ayidote" onBack={onBack} />
      <div className="page-content">
        <div className="resource-title">
          <span>
            <Icon name="download" size={30} />
          </span>
          <h1>{installed ? "Ayidote est installée." : "Garde Ayidote sur ton téléphone."}</h1>
          <p>
            {installed
              ? "Tu peux l’ouvrir depuis son icône, même sans réseau."
              : "Une icône comme une application, sans passer par un magasin d’applications, et qui marche sans réseau."}
          </p>
        </div>
        {!installed && inApp && (
          <div className="tip install-warning">
            <Icon name="warning" />
            <p>
              <strong>Tu es dans le navigateur de {inApp}.</strong>
              <br />
              Il ne peut pas installer d’application. Touche ⋮ ou ··· puis « Ouvrir dans
              {platform === "ios" ? " Safari" : " Chrome"} », ou copie le lien et colle-le dans
              {platform === "ios" ? " Safari" : " Chrome"}.
            </p>
            <Button variant="secondary" onClick={copyLink}>
              {copied ? "Lien copié ✓" : "Copier le lien"}
            </Button>
          </div>
        )}
        {!installed && canPrompt && (
          <Button onClick={install} icon="download">
            Installer maintenant
          </Button>
        )}
        {!installed && !canPrompt && !inApp && platform === "android" && (
          <p className="help-intro">
            Le bouton d’installation direct n’est pas proposé par ce navigateur : suis les étapes
            ci-dessous, ça prend dix secondes.
          </p>
        )}
        {!installed &&
          order.map((p, n) => (
            <article className="install-guide" key={p}>
              <h2>
                {n === 0 && p !== "other" ? "Sur ton téléphone · " : ""}
                {installSteps[p].name}
              </h2>
              <ol>
                {installSteps[p].steps.map(([title, text], i) => (
                  <li key={title}>
                    <span>{i + 1}</span>
                    <p>
                      <strong>{title}</strong>
                      <br />
                      {text}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        <h2>Bon à savoir</h2>
        <ol className="demo-steps">
          <li>
            <span>
              <Icon name="offline" size={15} />
            </span>
            <p>
              <strong>Ouvre-la une fois avec Internet</strong>
              <br />
              Ensuite, elle fonctionne sans réseau. La voix en fon ou en yoruba se télécharge quand
              tu choisis la langue.
            </p>
          </li>
          <li>
            <span>
              <Icon name="book" size={15} />
            </span>
            <p>
              <strong>Le raccourci « Mon carnet »</strong>
              <br />
              Sur Android, garde le doigt sur l’icône d’Ayidote : « Mon carnet » apparaît. Tu peux le
              glisser sur ton écran.
            </p>
          </li>
          <li>
            <span>
              <Icon name="eye" size={15} />
            </span>
            <p>
              <strong>Reste discrète</strong>
              <br />
              Tu peux ranger l’icône dans un dossier. Pour tout supprimer : Paramètres › Tout
              effacer, puis désinstalle l’application.
            </p>
          </li>
        </ol>
      </div>
    </section>
  );
}

function Privacy({ onBack }: { onBack: () => void }) {
  const commitments = [
    ["user", "Confidentialité", "Aucun compte obligatoire."],
    ["offline", "Minimisation", "Aucune collecte de messages personnels."],
    ["download", "Stockage local", "La progression reste sur le téléphone."],
    ["warning", "Contrôle utilisatrice", "“Tout effacer” reste accessible."],
    ["check", "Consentement", "Rien n’est envoyé en ligne sans ton accord."],
    ["eye", "Transparence", "Aucune détection parfaite n’est promise."],
    ["shield", "Protection des mineures", "Aucune nudité ni collecte d’images intimes."],
  ] as [IconName, string, string][];
  return (
    <section className="screen privacy">
      <TopBar title="Sécurité par conception" onBack={onBack} />
      <div className="page-content">
        <div className="privacy-hero">
          <Icon name="shield" size={38} />
          <h1>Ta sécurité n’est pas une option.</h1>
          <p>Nos choix de conception réduisent la collecte et te laissent le contrôle.</p>
        </div>
        <div className="commitments">
          {commitments.map((c) => (
            <div key={c[1]}>
              <span>
                <Icon name={c[0]} />
              </span>
              <p>
                <strong>{c[1]}</strong>
                <small>{c[2]}</small>
              </p>
            </div>
          ))}
        </div>
        <h2>Grille Safety by Design</h2>
        <div className="risk-table">
          <div>
            <strong>Risque</strong>
            <strong>Prévention</strong>
            <strong>Limite</strong>
          </div>
          <div>
            <span>Regard indiscret</span>
            <span>Nom et entrée neutres</span>
            <span>Ne masque pas l’écran système</span>
          </div>
          <div>
            <span>Fuite de message</span>
            <span>Aucun message personnel n’est demandé</span>
            <span>Les histoires restent fictives</span>
          </div>
          <div>
            <span>Mauvais conseil</span>
            <span>Langage prudent</span>
            <span>Ne remplace pas une aide experte</span>
          </div>
          <div>
            <span>Perte du téléphone</span>
            <span>Effacement facile</span>
            <span>Pas de verrouillage matériel</span>
          </div>
        </div>
        <p className="disclaimer">
          Ce prototype est pédagogique. Il ne contacte pas les secours, ne remplace pas un
          accompagnement professionnel et ne garantit jamais l’identification d’un danger.
        </p>
      </div>
    </section>
  );
}

const ALERT_DELAY_S = 3;

function AlertSetup({
  config,
  setConfig,
  onTry,
  onBack,
}: {
  config: AlertConfig;
  setConfig: (c: AlertConfig) => void;
  onTry: () => void;
  onBack: () => void;
}) {
  const ready = config.contacts.length > 0;
  const toggle = (id: string) =>
    setConfig({
      ...config,
      contacts: config.contacts.includes(id)
        ? config.contacts.filter((c) => c !== id)
        : [...config.contacts, id],
    });
  return (
    <section className="screen alert-demo">
      <TopBar title="Alerte discrète" onBack={onBack} />
      <div className="page-content">
        <div className="demo-banner">
          <Icon name="warning" />
          <p>
            <strong>Simulation, aucune alerte envoyée</strong>
            <br />
            Les proches, le message et la position sont fictifs. Rien ne quitte ce téléphone.
          </p>
        </div>

        <h2 className="alert-step">
          <span>1</span>Qui prévenir ?
        </h2>
        <p className="alert-help">Choisis une ou plusieurs personnes de confiance (fictives).</p>
        <div className="option-list">
          {alertContacts.map((c) => {
            const on = config.contacts.includes(c.id);
            return (
              <button
                key={c.id}
                className={`select-row contact-row ${on ? "selected" : ""}`}
                onClick={() => toggle(c.id)}
                aria-pressed={on}
              >
                <Portrait person={c.portrait} small />
                <span>
                  <strong>{c.name}</strong>
                  <small>{c.role}</small>
                </span>
                {on && (
                  <span className="radio">
                    <Icon name="check" size={14} />
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <h2 className="alert-step">
          <span>2</span>Quel message ?
        </h2>
        <div className="option-list">
          {alertMessages.map((m, i) => (
            <button
              key={m}
              className={`select-row ${config.message === i ? "selected" : ""}`}
              onClick={() => setConfig({ ...config, message: i })}
              aria-pressed={config.message === i}
            >
              <span>
                <strong>{m}</strong>
              </span>
              {config.message === i && (
                <span className="radio">
                  <Icon name="check" size={14} />
                </span>
              )}
            </button>
          ))}
        </div>

        <h2 className="alert-step">
          <span>3</span>Un seul geste
        </h2>
        <ol className="demo-steps">
          <li>
            <span>
              <Icon name="book" size={15} />
            </span>
            <p>
              <strong>Touche « Mon carnet »</strong>
              <br />
              L’icône du carnet en haut de l’accueil, ou le raccourci « Mon carnet » (appui long sur
              l’icône d’Ayidote, à glisser sur l’écran du téléphone).
            </p>
          </li>
          <li>
            <span>
              <Icon name="eye" size={15} />
            </span>
            <p>
              <strong>Une simple page de notes s’ouvre</strong>
              <br />
              Le téléphone vibre. Tu as {ALERT_DELAY_S} secondes pour toucher « Fermer » si c’est une
              erreur.
            </p>
          </li>
          <li>
            <span>
              <Icon name="message" size={15} />
            </span>
            <p>
              <strong>Tes proches sont prévenus</strong>
              <br />
              Ici, c’est simulé : tu verras ce qu’ils auraient reçu.
            </p>
          </li>
        </ol>

        <Button onClick={onTry} disabled={!ready} icon="play">
          {ready ? "Essayer l’alerte" : "Choisis d’abord une personne"}
        </Button>
        <p className="disclaimer">
          Dans une vraie version, l’alerte préviendrait tes proches, pas les secours, et aurait
          besoin de réseau. Ce prototype ne déclenche aucun message, appel ou partage de position.
        </p>
      </div>
    </section>
  );
}

/**
 * What an onlooker sees: an ordinary notes page. Opening it starts a silent
 * countdown; "Fermer" cancels it. Nothing on screen mentions an alert.
 */
function Carnet({
  contact,
  onCancel,
  onClose,
  onReveal,
}: {
  contact: { name: string };
  onCancel: () => void;
  onClose: () => void;
  onReveal: () => void;
}) {
  const [sent, setSent] = useState(false);
  useEffect(() => {
    navigator.vibrate?.(150);
    const timer = window.setTimeout(() => {
      navigator.vibrate?.([80, 80, 80]);
      setSent(true);
    }, ALERT_DELAY_S * 1000);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <section className="screen carnet">
      <header className="carnet-bar">
        <strong>Mon carnet</strong>
        <button onClick={sent ? onClose : onCancel}>Fermer</button>
      </header>
      <div className="carnet-page">
        <h1>
          Courses de la semaine
          {sent && <i className="carnet-dot" aria-label="Enregistré" />}
        </h1>
        <ul>
          <li>Riz, 2 kg</li>
          <li>Tomates et oignons</li>
          <li>Savon</li>
          <li>Huile</li>
          <li>Crédit téléphone</li>
          <li>Passer chez la couturière samedi</li>
        </ul>
      </div>
      {!sent && <div className="carnet-timer" style={{ animationDuration: `${ALERT_DELAY_S}s` }} />}
      {sent && (
        <button className="carnet-reveal" onClick={onReveal}>
          Démo · voir ce que reçoit {contact.name}
        </button>
      )}
    </section>
  );
}

function AlertResult({
  config,
  sender,
  onRetry,
  onSetup,
  onHome,
}: {
  config: AlertConfig;
  sender: string;
  onRetry: () => void;
  onSetup: () => void;
  onHome: () => void;
}) {
  const contacts = alertContacts.filter((c) => config.contacts.includes(c.id));
  const first = contacts[0] ?? alertContacts[0];
  return (
    <section className="screen alert-demo">
      <TopBar title="Ce qui se serait passé" onBack={onHome} />
      <div className="page-content">
        <div className="demo-banner">
          <Icon name="warning" />
          <p>
            <strong>Simulation, aucune alerte envoyée</strong>
            <br />
            Aucun message n’est parti et aucun contact n’a été prévenu.
          </p>
        </div>
        <p className="alert-help">
          Sur le téléphone de {contacts.map((c) => c.name).join(" et ") || first.name}, quelques
          secondes après ton geste :
        </p>
        <div className="contact-phone">
          <div className="contact-phone-head">
            <Portrait person={sender === "Maya" ? "maya" : "afi"} small />
            <span>
              <strong>{sender}</strong>
              <small>à l’instant</small>
            </span>
          </div>
          <div className="bubble">
            <p>{alertMessages[config.message]}</p>
          </div>
          <div className="fake-map">
            <i />
            <span>Position fictive · quartier Exemple</span>
          </div>
        </div>
        <h2 className="alert-step">Dans la vraie vie</h2>
        <ol className="demo-steps">
          <li>
            <span>1</span>
            <p>
              <strong>{first.name} t’appelle ou vient te chercher</strong>
              <br />
              L’alerte fait venir un proche. Elle ne contacte pas les secours.
            </p>
          </li>
          <li>
            <span>2</span>
            <p>
              <strong>Il faut du réseau</strong>
              <br />
              Sans connexion ni crédit, le message ne partirait pas.
            </p>
          </li>
          <li>
            <span>3</span>
            <p>
              <strong>Préviens tes proches à l’avance</strong>
              <br />
              Ils doivent savoir quoi faire s’ils reçoivent ce message.
            </p>
          </li>
        </ol>
        <Button onClick={onRetry} icon="play">
          Recommencer
        </Button>
        <Button variant="secondary" onClick={onSetup}>
          Modifier mes réglages
        </Button>
        <Button variant="ghost" onClick={onHome}>
          Retour à l’accueil
        </Button>
      </div>
    </section>
  );
}

export default App;
