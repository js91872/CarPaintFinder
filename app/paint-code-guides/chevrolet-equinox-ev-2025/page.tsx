import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "2025 Chevrolet Equinox EV Paint Information Label",
  description: "The 2025 Chevrolet Equinox EV owner's manual describes where to find vehicle paint information on its certification label barcode or trunk label.",
};

const source = "https://contentdelivery.ext.gm.com/content/dam/cope/en_us/public/pdf_assets/active/owners_manuals_browse/25_CHEV_Equinox_EV_OM_en_US_U_18247401D_2025AUG04.pdf";

export default function EquinoxGuide() {
  return <article className="section narrow">
    <p className="eyebrow">Chevrolet · 2025 model year · owner's manual</p>
    <h1>Where to find paint information for a 2025 Chevrolet Equinox EV</h1>
    <p className="lede">The 2025 Equinox EV manual describes a barcode on the center-pillar certification label that may contain paint information. It also gives an alternate label location inside the trunk.</p>
    <h2>Check the center-pillar certification label</h2>
    <p>Look at the certification label on the center pillar. According to the manual's Service Parts Identification section, some vehicles have a large barcode there that can be scanned for the vehicle identification number, model designation, paint information, and production options.</p>
    <h2>If the barcode is not present</h2>
    <p>The manual says the same information is on a label inside the trunk when the center-pillar label does not have the large barcode. The exact label setup can vary, so use the instructions for your specific vehicle and ask a Chevrolet dealer if the information is missing or unreadable.</p>
    <h2>Confirm before buying paint</h2>
    <p>Use the full paint information from the vehicle label when contacting a Chevrolet parts counter or paint supplier. This guide does not decode a barcode, provide a paint formula, or guarantee a match. Compare the supplier's application details with the vehicle before ordering.</p>
    <h2>Source and scope</h2>
    <p>This is a factual summary of General Motors' <em>2025 Chevrolet Equinox EV Owner Manual</em>, “Service Parts Identification.” It applies to the model-year manual linked below and should not be generalized to other Chevrolet vehicles or years.</p>
    <p><a href={source} target="_blank" rel="noopener noreferrer">Read the GM owner's manual (PDF)</a></p>
  </article>;
}
