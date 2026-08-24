import { ACCENT, ACCENT_HOVER } from '@/themes(legacy)';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { IAddableRoomMember } from '@/features/add-room-member/model/types';

interface props {
  member: IAddableRoomMember;
  isSelected: boolean;
  toggleMember: (id: string, roomMember: IAddableRoomMember) => any;
}
export default function AddableRoomMember({
  member,
  isSelected,
  toggleMember,
}: props) {
  return (
    <ListItem
      key={member.uuid}
      sx={{
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
      }}
      secondaryAction={
        <Checkbox
          checked={isSelected}
          onChange={() => toggleMember(member.uuid, member)}
          icon={<PersonAddAlt1Icon fontSize="small" />}
          checkedIcon={<CheckIcon fontSize="small" />}
          sx={{
            color: ACCENT,
            '&.Mui-checked': {
              color: ACCENT,
            },
            '&:hover': {
              bgcolor: 'rgba(59,124,246,0.08)',
            },
          }}
        />
      }
    >
      <ListItemAvatar>
        <Avatar src={member.profile_img} alt={member.username} />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ color: 'white' }}
        primary={member.username}
      />
    </ListItem>
  );
}
