import LegalPageTemplate from '@/components/layout/LegalPageTemplate';

export default function CookiePolicyPage() {
  return (
    <LegalPageTemplate title="Cookie Policy" lastUpdated="February 20, 2026">
        <h3>1. What Are Cookies</h3>
        <p>
            Cookies are small details that are saved on your device (computer or mobile device). They allow the website to recognize your device and remember whether you have been to the website before.
        </p>
        
        <h3>2. How We Use Cookies</h3>
        <p>
            We use cookies to:
        </p>
        <ul>
            <li>Keep you signed in.</li>
            <li>Understand how you use our website.</li>
            <li>Show you content that is relevant to you.</li>
            <li>Make our website work better.</li>
        </ul>

        <h3>3. Types of Cookies We Use</h3>
        <ul>
            <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.</li>
            <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
            <li><strong>Functional Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
        </ul>

        <h3>4. Managing Cookies</h3>
        <p>
            You can set your browser not to accept cookies. However, some of our website features may not function as a result.
        </p>
    </LegalPageTemplate>
  );
}
