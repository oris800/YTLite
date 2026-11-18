// Single source of truth for the lesson: narration text + visuals per scene.
// Text markup: {display|spoken}  -> subtitles/script show "display", TTS reads "spoken".

const CH = [
  null,
  'מה ההבדל בין רקטה לטיל?',
  'מה יש בתוך הטיל?',
  'מה דוחף את הטיל קדימה?',
  'כמה מהר זה מהיר?',
  'איך הטיל יודע איפה הוא, ואיפה המטרה?',
  'מה המחשב עושה עם כל המידע?',
  'מה קורה מהשיגור ועד המפגש?',
  'מה חשוב לזכור?',
];
const ORD = ['', 'ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שביעי', 'שמיני'];

// ---------- small html helpers ----------
const E = (s, cls = '') => `<span class="eq ${cls}">${s.replace(/\[([^\]]+)\]/g, '<i>$1</i>')}</span>`;
const vid = (id, w, s = '0', extra = '') => `<div class="vid" data-vid="${id}" data-s="${s}" style="width:${w}px;height:${Math.round(w * 9 / 16)}px;${extra}"><img src="../build/media/clips/${id}_first.jpg"></div>`;
const pic = (id, w, h, s = '0', extra = '') => `<div class="pic" data-s="${s}" style="width:${w}px;height:${h}px;${extra}"><img src="../build/media/stills/${id}.jpg"></div>`;
const titleCard = (n) => `<div class="center"><div class="chip" data-s="0">פרק ${n}</div><div class="q" data-s="0+0.2">${CH[n]}</div></div>`;
const bullets = (items) => `<ul class="b">${items.map(([s, h]) => `<li data-s="${s}">${h}</li>`).join('')}</ul>`;
const mathRows = (rows) => `<div class="math">${rows.map(([s, h]) => `<div class="row" data-s="${s}">${h}</div>`).join('')}</div>`;
const pauseScene = (lines) => `<div class="pausebox"><div class="txt"><div class="pausebadge" data-s="0">עצרו ופתרו</div>${lines.map(l => `<p data-s="0+0.3">${l}</p>`).join('')}</div>
  <div class="ring" data-s="0+0.3"><svg viewBox="0 0 360 360"><circle cx="180" cy="180" r="160" fill="none" stroke="#2a3b57" stroke-width="22"/><circle data-ring cx="180" cy="180" r="160" fill="none" stroke="#ffb703" stroke-width="22" stroke-linecap="round"/></svg><div class="n" data-count="1">10</div></div></div>`;

// ---------- missile icon (points right, centered at 0,0) ----------
const missileIcon = (sc = 1, color = '#eef3fa') => `<g transform="scale(${sc})"><path d="M-46,-9 L22,-9 Q40,-7 52,0 Q40,7 22,9 L-46,9 Z" fill="${color}"/><path d="M-46,-9 L-58,-24 L-38,-24 L-28,-9 Z M-46,9 L-58,24 L-38,24 L-28,9 Z" fill="${color}"/><path d="M-46,-6 L-72,0 L-46,6 Z" fill="#ff8c42"/></g>`;

// ---------- cutaway diagram ----------
// seg: map section -> segment index when it is introduced; lit: segment list where everything is lit
function cutaway(seg, lit) {
  const hl = (k) => `data-hl="${[...lit, seg[k]].join(',')}"`;
  const lab = (k, x, y, tx, ty, name, sub, col, up) => `<g data-s="${seg[k]}">
    <path d="M${tx},${ty} L${x},${up ? y - 62 : y + 30}" stroke="${col}" stroke-width="3" fill="none"/><circle cx="${tx}" cy="${ty}" r="7" fill="${col}"/>
    <text class="lab" x="${x}" y="${up ? y - 108 : y + 66}" text-anchor="middle" style="fill:${col}">${name}</text>
    <text class="small" x="${x}" y="${up ? y - 74 : y + 100}" text-anchor="middle">${sub}</text></g>`;
  return `<svg viewBox="0 0 1760 640" width="1760" height="640" direction="rtl">
  <g ${hl('airframe')}>
    <path d="M160,230 L128,138 L205,138 L292,230 Z M160,350 L128,442 L205,442 L292,350 Z" fill="#22344f" stroke="#eef3fa" stroke-width="4"/>
  </g>
  <g ${hl('control')}>
    <rect x="150" y="230" width="150" height="120" fill="#4a1d32" stroke="#ff5d8f" stroke-width="3"/>
    <circle cx="205" cy="258" r="15" fill="#ff5d8f"/><circle cx="205" cy="322" r="15" fill="#ff5d8f"/>
    <path d="M205,243 L190,180 M205,337 L190,400" stroke="#ff5d8f" stroke-width="7" stroke-linecap="round"/>
    <rect x="240" y="268" width="40" height="44" rx="6" fill="#ff5d8f" opacity=".6"/>
  </g>
  <g ${hl('prop')}>
    <path d="M150,258 L92,236 L92,344 L150,322 Z" fill="#5a3418" stroke="#ff8c42" stroke-width="3"/>
    <rect x="300" y="230" width="660" height="120" fill="#4a2b14" stroke="#ff8c42" stroke-width="3"/>
    <rect x="320" y="246" width="620" height="88" rx="8" fill="#ff8c42" opacity=".75"/>
    <path d="M320,290 L920,290" stroke="#2a1608" stroke-width="26" stroke-linecap="round"/>
    <text x="630" y="300" text-anchor="middle" style="font-size:26px;fill:#ffd9b8;font-weight:600">חומר הודף</text>
  </g>
  <g ${hl('power')}>
    <rect x="960" y="230" width="130" height="120" fill="#3b3413" stroke="#ffd166" stroke-width="3"/>
    <rect x="982" y="286" width="60" height="44" rx="5" fill="#ffd166"/><rect x="1042" y="298" width="9" height="20" fill="#ffd166"/>
    <path d="M1004,297 L996,310 L1010,310 L1002,322" stroke="#3b3413" stroke-width="4" fill="none"/>
    <rect x="1000" y="216" width="56" height="14" rx="6" fill="#2fd6a3"/><rect x="1004" y="246" width="48" height="24" rx="4" fill="#2fd6a3" opacity=".8"/>
  </g>
  <g ${hl('payload')}>
    <rect x="1090" y="230" width="180" height="120" fill="#2c3542" stroke="#b6c2d2" stroke-width="3"/>
    <rect x="1112" y="252" width="136" height="76" rx="10" fill="#b6c2d2" opacity=".45"/>
  </g>
  <g ${hl('guidance')}>
    <rect x="1270" y="230" width="170" height="120" fill="#2e2452" stroke="#b99bff" stroke-width="3"/>
    <rect x="1292" y="252" width="62" height="76" rx="6" fill="#b99bff"/><path d="M1304,270 h38 M1304,290 h38 M1304,310 h38" stroke="#2e2452" stroke-width="5"/>
    <circle cx="1398" cy="290" r="26" fill="none" stroke="#b99bff" stroke-width="6"/><circle cx="1398" cy="290" r="8" fill="#b99bff"/>
  </g>
  <g ${hl('seeker')}>
    <path d="M1440,230 Q1585,236 1660,290 Q1585,344 1440,350 Z" fill="#12384a" stroke="#4cc9f0" stroke-width="3"/>
    <path d="M1500,256 Q1540,290 1500,324" fill="none" stroke="#4cc9f0" stroke-width="8" stroke-linecap="round"/><path d="M1452,290 L1506,290" stroke="#4cc9f0" stroke-width="8"/>
    <path d="M1548,270 Q1562,290 1548,310 M1572,262 Q1592,290 1572,318" fill="none" stroke="#4cc9f0" stroke-width="4" opacity=".7"/>
  </g>
  <path ${hl('airframe')} d="M150,230 L1440,230 Q1585,236 1660,290 Q1585,344 1440,350 L150,350 Z" fill="none" stroke="#eef3fa" stroke-width="5"/>
  ${lab('seeker', 1560, 150, 1540, 262, 'ראש ביות (מחפש)', 'רואה את המטרה', '#4cc9f0', true)}
  ${lab('guidance', 1355, 430, 1355, 340, 'הנחיה', 'מחשב טיסה + חיישני תנועה', '#b99bff', false)}
  ${lab('payload', 1180, 150, 1180, 244, 'מטען', 'מה שהטיל נושא ליעד', '#b6c2d2', true)}
  <g data-s="${seg.power}">
    <path d="M1012,330 L1000,460" stroke="#ffd166" stroke-width="3"/><circle cx="1012" cy="330" r="7" fill="#ffd166"/>
    <text class="lab" x="1000" y="496" text-anchor="middle" style="fill:#ffd166">סוללה</text><text class="small" x="1000" y="530" text-anchor="middle">חשמל לכל המערכות</text>
    <path d="M1028,216 L880,88" stroke="#2fd6a3" stroke-width="3"/><circle cx="1028" cy="218" r="7" fill="#2fd6a3"/>
    <text class="lab" x="860" y="42" text-anchor="middle" style="fill:#2fd6a3">קישור נתונים</text><text class="small" x="860" y="76" text-anchor="middle">רדיו אל הקרקע וממנה</text>
  </g>
  ${lab('prop', 600, 430, 600, 340, 'הנעה', 'מנוע רקטי', '#ff8c42', false)}
  ${lab('control', 400, 150, 250, 250, 'בקרה', 'מנועים חשמליים + סנפירים', '#ff5d8f', true)}
  <g data-s="${seg.airframe}">
    <path d="M330,350 L250,540" stroke="#eef3fa" stroke-width="3"/><circle cx="330" cy="350" r="7" fill="#eef3fa"/>
    <text class="lab" x="250" y="580" text-anchor="middle">גוף הטיל</text><text class="small" x="250" y="614" text-anchor="middle">קל, חזק, אווירודינמי</text>
  </g>
  </svg>`;
}

// ---------- scenes ----------
const scenes = [];
const add = (id, ch, html, segs, opt = {}) => scenes.push({ id, ch, html, segs, ...opt });

// ===== INTRO =====
add('intro1', 0, `<div class="center">
  <div data-s="0" style="margin-bottom:10px"><svg viewBox="-120 -40 240 80" width="560" height="186">${missileIcon(2)}</svg></div>
  <div class="big" data-s="0+0.3">מבנה הטיל</div><div class="sub2" data-s="0+0.6">מה יש בפנים ואיך זה עובד</div></div>`,
  [
    'טיל מיירט משוגר, ותוך שניות הוא טס מהר פי כמה ממטוס נוסעים. אין בו טייס, ואף אחד לא מחזיק הגה. ובכל זאת הוא מוצא נקודה קטנה בשמיים, במרחק עשרות קילומטרים, ומגיע בדיוק אליה.',
  ], { bare: true });

