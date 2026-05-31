"use client";

import { ReactNode, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Check,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Flame,
  Lock,
  Play,
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

const onboardingSteps = [
  { title: "Place into a track", detail: "Data Types", status: "done" },
  { title: "Complete first mission", detail: "Run one snippet", status: "active" },
  { title: "Unlock coach review", detail: "2 minutes left", status: "next" }
];

const dailyPlan = [
  { label: "Read: Data types in plain English", duration: "4 min", done: true },
  { label: "Practice: Convert a string score", duration: "6 min", done: false },
  { label: "Review: Ask coach for one improvement", duration: "3 min", done: false }
];

const pathNodes = [
  { title: "Basics", icon: BookOpen, state: "complete" },
  { title: "Variables", icon: Check, state: "complete" },
  { title: "Data Types", icon: Star, state: "current" },
  { title: "Conditions", icon: Target, state: "ready" },
  { title: "Loops", icon: Lock, state: "locked" }
];

type View = "mission" | "coach" | "progress";

export default function HomePage() {
  const [view, setView] = useState<View>("mission");
  const [activeTrack, setActiveTrack] = useState(tracks[2]);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run your solution to see output here.");
  const [question, setQuestion] = useState("Explain Python data types using a grocery store analogy.");
  const [coachReply, setCoachReply] = useState("Ask for a hint, a plain-English explanation, or code review.");
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
      setOutput("The local runner is not connected yet. Your mission progress still advanced for this trial.");
      setXp((value) => value + 15);
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
      setCoachReply(result.answer || result.feedback);
      setXp((value) => value + (mode === "hint" ? 10 : 15));
    } catch {
      setCoachReply(
        mode === "hint"
          ? "Hint: name the type of each value before choosing the operation. Text, whole numbers, decimals, and true/false values behave differently."
          : "Review: keep the function pure, add one edge-case test, and use names that explain intent."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen text-[#111827]">
      <div className="mx-auto grid max-w-[1440px] gap-5 p-4 md:p-6 xl:grid-cols-[272px_minmax(0,1fr)_324px]">
        <aside className="space-y-5">
          <BrandCard level={level} progress={levelProgress} xp={xp} coins={coins} />
          <Panel title="Onboarding" meta="3 steps">
            <div className="space-y-3">
              {onboardingSteps.map((step, index) => (
                <div key={step.title} className="flex gap-3">
                  <div className={`mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    step.status === "done" ? "bg-[#111827] text-white" : step.status === "active" ? "bg-[#2563eb] text-white animate-soft-pulse" : "bg-[#eef2f7] text-[#667085]"
                  }`}>
                    {step.status === "done" ? <Check size={14} /> : index + 1}
                  </div>
                  <div>
                    <div className="font-semibold">{step.title}</div>
                    <div className="text-sm text-[#667085]">{step.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Path" meta="Level 4">
            <div className="space-y-2">
              {pathNodes.map((node) => {
                const Icon = node.icon;
                return (
                  <button
                    key={node.title}
                    className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition ${
                      node.state === "current"
                        ? "border-[#2563eb] bg-[#eff6ff]"
                        : node.state === "locked"
                          ? "border-[#e4e7ec] bg-[#f8fafc] text-[#98a2b3]"
                          : "border-transparent bg-white hover:border-[#e4e7ec] hover:bg-[#f9fafb]"
                    }`}
                    onClick={() => {
                      if (node.state !== "locked") setView("mission");
                    }}
                  >
                    <span className={`grid h-9 w-9 place-items-center rounded-xl ${node.state === "current" ? "bg-[#2563eb] text-white" : "bg-[#f2f4f7] text-[#475467]"}`}>
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{node.title}</span>
                      <span className="text-xs text-[#667085]">{node.state === "locked" ? "Locked" : node.state === "current" ? "In progress" : "Complete"}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Panel>
        </aside>

        <section className="min-w-0 space-y-5">
          <header className="animate-rise-in overflow-hidden rounded-[28px] border border-[#e4e7ec] bg-white shadow-[var(--shadow-panel)]">
            <div className="grid gap-0 lg:grid-cols-[1fr_300px]">
              <div className="p-6 md:p-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#dbeafe] bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#1d4ed8]">
                  <Sparkles size={14} /> Today&apos;s guided mission
                </div>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-normal text-[#111827] md:text-6xl">
                  Build Python confidence one clear step at a time.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-7 text-[#667085]">
                  Your next task is small, measurable, and tied to a real skill: {activeTrack.title.toLowerCase()}.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => setView("mission")}>
                    <span className="inline-flex items-center gap-2"><Play size={16} /> Continue mission</span>
                  </Button>
                  <Button variant="secondary" onClick={() => setView("coach")}>
                    Ask coach
                  </Button>
                </div>
              </div>
              <div className="border-t border-[#e4e7ec] bg-[#f9fafb] p-6 lg:border-l lg:border-t-0">
                <div className="text-sm font-semibold text-[#667085]">This session</div>
                <div className="mt-5 grid gap-3">
                  <SessionMetric icon={<Flame size={18} />} label="Streak" value="8 days" />
                  <SessionMetric icon={<Trophy size={18} />} label="League" value="Silver" />
                  <SessionMetric icon={<Target size={18} />} label="Accuracy" value="94%" />
                </div>
              </div>
            </div>
          </header>

          <nav className="grid gap-2 sm:grid-cols-3">
            <Segment active={view === "mission"} onClick={() => setView("mission")} icon={<Code2 size={17} />}>Mission</Segment>
            <Segment active={view === "coach"} onClick={() => setView("coach")} icon={<Brain size={17} />}>Coach</Segment>
            <Segment active={view === "progress"} onClick={() => setView("progress")} icon={<Trophy size={17} />}>Progress</Segment>
          </nav>

          {view === "mission" && (
            <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
              <Panel title="Code mission" meta="+25 XP">
                <div className="mb-4 flex items-start gap-3 rounded-2xl border border-[#e4e7ec] bg-[#f9fafb] p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-[#2563eb] shadow-sm">
                    <Code2 size={17} />
                  </div>
                  <div>
                    <div className="font-semibold">Create and run a tiny function.</div>
                    <p className="mt-1 text-sm leading-6 text-[#667085]">A short success loop: write, run, inspect output, then request a review.</p>
                  </div>
                </div>
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="min-h-80 w-full resize-y rounded-2xl border border-[#1f2937] bg-[#0b1220] p-4 font-mono text-sm leading-6 text-[#e5ffe9] outline-none transition focus:border-[#60a5fa] focus:ring-4 focus:ring-[#dbeafe]"
                  spellCheck={false}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={runCode} disabled={busy}>
                    <span className="inline-flex items-center gap-2"><Play size={16} />{busy ? "Running..." : "Run code"}</span>
                  </Button>
                  <Button variant="secondary" onClick={() => askCoach("review")} disabled={busy}>Review</Button>
                  <Button variant="secondary" onClick={() => setCode(starterCode)}>Reset</Button>
                </div>
              </Panel>
              <div className="space-y-5">
                <Panel title="Output" meta="Live">
                  <pre className="min-h-44 whitespace-pre-wrap rounded-2xl bg-[#0b1220] p-4 font-mono text-sm leading-6 text-[#e5ffe9]">{output}</pre>
                </Panel>
                <Panel title="Daily plan" meta="13 min">
                  <div className="space-y-3">
                    {dailyPlan.map((item) => (
                      <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-[#e4e7ec] p-3">
                        <span className={`grid h-8 w-8 place-items-center rounded-full ${item.done ? "bg-[#111827] text-white" : "bg-[#f2f4f7] text-[#667085]"}`}>
                          {item.done ? <Check size={15} /> : <ArrowRight size={15} />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{item.label}</div>
                          <div className="text-xs text-[#667085]">{item.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            </section>
          )}

          {view === "coach" && (
            <section className="grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
              <Panel title="Ask coach" meta="+10 XP">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="min-h-52 w-full resize-y rounded-2xl border border-[#e4e7ec] bg-white p-4 text-sm leading-6 outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#dbeafe]"
                />
                <Button className="mt-4" onClick={() => askCoach("hint")} disabled={busy}>
                  <span className="inline-flex items-center gap-2"><Brain size={16} />{busy ? "Thinking..." : "Ask coach"}</span>
                </Button>
              </Panel>
              <Panel title="Coach response" meta="Guided">
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#475467]">{coachReply}</p>
              </Panel>
            </section>
          )}

          {view === "progress" && (
            <section className="grid gap-5 xl:grid-cols-2">
              <Panel title="League standing" meta="Top 10 advance">
                {["Ada", "Grace", "Harshith", "Linus", "Maya"].map((name, index) => (
                  <div key={name} className={`flex items-center justify-between rounded-2xl px-4 py-3 ${name === "Harshith" ? "bg-[#eff6ff]" : ""}`}>
                    <span className="font-semibold">#{index + 1} {name}</span>
                    <span className="font-semibold text-[#2563eb]">{4200 - index * 260} XP</span>
                  </div>
                ))}
              </Panel>
              <Panel title="Recent unlocks" meta="4/200">
                <div className="grid gap-3 sm:grid-cols-2">
                  {["First Run", "Quiz Perfect", "Debug Calm", "API Builder"].map((badge) => (
                    <div key={badge} className="rounded-2xl border border-[#e4e7ec] p-4">
                      <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-[#f2f4f7] text-[#111827]">
                        <Trophy size={18} />
                      </div>
                      <div className="font-semibold">{badge}</div>
                      <div className="mt-1 text-xs text-[#667085]">Unlocked</div>
                    </div>
                  ))}
                </div>
              </Panel>
            </section>
          )}
        </section>

        <aside className="space-y-5">
          <Panel title="Quest progress" meta="75%">
            <div className="space-y-4">
              {dailyPlan.map((item, index) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">{item.label.split(":")[0]}</span>
                    <span className="text-[#667085]">{index === 0 ? "Done" : "Open"}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#eef2f7]">
                    <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: `${index === 0 ? 100 : index === 1 ? 46 : 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Active track" meta={`${activeTrack.lessons} lessons`}>
            <div className="rounded-2xl bg-[#f9fafb] p-4">
              <h3 className="text-xl font-semibold">{activeTrack.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#667085]">Lessons, quizzes, code missions, and coach feedback in one guided path.</p>
              <Button className="mt-4 w-full" onClick={() => setView("mission")}>Continue</Button>
            </div>
          </Panel>

          <Panel title="Reward shop" meta={`${coins} coins`}>
            <ShopItem title="Hint token" cost="40" icon={<Sparkles size={17} />} />
            <ShopItem title="Streak freeze" cost="120" icon={<Flame size={17} />} />
            <ShopItem title="Coach deep dive" cost="150" icon={<Brain size={17} />} />
          </Panel>
        </aside>
      </div>
    </main>
  );
}

function BrandCard({ level, progress, xp, coins }: { level: number; progress: number; xp: number; coins: number }) {
  return (
    <section className="rounded-[var(--radius-panel)] border border-[#e4e7ec] bg-white p-5 shadow-[var(--shadow-panel)]">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#111827] text-lg font-semibold text-white">{level}</div>
        <div>
          <div className="text-sm text-[#667085]">Current level</div>
          <div className="font-semibold">Python Explorer</div>
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-[#eef2f7]">
        <div className="h-2 rounded-full bg-[#2563eb]" style={{ width: `${progress}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <CompactStat icon={<Star size={16} />} label="XP" value={xp} />
        <CompactStat icon={<CircleDollarSign size={16} />} label="Coins" value={coins} />
      </div>
    </section>
  );
}

function CompactStat({ icon, label, value }: { icon: ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-[#f9fafb] p-3">
      <div className="flex items-center gap-2 text-[#111827]">
        {icon}
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-1 text-xs text-[#667085]">{label}</div>
    </div>
  );
}

function SessionMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-[#111827]">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{value}</span>
      </div>
      <div className="mt-1 text-xs text-[#667085]">{label}</div>
    </div>
  );
}

function Segment({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: ReactNode; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
        active ? "border-[#111827] bg-[#111827] text-white shadow-sm" : "border-[#e4e7ec] bg-white text-[#475467] hover:bg-[#f9fafb]"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Panel({ title, meta, children }: { title: string; meta: string; children: ReactNode }) {
  return (
    <section className="rounded-[var(--radius-panel)] border border-[#e4e7ec] bg-white p-5 shadow-[var(--shadow-panel)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-[#475467]">{title}</h2>
        <span className="rounded-full bg-[#f2f4f7] px-3 py-1 text-xs font-semibold text-[#667085]">{meta}</span>
      </div>
      {children}
    </section>
  );
}

function ShopItem({ title, cost, icon }: { title: string; cost: string; icon: ReactNode }) {
  return (
    <div className="mt-3 flex items-center justify-between rounded-2xl border border-[#e4e7ec] p-3 first:mt-0">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f2f4f7] text-[#475467]">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <span className="font-semibold text-[#111827]">{cost}</span>
    </div>
  );
}
