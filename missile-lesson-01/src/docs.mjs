// Generates script.md (display text + narration text) from lesson.mjs
import { scenes, CH } from './lesson.mjs';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const disp = (s) => s.replace(/\{([^|}]*)\|([^}]*)\}/g, '$1');
let md = '# מבנה הטיל: מה יש בפנים ואיך זה עובד\n\nתסריט קריינות, שיעור 1. המספרים בשיעור עגולים ולהמחשה בלבד, ואינם נתונים של מערכת אמיתית.\n', words = 0, ch = -1;
for (const s of scenes) {
  if (s.ch !== ch) { ch = s.ch; md += `\n## ${ch ? `פרק ${ch}: ${CH[ch]}` : 'פתיחה'}\n`; }
  md += `\n<!-- scene ${s.id} -->\n`;
  for (const seg of s.segs) {
    if (typeof seg === 'object') { md += `\n*[שקט של ${seg.silence} שניות${/data-count/.test(s.html) ? ' עם שעון ספירה לאחור על המסך' : ''}]*\n`; continue; }
    const t = disp(seg); words += t.split(/\s+/).length; md += `\n${t}\n`;
  }
}
md += `\n---\n\nסך הכול: ${words} מילים בקריינות, ${scenes.length} סצנות.\n\nהערה: טקסט הקריינות שנשלח למנוע הדיבור זהה לטקסט כאן, אלא שמספרים ויחידות כתובים בו במילים, ומילים רב־משמעיות מנוקדות (ראו \`src/lesson.mjs\`).\n`;
fs.writeFileSync(path.join(ROOT, 'script.md'), md);
console.log('script.md words:', words);
