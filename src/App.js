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

  // This state is used to store the value regarding the game being won.

  const [ten, setTen] = useState(false);

  // This tracks whether or not the die have been held by the player.
  // If they are all held, and if all die have the same value, the [ten] state is set to true
  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSame = dice.every((die) => die.value === firstValue);
    if (allHeld && allSame) {
      setTen(true);
    }
  }, [dice]);

  // This generates new die values as the player rerolls
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    };
  }

  // This loops over the [dice] array and pushes new die to the array
  // to replace the die that haven't been held by the player
  function allNewDice() {
    const newDice = [];
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie());
    }
    return newDice;
  }

  // The holdDice event listener is attached to the die elements themselves
  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ));

  // If [ten] state isn't true, this function (attached to the 'roll' button) keeps track of the die that are held,
  // leaving them unchanged and returning new values for the die that aren't held.
  // if [ten] is true, meaning that the player has won, the button, on click, sets [ten] to false
  // and resets the game, returning a new array of [dice] array
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

  // This allows players to hold/freeze dice (and vice versa), setting the value of die.isHeld
  // to the opposite  of what it was before
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
          <Col className="content-col">
            <h2 className="main-header">Tenzies</h2>
            <p className="rules">
              Roll the dice until all have the same number. Click die to freeze
              them and leave them out of the next roll
            </p>
            <div className="dice-container">{diceElements}</div>
            <button className="roll-button" onClick={rollDice}>
              {ten ? (
                <h4 className="button-text">Reset</h4>
              ) : (
                <h4 className="button-text">Roll</h4>
              )}
            </button>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
