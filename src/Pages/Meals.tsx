import { DataStore } from '@aws-amplify/datastore'

import useData from '../hooks/use-data'
import { Meal, Ingredient, MealIngredient } from '../models'

async function createTestData() {
  const meal = await DataStore.save(
    new Meal({
      name: 'Porridge',
      notes: 'Tasty!',
    }),
  )

  const ingredient = await DataStore.save(
    new Ingredient({
      name: 'Rice',
    }),
  )

  await DataStore.save(
    new MealIngredient({
      unit: 'GRAM',
      value: 300,
      mealID: meal.id,
      meal,
      ingredientID: ingredient.id,
      ingredient,
    }),
  )
}

export default function Meals() {
  const { data, loading, error } = useData(Meal)

  if (loading) {
    return <>Loading</>
  }

  if (error) {
    return <>{error.toString()}</>
  }

  return (
    <section>
      <h1 data-testid="title">Meals</h1>
      <pre>{JSON.stringify(data)}</pre>
      <button onClick={createTestData}>Create test data</button>
    </section>
  )
}
