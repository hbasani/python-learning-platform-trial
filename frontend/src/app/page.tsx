import { TrackCard } from "@/components/learning/track-card";
import { Button } from "@/components/ui/button";

const tracks = [
  { title: "Beginner Python", lessons: 35 },
  { title: "Intermediate Python", lessons: 42 },
  { title: "Advanced Python", lessons: 46 },
  { title: "Data Structures", lessons: 30 },
  { title: "Algorithms", lessons: 28 },
  { title: "OOP", lessons: 21 },
  { title: "API Development", lessons: 26 },
  { title: "Testing", lessons: 20 },
  { title: "Automation", lessons: 24 },
  { title: "Data Science", lessons: 39 },
  { title: "AI Engineering", lessons: 37 }
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-10">
        <p className="mb-3 text-cyan-300">Production-ready AI learning platform</p>
        <h1 className="text-4xl font-bold">Master Python with Projects, Challenges, and AI Tutoring</h1>
        <div className="mt-5 flex gap-3">
          <Button>Start Learning</Button>
          <Button variant="secondary">View Leaderboard</Button>
        </div>
      </header>
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <TrackCard key={track.title} title={track.title} lessons={track.lessons} />
        ))}
      </section>
    </main>
  );
}

