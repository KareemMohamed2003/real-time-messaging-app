import { ACCENT, ACCENT_HOVER } from '@/themes';
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
} from '@mui/material';
import { IAddableRoomMember, STATUS_LABEL } from '../../../features/add-room-member/ui/AddMembersModalv2';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

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
