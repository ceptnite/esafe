function summarizePolicy() {
    const text = document.getElementById('policyText').value.trim();
    if (!text) {
        alert('Please paste a privacy policy or terms of service text.');
        return;
    }
    const summary = generateSummary(text);
    displaySummary(summary);
}

function generateSummary(text) {
    const normalized = normalizeText(text);
    const sections = splitByHeadings(text);
    const targetSections = {
        thirdParties: ['third party', 'third-party', 'third parties', 'share', 'shared with', 'disclose', 'disclosure', 'partners', 'sell'],
        dataCollection: ['collect', 'data collection', 'we collect', 'information we collect', 'gather', 'personal data', 'personal information'],
        dataUsage: ['use', 'processing', 'purpose', 'we use', 'used for', 'process', 'analytics', 'advertis'],
        userRights: ['right', 'access', 'delete', 'opt-out', 'control your', 'erase', 'update', 'correct', 'restrict'],
        security: ['security', 'protect', 'encrypt', 'safeguard', 'breach', 'incident']
    };
    const out = {};
    for (const key of Object.keys(targetSections)) {
        const phrases = targetSections[key];
        let best = findInSections(sections, phrases);
        if (!best) best = scoredSearch(normalized, phrases, 3);
        out[key] = best || '';
    }
    return out;
}

function normalizeText(text) {
    return text.replace(/\r\n?/g, '\n').trim();
}

function splitByHeadings(raw) {
    const lines = raw.split(/\r?\n/);
    const sections = [];
    let current = {title: 'intro', content: ''};
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const isHeading = (
            /^#{1,6}\s+/.test(line) ||
            (/^[A-Z0-9 \\-]{3,}$/.test(line) && line === line.toUpperCase()) ||
            /:$/.test(line) ||
            (/^[A-Z][a-z]+(\s+[A-Z][a-z]+){0,3}$/.test(line) && line.length < 60 && i+1 < lines.length && /^[-=]{3,}$/.test(lines[i+1]))
        );
        if (isHeading) {
            sections.push(current);
            current = {title: line.toLowerCase(), content: ''};
        } else {
            current.content += (current.content ? '\n' : '') + line;
        }
    }
    sections.push(current);
    return sections.map(s => ({title: s.title || 'section', content: s.content || ''}));
}

function findInSections(sections, phrases) {
    for (const s of sections) {
        for (const p of phrases) {
            if ((s.title || '').toLowerCase().includes(p)) {
                const summary = topSentences(s.content, phrases, 2);
                if (summary) return summary;
            }
        }
    }
    return null;
}

function scoredSearch(text, phrases, maxSentences=3) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const scored = sentences.map(s => {
        const low = s.toLowerCase();
        let score = 0;
        for (const p of phrases) {
            if (low.includes(p)) score += 10;
            const stem = p.split(/\s+/)[0];
            if (stem && low.match(new RegExp('\\b' + escapeRegExp(stem), 'i'))) score += 1;
        }
        return {s: s.trim(), score};
    }).filter(x => x.score > 0).sort((a,b)=>b.score-a.score);
    return scored.slice(0, maxSentences).map(x=>x.s).join(' ');
}

function topSentences(content, phrases, n=2) {
    const sentences = content.split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);
    const scored = sentences.map(s => {
        const low = s.toLowerCase();
        let score = 0;
        for (const p of phrases) {
            if (low.includes(p)) score += 10;
            const stem = p.split(/\s+/)[0];
            if (stem && low.match(new RegExp('\\b' + escapeRegExp(stem), 'i'))) score += 1;
        }
        return {s, score};
    }).sort((a,b)=>b.score-a.score);
    if (!scored.length || scored[0].score === 0) return '';
    return scored.slice(0, n).map(x=>x.s).join(' ');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function displaySummary(summary) {
    const content = document.getElementById('summaryContent');
    content.innerHTML = `
        ${createCard('Third Parties', summary.thirdParties || 'No specific information found.', riskLevelFromText(summary.thirdParties))}
        ${createCard('Data Collection', summary.dataCollection || 'No specific information found.', riskLevelFromText(summary.dataCollection))}
        ${createCard('Data Usage', summary.dataUsage || 'No specific information found.', riskLevelFromText(summary.dataUsage))}
        ${createCard('Your Rights', summary.userRights || 'No specific information found.', riskLevelFromText(summary.userRights))}
        ${createCard('Security Measures', summary.security || 'No specific information found.', riskLevelFromText(summary.security))}
    `;
    const sec = document.getElementById('summarySection');
    if (sec) sec.classList.add('active');
}

function riskLevelFromText(text) {
    const lowTerms = ['no', 'none', 'not specified', 'not disclosed', 'do not'];
    const highTerms = ['share', 'sell', 'transfer', 'third party', 'disclose', 'retain', 'tracking', 'track'];
    const t = (text || '').toLowerCase();
    for (const h of highTerms) if (t.includes(h)) return 'high';
    for (const l of lowTerms) if (t.includes(l)) return 'low';
    return t ? 'medium' : 'low';
}

function createCard(title, content, riskLevel) {
    return `
        <div class="report-card">
            <h3>${title}</h3>
            <p>${content || 'No specific information found.'}</p>
            <span class="risk-badge risk-${riskLevel}">Risk Level: ${riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}</span>
        </div>
    `;
}

function clearInput() {
    document.getElementById('policyText').value = '';
    document.getElementById('summarySection').classList.remove('active');
}

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "Light Mode";
  }
  themeToggle.onclick = () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("theme", isDark ? "light" : "dark");
    themeToggle.textContent = isDark ? "Dark Mode" : "Light Mode";
  };
