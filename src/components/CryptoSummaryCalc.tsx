import React, { useEffect, useState } from "react";
import { Crypto } from "./Types";

export type AppProps = {
  crypto: Crypto;
  updateOwned: (crypto: Crypto, amount: number) => void //a function as a prop from parent - (?)means optional
};
//                                                         JSX.Element you´r returning a jsx element type
export default function CryptoSummary({ crypto, updateOwned }: AppProps): JSX.Element {
  const [amount, setAmount] = useState<number>(NaN);

  return (
    <div className="container">
      <p key={crypto.id}>{crypto.name + " €" + crypto.current_price}</p>
      <input
        type="number"
        className="form-control m-2 p-1"
        value={amount}
        onChange={(e) => {
          setAmount(parseFloat(e.target.value));
          // (?)means optional we have to make a ternary operator
          updateOwned(crypto, parseFloat(e.target.value)) 
        }}
      ></input>
      <p>
        {isNaN(amount) ? '€0.00': "€ " +
          (crypto.current_price * (amount))
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
      </p>
    </div>
  );
}
