import Command from "../../../structures/Command";
import { AddFakeInvites, ListUserInvites, RemoveFakeInvites } from "../functions";

export default new Command({
  name: `invites`,
  description: `🎫 • Manage/Views your own or someone else's invites.`,
  // userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      type: "SUB_COMMAND",
      name: "add",
      description: `🎫 • Add an x amount of fake invites to a user.`,
      options: [
        {
          type: "USER",
          name: "member",
          description: `🎫 • The user`,
          required: true,
        },
        {
          type: "NUMBER",
          name: "amount",
          description: `🎫 • The amount of invites to add`,
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "remove",
      description: `🎫 • Remove an x amount of fake invites to a user.`,
      options: [
        {
          type: "USER",
          name: "member",
          description: `🎫 • The user`,
          required: true,
        },
        {
          type: "NUMBER",
          name: "amount",
          description: `🎫 • The amount of invites to remove`,
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "list",
      description: `🎫 • List all of your or someone else's invites.`,
      options: [
        {
          type: "USER",
          name: `member`,
          description: `🎫 • the member`,
          required: false,
        },
      ],
    },
  ],
  module: "Invite Tracker",
  execute: async ({ ctx, args }) => {
    const subCommand = args.getSubcommand();
    switch (subCommand) {
      case "list":
        await ListUserInvites(ctx, args)
            break;
      case "add":
        await AddFakeInvites(ctx, args)
            break;
      case "remove":
        await RemoveFakeInvites(ctx, args)
            break;
    }
  },
});
