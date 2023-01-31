import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

export default function Navigation() {
  const location = useLocation()
  const [value, setValue] = useState(1)
  console.log('location', location.pathname)
  const handleChange = () => {
    console.log('handle', location.pathname)
    if (location.pathname === '/grocery') {
      setValue(0)
    }
    if (location.pathname === '/') {
      setValue(1)
    }
    if (location.pathname === 'plan') {
      setValue(2)
    }
  }

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
        <BottomNavigationAction component={Link} to="/grocery" label="Grocery" icon={<LocalGroceryStoreIcon />} />
        <BottomNavigationAction component={Link} to="/" label="Meals" icon={<MenuBookIcon />} />
        <BottomNavigationAction component={Link} to="/plan" label="Plan" icon={<SoupKitchenIcon />} />
      </BottomNavigation>
    </Paper>
  )
}
