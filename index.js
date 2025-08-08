const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const PREFIX = '-annon';

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === '') {
        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
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
        await message.reply({ content: 'Done', ephemeral: true });
    }
});

client.on('interactionCreate', async interaction => {
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

        await interaction.showModal(modal);
    }

    if (interaction.isModalSubmit() && interaction.customId === 'announcement_modal') {
        const announcementTitle = interaction.fields.getTextInputValue('announcement_title');
        const announcementText = interaction.fields.getTextInputValue('announcement_text');
        const roomId = interaction.fields.getTextInputValue('room_id');

        try {
            const channel = await client.channels.fetch(roomId);
            if (channel) {
                const announcementEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(announcementTitle)
                    .setDescription(announcementText)
                    .setFooter({ text: 'Newera Management', iconURL: 'https://cdn.discordapp.com/attachments/1346320702772613297/1401750175978094693/avtar-ne.png' });


                    await channel.send('||@everyone||');
                await channel.send({ embeds: [announcementEmbed] });
                
                await interaction.reply({ content: 'تم إرسال التعميم بنجاح', ephemeral: true });
            } else {
                await interaction.reply({ content: 'الروم مو موجود', ephemeral: true });
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'حدث خطأ أثناء إرسال التعميم!', ephemeral: true });
        }
    }
});

client.login(process.env.DISCORD_TOKEN);