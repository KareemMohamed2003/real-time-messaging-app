"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var cookie_parser_1 = require("cookie-parser");
var express_2 = require("express");
var authController_ts_1 = require("./controllers/authController.ts");
var dbController_ts_1 = require("./controllers/dbController.ts");
var middleware_ts_1 = require("./lib/middleware.ts");
var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true, //access-control-allow-credentials:true
};
var app = (0, express_1.default)();
app.use((0, express_2.urlencoded)({ extended: true })); // parsed requests bodies .
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // parses json bodies
app.post("/auth/register", authController_ts_1.registerAction);
app.post("/auth/login", authController_ts_1.loginAction);
app.get("/auth/logout", authController_ts_1.logoutAction);
app.post("/add_friend", middleware_ts_1.authorizeUser, dbController_ts_1.addFriend);
app.get("/users/me", middleware_ts_1.authorizeUser, dbController_ts_1.getUserAction);
app.listen(3333, function () {
    console.log("server is listening on  http://localhost:3333");
});
// app.get("/auth/refresh_token", (req: Request, res: Response) => {
//   //client app will request a refresh token
// });
// mayber these routes should be prefixed by app or something to indicate they re used for app functionailtes
// app.get("/profile", authorizeToken); //  this route was for testing purposes to test a middleware function to verify a token
