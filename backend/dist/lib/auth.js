import jose from "node-jose";
export const keystore = jose.JWK.createKeyStore();
keystore.generate("oct", 256, { kid: "verify_sign_key" });
keystore.generate("oct", 128, { kid: "enc_dec_key" });
const enc_dec_key = keystore.get("enc_dec_key");
const verify_sign_key = keystore.get("verify_sign_key");
export function encrypt(key, jwt) {
    return jose.JWE.createEncrypt({ contentAlg: "A128GCM" }, key)
        .update(JSON.stringify(jwt))
        .final();
}
export async function signToken(payload) {
    const signKey = keystore.get("verify_sign_key");
    const signedJwt = jose.JWS.createSign(verify_sign_key)
        .update(JSON.stringify(payload))
        .final();
    return signedJwt;
}
export async function verifyToken(encryptedToken) {
    try {
        const signKey = keystore.get("verify_sign_key");
        const encryptKey = keystore.get("enc_dec_key");
        const decryptedToken = await decryptToken(encryptedToken, enc_dec_key); // get the decrypted token
        const verifiedToken = jose.JWS.createVerify(verify_sign_key)
            .verify(JSON.parse(decryptedToken.payload))
            .then((result) => {
            return JSON.parse(result.payload.toString("utf-8"));
        })
            .catch((err) => console.log(err));
        return verifiedToken;
    }
    catch (e) {
        console.log("verification error", e);
    }
}
export async function decryptToken(encryptedToken, key) {
    return jose.JWE.createDecrypt(key)
        .decrypt(encryptedToken)
        .then((token) => {
        return token;
    }, (error) => {
        console.log(error);
        return false;
    });
}
export const generateEncryptedJwt = (payload) => {
    const signingPromise = signToken(payload);
    const jwtEncryption = new Promise((resolve, reject) => {
        signingPromise.then((signedJwt) => {
            resolve(encrypt(key, signedJwt));
        }, (error) => reject(false));
    }).catch((error) => { });
    return jwtEncryption;
};
