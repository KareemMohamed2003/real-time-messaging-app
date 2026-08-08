import { ACCENT, ACCENT_HOVER } from '@/themes';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  List,
  IconButton,
  Typography,
  Box,
  Divider,
  Stack,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Button,
} from '@mui/material';
import { STATUS_LABEL } from './AddMembersModalv2';
import CheckIcon from '@mui/icons-material/Check';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import StatusDot from './StatusDot';
import {  User } from '@/shared/types/api.types';
interface props {
  member: User;
  isSelected: boolean;
  toggleMember: (id: any) => any;
}
export default function RoomMember({
  member,
  isSelected,
  toggleMember,
}: props) {
 
  return (
    <ListItem
      // onClick={()=>addMember({ roomUUID, role:'MEMBER', userId:'' })}
      key={member.userId}
      sx={{
        px: 1,
        py: 0.75,
        borderRadius: 1.5,
        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
      }}
      secondaryAction={
        <Button
          size="small"
          variant={isSelected ? 'outlined' : 'contained'}
          disableElevation
          onClick={() => toggleMember(member.id)}
          startIcon={
            isSelected ? (
              <CheckIcon fontSize="small" />
            ) : (
              <PersonAddAlt1Icon fontSize="small" />
            )
          }
          sx={{
            textTransform: 'none',
            borderRadius: 5,
            minWidth: 92,
            fontWeight: 600,
            ...(isSelected
              ? {
                  color: ACCENT,
                  borderColor: ACCENT,
                  bgcolor: 'transparent',
                  '&:hover': {
                    borderColor: ACCENT,
                    bgcolor: 'rgba(59,124,246,0.08)',
                  },
                }
              : {
                  bgcolor: ACCENT,
                  color: '#fff',
                  '&:hover': { bgcolor: ACCENT_HOVER },
                }),
          }}
        >
          {isSelected ? 'Added' : 'Add'}
        </Button>
      }
    >
      <ListItemAvatar>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={<StatusDot status={member.status} />}
        >
          <Avatar src={member.avatarUrl} alt={member.name} />
        </Badge>
      </ListItemAvatar>
      <ListItemText
        primaryTypographyProps={{ color: 'white' }}
        primary={member.name}
        secondary={STATUS_LABEL[member.status]}
        secondaryTypographyProps={{
          sx: { color: STATUS_COLOR[member.status] },
        }}
      />
    </ListItem>
  );
}
