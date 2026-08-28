import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | TV Channel",
  description:
    "Terms and Conditions for our TV Channel website and mobile app.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the TV Channel website, mobile app, or any related services (collectively, the "Service"), you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree, please do not use the Service. These Terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 16 years old, or have the consent of a parent or legal guardian, to create an account. By using the Service, you confirm that the information you provide is accurate and that you have the legal capacity to enter into these Terms.`,
  },
  {
    title: "3. Description of Service",
    body: `The Service provides access to live television broadcasts, on-demand episodes, schedules, and related features such as bookmarking and offline downloads, made available for viewing within Sri Lanka and, where licensing permits, to viewers abroad. Content availability may vary by region due to broadcasting rights and regulatory restrictions.`,
  },
  {
    title: "4. Account Registration",
    body: `You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Notify us immediately of any unauthorised use of your account.`,
  },
  {
    title: "5. Subscription and Payments",
    body: `Certain content or features may require a paid subscription. Prices are listed in Sri Lankan Rupees (LKR) unless stated otherwise and are inclusive of applicable taxes where required by law. Subscriptions renew automatically unless cancelled before the renewal date. Refunds are provided only where required by applicable Sri Lankan consumer protection law.`,
  },
  {
    title: "6. Content Ownership and Intellectual Property",
    body: `All content available through the Service, including video, audio, graphics, logos and the "TV Channel" trademark, is owned by us or our licensors and is protected under the Intellectual Property Act, No. 36 of 2003 of Sri Lanka and applicable international copyright laws. You may not copy, redistribute, broadcast, download outside the app's intended offline feature, or otherwise exploit any content without our prior written consent.`,
  },
  {
    title: "7. Permitted Use of Downloads",
    body: `Where the app permits offline downloads, this content is licensed to you strictly for personal, non-commercial viewing within the app. Downloaded content may expire, be time-limited, or be subject to digital rights management (DRM), and may not be extracted, shared, or redistributed.`,
  },
  {
    title: "8. User Conduct",
    body: `You agree not to: use the Service for any unlawful purpose; attempt to circumvent geographic or DRM restrictions; upload or transmit harmful code; scrape, reverse-engineer, or resell access to the Service; or use the Service in any way that infringes the rights of others or violates Sri Lankan law, including the Computer Crimes Act, No. 24 of 2007.`,
  },
  {
    title: "9. Advertisements and Third-Party Links",
    body: `The Service may display advertisements or links to third-party websites. We are not responsible for the content, accuracy, or practices of third parties, and your interactions with them are solely between you and that third party.`,
  },
  {
    title: "10. Service Availability",
    body: `We aim to provide uninterrupted access to live broadcasts and on-demand content but do not guarantee that the Service will always be available, error-free, or uninterrupted, particularly during scheduled maintenance, technical failures, or events outside our reasonable control.`,
  },
  {
    title: "11. Limitation of Liability",
    body: `To the maximum extent permitted under Sri Lankan law, TV Channel shall not be liable for any indirect, incidental, or consequential damages arising from your use of, or inability to use, the Service, including loss of data, missed broadcasts, or service interruptions.`,
  },
  {
    title: "12. Termination",
    body: `We reserve the right to suspend or terminate your account if you violate these Terms, engage in fraudulent activity, or misuse the Service. You may also close your account at any time by contacting our support team.`,
  },
  {
    title: "13. Changes to These Terms",
    body: `We may revise these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms. We will make reasonable efforts to notify users of material changes.`,
  },
  {
    title: "14. Governing Law and Jurisdiction",
    body: `These Terms are governed by and construed in accordance with the laws of Sri Lanka. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of Colombo, Sri Lanka.`,
  },
  {
    title: "15. Contact Us",
    body: `For questions about these Terms & Conditions, please contact:
TV Channel Support Team
236/1 Denzil Kobbekaduwa Mawatha, Battaramulla 10120
Email: support@tvchannel.lk
Phone: +94 77 123 4567`,
  },
];

export default function TermsAndConditionsPage() {
  return (
    <section className="container-page py-12 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-light">
          Legal
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
          Terms & Conditions
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
