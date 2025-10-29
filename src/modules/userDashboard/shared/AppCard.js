import { Card } from '@mui/material'
import { styled } from '@mui/material/styles'

const AppCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(1),
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  border: `1px solid ${theme.palette.divider}`,
  overflow: 'hidden',
}))

export default AppCard