import { query } from "./_generated/server";
import { v } from "convex/values";

export const getAllGames = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("games").collect();
  },
});

export const getAllCurrentRounds = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("currentRounds").collect();
  },
});

export const getAllQuestions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("questions").collect();
  },
});

export const getCurrentRound = query({
  args: {
    gameId: v.id("games"),
    playerId: v.string(),
  },
  handler: async (ctx, { gameId, playerId }) => {
    const currentRound = await ctx.db
      .query("currentRounds")
      .withIndex("by_gameId", (q) => q.eq("gameId", gameId))
      .first();
    
    if (!currentRound) {
      return null;
    }

    const question = await ctx.db.get(currentRound.questionId);
    if (!question) {
      throw new Error("Question not found");
    }

    const playerBets = currentRound.playerBets[playerId] || [];

    return {
      questionText: question.text,
      choices: question.choices,
      startedAt: currentRound.startedAt,
      endsAt: currentRound.endsAt,
      playerBets,
      isRevealed: currentRound.isRevealed,
      correctChoiceIndex: currentRound.isRevealed ? currentRound.correctChoiceIndex : undefined,
    };
  },
});