add('intro2', 0, `<h1 data-s="0">מה נעשה בשיעור</h1><div class="cols"><div>${bullets([
    ['0', 'נפתח את הטיל ונראה מה יש בפנים'],
    ['0+2.5', 'נבין מה התפקיד של כל חלק'],
    ['0+5', 'נראה איך החלקים עובדים יחד'],
  ])}</div><div><div class="card" data-s="1"><h2>4 רגעים מתמטיים</h2>${bullets([
    ['1+1', 'מהירות, זמן ומרחק'], ['1+2.5', 'המרת יחידות'], ['1+4', 'יחסים ואחוזים'], ['1+5.5', 'קריאת גרף'],
  ])}</div><p class="note" data-s="1+8" style="margin-top:22px">המספרים בשיעור עגולים ולהמחשה בלבד. הכינו דף ועט.</p></div></div>`,
  [
    'איך זה אפשרי? בשיעור הזה נפתח את הטיל ונסתכל פנימה: מה החלקים, מה התפקיד של כל אחד, ואיך הם עובדים יחד.',
    'בדרך נתרגל גם מתמטיקה בסיסית: מהירות, זמן ומרחק, המרת יחידות, יחסים ואחוזים, וקריאת גרף. המספרים בשיעור עגולים ונועדו להמחשה בלבד, הם לא נתונים של מערכת אמיתית. כדאי להכין דף ועט.',
  ]);

// ===== CH 1 =====
add('c1t', 1, titleCard(1), ['פרק ראשון. מה בעצם ההבדל בין רקטה לטיל?']);

add('c1a', 1, `<div class="cols">
  <div><div class="card hlbox" data-hl="0" style="margin-bottom:20px"><h2 style="color:var(--orange)">רקטה (לא מונחית)</h2><p>המסלול נקבע בשיגור. אי אפשר לתקן.</p></div>${vid('himars_rocket_salvo', 800, '0')}</div>
  <div><div class="card hlbox" data-s="1" data-hl="1" style="margin-bottom:20px"><h2>טיל (מונחה)</h2><p>חיישנים + מחשב + הגאים: מתקן בזמן הטיסה.</p></div>${vid('sm2_ship_launch', 800, '1')}</div></div>`,
  [
    'רקטה, במובן הצבאי המקובל של המילה, היא בדרך כלל כלי לא מונחה. מכוונים את המשגר, מציתים את המנוע, ומאותו רגע היא טסה כמו אבן שנזרקה: המסלול שלה נקבע בשיגור, ואי אפשר לתקן אותו.',
    'טיל הוא כלי מונחה. יש לו חיישנים, מחשב והגאים, והוא מתקן את המסלול שלו תוך כדי טיסה. זה כל ההבדל: לא הגודל ולא המנוע, אלא היכולת לתקן.',
    'למה זה חשוב? כי בשיגור אף פעם לא יודעים הכול. הרוח משתנה, המנוע לא בוער בדיוק כמו שתכננו, ואם המטרה היא מטוס, היא גם זזה ומתחמקת. כלי שלא מתקן יחטיא. כלי שמתקן כל הזמן יכול לפגוע.',
  ], { vids: ['himars_rocket_salvo', 'sm2_ship_launch'] });

add('c1b', 1, `<h1 data-s="0">למילה "רקטה" יש שלושה מובנים</h1>${bullets([
    ['0+1', '<span class="em">נשק לא מונחה</span><small>המובן שבו נשתמש כשנשווה לטיל</small>'],
    ['0+4', '<span class="em">מנוע רקטי</span><small>סוג המנוע, שנמצא גם בטילים</small>'],
    ['0+6', '<span class="em">משגר לוויינים</span><small>"רקטה לחלל"</small>'],
  ])}`,
  ['שימו לב שהמילה רקטה משמשת גם במובנים אחרים: מנוע רקטי הוא סוג של מנוע, ומשגר לוויינים נקרא גם הוא רקטה. בשיעור הזה, כשנגיד רקטה לא מונחית, נתכוון למובן הצבאי.']);

add('c1c', 1, `<h1 data-s="0">למה משמשים טילים?</h1><div class="cols"><div style="flex:1.05">${bullets([
    ['0+1', '<span class="em">יירוט (הגנה אווירית)</span><small>מהקרקע או מספינה אל מטרה מעופפת</small>'],
    ['1', '<span class="em">נגד ספינות</span><small>טס נמוך מעל הים, מחפש בעצמו בסוף</small>'],
    ['1+6', '<span class="em">אוויר־אוויר</span><small>ממטוס אל מטוס</small>'],
  ])}</div><div style="flex:none;position:relative">${vid('thaad_interceptor_launch', 800, '0+1')}${vid('antiship_missile_launch', 800, '1', 'position:absolute;top:0;left:0')}<div class="cap" data-s="0+1">שיגורי ניסוי של טיל מיירט ושל טיל נגד ספינות</div></div></div>`,
  [
    'למה משמשים טילים? שלוש דוגמאות. טיל מיירט בהגנה אווירית משוגר מהקרקע או מספינה כדי לפגוע במטרה מעופפת: מטוס, כטב״ם, רקטה או טיל אחר. בישראל מכירים את כיפת ברזל, שהמיירט שלה נקרא תמיר, ואת חץ {3|שלוש}, שמיירט טילים בליסטיים מחוץ לאטמוספרה.',
    'טיל נגד ספינות טס בדרך כלל נמוך מעל הים, ומחפש את הספינה בעצמו בקטע האחרון של הטיסה. וטיל אוויר־אוויר משוגר ממטוס אל מטוס אחר.',
  ], { vids: ['thaad_interceptor_launch', 'antiship_missile_launch'] });

add('c1d', 1, `<h1 data-s="0">קרוב משפחה: משגר הלוויינים</h1><div class="cols"><div style="flex:none">${vid('mercury_redstone_launch', 800, '0')}<div class="cap" data-s="0">שיגור מרקורי־רדסטון (NASA)</div></div>
  <div><div class="card" data-s="0+7" style="margin-bottom:22px"><h2>1957</h2><p>טיל R-7 משגר את ספוטניק, הלוויין הראשון</p></div>
  <div class="card" data-s="0+13" style="margin-bottom:22px"><h2>1961</h2><p>טיל רדסטון נושא את אלן שפרד לטיסה קצרה בחלל</p></div>
  <div class="card" data-s="1"><h2 style="color:var(--amber)">אותו עיקרון</h2><p>מנוע רקטי + מבנה קל + הנחיה.<br>ההבדל: המטען והיעד.</p></div></div></div>`,
  [
    'ויש קרוב משפחה מפתיע: משגר הלוויינים. המשגרים הראשונים לחלל היו טילים בליסטיים שהוסבו למשימה חדשה. הטיל הסובייטי {R-7|אֶר שֶׁבַע} שיגר את ספוטניק, הלוויין הראשון, בשנת {1957|אלף תשע מאות חמישים ושבע}. טיל רדסטון האמריקאי נשא את האסטרונאוט אלן שפרד לטיסה קצרה בחלל, בשנת {1961|אלף תשע מאות שישים ואחת}.',
    'העיקרון זהה: מנוע רקטי, מבנה קל, ומערכת הנחיה שמחזיקה את הכלי על המסלול. ההבדל הוא במטען וביעד. לכן רוב מה שתלמדו כאן על טילים נכון גם למשגרי חלל.',
  ], { vids: ['mercury_redstone_launch'] });

// ===== CH 2 =====
add('c2t', 2, titleCard(2), ['פרק שני. מה יש בתוך הטיל?']);

add('c2a', 2, `<div style="margin-top:60px">${cutaway({ seeker: 1, guidance: 2, payload: 3, prop: 4, control: 5, power: 6, airframe: 7 }, [0, 7])}</div>
  <p class="note" data-s="0" style="position:absolute;top:0;right:0">שרטוט סכמטי, לא טיל מסוים</p>`,
  [
    'נחתוך טיל לאורכו. זה שרטוט סכמטי, לא טיל מסוים, אבל הסידור הזה אופייני. נעבור מהחרטום אל הזנב.',
    'בחרטום יושב ראש הביות, שנקרא גם מחפש. זה החיישן שרואה את המטרה, בעזרת מכ״ם או מצלמת חום. הוא מכוסה בכיפה, שהגלים שבהם הוא משתמש עוברים דרכה.',
    'מאחוריו מדור ההנחיה: מחשב הטיסה, וחיישני התנועה של הטיל עצמו. זה המוח.',
    'אחריו מדור המטען, הדבר שהטיל נושא ליעד. בטיל צבאי זה ראש קרבי, ובמשגר חלל זה לוויין. בשיעור הזה לא ניכנס למטען, כי אותנו מעניין איך הטיל מגיע.',
    'החלק הגדול ביותר הוא בדרך כלל ההנעה: מנוע רקטי, ובתוכו החומר ההודף, כלומר הדלק והמחמצן שהמנוע שורף.',
    'בזנב, בשרטוט שלנו, נמצאת מערכת הבקרה: מנועים חשמליים קטנים שמזיזים סנפירים. הסנפירים הם ההגאים של הטיל. יש טילים שבהם ההגאים דווקא מקדימה.',
    'ועוד שני דברים קטנים, שבלעדיהם שום דבר לא עובד. סוללה, שמספקת חשמל לכל המערכות. זו סוללה מיוחדת, שיכולה לחכות במחסן שנים רבות, ומופעלת רק רגע לפני השימוש. וקישור נתונים: מקלט ומשדר רדיו, שמחברים את הטיל למערכת שעל הקרקע.',
    'וכל זה ארוז בתוך גוף הטיל: צינור קל וחזק, בצורה שחותכת את האוויר. המבנה צריך לעמוד בעומסים של התאוצה, וגם בחום שנוצר בטיסה מהירה באוויר.',
  ]);

add('c2b', 2, `<h1 data-s="0">הטיל כמו גוף</h1><table class="t" style="font-size:42px">
  <tr data-s="0+3"><th>מערכת</th><th>תפקיד</th><th>בגוף</th></tr>
  <tr data-s="0+4"><td>גוף הטיל</td><td>מחזיק הכול</td><td class="em">שלד</td></tr>
  <tr data-s="0+5"><td style="color:var(--orange)">הנעה</td><td>דוחפת קדימה</td><td class="em">שרירים</td></tr>
  <tr data-s="0+6"><td style="color:var(--cyan)">ראש ביות</td><td>רואה את המטרה</td><td class="em">עיניים</td></tr>
  <tr data-s="0+7"><td style="color:var(--violet)">הנחיה</td><td>מחליטה לאן לפנות</td><td class="em">מוח</td></tr>
  <tr data-s="0+8"><td style="color:var(--pink)">בקרה</td><td>מזיזה את הסנפירים</td><td class="em">ידיים</td></tr>
  <tr data-s="0+9"><td>מטען</td><td>מה שנושאים ליעד</td><td></td></tr>
  <tr data-s="0+10"><td style="color:#ffd166">חשמל + קישור נתונים</td><td>אנרגיה ותקשורת</td><td class="em">דם ועצבים</td></tr></table>`,
  ['אז יש לנו שבע מערכות: גוף, הנעה, ראש ביות, הנחיה, בקרה, מטען, ושירותים משותפים: חשמל וקישור נתונים. אפשר לחשוב על זה כמו על גוף: שלד, שרירים, עיניים, מוח וידיים. עכשיו נעבור עליהן, ונתחיל בשרירים.']);

