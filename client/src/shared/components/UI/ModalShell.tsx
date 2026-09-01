'use client';

import { ReactNode, Ref } from 'react';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';

export interface ModalShellProps
  extends Omit<DialogProps, 'title' | 'onSubmit'> {
  open: boolean;
  onClose: () => void;
  /** modal-head h3 */
  title: ReactNode;
  /** modal-head p — muted line under the title */
  subtitle?: ReactNode;
  /** modal-foot — usually a GhostButton + a primary Button */
  actions?: ReactNode;
  children?: ReactNode;
  hideCloseButton?: boolean;
  /**
   * When set, the Dialog's Paper renders as a real <form> — Paper is
   * polymorphic via MUI's `component` prop — so a `type="submit"` button in
   * `actions`, or Enter inside a field, submits it. This is the documented
   * "Form dialogs" pattern: https://mui.com/material-ui/react-dialog/
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  formRef?: Ref<HTMLFormElement>;
  /** mutation pending state */
  isPending?: boolean;
}

export default function ModalShell({
  open,
  onClose,
  title,
  subtitle,
  actions,
  children,
  hideCloseButton,
  maxWidth = 'xs',
  onSubmit,
  formRef,
  isPending,
  ...dialogProps
}: ModalShellProps) {
  // in our mutation we need to disable the form
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick' && isPending) return;
        onClose();
      }}
      maxWidth={maxWidth}
      fullWidth
      // PaperProps, not slotProps.paper: slotProps.paper only landed in the
      // v6 deprecation cycle. On @mui/material 5.15.x, PaperProps is the
      // current (non-deprecated) API for styling/typing the dialog's card.
      PaperProps={{
        ...(onSubmit ? { component: 'form', onSubmit, ref: formRef } : {}),
        sx: (theme) => ({
          background: theme.palette.surface.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: `${theme.radius.lg}px`,
        }),
      }}
      {...dialogProps}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          py: 2.25,
          px: 2.5,
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="caption"
              color="text.secondary"
              component="p"
              mt={0.375}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {!hideCloseButton && (
          <IconButton
            onClick={onClose}
            size="small"
            aria-label="Close"
            sx={{ mt: -0.5, mr: -0.5 }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>

      {children && (
        <DialogContent sx={{ px: 2.5, py: 2 }}>{children}</DialogContent>
      )}
      {actions && (
        <DialogActions
          sx={{ px: 2.5, py: 1.75, justifyContent: 'space-between' }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
