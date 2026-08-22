import { IAddableRoomMember } from '@/features/add-room-member/model/types';
import { IRoomMember } from '@/shared/types/api.types';

/**
 * maps friends to addable room members
 * @param roomMembers
 * @param friends
 * @returns addable friends
 */
export const filterAddableFriends = (
  roomMembers: IRoomMember[],
  friends: IAddableRoomMember[]
) => {
  const memberUUIDs = new Set(roomMembers?.map((member) => member.userId));
  const addableFriends = friends
    .filter((friend) => !memberUUIDs.has(friend.uuid))
    .map(({ uuid, username, friendId, profile_img }) => ({
      uuid,
      username,
      friendId,
      profile_img,
    }));
  return addableFriends;
};
