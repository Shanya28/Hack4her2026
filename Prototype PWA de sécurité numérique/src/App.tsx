import { useEffect, useMemo, useRef, useState } from "react";
import storyContent from "./content/story.json";
import quizContent from "./content/quiz.json";

type Screen =
  | "welcome"
  | "language"
  | "intro"
  | "character"
  | "home"
  | "story"
  | "fake-login"
  | "phishing"
  | "checker"
  | "result"
  | "resources"
  | "help"
  | "quiz"
  | "quiz-result"
  | "guide"
  | "progress"
  | "privacy"
  | "settings"
  | "alert";

type IconName =
  | "arrow"
  | "back"
  | "book"
  | "check"
  | "chevron"
  | "download"
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
};

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

function Portrait({
  person = "afi",
  small = false,
}: {
  person?: "afi" | "maya" | "kevin";
  small?: boolean;
}) {
  const colors =
    person === "maya"
      ? ["#D58C72", "#49213D", "#E8B55A"]
      : person === "kevin"
        ? ["#8FA58E", "#352331", "#C98167"]
        : ["#B96E56", "#49213D", "#799375"];
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
        <circle cx="50" cy="51" r="2" fill="#352331" />
        <circle cx="70" cy="51" r="2" fill="#352331" />
        <path
          d="M54 63c4 3 8 3 12 0"
          fill="none"
          stroke="#733F38"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path d="M18 120c2-30 18-44 42-44s40 14 42 44" fill={colors[1]} />
        <path d="M51 76 60 91l9-15" fill="#F7F0E5" />
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
      <div className="top-action">{action}</div>
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

type StoryChoice = { label: string; protective: boolean; outcome: string; advice: string };
type StoryStep = {
  chapter: string;
  messages: string[][];
  attachment?: boolean;
  choices: StoryChoice[];
  feedback: string;
};

// Story and quiz texts live in src/content/*.json so they can be edited
// without touching the code.
const storySteps = storyContent as StoryStep[];
const quiz = quizContent as { q: string; a: string[]; correct: number; why: string }[];

const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;

function speak(text: string) {
  if (!canSpeak || !text) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("fr"));
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
}

function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel();
}

