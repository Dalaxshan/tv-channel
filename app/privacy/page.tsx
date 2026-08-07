import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-3xl pb-24 pt-32 lg:pt-40">
      <h1 className="font-display text-4xl font-bold">Privacy Policy</h1>
      <div className="prose prose-invert mt-6 max-w-none text-text-muted">
        <p>
          This is placeholder legal copy for the Privacy Policy page. Replace this
          content with your organization&apos;s actual policy before launch.
        </p>
        <p>
          TV Channel is committed to protecting your privacy and being
          transparent about how our platform works. For questions, please
          reach out via our Contact page.
        </p>
      </div>
    </div>
  );
}
