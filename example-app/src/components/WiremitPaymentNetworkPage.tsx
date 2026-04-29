import { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

type Corridor = {
  region: string;
  country: string;
  channel: string;
  currency: string;
  fee: string;
  partners: string;
  limits: string;
  delivery: string;
  penetration: string;
};

type ChannelFilter = "all" | "Bank" | "Wallet" | "Card";

function normalizeString(value: unknown) {
  return (value ?? "").toString().trim();
}

function parsePenetrationPercent(value: string) {
  const v = normalizeString(value).replace("%", "");
  const num = Number.parseFloat(v);
  return Number.isFinite(num) ? num : 0;
}

function normalizeChannel(value: string) {
  const v = value.toLowerCase();
  if (v.includes("bank")) return "Bank";
  if (v.includes("card")) return "Card";
  if (v.includes("wallet")) return "Wallet";
  return value;
}

function extractCorridors(workbook: XLSX.WorkBook) {
  const corridors: Corridor[] = [];

  for (const sheetName of workbook.SheetNames) {
    if (sheetName.toLowerCase() === "summary") continue;

    const ws = workbook.Sheets[sheetName];
    const ref = ws["!ref"];
    if (!ref) continue;

    const { e } = XLSX.utils.decode_range(ref);
    const startRow = 3; // Excel row 4 (0-based)

    // Excel columns:
    // A: Country, B: Channel, C: Currency, D: Fee,
    // E: Coverage/Partners, F: Limits, G: Delivery, H: Penetration
    for (let r = startRow; r <= e.r; r++) {
      const getCell = (c: number) => {
        const addr = XLSX.utils.encode_cell({ c, r });
        return ws[addr]?.v;
      };

      const country = normalizeString(getCell(0));
      if (!country) {
        continue;
      }

      const channelRaw = normalizeString(getCell(1));
      const currency = normalizeString(getCell(2));
      const fee = normalizeString(getCell(3));
      const partners = normalizeString(getCell(4));
      const limits = normalizeString(getCell(5));
      const delivery = normalizeString(getCell(6));
      const penetration = normalizeString(getCell(7));

      corridors.push({
        region: sheetName,
        country,
        channel: normalizeChannel(channelRaw),
        currency,
        fee,
        partners,
        limits,
        delivery,
        penetration,
      });
    }
  }

  return corridors;
}

export default function WiremitPaymentNetworkPage() {
  const [loading, setLoading] = useState(true);
  const [corridors, setCorridors] = useState<Corridor[]>([]);
  const [activeRegion, setActiveRegion] = useState<string>("All Regions");
  const [activeChannel, setActiveChannel] = useState<ChannelFilter>("all");
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState<
    keyof Omit<Corridor, "region"> | "penetration"
  >("country");
  const [sortDir, setSortDir] = useState<1 | -1>(1);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const url = new URL("./wiremit1-payment network.xlsx", import.meta.url)
          .href;
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const workbook = XLSX.read(buf, { type: "array" });
        const extracted = extractCorridors(workbook);
        setCorridors(extracted);
        setActiveRegion("All Regions");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const regions = useMemo(() => {
    const unique = Array.from(new Set(corridors.map((c) => c.region)));
    unique.sort((a, b) => a.localeCompare(b));
    return ["All Regions", ...unique];
  }, [corridors]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    const data = corridors.filter((row) => {
      if (activeRegion !== "All Regions" && row.region !== activeRegion) return false;
      if (activeChannel !== "all" && row.channel !== activeChannel) return false;

      if (!q) return true;
      return (
        row.country.toLowerCase().includes(q) ||
        row.currency.toLowerCase().includes(q) ||
        row.partners.toLowerCase().includes(q) ||
        row.channel.toLowerCase().includes(q) ||
        row.region.toLowerCase().includes(q)
      );
    });

    const sorted = [...data].sort((a, b) => {
      const av = (a as any)[sortCol] ?? "";
      const bv = (b as any)[sortCol] ?? "";

      if (sortCol === "penetration") {
        return (parsePenetrationPercent(av) - parsePenetrationPercent(bv)) * sortDir;
      }

      return String(av).localeCompare(String(bv)) * sortDir;
    });

    return sorted;
  }, [corridors, activeRegion, activeChannel, search, sortCol, sortDir]);

  const toggleSort = (col: typeof sortCol) => {
    if (sortCol === col) setSortDir((d) => (d === 1 ? -1 : 1));
    else {
      setSortCol(col);
      setSortDir(1);
    }
  };

  // Self-contained design tokens so this component can be reused
  // in another project without relying on external design-system.css.
  const localDesignTokens = {
    "--background": "#f5f5f5",
    "--foreground": "#171717",
    "--primary": "#022731",
    "--secondary": "#17cf17",
    "--line-primary": "229, 228, 224",
    "--surface-input": "#ffffff",
    "--surface-subtle": "#fafafa",
  } as React.CSSProperties;

  return (
    <div
      className="wiremit-payment-page relative min-h-screen bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden"
      style={localDesignTokens}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(rgba(23,207,23,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(23,207,23,0.03) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed -right-[100px] -top-[200px] h-[600px] w-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(23,207,23,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-[1] mx-auto max-w-[1400px] px-6 py-0">
        <header className="relative mb-12 border-b border-[rgb(var(--line-primary))] pb-8 pt-12">
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <div>
              <div className="title text-[clamp(32px,5vw,56px)] font-extrabold leading-none tracking-[-0.04em]">
                Wiremit
              </div>
              <div className="mt-2 text-[13px] uppercase tracking-[0.08em] text-[var(--foreground)]/55">
                Global P2P Payment Network Coverage — TerraPay
              </div>
            </div>
            <div className="whitespace-nowrap rounded-full border border-[rgb(var(--line-primary))] px-[14px] py-[6px] text-[11px] tracking-[0.05em] text-[var(--foreground)]/55">
              Source: <span className="text-[var(--secondary)]">TerraPay</span> · Wiremit ONE API
            </div>
          </div>
        </header>

        {/* Controls */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] max-w-[360px] flex-1">
            <div className="relative">
              <svg
                className="absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/45"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search country, partner, currency…"
                className="w-full rounded-[8px] border border-[rgb(var(--line-primary))] bg-[var(--surface-input)] py-[10px] pl-10 pr-[14px] text-[13px] outline-none transition-colors placeholder:text-[var(--foreground)]/40 focus:border-[var(--secondary)]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-[6px]">
            {(
              [
                ["all", "All"],
                ["Bank", "Bank"],
                ["Wallet", "Wallet"],
                ["Card", "Card"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveChannel(key)}
                className={[
                  "rounded-[6px] border px-4 py-2 text-[12px] font-medium tracking-[0.04em] transition-colors",
                  "border-[rgb(var(--line-primary))]",
                  activeChannel === key
                    ? "border-[var(--secondary)] bg-[var(--secondary)] text-black"
                    : "bg-[var(--surface-subtle)] text-[var(--foreground)]/55 hover:border-[var(--secondary)] hover:text-[var(--secondary)]",
                ].join(" ")}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Region tabs */}
        <div className="mb-8 flex gap-0 overflow-x-auto border-b border-[rgb(var(--line-primary))]">
          {regions.map((r) => {
            const count =
              r === "All Regions" ? corridors.length : corridors.filter((c) => c.region === r).length;
            const active = r === activeRegion;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setActiveRegion(r)}
                className={[
                  "mb-[-1px] whitespace-nowrap border-b-2 px-5 py-3 font-['Syne',sans-serif] text-[13px] font-semibold tracking-[0.02em] transition-colors",
                  active
                    ? "border-[var(--secondary)] text-[var(--secondary)]"
                    : "border-transparent text-[var(--foreground)]/55 hover:text-[var(--foreground)]",
                ].join(" ")}
              >
                {r}
                <span
                  className={[
                    "ml-[6px] inline-block rounded-full px-[7px] py-[1px] text-[11px]",
                    active
                      ? "bg-[var(--surface-input)] text-[var(--foreground)]"
                      : "bg-[var(--surface-subtle)] text-[var(--foreground)]/55",
                  ].join(" ")}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-[12px] border border-[rgb(var(--line-primary))] bg-[var(--surface-subtle)]">
          <div className="flex items-center justify-between gap-4 border-b border-[rgb(var(--line-primary))] bg-[var(--surface)] px-6 py-4">
            <div className="font-['Syne',sans-serif] text-[16px] font-bold">
              {activeRegion === "All Regions" ? "All Regions" : activeRegion}
            </div>
            <div className="text-[12px] text-[var(--foreground)]/55">
              Showing <span className="font-bold text-[var(--secondary)]">{filtered.length}</span> corridors
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-[12.5px]">
              <thead className="bg-[var(--surface)]">
                <tr>
                  {[
                    ["country", "Country"],
                    ["channel", "Channel"],
                    ["currency", "Currency"],
                    ["fee", "Fee"],
                    ["partners", "Partners / Coverage"],
                    ["limits", "Limits"],
                    ["delivery", "Delivery"],
                    ["penetration", "Penetration"],
                  ].map(([key, label]) => {
                    const k = key as typeof sortCol;
                    const active = sortCol === k;
                    return (
                      <th
                        key={key}
                        className="cursor-pointer select-none whitespace-nowrap border-b border-[rgb(var(--line-primary))] px-4 py-[10px] text-left text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground)]/45"
                        onClick={() => toggleSort(k)}
                      >
                        <span className={active ? "text-[var(--secondary)]" : "transition-colors hover:text-[var(--secondary)]"}>
                          {label}
                        </span>
                        <span className="ml-1 inline-block opacity-40">
                          {active ? (sortDir === 1 ? "↑" : "↓") : "↕"}
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {loading ? null : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center text-[var(--foreground)]/45">
                      No corridors match your filters
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr
                      key={`${r.region}-${r.country}-${r.channel}-${r.currency}`}
                      className="border-b border-[rgba(2,39,49,0.12)] transition-colors hover:bg-[rgba(2,39,49,0.04)]"
                    >
                      <td className="whitespace-nowrap px-4 py-3 align-middle font-['Syne',sans-serif] text-[13px] font-semibold leading-[1.4]">
                        {r.country}
                        {activeRegion === "All Regions" ? (
                          <div className="mt-[3px] inline-block rounded-[3px] border border-[rgb(var(--line-primary))] bg-[var(--surface)] px-[6px] py-[1px] text-[10px] tracking-[0.04em] text-[var(--foreground)]/45">
                            {r.region}
                          </div>
                        ) : null}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <span
                          className={[
                            "inline-block whitespace-nowrap rounded-[4px] border px-[9px] py-[3px] text-[10px] font-medium uppercase tracking-[0.06em]",
                            r.channel === "Bank"
                              ? "border-[rgba(2,39,49,0.18)] bg-[rgba(2,39,49,0.08)] text-[var(--primary)]"
                              : r.channel === "Wallet"
                                ? "border-[rgba(23,207,23,0.22)] bg-[rgba(23,207,23,0.10)] text-[var(--secondary)]"
                                : "border-[rgba(2,39,49,0.14)] bg-[rgba(2,39,49,0.05)] text-[var(--foreground)]/75",
                          ].join(" ")}
                        >
                          {r.channel}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <span className="inline-block rounded-[4px] border border-[rgb(var(--line-primary))] bg-[rgba(255,255,255,0.04)] px-2 py-[2px] text-[11px] text-[var(--foreground)]/50">
                          {r.currency}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle font-medium text-[var(--secondary)]">
                        {r.fee || "—"}
                      </td>
                      <td className="max-w-[220px] px-4 py-3 align-middle text-[var(--foreground)]/80">
                        <div className="line-clamp-2 max-w-[220px]">{r.partners || "—"}</div>
                      </td>
                      <td className="max-w-[180px] px-4 py-3 align-middle text-[12px] text-[var(--foreground)]/55">
                        <div className="line-clamp-2 max-w-[180px]">{r.limits || "—"}</div>
                      </td>
                      <td className="max-w-[220px] px-4 py-3 align-middle text-[12px] text-[var(--foreground)]/55">
                        <div className="line-clamp-2 max-w-[220px]">{r.delivery || "—"}</div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 align-middle">
                        <div className="flex min-w-[80px] items-center gap-2">
                          <div className="h-1 w-full min-w-[92px] overflow-hidden rounded bg-[rgb(var(--line-primary))]/60">
                            <div
                              className="h-full rounded bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-[width] duration-500"
                              style={{ width: `${Math.min(100, parsePenetrationPercent(r.penetration))}%` }}
                            />
                          </div>
                          <span className="min-w-[36px] whitespace-nowrap text-right text-[11px] text-[var(--foreground)]/50">
                            {r.penetration || "—"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {loading ? (
          <div className="mt-6 text-center text-[var(--foreground)]/45">Loading spreadsheet…</div>
        ) : (
          <footer className="mt-16 border-t border-[rgb(var(--line-primary))] py-8 text-center text-[11px] tracking-[0.05em] text-[var(--foreground)]/45">
            Wiremit Global P2P Coverage · Source: TerraPay Global Coverage Sheet · Reformatted by Wiremit
          </footer>
        )}
      </div>

      {/* Local fallback CSS for portability/reuse.
          Keep this block if you move the component to another app. */}
      <style>{`
        .wiremit-payment-page {
          font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
        }

        .wiremit-payment-page .title {
          font-family: "Plus Jakarta Sans", Inter, system-ui, sans-serif;
          letter-spacing: -0.02em;
          font-weight: 700;
          background: linear-gradient(90deg, #022731 0%, #044d61 30%, #0a5c3a 60%, #022731 100%);
          background-size: 200% 100%;
          animation: wiremit-shift 8s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Keep animation name component-specific to avoid collisions. */
        @keyframes wiremit-shift {
          0% {
            background-position: 0% 0;
          }
          50% {
            background-position: 100% 0;
          }
          100% {
            background-position: 0% 0;
          }
        }
      `}</style>
    </div>
  );
}

