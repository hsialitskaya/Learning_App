import React, { useState } from "react";

const CodeExample = () => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    setCounter(counter + 1);
  };

  return (
    <div>
      <h2>Przykład kodu React</h2>
      <p>
        To jest przykładowy komponent, który wykorzystuje React do
        zaktualizowania stanu. Zmienna "counter" jest liczona za pomocą hooka
        useState.
      </p>
      <button onClick={incrementCounter}>Kliknij, aby zwiększyć licznik</button>
      <p>Aktualny licznik: {counter}</p>
    </div>
  );
};

export default CodeExample;
