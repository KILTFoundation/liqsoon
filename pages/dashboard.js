import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

const OLD_KILT_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

const MIGRATION_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  // Assuming BURN_ADDRESS is a public variable; if it’s a function, adjust accordingly
  {
    constant: true,
    inputs: [],
    name: "BURN_ADDRESS",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  }
];

export default function Dashboard() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [burnAddress, setBurnAddress] = useState(null);
  const [balanceError, setBalanceError] = useState(null);

  const { contract: oldKiltContract, isLoading: contractLoading } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b",
    MIGRATION_ABI
  );

  useEffect(() => {
    if (network?.chain?.id !== 84532 && switchNetwork) {
      switchNetwork(84532);
    }
  }, [network, switchNetwork]);

  const fetchContractData = async () => {
    if (!oldKiltContract || !migrationContract || !address) return;

    try {
      // Fetch balance
      const bal = await oldKiltContract.call("balanceOf", [address]);
      const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal);
      const normalized = Number(balanceValue) / 10 ** 18;
      setBalance(normalized);
      setBalanceError(null);

      // Fetch BURN_ADDRESS
      const burnAddr = await migrationContract.call("BURN_ADDRESS");
      setBurnAddress(burnAddr);
    } catch (err) {
      console.error("Data fetch error:", err.message);
      setBalance("Error");
      setBalanceError(err.message);
      setBurnAddress("Error");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [address, oldKiltContract, migrationContract]);

  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString();
    try {
      const tx = await oldKiltContract.call("approve", [
        "0xE
