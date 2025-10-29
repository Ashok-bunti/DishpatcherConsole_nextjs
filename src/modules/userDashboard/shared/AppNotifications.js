import { useState } from 'react'
import { 
  IconButton, 
  Badge, 
  Menu, 
  MenuItem, 
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

const AppNotifications = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [notifications] = useState([
    { id: 1, message: 'New job assigned', time: '2 min ago' },
    { id: 2, message: 'AI call completed', time: '5 min ago' },
  ])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }}>
          Notifications
        </Typography>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleClose}>
              <ListItemText
                primary={notification.message}
                secondary={notification.time}
              />
            </MenuItem>
          ))}
        </List>
      </Menu>
    </>
  )
}

export default AppNotifications