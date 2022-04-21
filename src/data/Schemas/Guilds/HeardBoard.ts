import { model, Schema } from "mongoose";

export interface Guild {
  guildId: string;
  channelId: string;
  selfHeart: boolean;
  minimumHeartCount: number;
}

export default model(
  "Guilds/Heardboards",
  new Schema<Guild>({
    guildId: { type: String },
    channelId: { type: String },
    selfHeart: { type: Boolean, default: false },
    minimumHeartCount: { type: Number, default: 1 },
  })
);
