import { z } from 'zod';

export function createChoiceValidator(choices: string[]) {
  if (choices.length === 0) {
    throw new Error("Cannot create choice validator with empty choices array");
  }
  
  return z.enum(choices as [string, ...string[]], {
    errorMap: () => ({ message: `Must be one of: ${choices.join(", ")}` })
  });
}