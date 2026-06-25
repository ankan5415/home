import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Horizon Labs",
  description: "I manage your ads and connect your ad spend to real revenue.",
};

const page: React.CSSProperties = {
  background: "#ffffff",
  color: "#000000",
  fontFamily: "Verdana, Geneva, sans-serif",
  fontSize: "15px",
  lineHeight: 1.5,
  maxWidth: "870px",
  margin: "40px auto",
  padding: "0 18px",
  minHeight: "100vh",
};

const h2: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "bold",
  margin: "30px 0 12px",
};

const h1: React.CSSProperties = {
  fontSize: "15px",
  fontWeight: "bold",
  margin: "0 0 20px",
};

const p: React.CSSProperties = { margin: "0 0 15px" };

const link: React.CSSProperties = { color: "#0000cc", textDecoration: "underline" };

export default function HorizonLabsPage() {
  return (
    <div style={page}>
      <h1 style={h1}>
        Horizon Labs - by{" "}
        <a
          style={link}
          href="https://www.linkedin.com/in/ankur-boyed/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ankur Boyed
        </a>
      </h1>

      <p style={p}>I manage your ads and connect your ad spend to real revenue.</p>

      <p style={p}>
        Most paid-media agencies send you a screenshot of an ad dashboard and call it
        reporting. They can&apos;t tell you which ad brought in which customer, or what that
        customer is actually worth. I build the technical attribution that closes the loop:
        every ad, tied to every revenue event, all the way through to lifetime value.
      </p>

      <p style={p}>
        I&apos;m a technical founder who&apos;s been in your shoes. I&apos;ll go into your
        codebase, emit the events, wire up the analytics, and run your paid campaigns
        against numbers you can actually trust, not vanity ROAS.
      </p>

      <h2 style={h2}>What I do</h2>

      <p style={p}>
        Paid growth, built on attribution you can trust. I run Google Ads and paid
        acquisition, set up conversion tracking and A/B testing, and build the closed-loop
        reporting that ties spend to real revenue and lifetime value.
      </p>

      <p style={p}>
        If you have a sales team in the loop, I also specialize in connecting that
        attribution into your CRM, so the full journey from ad click to closed deal lives
        on a single record.
      </p>

      <p style={p}>
        The technical build-out is the difference. Most marketers won&apos;t touch your
        code. I will. That&apos;s how the reporting goes from screenshots to a real picture
        of which campaigns actually make you money.
      </p>

      <h2 style={h2}>Selected work</h2>

      <p style={p}>
        <b>1Bitcoin</b>, a Canadian Bitcoin platform. I own paid acquisition and the
        measurement layer for a regulated fintech, managing seven figures in ad spend.
        Rather than rely on the ad platform&apos;s numbers, I built attribution and
        analytics in house, going into the
        codebase to emit events from the points that matter. On top of that I restructured
        the Google Ads account around revenue-driving conversions, set up enhanced
        conversions, and run ongoing A/B tests, driving a 13% increase in conversions
        within 30 days.
      </p>

      <p style={p}>
        <b>Clarido.</b> I own paid media strategy and execution, setting the channel
        approach and running the campaigns day to day, with A/B testing and attribution to
        keep spend accountable to results.
      </p>

      <p style={p}>
        <b>A stealth-stage AI expert network SaaS.</b> I advise the founder on growth
        strategy and driving product adoption.
      </p>

      <p style={p}>
        <b>A stealth-stage legal SaaS</b> in document signing. I defined the go-to-market:
        built the ICP and a data-driven fit-scoring model, then turned it into a
        prioritized, scored outbound target list the team could run against.
      </p>

      <h2 style={h2}>Background</h2>

      <p style={p}>Before Horizon Labs, I was a technical founder.</p>

      <p style={p}>
        I co-founded <b>Boardy AI</b> and built the technology behind it, an AI networking
        product that raised $11M and reached over 100,000 users.
      </p>

      <p style={p}>
        Before that I co-founded <b>Beavr Labs</b> and led the technical team. It was a
        design and development agency that built products for over a dozen startups,
        several of which scaled to 100k+ users and multi-million revenue.
      </p>

      <p style={p}>
        That&apos;s why I can do what most marketers can&apos;t. I&apos;ve shipped product,
        managed real budgets, and I&apos;m comfortable in the technical weeds where
        attribution actually gets solved.
      </p>

      <h2 style={h2}>Why founders work with me</h2>

      <p style={p}>
        Most agencies stop at the recommendation, or at a screenshot. I implement it: in
        the ad account, in the analytics, in your codebase.
      </p>

      <p style={p}>
        I build the attribution pipelines and go into the code myself, so your reporting
        reflects real revenue, not a guess.
      </p>

      <p style={p}>
        I&apos;ve built and scaled companies of my own. I treat your ad budget like my own
        money, and every dollar has to earn its place.
      </p>

      <h2 style={h2}>Get in touch</h2>

      <p style={p}>
        I work with a few founders at a time. If you&apos;re spending on paid and can&apos;t
        trace it to real revenue, or you know someone who can&apos;t, let&apos;s talk.
      </p>

      <p style={p}>
        <a style={link} href="mailto:me@ankurboyed.com">
          me@ankurboyed.com
        </a>
      </p>
    </div>
  );
}
