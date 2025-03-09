import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

// ABI for oldKILT token (ERC-20 subset)
const OLD_KILT_ABI = [
  {
    constant: true,
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// ABI for migration contract (assumed)
const MIGRATION_ABI = [
  {
    inputs: [{ name: "amount", type: "uint256" }],
    name: "migrate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);

  const { contract: oldKiltContract, isLoading: contractLoading, error: contractError } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0x322422335ea70370557d475e94d85cfd0ec15637",
    MIGRATION_ABI
  );

  // Auto-switch to Base Sepolia
  useEffect(() => {
    if (network?.chain?.id !== 84532) {
      if (switchNetwork) {
        switchNetwork(84532);
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x14a34" }],
        });
      }
    }
  }, [network, switchNetwork]);

  // Fetch and normalize balance (assuming 18 decimals)
  useEffect(() => {
    if (!address || !oldKiltContract) return;
    oldKiltContract.call("balance
