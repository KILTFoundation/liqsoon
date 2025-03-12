import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import Link from "next/link"; // Import Link
import styles from "../styles/Home.module.css";

const MIGRATION_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "BURN_ADDRESS",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "EXCHANGE_RATE_NUMERATOR",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "EXCHANGE_RATE_DENOMINATOR",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "isMigrationActive",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "newToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "oldToken",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "addr", type: "address" }],
    name: "whitelist",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  }
];

export default function Dashboard() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [burnAddress, setBurnAddress] = useState(null);
  const [exchangeRateNumerator, setExchangeRateNumerator] = useState(null);
  const [exchangeRateDenominator, setExchangeRateDenominator] = useState(null);
  const [isMigrationActive, setIsMigrationActive] = useState(null);
  const [newToken, setNewToken] = useState(null);
  const [oldToken, setOldToken] = useState(null);
  const [owner
