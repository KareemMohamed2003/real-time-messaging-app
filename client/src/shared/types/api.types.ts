export enum UserRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  MEMBER = 'MEMBER',
}

export enum ChannelType {
  TEXT = 'TEXT',
  VOICE = 'VOICE',
  DIRECT_MESSAGE = 'DIRECT_MESSAGE',
}

export enum FriendRequestEnum {
  SENT = 'SENT',
  REJECTED = 'REJECTED',
  ACCEPTED = 'ACCEPTED',
}

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
  friendId: number;
  profile_img: string;
  senderName: string;
  request_status: FriendRequestEnum;
  isRequestSender: boolean;
  username: string;
  uuid: string;
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
  icon?: string; 
}
export interface IJoinedRoom extends IRoom {
  role: UserRole;
}

export interface IRoomMember {
  roomUUID: string;
  userId: string;
  role: UserRole;
}
