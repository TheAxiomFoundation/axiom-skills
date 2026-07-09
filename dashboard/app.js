const el = (id) => document.getElementById(id);

fetch("catalog.json")
  .then((r) => r.json())
  .then((catalog) => {
    el("tagline").textContent = catalog.marketplace.description;
    el("counts").textContent =
      `${catalog.skills.length} skills · ${catalog.bundles.length} bundles · v${catalog.marketplace.version}`;

    el("bundles").innerHTML = catalog.bundles
      .map(
        (b) => `<div class="bundle">
          <h3>${b.name}${b.mcp ? ' <span class="mcp">+ MCP</span>' : ""}</h3>
          <p>${b.description}</p>
          <p class="members">${b.skills.map((s) => `<code>${s}</code>`).join(" ")}</p>
          <p class="install"><code>/plugin install ${b.name}@axiom-skills</code></p>
        </div>`,
      )
      .join("");

    const render = (filter) => {
      const q = (filter || "").toLowerCase();
      el("skills").innerHTML = catalog.skills
        .filter((s) => !q || (s.name + " " + s.description).toLowerCase().includes(q))
        .map(
          (s) => `<div class="skill">
            <h3>${s.name}</h3>
            <p class="bundles-tags">${s.bundles.map((b) => `<span class="tag">${b}</span>`).join("")}</p>
            <p>${s.description}</p>
          </div>`,
        )
        .join("") || "<p class='empty'>No matches.</p>";
    };
    render("");
    el("search").addEventListener("input", (e) => render(e.target.value));
  })
  .catch(() => {
    el("skills").innerHTML =
      "<p class='empty'>catalog.json not found — run <code>node scripts/build-catalog.mjs</code></p>";
  });
