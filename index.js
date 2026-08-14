require('./server.js')
const {
  Client, GatewayIntentBits, EmbedBuilder,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  ModalBuilder, TextInputBuilder, TextInputStyle,
  StringSelectMenuBuilder
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

// ====== RULES DATA (edit these texts to your server rules) ======
const RULES = {
  discord: "قوانين الديسكورد:\n- يمنع التطرق لأي موضوع سياسي \n- يمنع التطرق لأي موضوع ديني \n- يمنع العنصرية بأي شكل من الأشكال \n- يمنع التواصل مع أي إداري في الخاص فيما يخص أمور السيرفر \n- يجب احترام جميع الإداريين \n- يمنع السب والشتم بجميع أشكاله  \n- ( . ) يمنع إرسال العبارات الغير مفهومه في الشات العام مثل  \n- يمنع إرسال أي رابط في الشات العام \n- يمنع تعدد الحسابات بأي شكل من الأشكال ",  
  important: "القوانين المهمه:\n- العمر المطلوب لدخول السيرفر 16 سنة فما فوق \n- يجب ان يكون اسم الكاراكتر واقعي ولا يبدا ب (ابو) \n- الحرص على جودة المايك \n- يجب تشغيل برنامج التصوير مع الصوت اثناء اللعب ( 20د ) ",
  general: "القوانين العامة:\n- الالتزام بالدور : يجب أن تتصرف شخصيتك في اللعبة كما لو كانت حقيقية ، أي لا تخرج عن الدور أو تتحدث عن أشياء خارج اللعبة (مثل قول اللعبة لاق أثناء مشهد RP) \n- كسر الشخصية (Metagaming) : لا تستخدم معلومات حصلت عليها خارج اللعبة (مثل الديسكورد أو البثوث) داخل اللعبة \n- يمنع القتل العشوائي (RDM) \n- يمنع استخدام المركبات كسلاح (VDM) \n- إجبار الدور التمثيلي (Powergaming ) : مثال إغلاق أي باب بالمركبة \n- الهروب من السيناريوهات لا تخرج من اللعبة أثناء مشهد RP للهروب من الموقف (مثل الاعتقال أو الخسارة) \n- في حال اسقطت يجب عليك التألم لا يمكنك الكلام بطلاقه فيجب عليك التصرف كما لو كنت مصاباً \n- يمنع اهانة الشخص المسقط بأي حال من الأحوال \n- يمنع تقليد ملابس الشرطة اوالاسعاف \n- لا يحق لك تحريك الجثه الا بغرض المساعده \n- يمنع التحلل في سيناريو قائم \n- يمنع التدخل في سيناريو قائم \n- الشخصنه ممنوعه منعا باتا بجميع انواعها \n- يمنع منعا باتا استدراج الشرطة او خطف شرطي اثناء استيقاف مروري \n- يمنع منعا باتا التعرض للمسعف مهما كانت الضروف ومن يخالف ذلك يعرضة الى الباند \n- يمنع تركيب جرافيكس يحذف البحر او الشجر او المباني \n- يمنع سرقة المعدات الشرطة أو الحكومية بـ جميع أنواعها \n- يمنع التحدث بالسياسه والاعراض والدين وايضا المضايقات \n- يمنع تقليد الكركترات والاسماء الموجوده بالسيرفر بأي طريقة كانت \n- يمنع دخول البيت او الشقه اثناء السيناريو \n- يمنع إرتداء او إستعمال اي خوذة اثناء مشاركتك في اي طلق ناري \n- يمنع العودة للسيناريو بعد الإسقاط بأي شكل من الأشكال \n- الكذب بالمسطلحات التالية { سحر او باخذ حبه او صداع والخ } يعرضك للمحاسبة الادارية \n- عند حدوث اعادة تشغيل للسيرفر { اعصار } وكنت تحت رهن الاعتقال يجب عليك الرجوع وتسليم نفسك لمركز \n- يجب الالتزام بالذوق العام في الملابس بشكل كامل \n- لا يسمح بإرتداء عدة الغوص خارج البحر ومن يخالف ذلك سيتم محاسبته \n- يمنع الإحتماء بالمناطق الأمنة \n- يمنع تقليل الاحترام لأي لاعب أو السب والشتم و القذف لأي سبب من الاسباب ",
  safezones: "المناطق الآمنة:\n- مركز الشرطة \n- المستشفى \n- الشقق العامة \n- المطاعم و المقاهي \n- الورش \n- مناطق الوظائف \n- مركز المدينة \n- معارض السيارات \n- حجز المركبات \n- الكازينو إلا في حالة سرقته \n- تشمل جميع مرافقها ",
  crime: "قوانين القتل والجريمة:\n- البوب كات / التوق بوت  : إذا لم تكن ضمن عصابة العدد المسموح به ٤ أشخاص إذا كنت ضمن عصابة العدد المسموح به ٧ ويبدا الفايت بعد إشعار الفعالية ويمنع إكمال الفايت بعد إشعار تم تلويت البوب كات/التوق بوت ويمنع سرقة اي شخص داخل الدائرة ويمنع استدراج الشرطة لداخل الدائرة \n- يمنع يرمي البوب كات في البحر \n- يمنع سرقة اي شخص بدون سبب وعلما يجب ان تسرق أشياء لك معرفه بها مثال (إذا شفت معاه سلاح او شيء رأيته معه )  , يمكنك بدء السيناريو بحوار بعدها طلب وأقل مده للحوار دقيقتين واذا ماعطاك الشي الذي تريده يمكنك سرقته ويمنع عند سرقته اخذ شي لم يتحدث عنه او ليس لديك علم به مثال (شفت شخص معها سلاح وقررت سرقته وعند تفتيشه لقيت معه أشياء أخرى ) في هذي الحالة يمنع عليك اخذ اي شي آخر عدى السلاح \n- الالتزام بالواقع : لا تبدأ إطلاق النار أو السطو دون تخطيط ودور تمثيلي قوي \n- يمنع استخدام البرامج الخارجية (Cheating/Hacking): استخدام أي برامج غش يؤدي إلى الحظر الفوري \n- يمنع سرقة سيارات الشرطة او الاسعاف  \n- يمنع افتعال الفايت من غير سبب \n- يمنع (تلويت) الاشخاص بأي شكل من الاشكال \n- الحد المسموح للحالات المفتوحة (10) فقط  \n- يمنع التوجه الى البحر الا بعد مرور 20 دقيقة من المطاردة \n- ممنوع منعا باتا ترجع في اي سيناريو لاي فايت ان كان فايت عادي عصابات او بوب كات او طيارة الى اخره ",
  theft: "قوانين السرقات والرهائن:\n- بيع الممنوعات 1-2 \n- سرقة الصراف الالي 1-2 \n- سرقة بقاله 1-3 \n- سرقة منزل 1-3 \n- سرقة بوستنق 1-4 \n- سرقة المجوهرات 2-4 \n- سرقة المتحف 2-4 \n- سرقة فليكا 3-5 \n- سرقة البيتا 3-6 \n- سرقة المجوهرات الكبيره 3-6 \n- سرقة بوليتو 4-8 \n- سرقة البنك المركزي 5-9 \n- سرقة القطار 5-9 \n- سرقة البنك مبنى البوب كات 6-10 \n- سرقة هيومن لاب 6-10 \n- سرقة الكازينو 6-12 \n- سرقة الجزيرة 6-15 \n- نقاط مهمه تذكرها جيدا \n- يسمح احتجاز الرهينة كحد أقصى 15 دقيقة لحين بدأ السرقة \n- يحق للمجرم على كل رهينة المطالبة بطلب واحد منطقي مثل الهروب على مركبة معينة او مبلغ لا يزيد عن $2500 \n- يمنع اي تدخل خارجي من خارج أفراد السرقة \n- يمنع اي عمل اجرامي بعد رسالة الرستارت 30 دقيقة  ",
  enmity: "قوانين العداوة:\n- يمنع عليك تكوين عداوه بعد الانتهاء من البوب كات او التوق بوت مايحدث داخل الدائرة يبقى داخل الدائرة \n- يمنع منعاً باتاً اختلاق العداوات بدون سبب \n- لبدا العداوة يجب عليك ان تتحاور مع الطرف الاخر لمدة لا تقل عن ثلاث ايام متلازمة ويجب ان تثبتها بالتصوير \n- يحق لك بدأ العداوة بشكل مباشر في حالة قام الطرف الاخر في عمل اجرامي ضدك ( نصب - قتل ) ",
  police: "قوانين التفاعل مع الشرطة:\n- الاحترام المتبادل : لا تسيء إلى اللاعبين الآخرين سواء داخل اللعبة أو خارجها \n- عدم تحدي الشرطة بطريقة غير واقعية : إذا تمت ملاحقتك، يجب أن يكون لديك سبب منطقي للهروب وعدم التصرف بطريقة انتحارية أو غير منطقية \n- يمنع الاتصال على الشرطة بعد هروبك فهذا فعل غير منطقي ولا يسمح به \n- يمنع افتعال أي عمل مع الشرطة لغرض المطاردة \n- يمنع في أي حاله أن يكون الحل الأول لك الشوت فاير : يجب عليك ممارسة الرول والتخطيط وأن يكون الشوت فاير آخر خيار لك",
  stremar: "قوانين صناعة المحتوى:\n-  NE! وضع اختصار السيرفر في عنوان البث \n- لا يقل عدد البثوث عن 3 بثوث أسبوعيا \n- يمنع نشر محتوى مسيء أو عنصري في الديسكورد أو داخل اللعبة \n- يمنع مناقشة أمور السيرفر في البث "
};
// ================================================================

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// =============== TEXT COMMANDS =================
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // --- existing -annon command ---
  if (message.content.startsWith(PREFIX)) {
    const embed = new EmbedBuilder()
      .setColor(0x00BFFF)
      .setTitle('Newera Announcement')
      .setThumbnail('https://cdn.discordapp.com/attachments/1346320702772613297/1401750175978094693/avtar-ne.png')
      .setFooter({ text: 'Newera Management', iconURL: 'https://cdn.discordapp.com/attachments/1346320702772613297/1401750175978094693/avtar-ne.png' });

    const button = new ButtonBuilder()
      .setCustomId('create_announcement')
      .setLabel(' ')
      .setStyle(ButtonStyle.Primary)
      .setEmoji('📢');

    const row = new ActionRowBuilder().addComponents(button);

    await message.channel.send({ content: '||@everyone||', embeds: [embed], components: [row] });
    return;
  }

  // --- NEW: -rules command posts a dropdown ---
  if (message.content.trim().toLowerCase() === '-rules') {
    const select = new StringSelectMenuBuilder()
      .setCustomId('rules_select')
      .setPlaceholder('يرجى الاختيار')
      .addOptions([
        { label: 'قوانين الديسكورد', value: 'discord', emoji: '💬' },
        { label: 'القوانين المهمه', value: 'important', emoji: '📢' },
        { label: 'القوانين العامة', value: 'general', emoji: '📜' },
        { label: 'المناطق الآمنة', value: 'safezones', emoji: '🛡️' },
        { label: 'قوانين القتل والجريمة', value: 'crime', emoji: '🔫' },
        { label: 'قوانين السرقات والرهائن', value: 'theft', emoji: '💰' },
        { label: 'قوانين العداوة', value: 'enmity', emoji: '⚔' },
        { label: 'قوانين التفاعل مع الشرطة', value: 'police', emoji: '🚔' },
        { label: 'قوانين صناعة المحتوى', value: 'stremar', emoji: '💻' }
          
      ]);

    const row = new ActionRowBuilder().addComponents(select);

    const embed = new EmbedBuilder()
  .setTitle('NewEra RP')
  .setDescription('جميع القوانين التابعة لسيرفر NewEra RP \n نرجوا منك إتباع جميع القوانين لكي لا يتم محاسبتك')
  .setColor(0x00BFFF)
  .setImage('https://cdn.discordapp.com/attachments/1346320702772613297/1403936450587791562/benner_gif.gif?ex=68995d35&is=68980bb5&hm=58481452818f321ec6ea6721c8c426d6c029777d9b75c83cf209f2e4dc270451&');

    await message.channel.send({ embeds: [embed], components: [row] });
  }
});

