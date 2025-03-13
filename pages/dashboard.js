import { useState, useEffect } from "react";
import { useContract } from "@thirdweb-dev/react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const MIGRATION_ABI = [
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
  const [burnAddress, setBurnAddress] = useState(null);
  const [exchangeRateNumerator, setExchangeRateNumerator] = useState(null);
  const [exchangeRateDenominator, setExchangeRateDenominator] = useState(null);
  const [isMigrationActive, setIsMigrationActive] = useState(null);
  const [newToken, setNewToken] = useState(null);
  const [oldToken, setOldToken] = useState(null);
  const [owner, setOwner] = useState(null);
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [whitelistResult, setWhitelistResult] = useState(null);

  const { contract: migrationContract, isLoading: contractLoading } = useContract(
    "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b",
    MIGRATION_ABI
  );

  const fetchContractData = async () => {
    if (!migrationContract) return;

    try {
      const burnAddr = await migrationContract.call("BURN_ADDRESS");
      setBurnAddress(burnAddr);

      const numerator = await migrationContract.call("EXCHANGE_RATE_NUMERATOR");
      setExchangeRateNumerator(numerator.toString());

      const denominator = await migrationContract.call("EXCHANGE_RATE_DENOMINATOR");
      setExchangeRateDenominator(denominator.toString());

      const migrationActive = await migrationContract.call("isMigrationActive");
      setIsMigrationActive(migrationActive);

      const newTok = await migrationContract.call("newToken");
      setNewToken(newTok);

      const oldTok = await migrationContract.call("oldToken");
      setOldToken(oldTok);

      const own = await migrationContract.call("owner");
      setOwner(own);
    } catch (err) {
      console.error("Data fetch error:", err.message);
      setBurnAddress("Error");
      setExchangeRateNumerator("Error");
      setExchangeRateDenominator("Error");
      setIsMigrationActive("Error");
      setNewToken("Error");
      setOldToken("Error");
      setOwner("Error");
    }
  };

  const fetchWhitelistStatus = async () => {
    if (!migrationContract || !whitelistAddress) return;

    try {
      const result = await migrationContract.call("whitelist", [whitelistAddress]);
      setWhitelistResult(result.toString());
    } catch (err) {
      console.error("Whitelist fetch error:", err.message);
      setWhitelistResult("Error");
    }
  };

  useEffect(() => {
    fetchContractData();
  }, [migrationContract]);

  return (
        <div style={{ 
      backgroundImage: "url('/tartanbackground.png')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
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
            <p style={{ color: "#fff" }}>
              <span style={{ fontWeight: "bold" }}>Migration Contract: </span>
              0xe9a37bde0b9daa20e226608d04aec6358928c82b
            </p>
          </div>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: "#fff" }}>Read Contract</p>
          </div>

          {contractLoading && <p style={{ textAlign: "center", color: "#fff" }}>Loading contract...</p>}

          {/* BURN_ADDRESS Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>BURN_ADDRESS: </span>
                <span>
                  {burnAddress === null
                    ? "Loading..."
                    : burnAddress === "Error"
                    ? "Failed to load"
                    : burnAddress}
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
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_NUMERATOR: </span>
                <span>
                  {exchangeRateNumerator === null
                    ? "Loading..."
                    : exchangeRateNumerator === "Error"
                    ? "Failed to load"
                    : exchangeRateNumerator}
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
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_DENOMINATOR: </span>
                <span>
                  {exchangeRateDenominator === null
                    ? "Loading..."
                    : exchangeRateDenominator === "Error"
                    ? "Failed to load"
                    : exchangeRateDenominator}
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

          {/* isMigrationActive Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>isMigrationActive: </span>
                <span>
                  {isMigrationActive === null
                    ? "Loading..."
                    : isMigrationActive === "Error"
                    ? "Failed to load"
                    : isMigrationActive.toString()}
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

          {/* newToken Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>newToken: </span>
                <span>
                  {newToken === null
                    ? "Loading..."
                    : newToken === "Error"
                    ? "Failed to load"
                    : newToken}
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

          {/* oldToken Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>oldToken: </span>
                <span>
                  {oldToken === null
                    ? "Loading..."
                    : oldToken === "Error"
                    ? "Failed to load"
                    : oldToken}
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

          {/* Owner Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Owner: </span>
                <span>
                  {owner === null
                    ? "Loading..."
                    : owner === "Error"
                    ? "Failed to load"
                    : owner}
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

          {/* Check Whitelist Card */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{
              background: "rgba(19, 87, 187, 0.65)", // 65% transparent blue
              padding: "15px",
              borderRadius: "8px",
              width: "500px",
              textAlign: "left",
              color: "#fff"
            }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Check Whitelist: </span>
                <input
                  type="text"
                  value={whitelistAddress}
                  onChange={(e) => setWhitelistAddress(e.target.value)}
                  placeholder="Enter address"
                  style={{ marginLeft: "10px", padding: "5px", width: "250px" }}
                />
                <span style={{ marginLeft: "10px" }}>
                  {whitelistResult === null
                    ? ""
                    : whitelistResult === "Error"
                    ? "Failed to load"
                    : whitelistResult}
                </span>
              </div>
            </div>
            <button
              onClick={fetchWhitelistStatus}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px" }}
            >
              Query
            </button>
          </div>
        </div>
      </main>

      <footer style={{ padding: "10px", textAlign: "center", color: "#666", fontSize: "14px" }}>
        <div>
          <div style={{ marginBottom: "10px" }}>
            <Link
              href="/"
              className={styles.footerLink}
              style={{ color: "#fff", fontSize: "28px" }}
            >
              Portal
            </Link>
          </div>
          <a href="https://www.kilt.io/imprint" className={styles.footerLink}>Imprint</a>
          {" | "}
          <a href="https://www.kilt.io/privacy-policy" className={styles.footerLink}>Privacy Policy</a>
          {" | "}
          <a href="https://www.kilt.io/disclaimer" className={styles.footerLink}>Disclaimer</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Homepage</a>
          {" | "}
          <a href="https://www.kilt.io" className={styles.footerLink}>Security Audit</a>
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
