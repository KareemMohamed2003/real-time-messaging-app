export type UserRole = 'ADMIN' | 'OWNER' | 'MEMBER';
export type ChannelType = 'TEXT' | 'VOICE' | 'DIRECT_MESSAGE';
export type FriendRequestEnum = 'SENT' | 'REJECTED' | 'ACCEPTED';

export interface User {
  id: number;
  username: string;
  email: string;
  uuid: string;
  profile_img: string | null;
  // createdAt: Date;
  // status: number;
}

export interface ChannelParticipant {
  id: number;
  channelId: number;
  userId: string;
  joinedAt: Date;
}

export interface IFriend {
  id: number;
  createdAt: Date;
  senderName: string;
  receiverId: number;
  email: string;
  receiverName: string;
  request_status: FriendRequestEnum;
  senderId: number;
}

export interface TMessage {
  id: number | null;
  channelId: number;
  senderUUID: string;
  message: string;
  createdAt?: Date;
  receiverUUID?: string;
}

export interface Notification {
  notificationId: number;
  notificationType: string;
  senderId: string;
  receiverId: string;
  message: string;
  entity: string;
  entityId: string;
  createdAt: Date;
}

export interface TChannel {
  channelId: number;
  roomUUID: string;
  channelName: string;
  type: ChannelType;
  messages?: any[];
}

export interface IRoom {
  roomName: string;
  roomUUID: string;
  ownerId?: string;
  icon?: string; // Prisma Maps Bytes to Node.js Buffer replace with a string later if suitable
}

export interface IRoomMember {
  roomUUID: string;
  userId: string;
  role: UserRole;
}
