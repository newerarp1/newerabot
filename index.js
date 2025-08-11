require('./server.js');
const fs = require('fs');
const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  PermissionsBitField
} = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const PREFIX = '-annon';

// Load ticket counter
let counters = {};
if (fs.existsSync('./ticketCounters.json')) {
  counters = JSON.parse(fs.readFileSync('./ticketCounters.json', 'utf8'));
}
function saveCounters() {
  fs.writeFileSync('./ticketCounters.json', JSON.stringify(counters, null, 2));
}

// ====== RULES DATA ======
const RULES = {
   discord: "قوانين الديسكورد:\n- يمنع التطرق لأي موضوع سياسي \n- يمنع التطرق لأي موضوع ديني \n- يمنع العنصرية بأي شكل من الأشكال \n- يمنع التواصل مع أي إداري في الخاص فيما يخص أمور السيرفر \n- يجب احترام جميع الإداريين \n- يمنع السب والشتم بجميع أشكاله  \n- ( . ) يمنع إرسال العبارات الغير مفهومه في الشات العام مثل  \n- يمنع إرسال أي رابط في الشات العام \n- يمنع تعدد الحسابات بأي شكل من الأشكال ",  
  important: "القوانين المهمه:\n- العمر المطلوب لدخول السيرفر 18 سنة فما فوق \n- يجب ان يكون اسم الكاراكتر واقعي ولا يبدا ب (ابو) \n- الحرص على جودة المايك \n- يجب تشغيل برنامج التصوير مع الصوت اثناء اللعب ( 20د ) ",
  general: "القوانين العامة:\n- الالتزام بالدور : يجب أن تتصرف شخصيتك في اللعبة كما لو كانت حقيقية ، أي لا تخرج عن الدور أو تتحدث عن أشياء خارج اللعبة (مثل قول اللعبة لاق أثناء مشهد RP) \n- كسر الشخصية (Metagaming) : لا تستخدم معلومات حصلت عليها خارج اللعبة (مثل الديسكورد أو البثوث) داخل اللعبة \n- يمنع القتل العشوائي (RDM) \n- يمنع استخدام المركبات كسلاح (VDM) \n- إجبار الدور التمثيلي (Powergaming ) : مثال إغلاق أي باب بالمركبة \n- الهروب من السيناريوهات لا تخرج من اللعبة أثناء مشهد RP للهروب من الموقف (مثل الاعتقال أو الخسارة) \n- في حال اسقطت يجب عليك التألم لا يمكنك الكلام بطلاقه فيجب عليك التصرف كما لو كنت مصاباً \n- يمنع اهانة الشخص المسقط بأي حال من الأحوال \n- يمنع تقليد ملابس الشرطة اوالاسعاف \n- لا يحق لك تحريك الجثه الا بغرض المساعده \n- يمنع التحلل في سيناريو قائم \n- يمنع التدخل في سيناريو قائم \n- الشخصنه ممنوعه منعا باتا بجميع انواعها \n- يمنع منعا باتا استدراج الشرطة او خطف شرطي اثناء استيقاف مروري \n- يمنع منعا باتا التعرض للمسعف مهما كانت الضروف ومن يخالف ذلك يعرضة الى الباند \n- يمنع استخدام الجرافيكس والملفات الغير واقعيه بكل انواعها \n- يمنع سرقة المعدات الشرطة أو الحكومية بـ جميع أنواعها \n- يمنع التحدث بالسياسه والاعراض والدين وايضا المضايقات \n- يمنع تقليد الكركترات والاسماء الموجوده بالسيرفر بأي طريقة كانت \n- يمنع دخول البيت او الشقه اثناء السيناريو \n- يمنع إرتداء او إستعمال اي خوذة اثناء مشاركتك في اي طلق ناري \n- يمنع العودة للسيناريو بعد الإسقاط بأي شكل من الأشكال \n- الكذب بالمسطلحات التالية { سحر او باخذ حبه او صداع والخ } يعرضك للمحاسبة الادارية \n- عند حدوث اعادة تشغيل للسيرفر { اعصار } وكنت تحت رهن الاعتقال يجب عليك الرجوع وتسليم نفسك لمركز \n- يجب الالتزام بالذوق العام في الملابس بشكل كامل \n- لا يسمح بإرتداء عدة الغوص خارج البحر ومن يخالف ذلك سيتم محاسبته \n- يمنع الإحتماء بالمناطق الأمنة \n- يمنع تقليل الاحترام لأي لاعب أو السب والشتم و القذف لأي سبب من الاسباب ",
  safezones: "المناطق الآمنة:\n- مركز الشرطة .\n- المستشفى \n- الشقق العامة .\n- المطاعم و المقاهي \n- الورش .\n- مناطق الوظائف \n- مركز المدينة \n- معارض السيارات \n- حجز المركبات \n- الكازينو إلا في حالة سرقته \n- تشمل جميع مرافقها ",
  crime: "قوانين القتل والجريمة:\n- البوب كات / التوق بوت  : إذا لم تكن ضمن عصابة العدد المسموح به ٤ أشخاص إذا كنت ضمن عصابة العدد المسموح به ٧ ويبدا الفايت بعد إشعار الفعالية ويمنع إكمال الفايت بعد إشعار تم تلويت البوب كات/التوق بوت ويمنع سرقة اي شخص داخل الدائرة ويمنع استدراج الشرطة لداخل الدائرة \n- يمنع يرمي البوب كات في البحر \n- يمنع سرقة اي شخص بدون سبب وعلما يجب ان تسرق أشياء لك معرفه بها مثال (إذا شفت معاه سلاح او شيء رأيته معه )  , يمكنك بدء السيناريو بحوار بعدها طلب وأقل مده للحوار دقيقتين واذا ماعطاك الشي الذي تريده يمكنك سرقته ويمنع عند سرقته اخذ شي لم يتحدث عنه او ليس لديك علم به مثال (شفت شخص معها سلاح وقررت سرقته وعند تفتيشه لقيت معه أشياء أخرى ) في هذي الحالة يمنع عليك اخذ اي شي آخر عدى السلاح \n- الالتزام بالواقع : لا تبدأ إطلاق النار أو السطو دون تخطيط ودور تمثيلي قوي \n- يمنع استخدام البرامج الخارجية (Cheating/Hacking): استخدام أي برامج غش يؤدي إلى الحظر الفوري \n- يمنع سرقة سيارات الشرطة او الاسعاف  \n- يمنع افتعال الفايت من غير سبب \n- يمنع (تلويت) الاشخاص بأي شكل من الاشكال \n- الحد المسموح للحالات المفتوحة (10) فقط  \n- يمنع التوجه الى البحر الا بعد مرور 20 دقيقة من المطاردة  ",
  theft: "قوانين السرقات والرهائن:\n- بيع الممنوعات 1-2 \n- سرقة الصراف الالي 1-2 \n- سرقة بقاله 1-3 \n- سرقة منزل 1-3 \n- سرقة بوستنق 1-4 \n- سرقة المجوهرات 2-4 \n- سرقة المتحف 2-4 \n- سرقة فليكا 3-5 \n- سرقة البيتا 3-6 \n- سرقة المجوهرات الكبيره 3-6 \n- سرقة بوليتو 4-8 \n- سرقة البنك المركزي 5-9 \n- سرقة القطار 5-9 \n- سرقة البنك مبنى البوب كات 6-10 \n- سرقة هيومن لاب 6-10 \n- سرقة الكازينو 6-12 \n- سرقة الجزيرة 6-15 \n- نقاط مهمه تذكرها جيدا \n- يسمح احتجاز الرهينة كحد أقصى 15 دقيقة لحين بدأ السرقة \n- يحق للمجرم على كل رهينة المطالبة بطلب واحد منطقي مثل الهروب على مركبة معينة او مبلغ لا يزيد عن $2500 \n- يمنع اي تدخل خارجي من خارج أفراد السرقة \n- يمنع اي عمل اجرامي بعد رسالة الرستارت 30 دقيقة  ",
  enmity: "قوانين العداوة:\n- يمنع عليك تكوين عداوه بعد الانتهاء من البوب كات او التوق بوت مايحدث داخل الدائرة يبقى داخل الدائرة \n- يمنع منعاً باتاً اختلاق العداوات بدون سبب \n- لبدا العداوة يجب عليك ان تتحاور مع الطرف الاخر لمدة لا تقل عن ثلاث ايام متلازمة ويجب ان تثبتها بالتصوير \n- يحق لك بدأ العداوة بشكل مباشر في حالة قام الطرف الاخر في عمل اجرامي ضدك ( نصب - قتل ) ",
  police: "قوانين التفاعل مع الشرطة:\n- الاحترام المتبادل : لا تسيء إلى اللاعبين الآخرين سواء داخل اللعبة أو خارجها \n- عدم تحدي الشرطة بطريقة غير واقعية : إذا تمت ملاحقتك، يجب أن يكون لديك سبب منطقي للهروب وعدم التصرف بطريقة انتحارية أو غير منطقية \n- يمنع الاتصال على الشرطة بعد هروبك فهذا فعل غير منطقي ولا يسمح به \n- يمنع افتعال أي عمل مع الشرطة لغرض المطاردة ",
  stremar: "قوانين صناعة المحتوى:\n-  NE! وضع اختصار السيرفر في عنوان البث \n- لا يقل عدد البثوث عن 3 بثوث أسبوعيا \n- يمنع نشر محتوى مسيء أو عنصري في الديسكورد أو داخل اللعبة \n- يمنع مناقشة أمور السيرفر في البث "
};

