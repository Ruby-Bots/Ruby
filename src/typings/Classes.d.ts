// Commands
import { ChatInputApplicationCommandData, CommandInteraction, CommandInteractionOptionResolver, Message, PermissionResolvable } from "discord.js";
import Ruby from "../structures/Client";

export interface Extendedinteraction extends CommandInteraction {
  member: GuildMember;
}

export interface CommandOptions {
    ctx: Extendedinteraction;
    args: CommandInteractionOptionResolver;
    client: Ruby;
}

export type CommandExecute = (options: CommandOptions) => any;

export type CommandInterface = {
  name: string;
  description: string;
  module: string;
  expectedArgs?: string[];
  userPermissions?: PermissionResolvable[];
  botPermissions?: PermissionResolvable[];
  private?: boolean;
  guilds?: string[];
  execute: CommandExecute;
} & ChatInputApplicationCommandData;