import jose from "node-jose";
import bcrypt from "bcryptjs";
import keystore from "./authKeys.js";

export const checkPassword = (password, passowrdHash) => {
  return bcrypt.compareSync(password, passowrdHash);
};

export function encrypt(key, jwt) {
  return jose.JWE.createEncrypt({ contentAlg: "A128GCM" }, key)
    .update(JSON.stringify(jwt))
    .final();
}

export async function signToken(payload) {
  // console.log(
  //   "(await keystore).sign_verify_key",
  //   (await keystore).sign_verify_key,
  // );
  // console.log(
  //   "(await keystore).sign_verify_key.alg",
  //   (await keystore).sign_verify_key.alg,
  // );
  const signedJwt = jose.JWS.createSign((await keystore).sign_verify_key)
    .update(JSON.stringify(payload))
    .final();
  return signedJwt;
}

export async function verifyToken(encryptedToken) {
  try {
    const decryptedToken = await decryptToken(
      encryptedToken,
      (await keystore).enc_dec_key,
    ); // get the decrypted token
    const verifiedToken = await jose.JWS.createVerify(
      (await keystore).sign_verify_key,
    )
      .verify(JSON.parse(decryptedToken))
      .then(
        (result) => {
          return result.payload.toString("utf-8");
        },
        () => {
          return false;
        },
      );
    return verifiedToken;
  } catch (e) {
    console.log("token verification error", e);
    return false;
  }
}

export async function decryptToken(encryptedToken, key) {
  try {
    // console.log("enc_dec_key", key);
    // console.log("encrypted token ", encryptedToken);
    return await jose.JWE.createDecrypt(key)
      .decrypt(encryptedToken)
      .then(
        (token) => {
          return token.payload.toString("utf-8");
        },
        (error) => {
          console.log(error);
          return false;
        },
      );
  } catch (error) {
    console.log(error);
  }
}

export const generateEncryptedJwt = async (payload) => {
  const signingPromise = signToken(payload);
  // console.log("signing promise :", signingPromise);
  const enc_dec_key = (await keystore).enc_dec_key;
  // console.log("payload", payload);
  // console.log("enc_dec_key", enc_dec_key);
  const jwtEncryption = new Promise((resolve, reject) => {
    signingPromise.then(
      (signedJwt) => {
        // console.log("signed jwt : ", signedJwt);
        // console.log("enc_dec_key", enc_dec_key);
        resolve(encrypt(enc_dec_key, signedJwt));
      },
      (error) => reject(error),
    );
  }).catch((error) => {
    console.log(error);
  });

  return jwtEncryption;
};
