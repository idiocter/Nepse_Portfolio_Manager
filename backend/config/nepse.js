import { Nepse } from "@rumess/nepse-api";
import https from "https";

const nepse = new Nepse();
const agent = new https.Agent({ rejectUnauthorized: false });

export { nepse, agent };
