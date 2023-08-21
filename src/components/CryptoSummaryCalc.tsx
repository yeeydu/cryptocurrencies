import React, { useEffect, useState } from "react";
import { Crypto } from "./Types";

export type AppProps = {
  crypto: Crypto;
  updateOwned: (crypto: Crypto, amount: number) => void; //a function as a prop from parent - (?)means optional
  delete_coin:  any ;
};
//                                                         JSX.Element you´r returning a jsx element type
export default function CryptoSummary({
  crypto,
  updateOwned, 
  delete_coin,
}: AppProps): JSX.Element {
  const [amount, setAmount] = useState<number>(NaN);


  return (
    <div className="container  mb-1 bg-light border border-light-subtle rounded-3 ">
      <div className="row g-5">
        <div className="col">
          <p className="m-2" key={crypto.id}>
            {crypto.name + " €" + crypto.current_price}
          </p>
        </div>
        {/* Future delete button */}
          <div className="col-lg-2 col-sm-2 " > <button onClick={delete_coin} className="btn btn-secondary btn-sm mt-1">X</button></div>
      </div>
      <input
        type="number"
        className="form-control m-1 p-1 w-50"
        value={amount}
        onChange={(e) => {
          setAmount(parseFloat(e.target.value));
          // (?)means optional we have to make a ternary operator
          updateOwned(crypto, parseFloat(e.target.value));
        }}
      ></input>
      <p>
        <strong>
          {isNaN(amount)
            ? "€0.00"
            : "€ " +
              (crypto.current_price * amount)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
        </strong>
      </p>
    </div>
  );
}
