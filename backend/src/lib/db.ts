import sqlite from "sqlite3";
import { open } from "sqlite";
export const db = await open({
  filename: "./database.db",
  driver: sqlite.Database,
});
export const getUserSession = async (session_id: string) => {
  try {
    const user = await db.get(
      "SELECT * FROM users_sessions where sessionId = ? ",
      [session_id],
    );
    // console.log("user_SESSION", user);
    return user;
  } catch (e) {
    console.log(`error at getUserSession :`, e);
    return false;
  }
};

export const deleteUserSession = async (sessionId: string) => {
  try {
    const expiredSession = await db.run(
      "DELETE FROM users_sessions where sessionId = ? ",
      [sessionId],
    );
    console.log( 'deleted expired session ', expiredSession);
  } catch (e) {
    console.log("error at deleteUserSession(): ", e);
  }
};
export const getSessionBySocketId = async (socketId: string) => {
  try {
    // console.log(`socketId given to getSessionBySocketId`, socketId);
    const userSession = await db.get(
      "SELECT * from users_sessions where socketId = ?",
      [socketId],
    );
    // console.log(`userSession : `, userSession);
    return userSession;
  } catch (e) {
    console.log(`error at getSessionBySocketId () `, e);
    return false;
  }
};
// updates user connection status in sqlite database
export const updatedConnectionStatus = async (
  sessionId: string,
  status: boolean,
) => {
  try {
    const updateUserConnection = await db.run(
      `UPDATE users_sessions set connected = ${status}  where sessionId = ?`,
      [sessionId],
    );
    // console.log("updatedUserConnection", updateUserConnection);
  } catch (e) {
    console.log("error at updateUserConnection :  ", e);
  }
};

export const addUserSession = async (
  socketId: string,
  username: string,
  sessionId: string,
  userId: number,
  connected: boolean,
  expires_at: string,
  profileImg: string,
) => {
  try {
    const insert = await db.run(
      `INSERT INTO users_sessions
      (socketId,
      username,
      userId,
      profileImg,
      sessionId,
      connected,
      expiresAt) 
       values(?,?,?,?,?,?,?)`,
      [
        socketId,
        username,
        userId,
        profileImg,
        sessionId,
        connected,
        expires_at,
      ],
      (err: any) => {
        console.log("err:", err);
      },
    );
    console.log(insert);
  } catch (e) {
    console.log("insertion failed at addUserSession: ", e);
    return false;
  }
};

export const checkDB = async () => {
  try {
    const users = await db.get("SELECT * FROM users_sessions");
    //console.log("checkDB() current  users", users);
  } catch (err: any) {
    console.log("error in listUsersTable() : ", err);
    // console.log(err.message); // "SQLITE_ERROR: no such table: nonexistent_table"
    // console.log(err.code);    // "SQLITE_ERROR"
    // console.log(err.errno);   // 1
    // console.log(err.stack);   // Stack trace
    // Error: SQLITE_ERROR: no such table: users
    const query = `CREATE TABLE IF NOT EXISTS  users_sessions
     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
      username TEXT NOT NULL, socketId TEXT NOT NULL  , 
      userId INTEGER NOT NULL  ,
      profileImg TEXT ,
      connected INTEGER CHECK(connected IN (0, 1)) ,
      sessionId TEXT NOT NULL, expiresAt TEXT NOT NULL)`;
    if (err.message.includes("no such table: users")) {
      const excute = db.exec(query);
    }
  }
};

export const deleteExpiredUsersSessions = () => {
  try {
    const query =
      "DELETE  from users_sessions  where datetime(expiresAt) <= datetime('now')";
    db.run(query);
    // console.log("queryRes", queryRes);
  } catch (e) {
    console.log("error at deleteExpiredUsersSession :", e);
  }
};
// don't forget to close the database when the server disconnects if that's neccessary

export const clearDB = () => {
  try {
    const deleteQuery = db.exec("DELETE * FROM users_sessions");
  } catch (e) {
    console.log("error at clearDB():", e);
  }
};

export const findOnlineFriends = async (friends: []) => {
  // i am trying to implement a query that finds th online friends however there  friends are stored in
  // an array i need to go through each element of the array and  query each friend to check if it matches
  // if he's online or not
  try {
    const placeholders = friends?.map(() => "?").join(", ");
    // console.log("placeholders", placeholders);
    // console.log("friends", friends);
    // extract uuiids from the friends array
    const friendsIDS = friends?.map((friend: any) => friend.friendId);
    console.log("friendsUUIDS", friendsIDS);

    if (!friendsIDS?.length) return null;
    const sql = `select * from users_sessions where userId IN (${placeholders}) AND connected = 1`;
    const friendsQuery = await db.all(sql, friendsIDS);
    console.log("friendsQuery rows returned:", friendsQuery);
    const friendsRes = friendsQuery.map((friend) => ({
      socketId: friend.socketId,
      request_status: "ACCEPTED",
      username: friend.username,
      friendId: friend.userId,
      is_online: friend.connected,
      profile_img: friend.profileImg,
    }));
    return friendsRes;
  } catch (e) {
    console.log("error at findOnlineFriends :", e);
    // return {error:"Error while finding online friends"}
  }
};

// export const findOfflineFriends=async (friends:[]) => {

// }
