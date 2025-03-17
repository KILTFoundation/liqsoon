import { useState, useEffect } from "react"; // React hooks for state and lifecycle management
import { useContract } from "@thirdweb-dev/react"; // Thirdweb hook for smart contract interaction
import Link from "next/link"; // Next.js component for client-side navigation
import styles from "../styles/Home.module.css"; // CSS module for shared styles

// ABI for the migration contract, defining its view functions
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

// ABI for the old KILT token contract, used to check balances
const OLD_KILT_ABI = [
  { constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
];

// Main Dashboard component
export default function Dashboard() {
  // State variables for storing contract data
  const [burnAddress, setBurnAddress] = useState(null); // Address where old tokens are burned
  const [exchangeRateNumerator, setExchangeRateNumerator] = useState(null); // Numerator of the migration exchange rate (e.g., 175 for 1:1.75)
  const [exchangeRateDenominator, setExchangeRateDenominator] = useState(null); // Denominator of the exchange rate (e.g., 100)
  const [isMigrationActive, setIsMigrationActive] = useState(null); // Boolean indicating if migration is ongoing
  const [newToken, setNewToken] = useState(null); // Address of the new KILT token
  const [oldToken, setOldToken] = useState(null); // Address of the old KILT token
  const [isPaused, setIsPaused] = useState(null); // Boolean indicating if migration is paused
  const [whitelistAddress, setWhitelistAddress] = useState(""); // User-input address to check whitelist status
  const [whitelistResult, setWhitelistResult] = useState(null); // Result of whitelist check (true/false)
  const [burnAddressBalance, setBurnAddressBalance] = useState(null); // Balance of old tokens at burn address

  // Constant for total KILT supply, used to calculate migration progress percentage
  const TOTAL_KILT_SUPPLY = 164000000;

  // Thirdweb hooks to connect to the smart contracts
  const { contract: migrationContract, isLoading: migrationLoading } = useContract(
    "0xE9a37BDe0B9dAa20e226608d04AEC6358928c82b", // Migration contract address
    MIGRATION_ABI
  );
  const { contract: oldKiltContract, isLoading: oldKiltLoading } = useContract(
    "0x944f601b4b0edb54ad3c15d76cd9ec4c3df7b24b", // Old KILT token address
    OLD_KILT_ABI
  );

  // Function to fetch all contract data except whitelist status
  const fetchAllData = async () => {
    // Ensure both contracts are loaded before fetching
    if (!migrationContract || !oldKiltContract) return;

    try {
      // Fetch burn address and set state
      const burnAddr = await migrationContract.call("BURN_ADDRESS");
      setBurnAddress(burnAddr);

      // Fetch exchange rate numerator (e.g., 175) and convert to string for display
      const numerator = await migrationContract.call("EXCHANGE_RATE_NUMERATOR");
      setExchangeRateNumerator(numerator.toString());

      // Fetch exchange rate denominator (e.g., 100) and convert to string
      const denominator = await migrationContract.call("EXCHANGE_RATE_DENOMINATOR");
      setExchangeRateDenominator(denominator.toString());

      // Fetch migration active status (true/false)
      const migrationActive = await migrationContract.call("isMigrationActive");
      setIsMigrationActive(migrationActive);

      // Fetch new token address
      const newTok = await migrationContract.call("newToken");
      setNewToken(newTok);

      // Fetch old token address
      const oldTok = await migrationContract.call("oldToken");
      setOldToken(oldTok);

      // Fetch paused status (true/false)
      const paused = await migrationContract.call("paused");
      setIsPaused(paused);

      // Fetch balance of old tokens at burn address, normalize from wei to KILT
      const bal = await oldKiltContract.call("balanceOf", [burnAddr]);
      const balanceValue = bal?._hex ? BigInt(bal._hex) : BigInt(bal); // Handle hex or bigint output
      const normalized = Number(balanceValue) / 10 ** 18; // Convert from wei (18 decimals)
      setBurnAddressBalance(normalized);
    } catch (err) {
      // Log error and set all states to "Error" for user feedback
      console.error("Data fetch error:", err.message);
      setBurnAddress("Error");
      setExchangeRateNumerator("Error");
      setExchangeRateDenominator("Error");
      setIsMigrationActive("Error");
      setNewToken("Error");
      setOldToken("Error");
      setIsPaused("Error");
      setBurnAddressBalance("Error");
    }
  };

  // Function to check if an address is whitelisted
  const fetchWhitelistStatus = async () => {
    // Skip if no contract or empty address input
    if (!migrationContract || !whitelistAddress) return;

    try {
      // Call whitelist function with user-provided address
      const result = await migrationContract.call("whitelist", [whitelistAddress]);
      setWhitelistResult(result.toString()); // Convert boolean to string for display
    } catch (err) {
      // Log error and show "Error" to user
      console.error("Whitelist fetch error:", err.message);
      setWhitelistResult("Error");
    }
  };

  // Handler for button clicks to trigger bounce animation and fetch function
  const handleButtonClick = (e, fetchFunction) => {
    // Remove bounce class to reset animation
    e.currentTarget.classList.remove("bounce");
    // Force reflow to ensure animation restarts
    void e.currentTarget.offsetWidth;
    // Add bounce class to trigger animation
    e.currentTarget.classList.add("bounce");
    // Execute the provided fetch function
    fetchFunction();
  };

  // Effect to fetch all data on component mount or when contracts load
  useEffect(() => {
    fetchAllData();
  }, [migrationContract, oldKiltContract]); // Dependencies ensure fetch runs when contracts are ready

  // Calculate percentage of total supply burned for Migration Progress
  const calculatePercentage = () => {
    if (burnAddressBalance === null || burnAddressBalance === "Error") return "N/A"; // Handle loading or error states
    const percentage = (burnAddressBalance / TOTAL_KILT_SUPPLY) * 100; // Convert to percentage
    return percentage.toFixed(2); // Round to 2 decimal places
  };

  // Render the dashboard UI
  return (
    <div style={{ 
      backgroundImage: "url('/tartanbackground.png')", // Background tartan pattern
      backgroundColor: "#000", // Fallback color if image fails
      backgroundSize: "cover", // Cover entire viewport
      backgroundPosition: "center", // Center the image
      backgroundRepeat: "no-repeat", // Prevent tiling
      backgroundAttachment: "fixed", // Fixed position for parallax effect
      minHeight: "100vh", // Full viewport height
      fontFamily: "Arial, sans-serif" // Consistent font
    }}>
      {/* Header with KILT logo */}
      <header style={{ padding: "20px", textAlign: "center", backgroundColor: "#D73D80", color: "#fff" }}>
        <img src="/KILT-Horizontal-black.png" alt="KILT Logo" style={{ width: "200px", height: "auto" }} />
      </header>

      <main>
        <div className={styles.container}> {/* Container for layout consistency */}
          {/* Top section with title, contract address, and refresh button */}
          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ fontSize: "32px", fontWeight: "bold" }}>Migration Dashboard</p>
            <p style={{ color: "#fff" }}>
              <span style={{ fontWeight: "bold" }}>Migration Contract: </span>0xe9a37bde0b9daa20e226608d04aec6358928c82b
            </p>
            {/* Button to refresh all data except whitelist */}
            <button
              onClick={(e) => handleButtonClick(e, fetchAllData)} // Trigger bounce and fetch
              className={styles.card} // Apply card styles
