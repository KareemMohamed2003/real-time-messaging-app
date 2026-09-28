import fs from "fs";
import jose from "node-jose";

async function generateAndStoreKeys() {
  // Create a new keystore
  const keystore = jose.JWK.createKeyStore();

  // Generate an encryption/decryption key (AES 256)
  await keystore.generate("oct", 128, {
    // alg: "A256GCM", // AES GCM for encryption
    // alg: "A128GCM",
    // use: "enc", // Use for encryption
    kid: "enc_dec_key", // Key ID
  });

  // Generate a signing/verification key (RSA 2048)
  await keystore.generate("oct", 256, {
    // alg: "RS256", // RSA with SHA-256 for signing
    // alg: "A128GCM",
    // use: "sig", // Use for signing
    kid: "sign_verify_key", // Key ID
  });

  // Convert keystore to JSON format
  const keystoreJSON = keystore.toJSON(true); // `true` includes private keys

  // Save to a file
  fs.writeFileSync("keystore.json", JSON.stringify(keystoreJSON, null, 2));

  console.log("Keys have been generated and saved to keystore.json");
}

generateAndStoreKeys();
