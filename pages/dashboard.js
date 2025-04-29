import { useState, useEffect } from "react";
import { useContract, useNetwork } from "@thirdweb-dev/react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

// ABI definitions (unchanged)
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
  const { chain } = useNetwork();
  const [networkError, setNetworkError] = useState(null);
  const [callErrors, setCallErrors] = useState({}); // Track specific call errors

  // Existing state variables
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

  const { contract: migrationContract, isLoading: migrationLoading } = useContract(
    "0x35Ad1fd3095F2caabf1F2Ed2FF0Be907E172582a",
    MIGRATION_ABI
  );
  const { contract: oldKiltContract, isLoading: oldKiltLoading } = useContract(
    "0x9E5189a77f698305Ef76510AFF1C528cff48779c",
    OLD_KILT_ABI
  );

  const fetchAllData = async () => {
    if (!migrationContract || !oldKiltContract) {
      console.log("Contracts not loaded yet");
      return;
    }
    if (chain?.id !== 8453) {
      setNetworkError("Wallet must be on Base Mainnet (chain ID: 8453)");
      return;
    }

    const callWithErrorHandling = async (callFn, setState, callName) => {
      try {
        const result = await callFn();
        console.log(`${callName} result:`, result);
        setState(result);
        setCallErrors((prev) => ({ ...prev, [callName]: null }));
        return result;
      } catch (err) {
        console.error(`${callName} error:`, err.message, err);
        setState("Error");
        setCallErrors((prev) => ({ ...prev, [callName]: err.message }));
        return null;
      }
    };

    const burnAddr = await callWithErrorHandling(
      () => migrationContract.call("BURN_ADDRESS"),
      setBurnAddress,
      "BURN_ADDRESS"
    );
    await callWithErrorHandling(
      () => migrationContract.call("EXCHANGE_RATE_NUMERATOR"),
      (val) => setExchangeRateNumerator(val.toString()),
      "EXCHANGE_RATE_NUMERATOR"
    );
    await callWithErrorHandling(
      () => migrationContract.call("EXCHANGE_RATE_DENOMINATOR"),
      (val) => setExchangeRateDenominator(val.toString()),
      "EXCHANGE_RATE_DENOMINATOR"
    );
    await callWithErrorHandling(
      () => migrationContract.call("isMigrationActive"),
      setIsMigrationActive,
      "isMigrationActive"
    );
    await callWithErrorHandling(
      () => migrationContract.call("newToken"),
      setNewToken,
      "newToken"
    );
    await callWithErrorHandling(
      () => migrationContract.call("oldToken"),
      setOldToken,
      "oldToken"
    );
    await callWithErrorHandling(
      () => migrationContract.call("paused"),
      setIsPaused,
      "paused"
    );

    if (burnAddr && burnAddr !== "Error") {
      await callWithErrorHandling(
        () => oldKiltContract.call("balanceOf", [burnAddr]),
        (bal) => {
          const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal);
          const normalized = Number(balanceValue) / 10 ** 15; // Correct for old KILT (15 decimals)
          setBurnAddressBalance(normalized);
        },
        "balanceOf"
      );
    } else {
      console.error("Skipping balanceOf: Invalid burn address");
      setBurnAddressBalance("Error");
      setCallErrors((prev) => ({ ...prev, balanceOf: "Invalid burn address" }));
    }
  };

  const fetchWhitelistStatus = async () => {
    if (!migrationContract || !whitelistAddress || chain?.id !== 8453) {
      setNetworkError("Wallet must be on Base Mainnet (chain ID: 8453)");
      return;
    }
    await callWithErrorHandling(
      () => migrationContract.call("whitelist", [whitelistAddress]),
      (result) => setWhitelistResult(result.toString()),
      "whitelist"
    );
  };

  const handleButtonClick = (e, fetchFunction) => {
    if (chain?.id !== 8453) {
      setNetworkError("Wallet must be on Base Mainnet (chain ID: 8453)");
      return;
    }
    e.currentTarget.classList.remove("bounce");
    void e.currentTarget.offsetWidth;
    e.currentTarget.classList.add("bounce");
    fetchFunction();
  };

  useEffect(() => {
    console.log("Current chain ID:", chain?.id);
    fetchAllData();
  }, [migrationContract, oldKiltContract, chain]);

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
      {networkError && (
        <div style={{
          background: "#D73D80",
          padding: "15px",
          borderRadius: "8px",
          margin: "20px auto",
          width: "500px",
          textAlign: "center",
          color: "#fff"
        }}>
          <p style={{ fontWeight: "bold" }}>Network Error</p>
          <p>{networkError}</p>
        </div>
      )}
      {Object.keys(callErrors).length > 0 && (
        <div style={{
          background: "#D73D80",
          padding: "15px",
          borderRadius: "8px",
          margin: "20px auto",
          width: "600px",
          textAlign: "left",
          color: "#fff"
        }}>
          <p style={{ fontWeight: "bold" }}>Contract Call Errors:</p>
          {Object.entries(callErrors).map(([callName, error]) => (
            error && <p key={callName}>{callName}: {error}</p>
          ))}
        </div>
      )}
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img src="/KILT-Horizontal-black.png" alt="KILT Logo" style={{ width: "200px", height: "auto" }} />
      </header>
      <main>
        <div className={styles.container}>
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Dashboard</p>
            <p style={{ color: "#fff" }}>
              <span style={{ fontWeight: "bold" }}>Migration Contract: </span>0x35Ad1fd3095F2caabf1F2Ed2FF0Be907E172582a
            </p>
            <button
              onClick={(e) => handleButtonClick(e, fetchAllData)}
              className={styles.card}
              style={{
                margin: "10px auto",
                padding: "10px 20px",
                width: "150px",
                height: "40px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#DAF525",
                fontSize: "16px"
              }}
            >
              Refresh Data
            </button>
          </div>
          {migrationLoading && <p style={{ textAlign: "center", color: "#fff" }}>Loading contract...</p>}
          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <div style={{ background: "rgba(19, 87, 187, 0.65)", padding: "15px", borderRadius: "8px", width: "600px", textAlign: "left", color: "#fff" }}>
              <div>
                <span style={{ fontWeight: "bold" }}>Migration Progress: </span>
                <span>
                  {oldKiltLoading || migrationLoading ? "Contract loading..."
                    : burnAddressBalance === null ? "Loading..."
                    : burnAddressBalance === "Error" ? "Failed to load"
                    : `${burnAddressBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })} KILT / ${calculatePercentage()}%`}
                </span>
              </div>
            </div>
          </div>
          {/* ... add back your other cards (newToken, oldToken, etc.) */}
        </div>
      </main>
      {/* ... your original footer and styles */}
    </div>
  );
}