// =============== INTERACTIONS ==================
client.on('interactionCreate', async (interaction) => {
  // --- dropdown handler (ephemeral reply) ---
  if (interaction.isStringSelectMenu() && interaction.customId === 'rules_select') {
    const key = interaction.values[0];
    const text = RULES[key] ?? 'لا يوجد نص لهذه الفئة حالياً.';
    return interaction.reply({ content: text, ephemeral: true });
  }

  // --- existing button -> modal flow ---
  if (interaction.isButton() && interaction.customId === 'create_announcement') {
    const modal = new ModalBuilder()
      .setCustomId('announcement_modal')
      .setTitle('تعميم جديد');

    const titleInput = new TextInputBuilder()
      .setCustomId('announcement_title')
      .setLabel('عنوان التعميم')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const announcementInput = new TextInputBuilder()
      .setCustomId('announcement_text')
      .setLabel('نص التعميم')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const roomIdInput = new TextInputBuilder()
      .setCustomId('room_id')
      .setLabel('ايدي الروم الي تبيه')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(titleInput);
    const secondActionRow = new ActionRowBuilder().addComponents(announcementInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(roomIdInput);

    modal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    return interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'announcement_modal') {
    const announcementTitle = interaction.fields.getTextInputValue('announcement_title');
    const announcementText = interaction.fields.getTextInputValue('announcement_text');
    const roomId = interaction.fields.getTextInputValue('room_id');

    try {
      const channel = await client.channels.fetch(roomId);
      if (!channel) return interaction.reply({ content: 'الروم مو موجود', ephemeral: true });

      const announcementEmbed = new EmbedBuilder()
        .setColor(0x00BFFF)
        .setTitle(announcementTitle)
        .setDescription(announcementText)
        .setFooter({ text: 'Newera Management', iconURL: 'https://cdn.discordapp.com/attachments/1346320702772613297/1401750175978094693/avtar-ne.png' });

    
      await channel.send({ embeds: [announcementEmbed] });
      return interaction.reply({ content: 'تم إرسال التعميم بنجاح', ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({ content: 'حدث خطأ أثناء إرسال التعميم!', ephemeral: true });
    }
  }
});
console.log("DISCORD_TOKEN موجود:", !!process.env.DISCORD_TOKEN);
console.log("طول التوكن:", process.env.DISCORD_TOKEN?.length || 0);
client.login(process.env.DISCORD_TOKEN);



