// ====== ROLE & CATEGORY IDs ======
const ROLES = {
  owner: '1346213713304223769',
  management: '1347376981490139276',
  headAdmin: '1347371323982217327',
  admin: '1393650082112606258',
  banTeamLeader: '1347371933217591369',
  compTeamLeader: '1347371991249981500',
  banTeam: '1346213713291772023',
  compTeam: '1346213713291772022',
  mod: '1346213713304223766',
  staff: '1347369192189329469',
  supportTeam: '1346213713304223764',
  storeTeam: '1400136007243792436',
  interviewTeam: '1346213713291772020',
  chiefPolice: '1377845629421879351',
  gangMgmt: '1370389785818173532'
};

const CLOSED_CATS = {
  software: '1403527510733492274',
  store: '1403528580352311447',
  content: '1403536064634818711',
  ban: '1403527731748012102',
  comps: '1403527844587372615',
  support: '1403528006852673658',
  active: '1403528082194960586',
  police: '1403528160389107852'
};

const TICKET_CATS = {
  software: '1389768222818959420',
  store: '1403528440493375579',
  content: '1403535861231911102',
  ban: '1389767967008362617',
  comps: '1389765856044777584',
  support: '1389767191494262854',
  active: '1389767525461524581',
  police: '1389767617803456513'
};

