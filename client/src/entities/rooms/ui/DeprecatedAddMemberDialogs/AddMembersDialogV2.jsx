import * as React from "react";
import { ThemeProvider, createTheme, alpha } from "@mui/material/styles";
import {
  Dialog,
  Box,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Button,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import CheckIcon from "@mui/icons-material/Check";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SendIcon from "@mui/icons-material/Send";

/**
 * THEME — every value below was sampled directly from your own screenshots
 * with a pixel-averaging script (not eyeballed), so this should sit visually
 * flush with your existing screens rather than introduce a new look.
 *
 * primary.main (#1976d2) is MUI's own default — your measured buttons
 * (~#1a76cc–#3178c6) already land within a couple points of it, so rather
 * than hand-roll a custom blue that drifts further from your source images,
 * this just uses the MUI default, which is *also* your de facto brand blue.
 * https://mui.com/material-ui/customization/palette/
 */
const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#17191c", // main canvas — sampled from chat/rooms background
      paper: "#1e2127", // modal / panel surface — sampled from members panel
    },
    primary: { main: "#1976d2" }, // matches your sampled invite/create-room blue
    success: { main: "#2e7d32" }, // used for the "added" state, close to your "add Friend" pill
    info: { main: "#0288d1" }, // close to your sampled "online" filter pill (#23939f)
    warning: { main: "#ed6c02" }, // your "pending" filter pill family
    divider: alpha("#ffffff", 0.08),
    text: {
      primary: "#f1f1f2",
      secondary: alpha("#ffffff", 0.6),
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 600, borderRadius: 999 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: "#292b2e", // sampled from your input fields
        },
        notchedOutline: { border: "none" },
      },
    },
  },
});

// Same shape you're already using on the Friends page (Image 4)
const FRIENDS = [
  { id: 1, name: "john1", status: "online" },
  { id: 2, name: "john2", status: "offline" },
  { id: 3, name: "john3", status: "online" },
  { id: 4, name: "john4", status: "offline" },
];

function AddMembersDialogInner({ open, onClose, roomName = "room1", channelName = "channel1" }) {
  const [query, setQuery] = React.useState("");
  const [added, setAdded] = React.useState(new Set());
  const [tag, setTag] = React.useState("");

  const filtered = FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(query.toLowerCase())
  );

  const toggleAdd = (id) =>
    setAdded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { bgcolor: "background.paper", overflow: "hidden" },
      }}
    >
      {/* Header bar uses your sampled #41454b — an elevation step above
          the paper background, same as your existing "friends" modal */}
      <Box
        sx={{
          bgcolor: "#41454b",
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={600} color="text.primary">
            Add members
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {roomName} · {channelName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "text.secondary" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Search — mirrors the "Search friends" field already on your Friends page */}
      <Box sx={{ px: 2.5, pt: 2 }}>
        <TextField
          fullWidth
          placeholder="Search friends"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <List sx={{ px: 1.5, py: 1, maxHeight: 280, overflowY: "auto" }}>
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" align="center" py={4}>
            No friends match "{query}"
          </Typography>
        )}

        {filtered.map((f) => {
          const isAdded = added.has(f.id);
          return (
            <ListItem
              key={f.id}
              sx={{ borderRadius: 2, "&:hover": { bgcolor: alpha("#ffffff", 0.04) } }}
              secondaryAction={
                <Button
                  size="small"
                  onClick={() => toggleAdd(f.id)}
                  variant={isAdded ? "outlined" : "contained"}
                  color={isAdded ? "success" : "primary"}
                  startIcon={isAdded ? <CheckIcon fontSize="small" /> : null}
                  sx={{ minWidth: 88 }}
                >
                  {isAdded ? "added" : "add"}
                </Button>
              }
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  variant="dot"
                  sx={{
                    "& .MuiBadge-dot": {
                      bgcolor: f.status === "online" ? "#08771d" : alpha("#ffffff", 0.25),
                      border: "2px solid #1e2127",
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                    },
                  }}
                >
                  <Avatar sx={{ bgcolor: "#3a3d44" }}>{f.name[0].toUpperCase()}</Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={f.name}
                secondary={f.status}
                secondaryTypographyProps={{ sx: { textTransform: "capitalize" } }}
              />
            </ListItem>
          );
        })}
      </List>

      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ px: 2.5, py: 1 }}>
        <Divider sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 0.5 }}>
          OR INVITE BY TAG
        </Typography>
        <Divider sx={{ flex: 1 }} />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ px: 2.5, pb: 2.5, pt: 0.5 }}>
        <TextField
          fullWidth
          placeholder="user tag name"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonAddAlt1Icon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" endIcon={<SendIcon fontSize="small" />} sx={{ px: 2.5 }}>
          invite
        </Button>
      </Stack>
    </Dialog>
  );
}

// Wrap with your app's ThemeProvider in real usage — shown standalone here for demo purposes.
export default function AddMembersDialogDemo() {
  const [open, setOpen] = React.useState(true);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 4 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Open add members
        </Button>
        <AddMembersDialogInner open={open} onClose={() => setOpen(false)} />
      </Box>
    </ThemeProvider>
  );
}
