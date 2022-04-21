import Autoroles from "../../../data/Schemas/Guilds/Autoroles";
import Event from "../../../structures/Event";

export default new Event(`guildMemberAdd`, async (member) => {
    const autoRoles = await Autoroles.findOne({ guildId: member.guild.id })
    if (autoRoles) {
        autoRoles.roles.forEach((r) => {
            const role = member.guild.roles.cache.find(role => role.id === r);
            if (!role) { return autoRoles.roles.splice(autoRoles.roles.indexOf(r), 1) };
            member.roles.add(role);
        })
    }
})