import { Nepse } from "@rumess/nepse-api";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });
const nepse = new Nepse({ agent });

export { nepse, agent };
