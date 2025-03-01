"use strict";
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
exports.acceptFriendRequest = exports.sendFriendRequest = void 0;
var prisma_ts_1 = require("../prisma/prisma.ts");
// search for the user the user wants to send a request to
// if that user exists add to the friends table a friend ship request status
// between the two users
// when the other user accepts it chang the table
// `sendFriendRequest`
//check if the user exists if not return an Error or null;
// the condition to check if two users are friends or not should be like the following
// case 1:
// check if the sender has the reciever's name  in the friend_name column in the same record which means there was an invite sent before
// case 2:
// or in case the user who sent the friend request  is in  the friend_name column and he wants to
//invite the orignal sender (username  column) to
// be friends  with then we reverse the first condition pretty much    we check if that user
// username (sender in this case )is the original  reciever  meaning he is in the friend_name columns
var sendFriendRequest = function (sender, recipientName) { return __awaiter(void 0, void 0, void 0, function () {
    var recipientRecord, senderRecord, friendsRecord;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("sender ", sender, "recipentName :", recipientName);
                if (sender == recipientName) {
                    return [2 /*return*/, {
                            success: false,
                            msg: "user attempted to send request to himself",
                        }];
                }
                return [4 /*yield*/, prisma_ts_1.prisma.users.findUnique({
                        where: { username: recipientName },
                    })];
            case 1:
                recipientRecord = _a.sent();
                console.log("recipientRecord record", recipientRecord);
                return [4 /*yield*/, prisma_ts_1.prisma.users.findFirst({
                        where: { username: sender },
                    })];
            case 2:
                senderRecord = _a.sent();
                return [4 /*yield*/, prisma_ts_1.prisma.friends.findFirst({
                        where: {
                            OR: [
                                { username: recipientName, friend_name: sender },
                                { friend_name: recipientName, username: sender },
                            ],
                        },
                    })];
            case 3:
                friendsRecord = _a.sent();
                console.log("friends Record", friendsRecord);
                if (friendsRecord === null || friendsRecord === void 0 ? void 0 : friendsRecord.friendship_status) {
                    return [2 /*return*/, {
                            success: false,
                            msg: "users  are already  friends",
                        }];
                }
                if (!recipientRecord) {
                    console.log("receipent condition");
                    return [2 /*return*/, { success: false, msg: "user doesn't exist" }];
                }
                if (!!friendsRecord) return [3 /*break*/, 5];
                console.log("friends Record condition");
                return [4 /*yield*/, prisma_ts_1.prisma.friends
                        .create({
                        data: {
                            username: sender,
                            email: senderRecord.email,
                            friend_name: recipientRecord.username,
                            friendId: recipientRecord.uuid,
                            friend_request: "SENT", // this was probably set to tiny int
                            friendship_status: false, // this was set to boolean in the last migration .
                            userId: senderRecord.id,
                        },
                    })
                        .then(function () { return ({
                        success: true,
                        msg: "friend request sent",
                    }); }, function (error) {
                        console.log("error with creating a new friends record");
                        console.log(error);
                        return { success: false, msg: "something went wrong" };
                    })];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                if (!((friendsRecord === null || friendsRecord === void 0 ? void 0 : friendsRecord.friend_name) === sender)) return [3 /*break*/, 7];
                return [4 /*yield*/, (0, exports.acceptFriendRequest)(friendsRecord === null || friendsRecord === void 0 ? void 0 : friendsRecord.friend_name)];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.sendFriendRequest = sendFriendRequest;
var acceptFriendRequest = function (receiver) { return __awaiter(void 0, void 0, void 0, function () {
    var recordId, friendsRecord, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, prisma_ts_1.prisma.friends
                        .findFirst({
                        where: {
                            OR: [{ friend_name: receiver }, { username: receiver }],
                        },
                    })
                        .then(function (res) { return res === null || res === void 0 ? void 0 : res.id; })];
            case 1:
                recordId = _a.sent();
                console.log("friends record id", recordId);
                return [4 /*yield*/, prisma_ts_1.prisma.friends
                        .update({
                        where: {
                            id: recordId,
                        },
                        data: { friend_request: "ACCEPTED", friendship_status: true },
                    })
                        .then(function () { return ({ success: true, msg: "Friendship established" }); })];
            case 2:
                friendsRecord = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log("something went wrong : acceptFriendRequest");
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.acceptFriendRequest = acceptFriendRequest;
// check if the requested friend exists in the friends table or do i just check if the user exists
