// Compact eslint report: file, line, rule. The default formatter prints the full
// React Compiler essay for every violation, which buries the actual list.
import { execFileSync } from 'node:child_process';

// eslint exits non-zero when it finds anything, which is the normal case here, so the
// throw has to be caught or this reporter can never report.
let out = '';
try {
  out = execFileSync('npx', ['eslint', '.', '-f', 'json'], {
    encoding: 'utf8',
    shell: true,
    maxBuffer: 64 * 1024 * 1024,
  });
} catch (e) {
  out = e.stdout ?? '';
}

const results = JSON.parse(out.slice(out.indexOf('[')));
let n = 0;
for (const f of results) {
  if (!f.messages.length) continue;
  console.log(f.filePath.replace(process.cwd(), '').replace(/^[\\/]/, ''));
  for (const m of f.messages) {
    n++;
    console.log(`   ${m.severity === 2 ? 'error' : 'warn '}  line ${m.line}  ${m.ruleId}`);
  }
}
console.log(`\n${n} problem(s)`);
