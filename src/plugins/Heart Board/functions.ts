import {
  ButtonInteraction,
  CommandInteractionOptionResolver,
  MessageActionRow,
  MessageSelectMenu,
  TextChannel,
} from "discord.js";
import heartboard from "../../data/Schemas/Guilds/HeardBoard";
import Ruby from "../../structures/Client";
import { RubyEmbed } from "../../structures/Embed";
import { Extendedinteraction } from "../../typings/Classes";
import Logger from "../../utils/Logger";

export const Guide = async (
  ctx: Extendedinteraction,
  client: Ruby,
  args: CommandInteractionOptionResolver
) => {
  try {
    ctx.reply({
      embeds: [
        new RubyEmbed({
          title: `Heartboard Guide!`,
          description: `Here is were you can view all of the Heartboard commands!\n> ( These can also be viewed on the help menu! \`/help\`) \n\n**Commands:**\n\`/heartboard guide:\` This embed!\n\`/heartboard channel:\` Channel the heartboard channel!\n\`/heartboard selfstar:\` Toggle if the heartboard will trigger on self star\n\`/heartboard minimum:\` Change the minimum amount of required stars!\n\`/heartboard config:\` View the current saved data for this guild/server!`,
        }),
      ],
    });
  } catch (err) {
    Logger.error(
      `There was an error showing the heart board guide! | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply().catch() : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error showing the guide!`,
        }),
      ],
    });
  }
};

export const UpdateChannel = async (
  ctx: Extendedinteraction | ButtonInteraction,
  client: Ruby,
  args: CommandInteractionOptionResolver
) => {
  try {
    let dropdowns = [];
    const channels = [];
    ctx.guild.channels.cache
      .filter(
        (f) =>
          f.type === "GUILD_TEXT" &&
          f
            .permissionsFor(ctx.guild.me)
            .has([
              "VIEW_CHANNEL",
              "SEND_MESSAGES",
              "EMBED_LINKS",
              "ATTACH_FILES",
            ])
      )
      .sort((a: TextChannel, b: TextChannel) => a.position - b.position)
      .forEach((channel) => {
        channels.push({
          label: `${channel.name} - ${channel.parent.name || "No category"}`,
          value: `${channel.id}`,
        });
      });
    for (let i = 0; i < channels.length; i++) {
      dropdowns.push(
        new MessageActionRow().addComponents([
          new MessageSelectMenu()
            .addOptions(channels.splice(0, 24))
            .setCustomId(`heartboard_channel_dropdown_id_${i}`),
        ])
      );
    }
    ctx.reply({
      ephemeral: true,
      components: dropdowns,
      embeds: [
        new RubyEmbed({
          title: `Heartboard Channel!`,
          description: `Please select one of the channels below, once selected it will be set as the channel were the actual heartboard messages go!`,
        }),
      ],
    });
    let channelId;
    const collector = ctx.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
    });
    collector.on("collect", (i) => {
      if (i.user.id !== ctx.user.id || i.user.bot)
        return i.reply({
          embeds: [
            new RubyEmbed({
              description: `This prompt can only be ran by **${ctx.user.tag}**`,
            }),
          ],
        });
      channelId = `${i.values[0]}`;
      return collector.stop("end");
    });
    collector.on("end", async (c, r) => {
      if (r.toLowerCase() === "end") {
        await heartboard.findOneAndUpdate(
          { guildId: ctx.guild.id },
          {
            channelId: channelId,
          }
        );
        const channel = ctx.guild.channels.cache.find(
          (f) => f.id === channelId
        );
        ctx.editReply({
          components: [],
          embeds: [
            new RubyEmbed({
              description: `heartboard channel has been updated to **${channel.name}** *(${channel.id})*`,
            }),
          ],
        });
      }
    });
  } catch (err) {
    Logger.error(
      `There was an error collecting an heartboard channel | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply().catch() : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error collecting this channel!`,
        }),
      ],
    });
  }
};
