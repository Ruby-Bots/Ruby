import { Message, MessageEmbed, TextChannel } from "discord.js";
import client from "../../..";
import HeartBoard from "../../../data/Schemas/Guilds/HeardBoard";
import Event from "../../../structures/Event";

// Code reused and modified from jade.rubybots.co

export default new Event(`messageReactionAdd`, async (reaction, user) => {
  const heartboardData = await HeartBoard.findOne({
    guildId: reaction.message.guild.id,
  });
  if (!heartboardData || !reaction.message.author || reaction.message.author.bot) return; 
    if (reaction.emoji.name === "❤️") {
      if (
        heartboardData.selfHeart === false &&
        reaction.message.author.id === user.id
      )
        return reaction.users.remove(user.id);
      if (
        heartboardData.minimumHeartCount >
        reaction.message.reactions.cache
          .filter((f) => f.emoji.name === "❤️")
          .toJSON()[0].count
      )
        return;
      const message = reaction.message;
      const HeartBoardChannel = reaction.message.guild.channels.cache.find(
        (f) => f.id === heartboardData.channelId
      ) as TextChannel;
      const previousMessages = HeartBoardChannel.messages.fetch({ limit: 100 });
      const previousEmbedFound: Array<Message> = [];
      (await previousMessages)
        .filter((f) => f.embeds.length > 0)
        .forEach((msg) => {
          previousEmbedFound.push(msg);
        });
      let previousEmbed;
      previousEmbedFound.forEach((msg) => {
        if (msg.embeds[0].footer.text.includes(`${reaction.message.id}`)) {
          previousEmbed = msg;
        }
      });
      if (!previousEmbed) {
        const { content, author } = message;
        const embed = new MessageEmbed()
          .setColor(client.config.color)
          .setAuthor({
            name: `${author.tag}`,
            iconURL: author.displayAvatarURL({ dynamic: true }),
          })
          .setFooter({ text: `ID: ${reaction.message.id}` })
          .setDescription(
            `${content ? content : ""}\n\n[**Jump To Message**](${message.url})`
          );
        if (message.attachments) {
          const attachments = [];
          message.attachments.forEach((attachment) => {
            attachments.push(attachment.url);
          });
          if (attachments.length > 0) {
            embed.setImage(`${attachments[0]}`);
          }
        }
        HeartBoardChannel.send({
          content: `❤️ **${
            message.reactions.cache
              .filter((f) => f.emoji.name === "❤️")
              .toJSON()[0].count
          }** | <#${message.channel.id}>`,
          embeds: [embed],
        });
      } else {
        previousEmbed.edit({
          content: `❤️ **${
            message.reactions.cache
              .filter((f) => f.emoji.name === "❤️")
              .toJSON()[0].count
          }** | <#${message.channel.id}>`,
          embeds: [previousEmbed.embeds[0]],
        });
      }
    }
});
 