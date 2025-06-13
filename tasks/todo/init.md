This repo is hooked up to a bare-bones Convex project. Let's create the basic structure for the app:

# Schema

## Core Tables

### `games` table
**Purpose:** Contains all past and in-progress games
**Fields:**
- `_id`: ConvexId (auto-generated)
- `status`: "waiting" | "active" | "finished"
- `totalRounds`: number (e.g., 10)
- `roundDurationMs`: number (e.g., 10000 for 10 seconds)
- `currentRoundIndex`: number (0-based, for active games)
- `finishedAt`: number | null (timestamp when game ended)
- `players`: Array<{playerId: string, displayName: string}>
- `roundHistory`: Array<{
    roundIndex: number,
    questionId: ConvexId,
    playerBets: Record<string, number[]>, // playerId -> final probabilities for each choice
    winnings: Record<string, number>, // playerId -> winnings
    correctChoiceIndex: number,
    revealedAt: number
  }>

### `currentRounds` table  
**Purpose:** Contains current round state for active games
**Fields:**
- `_id`: ConvexId (auto-generated)
- `gameId`: ConvexId (reference to games table)
- `questionId`: ConvexId (reference to questions table)
- `startedAt`: number (timestamp)
- `endsAt`: number (timestamp)
- `playerBets`: Record<string, number[]> // playerId -> probabilities for each choice
- `isRevealed`: boolean
- `correctChoiceIndex`: number | null

### `questions` table
**Purpose:** Repository of all possible questions
**Fields:**
- `_id`: ConvexId (auto-generated)
- `text`: string (e.g., "The Great Wall of China is visible with the naked eye from the moon.")
- `choices`: Array<string> (e.g., ["True", "False"] or ["A", "B", "C", "D"])
- `correctChoiceIndex`: number (0-based index into choices array)

## Design Decisions

### Player Identity
- No persistent user accounts - players choose random IDs per session
- Each client generates a random playerId and displayName
- PlayerIds are strings (e.g., UUIDs or random alphanumeric)

### Betting Mechanics
- Players can place multiple bets during a round, updating their position
- Final probability is the last bet placed before round ends
- Betting amount represents confidence/stake in prediction market
- Winnings calculated using market-making algorithm after reveal

### Game Flow
1. Game created in "waiting" status
2. Players join (added to players array)
3. Game starts → status "active", first round created in currentRounds
4. Round timer expires → reveal answer, calculate winnings, update roundHistory
5. Next round starts or game ends → status "finished"

### Indexes Needed
- `games`: by status (to find active games)
- `currentRounds`: by gameId (to find current round for a game)

## Implementation Notes
- Use Convex's real-time subscriptions for live betting updates
- Implement server-side validation for bet amounts and timing
- Consider implementing market-making algorithm for dynamic odds
- Store all timestamps as numbers (Date.now()) for consistency