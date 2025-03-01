"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleTokenExpiry = exports.logoutAction = exports.registerAction = exports.loginAction = void 0;
var Users_ts_1 = require("../models/Users.ts");
var auth_js_1 = require("../lib/auth.js");
var loginAction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authenticateUser, oneDay, fiveMins, oneMins, now, fiveMinutesLater, expiresIn7Days, expirationTime, accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("login end point");
                return [4 /*yield*/, (0, Users_ts_1.signInUser)(req.body.credentials)];
            case 1:
                authenticateUser = _a.sent();
                console.log(authenticateUser);
                if (authenticateUser === null || authenticateUser === void 0 ? void 0 : authenticateUser.errorMsg) {
                    return [2 /*return*/, res.json({ success: false, error: authenticateUser.errorMsg })];
                }
                oneDay = 24 * 60 * 60 * 1000;
                fiveMins = 5 * 60 * 1000;
                oneMins = 1 * 60 * 1000;
                now = new Date();
                fiveMinutesLater = new Date(now.getTime() + 5 * 60 * 1000);
                expiresIn7Days = new Date(Date.now() + 7 * oneDay);
                expirationTime = new Date(now.getTime() + oneDay);
                console.log("expiration Time", expirationTime);
                return [4 /*yield*/, (0, auth_js_1.generateEncryptedJwt)(__assign({ it: new Date(), exp: expirationTime }, authenticateUser === null || authenticateUser === void 0 ? void 0 : authenticateUser.user))];
            case 2:
                accessToken = _a.sent();
                res.cookie("chat_accessToken", accessToken, {
                    httpOnly: true,
                    expires: expirationTime,
                    sameSite: "lax",
                    secure: false, //this should be true in production
                });
                return [2 /*return*/, res.json(__assign(__assign({ success: true }, authenticateUser.user), { expires: expirationTime }))];
        }
    });
}); };
exports.loginAction = loginAction;
var registerAction = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, Users_ts_1.registerUser)(req.body.credentials)];
            case 1:
                newUser = _a.sent();
                console.log(newUser);
                if (newUser === null || newUser === void 0 ? void 0 : newUser.errorMsg) {
                    console.log(newUser.errorMsg);
                    res.json({ success: false, error: newUser === null || newUser === void 0 ? void 0 : newUser.errorMsg });
                }
                else if (newUser === null || newUser === void 0 ? void 0 : newUser.user) {
                    res.json({ success: true, error: null });
                    console.log("user has been registered");
                }
                else {
                    res.json({
                        success: false,
                        error: "we are having trouble registerating you please try again later",
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.registerAction = registerAction;
var logoutAction = function (req, res) {
    res.clearCookie("chat_accessToken");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.redirect("http://localhost:3000/login");
};
exports.logoutAction = logoutAction;
var handleTokenExpiry = function (req, res) {
    // this functions logs out user when the token expires
    // we can set the data in the database after that we can check every second if the
    // token expiration time is reached then we logout user we wanna fetch the expiration time once
    // we can do that once the user logs in
    // keep in mind if we request the data every second to check it
    // we will consume  more cpu time which can lead to more consumtion of our quota in TIDB platform
    // we can store the token expiration time  in a file called session_time and read from that file to ensure the token time is  persistant
    // since we are gonna have multiple users signing in to our app we're gonna have sessions
    // everytime a user signs in  to our app we're gonna store  the sessions in the database
    // and fetch the sessions in our handleTokenExpiry on every logIn
    // to check user time we may need a session manager class we will have actions like register , remove , retrieve
    // session
    // when it comes to the session expiration time i'm thinking  we can store the expiration time somewhere in the client side
    // when it expires we just redirect the user to a session expired page and display  a button that will redirect him to the login page
    // i just made a research basically we can't send a  response from the server to the client without any request from the client
    // that's how the request-response model works apparently.
};
exports.handleTokenExpiry = handleTokenExpiry;
