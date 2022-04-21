import { CommandInteractionOptionResolver, GuildMember } from "discord.js";
import Invites from "../../data/Schemas/Users/Invites";
import { RubyEmbed } from "../../structures/Embed";
import { Extendedinteraction } from "../../typings/Classes";
import { NumberFormatter } from "../../utils/Formatters";
import Logger from "../../utils/Logger";

export const CheckExpiration = async (
  member: GuildMember
) => {
  try {
    const invites = await Invites.findOne({ guildId: member.guild.id, userId: member.id })
    if (!invites) return;

    invites.inviteArray.forEach((inv) => {
          let index;
      if(!inv.expires) return;
      if (inv.expires >= Date.now()) {
        index = invites.inviteArray.indexOf(inv)
      }

      if (!index) return;
          invites.inviteArray.splice(index, 1);
    })
    invites.save();

  } catch (err) {
    Logger.error(
      `There was an error checking invite expiration | ${member.guild.name} (${member.guild.id})`,
      { label: "ERROR" }
    );
  }
};

export const ListUserInvites = async (
  ctx: Extendedinteraction,
  args: CommandInteractionOptionResolver
) => {
  try {
    const user = args.getUser("member") || ctx.user;
    const member = ctx.guild.members.cache.find((f) => f.id === user.id);

    if (!member) {
      ctx.replied ? ctx.deleteReply : null;
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `There was an error fetching this users!`,
          }),
        ],
      });
    }
    const invites = await Invites.findOne({
      guildId: ctx.guild.id,
      userId: member.user.id,
    });
    if (!invites) {
      ctx.replied ? ctx.deleteReply : null;
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears this user has no saved invites!`,
          }),
        ],
      });
    }
    await CheckExpiration(member);
    ctx.replied ? ctx.deleteReply : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          author: {
            name: `${member.user.tag}'s Invites`,
            icon_url: member.user.displayAvatarURL({ dynamic: true }),
          },
          description: `This user has a total of **${NumberFormatter(
            invites.invites
          )}** invites\n\n**Recent Invites (10)**:\n${
            invites.inviteArray && invites.inviteArray.length > 1
              ? `>>> ${invites.inviteArray
                  .slice(0, 10)
                  .map(
                    (i) =>
                      `[**${i.code}**](${
                        i.code === "Fake Invite"
                          ? `https://rubybots.co`
                          : `https://discord.gg/${i.code}`
                      })`
                  )
                  .join("\n")}`
              : "Failed to fetch last 10 invites."
          }`,
        }),
      ],
    });
  } catch (err) {
    Logger.error(
      `There was an error listing an users invites | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error fetching this users invites!`,
        }),
      ],
    });
  }
};

export const AddFakeInvites = async (
  ctx: Extendedinteraction,
  args: CommandInteractionOptionResolver
) => {
  try {
    const user = args.getUser("member");
    const amount = args.getNumber("amount");
    const member = ctx.guild.members.cache.find((f) => f.id === user.id);
    if (!member) {
      ctx.replied ? ctx.deleteReply : null;
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `Error fetching this member!`,
          }),
        ],
      });
    }
    const invites = await Invites.findOne({
      guildId: ctx.guild.id,
      userId: member.user.id,
    });
    if (!invites) {
      ctx.replied ? ctx.deleteReply : null;
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears this user has no saved invites already!`,
          }),
        ],
      });
    }
    await CheckExpiration(member)
    const newInvArr = [];
    invites.inviteArray.forEach((invite) => {
      newInvArr.push(invite)
    })
    for (let i = 0; i < amount; i++) {
      newInvArr.push({ code: "Fake Invite" })
    }
    await Invites.findOneAndUpdate({
      guildId: ctx.guild.id,
      userId: member.user.id,
    }, {
      invites: invites.invites + amount,
      inviteArray: newInvArr,
    });
    if (invites.inviteArray.length >= 11) {
      invites.inviteArray.splice(0, 10);
      invites.save();
    }
         const updatedInvites = await Invites.findOne({
           guildId: ctx.guild.id,
           userId: member.user.id,
         });
         ctx.reply({
           embeds: [
             new RubyEmbed({
               description: `Added \`${amount}\` invites to **${member.user.tag}** | **${updatedInvites.invites}** invites left.`,
             }),
           ],
         });
  } catch (err) {
    Logger.error(
      `There was an error adding fake invites | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error adding fake invites to this user!`,
        }),
      ],
    });
  }
};

export const RemoveFakeInvites = async (
  ctx: Extendedinteraction,
  args: CommandInteractionOptionResolver
) => {
  try {
    const user = args.getUser("member");
    const amount = args.getNumber("amount");
    const member = ctx.guild.members.cache.find((f) => f.id === user.id);
    if (!member) {
      ctx.replied ? ctx.deleteReply : null;
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `Error fetching this member!`,
          }),
        ],
      });
    }
    const invites = await Invites.findOne({
      guildId: ctx.guild.id,
      userId: member.user.id,
    });
    if (!invites) {
      ctx.replied ? ctx.deleteReply : null;
      return ctx.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears this user has no saved invites already!`,
          }),
        ],
      });
    }
    await CheckExpiration(member);
    let newInvArr = [];
    invites.inviteArray.forEach((invite) => {
      newInvArr.push(invite);
    });
    if (amount >= invites.inviteArray.length) {
      newInvArr = [];
    } else {
      newInvArr.splice(0, (invites.inviteArray.length - amount));
    }
    await Invites.findOneAndUpdate(
      {
        guildId: ctx.guild.id,
        userId: member.user.id,
      },
      {
        invites: invites.invites - amount < 0 ? 0 : invites.invites - amount,
        inviteArray: newInvArr,
      }
    );
    if (invites.inviteArray.length >= 11) {
      invites.inviteArray.splice(0, 10);
      invites.save();
    }
     const updatedInvites = await Invites.findOne({
       guildId: ctx.guild.id,
       userId: member.user.id,
     });
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `Removed \`${amount}\` invites from **${member.user.tag}** | **${updatedInvites.invites}** invites left.`,
        }),
      ],
    });
  } catch (err) {
    Logger.error(
      `There was an error adding fake invites | ${ctx.guild.name} (${ctx.guild.id})`,
      { label: "ERROR" }
    );

    ctx.replied ? ctx.deleteReply : null;
    ctx.reply({
      embeds: [
        new RubyEmbed({
          description: `There was an error adding fake invites to this user!`,
        }),
      ],
    });
  }
};