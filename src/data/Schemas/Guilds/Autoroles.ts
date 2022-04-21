import { model, Schema } from "mongoose";

export interface AutoRole {
  guildId: string;
  roles: string[]
}

export default model(
  "Guilds/AutoRoles",
  new Schema<AutoRole>({
      guildId: { type: String },
      roles: [{ type: String }]
  })
);