// ===== CH 3 =====
add('c3t', 3, titleCard(3), ['פרק שלישי. מה דוחף את הטיל קדימה?']);

add('c3a', 3, `<h1 data-s="0">החוק השלישי של ניוטון</h1><div class="cols"><div>
  <svg viewBox="0 0 860 420" width="860" height="420" data-s="0">
    <defs><marker id="ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <g transform="translate(520,170)">${missileIcon(3.2)}</g>
    <g data-s="0+9"><path d="M330,170 L60,170" stroke="#ff8c42" stroke-width="14" marker-end="url(#ah)"/><text class="lab" x="200" y="120" text-anchor="middle" style="fill:#ff8c42">גזים אחורה</text></g>
    <g data-s="0+12"><path d="M520,300 L800,300" stroke="#2fd6a3" stroke-width="14" marker-end="url(#ah)"/><text class="lab" x="650" y="360" text-anchor="middle" style="fill:#2fd6a3">דחף קדימה</text></g>
  </svg>
  <div class="card" data-s="1" style="margin-top:10px"><p><span class="em">מנוע סילון</span> שואב חמצן מהאוויר.<br><span class="cy">מנוע רקטי</span> נושא דלק <b>וגם</b> מחמצן, ולכן עובד גם בחלל.</p></div></div>
  <div style="flex:none">${vid('srb_static_fire', 780, '0')}<div class="cap" data-s="0">ניסוי קרקעי של מנוע רקטי (NASA)</div></div></div>`,
  [
    'מנוע רקטי עובד לפי החוק השלישי של ניוטון: לכל פעולה יש תגובה שווה והפוכה. המנוע שורף חומר הודף, ופולט גזים חמים אחורה במהירות עצומה. הגזים נדחפים אחורה, והטיל נדחף קדימה. לכוח הזה קוראים דחף.',
    'מנוע סילון של מטוס שואב חמצן מהאוויר. מנוע רקטי נושא איתו גם את הדלק וגם את המחמצן. לכן הוא עובד גם בגובה רב, וגם בחלל, שם אין אוויר בכלל.',
  ], { vids: ['srb_static_fire'] });

add('c3b', 3, `<h1 data-s="0">שני סוגי מנועים</h1><div class="cols">
  <div class="card hlbox" data-s="0+1" data-hl="0"><h2 style="color:var(--orange)">דלק מוצק</h2>${bullets([
    ['0+3', 'דלק ומחמצן מעורבבים בגוש אחד'], ['0+7', 'פשוט, אמין, מוכן מייד'], ['0+12', 'בדרך כלל אי אפשר לכבות'], ['0+10', '<span class="em">נפוץ בטילים</span>']])}</div>
  <div class="card hlbox" data-s="1" data-hl="1"><h2>דלק נוזלי</h2>${bullets([
    ['1+1', 'דלק ומחמצן במכלים נפרדים'], ['1+2', 'אפשר לשלוט בעוצמה ולכבות'], ['1+5', 'מסובך בהרבה'], ['1+7', '<span class="em">נפוץ במשגרי חלל</span>']])}</div></div>`,
  [
    'יש שני סוגים עיקריים. במנוע דלק מוצק, הדלק והמחמצן מעורבבים מראש לגוש אחד. הוא פשוט, אמין ומוכן לשיגור מיידי, ולכן טילים רבים משתמשים בו. החיסרון: ברגע שהצתנו, בדרך כלל אי אפשר לכבות.',
    'במנוע דלק נוזלי אפשר לשלוט בעוצמה, וגם לכבות. אבל הוא מסובך בהרבה. הוא נפוץ במשגרי חלל.',
  ]);

add('c3m1', 3, `<div class="mathbadge" data-s="0">רגע מתמטי 1 · יחסים ואחוזים</div><h1 data-s="0">איזה חלק מהטיל הוא חומר הודף?</h1>${mathRows([
    ['0+9', `מסה בשיגור: ${E('1,000 [ק״ג]')} מתוכם הודף: ${E('600 [ק״ג]')}`],
    ['1', `<span class="cy">אחוז = החלק ÷ השלם × 100</span>`],
    ['1+4', E('600 ÷ 1,000 = 0.6')],
    ['1+8', E('0.6 × 100 = 60%', 'res')],
    ['1+10', `<span class="note">יותר מחצי מהטיל הוא חומר שיישרף.</span>`],
  ])}`,
  [
    'רגע מתמטי ראשון: יחסים ואחוזים. שאלה ראשונה: איזה חלק מהטיל הוא בכלל חומר הודף? ניקח טיל לדוגמה, שהמסה שלו בשיגור היא {1,000|אלף} קילוגרם, ומתוכם {600|שש מאות} קילוגרם הם חומר הודף.',
    'אחוז הוא החלק, חלקי השלם, כפול מאה. {600|שש מאות} חלקי {1,000|אלף}, זה אפס נקודה שש. כפול מאה: שישים אחוז. יותר מחצי מהטיל הוא חומר שיישרף.',
  ]);

add('c3m2', 3, `<div class="mathbadge" data-s="0">רגע מתמטי 1 · יחס דחף למשקל</div><div class="cols"><div style="flex:1.5"><h1 data-s="0">האם המנוע חזק מספיק?</h1>${mathRows([
    ['0+13', `משקל של 1 ק״ג ≈ ${E('10 [ניוטון]')}`],
    ['0+18', `משקל הטיל: ${E('1,000 × 10 = 10,000 [ניוטון]')}`],
    ['1', `דחף המנוע: ${E('50,000 [ניוטון]')}`],
    ['1+3', `יחס דחף למשקל: ${E('50,000 ÷ 10,000 = 5', 'res')}`],
    ['1+11', `<span class="note">יחס קטן מ־1: לא מתרומם. יחס גדול: האצה חזקה.</span>`],
  ])}</div><div style="flex:none;width:330px">
  <svg viewBox="0 0 330 640" width="330" height="640" data-s="0+4"><defs><marker id="ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <g transform="translate(165,330) rotate(-90)">${missileIcon(2.6)}</g>
    <path d="M165,180 L165,40" stroke="#2fd6a3" stroke-width="14" marker-end="url(#ah2)"/><text class="lab" x="165" y="26" text-anchor="middle" style="fill:#2fd6a3;font-size:30px">דחף</text>
    <path d="M165,520 L165,600" stroke="#ff5d8f" stroke-width="14" marker-end="url(#ah2)"/><text class="lab" x="165" y="636" text-anchor="middle" style="fill:#ff5d8f;font-size:30px">משקל</text></svg></div></div>`,
  [
    'שאלה שנייה: האם המנוע חזק מספיק? בשביל זה משווים שני כוחות: הדחף, שדוחף למעלה, והמשקל, שמושך למטה. כוח מודדים ביחידה שנקראת ניוטון. על כדור הארץ, כל קילוגרם שוקל בערך עשרה ניוטון. אז טיל של {1,000|אלף} קילוגרם שוקל בערך {10,000|עשרת אלפים} ניוטון.',
    'נניח שהדחף הוא {50,000|חמישים אלף} ניוטון. יחס דחף למשקל הוא {50,000|חמישים אלף} חלקי {10,000|עשרת אלפים}, כלומר חמש. הדחף גדול פי חמישה מהמשקל. אם היחס קטן מאחת, הטיל לא יתרומם בכלל. וככל שהיחס גדול יותר, ההאצה חזקה יותר.',
  ]);

add('c3c', 3, `<div class="cols"><div style="flex:none">${vid('sls_artemis1_liftoff', 880, '0')}<div class="cap" data-s="0">המראה של משגר חלל (NASA)</div></div>
  <div><h1 data-s="0">להשוואה: משגר חלל</h1>${bullets([
    ['0+3', 'בערך <span class="em">85%</span> מהמסה בשיגור: חומר הודף'],
    ['0+8', 'יחס דחף למשקל: <span class="em">קצת מעל 1</span>'],
    ['0+11', 'לכן הוא מתרומם לאט'],
    ['0+19', 'טיל מיירט: יחס גבוה בהרבה'],
  ])}</div></div>`,
  ['להשוואה: במשגר חלל גדול, בערך {85|שמונים וחמישה} אחוז מהמסה בשיגור היא חומר הודף, ויחס הדחף למשקל הוא רק קצת מעל אחת. לכן הוא מתרומם לאט, ורק אחר כך, כשהדלק נשרף והוא נעשה קל יותר, הוא מאיץ באמת. טיל מיירט בנוי אחרת: הוא צריך להגיע מהר, ולכן יחס הדחף למשקל שלו גבוה בהרבה.'],
  { vids: ['sls_artemis1_liftoff'] });

add('c3p', 3, pauseScene([
    `טיל לדוגמה: מסה בשיגור ${E('200 [ק״ג]')}`, `מתוכם חומר הודף ${E('150 [ק״ג]')} · דחף ${E('8,000 [ניוטון]')}`,
    `<span class="cy">1.</span> מה אחוז ההודף?`, `<span class="cy">2.</span> מה יחס הדחף למשקל?`]),
  [
    'עצרו ופתרו. טיל לדוגמה: מסה בשיגור {200|מאתיים} קילוגרם, מתוכם {150|מאה וחמישים} קילוגרם חומר הודף. הדחף: {8,000|שמונת אלפים} ניוטון. מה אחוז ההודף, ומה יחס הדחף למשקל? יש לכם עשר שניות, ואפשר גם לעצור את הסרטון.',
    { silence: 10 },
  ]);

add('c3s', 3, `<div class="mathbadge" data-s="0">פתרון</div>${mathRows([
    ['0+1', `אחוז ההודף: ${E('150 ÷ 200 = 0.75')} ${E('75%', 'res')}`],
    ['0+9', `משקל: ${E('200 × 10 = 2,000 [ניוטון]')}`],
    ['0+14', `יחס דחף למשקל: ${E('8,000 ÷ 2,000 = 4', 'res')}`],
  ])}`,
  ['פתרון. אחוז ההודף: {150|מאה וחמישים} חלקי {200|מאתיים} שווה אפס נקודה שבעים וחמש, כלומר שבעים וחמישה אחוז. המשקל: {200|מאתיים} קילוגרם כפול עשר, {2,000|אלפיים} ניוטון. יחס הדחף למשקל: {8,000|שמונת אלפים} חלקי {2,000|אלפיים}, שווה ארבע.']);

