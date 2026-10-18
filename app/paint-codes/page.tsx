import Link from "next/link";
import { guides } from "../../data/records";

export const metadata = {
  title: "Car Paint Code Location Guides",
  description: "Find practical vehicle paint code label guidance by make and model, with source-linked instructions for selected model years.",
};

export default function Guides() {
  return <section className="section">
    <p className="eyebrow">Vehicle paint code help</p>
    <h1>Paint code location guides</h1>
    <p className="lede">A factory paint code is usually printed on a vehicle label, but the label location and format vary by make, model, market, and model year. Use year-specific instructions where available and confirm the full identifier before ordering paint.</p>
    <h2>Model-year source guides</h2>
    <div className="cards">
      <article><h3><Link href="/paint-code-guides/honda-accord-hybrid-2024">2024 Honda Accord Hybrid</Link></h3><p>Honda's U.S. owner's manual points to the color-code label on the driver's doorjamb.</p><small>Source: Honda owner's manual · U.S. model</small></article>
      <article><h3><Link href="/paint-code-guides/chevrolet-equinox-ev-2025">2025 Chevrolet Equinox EV</Link></h3><p>GM describes paint information on the center-pillar certification label barcode, with a trunk-label fallback.</p><small>Source: Chevrolet owner's manual</small></article>
    </div>
    <h2>General starting guides</h2>
    <p>These pages explain common places to inspect. They are not proof of the exact position or paint field for every model year.</p>
    <div className="cards">{guides.map((guide) => <article key={guide.slug}>
      <h3><Link href={"/paint-codes/" + guide.slug}>{guide.title}</Link></h3>
      <p>{guide.location}</p>
      <small>{guide.make} · {guide.model} · {guide.verification === "general-guidance" ? "General guidance" : "Manufacturer source reviewed"}</small>
    </article>)}</div>
    <p>Need the basics first? <Link href="/how-to-find-paint-code">Read how to find and verify a car paint code.</Link></p>
  </section>;
}
