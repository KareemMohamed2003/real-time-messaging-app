import { ListItem, ListItemAvatar, ListItemText, Avatar, Checkbox } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { IAddableRoomMember } from '@/features/add-room-member/model/types';

interface props {
  member: IAddableRoomMember;
  isSelected: boolean;
  toggleMember: (id: string, roomMember: IAddableRoomMember) => any;
}

export default function AddableRoomMember({ member, isSelected, toggleMember }: props) {
  return (
    <ListItem
      key={member.uuid}
      sx={(theme) => ({
        px: 1.75,
        py: 1.25,
        mb: 1,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.radius.md}px`,
        background: `linear-gradient(135deg, ${theme.palette.surface.paper}, ${theme.palette.surface.elevated})`,
        transition: '.15s',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          background: `linear-gradient(135deg, ${theme.palette.surface.elevated}, ${theme.palette.surface.high})`,
          boxShadow: `0 6px 18px ${theme.palette.primary.main}24`,
        },
      })}
      secondaryAction={
        <Checkbox
          checked={isSelected}
          onChange={() => toggleMember(member.uuid, member)}
          icon={<PersonAddAlt1Icon fontSize="small" />}
          checkedIcon={<CheckIcon fontSize="small" />}
          sx={(theme) => ({
            color: theme.palette.primary.main,
            '&.Mui-checked': { color: theme.palette.primary.main },
            '&:hover': { bgcolor: `${theme.palette.primary.main}14` },
          })}
        />
      }
    >
      <ListItemAvatar>
        <Avatar src={member.profile_img} alt={member.username} />
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ fontWeight: 600, fontSize: 13.5, color: 'text.primary' }}
        primary={member.username}
      />
    </ListItem>
  );
}