// ===== CH 4 =====
add('c4t', 4, titleCard(4), ['פרק רביעי. כמה מהר זה מהיר?']);

add('c4m1', 4, `<div class="mathbadge" data-s="0">רגע מתמטי 2 · המרת יחידות</div><h1 data-s="0">מטרים לשנייה ↔ קילומטרים לשעה</h1>${mathRows([
    ['1+3', `${E('1 [ק״מ] = 1,000 [מ׳]')} ${E('1 [שעה] = 3,600 [שניות]')}`],
    ['1+9', `${E('1 [מ׳ לשנייה] = 3,600 [מ׳ לשעה] = 3.6 [קמ״ש]', 'res')}`],
    ['2', `<span class="cy">ממ׳ לשנייה לקמ״ש:</span> ${E('× 3.6')} <span class="cy">מקמ״ש למ׳ לשנייה:</span> ${E('÷ 3.6')}`],
    ['2+10', `מטוס נוסעים: ${E('720 ÷ 3.6 = 200 [מ׳ לשנייה]')}`],
    ['2+19', `טיל: ${E('1,000 × 3.6 = 3,600 [קמ״ש]')}`],
  ])}`,
  [
    'דיברנו על מהירות, אז בואו נעשה סדר ביחידות. ביומיום מודדים מהירות בקילומטרים לשעה. מהנדסים מעדיפים מטרים לשנייה, כי בטיסה של טיל הכול קורה בשניות.',
    'רגע מתמטי שני: המרת יחידות. בקילומטר יש {1,000|אלף} מטרים, ובשעה יש {3,600|שלושת אלפים ושש מאות} שניות. לכן מהירות של מטר אחד לשנייה היא {3,600|שלושת אלפים ושש מאות} מטרים בשעה, כלומר {3.6|שלוש נקודה שש} קילומטרים לשעה.',
    'הכלל פשוט. ממטרים לשנייה לקילומטרים לשעה: כופלים ב{־3.6| שלוש נקודה שש}. בכיוון ההפוך: מחלקים. דוגמה: מטוס נוסעים טס {720|שבע מאות ועשרים} קילומטרים לשעה. {720|שבע מאות ועשרים} חלקי {3.6|שלוש נקודה שש} שווה {200|מאתיים} מטרים לשנייה. וטיל שטס {1,000|אלף} מטרים לשנייה? כפול {3.6|שלוש נקודה שש}: {3,600|שלושת אלפים ושש מאות} קילומטרים לשעה.',
  ]);

add('c4m2', 4, `<div class="mathbadge" data-s="0">רגע מתמטי 2 · מספר מאך</div><h1 data-s="0">מאך = המהירות שלך ÷ מהירות הקול</h1>${mathRows([
    ['0+9', `מהירות הקול בגובה פני הים ≈ ${E('340 [מ׳ לשנייה]')}`],
    ['0+15', `${E('[מאך] 1 = 340')} ${E('[מאך] 2 = 680')}`],
    ['1', `טיל ב־1,000 מ׳ לשנייה: ${E('1,000 ÷ 340 ≈ 3', 'res')} <span class="note">(בערך מאך 3)</span>`],
    ['1+6', `<span class="note">מהירות הקול תלויה בטמפרטורה. בגובה רב קר יותר, והיא נמוכה יותר. מאך הוא <b>יחס</b>, לא מהירות קבועה.</span>`],
    ['2', `<span class="tag" style="color:var(--green)">תת־קולי: מתחת ל־1</span> <span class="tag" style="color:var(--amber)">על־קולי: מעל 1</span> <span class="tag" style="color:var(--pink)">היפר־קולי: מעל 5 בערך</span>`],
  ])}`,
  [
    'יש עוד יחידה שתשמעו הרבה: {מאך|מַאךְ}. מספר {מאך|מַאךְ} הוא היחס בין המהירות שלך לבין מהירות הקול. מהירות הקול באוויר, בגובה פני הים, היא בערך {340|שלוש מאות וארבעים} מטרים לשנייה. {מאך|מַאךְ} אחת, זו בדיוק מהירות הקול. {מאך|מַאךְ} שתיים, פי שניים.',
    'אז {1,000|אלף} מטרים לשנייה, כמה {מאך|מַאךְ} זה? {1,000|אלף} חלקי {340|שלוש מאות וארבעים}: בערך שלוש. הערה חשובה: מהירות הקול תלויה בטמפרטורה. בגובה רב קר יותר, ולכן היא נמוכה יותר. {מאך|מַאךְ} הוא יחס, לא מהירות קבועה.',
    'ועוד שלוש מילים שכדאי להכיר. מתחת ל{מאך|מַאךְ} אחת, הטיסה נקראת תת־קולית. מעל {מאך|מַאךְ} אחת, על־קולית. ומעל {מאך|מַאךְ} חמש בערך, היפר־קולית.',
  ]);

add('c4p', 4, pauseScene([
    `טיל טס ${E('680 [מ׳ לשנייה]')} בגובה פני הים.`, `<span class="cy">1.</span> כמה זה במאך?`, `<span class="cy">2.</span> כמה זה בקמ״ש?`]),
  [
    'עצרו ופתרו. טיל טס במהירות {680|שש מאות ושמונים} מטרים לשנייה, בגובה פני הים. כמה זה ב{מאך|מַאךְ}, וכמה זה בקילומטרים לשעה?',
    { silence: 10 },
  ]);

add('c4s', 4, `<div class="mathbadge" data-s="0">פתרון</div>${mathRows([
    ['0+1', `${E('680 ÷ 340 = 2')} ${E('[מאך] 2', 'res')}`],
    ['0+7', `${E('680 × 3.6 = ?')} <span class="note">מפרקים: 3.6 = 3 + 0.6</span>`],
    ['0+11', `${E('680 × 3 = 2,040')} ${E('680 × 0.6 = 408')}`],
    ['0+18', `${E('2,040 + 408 = 2,448 [קמ״ש]', 'res')}`],
  ])}`,
  ['פתרון. {680|שש מאות ושמונים} חלקי {340|שלוש מאות וארבעים} שווה שתיים, כלומר {מאך|מַאךְ} שתיים. ובקילומטרים לשעה: {680|שש מאות ושמונים} כפול {3.6|שלוש נקודה שש}. טיפ: מפרקים. {680|שש מאות ושמונים} כפול שלוש זה {2,040|אלפיים וארבעים}, ו{־680| שש מאות ושמונים} כפול אפס נקודה שש זה {408|ארבע מאות ושמונה}. ביחד: {2,448|אלפיים ארבע מאות ארבעים ושמונה} קילומטרים לשעה.']);

// ===== CH 5 =====
add('c5t', 5, titleCard(5), ['פרק חמישי. איך הטיל יודע איפה הוא, ואיפה המטרה?']);

add('c5a', 5, `<div class="center"><div class="cols" style="height:auto;width:100%">
  <div class="card" data-s="0+4"><div class="big" style="font-size:84px;color:var(--violet)">איפה אני?</div><p class="sub2">חיישנים אינרציאליים · לוויינים</p></div>
  <div class="card" data-s="0+5.5"><div class="big" style="font-size:84px;color:var(--cyan)">איפה המטרה?</div><p class="sub2">מכ״ם · קישור נתונים · ראש ביות</p></div></div></div>`,
  ['כדי להגיע למטרה, הטיל צריך תשובה לשתי שאלות נפרדות: איפה אני, ואיפה המטרה. לכל שאלה יש חיישנים משלה.']);

add('c5b', 5, `<h1 data-s="0">איפה אני? ניווט אינרציאלי</h1><div class="cols"><div>${bullets([
    ['0+5', '<span class="em">מדי תאוצה</span><small>מרגישים כל שינוי במהירות</small>'],
    ['0+9', '<span class="em">ג׳ירוסקופים</span><small>מרגישים כל סיבוב</small>'],
    ['1', 'נקודת התחלה ידועה + כל התנועות מאז = <span class="cy">המיקום עכשיו</span>'],
    ['1+12', '<span style="color:var(--green)">יתרון:</span> לא תלוי באות חיצוני'],
    ['2', '<span style="color:var(--pink)">חיסרון:</span> השגיאות מצטברות (סחיפה)'],
  ])}</div><div style="flex:none;width:760px">
  <svg viewBox="0 0 760 620" width="760" height="620">
    <g data-s="0+5"><rect x="250" y="20" width="260" height="200" rx="20" fill="#2e2452" stroke="#b99bff" stroke-width="4"/>
      <path d="M380,120 L380,50 M380,120 L460,120 M380,120 L330,170" stroke="#ffb703" stroke-width="8" stroke-linecap="round"/><circle cx="380" cy="120" r="12" fill="#ffb703"/></g>
    <g data-s="0+9"><ellipse cx="380" cy="120" rx="100" ry="34" fill="none" stroke="#4cc9f0" stroke-width="5"/><ellipse cx="380" cy="120" rx="34" ry="90" fill="none" stroke="#4cc9f0" stroke-width="5"/></g>
    <g data-s="2"><text class="small" x="380" y="290" text-anchor="middle">מסלול אמיתי מול מסלול מחושב</text>
      <path id="truep" d="M40,560 Q380,380 720,400" fill="none" stroke="#2fd6a3" stroke-width="6"/>
      <path data-draw="2+1" data-dur="5" d="M40,560 Q380,400 720,520" fill="none" stroke="#ff5d8f" stroke-width="6" stroke-dasharray="14 10"/>
      <text class="small" x="700" y="380" text-anchor="end" style="fill:#2fd6a3">אמיתי</text><text class="small" x="700" y="566" text-anchor="end" style="fill:#ff5d8f">מחושב</text></g>
    <g data-s="2+6"><path d="M720,408 L720,512" stroke="#ffb703" stroke-width="5"/><text class="lab" x="640" y="470" text-anchor="middle" style="fill:#ffb703;font-size:30px">שגיאה</text></g>
  </svg></div></div>`,
  [
    'נתחיל ב"איפה אני". בתוך הטיל יש יחידת מדידה אינרציאלית. יש בה מדי תאוצה, שמרגישים כל שינוי במהירות, וג׳ירוסקופים, שמרגישים כל סיבוב. חיישנים מאותו סוג, בגרסה פשוטה וזולה, יש גם בטלפון שלכם: כך הוא יודע שסובבתם אותו.',
    'המחשב יודע מאיפה הטיל יצא. הוא מחבר את כל התאוצות והסיבובים שנמדדו מאז, ומחשב מהם איפה הטיל עכשיו, ולאן הוא פונה. לזה קוראים ניווט אינרציאלי. היתרון הגדול: הוא לא תלוי בשום אות מבחוץ, ולכן אי אפשר לשבש אותו.',
    'החיסרון: שגיאות מצטברות. כל מדידה קצת לא מדויקת, והטעויות הקטנות נערמות עם הזמן. זה כמו ללכת בעיניים עצומות ולספור צעדים. אחרי עשרה צעדים אתם יודעים איפה אתם. אחרי אלף, כבר לא.',
  ]);

