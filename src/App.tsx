import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { ActiveRound } from "./components/ActiveRound";
import "./App.css";

function App() {
  const games = useQuery(api.queries.getAllGames);
  const currentRounds = useQuery(api.queries.getAllCurrentRounds);
  const questions = useQuery(api.queries.getAllQuestions);
  
  const createGame = useMutation(api.mutations.createGame);
  const startGame = useMutation(api.mutations.startGame);

  const handleCreateGame = async () => {
    try {
      await createGame();
    } catch (error) {
      alert("Failed to create game: " + error);
    }
  };

  const handleStartGame = async (gameId: Id<"games">) => {
    try {
      await startGame({ gameId });
    } catch (error) {
      alert("Failed to start game: " + error);
    }
  };

  if (games === undefined || currentRounds === undefined || questions === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Probable Panic Database</h1>

      <section>
        <h2>Games ({games.length})</h2>
        <button 
          onClick={handleCreateGame}
          style={{ marginBottom: "20px", padding: "10px 20px", fontSize: "16px" }}
        >
          Create New Game
        </button>
        {games.length === 0 ? (
          <p>No games found</p>
        ) : (
          <div>
            {games.map((game) => (
              <div key={game._id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
                <strong>Game {game._id}</strong>
                <p>Status: {game.status}</p>
                <p>Rounds: {game.currentRoundIndex + 1}/{game.totalRounds}</p>
                <p>Duration: {game.roundDurationMs}ms</p>
                <p>Players: {game.players.map(p => p.displayName).join(", ")}</p>
                {game.finishedAt && <p>Finished: {new Date(game.finishedAt).toLocaleString()}</p>}
                {game.status === "waiting" && (
                  <button 
                    onClick={() => handleStartGame(game._id)}
                    style={{ padding: "8px 16px", marginTop: "10px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
                  >
                    Start Game
                  </button>
                )}
                <details>
                  <summary>Round History ({game.roundHistory.length})</summary>
                  {game.roundHistory.map((round) => (
                    <div key={round.roundIndex} style={{ marginLeft: "20px", marginTop: "5px" }}>
                      <p>Round {round.roundIndex + 1} - Question: {round.questionId}</p>
                      <p>Correct: {round.correctChoiceIndex}</p>
                      <p>Revealed: {new Date(round.revealedAt).toLocaleString()}</p>
                    </div>
                  ))}
                </details>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Current Rounds ({currentRounds.length})</h2>
        {currentRounds.length === 0 ? (
          <p>No active rounds found</p>
        ) : (
          <div>
            {currentRounds.map((round) => (
              <div key={round._id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
                <strong>Round {round._id}</strong>
                <p>Game: {round.gameId}</p>
                <p>Question: {round.questionId}</p>
                <p>Started: {new Date(round.startedAt).toLocaleString()}</p>
                <p>Ends: {new Date(round.endsAt).toLocaleString()}</p>
                <p>Revealed: {round.isRevealed ? "Yes" : "No"}</p>
                {round.correctChoiceIndex !== undefined && <p>Correct Choice: {round.correctChoiceIndex}</p>}
                <details>
                  <summary>Player Bets</summary>
                  <pre>{JSON.stringify(round.playerBets, null, 2)}</pre>
                </details>
                <div style={{ marginTop: "15px", padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "4px" }}>
                  <h4>Active Round View:</h4>
                  <ActiveRound gameId={round.gameId} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2>Questions ({questions.length})</h2>
        {questions.length === 0 ? (
          <p>No questions found</p>
        ) : (
          <div>
            {questions.map((question) => (
              <div key={question._id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
                <strong>Question {question._id}</strong>
                <p>{question.text}</p>
                <p>Choices: {question.choices.join(", ")}</p>
                <p>Correct Answer: {question.choices[question.correctChoiceIndex]} (index {question.correctChoiceIndex})</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
