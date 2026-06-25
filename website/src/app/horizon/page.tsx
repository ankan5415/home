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

      <p style={p}>
        I&apos;m a technical founder turned marketer. I manage your ads and connect your ad
        spend to real revenue.
      </p>

      <p style={p}>
        After speaking to dozens of marketing teams across B2C and B2B SaaS, I kept hearing
        the same problem over and over: they don&apos;t have a clear picture of how their
        ad spend contributes to real revenue.
      </p>

      <p style={p}>
        Most paid-media agencies send you a screenshot of an ad dashboard, but they
        can&apos;t tell you which ad brought in which customer, and what that customer is
        actually worth.
      </p>

      <p style={p}>
        I live in the data first and foremost. I build the technical attribution that ties
        ad spend to your CRM, revenue events, and lifetime value. Then I manage and scale
        ad spend so no dollar is wasted, A/B testing the entire marketing funnel along the
        way to ensure strong conversion rates.
      </p>

      <p style={p}>
        In other words, I&apos;ll go into your codebase, emit the events, wire up the
        analytics, and run your paid campaigns against numbers you can actually trust, not
        vanity ROAS.
      </p>

      <p style={p}>
        Most marketers won&apos;t touch your code. I will. That&apos;s how the reporting
        goes from screenshots to a real picture of which campaigns actually make you money.
      </p>

      <h2 style={h2}>Selected work</h2>

      <p style={p}>Across my clients, I manage seven figures in ad spend.</p>

      <p style={p}>
        <b>1Bitcoin.</b> I own paid acquisition, A/B testing, and the entire measurement
        layer for a regulated fintech, including custom attribution built directly into
        their codebase, driving a 13% increase in conversions within 30 days.
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
        several of which scaled to multi-million-dollar revenue.
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
        I work with a few founders at a time. If you&apos;re spending on paid and
        can&apos;t trace it to real revenue, or you know someone who can&apos;t, let&apos;s
        talk.
      </p>

      <p style={p}>
        <a style={link} href="mailto:me@ankurboyed.com">
          me@ankurboyed.com
        </a>
      </p>
    </div>
  );
}