add('c5c', 5, `<h1 data-s="0">התיקון: ניווט לווייני</h1><div class="cols"><div style="flex:none">${vid('gps_constellation_orbits', 800, '0')}<div class="cap" data-s="0">לווייני ניווט סביב כדור הארץ</div></div><div>${bullets([
    ['0+4', 'כל לוויין משדר אות עם <span class="em">חותמת זמן</span>'],
    ['0+9', 'זמן ההגעה של האות ← <span class="em">מרחק</span> ללוויין'],
    ['0+15', '<span class="em">4 לוויינים</span> לפחות ← מיקום'],
  ])}<div class="card" data-s="1" style="margin-top:16px"><p style="font-size:37px"><span class="cy">אינרציאלי:</span> רציף, אבל נסחף<br><span class="cy">לווייני:</span> מדויק לאורך זמן, אבל אפשר לשבש<br><span class="em">ביחד: משלימים זה את זה</span></p></div></div></div>`,
  [
    'הפתרון: ניווט לווייני, כמו {GPS|גִ׳י פִּי אֶס}. כל לוויין משדר אות עם חותמת זמן מדויקת. המקלט מודד כמה זמן לקח לאות להגיע, ומזה מחשב את המרחק ללוויין. עם ארבעה לוויינים לפחות, אפשר לחשב מיקום.',
    'שני החיישנים משלימים זה את זה. האינרציאלי רציף ומהיר, אבל נסחף. הלווייני מדויק לאורך זמן, אבל אפשר לשבש אותו. לכן משלבים: הלוויין מתקן את הסחיפה, והאינרציאלי ממלא את הרווחים.',
  ], { vids: ['gps_constellation_orbits'] });

add('c5d', 5, `<h1 data-s="0">איפה המטרה? מכ״ם</h1><div class="cols"><div style="flex:none">${vid('air_defense_radar_setup', 760, '0')}<div class="cap" data-s="0">הצבת מכ״ם של הגנה אווירית</div></div><div>
  <svg viewBox="0 0 900 360" width="900" height="360">
    <g data-s="0+4"><path d="M60,300 L120,300 L90,240 Z" fill="#4cc9f0"/><path d="M60,220 Q110,240 100,290" fill="none" stroke="#4cc9f0" stroke-width="8"/>
    <g transform="translate(780,90) rotate(180)">${missileIcon(1.3, '#ff5d8f')}</g><text class="small" x="780" y="50" text-anchor="middle">מטרה</text></g>
    <path data-draw="0+6" data-dur="2.5" d="M130,230 L700,105" stroke="#ffb703" stroke-width="6" fill="none"/>
    <g data-s="0+6"><text class="small" x="380" y="140" text-anchor="middle" style="fill:#ffb703">שידור</text></g>
    <path data-draw="0+9" data-dur="2.5" d="M700,130 L140,260" stroke="#2fd6a3" stroke-width="6" fill="none"/>
    <g data-s="0+9"><text class="small" x="460" y="240" text-anchor="middle" style="fill:#2fd6a3">הד חוזר</text></g>
  </svg>
  <div class="card" data-s="0+12"><p>זמן עד שההד חוזר ← <span class="em">מרחק</span></p></div></div></div>`,
  [
    'ועכשיו, "איפה המטרה". הכלי העיקרי הוא {מכ״ם|מַכָּם}. {מכ״ם|מַכָּם} משדר גלי רדיו, ומקשיב להד שחוזר מהמטרה. גלי רדיו נעים במהירות האור, ולכן מהזמן שעבר עד שההד חזר אפשר לחשב את המרחק.',
  ], { vids: ['air_defense_radar_setup'] });

add('c5d2', 5, `<h1 data-s="0">דוגמה: מרחק לפי זמן ההד</h1>${mathRows([
    ['0+2', `מהירות האור: ${E('300,000 [ק״מ בשנייה]')}`],
    ['0+6', `ההד חזר אחרי אלפית שנייה: ${E('300,000 ÷ 1,000 = 300 [ק״מ]')}`],
    ['0+13', `הלוך ושוב, אז חצי: ${E('300 ÷ 2 = 150 [ק״מ]', 'res')}`],
  ])}`,
  ['דוגמה קצרה. האור עובר {300,000|שלוש מאות אלף} קילומטרים בשנייה. נניח שההד חזר אחרי אלפית שנייה. באלפית שנייה האור עובר {300|שלוש מאות} קילומטרים. אבל זו הדרך הלוך ושוב, ולכן המטרה נמצאת בחצי מזה: {150|מאה וחמישים} קילומטרים.']);

add('c5d3', 5, `<h1 data-s="0">מהמכ״ם אל הטיל: קישור הנתונים</h1>
  <svg viewBox="0 0 1760 520" width="1760" height="520"><defs><marker id="ah7" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <path d="M60,470 L1700,470" stroke="#2a3b57" stroke-width="4"/>
    <g data-s="0"><path d="M240,470 L340,470 L290,380 Z" fill="#4cc9f0"/><path d="M230,340 Q320,380 300,460" fill="none" stroke="#4cc9f0" stroke-width="10"/><text class="lab" x="290" y="512" text-anchor="middle" style="fill:#4cc9f0">מכ״ם קרקעי</text>
      <g transform="translate(1540,90) rotate(180)">${missileIcon(1.8, '#ff5d8f')}</g><text class="lab" x="1540" y="50" text-anchor="middle" style="fill:#ff5d8f">מטרה</text></g>
    <g data-s="0+3"><path d="M330,350 L1440,110" stroke="#ffb703" stroke-width="5" stroke-dasharray="14 10" marker-end="url(#ah7)" marker-start="url(#ah7)"/><text class="lab" x="1000" y="150" text-anchor="middle" style="fill:#ffb703">מגלה ועוקב</text></g>
    <g data-s="0+6"><g transform="translate(900,330) rotate(-22)">${missileIcon(1.8)}</g><text class="lab" x="900" y="410" text-anchor="middle">טיל</text>
      <path d="M340,400 L800,345" stroke="#2fd6a3" stroke-width="6" marker-end="url(#ah7)"/><text class="lab" x="560" y="440" text-anchor="middle" style="fill:#2fd6a3">עדכונים בקישור הנתונים</text></g>
  </svg>`,
  ['{מכ״ם|מַכָּם} גדול, על הקרקע או על ספינה, מגלה את המטרה ועוקב אחריה. הוא שולח לטיל עדכונים דרך קישור הנתונים: המטרה זזה, תתקן לשם. כך הטיל יכול לטוס את רוב הדרך בלי לראות את המטרה בעצמו.']);

add('c5e', 5, `<h1 data-s="0">ראש הביות: העיניים של הקטע האחרון</h1><div class="cols">
  <div class="card hlbox" data-s="0+4" data-hl="0"><h2>מכ״מי פעיל</h2><p>מכ״ם קטן שלם:<br><span class="em">משדר וקולט</span> בעצמו</p></div>
  <div class="card hlbox" data-s="0+11" data-hl="0"><h2>מכ״מי חצי־פעיל</h2><p><span class="em">רק קולט.</span><br>מכ״ם אחר "מאיר" את המטרה</p></div>
  <div class="card hlbox" data-s="1" data-hl="1"><h2 style="color:var(--orange)">אינפרה־אדום</h2><p>מצלמת חום.<br><span class="em">לא משדר כלום</span></p>${pic('thermal', 470, 264, '1', 'margin-top:16px')}</div></div>`,
  [
    'בקטע האחרון נכנס לפעולה ראש הביות שבחרטום. ראש ביות {מכ״מי|מַכָּמִי} פעיל הוא {מכ״ם|מַכָּם} קטן שלם, שמשדר וקולט בעצמו. ראש ביות חצי־פעיל רק קולט: {מכ״ם|מַכָּם} אחר, על הקרקע או במטוס, מאיר את המטרה, והטיל מתביית על ההחזר.',
    'ראש ביות אינפרה־אדום לא משדר כלום. זו מצלמת חום, שרואה את החום שהמטרה פולטת, למשל מהמנוע שלה. ומכיוון שהוא לא משדר, קשה מאוד לגלות אותו.',
  ]);

add('c5f', 5, `<h1 data-s="0">סיכום: מאיפה מגיע המידע</h1><div class="cols">
  <div class="card" data-s="0+1"><h2 style="color:var(--violet)">איפה אני?</h2>${bullets([['0+1', 'חיישנים אינרציאליים'], ['0+3', 'ניווט לווייני']])}</div>
  <div class="card" data-s="0+5"><h2>איפה המטרה?</h2>${bullets([['0+5', 'מכ״ם קרקעי'], ['0+6.5', 'קישור נתונים'], ['0+8', 'ראש ביות']])}</div></div>`,
  ['נסכם. חיישנים אינרציאליים ולוויינים אומרים לטיל איפה הוא. {מכ״ם|מַכָּם} קרקעי, קישור נתונים וראש ביות, אומרים לו איפה המטרה. עכשיו צריך מישהו שיחבר את הכול.']);

// ===== CH 6 =====
add('c6t', 6, titleCard(6), ['פרק שישי. מה המחשב עושה עם כל המידע?']);

const loopBox = (x, y, col, t1, t2, s) => `<g data-s="${s}" data-hl="${s},4"><rect x="${x - 190}" y="${y - 80}" width="380" height="160" rx="26" fill="#142033" stroke="${col}" stroke-width="6"/>
  <text x="${x}" y="${y - 4}" text-anchor="middle" style="font-size:56px;font-weight:800;fill:${col}">${t1}</text><text class="small" x="${x}" y="${y + 44}" text-anchor="middle" style="font-size:30px">${t2}</text></g>`;
