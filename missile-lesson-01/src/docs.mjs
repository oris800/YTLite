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

// ---- credits.md from the media manifest (only assets that appear in the video are listed as used) ----
import { usedIds } from './lesson.mjs';
const manF = path.join(ROOT, 'build', 'media', 'manifest.json');
if (fs.existsSync(manF)) {
  const man = JSON.parse(fs.readFileSync(manF, 'utf8'));
  const row = (m) => `| \`${m.id}\` | ${m.kind === 'video' ? 'וידאו' : 'תמונה'} | ${m.title} | ${m.author} | ${m.license} | ${m.source_page_url} |`;
  const head = '| מזהה | סוג | כותרת | יוצר | רישיון | מקור |\n|---|---|---|---|---|---|\n';
  let c = '# קרדיטים ורישיונות: מבנה הטיל, שיעור 1\n\nכל המדיה החיצונית בסרטון היא נחלת הכלל או ברישיון Creative Commons חופשי. הקטעים משמשים כתמונות רקע תומכות בלבד, מושתקים וקצוצים.\n\n';
  c += '## מדיה שמופיעה בסרטון\n\n' + head + man.filter(m => usedIds.has(m.id)).map(row).join('\n') + '\n\n';
  c += '## מדיה שנאספה ונבדקה אך לא נכנסה לסרטון\n\n' + head + man.filter(m => !usedIds.has(m.id)).map(row).join('\n') + '\n\n';
  c += '## חומרים מקוריים וכלים\n\n- תסריט, שרטוטים (SVG), אנימציה וגרפים: נוצרו עבור השיעור הזה.\n- קריינות: קול סינתטי (Gemini TTS).\n- גופן: Heebo, רישיון SIL Open Font License 1.1 (https://github.com/google/fonts/tree/main/ofl/heebo).\n\n## הערות\n\n- קטעי DVIDS מסומנים בעמוד המקור כ־Public Domain. הופעת חומר של משרד ההגנה האמריקאי אינה מהווה תמיכה או אישור שלו.\n- חומרי NASA אינם מוגנים בזכויות יוצרים. השימוש בהם אינו מרמז על תמיכה של NASA.\n';
  fs.writeFileSync(path.join(ROOT, 'credits.md'), c);
  console.log('credits.md used assets:', man.filter(m => usedIds.has(m.id)).map(m => m.id).join(', '));
}
