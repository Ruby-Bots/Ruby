import Command from "../../../structures/Command";

export default new Command({
  name: "case",
  description: `🔨 • Manage/View all cases for a user.`,
  module: "Moderation",
  options: [
    {
      type: "SUB_COMMAND",
      name: "list",
      description: `🔨 • List all cases for a user`,
      options: [
        {
          type: "USER",
          name: "member",
          description: "🔨 • Server member",
          required: true,
        },
      ],
    },
    {
      type: "SUB_COMMAND",
      name: "addd",
      description: `🔨 • Add an cases to a user`,
      options: [
        {
          type: "USER",
          name: "member",
          description: "🔨 • Server member",
          required: true,
        },
        {
          type: "STRING",
          name: "reason",
          description: "🔨 • Case reason",
          required: false,
        },
        {
          type: "BOOLEAN",
          name: "moderator",
          description: "🔨 • Show the moderator or not",
          required: false,
        },
      ],
    },
  ],
  execute: async ({ ctx, args, client }) => {
    const subCommand = args.getSubcommand();
    switch (subCommand) {
      case "list":
        break;
      case "add":
        break;
      case "remove":
        break;
    }
  },
});