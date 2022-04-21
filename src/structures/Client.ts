import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from "discord.js"
import { CommandInterface } from "../typings/Classes"
import { ClientConfig, ClientOptions } from "../typings/Client"
import glob from "glob";
import { promisify } from "util";
import Event from "./Event";
import connect from "../data/connect";
import Logger from "../utils/Logger";
import chalk from "chalk";
const globPromise = promisify(glob);

export const importFile = async (filePath: string) => {
  return (await import(filePath))?.default;
};

export default class Ruby extends Client {
  commands: Collection<string, CommandInterface> = new Collection();
  config: ClientConfig = {
      color: "#950035",
      emojis: {
        reply: "<:reply:963030853691244544>",
        right_skip: "<:skip_forward:963030853980651561>",
        left_skip: "<:skip_back:963030853666107442>",
        right_arrow: "<:backwards:963030853489926215>",
        left_arrow: "<:forward:963030853716422716>",
        tick: "✅",
        cross: "❌",
      },
    };;
  constructor(options: ClientOptions) {
    super({
      intents: 32767,
      partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER",
      ],
    });
    this.ClientSetup(options);
    this.login(options.token);
  }

  private async ClientSetup(options: ClientOptions) {
    // Logging in Client & Mongodb 
    connect(options.mongodbUri)
    
    // Command Handler;
    const slashCommands: ApplicationCommandDataResolvable[] = [];
    const CommandFiles: string[] = await globPromise(
      `${__dirname}/../plugins/**/commands/*{.ts,.js}`
    );
    CommandFiles.forEach(async (filePath) => {
      const Command: CommandInterface = await importFile(filePath);
      if (!Command || !Command.name) return;
      this.commands.set(Command.name, Command);
      slashCommands.push(Command)
    });

    this.on("ready", () => {
      if (options.sandBoxServers && options.sandBoxServers.length > 0) {
        options.sandBoxServers.forEach((serverId) => {
          const guild = this.guilds.cache.find(f => f.id === serverId)
          if (!guild) return;
          guild?.commands.set([])
          guild?.commands.set(slashCommands)
          Logger.info(
            `Loaded slash commands in ${chalk.redBright(guild.name)} ${
              guild.id
            }`, { label: "INFO"}
          );
        })
      } else {
        this.application?.commands.set(slashCommands)
      Logger.info(
        `Slash commands have been loaded globally`,
        { label: "INFO" }
      );
      }
    })

    // Event Handler;
    const EventFiles: string[] = []
    await(await globPromise(`${__dirname}/../events/**/*{.ts,.js}`)).forEach(
      (file) => {
        if (file.toLowerCase().includes("process")) return;
        EventFiles.push(file);
      }
    );
    await(
      await globPromise(`${__dirname}/../plugins/**/events/*{.ts,.js}`)
    ).forEach((file) => {
      EventFiles.push(file);
    });
    EventFiles.forEach(async (filePath) => {
      const Event: Event<keyof ClientEvents> = await importFile(filePath);
      if (!Event || !Event.event) return;
      this.on(Event.event, Event.run);
    });
    
  }
}