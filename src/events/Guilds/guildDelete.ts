import GuildMain from "../../data/Schemas/Guilds/GuildMain";
import Event from "../../structures/Event";
import Logger from "../../utils/Logger";

export default new Event(`guildDelete`, async (guild) => {
    try {
        await GuildMain.findOneAndRemove({ guildId: guild.id })
    } catch (err) {
        Logger.error(`Failed to remove guild data | ${guild.id}`, {label: "ERROR"})
    }
})