// Ticket type config
const ticketTypes = {
  software: { label: 'Software Issue', roles: [ROLES.staff, ROLES.management], cat: TICKET_CATS.software, closed: CLOSED_CATS.software },
  store: { label: 'Store', roles: [ROLES.storeTeam, ROLES.management], cat: TICKET_CATS.store, closed: CLOSED_CATS.store },
  content: { label: 'Content', roles: [ROLES.management], cat: TICKET_CATS.content, closed: CLOSED_CATS.content },
  ban: { label: 'Ban Appeal', roles: [ROLES.banTeam, ROLES.banTeamLeader, ROLES.management], cat: TICKET_CATS.ban, closed: CLOSED_CATS.ban },
  comps: { label: 'Compensation', roles: [ROLES.compTeam, ROLES.compTeamLeader, ROLES.management], cat: TICKET_CATS.comps, closed: CLOSED_CATS.comps },
  support: { label: 'Support', roles: [ROLES.supportTeam, ROLES.management], cat: TICKET_CATS.support, closed: CLOSED_CATS.support },
  active: { label: 'Active Interview', roles: [ROLES.interviewTeam, ROLES.management], cat: TICKET_CATS.active, closed: CLOSED_CATS.active },
  police: { label: 'Police', roles: [ROLES.chiefPolice, ROLES.management], cat: TICKET_CATS.police, closed: CLOSED_CATS.police }
};

