import { ColorResolvable, MessageEmbed, MessageEmbedOptions } from "discord.js";
import client from "..";

export class RubyEmbed {
    constructor(data?: MessageEmbedOptions) {
      const color = (data.color || client.config.color) as ColorResolvable;
        return new MessageEmbed({
          color: color,
          ...data,
        });
    }
}