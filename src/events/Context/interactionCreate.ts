import { CommandInteractionOptionResolver } from "discord.js";
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

      try {
        command.execute({
          args: interaction.options as CommandInteractionOptionResolver,
          client: client,
          ctx: interaction,
        });
      } catch (err) {
          Logger.error(`Failed to run command "${command.name}"\n${err}`, { label: "ERROR" })
          interaction.replied ? interaction.deleteReply() : null;
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