// Create ticket panel
async function sendTicketPanel(channel, interviewOnly = false) {
  const embed = new EmbedBuilder()
    .setTitle(interviewOnly ? 'Interview Tickets' : 'NewEra Tickets')
    .setDescription('اضغط على الزر لفتح تذكرة')
    .setImage('https://cdn.discordapp.com/attachments/1346320702772613297/1403936450587791562/benner_gif.gif')
    .setColor(0xFF7A00);

  const buttons = Object.entries(ticketTypes)
    .filter(([key]) => interviewOnly ? key === 'active' : key !== 'active')
    .map(([key, cfg]) =>
      new ButtonBuilder()
        .setCustomId(`create_ticket_${key}`)
        .setLabel(cfg.label)
        .setStyle(ButtonStyle.Primary)
    );

  const rows = [];
  for (let i = 0; i < buttons.length; i += 5) {
    rows.push(new ActionRowBuilder().addComponents(buttons.slice(i, i + 5)));
  }

  await channel.send({ embeds: [embed], components: rows });
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (msg) => {
  if (msg.author.bot) return;
  if (msg.content === '-tickets') sendTicketPanel(msg.channel, false);
  if (msg.content === '-interview') sendTicketPanel(msg.channel, true);

  if (msg.content.startsWith('-rules')) {
    const parts = msg.content.split(' ');
    const ruleKey = parts[1];
    if (RULES[ruleKey]) {
      const embed = new EmbedBuilder().setTitle(`📜 ${ruleKey} Rules`).setDescription(RULES[ruleKey]).setColor(0xFF7A00);
      msg.channel.send({ embeds: [embed] });
    }
  }

  if (msg.content.startsWith(PREFIX)) {
    const announcement = msg.content.slice(PREFIX.length).trim();
    if (announcement) {
      const embed = new EmbedBuilder().setTitle('📢 إعلان').setDescription(announcement).setColor(0xFF7A00);
      msg.channel.send({ embeds: [embed] });
    }
  }
});

client.on('interactionCreate', async (i) => {
  if (i.isButton() && i.customId.startsWith('create_ticket_')) {
    const type = i.customId.replace('create_ticket_', '');
    const cfg = ticketTypes[type];
    if (!cfg) return;

    if (!counters[type]) counters[type] = 1;
    const ticketName = `${cfg.label.replace(/\s/g, '')}-${String(counters[type]).padStart(4, '0')}`;
    counters[type]++;
    saveCounters();

    const ch = await i.guild.channels.create({
      name: ticketName,
      type: 0,
      parent: cfg.cat,
      permissionOverwrites: [
        { id: i.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
        { id: i.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
        ...cfg.roles.map(r => ({ id: r, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }))
      ]
    });

    const embed = new EmbedBuilder()
      .setTitle(`${cfg.label} Ticket`)
      .setDescription('انتظر حتى يأتي أحد أعضاء الفريق للمساعدة')
      .setColor(0x00FF00);

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`claim_${ch.id}`).setLabel('Claim').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId(`close_${ch.id}_${type}`).setLabel('Close').setStyle(ButtonStyle.Danger)
    );

    await ch.send({ content: `<@${i.user.id}>`, embeds: [embed], components: [row] });
    await i.reply({ content: `تم إنشاء التذكرة: ${ch}`, ephemeral: true });
  }

  if (i.isButton() && i.customId.startsWith('claim_')) {
    const chId = i.customId.split('_')[1];
    const ch = i.guild.channels.cache.get(chId);
    if (!ch) return;
    const msg = await ch.messages.fetch({ limit: 1 }).then(m => m.first());
    if (!msg) return;
    const embed = EmbedBuilder.from(msg.embeds[0]).setColor(0xFFFF00).setFooter({ text: `Claimed by ${i.user.tag}` });
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`close_${chId}_${Object.keys(ticketTypes).find(t => ticketTypes[t].cat === ch.parentId)}`).setLabel('Close').setStyle(ButtonStyle.Danger)
    );
    await msg.edit({ embeds: [embed], components: [row] });
    await i.reply({ content: 'تم claim التذكرة', ephemeral: true });
  }

  if (i.isButton() && i.customId.startsWith('close_')) {
    const [, chId, type] = i.customId.split('_');
    const ch = i.guild.channels.cache.get(chId);
    if (!ch) return;
    await ch.setParent(ticketTypes[type].closed);
    await i.reply({ content: 'تم إغلاق التذكرة', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
