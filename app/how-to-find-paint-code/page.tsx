import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Find Your Car's Paint Code",
  description: "Learn where to find your car's factory paint code, how to read the label, what to do if it is missing, and how to confirm touch-up paint before ordering.",
};

export default function Page() {
  return <article className="section narrow">
    <p className="eyebrow">Paint code identification guide</p>
    <h1>How to find your car's paint code</h1>
    <p className="lede">A factory paint code helps a dealer or paint supplier identify the original color formula family for your vehicle. The code is usually printed on a vehicle label, but its location and format depend on the make, model, market, and model year.</p>

    <h2>1. Start with the vehicle information label</h2>
    <p>Check the driver's doorjamb, the door edge, and the center pillar first. If you do not find a color identifier, inspect the glove box, under-hood area, trunk, and spare-wheel compartment. These are common places to check, not a universal location list. Follow the owner's manual for your exact vehicle whenever it gives a specific instruction.</p>
    <p>For example, Honda's 2024 Accord Hybrid U.S. manual says to refer to the color-code label affixed to the driver's doorjamb before painting. The 2025 Chevrolet Equinox EV manual describes paint information on a barcode on the center-pillar certification label, with an alternate label inside the trunk if the barcode is absent. Those instructions apply to the named model years, not every Honda or Chevrolet.</p>
    <p><Link href="/paint-code-guides/honda-accord-hybrid-2024">2024 Honda Accord Hybrid paint-code label guidance</Link> · <Link href="/paint-code-guides/chevrolet-equinox-ev-2025">2025 Chevrolet Equinox EV paint-information label guidance</Link></p>

    <h2>2. Look for the exterior-color field</h2>
    <p>Depending on the manufacturer, a label may use terms such as PAINT, COLOR, EXT PNT, or a combined color-and-trim field. Some vehicles use option information or a barcode. Do not assume every short code on the label is the paint code: interior trim, production, emissions, and equipment codes can appear close together.</p>
    <p>Copy the complete exterior identifier, including letters, numbers, spaces, and suffixes. Take a clear photo of the full label so a parts specialist can interpret neighboring fields if needed. Avoid posting an image publicly if it also shows your VIN, address, or other personal information.</p>

    <h2>3. Match the code to the correct vehicle</h2>
    <p>Give the code to a manufacturer dealer or a paint supplier that supports your vehicle's market and model year. Provide the make, model, year, and market where the vehicle was originally sold. Paint names are not unique identifiers, and one name can have multiple formulas or variants. A color name by itself is not enough to guarantee a match.</p>
    <p>Before ordering, ask the supplier to confirm the code and vehicle application. Metallic, pearl, and multi-stage finishes may require a specific basecoat and clearcoat process. Repainted panels can also differ from the factory finish even when the original code is correct.</p>

    <h2>4. If the label is missing or unreadable</h2>
    <p>Check the owner's manual and other label locations listed for your model. If the sticker is damaged, ask an authorized dealer whether it can retrieve the original build specification from the VIN. A standard VIN does not directly encode the paint color, and a third-party VIN decoder should not be treated as proof of the vehicle's original finish.</p>

    <h2>5. Test the paint before repairing a visible panel</h2>
    <p>Vehicle paint changes with age, sunlight, weather, polishing, and previous repairs. A correct factory formula may still look different next to an older panel. Ask for a test card or spray-out when the repair is visible, compare it in daylight, and follow the supplier's preparation and application instructions.</p>

    <h2>Frequently asked questions</h2>
    <h3>Can I find the paint code from a license plate or VIN?</h3>
    <p>The VIN is an identifier used to retrieve vehicle records; it does not contain a directly readable paint code. A manufacturer or dealer may be able to use licensed build records to look up the original specification. A license-plate lookup also depends on a legitimate data source and should not be assumed to reveal paint details.</p>
    <h3>Is the paint code the same as the paint name?</h3>
    <p>No. The code is the more useful identifier for a paint supplier. A familiar name such as black, silver, or pearl white can refer to different formulas across manufacturers, years, and regions.</p>
    <h3>Why does a touch-up pen look different?</h3>
    <p>The code may be correct while the surrounding factory paint has faded, or the repair may need blending. Metallic flake direction, number of coats, primer color, and clearcoat can affect how the finished spot appears.</p>

    <h2>Use source-specific instructions</h2>
    <p>Our model-year guides link to the owner's manual or other manufacturer source behind each instruction. General make pages are only starting points and should not be treated as model-year-confirmed directions. We add paint-code records to search only after the code, vehicle application, years, and source have been independently checked.</p>
    <p><Link href="/paint-codes">Browse paint-code location guides</Link></p>
  </article>;
}
