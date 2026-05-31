"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Flame,
  Gem,
  Heart,
  Lock,
  PackageOpen,
  Play,
  Shield,
  Sparkles,
  Star,
  Swords,
  Target,
  Trophy,
  Wand2,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { tracks } from "@/lib/tracks";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const starterCode = `def score_user(purchases, visits):
    return purchases * 10 + visits

print(score_user(3, 7))`;

const dailyQuests = [
  { title: "Run one startup scoring function", reward: "+50 XP", progress: 75, status: "Current" },
  { title: "Fix one hidden edge case", reward: "+20 coins", progress: 35, status: "Open" },
  { title: "Ask coach for a cleaner version", reward: "+10 XP", progress: 0, status: "Bonus" }
];

const adventurePath = [
  {
    title: "Python Basecamp",
    subtitle: "Prints, comments, first wins",
    state: "complete",
    reward: "120 XP",
    time: "18 min",
    difficulty: 1,
    icon: BookOpen
  },
  {
    title: "Variable Forest",
    subtitle: "Store values with confidence",
    state: "complete",
    reward: "160 XP",
    time: "24 min",
    difficulty: 1,
    icon: Check
  },
  {
    title: "Data Village",
    subtitle: "Strings, numbers, booleans",
    state: "current",
    reward: "220 XP",
    time: "31 min",
    difficulty: 2,
    icon: Star
  },
  {
    title: "Logic Mountains",
    subtitle: "If statements and decisions",
    state: "ready",
    reward: "260 XP",
    time: "36 min",
    difficulty: 2,
    icon: Target
  },
  {
    title: "Loop Caverns",
    subtitle: "Repeat work without burnout",
    state: "locked",
    reward: "310 XP",
    time: "42 min",
    difficulty: 3,
    icon: Lock
  },
  {
    title: "Function Temple",
    subtitle: "Boss level: reusable logic",
    state: "boss",
    reward: "500 XP",
    time: "55 min",
    difficulty: 4,
    icon: Swords
  }
];

const shopItems = [
  { title: "Mystery Box", description: "Random coins, XP, or cosmetic badge.", cost: 80, icon: PackageOpen },
  { title: "AI Hint Scroll", description: "Unlock one extra hint during a hard mission.", cost: 40, icon: Wand2 },
  { title: "Streak Shield", description: "Protect one missed day.", cost: 120, icon: Shield },
  { title: "Challenge Skip", description: "Skip one warm-up and keep your path moving.", cost: 180, icon: Swords },
  { title: "Mentor Deep Review", description: "Get a longer AI code review with next steps.", cost: 220, icon: Brain }
];

type View = "mission" | "map" | "coach" | "progress";

