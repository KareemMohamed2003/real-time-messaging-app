export const handleFriendRequestError = (type: string) => {
  switch (type) {
    case "SELF_REQUEST":
      throw {
        success: false,
        msg: "user attempted to send request to himself",
      };
    case "ALREADY_FRIENDS":
      throw {
        success: false,
        msg: `users  are already  friends`,
      };
    case "USER_NOT_FOUND":
      throw { success: false, msg: "user doesn't exist" };
  }
  // default:

  // return error;
};
