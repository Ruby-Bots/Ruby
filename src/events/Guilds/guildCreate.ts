import GuildMain from "../../data/Schemas/Guilds/GuildMain";
import Event from "../../structures/Event";
import Logger from "../../utils/Logger";

export default new Event(`guildCreate`, async (guild) => {
    try {
        await GuildMain.create({ guildId: guild.id });
    } catch (err) {
         Logger.error(`Failed to create guild data | ${guild.id}`, {label: "ERROR"})
    }
})