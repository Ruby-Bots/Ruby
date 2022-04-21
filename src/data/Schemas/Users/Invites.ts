import { model, Schema } from "mongoose";

export interface Invite {
  guildId: string;
  userId: string;
  invites: number;
  inviteArray: Array<any>;
}

export default model(
  "Users/Guilds/Invites",
  new Schema<any>({
    guildId: { type: String },
    userId: { type: String },
    invites: { type: Number },
    inviteArray: { type: Array },
  })
);
