import { describe, it, expect } from "vitest";
import { embed, EMBEDDING_DIMENSIONS } from "./embed.ts";

// These tests load the embedding model, so they are slower than the rest of the suite.
// They assert relationships between vectors, never exact numbers: a different model
// would change every number while keeping the behaviour we actually depend on.
const dotProduct = (a: number[], b: number[]) => a.reduce((sum, value, i) => sum + value * b[i], 0);

describe("embed", () => {
  it("returns no vectors for no input", async () => {
    expect(await embed([])).toEqual([]);
  });

  it("returns one vector per text, each of the expected dimension", async () => {
    const vectors = await embed(["first text", "second text", "third text"]);

    expect(vectors).toHaveLength(3);
    expect(vectors.every((vector) => vector.length === EMBEDDING_DIMENSIONS)).toBe(true);
  });

  it("returns normalised vectors, so cosine similarity is a dot product", async () => {
    const [vector] = await embed(["Preheat the oven before baking"]);

    expect(Math.sqrt(dotProduct(vector, vector))).toBeCloseTo(1, 5);
  });

  it("places texts with similar meaning closer than unrelated ones", async () => {
    const [oven, sameMeaning, unrelated] = await embed([
      "Preheat the oven to 200 degrees before baking",
      "Heat the oven up before you start cooking",
      "Install the latest graphics card driver",
    ]);

    // Wording barely overlaps, so this only passes if meaning is what drives the vectors.
    expect(dotProduct(oven, sameMeaning)).toBeGreaterThan(dotProduct(oven, unrelated));
  });

  it("gives the same vector for the same text", async () => {
    const [first] = await embed(["Clean the filter every month"]);
    const [second] = await embed(["Clean the filter every month"]);

    expect(first).toEqual(second);
  });
});
