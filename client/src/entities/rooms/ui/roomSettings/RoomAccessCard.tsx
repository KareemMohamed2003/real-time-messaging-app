// ---------------------------------------------------------------------------
// Access & invites — private toggle, invite-link toggle + copy field

import { GhostButton } from "@/shared/components/UI/Button";
import { Input } from "@mui/base";
import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SettingsCard from "../SettingsCard";
import SettingsToggleRow from "../SettingsToggleRow";

// ---------------------------------------------------------------------------
export default function RoomAccessCard({ room, roomUUID }: { room: any; roomUUID: string }) {
  const queryClient = useQueryClient();
  const [isPrivate, setIsPrivate] = useState(room.isPrivate);
  const [inviteLinksEnabled, setInviteLinksEnabled] = useState(room.inviteLinksEnabled);
  const [copied, setCopied] = useState(false);

  const { mutate: updateAccess } = useMutation({
    mutationFn: (data: { isPrivate?: boolean; inviteLinksEnabled?: boolean }) =>
      updateRoomAccessQuery(roomUUID, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['room', roomUUID] }),
  });

  return (
    <SettingsCard title="Access & invites" description="Control who can join this room and how.">
      <SettingsToggleRow
        name="Private room"
        sub="Only invited members can join"
        checked={isPrivate}
        onChange={checked => {
          setIsPrivate(checked);
          updateAccess({ isPrivate: checked });
        }}
      />
      <SettingsToggleRow
        name="Allow invite links"
        sub="Members can generate links to invite others"
        checked={inviteLinksEnabled}
        last={!inviteLinksEnabled}
        onChange={checked => {
          setInviteLinksEnabled(checked);
          updateAccess({ inviteLinksEnabled: checked });
        }}
      />

      {inviteLinksEnabled && (
        <Box mt={1.75} display="flex" gap={1}>
          <Input value={room.inviteLink} inputProps={{ readOnly: true }} sx={{ flex: 1 }} />
          <GhostButton
            size="small"
            onClick={() => {
              navigator.clipboard?.writeText(room.inviteLink);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </GhostButton>
        </Box>
      )}
    </SettingsCard>
  );
}
