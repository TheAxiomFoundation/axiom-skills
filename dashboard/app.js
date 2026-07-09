/* Axiom Skills catalog — renders catalog.json. No dependencies. */
const $ = (id) => document.getElementById(id);
const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* Minimal markdown renderer for SKILL.md bodies:
   headings, paragraphs, lists, fenced code, tables, blockquotes, bold/links/inline code. */
function inline(s) {
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
}
function renderMd(md) {
  const lines = md.split("\n");
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
      i++;
      out.push(`<pre><code>${esc(buf.join("\n"))}</code></pre>`);
    } else if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)[0].length;
      out.push(`<h${level}>${inline(line.replace(/^#+\s*/, ""))}</h${level}>`);
      i++;
    } else if (/^\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) rows.push(lines[i++]);
      const cells = (r) => r.split("|").slice(1, -1).map((c) => c.trim());
      const head = cells(rows[0]);
      const body = rows.slice(2).map(cells);
      out.push(
        `<table><thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join("")}</tr></thead>` +
          `<tbody>${body.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`,
      );
    } else if (/^\s*[-*]\s/.test(line) || /^\s*\d+\.\s/.test(line)) {
      const ordered = /^\s*\d+\.\s/.test(line);
      const items = [];
      while (i < lines.length && (/^\s*[-*]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i]) || /^\s{2,}\S/.test(lines[i]))) {
        if (/^\s*[-*]\s/.test(lines[i]) || /^\s*\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\s*([-*]|\d+\.)\s/, ""));
        } else {
          items[items.length - 1] += " " + lines[i].trim();
        }
        i++;
      }
      const tag = ordered ? "ol" : "ul";
      out.push(`<${tag}>${items.map((t) => `<li>${inline(t)}</li>`).join("")}</${tag}>`);
    } else if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(`<blockquote><p>${inline(buf.join(" "))}</p></blockquote>`);
    } else if (line.trim() === "") {
      i++;
    } else {
      const buf = [];
      while (i < lines.length && lines[i].trim() !== "" && !/^(#{1,3}\s|```|\||>\s?|\s*[-*]\s|\s*\d+\.\s)/.test(lines[i])) {
        buf.push(lines[i++]);
      }
      out.push(`<p>${inline(buf.join(" "))}</p>`);
    }
  }
  return out.join("\n");
}

function wireCopy(scope) {
  scope.querySelectorAll(".cmd[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        btn.classList.add("copied");
        const hint = btn.querySelector(".copy-hint");
        const prev = hint.textContent;
        hint.textContent = "copied";
        setTimeout(() => { hint.textContent = prev; btn.classList.remove("copied"); }, 1400);
      });
    });
  });
}

fetch("catalog.json")
  .then((r) => r.json())
  .then((catalog) => {
    $("counts").textContent =
      `${catalog.skills.length} skills · ${catalog.bundles.length} bundles · v${catalog.marketplace.version}`;

    $("bundles").innerHTML = catalog.bundles
      .map(
        (b) => `<div class="bundle">
          <h3>${esc(b.name)}${b.mcp ? '<span class="mcp-badge">+ mcp</span>' : ""}</h3>
          <p>${esc(b.description)}</p>
          <p class="members">${b.skills.map((s) => `<a href="#s-${esc(s)}">§ ${esc(s)}</a>`).join(" · ")}</p>
          <button class="cmd" data-copy="${esc(b.install)}"><code>${esc(b.install)}</code><span class="copy-hint">copy</span></button>
        </div>`,
      )
      .join("");

    // Bundle filter chips
    let activeBundle = null;
    const bundleNames = catalog.bundles.map((b) => b.name).filter((n) => n !== "complete");
    $("filters").innerHTML = bundleNames
      .map((n) => `<button class="filter" data-bundle="${esc(n)}" aria-pressed="false">${esc(n)}</button>`)
      .join("");

    const skillEl = (s) => `<div class="skill" id="s-${esc(s.name)}" data-bundles="${esc(s.bundles.join(","))}">
      <button class="skill-head" aria-expanded="false">
        <span class="silcrow">§</span>
        <span class="skill-name">${esc(s.name)}</span>
        <span class="skill-cite">${s.bundles.map(esc).join(" · ")}</span>
        <p class="skill-summary">${esc(s.summary.replace(/^ALWAYS LOAD THIS SKILL\s*/i, "Loads "))}</p>
      </button>
      <div class="skill-body">
        <div class="skill-body-inner">
          <div class="triggers">
            <span class="triggers-label">Fires on</span>
            ${s.triggers.map((t) => `<span class="trigger">${esc(t)}</span>`).join("")}
          </div>
          <div class="md">${renderMd(s.body)}</div>
        </div>
      </div>
    </div>`;

    const render = () => {
      const q = $("search").value.trim().toLowerCase();
      const visible = catalog.skills.filter((s) => {
        if (activeBundle && !s.bundles.includes(activeBundle)) return false;
        if (!q) return true;
        return (s.name + " " + s.summary + " " + s.triggers.join(" ") + " " + s.body)
          .toLowerCase()
          .includes(q);
      });
      $("skills").innerHTML = visible.length
        ? visible.map(skillEl).join("")
        : `<p class="empty">Nothing matches — the convention may not be encoded yet. That's a PR invitation.</p>`;

      $("skills").querySelectorAll(".skill-head").forEach((head) => {
        head.addEventListener("click", () => {
          const skill = head.closest(".skill");
          const body = skill.querySelector(".skill-body");
          const open = skill.classList.toggle("open");
          head.setAttribute("aria-expanded", String(open));
          body.style.maxHeight = open ? body.scrollHeight + "px" : "0";
        });
      });
      wireCopy($("skills"));
    };

    render();
    wireCopy(document);
    $("search").addEventListener("input", render);
    $("filters").querySelectorAll(".filter").forEach((chip) => {
      chip.addEventListener("click", () => {
        activeBundle = activeBundle === chip.dataset.bundle ? null : chip.dataset.bundle;
        $("filters").querySelectorAll(".filter").forEach((c) =>
          c.setAttribute("aria-pressed", String(c.dataset.bundle === activeBundle)),
        );
        render();
      });
    });

    // Deep-link: #s-<name> opens that section
    if (location.hash.startsWith("#s-")) {
      const target = document.querySelector(location.hash.replace(/[^#\w-]/g, ""));
      if (target) target.querySelector(".skill-head")?.click();
    }
  })
  .catch(() => {
    $("skills").innerHTML =
      "<p class='empty'>catalog.json not found — run <code>node scripts/build-catalog.mjs</code></p>";
  });
