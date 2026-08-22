
import { IFriend } from "@/shared/types/api.types";

// ---------------------------------------------------------------------------
export type MemberStatus = 'online' | 'offline' | 'pending';

export const STATUS_COLOR: Record<MemberStatus, string> = {
  online: '#3fd68c',
  offline: '#6b7280',
  pending: '#f2b544',
};

export const STATUS_LABEL: Record<MemberStatus, string> = {
  online: 'Online',
  offline: 'Offline',
  pending: 'Pending',
};



export interface IAddableRoomMember
  extends Pick<IFriend, 'uuid' | 'username' | 'profile_img' | 'friendId'> {}
