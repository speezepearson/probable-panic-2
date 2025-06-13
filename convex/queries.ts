import { query } from "./_generated/server";

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