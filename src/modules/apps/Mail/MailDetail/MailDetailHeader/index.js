import React from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';
import IntlMessages from '@crema/helpers/IntlMessages';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';
import AppTooltip from '@crema/components/AppTooltip';
import IconButton from '@mui/material/IconButton';
import { putDataApi, useGetDataApi } from '@crema/hooks/APIHooks';
import { useInfoViewActionsContext } from '@crema/context/AppContextProvider/InfoViewContextProvider';
import { useRouter } from 'next/navigation';

const MailDetailHeader = (props) => {
  const { selectedMail, onUpdateSelectedMail } = props;
  const infoViewActionsContext = useInfoViewActionsContext();
  const router = useRouter();

  const [{ apiData: labelList }] = useGetDataApi('mail/labels', []);

  const [isLabelOpen, onOpenLabel] = React.useState(null);

  const [isMoreIcon, onOpenMoreIcon] = React.useState(null);

  const onClickBackButton = () => {
    router.back();
  };

  const onLabelOpen = (event) => {
    onOpenLabel(event.currentTarget);
  };

  const onLabelClose = () => {
    onOpenLabel(null);
  };

  const onViewMoreOpen = (event) => {
    onOpenMoreIcon(event.currentTarget);
  };

  const onViewMoreClose = () => {
    onOpenMoreIcon(null);
  };

  const onSelectLabel = (event) => {
    const mail = selectedMail;
    mail.label = event.target.value;
    putDataApi('/mail/detail', infoViewActionsContext, { mail })
      .then(() => {
        onUpdateSelectedMail(mail);
        onOpenLabel(null);
        infoViewActionsContext.showMessage('Mail Updated Successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onChangeMailFolder = (type) => {
    const mail = selectedMail;
    mail.folderValue = type;
    putDataApi('mail/folders', infoViewActionsContext, {
      mailIds: [selectedMail.id],
      type,
    })
      .then(() => {
        selectedMail.folderValue = type;
        router.back();
        onUpdateSelectedMail(selectedMail);
        infoViewActionsContext.showMessage('Mail Updated Successfully');
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onChangeReadStatus = () => {
    const mail = selectedMail;
    mail.isRead = false;
    putDataApi('/mail/detail', infoViewActionsContext, { mail })
      .then((data) => {
        onUpdateSelectedMail(data.data);
        router.back();
        infoViewActionsContext.showMessage(
          mail.isRead
            ? 'Mail Marked as Read Successfully'
            : 'Mail Marked as Unread Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
  };

  const onChangeStarredStatus = () => {
    const mail = selectedMail;
    mail.isStarred = !mail.isStarred;
    putDataApi('/mail/detail', infoViewActionsContext, { mail })
      .then(() => {
        onUpdateSelectedMail(mail);
        infoViewActionsContext.showMessage(
          mail.isStarred
            ? 'Mail Marked as Starred Successfully'
            : 'Mail Marked as Unstarred Successfully',
        );
      })
      .catch((error) => {
        infoViewActionsContext.fetchError(error.message);
      });
    onOpenMoreIcon(null);
  };

  if (!selectedMail) return null;
  return (
    <>
      <AppTooltip title={<IntlMessages id='common.back' />}>
        <IconButton
          sx={(theme) => ({
            color: theme.palette.text.disabled,
          })}
          onClick={onClickBackButton}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </AppTooltip>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AppTooltip title={<IntlMessages id='common.archive' />}>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.text.disabled,
            })}
            onClick={() => onChangeMailFolder(127)}
          >
            <ArchiveOutlinedIcon />
          </IconButton>
        </AppTooltip>

        <AppTooltip title={<IntlMessages id='common.reportSpam' />}>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.text.disabled,
            })}
            onClick={() => onChangeMailFolder(125)}
          >
            <InfoOutlinedIcon />
          </IconButton>
        </AppTooltip>

        <AppTooltip title={<IntlMessages id='common.trash' />}>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.text.disabled,
            })}
            onClick={() => onChangeMailFolder(126)}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </AppTooltip>

        <AppTooltip title={<IntlMessages id='mailApp.markAsUnread' />}>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.text.disabled,
            })}
            onClick={() => onChangeReadStatus()}
          >
            <MarkunreadOutlinedIcon />
          </IconButton>
        </AppTooltip>

        <AppTooltip title={<IntlMessages id='common.label' />}>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.text.disabled,
            })}
            value={1}
            onClick={onLabelOpen}
          >
            <LabelOutlinedIcon />
          </IconButton>
        </AppTooltip>

        <Menu
          anchorEl={isLabelOpen}
          open={Boolean(isLabelOpen)}
          onClose={onLabelClose}
        >
          {labelList.map((label) => {
            return (
              <MenuItem onClick={onSelectLabel} value={label.id} key={label.id}>
                {label.name}
              </MenuItem>
            );
          })}
        </Menu>
      </Box>
      <Box
        sx={{
          ml: 'auto',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AppTooltip title={<IntlMessages id='common.more' />}>
          <IconButton
            sx={(theme) => ({
              color: theme.palette.text.disabled,
            })}
            onClick={onViewMoreOpen}
          >
            <MoreVertIcon />
          </IconButton>
        </AppTooltip>

        <Menu
          anchorEl={isMoreIcon}
          open={Boolean(isMoreIcon)}
          onClose={onViewMoreClose}
        >
          <MenuItem onClick={onChangeReadStatus}>
            <IntlMessages id='mailApp.markAsUnread' />
          </MenuItem>
          <MenuItem onClick={onChangeStarredStatus}>
            {selectedMail.isStarred ? (
              <IntlMessages id='mailApp.markAsNotImportant' />
            ) : (
              <IntlMessages id='mailApp.markAsImportant' />
            )}
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default MailDetailHeader;

MailDetailHeader.propTypes = {
  selectedMail: PropTypes.object.isRequired,
  onUpdateSelectedMail: PropTypes.func,
};
