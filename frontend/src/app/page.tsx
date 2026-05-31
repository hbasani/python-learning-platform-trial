"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { TrackCard } from "@/components/learning/track-card";
import { tracks } from "@/lib/tracks";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const starterCode = `def greet(name):
    return f"Hello, {name}!"

print(greet("Python learner"))`;

type View = "tracks" | "practice" | "tutor" | "leaderboard";

export default function HomePage() {
  const [view, setView] = useState<View>("tracks");
  const [activeTrack, setActiveTrack] = useState(tracks[0]);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run your first snippet to see output here.");
  const [question, setQuestion] = useState("Why does Python use indentation?");
  const [tutorReply, setTutorReply] = useState("Ask the tutor a question to get a guided explanation.");
  const [reviewReply, setReviewReply] = useState("Submit your code for review to see feedback.");
  const [xp, setXp] = useState(1200);
  const [coins, setCoins] = useState(350);
  const [busy, setBusy] = useState(false);

  const levelProgress = useMemo(() => Math.min(92, Math.round((xp / 1800) * 100)), [xp]);

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
      setOutput("Backend challenge runner is unavailable. The rest of the trial remains interactive.");
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
    <main className="min-h-screen overflow-hidden bg-[#0b1020] text-slate-50">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#1e293b,#0b1020_55%)]" />
      <div className="mx-auto max-w-6xl p-6">
        <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="mb-3 text-cyan-300">Production-ready AI learning platform</p>
            <h1 className="max-w-4xl text-4xl font-bold md:text-5xl">Master Python with Projects, Challenges, and AI Tutoring</h1>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button onClick={() => startTrack()}>Start Learning</Button>
              <Button variant="secondary" onClick={() => setView("leaderboard")}>View Leaderboard</Button>
              <Button variant="secondary" onClick={() => setView("tutor")}>Ask AI Tutor</Button>
            </div>
          </div>
          <section className="rounded-2xl border border-slate-700 bg-slate-900/55 p-5 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              <Metric label="XP" value={xp} />
              <Metric label="Coins" value={coins} />
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-sm text-slate-300">
                <span>{activeTrack.title}</span>
                <span>{levelProgress}%</span>
              </div>
              <div className="mt-2 h-3 rounded-full bg-slate-800">
                <div className="h-3 rounded-full bg-cyan-400" style={{ width: `${levelProgress}%` }} />
              </div>
            </div>
          </section>
        </header>

        <nav className="mb-6 flex flex-wrap gap-2">
          <Tab active={view === "tracks"} onClick={() => setView("tracks")}>Tracks</Tab>
          <Tab active={view === "practice"} onClick={() => setView("practice")}>Practice</Tab>
          <Tab active={view === "tutor"} onClick={() => setView("tutor")}>AI Tutor</Tab>
          <Tab active={view === "leaderboard"} onClick={() => setView("leaderboard")}>Leaderboard</Tab>
        </nav>

        {view === "tracks" && (
          <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <button
                key={track.title}
                onClick={() => startTrack(track)}
                className="text-left transition hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                <TrackCard title={track.title} lessons={track.lessons} />
              </button>
            ))}
          </section>
        )}

        {view === "practice" && (
          <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <Panel title={`${activeTrack.title} Challenge`}>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="min-h-80 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-sm text-cyan-50 outline-none focus:border-cyan-300"
                spellCheck={false}
              />
              <div className="mt-4 flex flex-wrap gap-3">
                <Button onClick={runCode} disabled={busy}>{busy ? "Working..." : "Run Code"}</Button>
                <Button variant="secondary" onClick={reviewCode} disabled={busy}>Review Code</Button>
                <Button variant="secondary" onClick={() => setCode(starterCode)}>Reset</Button>
              </div>
            </Panel>
            <div className="grid gap-4">
              <Panel title="Output">
                <pre className="min-h-36 whitespace-pre-wrap rounded-xl bg-slate-950 p-4 font-mono text-sm text-cyan-50">{output}</pre>
              </Panel>
              <Panel title="AI Review">
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{reviewReply}</p>
              </Panel>
            </div>
          </section>
        )}

        {view === "tutor" && (
          <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Ask A Question">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="min-h-44 w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 text-sm text-cyan-50 outline-none focus:border-cyan-300"
              />
              <Button className="mt-4" onClick={askTutor} disabled={busy}>{busy ? "Thinking..." : "Ask Tutor"}</Button>
            </Panel>
            <Panel title="Tutor Response">
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-300">{tutorReply}</p>
            </Panel>
          </section>
        )}

        {view === "leaderboard" && (
          <section className="grid gap-4 lg:grid-cols-2">
            <Panel title="Leaderboard">
              {["Ada", "Grace", "Harshith", "Linus"].map((name, index) => (
                <div key={name} className="flex items-center justify-between border-b border-slate-800 py-3 last:border-b-0">
                  <span className="font-semibold">#{index + 1} {name}</span>
                  <span className="text-cyan-300">{4200 - index * 260} XP</span>
                </div>
              ))}
            </Panel>
            <Panel title="Achievements">
              <div className="grid gap-3 sm:grid-cols-2">
                {["First Run", "Debug Streak", "API Builder", "AI Apprentice"].map((badge) => (
                  <div key={badge} className="rounded-xl border border-slate-700 bg-slate-950/50 p-4 font-semibold">{badge}</div>
                ))}
              </div>
            </Panel>
          </section>
        )}
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-950/50 p-4">
      <div className="text-2xl font-bold text-cyan-300">{value}</div>
      <div className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
        active ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-slate-700 bg-slate-900/50 text-slate-200 hover:border-cyan-300"
      }`}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/55 p-5 shadow-2xl">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-[0.16em] text-cyan-300">{title}</h2>
      {children}
    </section>
  );
}
