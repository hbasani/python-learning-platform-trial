"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Flame,
  Lock,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { tracks } from "@/lib/tracks";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const starterCode = `def greet(name):
    return f"Hello, {name}!"

print(greet("Python learner"))`;

const dailyQuests = [
  { label: "Finish one lesson", progress: 75, reward: "+50 XP" },
  { label: "Run one code mission", progress: 40, reward: "+25 XP" },
  { label: "Ask for one explanation", progress: 20, reward: "+10 XP" }
];

const skillPath = [
  { title: "Python Basics", status: "done", icon: BookOpen },
  { title: "Variables", status: "done", icon: CheckCircle2 },
  { title: "Data Types", status: "active", icon: Star },
  { title: "Conditions", status: "open", icon: Target },
  { title: "Loops", status: "locked", icon: Lock },
  { title: "Functions", status: "locked", icon: Lock }
];

type View = "mission" | "coach" | "league";

export default function HomePage() {
  const [view, setView] = useState<View>("mission");
  const [activeTrack, setActiveTrack] = useState(tracks[2]);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run your code to unlock the mission reward.");
  const [question, setQuestion] = useState("Explain Python data types using a simple analogy.");
  const [coachReply, setCoachReply] = useState("Ask the coach for a hint, explanation, or review.");
  const [xp, setXp] = useState(1480);
  const [coins, setCoins] = useState(520);
  const [busy, setBusy] = useState(false);

  const level = useMemo(() => Math.max(1, Math.floor(xp / 300)), [xp]);
  const levelProgress = useMemo(() => Math.min(100, Math.round(((xp % 300) / 300) * 100)), [xp]);

  async function runCode() {
    setBusy(true);
    setOutput("Running your solution...");
    try {
      const response = await fetch(`${API_URL}/challenges/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, stdin: "" })
      });
      const result = await response.json();
      setOutput(result.stdout || result.stderr || "Code finished without output.");
      if (result.exit_code === 0) {
        setXp((value) => value + 25);
        setCoins((value) => value + 5);
      }
    } catch {
      setOutput("The local runner is not connected yet. Your trial mission still advanced.");
      setXp((value) => value + 15);
    } finally {
      setBusy(false);
    }
  }

  async function askCoach(mode: "hint" | "review" = "hint") {
    setBusy(true);
    setCoachReply(mode === "hint" ? "Preparing a focused hint..." : "Reviewing your code...");
    try {
      const endpoint = mode === "hint" ? "tutor" : "review";
      const body = mode === "hint" ? { question, context: activeTrack.title } : { code };
      const response = await fetch(`${API_URL}/ai/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      setCoachReply(result.answer || result.feedback);
      setXp((value) => value + (mode === "hint" ? 10 : 15));
    } catch {
      setCoachReply(
        mode === "hint"
          ? "Hint: identify the type of each value before choosing an operation."
          : "Review: keep the function pure, add one edge-case test, and name variables by intent."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#17202a]">
      <div className="mx-auto grid max-w-[1500px] gap-5 p-4 lg:grid-cols-[280px_minmax(0,1fr)_340px] lg:p-6">
        <aside className="space-y-4">
          <ProfileCard level={level} progress={levelProgress} xp={xp} coins={coins} />
          <section className="rounded-2xl border border-[#dfe4ee] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#68778d]">Skill Path</h2>
              <span className="rounded-full bg-[#eaf7ef] px-2 py-1 text-xs font-black text-[#257a42]">8 day streak</span>
            </div>
            <div className="space-y-3">
              {skillPath.map((node, index) => {
                const Icon = node.icon;
                const active = node.status === "active";
                return (
                  <button
                    key={node.title}
                    onClick={() => {
                      if (node.status !== "locked") {
                        setActiveTrack(tracks[Math.min(index, tracks.length - 1)]);
                        setView("mission");
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-[#2f80ed] bg-[#eef6ff]"
                        : node.status === "locked"
                          ? "border-[#e7ebf2] bg-[#f5f7fb] text-[#94a0b2]"
                          : "border-[#e7ebf2] bg-white hover:border-[#2f80ed]"
                    }`}
                  >
                    <span className={`grid h-10 w-10 place-items-center rounded-xl ${active ? "bg-[#2f80ed] text-white" : "bg-[#eef2f7]"}`}>
                      <Icon size={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-black">{node.title}</span>
                      <span className="text-xs text-[#68778d]">{node.status === "locked" ? "Unlock soon" : active ? "Current mission" : "Ready"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="min-w-0 space-y-5">
          <header className="rounded-3xl bg-[#101828] p-5 text-white shadow-xl lg:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#8ee6a3]">
                  <Sparkles size={16} /> Today&apos;s mission
                </p>
                <h1 className="mt-3 max-w-3xl text-3xl font-black md:text-5xl">Learn Python by clearing bite-sized missions.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#c8d1df]">
                  {activeTrack.title}: run code, get coaching, and earn progress without losing sight of real skill.
                </p>
              </div>
              <div className="grid min-w-64 grid-cols-3 gap-2">
                <MiniStat icon={<Flame size={18} />} label="Streak" value="8d" tone="red" />
                <MiniStat icon={<Trophy size={18} />} label="League" value="Silver" tone="blue" />
                <MiniStat icon={<ShieldCheck size={18} />} label="Accuracy" value="94%" tone="green" />
              </div>
            </div>
          </header>

          <nav className="grid gap-2 sm:grid-cols-3">
            <Segment active={view === "mission"} onClick={() => setView("mission")} icon={<Code2 size={18} />}>Mission</Segment>
            <Segment active={view === "coach"} onClick={() => setView("coach")} icon={<Brain size={18} />}>Coach</Segment>
            <Segment active={view === "league"} onClick={() => setView("league")} icon={<Trophy size={18} />}>League</Segment>
          </nav>

          {view === "mission" && (
            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Panel title="Code Mission" meta="+25 XP">
                <div className="mb-4 rounded-2xl bg-[#fff6df] p-4 text-sm leading-6 text-[#694b00]">
                  Build confidence with a small function. Run it, inspect the output, then ask the coach for feedback.
                </div>
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="min-h-80 w-full resize-y rounded-2xl border border-[#dfe4ee] bg-[#111827] p-4 font-mono text-sm text-[#e5ffe9] outline-none focus:border-[#2f80ed]"
                  spellCheck={false}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={runCode} disabled={busy}><span className="inline-flex items-center gap-2"><Play size={16} />{busy ? "Running..." : "Run Code"}</span></Button>
                  <Button variant="secondary" onClick={() => askCoach("review")} disabled={busy}>Review</Button>
                  <Button variant="secondary" onClick={() => setCode(starterCode)}>Reset</Button>
                </div>
              </Panel>

              <div className="space-y-5">
                <Panel title="Output" meta="Live">
                  <pre className="min-h-40 whitespace-pre-wrap rounded-2xl bg-[#101828] p-4 font-mono text-sm text-[#d9ffe4]">{output}</pre>
                </Panel>
                <Panel title="Reward Track" meta={`Level ${level}`}>
                  <div className="space-y-3">
                    {["Hint token", "Coin chest", "AI review pack"].map((reward, index) => (
                      <div key={reward} className="flex items-center gap-3 rounded-2xl border border-[#e7ebf2] bg-[#f8fafc] p-3">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${index === 0 ? "bg-[#eaf7ef] text-[#257a42]" : "bg-[#eef6ff] text-[#2f80ed]"}`}>
                          {index === 2 ? <Brain size={18} /> : <Star size={18} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-black">{reward}</div>
                          <div className="text-xs text-[#68778d]">{index === 0 ? "Unlocked" : "Next milestone"}</div>
                        </div>
                        <ChevronRight size={18} className="text-[#8b98aa]" />
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </section>
          )}

          {view === "coach" && (
            <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
              <Panel title="Ask Coach" meta="+10 XP">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="min-h-48 w-full resize-y rounded-2xl border border-[#dfe4ee] bg-white p-4 text-sm outline-none focus:border-[#2f80ed]"
                />
                <Button className="mt-4" onClick={() => askCoach("hint")} disabled={busy}>
                  <span className="inline-flex items-center gap-2"><Brain size={16} />{busy ? "Thinking..." : "Ask Coach"}</span>
                </Button>
              </Panel>
              <Panel title="Coach Response" meta="Guided">
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#46576d]">{coachReply}</p>
              </Panel>
            </section>
          )}

          {view === "league" && (
            <section className="grid gap-5 xl:grid-cols-2">
              <Panel title="Silver League" meta="Top 10 advance">
                {["Ada", "Grace", "Harshith", "Linus", "Maya"].map((name, index) => (
                  <div key={name} className={`flex items-center justify-between rounded-2xl px-4 py-3 ${name === "Harshith" ? "bg-[#eef6ff]" : ""}`}>
                    <span className="font-black">#{index + 1} {name}</span>
                    <span className="font-black text-[#2f80ed]">{4200 - index * 260} XP</span>
                  </div>
                ))}
              </Panel>
              <Panel title="Achievement Shelf" meta="4/200">
                <div className="grid gap-3 sm:grid-cols-2">
                  {["First Run", "Quiz Perfect", "Debug Calm", "API Builder"].map((badge, index) => (
                    <div key={badge} className="rounded-2xl border border-[#e7ebf2] bg-white p-4">
                      <div className={`mb-3 grid h-11 w-11 place-items-center rounded-xl ${index % 2 === 0 ? "bg-[#fff2df] text-[#b85f00]" : "bg-[#eaf7ef] text-[#257a42]"}`}>
                        <Trophy size={20} />
                      </div>
                      <div className="font-black">{badge}</div>
                      <div className="mt-1 text-xs text-[#68778d]">Unlocked achievement</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>
          )}
        </section>

        <aside className="space-y-5">
          <Panel title="Daily Quests" meta="Chest 75%">
            <div className="space-y-4">
              {dailyQuests.map((quest) => (
                <div key={quest.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold">{quest.label}</span>
                    <span className="font-black text-[#257a42]">{quest.reward}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#e7ebf2]">
                    <div className="h-2 rounded-full bg-[#2f80ed]" style={{ width: `${quest.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Active Track" meta={activeTrack.lessons + " lessons"}>
            <div className="rounded-2xl bg-[#f8fafc] p-4">
              <h3 className="text-xl font-black">{activeTrack.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#68778d]">A focused path with lessons, quizzes, code missions, projects, and coach feedback.</p>
              <Button className="mt-4 w-full" onClick={() => setView("mission")}>Continue</Button>
            </div>
          </Panel>

          <Panel title="Coin Shop" meta={`${coins} coins`}>
            <ShopItem title="Hint token" cost="40" icon={<Sparkles size={18} />} />
            <ShopItem title="Streak freeze" cost="120" icon={<ShieldCheck size={18} />} />
            <ShopItem title="Coach deep dive" cost="150" icon={<Brain size={18} />} />
          </Panel>
        </aside>
      </div>
    </main>
  );
}

function ProfileCard({ level, progress, xp, coins }: { level: number; progress: number; xp: number; coins: number }) {
  return (
    <section className="rounded-3xl bg-[#101828] p-5 text-white shadow-xl">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#8ee6a3] text-2xl font-black text-[#102015]">{level}</div>
        <div>
          <div className="text-sm text-[#c8d1df]">Current level</div>
          <div className="text-xl font-black">Python Explorer</div>
        </div>
      </div>
      <div className="mt-5 h-3 rounded-full bg-white/10">
        <div className="h-3 rounded-full bg-[#8ee6a3]" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MiniStat icon={<Star size={18} />} label="XP" value={xp} tone="green" />
        <MiniStat icon={<CircleDollarSign size={18} />} label="Coins" value={coins} tone="gold" />
      </div>
    </section>
  );
}

function MiniStat({ icon, label, value, tone }: { icon: ReactNode; label: string; value: string | number; tone: "red" | "blue" | "green" | "gold" }) {
  const color = {
    red: "bg-[#fff1f0] text-[#c02f2f]",
    blue: "bg-[#eef6ff] text-[#2f80ed]",
    green: "bg-[#eaf7ef] text-[#257a42]",
    gold: "bg-[#fff6df] text-[#9a6400]"
  }[tone];
  return (
    <div className={`rounded-2xl p-3 ${color}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-lg font-black">{value}</span>
      </div>
      <div className="mt-1 text-xs font-bold uppercase tracking-[0.12em] opacity-75">{label}</div>
    </div>
  );
}

function Segment({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition ${
        active ? "border-[#2f80ed] bg-[#2f80ed] text-white shadow-md" : "border-[#dfe4ee] bg-white text-[#46576d] hover:border-[#2f80ed]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Panel({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#dfe4ee] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#68778d]">{title}</h2>
        <span className="rounded-full bg-[#f1f4f9] px-3 py-1 text-xs font-black text-[#46576d]">{meta}</span>
      </div>
      {children}
    </section>
  );
}

function ShopItem({ title, cost, icon }: { title: string; cost: string; icon: ReactNode }) {
  return (
    <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#e7ebf2] p-3 first:mt-0">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f1f4f9] text-[#2f80ed]">{icon}</span>
        <span className="font-bold">{title}</span>
      </div>
      <span className="font-black text-[#9a6400]">{cost}</span>
    </div>
  );
}
