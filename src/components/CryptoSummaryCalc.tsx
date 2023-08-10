import React, { useEffect, useState } from "react";
import { Crypto } from "./Types";

export type AppProps = {
  crypto: Crypto;
};
//                                                         JSX.Element you´r returning a jsx element type
export default function CryptoSummary({ crypto }: AppProps): JSX.Element {
  const [amount, setAmount] = useState<string>("0");

  useEffect(() => {
    console.log(crypto.name, amount, crypto.current_price * parseFloat(amount));
  });

  return (
    <div className="container">
      <p key={crypto.id}>{crypto.name + " €" + crypto.current_price}</p>
      <input
        type="number"
        className="form-control m-2 p-1"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
        }}
      ></input>
      <p>
        {"€ " +
          (crypto.current_price * parseFloat(amount))
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
      </p>
    </div>
  );
}
