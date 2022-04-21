import client from "../../..";
import Invites from "../../../data/Schemas/Users/Invites";
import Event from "../../../structures/Event";
import { CheckExpiration } from "../functions";

export default new Event(`inviteCreate`, async (invite) => {
  if (invite.inviter.bot) return;
    let userInvites = await Invites.findOne({ userId: invite.inviter.id, guildId: invite.guild.id });
  if (!userInvites) await Invites.create({ userId: invite.inviter.id, guildId: invite.guild.id });
  userInvites = await Invites.findOne({
    userId: invite.inviter.id,
    guildId: invite.guild.id,
  });
  await CheckExpiration(
    client.guilds.cache
      .find((f) => f.id === invite.guild.id)
      .members.cache.find((f) => f.id === invite.inviter.id)
  );
  if (userInvites.inviteArray.length >= 11) {
    userInvites.inviteArray.splice(0, 1)
    userInvites.save();
  }
    await Invites.findOneAndUpdate(
      { userId: invite.inviter.id, guildId: invite.guild.id },
      {
        invites: (userInvites.invites ? userInvites.invites : 0) + 1,
        $push: {
          inviteArray: {
            code: invite.code,
            expires: Date.now() + invite.maxAge,
            maxAge: invite.maxAge,
            createdAt: invite.createdAt,
          },
        },
      }
    );
})