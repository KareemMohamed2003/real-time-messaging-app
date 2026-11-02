import fs from "fs";
import jose from "node-jose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);
const keystoreData = fs.readFileSync(
  path.join(dirname, "keystore.json"),
  "utf-8",
);

const keystore = jose.JWK.asKeyStore(JSON.parse(keystoreData)).then((res) => {
  return {
    sign_verify_key: res.get("sign_verify_key"),
    enc_dec_key: res.get("enc_dec_key"),
  };
});

export default keystore;
