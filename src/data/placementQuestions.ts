import type { Level } from './lessons';
import { LEVELS } from './lessons';

export type PlacementSection = 'grammar' | 'vocabulary' | 'reading';

export const sectionLabels: Record<PlacementSection, { en: string; ar: string }> = {
  grammar: { en: 'Grammar', ar: 'القواعد' },
  vocabulary: { en: 'Vocabulary', ar: 'المفردات' },
  reading: { en: 'Reading Comprehension', ar: 'استيعاب المقروء' },
};

export interface PlacementQuestion {
  id: string;
  level: Level;
  section: PlacementSection;
  /** Short reading passage shown above the prompt (reading section only). */
  passage?: string;
  passageAr?: string;
  prompt: string;
  promptAr: string;
  options: string[];
  correctIndex: number;
}

/**
 * Real CEFR-aligned placement bank: two questions per level (A1–C2) in each
 * of the three sections (Grammar / Vocabulary / Reading) = 36 questions total.
 * Presented section by section, ascending in difficulty within each section.
 */
export const placementQuestions: PlacementQuestion[] = [
  // ===================== GRAMMAR =====================
  {
    id: 'g-a1-1',
    level: 'A1',
    section: 'grammar',
    prompt: 'Complete: "Yo ___ estudiante."',
    promptAr: 'كمّل الجملة: "Yo ___ estudiante."',
    options: ['soy', 'estoy', 'tengo', 'voy'],
    correctIndex: 0,
  },
  {
    id: 'g-a1-2',
    level: 'A1',
    section: 'grammar',
    prompt: 'Choose the correct plural of "el libro":',
    promptAr: 'اختار جمع "el libro" الصح:',
    options: ['los libro', 'el libros', 'los libros', 'las libros'],
    correctIndex: 2,
  },
  {
    id: 'g-a2-1',
    level: 'A2',
    section: 'grammar',
    prompt: 'Complete: "Nosotros ___ al cine los sábados."',
    promptAr: 'كمّل الجملة: "Nosotros ___ al cine los sábados."',
    options: ['vamos', 'va', 'voy', 'van'],
    correctIndex: 0,
  },
  {
    id: 'g-a2-2',
    level: 'A2',
    section: 'grammar',
    prompt: 'Which sentence correctly uses "gustar"?',
    promptAr: 'أنهي جملة استخدمت فعل "gustar" صح؟',
    options: ['Yo gusto la música.', 'Me gusta la música.', 'Mí gusta la música.', 'Me gustas la música.'],
    correctIndex: 1,
  },
  {
    id: 'g-b1-1',
    level: 'B1',
    section: 'grammar',
    prompt: 'Which sentence is in the past tense (preterite)?',
    promptAr: 'أنهي جملة مكتوبة بالماضي البسيط (preterite)؟',
    options: ['Hablo español.', 'Hablaré con ella.', 'Hablé con ella ayer.', 'Estoy hablando.'],
    correctIndex: 2,
  },
  {
    id: 'g-b1-2',
    level: 'B1',
    section: 'grammar',
    prompt: 'Choose the best translation: "I have been living here for three years."',
    promptAr: 'اختار أقرب ترجمة لـ: "I have been living here for three years."',
    options: ['Vivo aquí hace tres años.', 'Viví aquí tres años.', 'Vivo aquí desde hace tres años.', 'Viviré aquí tres años.'],
    correctIndex: 2,
  },
  {
    id: 'g-b2-1',
    level: 'B2',
    section: 'grammar',
    prompt: 'Which word best completes: "Aunque llovía, ___ salimos a caminar."?',
    promptAr: 'أنهي كلمة تكمّل الجملة: "Aunque llovía, ___ salimos a caminar."؟',
    options: ['porque', 'igualmente', 'nunca', 'jamás'],
    correctIndex: 1,
  },
  {
    id: 'g-b2-2',
    level: 'B2',
    section: 'grammar',
    prompt: '"Ojalá que apruebe el examen" expresses...',
    promptAr: '"Ojalá que apruebe el examen" بتعبّر عن...',
    options: ['A certainty', 'A hope/wish', 'A command', 'A past fact'],
    correctIndex: 1,
  },
  {
    id: 'g-c1-1',
    level: 'C1',
    section: 'grammar',
    prompt: 'Choose the sentence that correctly uses the subjunctive for doubt:',
    promptAr: 'اختار الجملة اللي استخدمت صيغة الشك (subjunctive) صح:',
    options: ['Creo que tiene razón.', 'Dudo que tenga razón.', 'Sé que tiene razón.', 'Es verdad que tiene razón.'],
    correctIndex: 1,
  },
  {
    id: 'g-c1-2',
    level: 'C1',
    section: 'grammar',
    prompt: 'Which sentence correctly uses the past perfect subjunctive?',
    promptAr: 'أنهي جملة استخدمت الماضي التام الشرطي (past perfect subjunctive) صح؟',
    options: [
      'Si hubiera sabido, te habría llamado.',
      'Si sabría, te llamaría.',
      'Si sé, te llamo.',
      'Si supiera, te he llamado.',
    ],
    correctIndex: 0,
  },
  {
    id: 'g-c2-1',
    level: 'C2',
    section: 'grammar',
    prompt: 'Which sentence best demonstrates correct use of the passive "se" with a nuanced register?',
    promptAr: 'أنهي جملة استخدمت الصيغة المبنية للمجهول بـ"se" بشكل سليم وبأسلوب راقٍ؟',
    options: [
      'Se venden casas antiguas en el centro histórico.',
      'Se vende las casas en el centro.',
      'Las casas se venden ellas en el centro.',
      'Se han vendido casa en el centro.',
    ],
    correctIndex: 0,
  },
  {
    id: 'g-c2-2',
    level: 'C2',
    section: 'grammar',
    prompt: 'Choose the sentence with correctly placed and agreeing relative clause using "cuyo":',
    promptAr: 'اختار الجملة اللي استخدمت "cuyo" (الذي/التي ملكيته) بشكل نحوي سليم؟',
    options: [
      'El escritor cuyo libros ganaron el premio vino ayer.',
      'El escritor cuyos libros ganaron el premio vino ayer.',
      'El escritor cuya libros ganaron el premio vino ayer.',
      'El escritor que sus libros ganaron el premio vino ayer.',
    ],
    correctIndex: 1,
  },

  // ===================== VOCABULARY =====================
  {
    id: 'v-a1-1',
    level: 'A1',
    section: 'vocabulary',
    prompt: 'Choose the correct word for "cat":',
    promptAr: 'اختار الكلمة الصح لـ "قطة":',
    options: ['perro', 'gato', 'pájaro', 'pez'],
    correctIndex: 1,
  },
  {
    id: 'v-a1-2',
    level: 'A1',
    section: 'vocabulary',
    prompt: '"Hola, ¿cómo estás?" means...',
    promptAr: '"Hola, ¿cómo estás?" معناها...',
    options: ['Hello, how are you?', 'Goodbye, see you soon', 'What is your name?', 'Where do you live?'],
    correctIndex: 0,
  },
  {
    id: 'v-a2-1',
    level: 'A2',
    section: 'vocabulary',
    prompt: '"¿Qué hora es?" is asking about...',
    promptAr: '"¿Qué hora es?" بتسأل عن...',
    options: ['The weather', 'The time', 'The price', 'The date'],
    correctIndex: 1,
  },
  {
    id: 'v-a2-2',
    level: 'A2',
    section: 'vocabulary',
    prompt: 'Which word means "kitchen"?',
    promptAr: 'أنهي كلمة معناها "مطبخ"؟',
    options: ['baño', 'cocina', 'sala', 'dormitorio'],
    correctIndex: 1,
  },
  {
    id: 'v-b1-1',
    level: 'B1',
    section: 'vocabulary',
    prompt: 'Which word means "to achieve" or "to manage to"?',
    promptAr: 'أنهي كلمة معناها "يحقق" أو "ينجح في"؟',
    options: ['lograr', 'llorar', 'llevar', 'llegar'],
    correctIndex: 0,
  },
  {
    id: 'v-b1-2',
    level: 'B1',
    section: 'vocabulary',
    prompt: 'A "presupuesto" is best translated as:',
    promptAr: '"presupuesto" أقرب ترجمة لها هي:',
    options: ['A recipe', 'A budget', 'A schedule', 'A receipt'],
    correctIndex: 1,
  },
  {
    id: 'v-b2-1',
    level: 'B2',
    section: 'vocabulary',
    prompt: 'Which word best fits: "El proyecto fue un ___ total, no funcionó nada."',
    promptAr: 'أنهي كلمة تكمّل: "El proyecto fue un ___ total, no funcionó nada."؟',
    options: ['éxito', 'fracaso', 'logro', 'avance'],
    correctIndex: 1,
  },
  {
    id: 'v-b2-2',
    level: 'B2',
    section: 'vocabulary',
    prompt: '"Imprescindible" means:',
    promptAr: '"Imprescindible" معناها:',
    options: ['Optional', 'Essential/indispensable', 'Forbidden', 'Expensive'],
    correctIndex: 1,
  },
  {
    id: 'v-c1-1',
    level: 'C1',
    section: 'vocabulary',
    prompt: 'Which word is closest in meaning to "ambiguo"?',
    promptAr: 'أنهي كلمة أقرب في المعنى لـ "ambiguo"؟',
    options: ['Claro', 'Impreciso', 'Directo', 'Exacto'],
    correctIndex: 1,
  },
  {
    id: 'v-c1-2',
    level: 'C1',
    section: 'vocabulary',
    prompt: '"Un malentendido" refers to:',
    promptAr: '"Un malentendido" بتشير إلى:',
    options: ['A misunderstanding', 'A bad decision', 'A good deal', 'A complaint'],
    correctIndex: 0,
  },
  {
    id: 'v-c2-1',
    level: 'C2',
    section: 'vocabulary',
    prompt: 'Which word carries a more formal, literary register than "empezar" while meaning the same?',
    promptAr: 'أنهي كلمة أرقى وأدبية بمعنى "empezar" (يبدأ)؟',
    options: ['iniciar', 'comenzar', 'dar comienzo a', 'emprender'],
    correctIndex: 2,
  },
  {
    id: 'v-c2-2',
    level: 'C2',
    section: 'vocabulary',
    prompt: 'Which expression best conveys subtle sarcasm/irony in everyday Peninsular Spanish?',
    promptAr: 'أنهي تعبير بينقل سخرية خفيفة بشكل طبيعي في الإسبانية؟',
    options: ['Qué bien, otra vez lo mismo...', 'Estoy muy contento hoy.', 'No me gusta nada esto.', 'Es una gran noticia.'],
    correctIndex: 0,
  },

  // ===================== READING COMPREHENSION =====================
  {
    id: 'r-a1-1',
    level: 'A1',
    section: 'reading',
    passage: 'Me llamo Ana. Soy de España. Tengo 20 años.',
    passageAr: 'اسمي آنا. أنا من إسبانيا. عندي 20 سنة.',
    prompt: 'How old is Ana?',
    promptAr: 'آنا عندها كام سنة؟',
    options: ['18', '19', '20', '21'],
    correctIndex: 2,
  },
  {
    id: 'r-a1-2',
    level: 'A1',
    section: 'reading',
    passage: 'Juan tiene un perro y un gato. El perro se llama Rex.',
    passageAr: 'خوان عنده كلب وقطة. اسم الكلب "ريكس".',
    prompt: "What is the dog's name?",
    promptAr: 'إيه اسم الكلب؟',
    options: ['Juan', 'Rex', 'Gato', 'No dice'],
    correctIndex: 1,
  },
  {
    id: 'r-a2-1',
    level: 'A2',
    section: 'reading',
    passage: 'Todos los días, Marta se levanta a las siete, desayuna y va al trabajo en autobús.',
    passageAr: 'مارتا كل يوم تصحى الساعة سبعة، تفطر، وتروح الشغل بالأتوبيس.',
    prompt: 'How does Marta get to work?',
    promptAr: 'مارتا بتروح الشغل إزاي؟',
    options: ['Walking', 'By car', 'By bus', 'By bike'],
    correctIndex: 2,
  },
  {
    id: 'r-a2-2',
    level: 'A2',
    section: 'reading',
    passage: 'El restaurante abre a las doce y cierra a las once de la noche, excepto los lunes.',
    passageAr: 'المطعم بيفتح الساعة اتناشر وبيقفل الساعة حداشر بالليل، إلا يوم الاتنين.',
    prompt: 'On which day is the restaurant closed?',
    promptAr: 'المطعم بيقفل يوم إيه؟',
    options: ['Sunday', 'Monday', 'Saturday', 'It never closes'],
    correctIndex: 1,
  },
  {
    id: 'r-b1-1',
    level: 'B1',
    section: 'reading',
    passage:
      'Aunque llevaba solo seis meses en la empresa, Laura ya había propuesto dos ideas que ahorraron mucho dinero. Su jefe decidió ascenderla antes de fin de año.',
    passageAr: 'مع إنها كانت لسه ست شهور بس في الشركة، لورا كانت اقترحت فكرتين وفروا فلوس كتير. مديرها قرر يرقّيها قبل آخر السنة.',
    prompt: "Why did Laura's boss decide to promote her?",
    promptAr: 'مدير لورا قرر يرقّيها ليه؟',
    options: [
      'She had worked there for many years.',
      'Her ideas saved the company money.',
      'She asked for a raise.',
      'She was the only employee.',
    ],
    correctIndex: 1,
  },
  {
    id: 'r-b1-2',
    level: 'B1',
    section: 'reading',
    passage:
      'El tren que iba a salir a las nueve se retrasó por una avería técnica, así que los pasajeros tuvieron que esperar casi una hora en el andén.',
    passageAr: 'القطر اللي كان هيقوم الساعة تسعة اتأخر بسبب عطل فني، فالركاب استنوا حوالي ساعة على الرصيف.',
    prompt: 'Why was the train delayed?',
    promptAr: 'القطر اتأخر ليه؟',
    options: ['Bad weather', 'A technical fault', 'A strike', 'Too many passengers'],
    correctIndex: 1,
  },
  {
    id: 'r-b2-1',
    level: 'B2',
    section: 'reading',
    passage:
      'A pesar de las críticas iniciales, la nueva política medioambiental ha logrado reducir las emisiones en un quince por ciento, aunque los expertos advierten de que aún queda mucho camino por recorrer.',
    passageAr: 'رغم الانتقادات الأولى، السياسة البيئية الجديدة نجحت تقلل الانبعاثات بنسبة خمستاشر بالمية، لكن الخبراء بيحذروا إن لسه فيه طريق طويل قدامنا.',
    prompt: 'What is the overall tone of the passage regarding the new policy?',
    promptAr: 'إيه النبرة العامة للنص عن السياسة الجديدة؟',
    options: [
      'Completely negative — the policy failed.',
      'Cautiously positive — progress made, but more is needed.',
      'Indifferent — no opinion given.',
      'The policy was cancelled.',
    ],
    correctIndex: 1,
  },
  {
    id: 'r-b2-2',
    level: 'B2',
    section: 'reading',
    passage:
      'Si bien el teletrabajo ofrece flexibilidad, muchos empleados afirman sentirse más aislados, lo que ha llevado a algunas empresas a exigir al menos dos días presenciales por semana.',
    passageAr: 'مع إن الشغل عن بعد بيدي مرونة، كتير من الموظفين بيقولوا إنهم حاسين بعزلة أكتر، وده خلى بعض الشركات تطلب يومين حضور على الأقل في الأسبوع.',
    prompt: 'Why have some companies required employees to come in two days a week?',
    promptAr: 'بعض الشركات طلبت يومين حضور ليه؟',
    options: [
      'Remote work was too expensive.',
      'Employees reported feeling isolated.',
      'The office needed more staff.',
      'It was required by law.',
    ],
    correctIndex: 1,
  },
  {
    id: 'r-c1-1',
    level: 'C1',
    section: 'reading',
    passage:
      'La ambigüedad del dictamen judicial dio pie a interpretaciones contrapuestas: mientras unos sostenían que sentaba un precedente histórico, otros lo tachaban de mero gesto simbólico sin repercusión práctica alguna.',
    passageAr: 'غموض الحكم القضائي فتح الباب لتفسيرات متضاربة: البعض قال إنه سابقة تاريخية، والبعض التاني اعتبره مجرد إيماءة رمزية من غير أي أثر عملي.',
    prompt: 'What does the passage suggest about reactions to the ruling?',
    promptAr: 'النص بيوحي بإيه عن ردود الفعل على الحكم؟',
    options: [
      'Everyone agreed it was historic.',
      'Reactions were divided between two opposing views.',
      'The ruling was widely ignored.',
      'It was overturned immediately.',
    ],
    correctIndex: 1,
  },
  {
    id: 'r-c1-2',
    level: 'C1',
    section: 'reading',
    passage:
      'No es que el autor rechace la tecnología; más bien cuestiona la ingenua suposición de que todo avance técnico se traduce, sin más, en progreso social.',
    passageAr: 'مش إن الكاتب بيرفض التكنولوجيا؛ لكنه بيشكك في الافتراض الساذج إن أي تقدم تقني بيتحول تلقائيًا لتقدم اجتماعي.',
    prompt: "What is the author's actual position?",
    promptAr: 'إيه موقف الكاتب فعليًا؟',
    options: [
      'Technology should be abandoned.',
      'Technical progress does not automatically mean social progress.',
      'Social progress causes technical progress.',
      'The author has no opinion on technology.',
    ],
    correctIndex: 1,
  },
  {
    id: 'r-c2-1',
    level: 'C2',
    section: 'reading',
    passage:
      'Lejos de zanjar el debate, el informe no hizo sino avivar las suspicacias de quienes ya recelaban de sus conclusiones, precisamente por la parquedad con que se abordaron las fuentes.',
    passageAr: 'بعيد عن ما إنه يحسم الجدل، التقرير عمل العكس وزوّد شكوك اللي كانوا أصلاً متشككين في نتائجه، وده بالتحديد بسبب الاقتضاب اللي اتعامل بيه مع المصادر.',
    prompt: 'What effect did the report actually have?',
    promptAr: 'إيه التأثير الفعلي اللي عمله التقرير؟',
    options: [
      'It resolved the debate completely.',
      'It deepened existing suspicions rather than settling anything.',
      'It was universally praised for its sources.',
      'It had no effect at all.',
    ],
    correctIndex: 1,
  },
  {
    id: 'r-c2-2',
    level: 'C2',
    section: 'reading',
    passage:
      'Quienes tildan la reforma de utópica olvidan que, en su día, propuestas hoy asumidas como sensatas fueron recibidas con idéntico escepticismo.',
    passageAr: 'اللي بيوصفوا الإصلاح بإنه طوباوي (خيالي) بينسوا إن مقترحات بقت النهاردة منطقية كانت في وقتها استُقبلت بنفس التشكك.',
    prompt: 'What rhetorical point is the author making?',
    promptAr: 'إيه النقطة اللي الكاتب بيوصلها؟',
    options: [
      'The reform will definitely fail like past ideas.',
      'Being met with skepticism today does not mean an idea is wrong.',
      'All utopian ideas eventually succeed.',
      'Past proposals were never controversial.',
    ],
    correctIndex: 1,
  },
];

