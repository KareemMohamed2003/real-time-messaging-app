import jose from "node-jose";
import authKeys from "./authKeys.js"


export function encrypt(key, jwt) {
  return jose.JWE.createEncrypt({ contentAlg: "A128GCM" }, key)
    .update(JSON.stringify(jwt))
    .final();
}

export async function signToken(payload) {
  const { verify_sign_key } = await authKeys();
  const signedJwt = jose.JWS.createSign(verify_sign_key)
    .update(JSON.stringify(payload))
    .final();
  return signedJwt;
}

export async function verifyToken(encryptedToken) {
  try {
    const { verify_sign_key, enc_dec_key } = await authKeys();
    const decryptedToken = await decryptToken(encryptedToken, enc_dec_key); // get the decrypted token
    const verifiedToken = jose.JWS.createVerify(verify_sign_key)
      .verify(JSON.parse(decryptedToken.payload))
      .then((result) => {
        return JSON.parse(result.payload.toString("utf-8"));
      })
      .catch((err) => console.log(err));
    return verifiedToken;
  } catch (e) {
    console.log("verification error", e);
  }
}

export async function decryptToken(encryptedToken, key) {
  return jose.JWE.createDecrypt(key)
    .decrypt(encryptedToken)
    .then(
      (token) => {
        return token;
      },
      (error) => {
        console.log(error);
        return false;
      },
    );
}

export const generateEncryptedJwt = async (payload) => {
  const signingPromise = signToken(payload);
  const { enc_dec_key } = await authKeys()
  const jwtEncryption = new Promise((resolve, reject) => {
    signingPromise.then(
      (signedJwt) => {
        resolve(encrypt(enc_dec_key, signedJwt));
      },
      (error) => reject(false),
    );
  }).catch((error) => { });
  return jwtEncryption;
};