add('c6a', 6, `<h1 data-s="0">הלולאה: לחוש ← לחשב ← לפעול</h1><div style="display:flex;justify-content:center">
  <svg viewBox="0 0 1500 660" width="1500" height="660"><defs><marker id="ah3" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
  ${loopBox(1220, 150, '#4cc9f0', 'לחוש', 'קוראים את החיישנים', 1)}
  ${loopBox(750, 150, '#b99bff', 'לחשב', 'משווים מסלול רצוי למצוי', 2)}
  ${loopBox(280, 150, '#ff5d8f', 'לפעול', 'מזיזים סנפירים', 3)}
  <g data-s="2"><path d="M1020,150 L950,150" stroke="#eef3fa" stroke-width="8" marker-end="url(#ah3)"/></g>
  <g data-s="3"><path d="M550,150 L480,150" stroke="#eef3fa" stroke-width="8" marker-end="url(#ah3)"/></g>
  <g data-s="4"><path id="fb" d="M280,240 Q280,470 750,470 Q1220,470 1220,246" fill="none" stroke="#ffb703" stroke-width="8" marker-end="url(#ah3)"/>
    <rect x="490" y="410" width="520" height="120" rx="60" fill="#0c1422" stroke="#ffb703" stroke-width="5"/>
    <text x="750" y="466" text-anchor="middle" style="font-size:40px;font-weight:700;fill:#ffb703">הטיל משנה כיוון</text><text class="small" x="750" y="508" text-anchor="middle">והחיישנים מודדים מצב חדש</text>
    <text x="750" y="620" text-anchor="middle" style="font-size:44px;font-weight:800">פעמים רבות בכל שנייה</text></g>
  <g data-s="4"><g data-move="fb" data-at="4+0.5" data-dur="3" data-rot="0"><circle r="16" fill="#fff"/></g></g>
  </svg></div>`,
  [
    'מחשב הטיסה מריץ לולאה אחת, שוב ושוב, מהשיגור ועד הסוף. יש בה שלושה שלבים.',
    'שלב ראשון: לחוש. המחשב קורא את כל החיישנים: איפה אני, לאן אני פונה, ואיפה המטרה.',
    'שלב שני: לחשב. הוא משווה בין המסלול שבו הטיל טס עכשיו, לבין המסלול שיביא אותו למטרה, ומחליט כמה לפנות, ולאיזה כיוון.',
    'שלב שלישי: לפעול. המחשב שולח פקודה למנועים החשמליים, והם מזיזים את הסנפירים. זרימת האוויר על הסנפירים מסובבת את הטיל, והוא משנה כיוון.',
    'ואז הכול מתחיל מחדש. הטיל זז, החיישנים מודדים מצב חדש, והמחשב מתקן שוב. זו לולאת משוב, והיא רצה פעמים רבות בכל שנייה. אתם מכירים את זה מרכיבה על אופניים: אף אחד לא מחשב מראש את כל הדרך. מרגישים נטייה קטנה, מתקנים, ושוב מרגישים. אותו עיקרון בדיוק מייצב רחפן, ושומר על רובוט בשיווי משקל.',
  ]);

add('c6b', 6, `<h1 data-s="0">ואם אין אוויר?</h1><div class="cols"><div>${bullets([
    ['0+1', '<span class="em">סנפירים</span><small>עובדים רק כשיש זרימת אוויר</small>'],
    ['0+6', '<span class="em">הטיית סילון המנוע</span><small>מכוונים את הדחף עצמו</small>'],
    ['0+12', '<span class="em">מנועי הכוונה קטנים</span><small>דחיפות קצרות לצדדים, גם בחלל</small>'],
  ])}</div><div style="flex:none;width:700px"><svg viewBox="0 0 700 520" width="700" height="520"><defs><marker id="ah4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <g data-s="0+6"><g transform="translate(400,150)">${missileIcon(3.4)}</g><path d="M180,150 L40,215" stroke="#ff8c42" stroke-width="14" marker-end="url(#ah4)"/><text class="small" x="150" y="260" text-anchor="middle">סילון מוטה</text></g>
    <g data-s="0+12"><g transform="translate(400,400)">${missileIcon(3.4)}</g><path d="M460,362 L460,290" stroke="#4cc9f0" stroke-width="12" marker-end="url(#ah4)"/><text class="small" x="590" y="318" text-anchor="middle">מנוע הכוונה</text></g>
  </svg></div></div>`,
  ['סנפירים עובדים רק כשיש אוויר שזורם עליהם. לכן יש טילים שבמקום סנפירים, או בנוסף להם, מטים את סילון המנוע עצמו. ומחוץ לאטמוספרה, שם אין אוויר, משתמשים בהטיית הסילון או במנועי הכוונה קטנים, שנותנים דחיפות קצרות לצדדים.']);

add('c6c', 6, `<h1 data-s="0">לאן מכוונים? אל נקודת המפגש</h1>
  <svg viewBox="0 0 1760 640" width="1760" height="640"><defs><marker id="ah5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <path id="tgtp" d="M1600,120 L700,120" fill="none" stroke="#ff5d8f" stroke-width="4" stroke-dasharray="6 12"/>
    <path id="mslp" d="M300,580 L700,120" fill="none" stroke="none"/>
    <g data-s="0"><text class="small" x="1600" y="80" text-anchor="middle" style="fill:#ff5d8f">מטרה</text><text class="small" x="300" y="630" text-anchor="middle">טיל</text></g>
    <g data-s="0+7" data-x="1"><path d="M300,580 Q900,560 1250,120" fill="none" stroke="#9fb0c8" stroke-width="5" stroke-dasharray="14 10"/>
      <text class="lab" x="1150" y="430" text-anchor="middle" style="fill:#9fb0c8">רודף אחרי המטרה: מגיע מאוחר</text></g>
    <g data-s="1"><path d="M300,580 L700,120" fill="none" stroke="#2fd6a3" stroke-width="6"/><circle cx="700" cy="120" r="20" fill="none" stroke="#ffb703" stroke-width="6"/>
      <text class="lab" x="700" y="70" text-anchor="middle" style="fill:#ffb703">נקודת המפגש</text></g>
    <g data-s="2"><path d="M300,580 L1600,120 M400,465 L1375,120 M500,350 L1150,120 M600,235 L925,120" stroke="#4cc9f0" stroke-width="3" fill="none"/>
      <text class="lab" x="1330" y="330" text-anchor="middle" style="fill:#4cc9f0">קווי הראייה נשארים באותו כיוון</text>
      <text class="lab" x="1330" y="384" text-anchor="middle" style="fill:#4cc9f0">= מסלול התנגשות</text></g>
    <g data-move="tgtp" data-at="1+1" data-dur="9"><g transform="rotate(0)">${missileIcon(1.5, '#ff5d8f')}</g></g>
    <g data-move="mslp" data-at="1+1" data-dur="9">${missileIcon(1.5)}</g>
  </svg>`,
  [
    'ומה בדיוק מחשבים? טעות נפוצה היא לחשוב שהטיל מכוון ישר אל המטרה. אבל המטרה זזה. מי שרודף אחרי המקום שבו המטרה נמצאת עכשיו, יגיע מאוחר.',
    'במקום זה, הטיל מכוון אל נקודת המפגש: המקום שבו המטרה תהיה כשהוא יגיע. כמו שחקן שמוסר כדור לחבר שרץ: מוסרים למקום שבו הוא יהיה, לא למקום שבו הוא עכשיו.',
    'יש לזה כלל פשוט, שימאים מכירים כבר מאות שנים. אם אתם רואים ספינה אחרת כל הזמן באותו כיוון בדיוק, והמרחק ביניכם קטן, אתם במסלול התנגשות. הטיל עושה את זה בכוונה: הוא מתקן את הכיוון שלו, כך שהכיוון אל המטרה לא ישתנה. לשיטה הזאת קוראים ניווט יחסי.',
  ]);

add('c6m1', 6, `<div class="mathbadge" data-s="0">רגע מתמטי 3 · מהירות, זמן ומרחק</div><h1 data-s="0">זמן = מרחק ÷ מהירות</h1>${mathRows([
    ['0+8', `טיל: ${E('1,000 [מ׳ לשנייה]')} מטרה נייחת במרחק ${E('30 [ק״מ]')}`],
    ['0+16', `אותן יחידות: ${E('30 [ק״מ] = 30,000 [מ׳]')}`],
    ['0+21', `${E('30,000 ÷ 1,000 = 30 [שניות]', 'res')}`],
  ])}`,
  ['רגע מתמטי שלישי: מהירות, זמן ומרחק. הנוסחה שכדאי לזכור: זמן שווה מרחק חלקי מהירות. טיל טס {1,000|אלף} מטרים לשנייה, אל מטרה שעומדת במקום, במרחק {30|שלושים} קילומטרים. קודם ממירים לאותן יחידות: {30|שלושים} קילומטרים הם {30,000|שלושים אלף} מטרים. {30,000|שלושים אלף} חלקי {1,000|אלף}: {30|שלושים} שניות.']);

add('c6m2', 6, `<div class="mathbadge" data-s="0">רגע מתמטי 3 · מהירות סגירה</div>
  <svg viewBox="0 0 1760 190" width="1760" height="190" data-s="0"><defs><marker id="ah6" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>
    <g transform="translate(200,70)">${missileIcon(1.8)}</g><path d="M320,70 L560,70" stroke="#2fd6a3" stroke-width="8" marker-end="url(#ah6)"/><text class="small" x="440" y="46" text-anchor="middle" direction="ltr">1,000</text>
    <g transform="translate(1560,70) rotate(180)">${missileIcon(1.8, '#ff5d8f')}</g><path d="M1440,70 L1320,70" stroke="#ff5d8f" stroke-width="8" marker-end="url(#ah6)"/><text class="small" x="1380" y="46" text-anchor="middle" direction="ltr">500</text>
    <path d="M200,140 L1560,140" stroke="#9fb0c8" stroke-width="3" marker-end="url(#ah6)" marker-start="url(#ah6)"/><text class="small" x="880" y="178" text-anchor="middle">30 ק״מ</text></svg>
  ${mathRows([
    ['0+7', `טסים זה מול זה ← <span class="cy">מחברים מהירויות</span>: ${E('1,000 + 500 = 1,500 [מ׳ לשנייה]')}`],
    ['1', `זמן עד המפגש: ${E('30,000 ÷ 1,500 = 20 [שניות]', 'res')}`],
    ['1+6', `מטרה בורחת ← <span class="cy">מחסרים</span>: ${E('1,000 − 500 = 500')} ${E('30,000 ÷ 500 = 60 [שניות]')}`],
  ])}`,
  [
    'עכשיו המטרה טסה לקראת הטיל, במהירות {500|חמש מאות} מטרים לשנייה. בכל שנייה הטיל מתקרב ב{־1,000| אלף} מטרים, והמטרה מתקרבת בעוד {500|חמש מאות}. המרחק ביניהם קטֵן ב{־1,500| אלף וחמש מאות} מטרים בכל שנייה. זו מהירות הסגירה. כשטסים זה מול זה, מחברים את המהירויות.',
    'הזמן עד המפגש: {30,000|שלושים אלף} חלקי {1,500|אלף וחמש מאות}, שווה {20|עשרים} שניות. ואם המטרה בורחת מהטיל? אז מחסרים. מהירות הסגירה היא רק {500|חמש מאות} מטרים לשנייה, והמרדף ייקח {60|שישים} שניות, דקה שלמה.',
  ]);

