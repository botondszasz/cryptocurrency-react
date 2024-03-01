import React from "react";
import { Dropdown } from "react-bootstrap";
import { Crypto } from "../types/CryptoType";

export type Props = {
  crypto: Crypto;
};

function CryptoSummary({ crypto }: Props) {
  return (
    <Dropdown.Item>{crypto.name + " $" + crypto.current_price}</Dropdown.Item>
  );
}

export default CryptoSummary;
