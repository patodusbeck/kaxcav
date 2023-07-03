const {ChannelType, ButtonInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits} = require('discord.js');
const TicketSchema = require('../../Schemas/Ticket');
const discord = require('discord.js')
const TicketSetup = require('../../Schemas/TicketSetup');
const config = require('../../config');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        const {guild, member, customId, channel} = interaction;
        const {ViewChannel, SendMessages, ManageChannels, ReadMessageHistory} = PermissionFlagsBits;
        const ticketId = Math.floor(Math.random() * 9000) + 10000;
        if (!interaction.isButton()) return;
        const data = await TicketSetup.findOne({GuildID: guild.id});
        if (!data) return;
        if (!data.Button.includes(customId)) return;
        const alreadyticketEmbed = new EmbedBuilder().setDescription(config.ticketAlreadyExist).setColor('#9c89ad')
        const findTicket = await TicketSchema.findOne({GuildID: guild.id, OwnerID: member.id});
        if (findTicket) return interaction.reply({embeds: [alreadyticketEmbed], ephemeral: true}).catch(error => {return});
        if (!guild.members.me.permissions.has(ManageChannels)) return interaction.reply({content: 'Sem permissões', ephemeral: true}).catch(error => {return});
        try {
            await guild.channels.create({
                name: config.ticketName + ticketId,
                type: ChannelType.GuildText,
                parent: data.Category,
                permissionOverwrites: [
                    {
                        id: interaction.user.id,
                        allow: [discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: data.Everyone,
                        allow: [discord.PermissionFlagsBits.SendMessages, discord.PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: interaction.guild.roles.everyone,
                        deny: [discord.PermissionFlagsBits.ViewChannel],
                    },
                    //{
                    //    id: data.Everyone,
                    //    deny: [ViewChannel, SendMessages, ReadMessageHistory],
                   // },
                 //   {
                 //       id: data.Handlers,
                //        allow: [ViewChannel, SendMessages, ReadMessageHistory, ManageChannels],
                  //  },
                   // {
                   //     id: member.id,
                   //     allow: [ViewChannel, SendMessages, ReadMessageHistory],
                   // },
                ],
            }).catch(error => {return}).then(async (channel) => {
                await TicketSchema.create({
                    GuildID: guild.id,
                    OwnerID: member.id,
                    MemberID: member.id,
                    TicketID: ticketId,
                    ChannelID: channel.id,
                    Locked: false,
                    Claimed: false,
                });
                await channel.setTopic(config.ticketDescription + ' <@' + member.id + '>').catch(error => {return});
                //const embed = new EmbedBuilder().setTitle(config.ticketMessageTitle).setDescription(config.ticketMessageDescription)
                const embed = new EmbedBuilder()
                .setTitle(config.title)
                .setThumbnail(url="https://media.discordapp.net/attachments/1115114682781544458/1115416326668816434/logo_essenze_v1.png?")
                .setColor(config.color)
                .setDescription(`<:users:1096647887422759024> **Usuário:** ${interaction.user}\n <:Reply:1093347552444825620> ${interaction.user.id}\n📜 **Como podemos ajudá-lo? Nos conte abaixo.**`)
                const button = new ActionRowBuilder().setComponents(
                    new ButtonBuilder().setCustomId('ticket-close').setLabel(config.ticketClose).setStyle(ButtonStyle.Secondary).setEmoji(config.ticketCloseEmoji),
                    new ButtonBuilder().setCustomId('ticket-manage').setLabel(config.ticketManage).setStyle(ButtonStyle.Secondary).setEmoji(config.ticketManageEmoji),
                    new ButtonBuilder().setCustomId('ticket-claim').setLabel(config.ticketClaim).setStyle(ButtonStyle.Success).setEmoji(config.ticketClaimEmoji),
                );
                channel.send({embeds: ([embed]),components: [button]}).catch(error => {return});
                const handlersmention = await channel.send({content : '<@&' + data.Handlers + '>'});
                handlersmention.delete().catch(error => {return});
                const ticketmessage = new EmbedBuilder().setColor("#9c89ad").setDescription(config.ticketCreate + ' <#' + channel.id + '>').setColor('#9a89ad');
                interaction.reply({embeds: [ticketmessage], ephemeral: true}).catch(error => {return});
            })
        } catch (err) {
            return console.log(err);
        }

    }
}