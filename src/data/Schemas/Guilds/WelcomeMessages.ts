import { model, Schema } from "mongoose";

export interface WelcomeMessage {
  guildId: string;
    channelId: string;
    message: string;
    embed: boolean;
    embed_title: string;
    embed_footer: string;
    embed_thumbnail: string;
    embed_author: string;
    embed_auhor_image: string;
    embed_image: string;
    embed_url: string;
    embed_fields: string[];
}

export default model(
  "Guilds/WelcomeMessages",
  new Schema<WelcomeMessage>({
    guildId: { type: String },
    channelId: { type: String },
    embed: { type: Boolean },
    embed_auhor_image: { type: String },
    embed_author: { type: String },
    embed_fields: [{ type: String }],
    embed_footer: { type: String },
    embed_image: { type: String },
    embed_thumbnail: { type: String },
    embed_title: { type: String },
    embed_url: { type: String },
    message: { type: String },
  })
);
