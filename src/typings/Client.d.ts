import { ColorResolvable } from "discord.js";

export interface ClientOptions {
    token: string;
    mongodbUri: string;
    sandBoxServers?: string[];
    invite?: string;
    supportUrl?: string;
    defaultPrefix?: string;
}

export type ClientConfig = {
    color: ColorResolvable;
    emojis: Object;
}