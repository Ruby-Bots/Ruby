import { CommandInterface } from "../typings/Classes";

export default class Command {
    constructor(options: CommandInterface) {
        Object.assign(this, options)
    }
}