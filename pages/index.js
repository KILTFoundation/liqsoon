import { ConnectWallet, useNetwork } from "@thirdweb-dev/react";
import { useEffect } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";

export default function Home() {
  const [{ data: network }, switchNetwork] = useNetwork();

  useEffect(() => {
    if (network?.chain?.id !== 11155111) {
      if (switchNetwork) {
        switchNetwork(11155111); // Sepolia
      } else {
        window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }], // Sepolia
        });
      }
    }
  }, [network, switchNetwork]);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            Welcome to{" "}
            <span className={styles.gradientText0}>
              KILT Migration (Testnet)
            </span>
          </h1>
          <p className={styles.description}>
            Connect your wallet to migrate your old tokens on Sepolia.
          </p>
          <div className={styles.connect}>
            <ConnectWallet />
          </div>
        </div>
        <div className={styles.grid}>
          <a href="https://kilt.io/" className={styles.card} target="_blank" rel="noopener noreferrer">
            <Image src="/images/portal-preview.png" alt="KILT website" width={300} height={200} />
            <div className={styles.cardText}>
              <h2 className={styles.gradientText1}>KILT Home
