import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import { loginAction, registerAction } from "./controllers/controller.js";
import { verifyToken, } from "./lib/auth.js";
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
};
const app = express();
app.use(urlencoded({ extended: true })); // parsed requests bodies .
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json()); // parses json bodies
app.post("/auth/register", registerAction);
app.post("/auth/login", loginAction);
app.get("/get", (req, res) => {
    // database operation endpoint test
    console.log(req.cookies);
    // we can make this a middleware to use each time we want to do operations in our database
    const accessToken = req?.cookies?.chat_accessToken;
    const refreshToken = req?.cookies?.chat_refreshToken;
    if (!accessToken || !refreshToken)
        return res.sendStatus(401); // returns some error if the tokens are not availabe or don't exist
    const decryptedAccessToken = verifyToken(accessToken);
    console.log("decrypted access token ", decryptedAccessToken);
    // console.log(JSON.parse(decryptedRefreshToken))
    // decrypt jwt tokens
    // we may also need to check the  refresh, access  tokens if they are   expired .
    // decrypt the access  token and obtain unique user id and perform the  database opertion
    // we may need to check if the user exists in the database before doing the operation
    //  we need to verify our token we may need a middleware to decrypt and verify our token and check if it exsits
    res.json("done");
});
app.get("/logout", (req, res) => { });
app.listen(3333, () => {
    console.log("server is listening on  http://localhost:3333");
});
