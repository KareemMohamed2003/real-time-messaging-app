import  jose from 'node-jose';

// Create an empty keystore
const keystore = jose.JWK.createKeyStore();

// Function to generate keys
async function generateKeys() {
    await keystore.generate("oct", 256, { kid: "verify_sign_key" });
    await keystore.generate("oct", 128, { kid: "enc_dec_key" });
}

// Function to get keys
async function getKeys() {
    if (keystore.toJSON().keys.length === 0) {
        await generateKeys(); // Generate keys only if they haven't been generated yet
    }
    
    const enc_dec_key =  keystore.get("enc_dec_key");
    const verify_sign_key =  keystore.get("verify_sign_key");
    
    return { enc_dec_key, verify_sign_key ,keystore};
}

// Export the getKeys function
export default  getKeys ;