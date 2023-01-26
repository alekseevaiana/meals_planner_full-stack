import { useState, useEffect, SyntheticEvent } from 'react'
import { DataStore } from 'aws-amplify'
import logo from './logo.svg'
import './App.css'
import { Ingredient } from './models'
;(async function () {
  const ingridients = await DataStore.query(Ingredient)
  console.log(ingridients)
})()

function App() {
  const [name, setName] = useState('')
  const [all, setAll] = useState<Ingredient[]>([])

  useEffect(() => {
    DataStore.query(Ingredient).then(setAll)
  }, [])

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    const i = await DataStore.save(new Ingredient({ name }))
    setName('')
    setAll(a => [...a, i])
  }

  return (
    <div className="App">
      <ul>
        {all.map(i => (
          <li key={i.id}>{i.name}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  )
}

export default App
