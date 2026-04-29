<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import * as XLSX from "xlsx";

import "../../../design-system.css";

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
type SortColumn = keyof Omit<Corridor, "region"> | "penetration";

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
  const rows: Corridor[] = [];

  for (const sheetName of workbook.SheetNames) {
    if (sheetName.toLowerCase() === "summary") continue;

    const ws = workbook.Sheets[sheetName];
    const refRange = ws["!ref"];
    if (!refRange) continue;

    const { e } = XLSX.utils.decode_range(refRange);
    const startRow = 3;

    for (let r = startRow; r <= e.r; r++) {
      const getCell = (c: number) => {
        const addr = XLSX.utils.encode_cell({ c, r });
        return ws[addr]?.v;
      };

      const country = normalizeString(getCell(0));
      if (!country) continue;

      const channelRaw = normalizeString(getCell(1));

      rows.push({
        region: sheetName,
        country,
        channel: normalizeChannel(channelRaw),
        currency: normalizeString(getCell(2)),
        fee: normalizeString(getCell(3)),
        partners: normalizeString(getCell(4)),
        limits: normalizeString(getCell(5)),
        delivery: normalizeString(getCell(6)),
        penetration: normalizeString(getCell(7)),
      });
    }
  }

  return rows;
}

const loading = ref(true);
const corridors = ref<Corridor[]>([]);
const activeRegion = ref("All Regions");
const activeChannel = ref<ChannelFilter>("all");
const search = ref("");
const sortCol = ref<SortColumn>("country");
const sortDir = ref<1 | -1>(1);

const channelFilters: ReadonlyArray<[ChannelFilter, string]> = [
  ["all", "All"],
  ["Bank", "Bank"],
  ["Wallet", "Wallet"],
  ["Card", "Card"],
];

const tableColumns: ReadonlyArray<[SortColumn, string]> = [
  ["country", "Country"],
  ["channel", "Channel"],
  ["currency", "Currency"],
  ["fee", "Fee"],
  ["partners", "Partners / Coverage"],
  ["limits", "Limits"],
  ["delivery", "Delivery"],
  ["penetration", "Penetration"],
];

const regions = computed(() => {
  const unique = Array.from(new Set(corridors.value.map((c) => c.region)));
  unique.sort((a, b) => a.localeCompare(b));
  return ["All Regions", ...unique];
});

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();

  const data = corridors.value.filter((row) => {
    if (activeRegion.value !== "All Regions" && row.region !== activeRegion.value) return false;
    if (activeChannel.value !== "all" && row.channel !== activeChannel.value) return false;
    if (!q) return true;

    return (
      row.country.toLowerCase().includes(q) ||
      row.currency.toLowerCase().includes(q) ||
      row.partners.toLowerCase().includes(q) ||
      row.channel.toLowerCase().includes(q) ||
      row.region.toLowerCase().includes(q)
    );
  });

  return [...data].sort((a, b) => {
    const av = (a as any)[sortCol.value] ?? "";
    const bv = (b as any)[sortCol.value] ?? "";

    if (sortCol.value === "penetration") {
      return (parsePenetrationPercent(av) - parsePenetrationPercent(bv)) * sortDir.value;
    }

    return String(av).localeCompare(String(bv)) * sortDir.value;
  });
});

function toggleSort(col: SortColumn) {
  if (sortCol.value === col) {
    sortDir.value = sortDir.value === 1 ? -1 : 1;
  } else {
    sortCol.value = col;
    sortDir.value = 1;
  }
}

function regionCount(region: string) {
  if (region === "All Regions") return corridors.value.length;
  return corridors.value.filter((c) => c.region === region).length;
}

