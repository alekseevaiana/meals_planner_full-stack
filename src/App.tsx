import { Box } from '@mui/material'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Navigation from './components/Navigation'
import Grocery from './Pages/Grocery'
import Meals from './Pages/Meals'
import Plan from './Pages/Plan'

function App() {
  return (
    <Box className="App">
      <Routes>
        <Route path="/grocery" element={<Grocery />} />
        <Route path="/plan" element={<Plan />} />
        <Route path="/" element={<Meals />} />
      </Routes>
      <Navigation />
    </Box>
  )
}

export default App
