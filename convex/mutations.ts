import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createGame = mutation({
  args: {},
  handler: async (ctx) => {
    // Create a game with default settings
    const gameId = await ctx.db.insert("games", {
      status: "waiting",
      totalRounds: 5,
      roundDurationMs: 10000, // 10 seconds
      currentRoundIndex: 0,
      players: [],
      roundHistory: [],
    });
    
    return gameId;
  },
});

export const startGame = mutation({
  args: {
    gameId: v.id("games"),
  },
  handler: async (ctx, { gameId }) => {
    const game = await ctx.db.get(gameId);
    if (!game) {
      throw new Error("Game not found");
    }
    
    if (game.status !== "waiting") {
      throw new Error("Game is not in waiting status");
    }
    
    // Check if there's already a current round for this game
    const existingRound = await ctx.db
      .query("currentRounds")
      .withIndex("by_gameId", (q) => q.eq("gameId", gameId))
      .first();
    
    if (existingRound) {
      throw new Error("Game already has an active round");
    }
    
    // Get a random question
    const questions = await ctx.db.query("questions").collect();
    if (questions.length === 0) {
      throw new Error("No questions available to start the game");
    }
    
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    
    // Create the current round
    const now = Date.now();
    const roundId = await ctx.db.insert("currentRounds", {
      gameId,
      questionId: randomQuestion._id,
      startedAt: now,
      endsAt: now + game.roundDurationMs,
      playerBets: {},
      isRevealed: false,
    });
    
    // Update game status to active
    await ctx.db.patch(gameId, {
      status: "active",
    });
    
    return roundId;
  },
});