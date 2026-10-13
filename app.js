(() => {
  const data = (window.BRANDRAKSHAK_DATA || []).map(item => ({ ...item }));
  const $ = (id) => document.getElementById(id);
  const tbody = $("findings-body");
  const searchInput = $("search-input");
  const riskFilter = $("risk-filter");
  const form = $("scan-form");
  const result = $("scan-result");

  const esc = (value) => String(value).replace(/[&<>"']/g, ch => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[ch]);

  function renderFindings() {
    const term = searchInput.value.trim().toLowerCase();
    const risk = riskFilter.value;
    const filtered = data.filter(item =>
      (risk === "all" || item.risk === risk) &&
      [item.asset, item.type, item.reason, item.risk].some(v => String(v).toLowerCase().includes(term))
    );
    tbody.innerHTML = filtered.map(item => `
      <tr>
        <td>${esc(item.asset)}<span class="asset-sub">${esc(item.date || "Demo record")}</span></td>
        <td>${esc(item.type)}</td>
        <td><span class="risk-score">${esc(item.score)} / 100</span></td>
        <td><span class="risk-badge risk-${esc(item.risk)}">${esc(item.risk)}</span></td>
        <td class="reason">${esc(item.reason)}</td>
      </tr>`).join("");
    $("empty-state").classList.toggle("hidden", filtered.length !== 0);
    $("result-count").textContent = `Showing ${filtered.length} of ${data.length} sample records`;
    $("metric-reviewed").textContent = String(128 + Math.max(0, data.length - 6));
    $("metric-high").textContent = String(data.filter(x => x.risk === "High").length + 10);
    $("metric-medium").textContent = String(data.filter(x => x.risk === "Medium").length + 24);
  }

  function assessAsset(raw) {
    const input = raw.trim();
    const lower = input.toLowerCase();
    const signals = [];
    let score = 12;
    if (!input) return null;
    if (/\b(secure|verify|support|login|reward|claim|urgent|account|help|official)\b/.test(lower)) {
      score += 25; signals.push("Contains wording often used in brand-themed lures (for example, support, login, or verify).");
    }
    if ((input.match(/-/g) || []).length >= 2) {
      score += 15; signals.push("Contains multiple hyphens; inspect whether the naming pattern is expected.");
    }
    if (/\d/.test(input)) {
      score += 10; signals.push("Contains numbers; compare the domain or handle with the brand's known official assets.");
    }
    if (/(free|bonus|prize|giveaway|limited)/.test(lower)) {
      score += 20; signals.push("Contains promotional or urgency language that deserves manual review.");
    }
    if (/^https?:\/\//i.test(input)) {
      try {
        const host = new URL(input).hostname;
        if (host.split(".").length > 3) {
          score += 10; signals.push("Uses a multi-level hostname; verify the actual registrable domain.");
        }
      } catch (_) {
        score += 10; signals.push("URL format could not be parsed cleanly.");
      }
    } else if (/\s/.test(input)) {
      score += 8; signals.push("Contains spaces; if this is a profile or app name, verify the publisher/owner separately.");
    }
    if (signals.length === 0) signals.push("No configured demo rule matched. This does not prove the asset is safe or authentic.");
    score = Math.min(100, score);
    const risk = score >= 65 ? "High" : score >= 35 ? "Medium" : "Low";
    return { asset: input, score, risk, signals };
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const assessment = assessAsset($("asset-input").value);
    if (!assessment) return;
    result.classList.remove("hidden");
    result.innerHTML = `
      <div class="eyebrow">RULE-BASED DEMO RESULT</div>
      <h4>${esc(assessment.asset)}</h4>
      <div><span class="result-score">${assessment.score}/100</span><span class="risk-badge risk-${assessment.risk}">${assessment.risk} risk</span></div>
      <p>This is a heuristic demonstration only, not a verified threat verdict. No network request was made and the URL was not opened.</p>
      <b>Signals and review notes</b>
      <ul>${assessment.signals.map(s => `<li>${esc(s)}</li>`).join("")}</ul>
      <p><strong>Next step:</strong> Compare the asset against verified official links, ownership records, and trusted threat-intelligence sources before taking action.</p>`;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  $("export-btn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify({
      product: "BrandRakshak AI",
      exportType: "fictional-demo-findings",
      generatedAt: new Date().toISOString(),
      disclaimer: "Fictional sample data; not verified threat intelligence.",
      findings: data
    }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "brandrakshak-demo-report.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  });

  searchInput.addEventListener("input", renderFindings);
  riskFilter.addEventListener("change", renderFindings);
  renderFindings();
})();
