import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Form1 from './Form1'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Form1 />
    </>
  )
}

export default App