add('c6m3', 6, `<div class="mathbadge" data-s="0">רגע מתמטי 3 · למה הלולאה חייבת להיות מהירה</div><h1 data-s="0">כמה הטיל עובר בין עדכון לעדכון?</h1>${mathRows([
    ['0+4', `קצב הלולאה: ${E('100 [עדכונים בשנייה]')} מהירות: ${E('1,000 [מ׳ לשנייה]')}`],
    ['0+12', `${E('1,000 ÷ 100 = 10 [מ׳]', 'res')} <span class="note">בין עדכון לעדכון</span>`],
    ['0+16', `מחשב איטי פי 10: ${E('1,000 ÷ 10 = 100 [מ׳]')} <span class="note">"בעיניים עצומות"</span>`],
  ])}`,
  ['ועוד חישוב קטן, שמסביר למה הלולאה חייבת להיות מהירה. נניח שהמחשב מעדכן מאה פעמים בשנייה, והטיל טס {1,000|אלף} מטרים לשנייה. בין עדכון לעדכון הטיל עובר {1,000|אלף} חלקי מאה: עשרה מטרים. מחשב איטי פי עשרה היה טס מאה מטרים בעיניים עצומות, בין תיקון לתיקון.']);

add('c6p', 6, pauseScene([
    `טיל: ${E('600 [מ׳ לשנייה]')} · מטרה מולו: ${E('400 [מ׳ לשנייה]')}`, `המרחק ביניהם: ${E('20 [ק״מ]')}`,
    `<span class="cy">1.</span> מה מהירות הסגירה?`, `<span class="cy">2.</span> כמה זמן עד המפגש?`]),
  [
    'עצרו ופתרו. טיל טס {600|שש מאות} מטרים לשנייה. המטרה טסה מולו, {400|ארבע מאות} מטרים לשנייה. המרחק ביניהם {20|עשרים} קילומטרים. מה מהירות הסגירה, וכמה זמן עד המפגש?',
    { silence: 10 },
  ]);

add('c6s', 6, `<div class="mathbadge" data-s="0">פתרון</div>${mathRows([
    ['0+1', `מהירות סגירה: ${E('600 + 400 = 1,000 [מ׳ לשנייה]', 'res')}`],
    ['0+9', `${E('20 [ק״מ] = 20,000 [מ׳]')}`],
    ['0+13', `זמן: ${E('20,000 ÷ 1,000 = 20 [שניות]', 'res')}`],
  ])}`,
  ['פתרון. טסים זה מול זה, אז מחברים: {600|שש מאות} ועוד {400|ארבע מאות}, מהירות סגירה של {1,000|אלף} מטרים לשנייה. {20|עשרים} קילומטרים הם {20,000|עשרים אלף} מטרים. {20,000|עשרים אלף} חלקי {1,000|אלף}: {20|עשרים} שניות.']);

// ===== CH 7 =====
add('c7t', 7, titleCard(7), ['פרק שביעי. מה קורה מהשיגור ועד המפגש?']);

add('c7v', 7, `<div class="center">${vid('patriot_launch', 1280, '0')}</div>`,
  ['עכשיו נחבר את הכול לטיסה אחת. טיסה של טיל מתחלקת לשלושה שלבים.'], { vids: ['patriot_launch'] });

add('c7a', 7, `<h1 data-s="0">שלושה שלבי טיסה</h1>
  <svg viewBox="0 0 1760 650" width="1760" height="650">
    <path id="traj" d="M140,560 C220,300 420,170 760,150 C1050,135 1350,150 1620,250" fill="none" stroke="none"/>
    <path d="M60,590 L1700,590" stroke="#2a3b57" stroke-width="4"/>
    <rect x="100" y="560" width="80" height="30" fill="#9fb0c8"/><text class="small" x="140" y="630" text-anchor="middle">משגר</text>
    <g data-hl="0,3"><path data-draw="0+0.5" data-dur="2" d="M140,560 C190,400 280,290 400,225" fill="none" stroke="#ff8c42" stroke-width="12" stroke-linecap="round"/>
      <g data-s="0"><text class="lab" x="140" y="330" text-anchor="middle" style="fill:#ff8c42;font-size:44px">1. האצה</text><text class="small" x="140" y="372" text-anchor="middle">המנוע בוער</text></g></g>
    <g data-hl="1,3"><path data-draw="1+0.5" data-dur="3" d="M400,225 C520,165 640,155 760,150 C960,140 1170,140 1380,180" fill="none" stroke="#4cc9f0" stroke-width="12" stroke-linecap="round"/>
      <g data-s="1"><text class="lab" x="860" y="80" text-anchor="middle" style="fill:#4cc9f0;font-size:44px">2. שיוט (אמצע המסלול)</text><text class="small" x="860" y="250" text-anchor="middle">ניווט אינרציאלי + עדכונים בקישור הנתונים</text></g></g>
    <g data-hl="2,3"><path data-draw="2+0.5" data-dur="2" d="M1380,180 C1470,198 1550,222 1620,250" fill="none" stroke="#ff5d8f" stroke-width="12" stroke-linecap="round"/>
      <g data-s="2"><text class="lab" x="1500" y="330" text-anchor="middle" style="fill:#ff5d8f;font-size:44px">3. ביות סופי</text><text class="small" x="1500" y="372" text-anchor="middle">ראש הביות נועל על המטרה</text>
      <circle cx="1640" cy="258" r="22" fill="none" stroke="#ffb703" stroke-width="6"/></g></g>
    <g data-s="3"><g data-move="traj" data-at="3+0.5" data-dur="8">${missileIcon(1.4)}</g></g>
  </svg>`,
  [
    'שלב ראשון: האצה. המנוע בוער, והטיל צובר מהירות. זה בדרך כלל שלב קצר. הטיל מתרחק מהמשגר, מתייצב, ופונה לכיוון הכללי של המטרה.',
    'שלב שני: שיוט, או אמצע המסלול. זה החלק הארוך של הטיסה. בטילים רבים המנוע כבר כבה, והטיל ממשיך מכוח המהירות שצבר. הוא מנווט בעזרת החיישנים האינרציאליים, ומקבל עדכונים על המטרה דרך קישור הנתונים.',
    'שלב שלישי: ביות סופי. קרוב למטרה, ראש הביות נועל עליה. מכאן הטיל רואה את המטרה בעצמו, והלולאה עובדת בשיא הדיוק.',
    'התיקונים החדים ביותר קורים בשניות האחרונות, ושם נדרש כל מה שלמדנו: חיישנים, מחשב מהיר וסנפירים.',
  ]);

// graph helpers: x: 0..30 s -> 200..1500 ; y: 0..1200 -> 560..80
const gx = (t) => 200 + t * (1300 / 30), gy = (v) => 560 - v * (480 / 1200);
const graph = (extra) => `<svg viewBox="0 0 1760 660" width="1760" height="660">
  <g data-s="0">
  <rect data-hl="1,2" x="${gx(0)}" y="80" width="${gx(5) - gx(0)}" height="480" fill="#ff8c42" style="opacity:calc(.05 + .2*var(--hl,0))"/>
  <rect data-hl="3" x="${gx(5)}" y="80" width="${gx(25) - gx(5)}" height="480" fill="#4cc9f0" style="opacity:calc(.05 + .2*var(--hl,0))"/>
  <rect data-hl="4" x="${gx(25)}" y="80" width="${gx(30) - gx(25)}" height="480" fill="#ff5d8f" style="opacity:calc(.05 + .2*var(--hl,0))"/>
  ${[0, 200, 400, 600, 800, 1000, 1200].map(v => `<path d="M200,${gy(v)} L1500,${gy(v)}" stroke="#2a3b57" stroke-width="2"/><text class="small" x="180" y="${gy(v) + 9}" text-anchor="end" direction="ltr">${v.toLocaleString('en')}</text>`).join('')}
  ${[0, 5, 10, 15, 20, 25, 30].map(t => `<path d="M${gx(t)},80 L${gx(t)},560" stroke="#2a3b57" stroke-width="2"/><text class="small" x="${gx(t)}" y="596" text-anchor="middle">${t}</text>`).join('')}
  <path d="M200,80 L200,560 L1500,560" fill="none" stroke="#eef3fa" stroke-width="4"/>
  <text class="lab" x="850" y="645" text-anchor="middle">זמן (שניות)</text>
  <text class="lab" x="60" y="320" text-anchor="middle" transform="rotate(-90 60 320)">מהירות (מ׳ לשנייה)</text>
  <text class="small" x="${gx(2.5)}" y="62" text-anchor="middle" style="fill:#ff8c42">האצה</text><text class="small" x="${gx(15)}" y="62" text-anchor="middle" style="fill:#4cc9f0">שיוט</text><text class="small" x="${gx(27.5)}" y="62" text-anchor="middle" style="fill:#ff5d8f">ביות סופי</text>
  <path d="M${gx(0)},${gy(0)} L${gx(5)},${gy(1000)} L${gx(25)},${gy(800)} L${gx(30)},${gy(600)}" fill="none" stroke="#ffb703" stroke-width="8" stroke-linejoin="round"/>
  ${[[0, 0], [5, 1000], [25, 800], [30, 600]].map(([t, v]) => `<circle cx="${gx(t)}" cy="${gy(v)}" r="11" fill="#ffb703"/>`).join('')}
  </g>${extra}</svg>`;

