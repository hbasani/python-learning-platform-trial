import { describe, expect, it } from "vitest";

import { tracks } from "./tracks";

describe("tracks", () => {
  it("includes every core learning track", () => {
    expect(tracks.map((track) => track.title)).toEqual([
      "Beginner Python",
      "Intermediate Python",
      "Advanced Python",
      "Data Structures",
      "Algorithms",
      "OOP",
      "API Development",
      "Testing",
      "Automation",
      "Data Science",
      "AI Engineering"
    ]);
  });

  it("defines positive lesson counts", () => {
    expect(tracks.every((track) => track.lessons > 0)).toBe(true);
  });
});
