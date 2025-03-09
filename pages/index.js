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
    oldKiltContract.call("balanceOf", [address])
      .then((bal) => {
        const normalized = Number(bal) / 10**18;
        setBalance(normalized.toString());
      })
      .catch((err) => {
        console.error("Balance fetch error:", err.message);
        setBalance("Error");
      });
  }, [address, oldKiltContract]);

  // Approve (convert input to wei)
  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10**18)).toString();
    try {
      const tx = await oldKiltContract.call("approve", [
        "0x322422335ea70370557d475e94d85cfd0ec15637",
        weiAmount
      ]);
      console.log("Approval tx:", tx);
      alert("Approval successful!");
    } catch (err) {
      console.error("Approval error:", err.message);
      alert("Approval failed. Check console.");
    }
  };

  // Migrate (convert input to wei)
  const handleMigrate = async () => {
    if (!migrationContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10**18)).toString();
    try {
      const tx = await migrationContract.call("migrate", [weiAmount]);
      console.log("Migration tx:", tx);
      alert("Migration successful!");
    } catch (err) {
      console.error("Migration error:", err.message);
      alert("Migration failed. Check console.");
    }
  };

  return (
    <main style={{ backgroundColor: "#161B3B", minHeight: "100vh", fontFamily: "Manrope, sans-serif" }}>
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#333", color: "#fff" }}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>KILT Migration Portal</h1>
      </header>

      <div className={styles.container}>
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <p>Migrate KILT from</p>
          <p><code>0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b</code></p>
          <p>to</p>
          <p><code>0x3079844be6416b6a24a24505fa465eafc3b2b4f9</code></p>
          <p>Migration ratio 1:1.75</p>
        </div>

        <div className={styles.header} style={{ textAlign: "center" }}>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>

          {address ? (
            <div>
              <p>Wallet: {address}</p>
              <p>
                oldKILT Balance:{" "}
                {contractLoading
                  ? "Contract loading..."
                  : balance === null
                  ? "Loading..."
                  : balance === "Error"
                  ? "Failed to load (check console)"
                  : `${balance} KILT`}
              </p>
              {contractError && <p>Contract error: {contractError.message}</p>}
            </div>
          ) : (
            <p>Connect your wallet to view balance.</p>
          )}

          <div className={styles.grid} style={{ justifyContent: "center" }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter KILT amount"
              className={styles.code}
              style={{ margin: "10px", padding: "8px", width: "200px" }}
            />
            <button
              onClick={handleApprove}
              disabled={!amount || !address}
              className={styles.card}
              style={{ margin: "10px", padding: "10px 20px" }}
            >
              Approve Migration
            </button>
            <button
              onClick={handleMigrate}
              disabled={!amount || !address}
              className={styles.card}
              style={{ margin: "10px", padding: "10px 20px" }}
            >
              Migrate Tokens
            </button>
          </div>
        </div>
      </div>

      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <p>Secure migration portal | migrate.kilt.io</p>
      </footer>
    </main>
  );
}
