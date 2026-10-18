"use client";

import { FormEvent, useMemo, useState } from "react";
import { guides } from "../data/records";

type Match = {
  manufacturer: string;
  model: string;
  oem_code: string;
  color_name: string;
  year_from: number;
  year_to: number;
  source_url: string;
};
type Location = {
  manufacturer: string;
  model: string;
  year_from: number;
  year_to: number;
  location_text: string;
  code_field_hint: string | null;
  source_url: string;
};
type Mode = "locate" | "lookup";
const makes = ["Chevrolet", "Ford", "Honda", "Jeep", "Toyota"];

export default function Finder() {
  const [mode, setMode] = useState<Mode>("locate");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [code, setCode] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [results, setResults] = useState<Match[]>([]);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [searched, setSearched] = useState(false);

  const related = useMemo(() => guides.filter((guide) =>
    (!make || guide.make === make) && (!model || guide.model === "Multiple" || guide.model === "Trucks" || [guide.model, guide.title].join(" ").toLowerCase().includes(model.toLowerCase()))
  ), [make, model]);

  function switchMode(next: Mode) {
    setMode(next);
    setResults([]);
    setLocations([]);
    setStatus("");
    setSearched(false);
  }

  function clearSearch() {
    setMake(""); setModel(""); setYear(""); setCode("");
    setResults([]); setLocations([]); setStatus(""); setSearched(false);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setSearched(false); setResults([]); setLocations([]); setStatus("");
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (model.trim()) params.set("model", model.trim());
    if (year) params.set("year", year);

    try {
      const path = mode === "locate" ? "/api/label-locations" : "/api/paint-search";
      if (mode === "lookup" && code.trim()) params.set("code", code.trim());
      const response = await fetch(`${path}?${params.toString()}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setStatus(response.status === 503
          ? mode === "locate"
            ? "Verified model-year label search is not connected yet. Use a source-linked guide below as a starting point."
            : "The verified paint-code database is not connected yet. We do not show unverified code matches."
          : data.error || "Search is temporarily unavailable.");
      } else if (mode === "locate") {
        setLocations(data.results || []);
      } else {
        setResults(data.results || []);
      }
    } catch {
      setStatus("Search could not connect. Please try again.");
    } finally {
      setSearched(true);
      setBusy(false);
    }
  }

  return <div className="finder">
    <div className="finder-tabs" role="tablist" aria-label="Choose paint-code search mode">
      <button type="button" role="tab" aria-selected={mode === "locate"} className={mode === "locate" ? "active" : ""} onClick={() => switchMode("locate")}>Help me find my code</button>
      <button type="button" role="tab" aria-selected={mode === "lookup"} className={mode === "lookup" ? "active" : ""} onClick={() => switchMode("lookup")}>I have a paint code</button>
    </div>
    <p className="finder-description">{mode === "locate"
      ? "Choose your vehicle to check source-reviewed label locations. Exact model-year guidance is shown only when the source supports it."
      : "Search the reviewed database by the code printed on your vehicle. Only verified color and vehicle-year matches appear."}</p>

    <form onSubmit={submit} aria-busy={busy}>
      <div className="controls">
        {mode === "locate" ? <>
          <label>Car make<select required value={make} onChange={(event) => setMake(event.target.value)}><option value="">Choose manufacturer</option>{makes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Model<input value={model} onChange={(event) => setModel(event.target.value)} placeholder="e.g. Accord Hybrid" maxLength={80} autoComplete="off" /></label>
          <label>Model year<input value={year} onChange={(event) => setYear(event.target.value)} type="number" min="1900" max="2100" placeholder="Optional" /></label>
        </> : <>
          <label>Paint code<input required value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter the full label code" maxLength={80} autoCapitalize="characters" autoComplete="off" /></label>
          <label>Car make<select value={make} onChange={(event) => setMake(event.target.value)}><option value="">Any manufacturer</option>{makes.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Model<input value={model} onChange={(event) => setModel(event.target.value)} placeholder="Optional, e.g. Corolla" maxLength={80} autoComplete="off" /></label>
          <label>Model year<input value={year} onChange={(event) => setYear(event.target.value)} type="number" min="1900" max="2100" placeholder="Optional" /></label>
        </>}
      </div>
      <p className="field-help">{mode === "lookup" ? "Enter letters and numbers exactly as shown. Results match the full code; partial matches are not returned." : "Add the model and year when you know them to narrow the guidance."}</p>
      <div className="finder-actions">
        <button className="search-button" type="submit" disabled={busy || (mode === "locate" ? !make : !code.trim())}>{busy ? "Searching…" : mode === "locate" ? "Check label locations" : "Search verified paint codes"}</button>
        <button className="clear-button" type="button" onClick={clearSearch} disabled={busy}>Clear</button>
      </div>
    </form>

    <div aria-live="polite" aria-atomic="false" className="results">
      {status && <p className="notice" role="status">{status}</p>}
      {mode === "lookup" && searched && !status && (results.length ? <>
        <h3>Verified paint matches ({results.length})</h3>
        {results.map((result, index) => <div className="result" key={`${result.manufacturer}-${result.model}-${result.oem_code}-${index}`}>
          <div><strong>{result.manufacturer} {result.model}: {result.oem_code} — {result.color_name}</strong><small>Applicable years: {result.year_from}–{result.year_to}</small></div>
          <a href={result.source_url} target="_blank" rel="noopener noreferrer">Source</a>
        </div>)}
        <p className="result-caveat">Screen colors are not a reliable physical paint match. Confirm the formula with a paint supplier.</p>
      </> : <p>No verified match found. Check the full code on your label. A code may have different applications by model year or market.</p>)}

      {mode === "locate" && searched && !status && <>
        <h3>Source-reviewed model-year locations</h3>
        {locations.length ? locations.map((location, index) => <div className="result" key={`${location.model}-${location.year_from}-${index}`}>
          <div><strong>{location.manufacturer} {location.model} ({location.year_from}–{location.year_to})</strong><p>{location.location_text}</p>{location.code_field_hint && <small>Label field: {location.code_field_hint}</small>}</div>
          <a href={location.source_url} target="_blank" rel="noopener noreferrer">Source</a>
        </div>) : <p>No verified model-year location is available for this selection yet. Use the manual-specific guides below or ask an authorized dealer.</p>}
      </>}

      {(mode === "locate" || searched) && <>
        <h3>{mode === "locate" ? "Related label-location guides" : "Related location guides"}</h3>
        {related.length ? related.map((guide) => <a className="result" href={"/paint-codes/" + guide.slug} key={guide.slug}>
          <strong>{guide.title}</strong><small>{guide.make} · {guide.model} · General guidance</small>
        </a>) : <p>No specific guide is available. Check your owner's manual or ask an authorized dealer.</p>}
        {mode === "locate" && searched && <p className="result-caveat">General guides are starting points; they do not confirm the exact label position for every model year.</p>}
      </>}
    </div>
  </div>;
}
