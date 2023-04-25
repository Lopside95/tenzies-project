import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import Die from "./Die";
import "./App.css";

function App() {
  const [dice, setDice] = useState(allNewDice());

  const [ten, setTen] = useState(false);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSame = dice.every((die) => die.value === firstValue);

    if (allHeld && allSame) {
      setTen(true);
      console.log("you won");
    }
  }, [dice]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
      // with the updated newDice.push, calling allNewDice creates an array of objects
    }
    return newDice;
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  function rollDice() {
    if (!ten) {
      setDice((prevDice) =>
        prevDice.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    } else {
      setTen(false);
      setDice(allNewDice);
    }
  }

  function holdDice(id) {
    setDice((prevDice) =>
      prevDice.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  return (
    <div className="tenzies-app">
      <Container>
        {ten && <Confetti />}
        <Row>
          <Col>
            <div className="dice-container">{diceElements}</div>
            <button className="roll-dice" onClick={rollDice}>
              {ten ? "Reset" : "Roll"}
              {/* <button className="roll-dice" onClick={ten ? newGame : rollDice}> */}
              {/* {ten ? <h3>Reset</h3> : <h3>Roll</h3>} */}
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
