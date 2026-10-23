/* ============================================================
   catalog.md, read as data: the gallery's index and entry pages, and
   the repo's scripts (weight, shots, check), all parse it here, so the
   catalog stays the one place an entry is described.
   Plain JS (with JSDoc types) so Node scripts can import it as is.
   ============================================================ */

/**
 * @typedef {{ label: string, url: string }} Link
 * @typedef {{
 *   id: string,
 *   status: string,
 *   weight: string,
 *   cells: Record<string, string>,
 *   links: Link[],
 *   section: Section,
 * }} Entry
 * @typedef {{
 *   key: string,
 *   tier: "core" | "1" | "2" | "3",
 *   title: string,
 *   group: string,
 *   intro: string,
 *   entries: Entry[],
 * }} Section
 * @typedef {{ repo: string, sha: string, date: string, url: string }} Commit
 * @typedef {{ letter: string, path: string, note: string, url: string }} SourceKey
 * @typedef {{
 *   sections: Section[],
 *   entries: Map<string, Entry>,
 *   commits: Record<string, Commit>,
 *   keys: Record<string, SourceKey>,
 *   legend: Record<string, string>,
 * }} Catalog
 */

/**
 * Split a markdown table row into its cells.
 * @param {string} line
 * @returns {string[]}
 */
export function cellsOf(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

/** @param {string} line */
const isRow = (line) => /^\s*\|/.test(line);
/** @param {string} line */
const isSeparator = (line) => /^\s*\|(\s*:?-{3,}:?\s*\|)+\s*$/.test(line);

/**
 * The links in a cell, in order.
 * @param {string} md
 * @returns {Link[]}
 */
export function linksOf(md) {
  return [...md.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)].map((m) => ({ label: m[1], url: m[2] }));
}

/** @type {[RegExp, Section["tier"]][]} */
const TIER_OF = [
  [/^Core\b/, "core"],
  [/^Tier 1\b/, "1"],
  [/^Tier 2\b/, "2"],
  [/^Tier 3\b/, "3"],
];

/**
 * @param {string} md the text of catalog.md
 * @returns {Catalog}
 */
