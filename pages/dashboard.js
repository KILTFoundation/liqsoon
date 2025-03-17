import { useState, useEffect } from "react";
import { useContract } from "@thirdweb-dev/react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

const MIGRATION_ABI = [
  { constant: true, inputs: [], name: "BURN_ADDRESS", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "EXCHANGE_RATE_NUMERATOR", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "EXCHANGE_RATE_DENOMINATOR", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "isMigrationActive", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "newToken", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "oldToken", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [], name: "paused", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { constant: true, inputs: [{ name: "addr", type: "address" }], name: "whitelist", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" }
];

const OLD_KILT_ABI = [
  { constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
];

export default function Dashboard() {
  const [burnAddress, setBurnAddress] = useState(null);
  const [exchangeRateNumerator, setExchangeRateNumerator] = useState(null);
  const [exchangeRateDenominator, setExchangeRateDenominator] = useState(null);
  const [isMigrationActive, setIsMigrationActive] = useState(null);
  const [newToken, setNewToken] = useState(null);
  const [oldToken, setOldToken] = useState(null);
  const [isPaused, setIsPaused] = useState(null);
  const [whitelistAddress, setWhitelistAddress] = useState("");
  const [whitelistResult, setWhitelistResult] = useState(null);
  const [burnAddressBalance, setBurnAddressBalance] = useState(null);

  const TOTAL_KILT_SUPPLY = 164000000;

  const { contract: migrationContract, isLoading: migrationLoading } = useContract("0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b", MIGRATION_ABI);
  const { contract: oldKiltContract, isLoading: oldKiltLoading } = useContract("0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b", OLD_KILT_ABI);

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
      const paused = await migrationContract.call("paused");
      setIsPaused(paused);
    } catch (err) {
      console.error("Data fetch error:", err.message);
      setBurnAddress("Error");
      setExchangeRateNumerator("Error");
      setExchangeRateDenominator("Error");
      setIsMigrationActive("Error");
      setNewToken("Error");
      setOldToken("Error");
      setIsPaused("Error");
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

  const fetchBurnAddressBalance = async () => {
    if (!migrationContract || !oldKiltContract || burnAddress === null) {
      setBurnAddressBalance(null);
      return;
    }
    try {
      const bal = await oldKiltContract.call("balanceOf", [burnAddress]);
      const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal);
      const normalized = Number(balanceValue) / 10 ** 18;
      setBurnAddressBalance(normalized);
    } catch (err) {
      console.error("Burn address balance fetch error:", err.message);
      setBurnAddressBalance("Error");
    }
  };

  const handleButtonClick = (e, fetchFunction) => {
    e.currentTarget.classList.remove("bounce");
    void e.currentTarget.offsetWidth;
    e.currentTarget.classList.add("bounce");
    fetchFunction();
  };

  useEffect(() => {
    fetchContractData();
  }, [migrationContract]);

  useEffect(() => {
    if (burnAddress && burnAddress !== "Error") {
      fetchBurnAddressBalance();
    }
  }, [migrationContract, oldKiltContract, burnAddress]);

  const calculatePercentage = () => {
    if (burnAddressBalance === null || burnAddressBalance === "Error") return "N/A";
    const percentage = (burnAddressBalance / TOTAL_KILT_SUPPLY) * 100;
    return percentage.toFixed(2);
  };

  return (
    <div style={{ 
      backgroundImage: "url('/tartanbackground.png')",
      backgroundColor: "#000",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif"
    }}>
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img src="/KILT-Horizontal-black.png" alt="KILT Logo" style={{ width: "200px", height: "auto" }} />
      </header>

      <main>
        <div className={styles.container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Dashboard</p>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
              <div style={{ background: "rgba(19, 87, 187, 0.65)", padding: "15px", borderRadius: "8px", width: "500px", textAlign: "left", color: "#fff" }}>
                <div>
                  <span style={{ fontWeight: "bold" }}>Migration Progress: </span>
                  <span>
                    {oldKiltLoading || migrationLoading ? "Contract loading..." : burnAddressBalance === null ? "Loading..." : burnAddressBalance === "Error" ? "Failed to load" : `${burnAddressBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} KILT / ${calculatePercentage()}%`}
                  </span>
                </div>
              </div>
              <button
                onClick={(e) => handleButtonClick(e, fetchBurnAddressBalance)}
                className={styles.card}
                style={{ marginLeft: "10px", padding: "10px 20px", width: "80px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                Query
              </button>
            </div>
            <p style={{ color: "#fff" }}><span style={{ fontWeight: "bold" }}>Migration Contract: </span>0xe9a37bde0b9daa20e226608d04aec6358928c82b</p>
          </div>
          {migrationLoading && <p style={{ textAlign: "center", color: "#fff" }}>Loading contract...</p>}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{ background: "rgba(19, 87, 187, 0.65)", padding: "15px", borderRadius: "8px", width: "500px", textAlign: "left", color: "#fff" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>newToken: </span>
                <span>{newToken === null ? "Loading..." : newToken === "Error" ? "Failed to load" : newToken}</span>
              </div>
            </div>
            <button
              onClick={(e) => handleButtonClick(e, fetchContractData)}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px", width: "80px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              Query
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{ background: "rgba(19, 87, 187, 0.65)", padding: "15px", borderRadius: "8px", width: "500px", textAlign: "left", color: "#fff" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>oldToken: </span>
                <span>{oldToken === null ? "Loading..." : oldToken === "Error" ? "Failed to load" : oldToken}</span>
              </div>
            </div>
            <button
              onClick={(e) => handleButtonClick(e, fetchContractData)}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px", width: "80px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              Query
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", margin: "20px 0" }}>
            <div style={{ background: "rgba(19, 87, 187, 0.65)", padding: "15px", borderRadius: "8px", width: "500px", textAlign: "left", color: "#fff" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>EXCHANGE_RATE_NUMERATOR: </span>
                <span>{exchangeRateNumerator === null ? "Loading..." : exchangeRateNumerator === "Error" ? "Failed to load" : exchangeRateNumerator}</span>
              </div>
            </div>
            <button
              onClick={(e) => handleButtonClick(e, fetchContractData)}
              className={styles.card}
              style={{ marginLeft: "10px", padding: "10px 20px", width: "80px", height: "40px", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              Query
            </button>
          </div>
