import { model, Schema } from "mongoose";

export interface Guild {
    guildId: string;
    prefix: string;
    disabledModules: string[];
}

export default model("Guilds/Main", new Schema<Guild>({
    guildId: { type: String },
    prefix: { type: String, default: "." },
    disabledModules: [{ type: String }]
}))