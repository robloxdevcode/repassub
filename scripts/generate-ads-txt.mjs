import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const GOOGLE_CERT_ID = "f08c47fec0942fa0";
const DEFAULT_CLIENT = "ca-pub-9505278121058134";

const client =
  process.env.ADSENSE_CLIENT?.trim() ||
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ||
  DEFAULT_CLIENT;
const pubId = client.startsWith("pub-")
  ? client
  : client.replace(/^ca-pub-/i, "pub-");
const body = `google.com, ${pubId}, DIRECT, ${GOOGLE_CERT_ID}\n`;

const publicDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
writeFileSync(join(publicDir, "ads.txt"), body, "utf8");
console.log(`Generated public/ads.txt for ${pubId}`);
