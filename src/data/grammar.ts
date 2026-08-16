export interface ConjugationRow {
  pronoun: string;
  pronounAr: string;
  form: string;
}

export interface GrammarExample {
  es: string;
  en: string;
  ar: string;
}

export interface ReferenceRow {
  item: string;
  itemAr: string;
  usage: string;
  usageAr: string;
}

export interface VerbTable {
  infinitive: string;
  meaning: string;
  conjugations: ConjugationRow[];
}

export interface GrammarLesson {
  id: string;
  title: string;
  titleEs: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  formationNote: string;
  formationNoteAr: string;
  /** Single-verb tense lessons (present/past/future simple) use this. */
  sampleVerb?: VerbTable;
  /** Multi-verb lessons (irregular verbs) use this instead of sampleVerb. */
  irregularVerbs?: VerbTable[];
  /** Non-verb lessons (prepositions, articles) use a plain reference list instead of a conjugation table. */
  referenceTitle?: string;
  referenceTitleAr?: string;
  referenceRows?: ReferenceRow[];
  examples: GrammarExample[];
  tips: string[];
  tipsAr: string[];
}

const pronouns = [
  { pronoun: 'yo', pronounAr: 'أنا' },
  { pronoun: 'tú', pronounAr: 'أنتَ / أنتِ' },
  { pronoun: 'él / ella / usted', pronounAr: 'هو / هي / حضرتك' },
  { pronoun: 'nosotros', pronounAr: 'نحن' },
  { pronoun: 'vosotros', pronounAr: 'أنتم (إسبانيا)' },
  { pronoun: 'ellos / ellas / ustedes', pronounAr: 'هم / هن / حضراتكم' },
];

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'present-simple',
    title: 'Present Simple',
    titleEs: 'Presente Simple',
    titleAr: 'المضارع البسيط',
    summary:
      'Used for habits, routines, general facts, and things that are true right now. Regular verbs fall into three groups by their ending: -AR, -ER, -IR.',
    summaryAr:
      'يُستخدم للتعبير عن العادات، الروتين اليومي، الحقائق العامة، والأشياء الصحيحة في الوقت الحالي. الأفعال المنتظمة تنقسم لثلاث مجموعات حسب نهايتها: -AR، -ER، -IR.',
    formationNote: 'Drop the -ar/-er/-ir ending and add the matching set of endings for each pronoun.',
    formationNoteAr: 'نحذف نهاية الفعل (-ar/-er/-ir) ونضيف النهاية المناسبة لكل ضمير.',
    sampleVerb: {
      infinitive: 'hablar (to speak)',
      meaning: 'يتكلم',
      conjugations: [
        { ...pronouns[0], form: 'hablo' },
        { ...pronouns[1], form: 'hablas' },
        { ...pronouns[2], form: 'habla' },
        { ...pronouns[3], form: 'hablamos' },
        { ...pronouns[4], form: 'habláis' },
        { ...pronouns[5], form: 'hablan' },
      ],
    },
    examples: [
      { es: 'Yo hablo español todos los días.', en: 'I speak Spanish every day.', ar: 'أنا أتكلم الإسبانية كل يوم.' },
      { es: 'Ella trabaja en el hospital.', en: 'She works at the hospital.', ar: 'هي تعمل في المستشفى.' },
      { es: 'Nosotros vivimos en El Cairo.', en: 'We live in Cairo.', ar: 'نحن نعيش في القاهرة.' },
    ],
    tips: [
      'The -ER and -IR endings are almost identical except for "nosotros" and "vosotros".',
      'Many common verbs (ser, estar, tener, ir) are irregular and must be memorized separately.',
    ],
    tipsAr: [
      'نهايات -ER و-IR متشابهة تقريباً ما عدا مع "نحن" و"أنتم".',
      'أفعال كتيرة شائعة (ser، estar، tener، ir) شاذة ولازم تتحفظ لوحدها.',
    ],
  },
  {
    id: 'past-simple',
    title: 'Past Simple (Preterite)',
    titleEs: 'Pretérito Indefinido',
    titleAr: 'الماضي البسيط',
    summary:
      'Describes completed actions at a specific point in the past — something that started and finished, like a single event.',
    summaryAr:
      'يوصف به فعل حدث واكتمل في وقت محدد بالماضي — حاجة بدأت وخلصت، زي حدث واحد وقع مرة واحدة.',
    formationNote: 'Drop the infinitive ending and add the preterite endings — note -er and -ir verbs share the same set.',
    formationNoteAr: 'نحذف نهاية المصدر ونضيف نهايات الماضي — لاحظ إن أفعال -er و-ir بتاخد نفس النهايات.',
    sampleVerb: {
      infinitive: 'hablar (to speak)',
      meaning: 'تكلّم',
      conjugations: [
        { ...pronouns[0], form: 'hablé' },
        { ...pronouns[1], form: 'hablaste' },
        { ...pronouns[2], form: 'habló' },
        { ...pronouns[3], form: 'hablamos' },
        { ...pronouns[4], form: 'hablasteis' },
        { ...pronouns[5], form: 'hablaron' },
      ],
    },
    examples: [
      { es: 'Ayer hablé con mi hermano.', en: 'Yesterday I spoke with my brother.', ar: 'إمبارح اتكلمت مع أخويا.' },
      { es: 'Ella viajó a Madrid el mes pasado.', en: 'She traveled to Madrid last month.', ar: 'هي سافرت لمدريد الشهر اللي فات.' },
      { es: 'Comimos en un restaurante nuevo.', en: 'We ate at a new restaurant.', ar: 'إحنا أكلنا في مطعم جديد.' },
    ],
    tips: [
      'Common time markers: ayer (yesterday), la semana pasada (last week), en 2020.',
      'Irregular preterites (ser/ir, tener, hacer) don\u2019t follow the regular pattern — worth learning as a group.',
    ],
    tipsAr: [
      'كلمات مرتبطة بالماضي: ayer (إمبارح)، la semana pasada (الأسبوع اللي فات)، en 2020.',
      'أفعال الماضي الشاذة (ser/ir، tener، hacer) مالهاش نمط ثابت — يستاهل تتعلمها مع بعض كمجموعة.',
    ],
  },
  {
    id: 'future-simple',
    title: 'Future Simple',
    titleEs: 'Futuro Simple',
    titleAr: 'المستقبل البسيط',
    summary:
      'Talks about what will happen. Unlike present and past, the future endings attach to the full infinitive, not a stem.',
    summaryAr:
      'بيتكلم عن حاجة هتحصل في المستقبل. على عكس المضارع والماضي، نهايات المستقبل بتتحط على المصدر كامل مش على جذر الفعل.',
    formationNote: 'Keep the whole infinitive and simply add the future endings — the same endings work for -ar, -er, and -ir verbs.',
    formationNoteAr: 'المصدر بيفضل زي ما هو، وبس بنضيف نهايات المستقبل — نفس النهايات بتشتغل مع كل الأفعال (-ar، -er، -ir).',
    sampleVerb: {
      infinitive: 'hablar (to speak)',
      meaning: 'هيتكلم',
      conjugations: [
        { ...pronouns[0], form: 'hablaré' },
        { ...pronouns[1], form: 'hablarás' },
        { ...pronouns[2], form: 'hablará' },
        { ...pronouns[3], form: 'hablaremos' },
        { ...pronouns[4], form: 'hablaréis' },
        { ...pronouns[5], form: 'hablarán' },
      ],
    },
    examples: [
      { es: 'Mañana hablaré con el profesor.', en: 'Tomorrow I will speak with the teacher.', ar: 'بكرة هتكلم مع الأستاذ.' },
      { es: 'Ellos viajarán a Egipto el año que viene.', en: 'They will travel to Egypt next year.', ar: 'هم هيسافروا مصر السنة الجاية.' },
      { es: 'Estudiaremos juntos para el examen.', en: 'We will study together for the exam.', ar: 'هنذاكر مع بعض للامتحان.' },
    ],
    tips: [
      'A handful of irregular verbs change the stem but keep the regular endings: tener → tendré, hacer → haré, poder → podré.',
      'For near-future plans, Spanish often uses "ir a + infinitive" instead (voy a hablar) — similar to English "going to".',
    ],
    tipsAr: [
      'شوية أفعال شاذة بتغيّر جذرها لكن بتحتفظ بنفس النهايات: tener ← tendré، hacer ← haré، poder ← podré.',
      'للخطط القريبة، الإسبانية غالباً بتستخدم "ir a + المصدر" بدل المستقبل البسيط (voy a hablar) — زي "going to" بالإنجليزي.',
    ],
  },
  {
    id: 'prepositions',
    title: 'Prepositions',
    titleEs: 'Preposiciones',
    titleAr: 'حروف الجر',
    summary:
      'Prepositions link words together to show place, time, direction, or manner. They rarely translate word-for-word from English or Arabic, so it\u2019s better to learn each one with the phrases it typically appears in rather than a single fixed translation.',
    summaryAr:
      'حروف الجر بتربط الكلمات ببعضها عشان تبيّن المكان أو الزمان أو الاتجاه أو الطريقة. نادراً ما بتتترجم كلمة بكلمة من الإنجليزي أو العربي، فالأفضل إنك تتعلم كل حرف جر مع الجمل اللي بيتكرر فيها بدل ما تحفظله ترجمة واحدة ثابتة.',
    formationNote:
      'Prepositions don\u2019t change form — the challenge is picking the right one for the context, not conjugating it.',
    formationNoteAr: 'حروف الجر مالهاش تصريف — الصعوبة إنك تختار الحرف الصح حسب السياق، مش إنك تصرّفه.',
    referenceTitle: 'The 12 most useful prepositions',
    referenceTitleAr: 'أهم 12 حرف جر',
    referenceRows: [
      { item: 'a', itemAr: 'a (إلى / لـ)', usage: 'Direction/destination, or before a person as a direct object: "Voy a Madrid." / "Veo a Juan."', usageAr: 'للاتجاه أو الوجهة، أو قبل الشخص كمفعول به مباشر: "أنا رايح مدريد." / "بشوف خوان."' },
      { item: 'de', itemAr: 'de (من / بتاع)', usage: 'Origin, possession, or material: "Soy de Egipto." / "El libro de María."', usageAr: 'للأصل أو الملكية أو الخامة: "أنا من مصر." / "كتاب ماريا."' },
      { item: 'en', itemAr: 'en (في)', usage: 'Location (inside/at) or a means of transport: "Estoy en casa." / "Viajo en tren."', usageAr: 'للمكان (جوه/عند) أو وسيلة المواصلات: "أنا في البيت." / "بسافر بالقطر."' },
      { item: 'con', itemAr: 'con (مع)', usage: 'Accompaniment or means: "Voy con mi hermano." / "Escribo con un lápiz."', usageAr: 'للمرافقة أو الأداة: "رايح مع أخويا." / "بكتب بقلم رصاص."' },
      { item: 'sin', itemAr: 'sin (من غير / بدون)', usage: 'Absence of something: "Café sin azúcar."', usageAr: 'لغياب حاجة: "قهوة من غير سكر."' },
      { item: 'por', itemAr: 'por (بسبب / خلال / مقابل)', usage: 'Reason, duration, or exchange: "Gracias por tu ayuda." / "Trabajé por dos horas."', usageAr: 'للسبب أو المدة أو المقابل: "شكراً على مساعدتك." / "اشتغلت لمدة ساعتين."' },
      { item: 'para', itemAr: 'para (عشان / لـ / لغاية)', usage: 'Purpose, recipient, or deadline: "Esto es para ti." / "Lo necesito para el lunes."', usageAr: 'للهدف أو المستقبِل أو الموعد النهائي: "ده ليك." / "محتاجه لغاية يوم الاتنين."' },
      { item: 'sobre', itemAr: 'sobre (فوق / حوالين)', usage: 'Physical position "on top of", or "about" a topic: "El libro está sobre la mesa." / "Hablamos sobre el trabajo."', usageAr: 'للوضع فوق حاجة، أو معناها "عن" موضوع معين: "الكتاب فوق الترابيزة." / "اتكلمنا عن الشغل."' },
      { item: 'entre', itemAr: 'entre (بين)', usage: 'Between two or more things: "Entre tú y yo."', usageAr: 'بين حاجتين أو أكتر: "بيني وبينك."' },
      { item: 'desde', itemAr: 'desde (من... لحد)', usage: 'Starting point in time or space: "Desde las nueve." / "Desde mi casa."', usageAr: 'لنقطة البداية زمنياً أو مكانياً: "من الساعة تسعة." / "من بيتي."' },
      { item: 'hasta', itemAr: 'hasta (لحد / حتى)', usage: 'End point in time or space: "Hasta mañana." / "Hasta la puerta."', usageAr: 'لنقطة النهاية زمنياً أو مكانياً: "لحد بكرة." / "لحد الباب."' },
      { item: 'hacia', itemAr: 'hacia (ناحية / تجاه)', usage: 'General direction, less exact than "a": "Caminamos hacia el norte."', usageAr: 'لاتجاه عام، مش دقيق زي "a": "مشينا ناحية الشمال."' },
    ],
    examples: [
      { es: 'Vivo en Madrid desde 2019.', en: "I've lived in Madrid since 2019.", ar: 'أنا عايش في مدريد من سنة 2019.' },
      { es: 'Este regalo es para ti, con mucho cariño.', en: 'This gift is for you, with much affection.', ar: 'الهدية دي ليك، بكل حب.' },
      { es: 'Caminamos hacia la playa hasta las seis.', en: 'We walked toward the beach until six.', ar: 'مشينا ناحية الشاطئ لحد الساعة ستة.' },
    ],
    tips: [
      '"Por" and "para" are the classic confusion pair: "por" looks backward at a cause, "para" looks forward at a purpose or destination.',
      'When a verb is normally followed by a specific preposition in Spanish (pensar en, soñar con, depender de), learn the pair together — don\u2019t translate the English preposition literally.',
    ],
    tipsAr: [
      '"por" و"para" هما أكتر زوج بيلخبط الناس: "por" بتشاور على السبب اللي وراك، و"para" بتشاور على الهدف أو الوجهة قدامك.',
      'لما فعل معين بياخد حرف جر ثابت بعده (pensar en، soñar con، depender de)، احفظهم مع بعض كوحدة واحدة — من غير ما تترجم حرف الجر الإنجليزي حرفياً.',
    ],
  },
  {
    id: 'articles',
    title: 'Definite & Indefinite Articles',
    titleEs: 'Artículos Definidos e Indefinidos',
    titleAr: 'أدوات التعريف والتنكير',
    summary:
      'Spanish articles agree in gender (masculine/feminine) and number (singular/plural) with the noun they introduce. Definite articles (el, la, los, las) point to something specific — "the". Indefinite articles (un, una, unos, unas) introduce something non-specific — "a/an/some".',
    summaryAr:
      'أدوات التعريف في الإسبانية بتتفق في النوع (مذكر/مؤنث) والعدد (مفرد/جمع) مع الاسم اللي بتسبقه. أداة التعريف (el، la، los، las) بتشاور على حاجة محددة — زي "الـ" بالعربي. وأداة التنكير (un، una، unos، unas) بتقدّم حاجة مش محددة — زي "واحد/شوية".',
    formationNote:
      'The article always matches the noun\u2019s gender and number, and two contractions are mandatory: a + el → al, de + el → del.',
    formationNoteAr: 'أداة التعريف دايماً بتوافق نوع وعدد الاسم، وفيه إدغامان إلزاميان: a + el ← al، وde + el ← del.',
    referenceTitle: 'Articles at a glance',
    referenceTitleAr: 'أدوات التعريف والتنكير في نظرة سريعة',
    referenceRows: [
      { item: 'el (m. singular)', itemAr: 'el (مذكر مفرد)', usage: '"the" — el libro (the book)', usageAr: '"الـ" — el libro (الكتاب)' },
      { item: 'la (f. singular)', itemAr: 'la (مؤنث مفرد)', usage: '"the" — la casa (the house)', usageAr: '"الـ" — la casa (البيت)' },
      { item: 'los (m. plural)', itemAr: 'los (مذكر جمع)', usage: '"the" — los libros (the books)', usageAr: '"الـ" — los libros (الكتب)' },
      { item: 'las (f. plural)', itemAr: 'las (مؤنث جمع)', usage: '"the" — las casas (the houses)', usageAr: '"الـ" — las casas (البيوت)' },
      { item: 'un (m. singular)', itemAr: 'un (مذكر مفرد)', usage: '"a/an" — un libro (a book)', usageAr: '"واحد" — un libro (كتاب واحد)' },
      { item: 'una (f. singular)', itemAr: 'una (مؤنث مفرد)', usage: '"a/an" — una casa (a house)', usageAr: '"واحدة" — una casa (بيت واحد)' },
      { item: 'unos (m. plural)', itemAr: 'unos (مذكر جمع)', usage: '"some" — unos libros (some books)', usageAr: '"شوية" — unos libros (شوية كتب)' },
      { item: 'unas (f. plural)', itemAr: 'unas (مؤنث جمع)', usage: '"some" — unas casas (some houses)', usageAr: '"شوية" — unas casas (شوية بيوت)' },
      { item: 'al (= a + el)', itemAr: 'al (= a + el)', usage: 'Mandatory contraction: "Voy al banco" (never "a el banco").', usageAr: 'إدغام إلزامي: "Voy al banco" (مينفعش "a el banco").' },
      { item: 'del (= de + el)', itemAr: 'del (= de + el)', usage: 'Mandatory contraction: "El coche del profesor" (never "de el profesor").', usageAr: 'إدغام إلزامي: "El coche del profesor" (مينفعش "de el profesor").' },
    ],
    examples: [
      { es: 'El café está sobre la mesa.', en: 'The coffee is on the table.', ar: 'القهوة فوق الترابيزة.' },
      { es: 'Voy al mercado a comprar unas frutas.', en: 'I\u2019m going to the market to buy some fruit.', ar: 'أنا رايح السوق أشتري شوية فاكهة.' },
      { es: 'La casa del vecino es muy grande.', en: 'The neighbor\u2019s house is very big.', ar: 'بيت الجار كبير أوي.' },
    ],
    tips: [
      'A handful of feminine nouns starting with a stressed "a-" sound (agua, alma, águila) take "el" in the singular purely for pronunciation — but stay feminine, so it\u2019s "el agua fría", not "el agua frío".',
      'Unlike English, Spanish often keeps the definite article with general or abstract nouns: "Me gusta el café" (I like coffee), not "Me gusta café".',
    ],
    tipsAr: [
      'كام اسم مؤنث بيبدأ بصوت "a" مشدّد (agua، alma، águila) بياخد "el" في المفرد بس عشان النطق — لكنه يفضل مؤنث، فبنقول "el agua fría" مش "el agua frío".',
      'على عكس الإنجليزي، الإسبانية غالباً بتسيب أداة التعريف مع الأسماء العامة أو المجردة: "Me gusta el café" (بحب القهوة)، مش "Me gusta café".',
    ],
  },
  {
    id: 'irregular-verbs',
    title: 'Key Irregular Verbs',
    titleEs: 'Verbos Irregulares Clave',
    titleAr: 'تصريف الأفعال الشاذة الأساسية',
    summary:
      'These five verbs are used constantly in everyday Spanish, and none of them follow the regular -ar/-er/-ir pattern in the present tense. Learning their conjugations by heart pays off immediately because they show up in almost every sentence.',
    summaryAr:
      'الأفعال الخمسة دي مستخدمة باستمرار في الإسبانية اليومية، ومحدش فيهم بيمشي على النمط المنتظم (-ar/-er/-ir) في المضارع. حفظ تصريفهم غيباً بيفيدك فوراً لأنهم بيظهروا في كل جملة تقريباً.',
    formationNote:
      'Each irregular verb has its own pattern — some change only in "yo" (hacer → hago), others change throughout (ser, ir, estar). Compare them side by side rather than memorizing them in isolation.',
    formationNoteAr: 'كل فعل شاذ ليه نمط خاص بيه — بعضهم بيتغير في "أنا" بس (hacer ← hago)، وبعضهم بيتغير في كل الضمائر (ser، ir، estar). قارنهم مع بعض بدل ما تحفظ كل واحد لوحده.',
    irregularVerbs: [
      {
        infinitive: 'ser (to be — permanent)',
        meaning: 'يكون (صفة دائمة)',
        conjugations: [
          { ...pronouns[0], form: 'soy' },
          { ...pronouns[1], form: 'eres' },
          { ...pronouns[2], form: 'es' },
          { ...pronouns[3], form: 'somos' },
          { ...pronouns[4], form: 'sois' },
          { ...pronouns[5], form: 'son' },
        ],
      },
      {
        infinitive: 'estar (to be — state/location)',
        meaning: 'يكون (حالة أو مكان)',
        conjugations: [
          { ...pronouns[0], form: 'estoy' },
          { ...pronouns[1], form: 'estás' },
          { ...pronouns[2], form: 'está' },
          { ...pronouns[3], form: 'estamos' },
          { ...pronouns[4], form: 'estáis' },
          { ...pronouns[5], form: 'están' },
        ],
      },
      {
        infinitive: 'tener (to have)',
        meaning: 'يمتلك',
        conjugations: [
          { ...pronouns[0], form: 'tengo' },
          { ...pronouns[1], form: 'tienes' },
          { ...pronouns[2], form: 'tiene' },
          { ...pronouns[3], form: 'tenemos' },
          { ...pronouns[4], form: 'tenéis' },
          { ...pronouns[5], form: 'tienen' },
        ],
      },
      {
        infinitive: 'ir (to go)',
        meaning: 'يذهب',
        conjugations: [
          { ...pronouns[0], form: 'voy' },
          { ...pronouns[1], form: 'vas' },
          { ...pronouns[2], form: 'va' },
          { ...pronouns[3], form: 'vamos' },
          { ...pronouns[4], form: 'vais' },
          { ...pronouns[5], form: 'van' },
        ],
      },
      {
        infinitive: 'hacer (to do/make)',
        meaning: 'يعمل / يصنع',
        conjugations: [
          { ...pronouns[0], form: 'hago' },
          { ...pronouns[1], form: 'haces' },
          { ...pronouns[2], form: 'hace' },
          { ...pronouns[3], form: 'hacemos' },
          { ...pronouns[4], form: 'hacéis' },
          { ...pronouns[5], form: 'hacen' },
        ],
      },
    ],
    examples: [
      { es: 'Soy egipcio, pero estoy en España por trabajo.', en: 'I am Egyptian, but I am in Spain for work.', ar: 'أنا مصري، بس أنا في إسبانيا للشغل.' },
      { es: 'Tengo dos hermanos y voy a verlos este fin de semana.', en: 'I have two brothers and I\u2019m going to see them this weekend.', ar: 'عندي أخوين وهروح أشوفهم آخر الأسبوع ده.' },
      { es: '¿Qué haces los domingos?', en: 'What do you do on Sundays?', ar: 'بتعمل إيه أيام الحد؟' },
    ],
    tips: [
      '"Ser" is for identity, origin, and unchanging traits (soy médico, soy de Egipto); "estar" is for temporary states and location (estoy cansado, estoy en casa) — mixing them up is the most common learner mistake.',
      '"Ir a + infinitive" is the everyday way to talk about the near future: "Voy a comer" (I\u2019m going to eat) — you\u2019ll use it more than the future tense in casual speech.',
    ],
    tipsAr: [
      '"ser" بتستخدم للهوية والأصل والصفات الثابتة (soy médico، soy de Egipto)، و"estar" بتستخدم للحالة المؤقتة والمكان (estoy cansado، estoy en casa) — الخلط بينهم هو أشهر غلطة عند المتعلمين.',
      '"ir a + المصدر" هي الطريقة اليومية للتعبير عن المستقبل القريب: "Voy a comer" (هروح آكل) — هتستخدمها أكتر من المستقبل البسيط في الكلام العادي.',
    ],
  },
];