export default function HomePage() {
  const [view, setView] = useState<View>("mission");
  const [activeTrack] = useState(tracks[2]);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run your solution to launch the mission.");
  const [question, setQuestion] = useState("Explain Python data types using a grocery store analogy.");
  const [coachReply, setCoachReply] = useState("Ask for a hint, a plain-English explanation, or a code review.");
  const [xp, setXp] = useState(1480);
  const [coins, setCoins] = useState(520);
  const [gems, setGems] = useState(12);
  const [hearts, setHearts] = useState(5);
  const [combo, setCombo] = useState(2);
  const [busy, setBusy] = useState(false);
  const [celebration, setCelebration] = useState<null | { xp: number; coins: number; title: string }>(null);

  const level = useMemo(() => Math.max(1, Math.floor(xp / 300)), [xp]);
  const levelStartXp = 1000;
  const nextLevelXp = 2000;
  const levelProgress = useMemo(
    () => Math.min(100, Math.max(0, Math.round(((xp - levelStartXp) / (nextLevelXp - levelStartXp)) * 100))),
    [xp]
  );
  const xpRemaining = Math.max(0, nextLevelXp - xp);

  function awardProgress(title: string, xpReward: number, coinReward: number) {
    setXp((value) => value + xpReward);
    setCoins((value) => value + coinReward);
    setCombo((value) => value + 1);
    setCelebration({ title, xp: xpReward, coins: coinReward });
  }

  async function runCode() {
    setBusy(true);
    setOutput("Running your startup scoring engine...");
    try {
      const response = await fetch(`${API_URL}/challenges/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, stdin: "" })
      });
      const result = await response.json();
      setOutput(result.stdout || result.stderr || "Code finished without output.");
      if (result.exit_code === 0) {
        awardProgress("Mission complete", 50, 20);
      } else {
        setHearts((value) => Math.max(0, value - 1));
      }
    } catch {
      setOutput("Local runner is offline for this trial. Progress still advanced so you can test the learning loop.");
      awardProgress("Trial mission complete", 35, 12);
    } finally {
      setBusy(false);
    }
  }

  async function askCoach(mode: "hint" | "review" = "hint") {
    setBusy(true);
    setCoachReply(mode === "hint" ? "Preparing a concise hint..." : "Reviewing your code...");
    try {
      const endpoint = mode === "hint" ? "tutor" : "review";
      const body = mode === "hint" ? { question, context: activeTrack.title } : { code };
      const response = await fetch(`${API_URL}/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      setCoachReply(result.answer || result.feedback || "Coach response received.");
      awardProgress(mode === "hint" ? "Hint unlocked" : "Code reviewed", mode === "hint" ? 10 : 15, 0);
    } catch {
      setCoachReply(
        mode === "hint"
          ? "Hint: identify each value type before choosing the operation. Text, whole numbers, decimals, and true/false values behave differently."
          : "Review: keep the function pure, add one edge-case test, and use names that explain intent."
      );
      awardProgress(mode === "hint" ? "Hint unlocked" : "Review complete", mode === "hint" ? 8 : 12, 0);
    } finally {
      setBusy(false);
    }
  }

  function buyReward(cost: number, title: string) {
    if (coins < cost) {
      setOutput(`Not enough coins for ${title}. Complete one mission to earn more.`);
      return;
    }
    setCoins((value) => value - cost);
    setCelebration({ title: `${title} unlocked`, xp: 0, coins: -cost });
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_16%_0%,rgba(47,125,244,0.20),transparent_30%),radial-gradient(circle_at_92%_12%,rgba(255,191,74,0.22),transparent_24%),linear-gradient(180deg,#f7f8fb_0%,#edf3ff_48%,#f8fafc_100%)] text-content">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[size:44px_44px] opacity-50" />
      <div className="relative mx-auto max-w-[1480px] px-4 py-4 md:px-6">
        <GameHeader
          level={level}
          progress={levelProgress}
          xp={xp}
          nextLevelXp={nextLevelXp}
          xpRemaining={xpRemaining}
          coins={coins}
          gems={gems}
          hearts={hearts}
          streak={8}
        />

        <div className="mt-5 grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)_340px]">
          <aside className="space-y-5">
            <CharacterCard level={level} xpRemaining={xpRemaining} />
            <QuestPanel />
            <MapPreview onOpen={() => setView("map")} />
          </aside>

          <section className="min-w-0 space-y-5">
            <HeroMission onStart={() => setView("mission")} onMap={() => setView("map")} />

            <nav className="grid gap-2 sm:grid-cols-4">
              <Segment active={view === "mission"} onClick={() => setView("mission")} icon={<Code2 size={17} />}>Mission</Segment>
              <Segment active={view === "map"} onClick={() => setView("map")} icon={<Target size={17} />}>Map</Segment>
              <Segment active={view === "coach"} onClick={() => setView("coach")} icon={<Brain size={17} />}>Coach</Segment>
              <Segment active={view === "progress"} onClick={() => setView("progress")} icon={<Trophy size={17} />}>Progress</Segment>
            </nav>

            {view === "mission" && (
              <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
                <Panel title="Startup scoring engine" meta="+50 XP +20 coins">
                  <div className="mb-4 grid gap-3 rounded-3xl border border-primary-100 bg-primary-50 p-4 md:grid-cols-[1fr_auto]">
                    <div>
                      <div className="flex items-center gap-2 text-caption text-primary-700">
                        <Sparkles size={15} /> Today&apos;s mission
                      </div>
                      <h2 className="mt-2 font-heading text-heading-lg text-content">Help a startup rank its most active users.</h2>
                      <p className="mt-2 text-body-sm text-content-secondary">
                        Write a tiny function that combines purchases and visits into one useful score.
                      </p>
                    </div>
                    <div className="rounded-2xl bg-background-raised p-4 shadow-inset">
                      <div className="text-caption text-content-muted">Difficulty</div>
                      <div className="mt-1 flex text-warning-500"><Star size={18} fill="currentColor" /><Star size={18} fill="currentColor" /></div>
                      <div className="mt-3 text-caption text-content-muted">Estimated</div>
                      <div className="font-semibold">7 minutes</div>
                    </div>
                  </div>
                  <textarea
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className="min-h-80 w-full resize-y rounded-3xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm leading-6 text-emerald-100 outline-none transition duration-300 ease-premium focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                    spellCheck={false}
                    aria-label="Python code editor"
                  />
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button onClick={runCode} disabled={busy}>
                      <span className="inline-flex items-center gap-2"><Play size={16} />{busy ? "Running..." : "Run mission"}</span>
                    </Button>
                    <Button variant="secondary" onClick={() => askCoach("review")} disabled={busy}>Review code</Button>
                    <Button variant="secondary" onClick={() => setCode(starterCode)}>Reset</Button>
                  </div>
                </Panel>
                <div className="space-y-5">
                  <Panel title="Mission output" meta="Live">
                    <pre className="min-h-44 whitespace-pre-wrap rounded-3xl bg-slate-950 p-4 font-mono text-sm leading-6 text-emerald-100">{output}</pre>
                  </Panel>
                  <Panel title="Daily quests" meta="3 rewards">
                    <div className="space-y-3">
                      {dailyQuests.map((quest) => (
                        <QuestRow key={quest.title} {...quest} />
                      ))}
                    </div>
                  </Panel>
                </div>
              </section>
            )}

            {view === "map" && <AdventureMap />}

            {view === "coach" && (
              <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
                <Panel title="AI coach" meta="+10 XP">
                  <textarea
                    value={question}
                    onChange={(event) => setQuestion(event.target.value)}
                    className="min-h-52 w-full resize-y rounded-3xl border border-border bg-background-raised p-4 text-body-sm leading-6 outline-none transition duration-300 ease-premium focus:border-border-focus focus:ring-4 focus:ring-primary-100"
                    aria-label="Ask the AI coach"
                  />
                  <Button className="mt-4" onClick={() => askCoach("hint")} disabled={busy}>
                    <span className="inline-flex items-center gap-2"><Brain size={16} />{busy ? "Thinking..." : "Ask coach"}</span>
                  </Button>
                </Panel>
                <Panel title="Coach response" meta="Guided">
                  <p className="whitespace-pre-wrap text-body-sm leading-7 text-content-secondary">{coachReply}</p>
                </Panel>
              </section>
            )}

            {view === "progress" && <ProgressBoard />}
          </section>

          <aside className="space-y-5">
            <Panel title="Reward shop" meta={`${coins} coins`}>
              <div className="space-y-3">
                {shopItems.map((item) => (
                  <ShopItem key={item.title} item={item} onBuy={() => buyReward(item.cost, item.title)} />
                ))}
              </div>
            </Panel>
            <Panel title="Weekly challenge" meta="Boss level">
              <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-primary-900 p-5 text-white shadow-premium">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12">
                  <Swords size={22} />
                </div>
                <h3 className="mt-4 font-heading text-heading-md">Defeat the Bug Hydra</h3>
                <p className="mt-2 text-body-sm text-white/72">Complete 5 debugging exercises before Sunday.</p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-[60%] rounded-full bg-warning-300" />
                </div>
              </div>
            </Panel>
          </aside>
        </div>
      </div>
      {celebration && (
        <CelebrationModal
          title={celebration.title}
          xp={celebration.xp}
          coins={celebration.coins}
          combo={combo}
          onClose={() => setCelebration(null)}
          onContinue={() => {
            setCelebration(null);
            setView("map");
          }}
        />
      )}
    </main>
  );
}

function GameHeader({
  level,
  progress,
  xp,
  nextLevelXp,
  xpRemaining,
  coins,
  gems,
  hearts,
  streak
}: {
  level: number;
  progress: number;
  xp: number;
  nextLevelXp: number;
  xpRemaining: number;
  coins: number;
  gems: number;
  hearts: number;
  streak: number;
}) {
  return (
    <header className="sticky top-3 z-40 rounded-[2rem] border border-white/70 bg-white/86 p-3 shadow-premium backdrop-blur-2xl">
      <div className="grid gap-3 lg:grid-cols-[220px_minmax(0,1fr)_auto] lg:items-center">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 font-heading text-xl font-black text-white shadow-glow">
            {level}
          </div>
          <div>
            <div className="flex items-center gap-1 text-caption text-warning-600"><Flame size={15} /> {streak} Day Streak</div>
            <div className="font-heading text-heading-md text-content">Python Explorer</div>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-caption text-content-secondary">
            <span>{xp} / {nextLevelXp} XP</span>
            <span>{xpRemaining} XP to AI Deep Review</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-background-subtle ring-1 ring-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 via-xp-500 to-success-400 transition-all duration-600 ease-premium"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-3">
          <HeaderCurrency icon={<CircleDollarSign size={17} />} value={coins} label="Coins" tone="text-coin-500" />
          <HeaderCurrency icon={<Gem size={17} />} value={gems} label="Gems" tone="text-primary-500" />
          <HeaderCurrency icon={<Heart size={17} />} value={hearts} label="Hearts" tone="text-error-500" />
        </div>
      </div>
    </header>
  );
}

function HeaderCurrency({ icon, value, label, tone }: { icon: ReactNode; value: number; label: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background-raised px-3 py-2 shadow-inset">
      <div className={`flex items-center justify-center gap-1 font-bold ${tone}`}>{icon}{value}</div>
      <div className="text-center text-[0.65rem] font-semibold text-content-muted">{label}</div>
    </div>
  );
}

function CharacterCard({ level, xpRemaining }: { level: number; xpRemaining: number }) {
  return (
    <Panel title="Character progression" meta={`Level ${level}`}>
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-primary-900 to-secondary-800 p-5 text-white shadow-premium">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-white/12 text-5xl shadow-inset">
          <Sparkles size={42} />
        </div>
        <h3 className="mt-4 text-center font-heading text-heading-lg">Explorer Kit</h3>
        <p className="mt-2 text-center text-body-sm text-white/72">Next reward: unlock AI Deep Review.</p>
        <div className="mt-4 rounded-2xl bg-white/10 p-3 text-center text-caption text-white">{xpRemaining} XP remaining</div>
      </div>
    </Panel>
  );
}

function QuestPanel() {
  return (
    <Panel title="Onboarding questline" meta="3 steps">
      <div className="space-y-3">
        {["Place into Data Village", "Complete first mission", "Unlock coach review"].map((step, index) => (
          <div key={step} className="flex gap-3">
            <div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
              index === 0 ? "bg-success text-success-foreground" : index === 1 ? "bg-primary text-primary-foreground animate-soft-pulse" : "bg-background-subtle text-content-muted"
            }`}>
              {index === 0 ? <Check size={14} /> : index + 1}
            </div>
            <div>
              <div className="font-semibold">{step}</div>
              <div className="text-body-sm text-content-muted">{index === 1 ? "Current mission" : index === 0 ? "Complete" : "2 minutes left"}</div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MapPreview({ onOpen }: { onOpen: () => void }) {
  return (
    <Panel title="Learning path" meta="Adventure">
      <button onClick={onOpen} className="group w-full rounded-3xl border border-border bg-background-subtle p-4 text-left transition duration-300 ease-premium hover:-translate-y-1 hover:border-primary-200 hover:bg-primary-50">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-heading text-heading-md">Data Village</div>
            <div className="mt-1 text-body-sm text-content-muted">Current zone with 220 XP waiting.</div>
          </div>
          <ChevronRight className="text-content-muted transition group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </button>
    </Panel>
  );
}

function HeroMission({ onStart, onMap }: { onStart: () => void; onMap: () => void }) {
  return (
    <section className="animate-rise-in overflow-hidden rounded-[2.25rem] border border-white/80 bg-gradient-to-br from-white via-primary-50 to-warning-50 shadow-premium">
      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        <div className="p-6 md:p-8 lg:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-warning-200 bg-white/70 px-3 py-1 text-caption text-warning-800 shadow-inset">
            <Sparkles size={14} /> Today&apos;s mission
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-display-sm text-content md:text-display-md">
            Help a startup build a user scoring engine.
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-content-secondary">
            A quick challenge with visible progress, coins, and coach feedback. Finish it, collect the reward, then move across the map.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={onStart}>
              <span className="inline-flex items-center gap-2"><Play size={16} /> Start mission</span>
            </Button>
            <Button variant="secondary" onClick={onMap}>View map</Button>
          </div>
        </div>
        <div className="border-t border-white/70 bg-white/50 p-6 lg:border-l lg:border-t-0">
          <div className="grid gap-3">
            <RewardMetric icon={<Star size={18} />} label="Mission reward" value="+50 XP" />
            <RewardMetric icon={<CircleDollarSign size={18} />} label="Coin bonus" value="+20" />
            <RewardMetric icon={<Flame size={18} />} label="Combo target" value="x3" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AdventureMap() {
  return (
    <Panel title="Python Explorer map" meta="Duolingo-style path">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-primary-50 via-white to-secondary-50 p-5">
        <div className="absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-1 -translate-x-1/2 rounded-full bg-gradient-to-b from-success-300 via-primary-300 to-border md:block" />
        <div className="relative grid gap-5">
          {adventurePath.map((node, index) => (
            <MapNode key={node.title} node={node} align={index % 2 === 0 ? "left" : "right"} />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function MapNode({ node, align }: { node: (typeof adventurePath)[number]; align: "left" | "right" }) {
  const Icon = node.icon;
  const isLocked = node.state === "locked";
  const isCurrent = node.state === "current";
  const isBoss = node.state === "boss";

  return (
    <button
      className={`relative grid gap-3 rounded-3xl border p-4 text-left shadow-card transition duration-300 ease-premium md:w-[48%] ${
        align === "right" ? "md:ml-auto" : ""
      } ${
        isCurrent
          ? "border-primary-200 bg-white shadow-glow hover:-translate-y-1"
          : isLocked
            ? "border-border bg-white/70 opacity-70"
            : isBoss
              ? "border-warning-200 bg-gradient-to-br from-slate-950 to-primary-900 text-white hover:-translate-y-1"
              : "border-border bg-white hover:-translate-y-1 hover:border-primary-100"
      }`}
      disabled={isLocked}
    >
      <div className="flex items-start gap-3">
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
          isCurrent ? "bg-primary text-primary-foreground animate-soft-pulse" : isLocked ? "bg-background-subtle text-content-muted" : isBoss ? "bg-warning-300 text-warning-900" : "bg-success-50 text-success-700"
        }`}>
          <Icon size={21} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-heading-md">{node.title}</span>
          <span className={`mt-1 block text-body-sm ${isBoss ? "text-white/72" : "text-content-muted"}`}>{node.subtitle}</span>
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-caption">
        <span className="rounded-full bg-background-raised px-3 py-1 text-content-secondary ring-1 ring-border">{node.reward}</span>
        <span className="rounded-full bg-background-raised px-3 py-1 text-content-secondary ring-1 ring-border">{node.time}</span>
        <span className="flex items-center gap-0.5 rounded-full bg-background-raised px-3 py-1 text-warning-600 ring-1 ring-border">
          {Array.from({ length: node.difficulty }).map((_, index) => <Star key={index} size={12} fill="currentColor" />)}
        </span>
      </div>
    </button>
  );
}

function ProgressBoard() {
  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <Panel title="League standing" meta="Top 10 advance">
        {["Ada", "Grace", "Harshith", "Linus", "Maya"].map((name, index) => (
          <div key={name} className={`flex items-center justify-between rounded-2xl px-4 py-3 ${name === "Harshith" ? "bg-primary-50 text-primary-800" : ""}`}>
            <span className="font-semibold">#{index + 1} {name}</span>
            <span className="font-semibold text-primary">{4200 - index * 260} XP</span>
          </div>
        ))}
      </Panel>
      <Panel title="Recent unlocks" meta="4/200">
        <div className="grid gap-3 sm:grid-cols-2">
          {["First Run", "Quiz Perfect", "Debug Calm", "API Builder"].map((badge) => (
            <div key={badge} className="rounded-3xl border border-border bg-background-raised p-4 shadow-card">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-warning-100 text-warning-700">
                <Trophy size={18} />
              </div>
              <div className="font-semibold">{badge}</div>
              <div className="mt-1 text-caption text-content-muted">Unlocked</div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function QuestRow({ title, reward, progress, status }: { title: string; reward: string; progress: number; status: string }) {
  return (
    <div className="rounded-3xl border border-border bg-background-raised p-3 shadow-inset">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="mt-1 text-caption text-primary-700">{reward}</div>
        </div>
        <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-content-muted">{status}</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-subtle">
        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-success-400" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function RewardMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/80 bg-white/74 p-4 shadow-inset">
      <div className="flex items-center gap-2 text-primary">{icon}<span className="font-heading text-heading-md text-content">{value}</span></div>
      <div className="mt-1 text-caption text-content-muted">{label}</div>
    </div>
  );
}

function Segment({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-body-sm font-semibold transition duration-300 ease-premium focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 ${
        active ? "border-primary bg-primary text-primary-foreground shadow-glow" : "border-border bg-background-raised text-content-secondary hover:-translate-y-0.5 hover:bg-background-subtle hover:text-content"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Panel({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/80 bg-white/88 p-5 shadow-card backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-heading text-heading-md text-content">{title}</h2>
        <span className="rounded-full bg-background-subtle px-3 py-1 text-caption text-content-muted ring-1 ring-border">{meta}</span>
      </div>
      {children}
    </section>
  );
}

function ShopItem({ item, onBuy }: { item: (typeof shopItems)[number]; onBuy: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onBuy}
      className="group flex w-full items-center justify-between gap-3 rounded-3xl border border-border bg-background-raised p-3 text-left shadow-inset transition duration-300 ease-premium hover:-translate-y-0.5 hover:border-warning-200 hover:bg-warning-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-warning-100"
    >
      <span className="flex min-w-0 items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-warning-100 text-warning-700 transition group-hover:scale-105">
          <Icon size={19} />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-semibold">{item.title}</span>
          <span className="line-clamp-2 text-caption text-content-muted">{item.description}</span>
        </span>
      </span>
      <span className="shrink-0 rounded-full bg-coin-50 px-3 py-1 text-caption text-coin-500 ring-1 ring-coin-100">{item.cost}</span>
    </button>
  );
}

function CelebrationModal({
  title,
  xp,
  coins,
  combo,
  onClose,
  onContinue
}: {
  title: string;
  xp: number;
  coins: number;
  combo: number;
  onClose: () => void;
  onContinue: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/56 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 bg-white p-6 text-center shadow-premium">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-content-muted transition hover:bg-background-subtle hover:text-content" aria-label="Close celebration">
          <X size={18} />
        </button>
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-[1.75rem] bg-gradient-to-br from-warning-300 to-primary-400 text-white shadow-glow">
          <BadgeCheck size={38} />
        </div>
        <h2 className="mt-5 font-display text-display-sm text-content">{title}</h2>
        <p className="mt-2 text-body-sm text-content-secondary">You kept the learning loop alive. Small win, real progress.</p>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <CelebrationStat label="XP" value={xp >= 0 ? `+${xp}` : `${xp}`} />
          <CelebrationStat label="Coins" value={coins >= 0 ? `+${coins}` : `${coins}`} />
          <CelebrationStat label="Combo" value={`x${combo}`} />
        </div>
        <Button className="mt-6 w-full" onClick={onContinue}>
          Continue to map <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}

function CelebrationStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-background-subtle p-3">
      <div className="font-heading text-heading-md text-primary">{value}</div>
      <div className="text-caption text-content-muted">{label}</div>
    </div>
  );
}
