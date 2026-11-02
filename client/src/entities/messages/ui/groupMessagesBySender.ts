import { IMessage } from '@/shared/types/api.types';
import type { GroupedMessage } from './MessageGroup';

/**
 * Groups off Messages directly. senderName/senderProfileImg live on
 * SenderGroup only (group-level), not on GroupedMessage — a group is by
 * definition one sender's consecutive messages, so storing the name on
 * every message duplicates the same string across every bubble for no
 * reason. Same reasoning applies to channelId: a single screen renders
 * one channel, so it belongs on MessageGroupProps (passed once), not
 * threaded through every message object.
 *
 */

export interface SenderGroup {
  senderUUID: string;
  senderName: string;
  senderProfileImg: string | null;
  self: boolean;
  messages: GroupedMessage[];
}

interface SenderGroupInternal extends SenderGroup {
  lastCreatedAt: number;
}

const GROUPING_WINDOW_MS = 5 * 60 * 1000; // consecutive messages within 5 min from the same sender collapse into one group

export function groupMessagesBySender(
  messages: IMessage[] | Error,
  currentUserUUID: string
): SenderGroup[] {
  const groups: SenderGroupInternal[] = [];

  if (!Array.isArray(messages)) return groups; // prevent app crash if messsages are not an array (e.g undefined,null)
  const persisted = messages?.filter(
    (m): m is IMessage & { id: number } => m.id !== null && m.id !== undefined
  );

  const sorted = persisted.sort((a, b) => toTimestamp(a.createdAt) - toTimestamp(b.createdAt));

  for (const msg of sorted) {
    const last = groups[groups.length - 1];
    const createdAt = toTimestamp(msg.createdAt);
    const withinWindow = last && createdAt - last.lastCreatedAt < GROUPING_WINDOW_MS;
    const timestamp = formatTimestamp(msg.createdAt);

    if (last && last.senderUUID === msg.senderUUID && withinWindow) {
      last.messages.push({ id: msg.id, text: msg.message, timestamp });
      last.lastCreatedAt = createdAt;
      continue;
    }
    groups.push({
      senderUUID: msg.senderUUID,
      senderName: msg.senderName,
      senderProfileImg: msg.senderProfileImg ?? null,
      self: msg.senderUUID === currentUserUUID,
      messages: [{ id: msg.id, text: msg.message, timestamp }],
      lastCreatedAt: createdAt,
    });
  }

  return groups.map(({ lastCreatedAt, ...group }) => group);
}

function toTimestamp(date: Date | string | undefined): number {
  return date ? new Date(date).getTime() : Date.now();
}

function formatTimestamp(date: Date | string | undefined): string {
  return date
    ? new Date(date).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';
}
