import { z } from 'zod';

// Player ID format: 16 characters, alphanumeric (0-9, a-z)
// Example: "a1b2c3d4e5f6g7h8"
export const PlayerIdSchema = z
  .string()
  .length(16, "Player ID must be exactly 16 characters")
  .regex(/^[0-9a-z]+$/, "Player ID must contain only lowercase letters and numbers")
  .brand<'PlayerId'>();

export type PlayerId = z.infer<typeof PlayerIdSchema>;