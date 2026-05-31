"use client";

import { ReactNode, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { tracks } from "@/lib/tracks";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const starterCode = `def greet(name):
    return f"Hello, {name}!"

print(greet("Python learner"))`;

const quests = [
  { title: "Complete one lesson", reward: "+50 XP", progress: 70 },
  { title: "Run a Python snippet", reward: "+25 XP", progress: 35 },
  { title: "Ask the AI tutor", reward: "+10 XP", progress: 10 }
];

const achievements = ["First Run", "Quiz Perfect", "Debug Calm", "API Builder"];

type View = "tracks" | "practice" | "tutor" | "league";

export default function HomePage() {
  const [view, setView] = useState<View>("tracks");
  const [activeTrack, setActiveTrack] = useState(tracks[0]);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run your first snippet to see output here.");
  const [question, setQuestion] = useState("Why does Python use indentation?");
  const [tutorReply, setTutorReply] = useState("Ask the tutor a question to get a guided explanation.");
  const [reviewReply, setReviewReply] = useState("Submit your code for review to see feedback.");
  const [xp, setXp] = useState(1285);
  const [coins, setCoins] = useState(420);
  const [streak, setStreak] = useState(8);
  const [busy, setBusy] = useState(false);

  const level = useMemo(() => Math.max(1, Math.floor(xp / 280)), [xp]);
  const levelProgress = useMemo(() => Math.min(100, Math.round(((xp % 280) / 280) * 100)), [xp]);

  async function runCode() {
    setBusy(true);
    setOutput("Running code...");
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
      setOutput("The local challenge worker is not available yet. UI rewards still update during the trial.");
      setXp((value) => value + 15);
    } finally {
      setBusy(false);
    }
  }

  async function askTutor() {
    setBusy(true);
    setTutorReply("Thinking...");
    try {
      const response = await fetch(`${API_URL}/ai/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context: activeTrack.title })
      });
      const result = await response.json();
      setTutorReply(result.answer);
      setXp((value) => value + 10);
    } catch {
      setTutorReply("Tutor service is unavailable. Try a tiny example, predict its output, then run it and compare.");
    } finally {
      setBusy(false);
    }
  }

  async function reviewCode() {
    setBusy(true);
    setReviewReply("Reviewing...");
    try {
      const response = await fetch(`${API_URL}/ai/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code })
      });
      const result = await response.json();
      setReviewReply(result.feedback);
      setCoins((value) => value + 8);
    } catch {
      setReviewReply("Reviewer is unavailable. Quick review: add type hints, test one edge case, and keep the function pure.");
    } finally {
      setBusy(false);
    }
  }

  function startTrack(track = activeTrack) {
    setActiveTrack(track);
    setView("practice");
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(135deg,#07111f_0%,#10243a_42%,#182611_100%)]" />
      <div className="mx-auto grid max-w-7xl gap-5 p-4 md:p-6 xl:grid-cols-[260px_1fr_310px]">
        <aside className="space-y-4">
          <BrandPanel level={level} progress={levelProgress} />
          <NavButton active={view === "tracks"} onClick={() => setView("tracks")}>Tracks</NavButton>
          <NavButton active={view === "practice"} onClick={() => setView("practice")}>Practice</NavButton>
          <NavButton active={view === "tutor"} onClick={() => setView("tutor")}>AI Tutor</NavButton>
          <NavButton active={view === "league"} onClick={() => setView("league")}>League</NavButton>
        </aside>

        <section className="min-w-0 space-y-5">
          <header className="rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#7cf29c]">Python quest academy</p>
            <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="max-w-3xl text-4xl font-black md:text-5xl">Level up Python through missions, streaks, and real code.</h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  {activeTrack.title} is active. Complete a lesson, run code, or ask the tutor to move the reward track.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => startTrack()}>Start Mission</Button>
                <Button variant="secondary" onClick={() => setView("league")}>League Board</Button>
              </div>
            </div>
          </header>

          {view === "tracks" && (
            <section className="grid gap-4 md:grid-cols-2">
              {tracks.map((track, index) => (
                <button
                  key={track.title}
                  onClick={() => startTrack(track)}
                  className="group rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-5 text-left shadow-xl transition hover:-translate-y-1 hover:border-[#7cf29c]/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffd166]">World {index + 1}</p>
                      <h2 className="mt-2 text-2xl font-black">{track.title}</h2>
                      <p className="mt-2 text-sm text-slate-300">{track.lessons} lessons with quizzes, code missions, and AI help.</p>
                    </div>
                    <div className="rounded-xl bg-[#7cf29c] px-3 py-2 text-sm font-black text-[#07111f]">+{40 + index * 5} XP</div>
                  </div>
                  <div className="mt-5 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-[#65d9ff]" style={{ width: `${Math.min(92, 20 + index * 6)}%` }} />
                  </div>
                </button>
              ))}
            </section>
          )}

          {view === "practice" && (
            <section className="grid gap-4 lg:grid-cols-[1fr_0.85fr]">
              <GamePanel title={`${activeTrack.title} Code Mission`} reward="+25 XP / +5 coins">
                <textarea
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  className="min-h-80 w-full resize-y rounded-xl border border-white/10 bg-[#06101c] p-4 font-mono text-sm text-[#d9ffe4] outline-none focus:border-[#7cf29c]"
                  spellCheck={false}
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={runCode} disabled={busy}>{busy ? "Running..." : "Run Code"}</Button>
                  <Button variant="secondary" onClick={reviewCode} disabled={busy}>Review Code</Button>
                  <Button variant="secondary" onClick={() => setCode(starterCode)}>Reset</Button>
                </div>
              </GamePanel>
              <div className="grid gap-4">
                <GamePanel title="Mission Output" reward="Instant feedback">
                  <pre className="min-h-36 whitespace-pre-wrap rounded-xl bg-[#06101c] p-4 font-mono text-sm text-[#d9ffe4]">{output}</pre>
                </GamePanel>
                <GamePanel title="AI Review" reward="+8 coins">
                  <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{reviewReply}</p>
                </GamePanel>
              </div>
            </section>
          )}

          {view === "tutor" && (
            <section className="grid gap-4 lg:grid-cols-[0.85fr_1fr]">
              <GamePanel title="Tutor Prompt" reward="+10 XP">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  className="min-h-44 w-full resize-y rounded-xl border border-white/10 bg-[#06101c] p-4 text-sm text-[#d9ffe4] outline-none focus:border-[#7cf29c]"
                />
                <Button className="mt-4" onClick={askTutor} disabled={busy}>{busy ? "Thinking..." : "Ask Tutor"}</Button>
              </GamePanel>
              <GamePanel title="Tutor Response" reward="Guided hint">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{tutorReply}</p>
              </GamePanel>
            </section>
          )}

          {view === "league" && (
            <section className="grid gap-4 lg:grid-cols-2">
              <GamePanel title="Silver League" reward="Top 10 advance">
                {["Ada", "Grace", "Harshith", "Linus", "Maya"].map((name, index) => (
                  <div key={name} className="flex items-center justify-between border-b border-white/10 py-3 last:border-b-0">
                    <span className="font-bold">#{index + 1} {name}</span>
                    <span className={name === "Harshith" ? "text-[#7cf29c]" : "text-[#65d9ff]"}>{4200 - index * 260} XP</span>
                  </div>
                ))}
              </GamePanel>
              <GamePanel title="Achievement Shelf" reward="200 total">
                <div className="grid gap-3 sm:grid-cols-2">
                  {achievements.map((badge) => (
                    <div key={badge} className="rounded-xl border border-white/10 bg-[#06101c] p-4">
                      <div className="font-black">{badge}</div>
                      <div className="mt-1 text-xs text-slate-400">Unlocked reward badge</div>
                    </div>
                  ))}
                </div>
              </GamePanel>
            </section>
          )}
        </section>

        <aside className="space-y-4">
          <StatsCard xp={xp} coins={coins} streak={streak} />
          <GamePanel title="Daily Quests" reward="Chest at 100%">
            <div className="space-y-4">
              {quests.map((quest, index) => (
                <div key={quest.title}>
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">{quest.title}</span>
                    <span className={index === 1 ? "text-[#7cf29c]" : "text-[#ffd166]"}>{quest.reward}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-[#ff6b6b]" style={{ width: `${quest.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GamePanel>
          <GamePanel title="Next Unlock" reward="Level track">
            <div className="rounded-xl bg-[#06101c] p-4">
              <p className="text-sm text-slate-300">Level {level + 1}: AI Code Review Deep Dive</p>
              <div className="mt-3 h-3 rounded-full bg-white/10">
                <div className="h-3 rounded-full bg-[#7cf29c]" style={{ width: `${levelProgress}%` }} />
              </div>
            </div>
          </GamePanel>
        </aside>
      </div>
    </main>
  );
}

function BrandPanel({ level, progress }: { level: number; progress: number }) {
  return (
    <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur">
      <div className="text-sm font-bold uppercase tracking-[0.18em] text-[#65d9ff]">Learner profile</div>
      <div className="mt-3 text-4xl font-black">Level {level}</div>
      <div className="mt-4 h-3 rounded-full bg-white/10">
        <div className="h-3 rounded-full bg-[#7cf29c]" style={{ width: `${progress}%` }} />
      </div>
      <p className="mt-3 text-sm text-slate-300">{progress}% to the next unlock</p>
    </section>
  );
}

function StatsCard({ xp, coins, streak }: { xp: number; coins: number; streak: number }) {
  return (
    <section className="grid grid-cols-3 gap-2 rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-3 shadow-2xl backdrop-blur">
      <Stat label="XP" value={xp} color="text-[#7cf29c]" />
      <Stat label="Coins" value={coins} color="text-[#ffd166]" />
      <Stat label="Streak" value={`${streak}d`} color="text-[#ff6b6b]" />
    </section>
  );
}

function Stat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl bg-[#06101c] p-3 text-center">
      <div className={`text-xl font-black ${color}`}>{value}</div>
      <div className="mt-1 text-[0.68rem] uppercase tracking-[0.14em] text-slate-400">{label}</div>
    </div>
  );
}

function NavButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-black transition ${
        active ? "border-[#7cf29c] bg-[#7cf29c] text-[#07111f]" : "border-white/10 bg-white/[0.08] text-slate-200 hover:border-[#65d9ff]"
      }`}
    >
      {children}
    </button>
  );
}

function GamePanel({ title, reward, children }: { title: string; reward: string; children: ReactNode }) {
  return (
    <section className="rounded-[1.25rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl backdrop-blur">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-black uppercase tracking-[0.16em] text-[#65d9ff]">{title}</h2>
        <span className="rounded-full bg-[#ffd166] px-3 py-1 text-xs font-black text-[#07111f]">{reward}</span>
      </div>
      {children}
    </section>
  );
}
