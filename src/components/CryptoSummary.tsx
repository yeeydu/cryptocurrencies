import React from "react";
import { Crypto } from "./Types";

export type AppProps = {
  crypto: Crypto;
};
//                                                         JSX.Element you´r returning a jsx element type
export default function CryptoSummary({ crypto }: AppProps): JSX.Element {
  return (
    <div>
       <p key={crypto.id}>{crypto.name + " €" + crypto.current_price}</p>
    </div>
  );
}
