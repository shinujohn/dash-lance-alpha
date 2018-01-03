import { Database } from "./Database";
import { Logger } from "./Logger";
import { ClientContext } from "./ClientContext";

export class Locator {
    config: any;
    logger: Logger = null;
    database: Database = null;
}

