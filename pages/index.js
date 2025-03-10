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
  }
];

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [balanceError, setBalanceError] = useState(null);

  const { contract: oldKiltContract, isLoading: contractLoading, error: contractError } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b",
    OLD_KILT_ABI
  );
  const { contract: migrationContract } = useContract(
    "0x322422335ea70370557d475e94d85cfd0ec15637",
    MIGRATION_ABI
  );

  useEffect(() => {
    if (network?.chain?.id !== 84532 && switchNetwork) {
      switchNetwork(84532);
    }
  }, [network, switchNetwork]);

  useEffect(() => {
    if (!address || !oldKiltContract) {
      setBalance(null);
      setBalanceError(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        const bal = await oldKiltContract.call("balanceOf", [address]);
        const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal);
        const normalized = Number(balanceValue) / 10 ** 18;
        setBalance(normalized);
        setBalanceError(null);
      } catch (err) {
        console.error("Balance fetch error:", err.message);
        setBalance("Error");
        setBalanceError(err.message);
      }
    };

    fetchBalance();
  }, [address, oldKiltContract]);

  // Restored working approve function
  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString();
    try {
      const tx = await oldKiltContract.call("approve", [
        "0x322422335ea70370557d475e94d85cfd0ec15637", // Migration contract address
        weiAmount
      ]);
      console.log("Approval tx:", tx);
      alert("Approval successful!");
    } catch (err) {
      console.error("Approval error:", err.message);
      alert("Approval failed. Check console.");
    }
  };

  // Restored working migrate function
  const handleMigrate = async () => {
    if (!migrationContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString();
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
    <div style={{ backgroundColor: "#13061f", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      <header style={{ padding: "20px", textAlign: "center", color: "#fff" }}>
        {/* <h1 style={{ margin: 0, fontSize: "24px" }}>KILT Migration Portal</h1> */}
        <img
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          style={{ width: "200px", height: "auto" }}
        />
      </header>

      <main className={styles.main}>
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
                  Migrateable KILT Balance:{" "}
                  {contractLoading
                    ? "Contract loading..."
                    : balance === null
                    ? "Loading..."
                    : balance === "Error"
                    ? "Failed to load"
                    : `${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} KILT`}
                </p>
                {balanceError && <p style={{ color: "red" }}>Error: {balanceError}</p>}
                {contractError && <p>Contract error: {contractError.message}</p>}
              </div>
            ) : (
              <p>Connect your wallet to view balance.</p>
            )}

            <div style={{ margin: "20px 0" }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter KILT amount"
                className={styles.code}
                style={{ margin: "10px", padding: "8px", width: "200px" }}
              />
              <div className={styles.grid} style={{ justifyContent: "center" }}>
                <button
                  onClick={handleApprove}
                  disabled={!amount || !address}
                  className={styles.card}
                  style={{ margin: "10px", padding: "10px 20px"}}
                >
                  Approve Migration
                </button>
                <button
                  onClick={handleMigrate}
                  disabled={!amount || !address}
                  className={styles.card}
                  style={{ margin: "10px", padding: "10px 20px"}}
                >
                  Migrate Tokens
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <p>Secure migration portal | migrate.kilt.io</p>
      </footer>
    </div>
  );
}
