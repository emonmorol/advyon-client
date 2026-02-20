import LegalPageTemplate from '@/components/layout/LegalPageTemplate';

export default function SecurityPage() {
  return (
    <LegalPageTemplate title="Security & Compliance" lastUpdated="February 20, 2026">
        <h3>1. Our Commitment</h3>
        <p>
            At Advyon, security is not an afterthought; it is the foundation of our platform. We understand that as legal professionals, confidentiality and data integrity are your ethical and professional obligations. We utilize state-of-the-art security measures to ensure your data is protected.
        </p>
        
        <h3>2. Encryption</h3>
        <p>
            We employ **AES-256 encryption** for all data at rest and **TLS 1.3** for all data in transit. This ensures that your documents, client communications, and case files are readable only by authorized personnel.
        </p>

        <h3>3. Compliance Certifications</h3>
        <p>
            Advyon is committed to maintaining the highest standards of compliance. We are currently:
        </p>
        <ul>
            <li><strong>SOC 2 Type II:</strong> Compliant (Audit pending).</li>
            <li><strong>GDPR:</strong> Fully compliant for our European users.</li>
            <li><strong>HIPAA:</strong> Capable of supporting HIPAA-compliant workflows for medical malpractice or health law practices.</li>
        </ul>

        <h3>4. Access Control</h3>
        <p>
            Our platform provides granular access controls, allowing you to define exactly who can view, edit, or delete specific documents and cases. We also support:
        </p>
        <ul>
            <li>Multi-Factor Authentication (MFA)</li>
            <li>Single Sign-On (SSO) for Enterprise plans</li>
            <li>Detailed Audit Logs</li>
        </ul>
    </LegalPageTemplate>
  );
}
