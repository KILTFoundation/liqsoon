import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function PrivacyPolicy() {
  return (
    <div
      className={styles.backgroundGlitch}
      style={{
        backgroundImage: "url('/bg1.png')",
        backgroundColor: "#000",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        fontFamily: "'Courier New', monospace",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "20px",
          minHeight: "80px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Image
            src="/KILT-Horizontal-white.png"
            alt="KILT Logo"
            width={300}
            height={60}
            style={{ height: "auto" }}
          />
        </div>
      </header>
      <main
        style={{
          maxWidth: "1200px",
          margin: "5px auto",
          padding: "0 20px",
          textAlign: "left",
          position: "relative",
          zIndex: 2,
          flex: "1 0 auto",
        }}
      >
        <h1 className={styles.glitch} data-glitch="Privacy Policy">
          Privacy Policy
        </h1>
        <div style={{ fontSize: "16px", lineHeight: "1.6" }}>
          <h2>KILT Foundation Liquidity Portal – Privacy Policy</h2>
          <p><strong>Effective Date: August 11, 2025</strong></p>
          <p>
            The KILT Foundation (“we,” “us,” or “our”) operates the Liquidity Portal at <a href="https://liq.kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>liq.kilt.io</a> (the “Portal”), a platform enabling users to provide liquidity for the KILT token and earn rewards from transaction fees. We are committed to protecting your privacy and ensuring transparency about how we collect, use, store, and protect your personal information. This Privacy Policy applies to all users of the Portal, including those participating in beta testing programs and general liquidity provisioning.
          </p>
          <h3>1. Information We Collect</h3>
          <p>We collect information to facilitate your participation in the Liquidity Portal and to administer the platform effectively. The information we collect includes:</p>
          <h4>1.1 Information You Provide Directly</h4>
          <ul>
            <li><strong>Beta Testing Application Form:</strong></li>
            <ul>
              <li>Telegram handle (to contact you and add you to a testing group)</li>
              <li>Wallet addresses on the Base network (to whitelist for participation and distribute rewards)</li>
              <li>Estimated liquidity amount in USD (to assess participation capacity)</li>
            </ul>
            <li><strong>Portal Usage:</strong></li>
            <ul>
              <li>Wallet addresses used for liquidity provisioning</li>
              <li>Transaction details related to liquidity positions (amount, range, duration)</li>
              <li>Contact information (email or Telegram handle) if you reach out to us or participate in communications</li>
            </ul>
            <li><strong>Optional Information:</strong></li>
            <ul>
              <li>Feedback or survey responses about the Portal</li>
              <li>Additional contact details if provided for support or program updates</li>
            </ul>
          </ul>
          <h4>1.2 Information Collected Automatically</h4>
          <p>When you interact with the Portal, we may collect:</p>
          <ul>
            <li><strong>Technical Data:</strong> IP address, browser type, device type, operating system, and other technical information.</li>
            <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Portal, and transaction activities (liquidity added or withdrawn).</li>
            <li><strong>Blockchain Data:</strong> Publicly available information from the Base network, such as transaction details linked to your wallet address (liquidity provided, rewards earned).</li>
          </ul>
          <h4>1.3 Information from Third Parties</h4>
          <ul>
            <li><strong>Blockchain Analytics:</strong> We may use third-party analytics providers to analyze on-chain activity (liquidity composition, position duration) to calculate rewards or improve the Portal.</li>
            <li><strong>Communication Platforms:</strong> If you join our Telegram group or other communication channels, we may receive information about your participation (Telegram handle or activity).</li>
          </ul>
          <h3>2. How We Use Your Information</h3>
          <p>We use your information to provide, improve, and secure the Liquidity Portal and its services. Specific purposes include:</p>
          <ul>
            <li><strong>Facilitating Participation:</strong></li>
            <ul>
              <li>Processing beta testing applications, whitelisting wallet addresses, and managing participation in the rewards program.</li>
              <li>Administering liquidity provisioning and distributing KILT token rewards based on factors like liquidity composition, position range, and duration.</li>
            </ul>
            <li><strong>Communication:</strong></li>
            <ul>
              <li>Contacting you via email or Telegram to provide updates, instructions, or support related to the Portal or beta testing.</li>
              <li>Managing Telegram groups for beta testers or community engagement.</li>
            </ul>
            <li><strong>Platform Improvement:</strong></li>
            <ul>
              <li>Analyzing usage data to enhance the Portal’s functionality, user experience, and reward system.</li>
              <li>Using feedback or survey responses to refine features or address issues.</li>
            </ul>
            <li><strong>Security and Compliance:</strong></li>
            <ul>
              <li>Monitoring for fraudulent activity or unauthorized access to protect users and the Portal.</li>
              <li>Complying with legal obligations, such as tax reporting or anti-money laundering (AML) requirements, where applicable.</li>
            </ul>
            <li><strong>Analytics:</strong></li>
            <ul>
              <li>Aggregating anonymized data to analyze trends, liquidity pool performance, or user behavior to optimize the Portal.</li>
            </ul>
          </ul>
          <h3>3. How We Share Your Information</h3>
          <p>We do not sell your personal information to third parties. However, we may share your information in the following circumstances:</p>
          <ul>
            <li><strong>With Service Providers:</strong></li>
            <ul>
              <li>Third-party providers (blockchain analytics tools, cloud storage providers, or communication platforms like Telegram) that assist in operating the Portal, processing transactions, or managing communications. These providers are contractually obligated to protect your data and use it only for the purposes we specify.</li>
            </ul>
            <li><strong>Within the KILT Foundation:</strong></li>
            <ul>
              <li>Authorized team members or contractors who need access to your information to administer the Portal, process rewards, or provide support.</li>
            </ul>
            <li><strong>With Blockchain Networks:</strong></li>
            <ul>
              <li>Wallet addresses and transaction details are inherently public on the Base network. Any liquidity provision or reward distribution will be recorded on the blockchain and visible to anyone.</li>
            </ul>
            <li><strong>For Legal Purposes:</strong></li>
            <ul>
              <li>If required by law, regulation, or legal process (court orders, tax reporting, or AML compliance), we may disclose your information to authorities.</li>
              <li>To protect the rights, property, or safety of the KILT Foundation, our users, or the public (to investigate fraud or security breaches).</li>
            </ul>
          </ul>
          <h3>4. Data Security</h3>
          <p>We implement reasonable technical and organizational measures to protect your information, including:</p>
          <ul>
            <li>Encryption of sensitive data during transmission and storage.</li>
            <li>Access controls to limit who can view or process your information.</li>
            <li>Regular security assessments of the Portal and third-party services.</li>
          </ul>
          <p>
            However, no system is completely secure. Blockchain transactions are inherently public, and wallet addresses can be traced on the Base network. You are responsible for securing your wallet and private keys. The KILT Foundation is not liable for losses or breaches resulting from compromised wallets or external systems.
          </p>
          <h3>5. Data Retention</h3>
          <ul>
            <li><strong>Beta Testing Data:</strong> Information collected via the beta testing form (Telegram handle, wallet addresses, email) is retained for the duration of the beta program and up to 6 months afterward, unless required by law or you request deletion.</li>
            <li><strong>Portal Usage Data:</strong> Transaction and usage data may be retained for as long as necessary to administer rewards, comply with legal obligations, or analyze platform performance.</li>
            <li><strong>Anonymized Data:</strong> Aggregated or anonymized data (for analytics) may be retained indefinitely.</li>
          </ul>
          <p>
            You can request deletion of your personal information by contacting us at <a href="mailto:hello@kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>hello@kilt.io</a>, subject to legal or operational requirements.
          </p>
          <h3>6. Your Rights</h3>
          <p>Depending on your jurisdiction (GDPR for EU residents, CCPA for California residents), you may have the following rights regarding your personal information:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your data, subject to legal or operational constraints.</li>
            <li><strong>Restriction:</strong> Request that we limit the processing of your data.</li>
            <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
            <li><strong>Objection:</strong> Object to certain uses of your data (e.g., for analytics).</li>
          </ul>
          <p>
            To exercise these rights, contact us at <a href="mailto:hello@kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>hello@kilt.io</a>. We will respond within the timeframes required by applicable law.
          </p>
          <h3>7. International Data Transfers</h3>
          <p>
            The KILT Foundation may store or process your data in jurisdictions outside your country of residence. If you are in the European Economic Area (EEA), your data may be transferred to countries that may not have equivalent data protection laws. We ensure appropriate safeguards are in place to protect your data during such transfers.
          </p>
          <h3>8. Cookies and Tracking</h3>
          <p>
            The Portal may use cookies or similar technologies to enhance user experience, analyze usage, or track performance. You can manage cookie preferences through your browser settings. We may also use third-party analytics tools to collect anonymized usage data. Blockchain interactions are tracked on the public Base network and are not controlled by us.
          </p>
          <h3>9. Third-Party Links</h3>
          <p>
            The Portal or communications may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third parties. Review their privacy policies before providing information.
          </p>
          <h3>10. Children’s Privacy</h3>
          <p>
            The Liquidity Portal is not intended for individuals under 18. We do not knowingly collect personal information from minors. If you believe we have collected data from a minor, contact us at <a href="mailto:hello@kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>hello@kilt.io</a> to request deletion.
          </p>
          <h3>11. Changes to This Privacy Policy</h3>
          <p>
            We may update this Privacy Policy to reflect changes in our practices or legal requirements. The updated policy will be posted on <a href="https://liq.kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>liq.kilt.io</a> with a revised effective date. We encourage you to review this policy periodically.
          </p>
          <h3>12. Contact Us</h3>
          <p>For questions, concerns, or to exercise your data rights, contact us at:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:hello@kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>hello@kilt.io</a></li>
            <li><strong>Website:</strong> <a href="https://liq.kilt.io" style={{ color: "#f0f", textDecoration: "underline" }}>liq.kilt.io</a></li>
          </ul>
          <p>
            You may also have the right to lodge a complaint with a data protection authority in your jurisdiction. By using the Liquidity Portal or submitting forms, you consent to the collection, use, and processing of your information as described in this Privacy Policy.
          </p>
        </div>
      </main>
      <div className={styles.staticOverlay}></div>
      <footer
        style={{
          padding: "10px",
          textAlign: "center",
          color: "#fff",
          fontSize: "14px",
          position: "relative",
          zIndex: 2,
          flexShrink: 0,
        }}
      >
        <div>
          <a href="https://www.kilt.io" className={styles.footerLink} style={{ color: "#fff" }}>
            Home
          </a>
          {" | "}
          <a href="https://www.kilt.io/imprint" className={styles.footerLink} style={{ color: "#fff" }}>
            Imprint
          </a>
          {" | "}
          <Link href="/pp" passHref>
            <a className={styles.footerLink} style={{ color: "#fff" }}>
              Privacy Policy
            </a>
          </Link>
          {" | "}
          <Link href="/terms" passHref>
            <a className={styles.footerLink} style={{ color: "#fff" }}>
              Terms & Conditions
            </a>
          </Link>
          {" | "}
          <a href="https://www.kilt.io/disclaimer" className={styles.footerLink} style={{ color: "#fff" }}>
            Disclaimer
          </a>
        </div>
      </footer>
    </div>
  );
}
