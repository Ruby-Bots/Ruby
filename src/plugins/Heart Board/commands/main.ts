import Heartboard from "../../../data/Schemas/Guilds/HeardBoard";
import Command from "../../../structures/Command";
import { RubyEmbed } from "../../../structures/Embed";
import { Guide, UpdateChannel } from "../functions";
export default new Command({
  name: `heartboard`,
  description: `📌 • Manage the server's heartboard!`,
  module: "Heartboard",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "SUB_COMMAND",
      description: `📌 • Heartboard information/guide!`,
      name: "guide",
    },
    {
      type: "SUB_COMMAND",
      description: `📌 • Change/Set the heartboard channel!`,
      name: "channel",
    },
    {
      type: "SUB_COMMAND",
      description: `📌 • Toggle if the heartboard should go off on a self ( message author ) heart!`,
        name: "selfheart",
      options: [ { type: "BOOLEAN", name: "value", description: `📌 | True/False`, required: true}]
    },
    {
      type: "SUB_COMMAND",
      description: `📌 • The minimum amount of required hearts! **Cap: 25**`,
        name: "minimum",
      options: [{ type: "NUMBER", name: "cap", description: `📌 | 1 - 25`, minValue: 1, maxValue: 25, required: true}]
    },
    {
      type: "SUB_COMMAND",
      description: `📌 • View the current heartboard config!`,
      name: "config",
    },
  ],
  execute: async ({ ctx, client, args }) => {
      const subCommand = args.getSubcommand();
      let heartBoardData = await Heartboard.findOne({ guildId: ctx.guild.id });
      if (!heartBoardData) await Heartboard.create({ guildId: ctx.guild.id });
      heartBoardData = await Heartboard.findOne({ guildId: ctx.guild.id });
      switch (subCommand) {
          case "guide":
              Guide(ctx, client, args)
          break;
          case "channel":
              UpdateChannel(ctx, client, args)
          break;
          case "selfheart":
              const val = args.getBoolean("value")
              if (val === heartBoardData.selfHeart) {
                return ctx.reply({
                  ephemeral: true,
                  embeds: [
                    new RubyEmbed({
                      description: `Self heart is already set to \`${val}\``,
                    }),
                  ],
                });
              }
              await Heartboard.findOneAndUpdate({ guildId: ctx.guild.id }, { selfHeart: val })
              ctx.reply({ ephemeral: true, embeds: [new RubyEmbed({ description: `Self heart's value has been set to \`${val}\``})]})
          break;
          case "minimum":
              const num = args.getNumber("cap")
              if (num !== heartBoardData.minimumHeartCount) {
                await Heartboard.findOneAndUpdate(
                  { guildId: ctx.guild.id },
                  { minimumHeartCount: num }
                );
              }
              ctx.reply({
                ephemeral: true,
                embeds: [
                  new RubyEmbed({
                    description: `The minium heart amount has been set to \`${num}\``,
                  }),
                ],
              });
              break; 
          case "config":
              const channel = ctx.guild.channels.cache.find(
                (c) => c.id === heartBoardData.channelId
              );
              ctx.reply({
                ephemeral: true,
                embeds: [
                  new RubyEmbed({
                    description: `**Heart Board Config** • ${
                      ctx.guild.name
                    } *(${ctx.guild.id})*\n\n>>> \`\`\`json\nChannel: "${
                      channel
                        ? `${channel.name} (${channel.id})`
                        : "No channel!"
                    }"\nSelf Heart: "${
                      heartBoardData.selfHeart || "false"
                    }"\nMinimum Heart Count: "${
                      heartBoardData.minimumHeartCount || 1
                    }"\n\`\`\``,
                  }),
                ],
              });
              break;
      }
  },
});
