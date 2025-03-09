import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={{
        chainId: 84532,
        rpc: ["https://sepolia.base.org"],
        nativeCurrency: {
          decimals: 18,
          name: "Ether",
          symbol: "ETH",
        },
        shortName: "base-sepolia",
        slug: "base-sepolia",
        testnet: true,
        chain: "Base Sepolia",
        name: "Base Sepolia Testnet",
      }}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