export function parseCatalog(md) {
  const lines = md.split("\n");
  /** @type {Section[]} */
  const sections = [];
  /** @type {Map<string, Entry>} */
  const entries = new Map();
  /** @type {Record<string, Commit>} */
  const commits = {};
  /** @type {Record<string, SourceKey>} */
  const keys = {};
  /** @type {Record<string, string>} */
  const legend = {};

  let h2 = "";
  let h3 = "";
  /** @type {Section | null} */
  let section = null;
  /** @type {string[]} */
  let prose = [];

  /** @param {string} title @returns {Section["tier"] | null} */
  const tierOf = (title) => TIER_OF.find(([re]) => re.test(title))?.[1] ?? null;
  /** @param {string} title @param {string} group */
  const open = (title, group) => {
    const tier = tierOf(group || title);
    if (!tier) {
      section = null;
      return;
    }
    section = { key: slug(title), tier, title, group: group || "", intro: "", entries: [] };
    sections.push(section);
    prose = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m2 = /^## (.+)$/.exec(line);
    const m3 = /^### (.+)$/.exec(line);
    if (m2) {
      h2 = m2[1].trim();
      h3 = "";
      open(h2, "");
      continue;
    }
    if (m3) {
      h3 = m3[1].trim();
      if (tierOf(h2) && tierOf(h2) !== "core") open(h3, h2);
      continue;
    }

    // The pinned commits: "- **A** — `owner/repo` at `0876836` (2026-10-22): …"
    const mc = /^- \*\*([A-Z])\*\* — `([^`]+)` at `([0-9a-f]{7,40})` \(([0-9-]+)\)/.exec(line);
    if (mc && h3 === "Sources") {
      commits[mc[1]] = { repo: mc[2], sha: mc[3], date: mc[4], url: `https://github.com/${mc[2]}` };
      continue;
    }

    if (isRow(line) && i + 1 < lines.length && isSeparator(lines[i + 1])) {
      const head = cellsOf(line);
      i += 2;
      const rows = [];
      while (i < lines.length && isRow(lines[i])) rows.push(cellsOf(lines[i++]));
      i--;
      if (head[0] === "Code" && head[1] === "Means") {
        // The cost codes: "`desk` / `dual`" names two codes in one row.
        rows.forEach(([codes, means]) => {
          for (const m of codes.matchAll(/`([^`]+)`/g)) legend[m[1]] = means.replace(/`/g, "");
        });
      } else if (head[0] === "Key" && h3 === "Sources") {
        rows.forEach(([key, file]) => {
          const link = linksOf(file)[0];
          const letter = key.replace(/[^A-Z].*$/, "").charAt(0);
          keys[key] = {
            letter,
            path: link ? link.label.replace(/`/g, "") : file,
            note: file.replace(/^\[[^\]]*\]\([^)]*\)\s*(—\s*)?/, ""),
            url: link ? link.url : "",
          };
        });
      } else if (head[0] === "id" && section) {
        rows.forEach((row) => {
          /** @type {Record<string, string>} */
          const cells = {};
          head.forEach((h, j) => (cells[h] = row[j] ?? ""));
          const entry = {
            id: cells.id.replace(/`/g, ""),
            status: (cells.Status ?? "src").replace(/`/g, "") || "src",
            weight: cells.Weight ?? "",
            cells,
            links: linksOf(cells.Sources ?? cells.Source ?? ""),
            section: /** @type {Section} */ (section),
          };
          section?.entries.push(entry);
          entries.set(entry.id, entry);
        });
      }
      continue;
    }

    if (section && !section.entries.length && line.trim() && !isRow(line)) prose.push(line);
    if (section) section.intro = prose.join("\n").trim();
  }

  // The alpaca is one entry made of two tables (its moves, its uses): its
  // section carries it, with the status written in its prose.
  const alpaca = sections.find((s) => /^The alpaca/.test(s.title));
  if (alpaca && !alpaca.entries.length) {
    const status = /Status: `(\w+)`/.exec(alpaca.intro)?.[1] ?? "src";
    const entry = {
      id: "alpaca",
      status,
      weight: "",
      cells: {
        id: "alpaca",
        What: /^[^.]+\./.exec(alpaca.intro)?.[0] ?? "",
        Notes: alpaca.intro.split("\n\n")[0] ?? "",
      },
      links: linksOf(alpaca.intro),
      section: alpaca,
    };
    alpaca.entries.push(entry);
    entries.set("alpaca", entry);
  }

  return { sections, entries, commits, keys, legend };
}

/**
 * The entry's one-line description, whatever its table calls it.
 * @param {Entry} entry
 * @returns {string}
 */
export function whatOf(entry) {
  const c = entry.cells;
  return c.What ?? c["The move"] ?? c["The story"] ?? "";
}

/**
 * The entry's hook or signature, as markdown.
 * @param {Entry} entry
 * @returns {string}
 */
export function hookOf(entry) {
  const c = entry.cells;
  return c.Hook ?? c.Signature ?? "";
}

/**
 * The entry's cost codes ("once, split" → ["once", "split"]).
 * @param {Entry} entry
 * @returns {string[]}
 */
export function costOf(entry) {
  const c = entry.cells;
  return (c.Cost ?? c.Type ?? "")
    .split(/,\s*/)
    .map((s) => s.replace(/`/g, "").trim())
    .filter(Boolean);
}

/**
 * The entry's notes, whatever its table calls them.
 * @param {Entry} entry
 * @returns {string}
 */
export function notesOf(entry) {
  const c = entry.cells;
  return c.Notes ?? c["Contract and notes"] ?? c["Worth reusing"] ?? "";
}

/**
 * Pinned to a stage: needs the 390×664 screenshot (CLAUDE.md, Verify).
 * @param {Entry} entry
 * @returns {boolean}
 */
export function isPinned(entry) {
  return costOf(entry).some((c) => /^(pin|sticky)\b/.test(c) || c === "stage") || entry.cells.Type === "stage";
}

/**
 * Write one cell of an entry's row in catalog.md (the weight script keeps
 * the Weight column; the add-effect skill moves the Status).
 * @param {string} md
 * @param {string} id
 * @param {string} column
 * @param {string} value
 * @returns {string}
 */
export function setCell(md, id, column, value) {
  const lines = md.split("\n");
  let head = null;
  for (let i = 0; i < lines.length; i++) {
    if (isRow(lines[i]) && i + 1 < lines.length && isSeparator(lines[i + 1])) {
      head = cellsOf(lines[i]);
      i++;
      continue;
    }
    if (!isRow(lines[i])) {
      head = null;
      continue;
    }
    if (!head || head[0] !== "id") continue;
    const cells = cellsOf(lines[i]);
    if (cells[0].replace(/`/g, "") !== id) continue;
    const j = head.indexOf(column);
    if (j < 0) throw new Error(`catalog.md: the table of ${id} has no ${column} column`);
    cells[j] = value;
    lines[i] = `| ${cells.join(" | ")} |`;
    return lines.join("\n");
  }
  throw new Error(`catalog.md: no row for ${id}`);
}

/**
 * Bytes, the way the catalog and docs/weight.md write them: "412 B",
 * "1.3 KB" (1 KB = 1000 bytes, as measured in phase 0).
 * @param {number} bytes
 * @returns {string}
 */
export function kb(bytes) {
  return bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} KB`;
}

/**
 * A section's anchor.
 * @param {string} text
 * @returns {string}
 */
export function slug(text) {
  return text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** @param {string} s */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * Bold and italics, on escaped text.
 * @param {string} s
 */
const emphasis = (s) =>
  s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");

/**
 * Code spans, then emphasis on the rest.
 * @param {string} md
 */
const spans = (md) =>
  md
    .split(/(`[^`]+`)/g)
    .map((part) => (/^`[^`]+`$/.test(part) ? `<code>${esc(part.slice(1, -1))}</code>` : emphasis(esc(part))))
    .join("");

/**
 * Inline markdown (links, code, bold, italics) to HTML, escaped. Links
 * first, since their text may hold code.
 * @param {string} md
 * @returns {string}
 */
export function inline(md) {
  let out = "";
  let last = 0;
  for (const m of md.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    out += spans(md.slice(last, m.index));
    out += `<a href="${esc(m[2])}">${spans(m[1])}</a>`;
    last = (m.index ?? 0) + m[0].length;
  }
  return out + spans(md.slice(last));
}
