import { MessageActionRow, MessageButton } from "discord.js";

export default new MessageActionRow().addComponents([
  new MessageButton()
    .setLabel("Invite")
    .setStyle("LINK")
    .setURL(`https://bot.rubybots.co/invite`),
  new MessageButton()
    .setLabel("Community")
    .setStyle("LINK")
    .setURL(`https://rubybots.co/community`),
  new MessageButton()
    .setLabel("RubyBots")
    .setStyle("LINK")
    .setURL(`https://rubybots.co/`),
]);