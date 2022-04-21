import { CommandInteractionOptionResolver } from "discord.js";
import Autoroles from "../../data/Schemas/Guilds/Autoroles";
import { RubyEmbed } from "../../structures/Embed";
import { Extendedinteraction } from "../../typings/Classes";
import Logger from "../../utils/Logger";

export const AddAutoRole = async (
  ctx: Extendedinteraction,
  args: CommandInteractionOptionResolver
) => {
  const role = args.getRole("role");
  try {
    const AutoRoles = await Autoroles.findOne({ guildId: ctx.guild.id });
    let alreadyExists = false;
    AutoRoles.roles.forEach((r) => {
      if (r === role.id) {
        alreadyExists = true;
      }
    });
    if (alreadyExists) {
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears <@&${role.id}> is already an auto role!`,
          }),
        ],
      });
    }
    if (AutoRoles.roles.length >= 7) {
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `Currently auto role lists have a maxium of 7 roles per server!`,
          }),
        ],
      });
    }
    await Autoroles.findOneAndUpdate(
      { guildId: ctx.guild.id },
      {
        $push: {
          roles: role.id,
        },
      }
    );

    return ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `<@&${role.id}> has been added to the auto roles list!`,
        }),
      ],
    });
  } catch (err) {
    Logger.error(
      `There was an error adding an auto role | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply().catch() : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error adding <@&${role.id}> to the auto role list`,
        }),
      ],
    });
  }
};

export const RemoveAutoRole = async (
  ctx: Extendedinteraction,
  args: CommandInteractionOptionResolver
) => {
  const role = args.getRole("role");
  try {
    const AutoRoles = await Autoroles.findOne({ guildId: ctx.guild.id });
    let alreadyExists = false;
    AutoRoles.roles.forEach((r) => {
      if (r === role.id) {
        alreadyExists = true;
      }
    });
    if (!alreadyExists) {
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears <@&${role.id}> is doesnt exist in the auto role list!`,
          }),
        ],
      });
    }

    let index;
    AutoRoles.roles.forEach((r) => {
      if (r === role.id) {
        index = AutoRoles.roles.indexOf(r);
      }
    });
    AutoRoles.roles.splice(index, 1);
    AutoRoles.save();

    return ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `<@&${role.id}> has been removed to the auto roles list!`,
        }),
      ],
    });
  } catch (err) {
    Logger.error(
      `There was an error adding an auto role | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply().catch() : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error removing <@&${role.id}> to the auto role list`,
        }),
      ],
    });
  }
};

export const ListAutoRoles = async (ctx: Extendedinteraction) => {
  try {
    const AutoRoles = await Autoroles.findOne({ guildId: ctx.guild.id });
    if (AutoRoles.roles.length < 1) {
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears ${ctx.guild.name} does not have any auto roles setup!`,
          }),
        ],
      });
    }
    ctx.reply({
      embeds: [
        new RubyEmbed({
          author: {
            name: `${ctx.guild.name}'s Auto Roles!`,
            icon_url: ctx.guild.iconURL(),
          },
          description: `${AutoRoles.roles.map((r) => `<@&${r}>`).join(", ")}`,
        }),
      ],
    });
  } catch (err) {
    Logger.error(
      `There was an error adding an auto role | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply().catch() : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error fetching this servers auto roles!`,
        }),
      ],
    });
  }
};
