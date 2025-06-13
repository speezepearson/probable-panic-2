import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { getOrCreatePlayerId } from "../utils/playerId";
import { useState, useEffect } from "react";

interface ActiveRoundProps {
  gameId: Id<"games">;
}

export function ActiveRound({ gameId }: ActiveRoundProps) {
  const playerId = getOrCreatePlayerId();
  const roundData = useQuery(api.queries.getCurrentRound, { gameId, playerId });
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!roundData) return;

    const updateTimeRemaining = () => {
      const remaining = Math.max(0, roundData.endsAt - Date.now());
      setTimeRemaining(remaining);
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 100);

    return () => clearInterval(interval);
  }, [roundData]);

  if (roundData === undefined) {
    return <div>Loading round data...</div>;
  }

  if (roundData === null) {
    return <div>No active round found for this game.</div>;
  }

  const isRoundActive = timeRemaining > 0 && !roundData.isRevealed;
  const timeRemainingSeconds = Math.ceil(timeRemaining / 1000);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ 
        backgroundColor: isRoundActive ? "#e7f5e7" : "#f5f5f5", 
        padding: "20px", 
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <h2 style={{ margin: 0 }}>Active Round</h2>
          <div style={{ 
            fontSize: "24px", 
            fontWeight: "bold",
            color: isRoundActive ? "#d32f2f" : "#666"
          }}>
            {isRoundActive ? `${timeRemainingSeconds}s` : "Round Ended"}
          </div>
        </div>
        
        <div style={{ 
          fontSize: "18px", 
          lineHeight: "1.5",
          marginBottom: "20px",
          fontWeight: "500"
        }}>
          {roundData.questionText}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <h3>Choices:</h3>
          <div>
            {roundData.choices.map((choice, index) => (
              <div 
                key={index}
                style={{ 
                  padding: "10px",
                  margin: "5px 0",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "4px",
                  border: roundData.isRevealed && index === roundData.correctChoiceIndex 
                    ? "2px solid #28a745" 
                    : "1px solid #dee2e6"
                }}
              >
                <strong>{index + 1}.</strong> {choice}
                {roundData.isRevealed && index === roundData.correctChoiceIndex && (
                  <span style={{ color: "#28a745", marginLeft: "10px", fontWeight: "bold" }}>
                    ✓ Correct Answer
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {roundData.playerBets.length > 0 && (
          <div>
            <h3>Your Current Bets:</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {roundData.playerBets.map((bet, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: "8px 12px",
                    backgroundColor: "#007bff",
                    color: "white",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                >
                  Choice {index + 1}: {(bet * 100).toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        )}

        {roundData.playerBets.length === 0 && isRoundActive && (
          <div style={{ 
            padding: "15px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeaa7",
            borderRadius: "4px",
            color: "#856404"
          }}>
            You haven't placed any bets yet! Start betting to participate in this round.
          </div>
        )}
      </div>

      <div style={{ fontSize: "12px", color: "#666" }}>
        Player ID: {playerId}
      </div>
    </div>
  );
}