import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// NEO Esports — Policies & About pages (single-file React preview)
// Tailwind classes used for styling. Drop into a React + Tailwind project.

const SiteHeader = () => (
  <header className="bg-gradient-to-r from-pink-500 to-violet-600 text-white py-6 shadow-md">
    <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
      <Link to="/" className="text-2xl font-extrabold tracking-tight">NEO Esports</Link>
      <nav className="space-x-4">
        <Link to="/return" className="px-3 py-2 rounded-md hover:bg-white/20">Return</Link>
        <Link to="/refund" className="px-3 py-2 rounded-md hover:bg-white/20">Refund</Link>
        <Link to="/privacy" className="px-3 py-2 rounded-md hover:bg-white/20">Privacy</Link>
        <Link to="/disclaimer" className="px-3 py-2 rounded-md hover:bg-white/20">Disclaimer</Link>
        <Link to="/about" className="px-3 py-2 rounded-md hover:bg-white/20">About & Contact</Link>
      </nav>
    </div>
  </header>
);

const PageLayout = ({ title, children }) => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <SiteHeader />
    <main className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="bg-white p-6 rounded-2xl shadow">
        {children}
      </div>
    </main>
    <footer className="bg-slate-900 text-white py-6 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-sm">© {new Date().getFullYear()} NEO Esports. All rights reserved.</div>
    </footer>
  </div>
);

// Reusable policy section component
const Section = ({ title, children }) => (
  <section className="mb-6">
    <h2 className="text-xl font-semibold mb-2">{title}</h2>
    <div className="text-sm leading-7 text-slate-700">{children}</div>
  </section>
);

export function ReturnPolicy() {
  return (
    <PageLayout title="Return Policy">
      <p className="mb-4">This Return Policy applies to digital and physical goods sold or distributed by NEO Esports in connection with tournaments, event merchandise, or other platform services.</p>

      <Section title="Scope">
        <p>NEO Esports primarily offers digital tournament entries, in-game item purchases, and occasional physical merchandise (e.g., apparel, accessories). Due to the nature of digital content and event entry, returns are limited as explained below.</p>
      </Section>

      <Section title="Digital Goods & Tournament Entries">
        <p>
          Tournament entries, digital tokens, downloadable content, and access passes are non-returnable and non-exchangeable once purchased and delivered, unless explicitly stated otherwise. This is because access and codes can be consumed immediately and cannot be "returned" in the traditional sense.
        </p>
      </Section>

      <Section title="Physical Merchandise">
        <p>
          For physical goods purchased through NEO Esports (merch, swag):
        </p>
        <ul className="list-disc pl-6">
          <li>Returns accepted within 14 days of delivery if the item is unused and in original packaging.</li>
          <li>Buyer is responsible for return shipping unless the item was damaged or sent incorrectly.</li>
          <li>Inspection may take up to 7 business days after we receive the returned item.</li>
        </ul>
      </Section>

      <Section title="How to Request a Return">
        <p>Contact our Support team via the About & Contact page with your order ID, purchase email, and reason for return. We will respond with instructions and an RMA (if applicable).</p>
      </Section>

      <Section title="Exceptions">
        <p>
          Custom or limited-run merchandise, sealed goods (if opened), and promotional items may not be eligible for return. Always check the product page for any special return notes.
        </p>
      </Section>
    </PageLayout>
  );
}

