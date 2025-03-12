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
  }
];

export default function Dashboard() {
  const [{ data: network }, switchNetwork] = useNetwork();
  const address = useAddress();
  const [amount, setAmount] = useState("");
  const [burnAddress, setBurnAddress] = useState(null);
  const [exchangeRateNumerator, setExchangeRateNumerator] = useState(null);
  const [exchangeRateDenominator, setExchangeRateDenominator] = useState(null);

  const { contract: oldKiltContract } = useContract(
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
    if (!migrationContract) return;

    try {
      const burnAddr = await migrationContract.call("BURN_ADDRESS");
      setBurnAddress(burnAddr);

      const numerator = await migrationContract.call("EXCHANGE_RATE_NUMERATOR");
      setExchangeRateNumerator(numerator.toString());

      const denominator = await migrationContract.call("EXCHANGE_RATE_DENOMINATOR");
      setExchangeRateDenominator(denominator.toString());
    } catch (err) {
      console.error("Data fetch error:", err.message);
      setBurnAddress("Error");
      setExchangeRateNumerator("Error");
      setExchangeRateDenominator("Error");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [migrationContract]);

  const handleApprove = async () => {
    if (!oldKiltContract || !amount || !address) return;
    const weiAmount = BigInt(Math.floor(Number(amount) * 10 ** 18)).toString();
    try {
      const tx = await oldKiltContract.call("approve", [
        "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b",
        weiAmount
      ]);
      console.log("Approval tx:", tx);
      alert("Approval successful!");
    } catch (err) {
      console.error("Approval error:", err.message);
      alert("Approval failed. Check console.");
    }
  };

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
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img
          src="/KILT-Horizontal-black.png"
          alt="KILT Logo"
          style={{ width: "200px", height: "auto" }}
        />
      </header>

      <main className={styles.main}>
        <div className={styles.container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Dashboard</p>
            <div className={styles.connect} style={{ margin: "10px 0" }}>
              <ConnectWallet />
            </div>
          </div>

          {/* BURN_ADDRESS Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>BURN_ADDRESS: </span>
                <span>
                  {migrationContract
                    ? burnAddress === null
                      ? "Loading..."
                      : burnAddress === "Error"
                      ? "Failed to load"
                      : burnAddress
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* EXCHANGE_RATE_NUMERATOR Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_NUMERATOR: </span>
                <span>
                  {migrationContract
                    ? exchangeRateNumerator === null
                      ? "Loading..."
                      : exchangeRateNumerator === "Error"
                      ? "Failed to load"
                      : exchangeRateNumerator
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          {/* EXCHANGE_RATE_DENOMINATOR Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "#1357BB",
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_DENOMINATOR: </span>
                <span>
                  {migrationContract
                    ? exchangeRateDenominator === null
                      ? "Loading..."
                      : exchangeRateDenominator === "Error"
                      ? "Failed to load"
                      : exchangeRateDenominator
                    : "Contract not loaded"}
                </span>
              </div>
            </div>
            <button
              onClick={fetchContractData}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>

          <div className={styles.header} style={{ textAlign: "center" }}>
            {!address && <p>Connect your wallet to proceed.</p>}

            <div style={{ margin: "20px 0" }}>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={styles.code}
                style={{ margin: "10px", padding: "8px", width: "200px" }}
              />
              <div className={styles.grid} style={{ justifyContent: "center" }}>
                <button
                  onClick={handleApprove}
                  disabled={!amount || !address}
                  className={styles.card}
                  style={{ margin: "10px", padding: "10px 20px" }}
                >
                  Approve
                </button>
                <button
                  onClick={handleMigrate}
                  disabled={!amount || !address}
                  className={styles.card}
                  style={{ margin: "10px", padding: "10px 20px" }}
                >
                  Migrate
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <div>
          <a href="https://www.kilt.io/imprint" className={styles.footerLink}>Imprint</a>
          {" | "}
          <a href="https://www.kilt.io/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
          {" | "}
          <a href="https://www.kilt.io/disclaimer" className={styles.footerLink}>Disclaimer</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Homepage</a>
        </div>
      </footer>
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
