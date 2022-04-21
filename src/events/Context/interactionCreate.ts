import {
  CommandInteractionOptionResolver,
  MessageActionRow,
  MessageButton,
  PermissionResolvable,
} from "discord.js";
import client from "../..";
import { RubyEmbed } from "../../structures/Embed";
import Event from "../../structures/Event";
import LinkButtons from "../../utils/LinkButtons";
import Logger from "../../utils/Logger";

export default new Event(`interactionCreate`, (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command)
      return interaction.reply({
        components: [LinkButtons],
        embeds: [
          new RubyEmbed({
            description:
              "It appears this command does not exist? If you believe this is a mistake please contact support",
          }),
        ],
        ephemeral: true,
      });
    const member = interaction.guild.members.cache.find(
      (f) => f.id === interaction.user.id
    );
    try {
      if (
        !interaction.guild.me.permissions.has(
          command.botPermissions || [
            "VIEW_CHANNEL",
            "SEND_MESSAGES",
            "EMBED_LINKS",
          ]
        )
      ) {
        if (
          !interaction.guild.me.permissions.has(
            ["VIEW_CHANNEL"] || ["VIEW_CHANNEL", "SEND_MESSAGES"]
          )
        )
          return;
        if (
          interaction.guild.me.permissions.has(["SEND_MESSAGES"]) &&
          !interaction.guild.me.permissions.has(["EMBED_LINKS"])
        ) {
          interaction.replied ? interaction.deleteReply().catch() : null;
          interaction.reply({ content: `It appears that ruby is missing its minimum required permissions! Please invite it using the button below!`, components: [new MessageActionRow().addComponents([new MessageButton().setLabel("Invite").setStyle("LINK").setURL("https://bot.rubybots.co/invite")])]})
        }
        if (
          interaction.guild.me.permissions.has(["SEND_MESSAGES"]) &&
          interaction.guild.me.permissions.has(["EMBED_LINKS"])
        ) {
          interaction.replied ? interaction.deleteReply().catch() : null;
          interaction.reply({
            embeds: [
              new RubyEmbed({
                description: `It appears that ruby is missing its minimum required permissions! Please invite it using the button below!`,
              }),
            ],
            components: [
              new MessageActionRow().addComponents([
                new MessageButton()
                  .setLabel("Invite")
                  .setStyle("LINK")
                  .setURL("https://bot.rubybots.co/invite"),
              ]),
            ],
          });
        }
      }
      if (!member.permissions.has(command.userPermissions || [])) {
        interaction.replied ? interaction.deleteReply().catch() : null;
        interaction.reply({
          embeds: [
            new RubyEmbed({
              description: `It appears you are missing the required permissions to use this command!`,
            }),
          ],
        });
      }
      command.execute({
        args: interaction.options as CommandInteractionOptionResolver,
        client: client,
        ctx: interaction,
      });
    } catch (err) {
      Logger.error(`Failed to run command "${command.name}"\n${err}`, {
        label: "ERROR",
      });
      interaction.replied ? interaction.deleteReply().catch() : null;
      interaction.reply({
        embeds: [
          new RubyEmbed({
            description: `It appears there was an error running this command! This has been reported to ruby's core team.`,
          }),
        ],
      });
    }
  }
});