export function RefundPolicy() {
  return (
    <PageLayout title="Refund Policy">
      <p className="mb-4">NEO Esports aims to be fair. This Refund Policy explains when refunds are allowed and how to request them for tournament entries, digital purchases, and merchandise.</p>

      <Section title="Tournament Entries">
        <p>
          Refunds for tournament entries are generally not available because entries reserve player slots and impact event operations. However, exceptions may be granted in the following cases:
        </p>
        <ul className="list-disc pl-6">
          <li>Event cancellation by NEO Esports (full refund).</li>
          <li>Verified payment errors or duplicate payments.</li>
          <li>Medical emergency or other extreme circumstances — request must be submitted with supporting documents within 7 days of the event date.</li>
        </ul>
      </Section>

      <Section title="Digital Purchases & In-Game Items">
        <p>
          Purchases of consumable digital items (e.g., tokens used in-game) are not refundable once consumed. Non-consumable digital purchases may be refunded if there is a technical failure preventing access and our support team cannot resolve the issue within a reasonable time.
        </p>
      </Section>

      <Section title="Merchandise Refunds">
        <p>Returned physical items that meet return conditions are eligible for refund upon inspection. Refunds will be issued to the original payment method within 7–14 business days after approval.</p>
      </Section>

      <Section title="Payment Disputes & Chargebacks">
        <p>
          If you believe an unauthorized charge occurred, contact support immediately. Filing a chargeback without first contacting us may delay resolution. We may require proof of purchase and will cooperate with payment processors to investigate.
        </p>
      </Section>

      <Section title="How to Request a Refund">
        <p>Use the About & Contact form or email support@neo-esports.example (replace with your real email). Include order/transaction ID, date, amount, and a clear explanation.</p>
      </Section>
    </PageLayout>
  );
}

export function PrivacyPolicy() {
  return (
    <PageLayout title="Privacy Policy">
      <p className="mb-4">Your privacy matters. This policy explains what we collect, why, and how we protect it on the NEO Esports platform (tournament registration, leaderboards, chat, and payments).</p>

      <Section title="Information We Collect">
        <ul className="list-disc pl-6">
          <li>Account info: username, email, display name, avatar (if provided).</li>
          <li>Payment & billing data: card tokens (stored by payment processor), billing address.</li>
          <li>Gameplay & event data: match results, scores, rankings, tournament participation.</li>
          <li>Device & usage data: IP address, device type, browser, crash logs, session times.</li>
          <li>Communications: support tickets, chat logs (as needed for moderation).</li>
        </ul>
      </Section>

      <Section title="How We Use Data">
        <p>We use personal data to:</p>
        <ul className="list-disc pl-6">
          <li>Provide services and manage tournaments.</li>
          <li>Process payments and refunds.</li>
          <li>Prevent fraud and enforce rules (cheating, account abuse).</li>
          <li>Personalize user experience and send transactional emails.</li>
        </ul>
      </Section>

      <Section title="Third-Party Services">
        <p>
          We may share limited data with service providers (payment processors, analytics, cloud hosting) to operate the service. We require vendors to maintain security and only process data on our instructions.
        </p>
      </Section>

      <Section title="Cookies & Tracking">
        <p>
          We use cookies and similar technologies for authentication, session management, and analytics. You can manage cookie settings in your browser, but disabling some cookies may affect site functionality.
        </p>
      </Section>

      <Section title="Data Retention & Deletion">
        <p>
          We retain account and gameplay data for as long as needed to provide services and comply with legal obligations. You may request account deletion; after verification, we will delete or anonymize personal data according to our retention policy, except where retention is required by law.
        </p>
      </Section>

      <Section title="Security">
        <p>
          We implement reasonable security measures, including encryption for sensitive transmissions and access controls. However, no online platform is 100% secure—please take care with your account credentials.
        </p>
      </Section>

      <Section title="Children's Privacy">
        <p>
          NEO Esports is not directed to children under 13. If you believe we collected data from a child under the applicable age, contact us to request deletion.
        </p>
      </Section>

      <Section title="Contact & Changes">
        <p>
          Questions about privacy, or requests to exercise data rights, can be sent via the About & Contact page. We may update this policy; we will post changes and indicate the last revision date.
        </p>
      </Section>
    </PageLayout>
  );
}

