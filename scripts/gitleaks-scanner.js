/**
 * Standalone Gitleaks Security Scanner
 * Scans workspace files for exposed secrets, API keys, credentials, and tokens.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const IGNORED_PATHS = ['node_modules', '.git', '.brief', 'package-lock.json', '.gitleaks.toml'];

const RULES = [
    { id: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/g },
    { id: 'GitHub Personal Access Token', regex: /ghp_[0-9a-zA-Z]{36}|github_pat_[0-9a-zA-Z_]{82}/g },
    { id: 'Private Key Header', regex: /-----BEGIN (RSA|DSA|EC|OPENSSH|PRIVATE) KEY-----/g },
    { id: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{32,64}/g },
    { id: 'Generic Secret Pattern', regex: /(?:api_key|secret_key|access_token|password|auth_token)\s*[:=]\s*["']([^"'\s]{16,64})["']/gi }
];

function scanDirectory(dir, leaks = []) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(ROOT_DIR, fullPath);

        if (IGNORED_PATHS.some(ignored => relPath.startsWith(ignored) || entry.name === ignored)) {
            continue;
        }

        if (entry.isDirectory()) {
            scanDirectory(fullPath, leaks);
        } else if (entry.isFile()) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                RULES.forEach(rule => {
                    let match;
                    while ((match = rule.regex.exec(content)) !== null) {
                        // Avoid false positives in scanner or documentation files
                        if (relPath.includes('gitleaks-scanner.js') || relPath.endsWith('.md')) continue;

                        leaks.push({
                            file: relPath,
                            rule: rule.id,
                            match: match[0].substring(0, 12) + '***'
                        });
                    }
                });
            } catch (err) {
                // Ignore binary files or unreadable items
            }
        }
    }
    return leaks;
}

console.log('🔒 Running Gitleaks Secret Scanner...');
const findings = scanDirectory(ROOT_DIR);

if (findings.length === 0) {
    console.log('✅ Gitleaks Audit Passed: No secrets, credentials, or private keys detected.');
    process.exit(0);
} else {
    console.error('🚨 GITLEAKS ALERT: Exposed Secrets Detected!');
    findings.forEach(leak => {
        console.error(` ❌ File: ${leak.file} | Issue: ${leak.rule} | Match: ${leak.match}`);
    });
    process.exit(1);
}
