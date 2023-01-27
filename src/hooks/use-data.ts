import {
  DataStore,
  PersistentModel,
  PersistentModelConstructor,
  IdentifierFieldOrIdentifierObject,
  ProducerPaginationInput,
  PersistentModelMetaData,
  RecursiveModelPredicateExtender,
} from '@aws-amplify/datastore'
import { useCallback, useEffect, useState } from 'react'

export interface QueryReturn<TData extends PersistentModel | PersistentModel[]> {
  refetch: () => Promise<TData | undefined>
  data: TData | undefined
  loading: boolean
  error?: Error
}

export type QueryModelContructorInputParam<T extends PersistentModel> =
  | PersistentModelConstructor<T>
  | null
  | undefined
  | false

/**
 * React hook to read from the [Amplify DataStore](https://docs.amplify.aws/lib/datastore/getting-started/q/platform/js).
 * Built-in supports for real-time update using subscriptions.
 *
 * Note that `Predicates.ALL` is not supported as it's use leads to unnecessary re-renders. Simply use `undefined`
 * instead, if you want to query for all data records without any filter.
 *
 * @example
 * // To read from the database, the simplest approach is to query for all records of a given model type.
 * const { data, isLoading, error } = useDataStoreQuery(Post).current)
 *
 * @example
 * // To query for a single item, pass in the ID of the item as the second argument to the query.
 * const { data, isLoading, error } = useDataStoreQuery(Post, "1234567").current)
 *
 * @example
 * // Predicates are supported as well. For example if you wanted a list of all Post Models that have a rating greater than 4:
 * const { data, isLoading, error } = useDataStoreQuery(Post, c => c.rating("gt", 4));
 *
 * @example
 * // Query results can also be sorted by one or more fields.
 * const { data, isLoading, error } = useDataStoreQuery(Post, undefined, useRef({ sort: s => s.rating(SortDirection.ASCENDING) }).current)
 */
function useDataStoreQuery<T extends PersistentModel>(
  modelConstructor: PersistentModelConstructor<T>,
  identifier: IdentifierFieldOrIdentifierObject<T, PersistentModelMetaData<T>>,
): QueryReturn<T>
function useDataStoreQuery<T extends PersistentModel>(
  modelConstructor: PersistentModelConstructor<T>,
  criteria?: RecursiveModelPredicateExtender<T> | null,
  paginationProducer?: ProducerPaginationInput<T>,
): QueryReturn<T[]>
function useDataStoreQuery<T extends PersistentModel>(
  modelConstructor: PersistentModelConstructor<T>,
  identifierOrCriteria?:
    | IdentifierFieldOrIdentifierObject<T, PersistentModelMetaData<T>>
    | RecursiveModelPredicateExtender<T>
    | null,
  paginationProducer?: ProducerPaginationInput<T>,
): QueryReturn<any> {
  const shouldFetch = typeof modelConstructor === 'function'
  const [loading, setIsLoading] = useState(shouldFetch)
  const [error, setError] = useState<Error | undefined>()
  const [data, setData] = useState<T[] | T | undefined>()

  const fetchAsync = useCallback(async () => {
    try {
      setIsLoading(true)
      if (typeof modelConstructor === 'function') {
        const data =
          typeof identifierOrCriteria === 'string'
            ? await DataStore.query<T>(modelConstructor, identifierOrCriteria)
            : await DataStore.query<T>(modelConstructor, identifierOrCriteria as any, paginationProducer)
        setData(data)
        setError(undefined)
        return data
      }
      return undefined
    } catch (error) {
      console.error('Error fetching data', { error })
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }, [modelConstructor, identifierOrCriteria, paginationProducer])

  useEffect(() => {
    fetchAsync().catch(null)
  }, [fetchAsync])

  useEffect(() => {
    if (typeof modelConstructor === 'function') {
      const subscription = DataStore.observe<T>(modelConstructor, identifierOrCriteria as any).subscribe(msg => {
        // For now we don't bother doing a merge update. We just fetch the data again instead
        fetchAsync().catch(null)
      })
      return () => {
        subscription.unsubscribe()
      }
    }
  }, [modelConstructor, identifierOrCriteria, fetchAsync])

  return { data, loading, error, refetch: fetchAsync }
}

export default useDataStoreQuery