export function Disclaimer() {
  return (
    <PageLayout title="Disclaimer">
      <p className="mb-4">This Disclaimer explains limits of liability, accuracy of event information, and user responsibilities on the NEO Esports platform.</p>

      <Section title="Accuracy of Information">
        <p>
          We strive to provide accurate event schedules, rules, and results. However, errors can occur. NEO Esports is not liable for minor clerical mistakes. Official results and rulings issued by event admins are final.
        </p>
      </Section>

      <Section title="No Warranty">
        <p>
          Services are provided "as-is" and "as-available." NEO Esports disclaims all warranties (express or implied) to the fullest extent permitted by law.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p>
          To the extent allowed by law, NEO Esports, its officers, employees, and partners will not be liable for indirect, incidental, or consequential damages arising from use of the platform, participation in events, or reliance on content.
        </p>
      </Section>

      <Section title="Third-Party Links & Content">
        <p>
          Links to third-party services (streaming platforms, sponsors, or external stores) are provided for convenience. We do not endorse and are not responsible for their content or practices.
        </p>
      </Section>

      <Section title="Governing Law & Disputes">
        <p>
          Any disputes arising from platform use or purchases will be governed by the law applicable in the company's jurisdiction (update to your country/state in the final copy). Consider seeking legal advice for high-stakes disputes.
        </p>
      </Section>
    </PageLayout>
  );
}

export function AboutContact() {
  return (
    <PageLayout title="About NEO Esports & Contact">
      <Section title="About NEO Esports">
        <p>
          NEO Esports is an esports tournament platform focused on community-driven competitive gaming. We organize online tournaments, host leaderboards, and collaborate with streamers and sponsors to create vibrant competitive events for amateur and pro players.
        </p>
        <p className="mt-3">Our mission: Make competitive gaming accessible, fair, and fun — whether you're grinding ranked or playing your first tournament.</p>
      </Section>

      <Section title="Core Features">
        <ul className="list-disc pl-6">
          <li>Tournament creation & registration</li>
          <li>Automated brackets & match reporting</li>
          <li>Leaderboards, profiles, and achievements</li>
          <li>Merch store & event passes</li>
          <li>Fair-play systems and anti-cheat measures</li>
        </ul>
      </Section>

      <Section title="Contact Support">
        <p>Need help? Use the form below or email <strong>support@neo-esports.example</strong> (replace with your real email).</p>

        <form className="mt-4 grid grid-cols-1 gap-4 max-w-xl">
          <label className="block">
            <span className="text-sm font-medium">Name</span>
            <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" placeholder="Your name" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" placeholder="you@example.com" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Subject</span>
            <input className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" placeholder="Order ID / Tournament ID / Topic" />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Message</span>
            <textarea rows={5} className="mt-1 block w-full rounded-md border-gray-200 shadow-sm" placeholder="Tell us what's up" />
          </label>
          <button type="button" className="w-max px-4 py-2 rounded-lg bg-violet-600 text-white font-semibold">Send Message</button>
        </form>

        <p className="mt-4 text-xs text-slate-500">Note: This form is a UI demo. Hook it to your email service, Firebase, or other backend to receive messages.</p>
      </Section>

      <Section title="Office & Socials">
        <p>Business Inquiries: <strong>biz@neo-esports.example</strong></p>
        <p className="mt-2">Follow us: Twitter | Discord | YouTube (update links in your real site)</p>
      </Section>
    </PageLayout>
  );
}

// Home page with quick links
function Home() {
  return (
    <PageLayout title="Welcome to NEO Esports">
      <p className="mb-4">Quick links to site policies and contact info. Use this as the legal & support hub for your tournament platform.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/return" className="block p-4 rounded-lg bg-slate-50 border hover:shadow">Return Policy</Link>
        <Link to="/refund" className="block p-4 rounded-lg bg-slate-50 border hover:shadow">Refund Policy</Link>
        <Link to="/privacy" className="block p-4 rounded-lg bg-slate-50 border hover:shadow">Privacy Policy</Link>
        <Link to="/disclaimer" className="block p-4 rounded-lg bg-slate-50 border hover:shadow">Disclaimer</Link>
        <Link to="/about" className="block p-4 rounded-lg bg-slate-50 border hover:shadow col-span-full">About & Contact</Link>
      </div>
    </PageLayout>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/return" element={<ReturnPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/about" element={<AboutContact />} />
      </Routes>
    </Router>
  );
}
