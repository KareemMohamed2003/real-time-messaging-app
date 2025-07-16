import crypto from "crypto";
import fs from "fs";
// Generate an RSA key pair
crypto.generateKeyPair("rsa", {
    modulusLength: 2048, // Length of the key in bits (2048 is standard)
    publicKeyEncoding: {
        type: "spki", // Public Key format
        format: "pem", // PEM encoding format
    },
    privateKeyEncoding: {
        type: "pkcs8", // Private Key format
        format: "pem", // PEM encoding format
    },
}, (err, publicKey, privateKey) => {
    if (err) {
        console.error("Error generating key pair:", err);
        return;
    }
    // Save the keys to files
    fs.writeFileSync("public_key.pem", publicKey);
    fs.writeFileSync("private_key.pem", privateKey);
    console.log("Public and private keys generated and saved as public_key.pem and private_key.pem.");
});