/**
 * Level order used for scoring — index reflects CEFR progression.
 */
const LEVEL_ORDER: Level[] = LEVELS;

export interface SectionResult {
  section: PlacementSection;
  correct: number;
  total: number;
  level: Level;
}

export interface PlacementResult {
  overallLevel: Level;
  sections: SectionResult[];
}

/**
 * Scores a full placement attempt.
 *
 * For each section, we walk the CEFR ladder from A1 upward: a level counts
 * as "cleared" only if the learner got at least half of that level's
 * questions right in that section. The section level is the highest
 * consecutively-cleared level (never skipping a failed level), which keeps
 * the placement honest instead of just averaging raw scores.
 *
 * The overall level is the median of the three section levels, so one
 * unusually strong or weak section doesn't single-handedly decide the
 * placement.
 */
export function scorePlacement(answers: Record<string, number>): PlacementResult {
  const sections: PlacementSection[] = ['grammar', 'vocabulary', 'reading'];
  const sectionResults: SectionResult[] = sections.map((section) => {
    const qs = placementQuestions.filter((q) => q.section === section);
    let clearedIndex = -1;
    for (let i = 0; i < LEVEL_ORDER.length; i++) {
      const levelQs = qs.filter((q) => q.level === LEVEL_ORDER[i]);
      if (levelQs.length === 0) break;
      const correctAtLevel = levelQs.filter((q) => answers[q.id] === q.correctIndex).length;
      if (correctAtLevel / levelQs.length >= 0.5) {
        clearedIndex = i;
      } else {
        break;
      }
    }
    const totalCorrect = qs.filter((q) => answers[q.id] === q.correctIndex).length;
    return {
      section,
      correct: totalCorrect,
      total: qs.length,
      level: LEVEL_ORDER[Math.max(clearedIndex, 0)],
    };
  });

  const indices = sectionResults.map((r) => LEVEL_ORDER.indexOf(r.level)).sort((a, b) => a - b);
  const medianIndex = indices[Math.floor(indices.length / 2)];

  return {
    overallLevel: LEVEL_ORDER[medianIndex],
    sections: sectionResults,
  };
}

/** Legacy helper kept for compatibility with any older callers. */
export function scoreToLevel(correctCount: number, totalQuestions: number): Level {
  const ratio = correctCount / totalQuestions;
  if (ratio >= 0.92) return 'C2';
  if (ratio >= 0.8) return 'C1';
  if (ratio >= 0.65) return 'B2';
  if (ratio >= 0.48) return 'B1';
  if (ratio >= 0.28) return 'A2';
  return 'A1';
}
