import LegalPageTemplate from '@/components/layout/LegalPageTemplate';

export default function AccessibilityPage() {
  return (
    <LegalPageTemplate title="Accessibility Statement" lastUpdated="February 20, 2026">
        <p>
            Advyon is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone, and applying the relevant accessibility standards.
        </p>
        
        <h3>1. Conformance Status</h3>
        <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance: Level A, Level AA, and Level AAA. Advyon is partially conformant with WCAG 2.1 level AA. Partially conformant means that some parts of the content do not fully conform to the accessibility standard.
        </p>

        <h3>2. Feedback</h3>
        <p>
            We welcome your feedback on the accessibility of Advyon. Please let us know if you encounter accessibility barriers on Advyon:
        </p>
        <ul>
            <li>E-mail: accessibility@advyon.com</li>
            <li>Postal address: 123 Legal Tech Way, San Francisco, CA 94107</li>
        </ul>

        <h3>3. Compatibility with Browsers and Assistive Technology</h3>
        <p>
            Advyon is designed to be compatible with the following assistive technologies:
        </p>
        <ul>
            <li>Screen readers (VoiceOver, NVDA, JAWS)</li>
            <li>Keyboard navigation</li>
            <li>Screen magnifiers</li>
        </ul>
        <p>
            Advyon is not compatible with:
        </p>
        <ul>
            <li>Browsers older than 3 major versions</li>
            <li>Mobile operating systems older than 5 years</li>
        </ul>
    </LegalPageTemplate>
  );
}
