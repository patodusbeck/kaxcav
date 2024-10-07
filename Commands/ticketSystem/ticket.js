    const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
  const TicketSetup = require('../../Schemas/TicketSetup');
  const config = require('../../config');
 const Discord = require('discord.js');
  
  module.exports = {
    data: new Discord.SlashCommandBuilder()
      .setName('ticket')
      .setDescription('Painel do System Ticket')
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
      .addChannelOption((option) =>
        option
          .setName('channel')
          .setDescription('Selecione o canal onde irá ficar o Setup.')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addChannelOption((option) =>
        option
          .setName('category')
          .setDescription('Selecione a categoria onde será gerado os ticket\'s')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildCategory)
      )
      .addChannelOption((option) =>
        option
          .setName('transcripts')
          .setDescription('Selecione um canal onde ficará os transcripts (log).')
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText)
      )
      .addRoleOption((option) =>
        option
          .setName('handlers')
          .setDescription('Cargo Moderador.')
          .setRequired(true)
      )
      .addRoleOption((option) =>
        option
          .setName('everyone')
          .setDescription('Cargo Everyone (verificado).')
          .setRequired(true)
      )
      .addStringOption((option) =>
        option
          .setName('button')
          .setDescription('Nome do botão.')
          .setRequired(true)
      ),
    async execute(interaction) {
      const { guild, options } = interaction;
      try {
        const channel = options.getChannel('channel');
        const category = options.getChannel('category');
        const transcripts = options.getChannel('transcripts');
        const handlers = options.getRole('handlers');
        const everyone = options.getRole('everyone');
        const button = options.getString('button');
        await TicketSetup.findOneAndUpdate(
          { GuildID: guild.id },
          {
            Channel: channel.id,
            Category: category.id,
            Transcripts: transcripts.id,
            Handlers: handlers.id,
            Everyone: everyone.id,
            Button: button,
          },  
          {
            new: true,
            upsert: true,
          }
        );
        const embed = new Discord.EmbedBuilder()
        .setTitle("Central de Ajuda do Prisma Roleplay")
        .setThumbnail(url="https://media.discordapp.net/attachments/1115114682781544458/1115416326668816434/logo_essenze_v1.png?")
        .setColor('#9a89ad')
        .setDescription('<:Foguete:1081423107488751626> Nessa seção, você pode tirar suas dúvidas, requisitar seu VIP, fazer uma denúncia ou entrar em contato com a nossa Equipe Staff.')
        .setFields(

          { name: '<:__:1051498240392044555> Suporte', value: 'Está precisando de ajuda ou deseja efetuar uma denuncia? Abra um Ticket.' },

          { name: '<:__:1051498240392044555> Horário de Atendimento', value: `**Segunda a Domingo das 08:00 às 23:00**
          Podemos atender fora do horário estipulado mas não é garantido.` },
  
        )
        .setImage(url="https://media.discordapp.net/attachments/1115114682781544458/1125277514487582920/unknown.png?");




        const buttonshow = new ButtonBuilder()
          .setCustomId(button)
          .setLabel("Abrir Ticket")
          .setEmoji("✅")
          .setStyle(ButtonStyle.Secondary);
        await guild.channels.cache.get(channel.id).send({
          embeds: [embed],
          components: [new ActionRowBuilder().addComponents(buttonshow)],
        }).catch(error => {return});
        return interaction.reply({ embeds: [new EmbedBuilder().setDescription('Setup ticket criado com sucesso.').setColor('#9c89ad')], ephemeral: true});
      } catch (err) {
        console.log(err);
        const errEmbed = new EmbedBuilder().setColor('#9c89ad').setDescription(config.ticketError);
        return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
      }
    },
  };
  