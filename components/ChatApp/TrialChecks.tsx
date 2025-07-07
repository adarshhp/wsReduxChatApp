import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrialChecks = () => {
  const TOTAL_SPINS = 19;
  const TOTAL_NUMBERS = 150;
  const SPECIAL_NUMBERS = [12, 112,33];

  const [numbers, setNumbers] = useState([...Array(TOTAL_NUMBERS)].map((_, i) => i + 1));
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedTen, setSelectedTen] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [spinsOver, setSpinsOver] = useState(false);

  const specialsLeft = numbers.filter(n => SPECIAL_NUMBERS.includes(n)).length;
  const totalLeft = numbers.length;

  const singleProb =
    totalLeft > 0 ? ((specialsLeft / totalLeft) * 100).toFixed(2) : "0.00";

  const multiProb = (() => {
    if (totalLeft < 10 || specialsLeft === 0) return "0.00";
    let probNone = 1;
    for (let i = 0; i < 10; i++) {
      probNone *= (totalLeft - specialsLeft - i) / (totalLeft - i);
    }
    return (100 * (1 - probNone)).toFixed(2);
  })();

  const selectNumber = () => {
    if (totalLeft === 0 || clickCount + 1 > TOTAL_SPINS) {
      toast.error("❌ Not enough spins left for this action.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * numbers.length);
    const number = numbers[randomIndex];

    if (SPECIAL_NUMBERS.includes(number)) {
      toast.success("🎉 Special number selected!");
    }

    setSelectedNumber(number);
    setSelectedTen([]);
    setNumbers(prev => prev.filter(n => n !== number));
    setClickCount(prev => prev + 1);
  };

  const selectTenNumbers = () => {
    if (totalLeft < 10 || clickCount + 10 > TOTAL_SPINS) {
      toast.error("❌ Not enough spins left for selecting 10 numbers.");
      return;
    }

    const shuffled = [...numbers].sort(() => 0.5 - Math.random());
    const picked = shuffled.slice(0, 10);

    picked.forEach(num => {
      if (SPECIAL_NUMBERS.includes(num)) {
        toast.success(`🎉 Special number selected: ${num}`);
      }
    });

    setSelectedTen(picked);
    setSelectedNumber(null);
    setNumbers(prev => prev.filter(n => !picked.includes(n)));
    setClickCount(prev => prev + 9);
  };

  useEffect(() => {
    if (clickCount >= TOTAL_SPINS) {
      setSpinsOver(true);
      toast.info("✨ Your spins are over!");
    }
  }, [clickCount]);

  const resetGame = () => {
    setNumbers([...Array(TOTAL_NUMBERS)].map((_, i) => i + 1));
    setSelectedNumber(null);
    setSelectedTen([]);
    setClickCount(0);
    setSpinsOver(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial", position: "relative" }}>
      <ToastContainer />

      {/* MODAL WHEN SPINS ARE OVER */}
      {spinsOver && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(3px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            textAlign: "center"
          }}>
            <h2>🎮 Trial Complete</h2>
            <p style={{ margin: "15px 0" }}>You’ve used all {TOTAL_SPINS} spins.</p>
            <button
              onClick={resetGame}
              style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              🔁 Try Again
            </button>
          </div>
        </div>
      )}

      {/* Probability indicators */}
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#e3fcef",
        padding: "8px 12px",
        borderRadius: "6px",
        fontWeight: "bold"
      }}>
        🎯 10 Pick Chance: {multiProb}%
      </div>

      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        backgroundColor: "#f5f5f5",
        padding: "8px 12px",
        borderRadius: "6px",
        fontWeight: "bold"
      }}>
        🎯 Next Pick Chance: {singleProb}%
      </div>

      {/* Click counter */}
      <div style={{ marginBottom: 15, fontWeight: "bold", fontSize: "16px" }}>
        🔢 Coins left: {(TOTAL_SPINS-clickCount)*100} 💰🪙 Coins Used : { clickCount*100}
      </div>

      {/* Remaining Numbers */}
      <h3>Remaining Numbers:</h3>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "20px",
        maxHeight: "200px",
        overflowY: "auto"
      }}>
        {numbers.map((num) => (
          <span key={num} style={{
            padding: "6px 10px",
            backgroundColor: "#eee",
            borderRadius: "4px",
            border: "1px solid #ccc"
          }}>
            {num}
          </span>
        ))}
      </div>

      {/* Selected number or set */}
      <h3>
        Selected Number: {selectedNumber !== null ? selectedNumber : "None yet"}
      </h3>

      {selectedTen.length > 0 && (
        <div>
          <h3>Selected 10 Numbers:</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {selectedTen.map((num) => (
              <span key={num} style={{
                padding: "6px 10px",
                backgroundColor: "#d1e7dd",
                borderRadius: "4px",
                border: "1px solid #bcd0c7"
              }}>
                {num}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ marginTop: "25px" }}>
        <button
          onClick={selectNumber}
          disabled={spinsOver || totalLeft === 0}
          style={{
            marginRight: "10px",
            padding: "10px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🎲 Generate Number
        </button>

        <button
          onClick={selectTenNumbers}
          disabled={spinsOver || totalLeft < 10}
          style={{
            padding: "10px 16px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          🔟 Select 10
        </button>
      </div>

      <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
        Remaining: {numbers.length}
      </p>
    </div>
  );
};

export default TrialChecks;
