import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | TV Channel",
  description: "Privacy Policy for our TV Channel website and mobile app.",
};

const sections = [
  {
    title: "1. Introduction",
    body: `This Privacy Policy explains how Our TvChannel, a broadcaster registered and operating in Sri Lanka, collects, uses, discloses and protects your personal data when you visit our website, use our mobile app, or otherwise interact with our services. We are committed to handling your data in accordance with the Personal Data Protection Act, No. 9 of 2019 of Sri Lanka ("PDPA") and other applicable laws.`,
  },
  {
    title: "2. Information We Collect",
    body: `We may collect: (a) account information such as your name, email address, phone number and date of birth when you register; (b) usage data including viewing history, bookmarks, watch time and device information; (c) technical data such as IP address, browser type, device identifiers and location (country/region) used to determine content availability; (d) payment information if you subscribe to premium content, processed through our third-party payment gateway; and (e) communications you send us, such as support requests or feedback.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use your information to: provide and personalise our streaming services (including live TV, on-demand episodes and schedule alerts); process subscriptions and payments; send notifications about programmes, schedules and offers; maintain the security and performance of our platform; comply with legal and regulatory obligations, including those of the Telecommunications Regulatory Commission of Sri Lanka (TRCSL) where applicable; and improve our content recommendations and app experience.`,
  },
  {
    title: "4. Legal Basis for Processing",
    body: `We process your personal data based on your consent, the performance of a contract with you (e.g. providing a subscription service), compliance with legal obligations, and our legitimate interests in operating and improving our services, in line with the PDPA.`,
  },
  {
    title: "5. Cookies and Tracking Technologies",
    body: `We use cookies, local storage and similar technologies to keep you signed in, remember your preferences (such as bookmarked shows), and analyse traffic. You can control cookies through your browser settings, though disabling them may affect certain features such as offline downloads or personalised recommendations.`,
  },
  {
    title: "6. Sharing of Information",
    body: `We do not sell your personal data. We may share information with: service providers who help us operate the platform (hosting, analytics, payment processing, push notifications); regulatory or government authorities in Sri Lanka where required by law; and content partners solely to the extent needed to report aggregated, non-identifying viewership statistics.`,
  },
  {
    title: "7. Data Retention",
    body: `We retain your personal data only for as long as necessary to fulfil the purposes described in this policy, or as required by Sri Lankan law, after which it is securely deleted or anonymised.`,
  },
  {
    title: "8. Data Storage and International Transfers",
    body: `Your data may be stored on servers located within or outside Sri Lanka, including cloud infrastructure providers. Where data is transferred outside Sri Lanka, we take reasonable steps to ensure it receives an equivalent level of protection as required under the PDPA.`,
  },
  {
    title: "9. Your Rights",
    body: `Subject to the PDPA, you have the right to access, correct, or request deletion of your personal data, to withdraw consent at any time, and to object to certain processing activities. To exercise these rights, contact us using the details below.`,
  },
  {
    title: "10. Children's Privacy",
    body: `Our services are not directed at children under 16 without parental consent. We do not knowingly collect personal data from children without appropriate consent from a parent or guardian.`,
  },
  {
    title: "11. Security",
    body: `We implement reasonable technical and organisational measures to protect your data against unauthorised access, alteration, disclosure or destruction. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.`,
  },
  {
    title: "12. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Material changes will be notified through the app or website. Continued use of our services after such changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "13. Contact Us",
    body: `If you have questions about this Privacy Policy or wish to exercise your data protection rights, please contact us at:
TV Channel Support Team
236/1 Denzil Kobbekaduwa Mawatha, Battaramulla 10120
Email: support@tvchannel.lk
Phone: +94 77 123 4567`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <section className="container-page py-12 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          Legal
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          Last updated:{" "}
          {new Date().toLocaleDateString("en-LK", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-lg font-semibold text-text">{s.title}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-muted">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
