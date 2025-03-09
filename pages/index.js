import { useState, useEffect } from "react";
import { ConnectWallet, useNetwork, useAddress, useContract } from "@thirdweb-dev/react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);

  // oldKILT token contract
  const { contract: oldKiltContract, isLoading: contractLoading, error: contractError } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    [
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
    ]
  );

  // Migration contract
  const { contract: migrationContract } = useContract(
    "0x322422335ea70370557d475e94d85cfd0ec15637",
    [
      {
        inputs: [{ name: "amount", type: "uint256" }],
        name: "migrate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ]
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

  // Fetch balance
  useEffect(() => {
    if (address && oldKiltContract) {
      oldKiltContract.call("balanceOf", [address])
        .then((bal) => {
          setBalance(bal.toString());
        })
        .catch((err) => {
          console.error("Balance fetch error:", err.message);
          setBalance("Error");
        });
    }
  }, [address, oldKiltContract]);

  // Approve function
  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    try {
      const tx = await oldKiltContract.call("approve", [
        "0x322422335ea70370557d475e94d85cfd0ec15637",
        amount,
      ]);
      console.log("Approval tx:", tx);
      alert("Approval successful!");
    } catch (err) {
      console.error("Approval error:", err.message);
      alert("Approval failed. Check console.");
    }
  };

  // Migrate function
  const handleMigrate = async () => {
    if (!migrationContract || !amount || !address) return;
    try {
      const tx = await migrationContract.call("migrate", [amount]);
      console.log("Migration tx:", tx);
      alert("Migration successful!");
    } catch (err) {
      console.error("Migration error:", err.message);
      alert("Migration failed. Check console.");
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>

          {address ? (
            <div>
              <p>Wallet: {address}</p>
              <p>
                oldKILT Balance:{" "}
                {contractLoading ? "Contract loading..." : balance === null ? "Loading..." : balance === "Error" ? "Failed to load (check console)" : balance}
              </p>
              {contractError && <p>Contract error: {contractError.message}</p>}
            </div>
          ) : (
            <p>Connect your wallet to view balance.</p>
          )}

          <div className={styles.grid}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount to migrate"
              className={styles.code}
            />
            <button
              onClick={handleApprove}
              disabled={!amount || !address}
              className={styles.card}
            >
              Approve Migration
            </button>
            <button
              onClick={handleMigrate}
              disabled={!amount || !address}
              className={styles.card}
            >
              Migrate Tokens
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