add('c7m', 7, `<div class="mathbadge" data-s="0" style="position:absolute;top:-6px;right:0">רגע מתמטי 4 · קריאת גרף</div>
  <div style="margin-top:56px">${graph(`
  <g data-s="0+8"><rect x="1530" y="90" width="220" height="150" rx="14" fill="#142033" stroke="#2a3b57" stroke-width="2"/><text class="small" x="1640" y="130" text-anchor="middle">קודם כול:</text><text class="lab" x="1640" y="172" text-anchor="middle" style="fill:#ffb703;font-size:30px">קוראים את</text><text class="lab" x="1640" y="210" text-anchor="middle" style="fill:#ffb703;font-size:30px">הצירים</text></g>
  <g data-s="2" data-x="3"><rect x="${gx(6)}" y="${gy(560)}" width="560" height="150" rx="16" fill="#0c1422" stroke="#ffb703" stroke-width="3"/>
    <text x="${gx(6) + 280}" y="${gy(560) + 62}" text-anchor="middle" direction="ltr" style="font-size:44px;font-weight:700">1,000 ÷ 5 = 200</text>
    <text class="small" x="${gx(6) + 280}" y="${gy(560) + 114}" text-anchor="middle">תאוצה: 200 מ׳ לשנייה, בכל שנייה</text></g>
  <g data-s="3" data-x="4"><text class="lab" x="${gx(15)}" y="${gy(900) + 70}" text-anchor="middle" style="fill:#4cc9f0">1,000 ← 800: המנוע כבוי, האוויר מאט</text></g>
  <g data-s="4"><text class="lab" x="${gx(22)}" y="${gy(430)}" text-anchor="middle" style="fill:#ff5d8f">800 ← 600: פניות חדות עולות במהירות</text></g>`)}</div>`,
  [
    'רגע מתמטי רביעי: קריאת גרף. זה גרף של מהירות הטיל לאורך הטיסה, עם מספרים להמחשה. קודם כול קוראים את הצירים. הציר האופקי: זמן, בשניות. הציר האנכי: מהירות, במטרים לשנייה.',
    'בחמש השניות הראשונות, הקו עולה בתלילות. זה שלב ההאצה: המהירות עולה מאפס ל{־1,000| אלף} מטרים לשנייה. קו תלול פירושו שינוי מהיר.',
    'כמה מהיר? {1,000|אלף} מטרים לשנייה, בחמש שניות. {1,000|אלף} חלקי חמש: בכל שנייה, המהירות עולה ב{־200| מאתיים} מטרים לשנייה. לקצב הזה קוראים תאוצה.',
    'משנייה חמש עד שנייה עשרים וחמש, הקו יורד לאט: מ{־1,000| אלף} ל{־800| שמונה מאות}. המנוע כבוי, והתנגדות האוויר מאטה את הטיל בהדרגה. זה שלב השיוט.',
    'ובחמש השניות האחרונות הקו יורד מהר יותר, מ{־800| שמונה מאות} ל{־600| שש מאות}. בביות הסופי הטיל מבצע פניות חדות, וכל פנייה עולה לו במהירות.',
  ]);

add('c7p', 7, `<div style="display:flex;gap:30px;align-items:center;height:100%"><div style="flex:none;transform-origin:right center;width:1130px;height:430px"><div style="transform:scale(.64);transform-origin:top right">${graph('').replace(/data-hl="[^"]*"/g, '')}</div></div>
  <div style="flex:1"><div class="pausebadge" data-s="0" style="font-size:44px">עצרו ופתרו</div><p data-s="0+0.3" style="font-size:40px;margin-bottom:12px"><span class="cy">1.</span> מתי הטיל הכי מהיר?</p><p data-s="0+0.3" style="font-size:40px"><span class="cy">2.</span> בכמה אחוזים ירדה המהירות בשיוט (שנייה 5 עד 25)?</p>
  <div class="ring" data-s="0+0.3" style="width:230px;height:230px;margin:24px auto 0"><svg viewBox="0 0 360 360"><circle cx="180" cy="180" r="160" fill="none" stroke="#2a3b57" stroke-width="22"/><circle data-ring cx="180" cy="180" r="160" fill="none" stroke="#ffb703" stroke-width="22" stroke-linecap="round"/></svg><div class="n" data-count="1" style="font-size:110px">10</div></div></div></div>`,
  [
    'עצרו ופתרו, לפי הגרף. שאלה אחת: מתי הטיל הכי מהיר? שאלה שתיים: בכמה אחוזים ירדה המהירות בשלב השיוט, משנייה חמש עד שנייה עשרים וחמש?',
    { silence: 10 },
  ]);

add('c7s', 7, `<div class="mathbadge" data-s="0">פתרון</div>${mathRows([
    ['0+1', `הנקודה הגבוהה ביותר: <span class="em">שנייה 5</span>, סוף ההאצה ${E('1,000 [מ׳ לשנייה]', 'res')}`],
    ['0+9', `הירידה בשיוט: ${E('1,000 − 800 = 200')}`],
    ['0+14', `${E('200 ÷ 1,000 × 100 = 20%', 'res')}`],
  ])}`,
  ['פתרון. הנקודה הגבוהה ביותר בגרף היא בשנייה חמש, בסוף ההאצה: {1,000|אלף} מטרים לשנייה. בשיוט המהירות ירדה מ{־1,000| אלף} ל{־800| שמונה מאות}, ירידה של {200|מאתיים}. {200|מאתיים} חלקי {1,000|אלף}, כפול מאה: עשרים אחוז.']);

// ===== CH 8 =====
add('c8t', 8, titleCard(8), ['פרק שמיני. מה חשוב לזכור?']);

add('c8a', 8, `<h1 data-s="0">סיכום בדקה</h1><div style="transform:scale(.5);transform-origin:top center;height:316px;margin-top:-24px">${cutaway({ seeker: 0, guidance: 0, payload: 0, prop: 0, control: 0, power: 0, airframe: 0 }, [0, 1, 2]).replace(/data-hl="[^"]*"/g, '')}</div>
  <div class="cols" style="font-size:38px"><div>${bullets([
    ['0+1', '<span class="em">טיל = רקטה שמתקנת את המסלול</span>'],
    ['0+6', '7 מערכות: גוף, הנעה, ראש ביות, הנחיה, בקרה, מטען, חשמל + קישור'],
    ['1', 'מנוע רקטי: גזים אחורה, דחף קדימה'],
  ])}</div><div>${bullets([
    ['1+7', 'איפה אני: אינרציאלי + לוויינים'],
    ['1+10', 'איפה המטרה: מכ״ם, קישור נתונים, ראש ביות'],
    ['2', 'לולאה: <span class="cy">לחוש ← לחשב ← לפעול</span>'],
    ['2+11', 'שלבים: האצה, שיוט, ביות סופי'],
  ])}</div></div>`,
  [
    'סיכום בדקה. אחת: טיל הוא רקטה שיודעת לתקן את המסלול שלה. שתיים: בפנים יש שבע מערכות. גוף, הנעה, ראש ביות, הנחיה, בקרה, מטען, וחשמל עם קישור נתונים.',
    'שלוש: מנוע רקטי פולט גזים אחורה ונדחף קדימה, והוא נושא איתו גם דלק וגם מחמצן. ארבע: הטיל יודע איפה הוא בעזרת חיישנים אינרציאליים ולוויינים, ויודע איפה המטרה בעזרת {מכ״ם|מַכָּם}, קישור נתונים וראש ביות.',
    'חמש: המחשב מריץ לולאה. לחוש, לחשב, לפעול, פעמים רבות בכל שנייה, והוא מכוון אל נקודת המפגש, לא אל המטרה עצמה. שש: הטיסה מתחלקת להאצה, שיוט וביות סופי.',
  ]);

add('c8b', 8, `<h1 data-s="0">ארבעה כלים מתמטיים</h1>${mathRows([
    ['0+1', `<span class="cy">זמן</span> ${E('[זמן] = [מרחק] ÷ [מהירות]')}`],
    ['0+4', `<span class="cy">זה מול זה</span> ← מחברים מהירויות`],
    ['0+7', `<span class="cy">יחידות</span> ${E('[מ׳ לשנייה] × 3.6 = [קמ״ש]')}`],
    ['0+12', `<span class="cy">אחוז</span> ${E('[החלק] ÷ [השלם] × 100')}`],
    ['0+14', `<span class="cy">גרף</span> ← קודם קוראים את הצירים`],
  ])}`,
  ['ובמתמטיקה: זמן שווה מרחק חלקי מהירות. כשטסים זה מול זה, מחברים מהירויות. ממטרים לשנייה לקילומטרים לשעה, כופלים ב{־3.6| שלוש נקודה שש}. אחוז הוא החלק, חלקי השלם, כפול מאה. ובגרף, קודם כול קוראים את הצירים.']);

add('c8q', 8, `<h1 data-s="0" style="margin-bottom:16px">5 שאלות לתרגול</h1><ol class="qs" data-s="0+1">
  <li>טיל טס 800 מ׳ לשנייה אל מטרה נייחת במרחק 40 ק״מ. תוך כמה זמן יגיע?</li>
  <li>מטוס טס 900 קמ״ש. כמה זה במ׳ לשנייה? האם הוא מהיר ממהירות הקול (340 מ׳ לשנייה)?</li>
  <li>משגר חלל: מסה בשיגור 400 טון, מתוכם 360 טון חומר הודף. מה אחוז ההודף? מה המסה של כל השאר?</li>
  <li>טיל במסה 500 ק״ג, דחף המנוע 20,000 ניוטון. מה יחס הדחף למשקל? האם הוא יתרומם?</li>
  <li>טיל טס 700 מ׳ לשנייה ורודף אחרי מטרה שבורחת ממנו ב־300 מ׳ לשנייה. המרחק ביניהם 10 ק״מ. מה מהירות הסגירה, וכמה זמן יימשך המרדף?</li></ol>
  <p class="note" data-s="0+1">פתרונות מלאים: exercises.md</p>`,
  [
    'ולסיום, חמש שאלות לתרגול עצמי. עצרו את הסרטון, ופתרו בקצב שלכם. הפתרונות המלאים נמצאים בקובץ התרגילים שמצורף לשיעור.',
    'בשיעור הבא נצלול לתוך לולאת ההנחיה, ונראה איך מחשב מחליט כמה לפנות.',
    { silence: 6 },
  ]);

// ===== CREDITS =====
import fs from 'node:fs';
const MAN = new URL('../build/media/manifest.json', import.meta.url);
const man = fs.existsSync(MAN) ? JSON.parse(fs.readFileSync(MAN, 'utf8')) : [];
const usedIds = new Set(scenes.flatMap(s => [...(s.vids || []), ...[...s.html.matchAll(/stills\/([a-z0-9_]+)\.jpg/g)].map(m => m[1])]));
const esc = (t) => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cut = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1) + '…' : t; };
add('credits', 0, `<h1 data-s="0" style="margin-bottom:8px">קרדיטים ורישיונות</h1>
  <p class="note" data-s="0" style="margin-bottom:14px">תסריט, שרטוטים ואנימציה: נוצרו עבור השיעור · קריינות: קול סינתטי (Gemini TTS) · גופן: Heebo (SIL OFL) · פירוט מלא: credits.md</p>
  <div class="credits" data-s="0">${man.filter(m => usedIds.has(m.id)).map(m => `<div><b>${esc(cut(m.title, 70))}</b><br>${esc(cut(m.author, 70))} · ${esc(m.license)}</div>`).join('')}</div>`,
  [{ silence: 11 }], { bare: false });

export { scenes, CH, ORD, E, usedIds };
