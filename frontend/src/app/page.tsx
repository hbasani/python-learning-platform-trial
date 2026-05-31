"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { tracks } from "@/lib/tracks";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

const starterCode = `def greet(name):
    return f"Hello, {name}!"

print(greet("Python learner"))`;

type View = "learn" | "practice" | "tutor" | "leaderboard";

export default function HomePage() {
  const [view, setView] = useState<View>("learn");
  const [activeTrack, setActiveTrack] = useState(tracks[0]);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("Run your first snippet to see output here.");
  const [question, setQuestion] = useState("Why does Python use indentation?");
  const [tutorReply, setTutorReply] = useState("Ask the tutor a question to get a guided explanation.");
  const [reviewReply, setReviewReply] = useState("Submit your code for review to see feedback.");
  const [xp, setXp] = useState(1200);
  const [coins, setCoins] = useState(350);
  const [streak, setStreak] = useState(7);
  const [busy, setBusy] = useState(false);

  const progress = useMemo(() => Math.min(92, Math.round((xp / 1800) * 100)), [xp]);

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
      setOutput("Backend challenge runner is unavailable. The demo UI is still active.");
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
      setTutorReply("Tutor service is unavailable, but a good next step is to test one tiny example and inspect each line.");
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
      setStreak((value) => Math.max(value, 8));
    } catch {
      setReviewReply("Reviewer is unavailable. Quick local review: add type hints, tests, and one edge-case check.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f3ea] text-[#17201a]">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 md:p-6">
        <header className="flex flex-col gap-4 border-b border-[#d9d0bf] pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#60735b]">Python learning trial</p>
            <h1 className="mt-2 max-w-3xl text-3xl font-black md:text-5xl">Interactive Python academy workspace</h1>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Metric label="XP" value={xp} />
            <Metric label="Coins" value={coins} />
            <Metric label="Streak" value={`${streak}d`} />
          </div>
        </header>

        <nav className="flex flex-wrap gap-2">
          <Tab active={view === "learn"} onClick={() => setView("learn")}>Learn</Tab>
          <Tab active={view === "practice"} onClick={() => setView("practice")}>Practice</Tab>
          <Tab active={view === "tutor"} onClick={() => setView("tutor")}>AI Tutor</Tab>
          <Tab active={view === "leaderboard"} onClick={() => setView("leaderboard")}>Leaderboard</Tab>
        </nav>

        {view === "learn" && (
          <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-3 md:grid-cols-2">
              {tracks.map((track) => (
                <button
                  key={track.title}
                  onClick={() => {
                    setActiveTrack(track);
                    setView("practice");
                  }}
                  className="rounded-lg border border-[#d8cfbf] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#658463]"
                >
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-[#60735b]">{track.lessons} lessons</span>
                  <h2 className="mt-2 text-xl font-bold">{track.title}</h2>
                  <p className="mt-2 text-sm text-[#5b6259]">Open lessons, exercises, AI hints, quizzes, and project checkpoints.</p>
                </button>
              ))}
            </div>
            <Panel title="Current path">
              <h2 className="text-2xl font-black">{activeTrack.title}</h2>
              <div className="mt-4 h-3 rounded-full bg-[#e4dac7]">
                <div className="h-3 rounded-full bg-[#2f7d57]" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-sm text-[#5b6259]">{progress}% toward your next level. Complete a code run or tutor session to earn more XP.</p>
              <Button className="mt-5" onClick={() => setView("practice")}>Continue Track</Button>
            </Panel>
          </section>
        )}

        {view === "practice" && (
          <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
            <Panel title={`${activeTrack.title} challenge`}>
              <textarea
                value={code}
                onChange={(event) => setCode(event.target.value)}
                className="min-h-72 w-full resize-y rounded-lg border border-[#cfc4b2] bg-[#101612] p-4 font-mono text-sm text-[#d9f5df] outline-none focus:border-[#2f7d57]"
                spellCheck={false}
              />
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={runCode} disabled={busy}>{busy ? "Working..." : "Run Code"}</Button>
                <Button variant="secondary" onClick={reviewCode} disabled={busy}>Review Code</Button>
                <Button variant="secondary" onClick={() => setCode(starterCode)}>Reset</Button>
              </div>
            </Panel>
            <div className="grid gap-5">
              <Panel title="Output">
                <pre className="min-h-32 whitespace-pre-wrap rounded-lg bg-[#182018] p-4 font-mono text-sm text-[#dff5df]">{output}</pre>
              </Panel>
              <Panel title="AI review">
                <p className="whitespace-pre-wrap text-sm leading-6 text-[#3f493d]">{reviewReply}</p>
              </Panel>
            </div>
          </section>
        )}

        {view === "tutor" && (
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Ask a Python question">
              <textarea
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                className="min-h-40 w-full resize-y rounded-lg border border-[#cfc4b2] bg-white p-4 outline-none focus:border-[#2f7d57]"
              />
              <Button className="mt-4" onClick={askTutor} disabled={busy}>{busy ? "Thinking..." : "Ask Tutor"}</Button>
            </Panel>
            <Panel title="Tutor response">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#3f493d]">{tutorReply}</p>
            </Panel>
          </section>
        )}

        {view === "leaderboard" && (
          <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
            <Panel title="Leaderboard">
              {["Ada", "Grace", "Harshith", "Linus"].map((name, index) => (
                <div key={name} className="flex items-center justify-between border-b border-[#e5dccd] py-3 last:border-b-0">
                  <span className="font-bold">#{index + 1} {name}</span>
                  <span>{4200 - index * 260} XP</span>
                </div>
              ))}
            </Panel>
            <Panel title="Achievements">
              <div className="grid gap-3 sm:grid-cols-2">
                {["First Run", "Debug Streak", "API Builder", "AI Apprentice"].map((badge) => (
                  <div key={badge} className="rounded-lg border border-[#d8cfbf] bg-white p-4 font-bold">{badge}</div>
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
    <div className="rounded-lg border border-[#d8cfbf] bg-white px-4 py-3">
      <div className="text-lg font-black">{value}</div>
      <div className="text-xs uppercase tracking-[0.14em] text-[#60735b]">{label}</div>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-4 py-2 text-sm font-bold transition ${
        active ? "border-[#2f7d57] bg-[#2f7d57] text-white" : "border-[#d8cfbf] bg-white text-[#273328] hover:border-[#658463]"
      }`}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-[#d8cfbf] bg-[#fffdf8] p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-black uppercase tracking-[0.14em] text-[#60735b]">{title}</h2>
      {children}
    </section>
  );
}
