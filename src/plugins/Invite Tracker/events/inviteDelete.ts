import client from "../../..";
import Invites from "../../../data/Schemas/Users/Invites";
import Event from "../../../structures/Event";
import { CheckExpiration } from "../functions";

export default new Event(`inviteDelete`, async (invite) => {
  if (!invite.inviter || invite.inviter.bot) return;
  const userInvites = await Invites.findOne({
    userId: invite.inviter.id,
    guildId: invite.guild.id,
  });
  if (!userInvites) return;
  await CheckExpiration(
    client.guilds.cache
      .find((f) => f.id === invite.guild.id)
      .members.cache.find((f) => f.id === invite.inviter.id)
  );
  if (userInvites.inviteArray.length < 1) return;
  await Invites.findOneAndUpdate(
    { userId: invite.inviter.id, guildId: invite.guild.id },
    {
      invites: userInvites.inviteArray.filter((i) => i.code !== invite.code)
        .length,
      inviteArray: userInvites.inviteArray.filter(
        (i) => i.code !== invite.code
      ),
    }
  );
});
