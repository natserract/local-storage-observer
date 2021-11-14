import React, { useEffect } from 'react'
import localStorageObserver from './package/dist/'

import './App.css'

const key = 'token'

function App() {
  useEffect(() => {
    localStorageObserver.config({
      storeName: 'new_store',
    })

    setTimeout(() => {
      localStorageObserver.set$(key, 'secret_one')
    }, 1000)

    setTimeout(() => {
      localStorageObserver.set$(key, 'secret_two').subscribe((next) => {
        console.log('Step two, set$', next)
      })
    }, 2000)

    // Get and listen any change of storage value
    // Value will be show after 5000ms
    localStorageObserver.get$(key).subscribe((next: any) => {
      console.log('Result', JSON.parse(next))
    })

    // Cleanup your subscriptions
    return () => {
      localStorageObserver.destroySubscription$()
    }
  }, [])

  // From click event, get$ in useEffect
  // still listen any change of values
  const handleClick = () => {
    localStorageObserver.set$(key, [
      {
        id: 1,
        name: 'Example 1',
      },
      {
        id: 2,
        name: 'Example 2',
      },
    ])
  }

  return (
    <div className="App">
      <h2>Hello</h2>
      <button onClick={handleClick}>Change value</button>
    </div>
  )
}

export default App