onMounted(async () => {
  loading.value = true;
  try {
    const url = new URL("./wiremit1-payment network.xlsx", import.meta.url).href;
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    const workbook = XLSX.read(buf, { type: "array" });
    corridors.value = extractCorridors(workbook);
    activeRegion.value = "All Regions";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="relative min-h-screen overflow-x-hidden bg-[var(--background)] text-[var(--foreground)]">
    <div
      aria-hidden="true"
      class="pointer-events-none fixed inset-0 opacity-100"
      :style="{
        backgroundImage:
          'linear-gradient(rgba(23,207,23,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(23,207,23,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none fixed -right-[100px] -top-[200px] h-[600px] w-[600px] rounded-full"
      :style="{
        background: 'radial-gradient(circle, rgba(23,207,23,0.08) 0%, transparent 70%)',
      }"
    />

    <div class="relative z-[1] mx-auto max-w-[1400px] px-6 py-0">
      <header class="relative mb-12 border-b border-[rgb(var(--line-primary))] pb-8 pt-12">
        <div class="flex flex-wrap items-end justify-between gap-8">
          <div>
            <div class="title text-[clamp(32px,5vw,56px)] font-extrabold leading-none tracking-[-0.04em]">
              Wiremit
            </div>
            <div class="mt-2 text-[13px] uppercase tracking-[0.08em] text-[var(--foreground)]/55">
              Global P2P Payment Network Coverage — TerraPay
            </div>
          </div>
          <div
            class="whitespace-nowrap rounded-full border border-[rgb(var(--line-primary))] px-[14px] py-[6px] text-[11px] tracking-[0.05em] text-[var(--foreground)]/55"
          >
            Source: <span class="text-[var(--secondary)]">TerraPay</span> · Wiremit ONE API
          </div>
        </div>
      </header>

      <div class="mb-8 flex flex-wrap items-center gap-3">
        <div class="relative min-w-[200px] max-w-[360px] flex-1">
          <div class="relative">
            <svg
              class="absolute left-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="search"
              type="text"
              placeholder="Search country, partner, currency…"
              class="w-full rounded-[8px] border border-[rgb(var(--line-primary))] bg-[var(--surface-input)] py-[10px] pl-10 pr-[14px] text-[13px] outline-none transition-colors placeholder:text-[var(--foreground)]/40 focus:border-[var(--secondary)]"
            />
          </div>
        </div>

        <div class="flex flex-wrap gap-[6px]">
          <button
            v-for="[key, label] in channelFilters"
            :key="key"
            type="button"
            :class="[
              'rounded-[6px] border px-4 py-2 text-[12px] font-medium tracking-[0.04em] transition-colors border-[rgb(var(--line-primary))]',
              activeChannel === key
                ? 'border-[var(--secondary)] bg-[var(--secondary)] text-black'
                : 'bg-[var(--surface-subtle)] text-[var(--foreground)]/55 hover:border-[var(--secondary)] hover:text-[var(--secondary)]',
            ]"
            @click="activeChannel = key"
          >
            {{ label }}
          </button>
        </div>
      </div>

      <div class="mb-8 flex gap-0 overflow-x-auto border-b border-[rgb(var(--line-primary))]">
        <button
          v-for="r in regions"
          :key="r"
          type="button"
          :class="[
            'mb-[-1px] whitespace-nowrap border-b-2 px-5 py-3 font-[Syne,sans-serif] text-[13px] font-semibold tracking-[0.02em] transition-colors',
            activeRegion === r
              ? 'border-[var(--secondary)] text-[var(--secondary)]'
              : 'border-transparent text-[var(--foreground)]/55 hover:text-[var(--foreground)]',
          ]"
          @click="activeRegion = r"
        >
          {{ r }}
          <span
            :class="[
              'ml-[6px] inline-block rounded-full px-[7px] py-[1px] text-[11px]',
              activeRegion === r
                ? 'bg-[var(--surface-input)] text-[var(--foreground)]'
                : 'bg-[var(--surface-subtle)] text-[var(--foreground)]/55',
            ]"
          >
            {{ regionCount(r) }}
          </span>
        </button>
      </div>

      <div class="overflow-hidden rounded-[12px] border border-[rgb(var(--line-primary))] bg-[var(--surface-subtle)]">
        <div class="flex items-center justify-between gap-4 border-b border-[rgb(var(--line-primary))] bg-[var(--surface)] px-6 py-4">
          <div class="font-[Syne,sans-serif] text-[16px] font-bold">
            {{ activeRegion === "All Regions" ? "All Regions" : activeRegion }}
          </div>
          <div class="text-[12px] text-[var(--foreground)]/55">
            Showing <span class="font-bold text-[var(--secondary)]">{{ filtered.length }}</span> corridors
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-[980px] w-full border-collapse text-[12.5px]">
            <thead class="bg-[var(--surface)]">
              <tr>
                <th
                  v-for="[key, label] in tableColumns"
                  :key="key"
                  class="cursor-pointer select-none whitespace-nowrap border-b border-[rgb(var(--line-primary))] px-4 py-[10px] text-left text-[10px] font-medium uppercase tracking-[0.1em] text-[var(--foreground)]/45"
                  @click="toggleSort(key)"
                >
                  <span :class="sortCol === key ? 'text-[var(--secondary)]' : 'transition-colors hover:text-[var(--secondary)]'">
                    {{ label }}
                  </span>
                  <span class="ml-1 inline-block opacity-40">
                    {{ sortCol === key ? (sortDir === 1 ? "↑" : "↓") : "↕" }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!loading && filtered.length === 0">
                <td colspan="8" class="px-6 py-20 text-center text-[var(--foreground)]/45">
                  No corridors match your filters
                </td>
              </tr>
              <tr
                v-for="r in filtered"
                v-else
                :key="`${r.region}-${r.country}-${r.channel}-${r.currency}`"
                class="border-b border-[rgba(2,39,49,0.12)] transition-colors hover:bg-[rgba(2,39,49,0.04)]"
              >
                <td class="whitespace-nowrap px-4 py-3 align-middle font-[Syne,sans-serif] text-[13px] font-semibold leading-[1.4]">
                  {{ r.country }}
                  <div
                    v-if="activeRegion === 'All Regions'"
                    class="mt-[3px] inline-block rounded-[3px] border border-[rgb(var(--line-primary))] bg-[var(--surface)] px-[6px] py-[1px] text-[10px] tracking-[0.04em] text-[var(--foreground)]/45"
                  >
                    {{ r.region }}
                  </div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 align-middle">
                  <span
                    :class="[
                      'inline-block whitespace-nowrap rounded-[4px] border px-[9px] py-[3px] text-[10px] font-medium uppercase tracking-[0.06em]',
                      r.channel === 'Bank'
                        ? 'border-[rgba(2,39,49,0.18)] bg-[rgba(2,39,49,0.08)] text-[var(--primary)]'
                        : r.channel === 'Wallet'
                          ? 'border-[rgba(23,207,23,0.22)] bg-[rgba(23,207,23,0.10)] text-[var(--secondary)]'
                          : 'border-[rgba(2,39,49,0.14)] bg-[rgba(2,39,49,0.05)] text-[var(--foreground)]/75',
                    ]"
                  >
                    {{ r.channel }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 align-middle">
                  <span class="inline-block rounded-[4px] border border-[rgb(var(--line-primary))] bg-[rgba(255,255,255,0.04)] px-2 py-[2px] text-[11px] text-[var(--foreground)]/50">
                    {{ r.currency }}
                  </span>
                </td>
                <td class="whitespace-nowrap px-4 py-3 align-middle font-medium text-[var(--secondary)]">
                  {{ r.fee || "—" }}
                </td>
                <td class="max-w-[220px] px-4 py-3 align-middle text-[var(--foreground)]/80">
                  <div class="line-clamp-2 max-w-[220px]">{{ r.partners || "—" }}</div>
                </td>
                <td class="max-w-[180px] px-4 py-3 align-middle text-[12px] text-[var(--foreground)]/55">
                  <div class="line-clamp-2 max-w-[180px]">{{ r.limits || "—" }}</div>
                </td>
                <td class="max-w-[220px] px-4 py-3 align-middle text-[12px] text-[var(--foreground)]/55">
                  <div class="line-clamp-2 max-w-[220px]">{{ r.delivery || "—" }}</div>
                </td>
                <td class="whitespace-nowrap px-4 py-3 align-middle">
                  <div class="flex min-w-[80px] items-center gap-2">
                    <div class="h-1 w-full min-w-[92px] overflow-hidden rounded bg-[rgb(var(--line-primary))]/60">
                      <div
                        class="h-full rounded bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-[width] duration-500"
                        :style="{ width: `${Math.min(100, parsePenetrationPercent(r.penetration))}%` }"
                      />
                    </div>
                    <span class="min-w-[36px] whitespace-nowrap text-right text-[11px] text-[var(--foreground)]/50">
                      {{ r.penetration || "—" }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="loading" class="mt-6 text-center text-[var(--foreground)]/45">
        Loading spreadsheet…
      </div>
      <footer
        v-else
        class="mt-16 border-t border-[rgb(var(--line-primary))] py-8 text-center text-[11px] tracking-[0.05em] text-[var(--foreground)]/45"
      >
        Wiremit Global P2P Coverage · Source: TerraPay Global Coverage Sheet · Reformatted by Wiremit
      </footer>
    </div>
  </div>
</template>

