import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  games: defineTable({
    status: v.union(v.literal("waiting"), v.literal("active"), v.literal("finished")),
    totalRounds: v.number(),
    roundDurationMs: v.number(),
    currentRoundIndex: v.number(),
    finishedAt: v.optional(v.number()),
    players: v.array(v.object({
      playerId: v.string(),
      displayName: v.string(),
    })),
    roundHistory: v.array(v.object({
      roundIndex: v.number(),
      questionId: v.id("questions"),
      playerBets: v.record(v.string(), v.array(v.number())),
      winnings: v.record(v.string(), v.number()),
      correctChoiceIndex: v.number(),
      revealedAt: v.number(),
    })),
  }).index("by_status", ["status"]),

  currentRounds: defineTable({
    gameId: v.id("games"),
    questionId: v.id("questions"),
    startedAt: v.number(),
    endsAt: v.number(),
    playerBets: v.record(v.string(), v.array(v.number())),
    isRevealed: v.boolean(),
    correctChoiceIndex: v.optional(v.number()),
  }).index("by_gameId", ["gameId"]),

  questions: defineTable({
    text: v.string(),
    choices: v.array(v.string()),
    correctChoiceIndex: v.number(),
  }),
});