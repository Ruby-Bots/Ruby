import Autoroles from "../../../data/Schemas/Guilds/Autoroles";
import Command from "../../../structures/Command";
import { AddAutoRole, ListAutoRoles, RemoveAutoRole } from "../functions";

export default new Command({
  name: "autoroles",
  description: "🃏 • Manage, List your the servers auto role configuration.",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: "🃏 • Add a new auto role.",
      options: [
        {
          type: "ROLE",
          name: "role",
          description: `🃏 • The role you wish to use`,
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: "🃏 • Remove an old auto role.",
      options: [
        {
          type: "ROLE",
          name: "role",
          description: `🃏 • The role you wish to remove`,
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "list",
      description: "🃏 • List all current auto roles.",
    },
  ],
  module: "Auto Roles",
    execute: async ({ ctx, args }) => {
        const subCommand = args.getSubcommand();
        const AutoRoles = await Autoroles.findOne({ guildId: ctx.guild.id });
        if(!AutoRoles) await Autoroles.create({ guildId: ctx.guild.id })
        switch (subCommand) {
            case "add":
                await AddAutoRole(ctx, args)
                break;
            case "remove":
                await RemoveAutoRole(ctx, args)
                break;
            case "list":
                await ListAutoRoles(ctx)
                break;
        }
  },
});
