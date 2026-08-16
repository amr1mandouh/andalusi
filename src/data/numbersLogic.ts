export interface NumberBreakdown {
  value: number;
  en: string;
  es: string;
  ar: string;
  parts: { label: string; en: string; es: string; ar: string }[];
}

const ONES_EN = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS_EN = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_EN = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const ONES_ES = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const TEENS_ES = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const TENS_ES = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];

const ONES_AR = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
const TEENS_AR = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
const TENS_AR = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];

function twoDigitEn(n: number): string {
  if (n < 10) return ONES_EN[n];
  if (n < 20) return TEENS_EN[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS_EN[t] : `${TENS_EN[t]}-${ONES_EN[o]}`;
}

function twoDigitEs(n: number): string {
  if (n < 10) return ONES_ES[n];
  if (n < 20) return TEENS_ES[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  if (t === 2) return o === 0 ? 'veinte' : `veinti${ONES_ES[o]}`;
  return o === 0 ? TENS_ES[t] : `${TENS_ES[t]} y ${ONES_ES[o]}`;
}

function twoDigitAr(n: number): string {
  if (n < 10) return ONES_AR[n];
  if (n < 20) return TEENS_AR[n - 10];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? TENS_AR[t] : `${ONES_AR[o]} و${TENS_AR[t]}`;
}

function hundredsEn(n: number): string {
  if (n === 0) return '';
  if (n < 100) return twoDigitEn(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const hStr = h === 1 ? 'one hundred' : `${ONES_EN[h]} hundred`;
  return rest === 0 ? hStr : `${hStr} ${twoDigitEn(rest)}`;
}

function hundredsEs(n: number): string {
  if (n === 0) return '';
  if (n < 100) return twoDigitEs(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  let hStr: string;
  if (h === 1) hStr = rest === 0 ? 'cien' : 'ciento';
  else if (h === 5) hStr = 'quinientos';
  else if (h === 7) hStr = 'setecientos';
  else if (h === 9) hStr = 'novecientos';
  else hStr = `${ONES_ES[h]}cientos`;
  return rest === 0 ? hStr : `${hStr} ${twoDigitEs(rest)}`;
}

function hundredsAr(n: number): string {
  if (n === 0) return '';
  if (n < 100) return twoDigitAr(n);
  const h = Math.floor(n / 100);
  const rest = n % 100;
  const hStr = h === 1 ? 'مئة' : h === 2 ? 'مئتان' : `${ONES_AR[h]} مئة`;
  return rest === 0 ? hStr : `${hStr} و${twoDigitAr(rest)}`;
}

function threeDigitEn(n: number): string {
  return hundredsEn(n);
}
function threeDigitEs(n: number): string {
  return hundredsEs(n);
}
function threeDigitAr(n: number): string {
  return hundredsAr(n);
}

export function numberToWords(n: number): { en: string; es: string; ar: string } {
  if (n === 0) return { en: 'zero', es: 'cero', ar: 'صفر' };
  if (n < 0) {
    const pos = numberToWords(Math.abs(n));
    return { en: `minus ${pos.en}`, es: `menos ${pos.es}`, ar: `سالب ${pos.ar}` };
  }

  const scales: { limit: number; en: string; es: string; esPlural: string; ar: string }[] = [
    { limit: 1e9, en: 'billion', es: 'mil millones', esPlural: 'mil millones', ar: 'مليار' },
    { limit: 1e6, en: 'million', es: 'millón', esPlural: 'millones', ar: 'مليون' },
    { limit: 1e3, en: 'thousand', es: 'mil', esPlural: 'mil', ar: 'ألف' },
  ];

  let remaining = n;
  const enParts: string[] = [];
  const esParts: string[] = [];
  const arParts: string[] = [];

  for (const scale of scales) {
    if (remaining >= scale.limit) {
      const count = Math.floor(remaining / scale.limit);
      remaining = remaining % scale.limit;
      const countEn = threeDigitEn(count);
      const countEs = count === 1 ? '' : threeDigitEs(count) + ' ';
      const countAr = count === 1 ? '' : `${threeDigitAr(count)} `;
      const esScaleWord = count === 1 ? scale.es : scale.esPlural;

      if (count === 1) {
        enParts.push(`one ${scale.en}`);
      } else {
        enParts.push(`${countEn} ${scale.en}`);
      }
      esParts.push(scale.es === 'mil' && count === 1 ? 'mil' : `${countEs}${esScaleWord}`);
      arParts.push(scale.ar === 'ألف' && count === 1 ? 'ألف' : `${countAr}${scale.ar}`);
    }
  }

  if (remaining > 0) {
    enParts.push(threeDigitEn(remaining));
    esParts.push(threeDigitEs(remaining));
    arParts.push(threeDigitAr(remaining));
  }

  return {
    en: enParts.join(' '),
    es: esParts.join(' '),
    ar: arParts.join(' و'),
  };
}

export interface ProTip {
  title: string;
  titleEs: string;
  titleAr: string;
  examples: NumberBreakdown[];
  explanation: string;
  explanationEs: string;
  explanationAr: string;
}

export function getNumberProTips(): ProTip[] {
  const buildExamples = (values: number[]): NumberBreakdown[] =>
    values.map((v) => {
      const words = numberToWords(v);
      return {
        value: v,
        en: words.en,
        es: words.es,
        ar: words.ar,
        parts: [],
      };
    });

  return [
    {
      title: 'Hundreds (100–999)',
      titleEs: 'Centenas (100–999)',
      titleAr: 'المئات (١٠٠–٩٩٩)',
      examples: buildExamples([100, 200, 500, 999]),
      explanation: 'In English, say "X hundred" then the tens and ones. In Spanish, "cien" becomes "ciento" before other digits. Special forms: 500=quinientos, 700=setecientos, 900=novecientos.',
      explanationEs: 'En español, "cien" se convierte en "ciento" antes de otros dígitos. Formas especiales: 500=quinientos, 700=setecientos, 900=novecientos.',
      explanationAr: 'بالإسبانية، "cien" تصبح "ciento" قبل أرقام أخرى. أشكال خاصة: 500=quinientos, 700=setecientos, 900=novecientos.',
    },
    {
      title: 'Thousands (1,000–999,999)',
      titleEs: 'Miles (1,000–999,999)',
      titleAr: 'الآلاف (١٬٠٠٠–٩٩٩٬٩٩٩)',
      examples: buildExamples([1000, 2000, 25000, 100000, 999999]),
      explanation: 'English: "X thousand" + remainder. Spanish: "mil" (no article). For 2,000+ say "dos mil". Arabic uses "ألف" for 1,000 and "ألفان" for 2,000.',
      explanationEs: 'Español: "mil" (sin artículo). Para 2,000+ di "dos mil". 25,000 = "veinticinco mil".',
      explanationAr: 'بالإسبانية "mil" بدون أداة. لـ ٢٬٠٠٠+ قل "dos mil". ٢٥٬٠٠٠ = "veinticinco mil".',
    },
    {
      title: 'Millions (1,000,000+)',
      titleEs: 'Millones (1,000,000+)',
      titleAr: 'الملايين (١٬٠٠٠٬٠٠٠+)',
      examples: buildExamples([1000000, 2000000, 50000000, 100000000]),
      explanation: 'English: "X million" + remainder. Spanish: "millón" (singular) / "millones" (plural). 1M = "un millón", 2M = "dos millones".',
      explanationEs: 'Español: "millón" (singular) / "millones" (plural). 1M = "un millón", 2M = "dos millones".',
      explanationAr: 'بالإسبانية: "millón" للمفرد و"millones" للجمع. مليون = "un millón"، مليونان = "dos millones".',
    },
    {
      title: 'Billions (1,000,000,000+)',
      titleEs: 'Miles de millones (1,000,000,000+)',
      titleAr: 'المليارات (١٬٠٠٠٬٠٠٠٬٠٠٠+)',
      examples: buildExamples([1000000000, 2000000000, 5000000000]),
      explanation: 'English: "X billion". Spanish uses "mil millones" (no single word for billion). Arabic: "مليار". 1B = "one billion" / "mil millones" / "مليار".',
      explanationEs: 'Español usa "mil millones" (no hay una sola palabra para billón). 1B = "mil millones".',
      explanationAr: 'الإسبانية تستخدم "mil millones" (لا توجد كلمة واحدة للمليار). ١ مليار = "mil millones".',
    },
  ];
}

export interface NumberMilestone {
  value: number;
  emoji: string;
}

export const NUMBER_MILESTONES: NumberMilestone[] = [
  { value: 100, emoji: '💯' },
  { value: 110, emoji: '🔢' },
  { value: 200, emoji: '🔢' },
  { value: 300, emoji: '🔢' },
  { value: 400, emoji: '🔢' },
  { value: 1000, emoji: '🎉' },
  { value: 2000, emoji: '🎉' },
  { value: 10000, emoji: '🔟' },
  { value: 20000, emoji: '📊' },
  { value: 200000, emoji: '📈' },
  { value: 1000000, emoji: '💰' },
  { value: 10000000, emoji: '🏦' },
  { value: 100000000, emoji: '🏛️' },
  { value: 1000000000, emoji: '🌍' },
];

export function generateNumberRange(start: number, end: number): NumberBreakdown[] {
  const result: NumberBreakdown[] = [];
  for (let i = start; i <= end; i++) {
    const words = numberToWords(i);
    result.push({
      value: i,
      en: words.en,
      es: words.es,
      ar: words.ar,
      parts: [],
    });
  }
  return result;
}
