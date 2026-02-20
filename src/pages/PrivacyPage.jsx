import LegalPageTemplate from '@/components/layout/LegalPageTemplate';

export default function PrivacyPage() {
  return (
    <LegalPageTemplate title="Privacy Policy" lastUpdated="February 20, 2026">
        <h3>1. Introduction</h3>
        <p>
            Advyon ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our legal practice management platform.
        </p>
        
        <h3>2. Information We Collect</h3>
        <p>
            We collect information that identifies, relates to, describes, references, is capable of being associated with, or could reasonably be linked, directly or indirectly, with a particular consumer or device ("personal information").
        </p>
        <ul>
            <li><strong>Identifiers:</strong> Name, postal address, unique personal identifier, online identifier, IP address, email address, account name.</li>
            <li><strong>Commercial Information:</strong> Records of products or services purchased, obtained, or considered.</li>
            <li><strong>Internet Activity:</strong> Browsing history, search history, information on a consumer's interaction with a website, application, or advertisement.</li>
            <li><strong>Professional Data:</strong> Bar association membership numbers, firm affiliation, and practice areas.</li>
        </ul>

        <h3>3. How We Use Your Information</h3>
        <p>
            We use the information we collect to:
        </p>
        <ul>
            <li>Provide, operate, and maintain our website and platform.</li>
            <li>Improve, personalize, and expand our website and platform.</li>
            <li>Understand and analyze how you use our website and platform.</li>
            <li>Develop new products, services, features, and functionality.</li>
            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
        </ul>

        <h3>4. Data Security</h3>
        <p>
            We implement appropriate technical and organizational measures to protect your personal information against accidental or unlawful destruction, loss, change, or damage. All data is encrypted at rest and in transit using industry-standard protocols.
        </p>
    </LegalPageTemplate>
  );
}
