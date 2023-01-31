import { useState, useEffect, SyntheticEvent } from 'react'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore'
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { Route, Routes } from 'react-router-dom'
import { DataStore } from 'aws-amplify'
import logo from './logo.svg'
import useData from './hooks/use-data'
import './App.css'
import { Ingredient } from './models'
import Grocery from './Pages/Grocery'
import Plan from './Pages/Plan'
import Meals from './Pages/Meals'
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import Navigation from './components/Navigation'
;(async function () {
  const ingridients = await DataStore.query(Ingredient)
  console.log(ingridients)
})()

function App() {
  const [name, setName] = useState('')

  const { data, loading, error } = useData(Ingredient)

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    if (name === '') {
      return
    }
    await DataStore.save(new Ingredient({ name }))
    setName('')
  }

  if (loading) {
    return <b>Loading</b>
  }

  if (error) {
    return <div>{error.toString()}</div>
  }

  return (
    <Box className="App">
      <ul>
        {data?.map(i => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit" disabled={name === ''}>
          Create
        </button>
      </form>
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
