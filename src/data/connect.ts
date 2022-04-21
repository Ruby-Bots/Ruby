import mongoose from "mongoose";
import Logger from "../utils/Logger";

export default (uri: string) => {
  mongoose
    .connect(uri)
    .then(() => {
      Logger.info(`Connected to database`, { label: "INFO" });
    })
    .catch((err) => {
      Logger.error(`Failed to connect to database\n${err}`, {
        label: "ERROR",
      });
    });
};