/** Reads `text` aloud whenever it changes, while audio is enabled. */
function useNarration(enabled: boolean, text: string) {
  useEffect(() => {
    if (!enabled || !text) return;
    speak(text);
    return stopSpeaking;
  }, [enabled, text]);
}

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    // Opened from the home-screen shortcut (long press on the app icon).
    if (new URLSearchParams(window.location.search).has("carnet")) return "alert";
    return localStorage.getItem("naya-started") ? "home" : "welcome";
  });
  const [audio, setAudioState] = useState(
    () => canSpeak && localStorage.getItem("naya-audio") === "yes",
  );
  const setAudio = (on: boolean) => {
    const next = on && canSpeak;
    setAudioState(next);
    localStorage.setItem("naya-audio", next ? "yes" : "no");
    if (next) speak("Lecture audio activée.");
    else stopSpeaking();
  };
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
  const [story, setStory] = useState(Number(localStorage.getItem("naya-story") || 0));
  const [storyChoice, setStoryChoice] = useState<number | null>(null);
  const [message, setMessage] = useState(
    "Si tu ne m'envoies pas l'argent avant ce soir, je publie tes photos.",
  );
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizChoice, setQuizChoice] = useState<number | null>(null);
  const [saved, setSaved] = useState(localStorage.getItem("naya-guide") === "yes");
  const [toast, setToast] = useState("");
  const [eraseOpen, setEraseOpen] = useState(false);
  const [aiConsent, setAiConsent] = useState(false);

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
  const chooseStory = (choice: number) => setStoryChoice(choice);
  const nextStory = () => {
    if (story >= 4) {
      localStorage.setItem("naya-story", "5");
      setStory(5);
      setStoryChoice(null);
      go("progress");
    } else {
      const n = story + 1;
      setStory(n);
      localStorage.setItem("naya-story", String(n));
      setStoryChoice(null);
    }
  };
  const resetAll = () => {
    localStorage.clear();
    stopSpeaking();
    setAudioState(false);
    setPersonState("afi");
    setStory(0);
    setStoryChoice(null);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizChoice(null);
    setSaved(false);
    setEraseOpen(false);
    go("welcome");
    notify("Données locales effacées");
  };
  const result = useMemo(() => analyzeMessage(message), [message]);

  let content: React.ReactNode;
  if (screen === "welcome") content = <Welcome onNext={() => go("language")} />;
  else if (screen === "language")
    content = (
      <Language
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
  else if (screen === "home") content = <Home person={person} story={story} go={go} />;
  else if (screen === "story")
    content = (
      <Story
        step={Math.min(story, 4)}
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
    content = <FakeLogin onInterrupt={() => go("phishing")} onBack={() => go("story")} />;
  else if (screen === "phishing")
    content = (
      <Phishing
        audio={audio}
        onNext={() => {
          setStory(2);
          localStorage.setItem("naya-story", "2");
          go("story");
        }}
        onChecker={() => go("checker")}
      />
    );
  else if (screen === "checker")
    content = (
      <Checker
        message={message}
        setMessage={setMessage}
        onAnalyze={() => go("result")}
        onBack={() => go("home")}
        aiConsent={aiConsent}
        setAiConsent={setAiConsent}
      />
    );
  else if (screen === "result") content = <Result result={result} message={message} go={go} audio={audio} />;
  else if (screen === "resources")
    content = <Resources key="resources" go={go} initial={0} active="resources" />;
  else if (screen === "help")
    content = <Resources key="help" go={go} initial={2} active="help" />;
  else if (screen === "quiz")
    content = (
      <Quiz
        audio={audio}
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
        audio={audio}
        saved={saved}
        onSave={() => {
          setSaved(true);
          localStorage.setItem("naya-guide", "yes");
          notify("Fiche enregistrée sur ce téléphone");
        }}
        onBack={() => go("home")}
      />
    );
  else if (screen === "progress")
    content = (
      <Progress
        story={story}
        saved={saved}
        go={go}
        replay={() => {
          setStory(0);
          setStoryChoice(null);
          go("story");
        }}
      />
    );
  else if (screen === "privacy") content = <Privacy onBack={() => go("settings")} />;
  else if (screen === "alert")
    content = <AlertDemo onBack={() => go("settings")} notify={notify} />;
  else
    content = (
      <Settings
        audio={audio}
        setAudio={setAudio}
        go={go}
        erase={() => setEraseOpen(true)}
        notify={notify}
      />
    );

  return (
    <div className="app-bg">
      <main className="phone-shell">
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
                Ta progression, tes préférences et ta fiche enregistrée seront supprimées de ce
                téléphone. Cette action est définitive.
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

function Welcome({ onNext }: { onNext: () => void }) {
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
        <p className="microcopy">Aucun compte · Rien à partager</p>
      </div>
    </section>
  );
}

function Language({
  audio,
  setAudio,
  onNext,
  onBack,
}: {
  audio: boolean;
  setAudio: (v: boolean) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [lang, setLang] = useState("Français");
  return (
    <section className="screen">
      <TopBar title="Tes préférences" onBack={onBack} />
      <div className="page-content">
        <p className="step">1 sur 3</p>
        <h1>Comment veux-tu explorer ?</h1>
        <p className="lead">Tu pourras changer ces choix plus tard.</p>
        <h3>Langue</h3>
        <div className="option-list">
          {["Français", "Fon · bientôt", "Mina · bientôt"].map((x, i) => (
            <button
              key={x}
              disabled={i > 0}
              onClick={() => setLang(x)}
              className={`select-row ${lang === x ? "selected" : ""}`}
            >
              <span>
                <strong>{x.split(" · ")[0]}</strong>
                {i > 0 && <small>En préparation</small>}
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
        <button className="toggle-row" onClick={() => setAudio(!audio)} disabled={!canSpeak}>
          <span>
            <strong>Lecture audio</strong>
            <small>
              {!canSpeak
                ? "Non disponible sur ce téléphone"
                : audio
                  ? "Activée · les textes sont lus à voix haute"
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
          Continuer en français
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
  go,
}: {
  person: "afi" | "maya";
  story: number;
  go: (s: Screen) => void;
}) {
  return (
    <section className="screen with-nav">
      <div className="home-header">
        <div>
          <p>Bonjour, {person === "afi" ? "Afi" : "Maya"}</p>
          <h1>Avance à ton rythme.</h1>
        </div>
        <button onClick={() => go("settings")} aria-label="Paramètres">
          <Portrait person={person} small />
        </button>
      </div>
      <div className="page-content home-content">
        <div className="progress-line">
          <span>Ton parcours</span>
          <strong>{Math.min(story, 5)}/5 situations</strong>
          <div>
            <i style={{ width: `${Math.max(8, story * 20)}%` }} />
          </div>
        </div>
        <article className="hero-card">
          <div className="hero-pattern" />
          <span className="hero-icon">
            <Icon name="spark" />
          </span>
          <p className="eyebrow">Histoire interactive</p>
          <h2>{story ? "Prête à continuer ?" : "Prête à découvrir quelque chose ?"}</h2>
          <p>Entre dans une conversation réaliste et choisis comment réagir.</p>
          <Button onClick={() => go("story")} variant="secondary" icon="arrow">
            {story ? "Reprendre mon histoire" : "Commencer l’histoire"}
          </Button>
        </article>
        <h2 className="section-title">Que veux-tu faire ?</h2>
        <div className="action-cards">
          <ActionCard
            icon="book"
            tone="terracotta"
            title="Vivre une histoire"
            text="Apprendre en faisant des choix."
            onClick={() => go("story")}
          />
          <ActionCard
            icon="search"
            tone="sage"
            title="Vérifier un message"
            text="Repérer des signes suspects, localement."
            onClick={() => go("checker")}
          />
          <ActionCard
            icon="shield"
            tone="sand"
            title="Mes réflexes"
            text="Des gestes simples pour te protéger."
            onClick={() => go("resources")}
          />
        </div>
        <h2 className="section-title">À garder près de toi</h2>
        <button className="wide-link" onClick={() => go("guide")}>
          <span className="link-icon">
            <Icon name="download" />
          </span>
          <span>
            <strong>Mes 6 réflexes</strong>
            <small>Une fiche disponible hors ligne</small>
          </span>
          <Icon name="chevron" />
        </button>
        <button className="wide-link" onClick={() => go("quiz")}>
          <span className="link-icon orange">
            <Icon name="spark" />
          </span>
          <span>
            <strong>Tester mes réflexes</strong>
            <small>5 questions, sans jugement</small>
          </span>
          <Icon name="chevron" />
        </button>
      </div>
      <BottomNav active="home" go={go} />
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
      <button className={active === "story" ? "active" : ""} onClick={() => go("story")}>
        <Icon name="message" />
        <span>Histoire</span>
      </button>
      <button className={active === "resources" ? "active" : ""} onClick={() => go("resources")}>
        <Icon name="shield" />
        <span>Réflexes</span>
      </button>
      <button className={active === "help" ? "active" : ""} onClick={() => go("help")}>
        <Icon name="help" />
        <span>Aide</span>
      </button>
    </nav>
  );
}

function Story({
  step,
  choice,
  choose,
  next,
  go,
  person,
  audio,
  setAudio,
}: {
  step: number;
  choice: number | null;
  choose: (c: number) => void;
  next: () => void;
  go: (s: Screen) => void;
  person: "afi" | "maya";
  audio: boolean;
  setAudio: (v: boolean) => void;
}) {
  const data = storySteps[step];
  const me = person === "afi" ? "Afi" : "Maya";
  const picked = choice !== null ? data.choices[choice] : null;
  const narration = picked
    ? `${picked.outcome} ${picked.advice} À retenir. ${data.feedback}`
    : [
        data.chapter.replace(/^\d+ · /, ""),
        ...data.messages.map(([who, text]) => `${who === "moi" ? me : who} : ${text}`),
        data.attachment
          ? "Ce lien vient d’arriver. Que veux-tu faire ?"
          : `Que réponds-tu ? ${data.choices.map((c) => c.label).join(". ")}.`,
      ].join(". ");
  useNarration(audio, narration);
  return (
    <section className={`screen story-screen ${step === 4 ? "danger-mode" : ""}`}>
      <header className="chat-header">
        <button className="icon-button" onClick={() => go("home")} aria-label="Retour à l’accueil">
          <Icon name="back" />
        </button>
        <Portrait person={step === 3 ? "maya" : "kevin"} small />
        <div>
          <strong>{step === 3 ? "Groupe des amies" : "Kevin"}</strong>
          <small>{step === 4 ? "Messages à conserver" : "en ligne récemment"}</small>
        </div>
        {canSpeak && (
          <button
            className={`icon-button ${audio ? "audio-on" : ""}`}
            onClick={() => setAudio(!audio)}
            aria-label={audio ? "Arrêter la lecture audio" : "Écouter l’histoire"}
            aria-pressed={audio}
          >
            <Icon name="play" />
          </button>
        )}
      </header>
      <div className="chapter-strip">
        <span>{data.chapter}</span>
        <div>
          {storySteps.map((_, i) => (
            <i key={i} className={i <= step ? "done" : ""} />
          ))}
        </div>
      </div>
      <div className="messages">
        {data.messages.map(([who, text], i) => {
          const mine = who === "moi";
          return (
            <div
              key={i}
              className={`message-row ${mine ? "mine" : ""}`}
              aria-label={`Message de ${mine ? me : who}`}
            >
              <div className={`bubble ${text.startsWith("Image masquée") ? "masked" : ""}`}>
                {text.startsWith("Image masquée") && (
                  <span className="masked-icon">
                    <Icon name="eye" />
                  </span>
                )}
                <p>{text}</p>
                <small>
                  10:{24 + i * 2}
                  {mine && " · Lu"}
                </small>
              </div>
            </div>
          );
        })}
        {data.attachment && (
          <button className="album-card" onClick={() => go("fake-login")}>
            <span className="album-visual">
              <Icon name="eye" size={28} />
            </span>
            <span>
              <strong>Album partagé</strong>
              <small>photos-album.example-view.com</small>
            </span>
            <Icon name="chevron" />
          </button>
        )}
      </div>
      {data.attachment ? (
        <div className="choice-panel">
          <p>Ce lien vient d’arriver. Que veux-tu faire ?</p>
          <Button onClick={() => go("fake-login")} icon="arrow">
            Voir l’album
          </Button>
          <Button variant="ghost" onClick={() => go("checker")}>
            Vérifier le message
          </Button>
        </div>
      ) : (
        <div className="choice-panel">
          {!picked ? (
            <>
              <p>Que réponds-tu ?</p>
              {data.choices.map((c, i) => (
                <button key={c.label} className="story-choice" onClick={() => choose(i)}>
                  {c.label}
                  <Icon name="arrow" size={17} />
                </button>
              ))}
            </>
          ) : (
            <div className={`learning-card ${picked.protective ? "protective" : ""}`}>
              <span>
                <Icon name={picked.protective ? "shield" : "spark"} />
              </span>
              <p>
                <strong>{picked.label}</strong>
              </p>
              <p className="outcome">{picked.outcome}</p>
              <p>{picked.advice}</p>
              <p className="lesson">
                <strong>À retenir.</strong> {data.feedback}
              </p>
              <div className="learning-actions">
                <Button onClick={next} icon="arrow">
                  {step === 4 ? "Terminer l’histoire" : "Continuer"}
                </Button>
                {step === 4 && (
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

function FakeLogin({ onInterrupt, onBack }: { onInterrupt: () => void; onBack: () => void }) {
  return (
    <section className="screen fake-page">
      <div className="browser-bar">
        <button onClick={onBack}>
          <Icon name="back" />
        </button>
        <span>
          <Icon name="lock" size={13} /> photos-album-login.net
        </span>
        <Icon name="more" />
      </div>
      <div className="fake-content">
        <div className="generic-logo">
          <span />
          <span />
        </div>
        <h1>Retrouve tes photos</h1>
        <p>Connecte-toi pour voir l’album partagé avec toi.</p>
        <label>
          Adresse e-mail
          <input onFocus={onInterrupt} onClick={onInterrupt} placeholder="tonadresse@email.com" />
        </label>
        <label>
          Mot de passe
          <input
            onFocus={onInterrupt}
            onClick={onInterrupt}
            type="password"
            placeholder="••••••••"
          />
        </label>
        <Button onClick={onInterrupt}>Se connecter</Button>
        <small>Page fictive créée pour cet exercice. Ne saisis aucune information.</small>
      </div>
    </section>
  );
}

function Phishing({
  onNext,
  onChecker,
  audio,
}: {
  onNext: () => void;
  onChecker: () => void;
  audio: boolean;
}) {
  useNarration(
    audio,
    "Simulation interrompue. Cette page cherchait tes identifiants. Tu n’as rien envoyé. " +
      "Trois indices à repérer. Un : un lien inattendu. Deux : une demande de connexion. " +
      "Trois : une adresse étrange. Bon réflexe : ferme la page, puis ouvre toi-même le service officiel.",
  );
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
        <h2>Les 3 indices à repérer</h2>
        {[
          ["link", "Un lien inattendu", "Tu ne demandais pas à recevoir cet album."],
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
        <div className="tip">
          <Icon name="shield" />
          <p>
            <strong>Bon réflexe</strong>
            <br />
            Ferme la page, puis ouvre toi-même le service officiel si tu dois vérifier quelque
            chose.
          </p>
        </div>
      </div>
      <div className="sticky-action">
        <Button onClick={onNext} icon="arrow">
          Comprendre et continuer
        </Button>
        <Button variant="ghost" onClick={onChecker}>
          Analyser ce message
        </Button>
      </div>
    </section>
  );
}

function Checker({
  message,
  setMessage,
  onAnalyze,
  onBack,
  aiConsent,
  setAiConsent,
}: {
  message: string;
  setMessage: (s: string) => void;
  onAnalyze: () => void;
  onBack: () => void;
  aiConsent: boolean;
  setAiConsent: (v: boolean) => void;
}) {
  const examples = [
    "Votre candidature est retenue. Payez 15 000 F pour confirmer l'entretien.",
    "Envoie-moi le code à 6 chiffres que tu viens de recevoir.",
    "Salut Afi, on se retrouve devant la bibliothèque à 16 h ?",
  ];
  return (
    <section className="screen checker">
      <TopBar
        title="Est-ce un piège ?"
        onBack={onBack}
        action={
          <span className="local-badge">
            <Icon name="lock" size={13} />
            Local
          </span>
        }
      />
      <div className="page-content">
        <span className="checker-icon">
          <Icon name="search" size={32} />
        </span>
        <h1>Un message te semble bizarre ?</h1>
        <p className="lead">
          Copie son contenu ici. Nous t’aiderons à repérer les signes qui méritent ton attention.
        </p>
        <label className="textarea-label">
          Message à analyser
          <textarea
            maxLength={600}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Colle le message ici…"
          />
          <span>{message.length}/600</span>
        </label>
        <p className="support-note">
          <Icon name="warning" size={15} /> Les images ne sont pas prises en charge.
        </p>
        <Button onClick={onAnalyze} disabled={!message.trim()} icon="search">
          Analyser sur ce téléphone
        </Button>
        <div className="privacy-note">
          <Icon name="lock" />
          <p>
            <strong>Ton message reste ici.</strong>
            <br />
            Cette simulation analyse des mots et expressions connus, sans connexion à un serveur.
          </p>
        </div>
        <h3>Essayer un exemple</h3>
        <div className="example-chips">
          {examples.map((e, i) => (
            <button key={e} onClick={() => setMessage(e)}>
              {["Faux recrutement", "Code de vérification", "Message ordinaire"][i]}
            </button>
          ))}
        </div>
        <details className="ai-option">
          <summary>Analyse en ligne par IA · facultative</summary>
          <p>
            Fonction de démonstration uniquement. Elle nécessiterait d’envoyer le texte à un service
            externe et pourrait se tromper.
          </p>
          <label>
            <input
              type="checkbox"
              checked={aiConsent}
              onChange={(e) => setAiConsent(e.target.checked)}
            />{" "}
            Je comprends et je donnerais mon accord avant tout envoi.
          </label>
          <small>Aucune IA réelle n’est activée dans ce prototype.</small>
        </details>
      </div>
    </section>
  );
}

type Clue = { title: string; text: string; strong?: boolean };

/**
 * Local, keyword-based check. It looks for combinations (a threat needs both
 * a "share" verb and a pressure marker) so that an ordinary message that just
 * mentions a photo or an evening is not flagged.
 */
function analyzeMessage(text: string) {
  const t = text
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/\s+/g, " ");
  const has = (re: RegExp) => re.test(t);
  const clues: Clue[] = [];

  const media = "(photos?|images?|vid[ée]os?|captures?|nudes?|messages?|conversations?)";
  const shareThreat =
    has(new RegExp(`(publi|diffus|balanc|partag|montr|envo)[a-zé]*.{0,40}${media}`)) ||
    has(/(tout|les) (publier|montrer|diffuser|envoyer|balancer)/);
  const pressure = has(
    /(si tu ne|si tu refuses|sinon|je vais|je publie|je diffuse|tout le monde|ta famille|tes parents|tes amis)/,
  );
  const threat = shareThreat && pressure;
  if (threat)
    clues.push({
      title: "Menace de diffusion",
      text: "Quelqu’un menace de partager un contenu pour te forcer à agir.",
      strong: true,
    });

  const intimate =
    has(
      new RegExp(
        `(envoie|envoyer|montre|donne|fais)[^.!?]{0,40}${media}[^.!?]{0,25}(priv|intime|nue|sexy|sans v[êe]tement)`,
      ),
    ) || has(/\bnudes?\b/);
  if (intimate)
    clues.push({
      title: "Demande d’image intime",
      text: "On te demande une image privée. Tu as le droit de refuser, sans te justifier.",
      strong: true,
    });

  const money = has(
    /(argent|paye|paie|frais|fcfa|f cfa|virement|mobile money|momo|transfert|\d[\d .]*\s?(f|francs)(\W|$))/,
  );
  if (money)
    clues.push({
      title: "Demande d’argent",
      text: "Une somme est demandée sous pression ou avant un service.",
    });

  const code =
    (has(/\b(code|otp|pin)\b/) &&
      has(/(sms|chiffres|v[ée]rification|re[çc]u|recevoir|envoie|donne|partage)/)) ||
    (has(/mot de passe/) && has(/(envoie|donne|partage|communique)/));
  if (code)
    clues.push({
      title: "Code secret demandé",
      text: "Un code de vérification ou un mot de passe donne accès à ton compte.",
      strong: true,
    });

  const link = has(
    /(https?:\/\/|www\.|[a-z0-9-]+\.(com|net|org|xyz|top|info|link|ly|app|site|online)(\/|\W|$)|clique|ce lien)/,
  );
  const login = has(/(connecte|identifiant|mot de passe|ton compte|votre compte)/);
  if (link)
    clues.push(
      login
        ? {
            title: "Lien vers une page de connexion",
            text: "Le message pousse vers une page qui peut imiter un service pour voler tes identifiants.",
            strong: true,
          }
        : {
            title: "Lien inattendu",
            text: "Vérifie l’adresse avant d’ouvrir : elle peut imiter un service connu.",
          },
    );

  const offer = has(
    /(candidature|recrut|emploi|embauche|gagn[ée]|loterie|f[ée]licitations|cadeau|bourse)/,
  );
  if (offer)
    clues.push({
      title: "Offre à vérifier",
      text: "Une offre qui demande des frais ou des informations mérite une vérification indépendante.",
    });

  const affective = has(
    /(si tu m'aimes|si tu tiens [àa] moi|fais[- ]moi confiance|me faire confiance|prouve)/,
  );
  if (affective)
    clues.push({
      title: "Pression affective",
      text: "L’affection est utilisée pour obtenir quelque chose de toi.",
    });

  const secret = has(
    /(ne (le )?dis ([àa]|rien [àa]) personne|reste entre nous|notre secret|supprime (ce|les|nos|tes) message|n'en parle)/,
  );
  if (secret)
    clues.push({
      title: "Demande de secret",
      text: "On te demande de te taire : l’isolement facilite la manipulation.",
    });

  // A deadline only counts when it comes with another clue.
  const deadline = has(
    /(avant ce soir|jusqu'[àa] ce soir|tu as jusqu|urgent|vite|imm[ée]diat|tout de suite|dernier d[ée]lai|dans \d+ ?(h|heures?|minutes?)|24 ?h)/,
  );
  if (deadline && clues.length)
    clues.push({
      title: "Pression temporelle",
      text: "Le délai cherche à empêcher une décision réfléchie.",
    });

  const strong = clues.some((c) => c.strong);
  const level =
    strong || clues.length >= 3 || (offer && money)
      ? "Élevé"
      : clues.length >= 1
        ? "Modéré"
        : "Faible";

  const advice = threat
    ? {
        title: "Ne cède pas à la menace.",
        text: "Ne paie pas et n’envoie rien de plus. Garde les preuves si tu peux le faire sans danger, bloque le compte et parles-en à une personne de confiance.",
      }
    : intimate
      ? {
          title: "Tu as le droit de dire non.",
          text: "Personne ne peut exiger une image de toi. Si la pression continue, garde les messages et parles-en à une personne de confiance.",
        }
      : code
        ? {
            title: "Ne partage jamais ce code.",
            text: "Aucun service ni aucun proche n’en a besoin. S’il a déjà été donné, change ton mot de passe tout de suite.",
          }
        : link && login
          ? {
              title: "N’ouvre pas ce lien.",
              text: "Si tu dois vérifier ton compte, ouvre toi-même l’application ou le site officiel.",
            }
          : offer || money
            ? {
                title: "Vérifie avant de payer.",
                text: "Un vrai recrutement ou un vrai gain ne demande pas d’argent. Vérifie l’offre par un canal officiel.",
              }
            : clues.length
              ? {
                  title: "Prends le temps de vérifier.",
                  text: "Ne réponds pas dans l’urgence. Demande l’avis d’une personne de confiance avant d’agir.",
                }
              : {
                  title: "Reste attentive au contexte.",
                  text: "Si quelque chose te met mal à l’aise, fais confiance à ton ressenti et demande un avis.",
                };

  return { level, clues, advice };
}

function Result({
  result,
  message,
  go,
  audio,
}: {
  result: ReturnType<typeof analyzeMessage>;
  message: string;
  go: (s: Screen) => void;
  audio: boolean;
}) {
  const tone = result.level === "Élevé" ? "high" : result.level === "Modéré" ? "medium" : "low";
  useNarration(
    audio,
    `Niveau de vigilance : ${result.level}. ` +
      (result.clues.length
        ? `Indices repérés : ${result.clues.map((c) => c.title).join(", ")}. `
        : "Aucun indice évident détecté. ") +
      `${result.advice.title} ${result.advice.text}`,
  );
  return (
    <section className="screen result">
      <TopBar title="Résultat de l’analyse" onBack={() => go("checker")} />
      <div className="page-content">
        <div className={`risk-card ${tone}`}>
          <div className="risk-ring">
            <Icon name={tone === "low" ? "eye" : "warning"} size={28} />
          </div>
          <p>Niveau de vigilance</p>
          <h1>{result.level}</h1>
          <span>Analyse locale simulée</span>
        </div>
        <div className="quoted">
          <small>MESSAGE ANALYSÉ</small>
          <p>« {message} »</p>
        </div>
        <h2>
          {result.clues.length
            ? `${result.clues.length} indice${result.clues.length > 1 ? "s" : ""} détecté${result.clues.length > 1 ? "s" : ""}`
            : "Aucun indice évident détecté"}
        </h2>
        {result.clues.length ? (
          result.clues.map((c) => (
            <div className="detected" key={c.title}>
              <span>
                <Icon name="warning" size={17} />
              </span>
              <div>
                <strong>{c.title}</strong>
                <p>{c.text}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="tip">
            <Icon name="eye" />
            <p>
              <strong>Reste attentive au contexte.</strong>
              <br />
              L’absence d’indice ne signifie pas que le message est sûr.
            </p>
          </div>
        )}
        <div className="recommendation">
          <p className="eyebrow">Ce que tu peux faire</p>
          <h3>{result.advice.title}</h3>
          <p>{result.advice.text}</p>
        </div>
        <Button onClick={() => go("resources")} icon="shield">
          Voir les conseils
        </Button>
        <Button variant="secondary" onClick={() => go("help")}>
          Trouver de l’aide
        </Button>
        <Button variant="ghost" onClick={() => go("checker")}>
          Vérifier un autre message
        </Button>
        <p className="disclaimer">
          Cette analyse repose sur des indices connus. Elle peut se tromper et ne garantit pas la
          détection de toutes les situations dangereuses.
        </p>
      </div>
    </section>
  );
}

function Resources({
  go,
  initial,
  active,
}: {
  go: (s: Screen) => void;
  initial: number;
  active: "resources" | "help";
}) {
  const [open, setOpen] = useState(initial);
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
      ],
    },
    {
      icon: "help" as IconName,
      title: "Trouver de l’aide",
      intro: "Tu n’as pas à gérer ça seule.",
      items: [
        "Parle à une personne de confiance.",
        "Cherche une structure locale dont les contacts sont vérifiés.",
        "Utilise les outils officiels de signalement de la plateforme.",
        "En cas de danger immédiat, contacte les services d’urgence de ta zone.",
      ],
    },
  ];
  return (
    <section className="screen with-nav resources">
      <TopBar title="Que faire maintenant ?" onBack={() => go("home")} />
      <div className="page-content">
        <div className="resource-title">
          <span>
            <Icon name="shield" size={30} />
          </span>
          <h1>Tu n’as pas à gérer ça seule.</h1>
          <p>Choisis ce dont tu as besoin, maintenant.</p>
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
                {i === 2 && (
                  <p className="empty-contact">
                    <strong>Contacts locaux vérifiés</strong>
                    <br />
                    Aucune coordonnée n’est préchargée dans ce prototype afin de ne pas afficher
                    d’information non vérifiée. Vérifie toujours la source et les limites de
                    confidentialité d’un service.
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
      </div>
      <BottomNav active={active} go={go} />
    </section>
  );
}

function Quiz({
  audio,
  index,
  choice,
  setChoice,
  onNext,
  onBack,
}: {
  audio: boolean;
  index: number;
  score: number;
  choice: number | null;
  setChoice: (n: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const item = quiz[index];
  useNarration(
    audio,
    choice === null
      ? `Question ${index + 1}. ${item.q} ${item.a
          .map((a, i) => `Réponse ${String.fromCharCode(65 + i)} : ${a}`)
          .join(". ")}.`
      : `${choice === item.correct ? "Bien vu !" : "À retenir."} ${item.why}`,
  );
  return (
    <section className="screen quiz">
      <TopBar title="Quiz réflexes" onBack={onBack} action={<strong>{index + 1}/5</strong>} />
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
  audio,
  saved,
  onSave,
  onBack,
}: {
  audio: boolean;
  saved: boolean;
  onSave: () => void;
  onBack: () => void;
}) {
  useNarration(
    audio,
    `Mes 6 réflexes. ${reflexes.map((r, i) => `${i + 1}. ${r[1]}. ${r[2]}`).join(" ")}`,
  );
  return (
    <section className="screen guide">
      <TopBar
        title="Ma fiche"
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
        </div>
        <div className="reflex-list">
          {reflexes.map((r, i) => (
            <div key={r[1]}>
              <span className="reflex-number">0{i + 1}</span>
              <span className="reflex-icon">
                <Icon name={r[0]} />
              </span>
              <p>
                <strong>{r[1]}</strong>
                <small>{r[2]}</small>
              </p>
            </div>
          ))}
        </div>
        <p className="guide-footer">
          <Icon name="offline" size={15} /> Cette fiche reste disponible hors ligne sur ce
          téléphone.
        </p>
      </div>
      <div className="page-content">
        <Button onClick={onSave} icon={saved ? "check" : "download"}>
          {saved ? "Fiche enregistrée" : "Enregistrer ma fiche"}
        </Button>
        <p className="microcopy">
          L’enregistrement est local. Aucune donnée personnelle n’est créée.
        </p>
      </div>
    </section>
  );
}

function Progress({
  story,
  saved,
  go,
  replay,
}: {
  story: number;
  saved: boolean;
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
  const achievements = [
    ["book", "Histoire", story >= 5 ? "Terminée" : "En cours"],
    ["eye", "Situations découvertes", `${Math.min(story, 5)}/5`],
    ["spark", "Quiz", localStorage.getItem("naya-quiz") ? "Réalisé" : "À faire"],
    ["download", "Fiche", saved ? "Enregistrée" : "À enregistrer"],
  ] as [IconName, string, string][];
  return (
    <section className="screen progress-screen">
      <TopBar title="Ma progression" onBack={() => go("home")} />
      <div className="page-content">
        <div className="progress-hero">
          <span>
            <Icon name="check" size={34} />
          </span>
          <p className="eyebrow">Parcours complété</p>
          <h1>Tu sais mieux repérer ce qui mérite ton attention.</h1>
          <p>Les bons réflexes se construisent un choix après l’autre.</p>
        </div>
        <div className="achievement-grid">
          {achievements.map((a) => (
            <div key={a[1]}>
              <Icon name={a[0]} />
              <small>{a[1]}</small>
              <strong>{a[2]}</strong>
            </div>
          ))}
        </div>
        <h2>Badges acquis</h2>
        <div className="badges">
          {[
            "Détectrice de pièges",
            "Gardienne de ses données",
            "Alliée numérique",
            "Défenseuse du consentement",
          ].map((b, i) => (
            <div key={b} className={i > story - 2 ? "locked" : ""}>
              <span>
                <Icon name={i === 0 ? "search" : i === 1 ? "lock" : i === 2 ? "help" : "shield"} />
              </span>
              <p>{b}</p>
            </div>
          ))}
        </div>
        <div className="replay-card">
          <p className="eyebrow">Et maintenant ?</p>
          <h2>Et si tu essayais un autre chemin ?</h2>
          <p>Les réponses changent la conversation, jamais ta valeur.</p>
          <Button onClick={replay} icon="play">
            Rejouer l’histoire
          </Button>
          <Button variant="secondary" onClick={() => go("resources")}>
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
  audio,
  setAudio,
  go,
  erase,
  notify,
}: {
  audio: boolean;
  setAudio: (v: boolean) => void;
  go: (s: Screen) => void;
  erase: () => void;
  notify: (s: string) => void;
}) {
  return (
    <section className="screen settings-page">
      <TopBar title="Paramètres" onBack={() => go("home")} />
      <div className="page-content">
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
        <h3>Préférences</h3>
        <button
          className="setting-row"
          onClick={() => notify("Le fon et le mina sont en préparation")}
        >
          <span>
            <Icon name="message" />
          </span>
          <div>
            <strong>Langue</strong>
            <small>Français · fon et mina bientôt</small>
          </div>
          <Icon name="chevron" />
        </button>
        <button className="setting-row" onClick={() => setAudio(!audio)} disabled={!canSpeak}>
          <span>
            <Icon name="play" />
          </span>
          <div>
            <strong>Lecture audio</strong>
            <small>
              {!canSpeak ? "Non disponible sur ce téléphone" : audio ? "Activée" : "Désactivée"}
            </small>
          </div>
          <span className={`toggle ${audio ? "on" : ""}`}>
            <i />
          </span>
        </button>
        <h3>Sécurité et confidentialité</h3>
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
    </section>
  );
}

function Privacy({ onBack }: { onBack: () => void }) {
  const commitments = [
    ["user", "Confidentialité", "Aucun compte obligatoire."],
    ["offline", "Minimisation", "Aucune collecte de messages personnels."],
    ["download", "Stockage local", "La progression reste sur le téléphone."],
    ["warning", "Contrôle utilisatrice", "“Tout effacer” reste accessible."],
    ["check", "Consentement", "Accord explicite avant toute analyse en ligne."],
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
            <span>Analyse locale simulée</span>
            <span>Copier un texte reste un choix</span>
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

const HOLD_MS = 2000;
const COUNTDOWN_S = 5;

type AlertPhase = "idle" | "holding" | "countdown" | "done" | "cancelled";

function AlertDemo({ onBack, notify }: { onBack: () => void; notify: (s: string) => void }) {
  const [phase, setPhase] = useState<AlertPhase>("idle");
  const [left, setLeft] = useState(COUNTDOWN_S);
  const holdTimer = useRef<number | undefined>(undefined);

  const startHold = () => {
    if (phase === "holding" || phase === "countdown") return;
    setPhase("holding");
    holdTimer.current = window.setTimeout(() => {
      navigator.vibrate?.(200);
      setLeft(COUNTDOWN_S);
      setPhase("countdown");
    }, HOLD_MS);
  };
  const endHold = () => {
    if (phase !== "holding") return;
    window.clearTimeout(holdTimer.current);
    setPhase("idle");
    notify("Maintiens le bouclier 2 secondes");
  };
  useEffect(() => () => window.clearTimeout(holdTimer.current), []);
  useEffect(() => {
    if (phase !== "countdown") return;
    if (left === 0) {
      setPhase("done");
      return;
    }
    const tick = window.setTimeout(() => setLeft(left - 1), 1000);
    return () => window.clearTimeout(tick);
  }, [phase, left]);

  const title =
    phase === "holding"
      ? "Continue d’appuyer…"
      : phase === "countdown"
        ? `Simulation : envoi dans ${left} s`
        : phase === "done"
          ? "Simulation terminée"
          : phase === "cancelled"
            ? "Alerte annulée"
            : "Maintiens le bouclier 2 secondes";
  const text =
    phase === "countdown"
      ? "Dans une vraie version, l’alerte partirait à la fin du décompte. Tu peux encore annuler."
      : phase === "done"
        ? "Aucune alerte envoyée, aucun contact prévenu. Dans une vraie version, un contact choisi à l’avance aurait reçu un message."
        : phase === "cancelled"
          ? "Rien n’a été envoyé. L’utilisatrice garde toujours la main."
          : "Geste fictif pour montrer comment une alerte discrète pourrait se déclencher.";

  return (
    <section className="screen alert-demo">
      <TopBar title="Alerte discrète" onBack={onBack} />
      <div className="page-content">
        <div className="demo-banner">
          <Icon name="warning" />
          <p>
            <strong>Simulation, aucune alerte envoyée</strong>
            <br />
            Cet écran ne contacte personne : ni message, ni appel, ni position.
          </p>
        </div>
        <div className="alert-visual">
          <button
            className={`pulse ${phase === "holding" ? "holding" : ""} ${
              phase === "countdown" || phase === "done" ? "armed" : ""
            }`}
            aria-label="Maintenir pour lancer la simulation d’alerte"
            onPointerDown={startHold}
            onPointerUp={endHold}
            onPointerLeave={endHold}
            onPointerCancel={endHold}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) startHold();
            }}
            onKeyUp={endHold}
            onContextMenu={(e) => e.preventDefault()}
          >
            <Icon name={phase === "done" ? "check" : "shield"} size={42} />
          </button>
          <h1 aria-live="polite">{title}</h1>
          <p>{text}</p>
        </div>
        {phase === "countdown" && (
          <Button
            variant="danger"
            onClick={() => {
              setPhase("cancelled");
              notify("Simulation annulée");
            }}
          >
            Annuler
          </Button>
        )}
        {(phase === "done" || phase === "cancelled") && (
          <Button variant="secondary" onClick={() => setPhase("idle")}>
            Recommencer
          </Button>
        )}
        <ol className="demo-steps">
          <li>
            <span>1</span>
            <p>
              <strong>Un geste discret</strong>
              <br />
              Maintenir un bouton, ou le raccourci « Mon carnet » par appui long sur l’icône.
            </p>
          </li>
          <li>
            <span>2</span>
            <p>
              <strong>Une confirmation silencieuse</strong>
              <br />
              Une vibration confirme la demande.
            </p>
          </li>
          <li>
            <span>3</span>
            <p>
              <strong>Garder le contrôle</strong>
              <br />
              Un décompte permet d’annuler avant tout envoi.
            </p>
          </li>
        </ol>
        <p className="disclaimer">
          Cette interaction ne déclenche aucun message, appel, partage de position ou contact
          d’urgence.
        </p>
      </div>
    </section>
  );
}

export default App;
