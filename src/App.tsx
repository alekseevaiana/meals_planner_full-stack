import { useState, useEffect, SyntheticEvent } from 'react'
import { Route, Routes } from 'react-router-dom'
import { DataStore } from 'aws-amplify'
import logo from './logo.svg'
import useData from './hooks/use-data'
import './App.css'
import { Ingredient } from './models'
import Grocery from './Grocery'
import Plan from './Plan'
import Meals from './Meals'
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
    <div className="App">
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
        <Route path="/grocery" element={<Grocery />}></Route>
        <Route path="/plan" element={<Plan />}></Route>
        <Route path="/meals" element={<Meals />}></Route>
      </Routes>
    </div>
  )
}

export default App
