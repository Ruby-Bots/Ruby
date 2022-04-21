import client from "../..";
import Event from "../../structures/Event";
import Logger from "../../utils/Logger";

export default new Event(`ready`, () => {
  try {
        client.user.setActivity(`/help • bot.rubybots.co`);
        Logger.info(`Client has been logged online | ${client.user.tag}`, {label: "INFO"})
    } catch (err) {
      console.log(err)
      Logger.error(`Failed on bot start up!`, {
        label: "ERROR",
      });
    }
})