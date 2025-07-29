"use client"
import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('')

  // useEffect(() => {
  //   fetch('http://localhost:8000/api/hello')
  //     .then(res => res.json())
  //     .then(data => setMessage(data.message))
  // }, [])

  useEffect(() => {
    fetch('http://localhost:8000/api/hi')
      .then(res => res.json())
      .then(data => setMessage(data.message))
  }, [])

  if (!message) {
    return (
      <h1 className='flex justify-center items-center h-screen text-5xl'>No Messages or Loading</h1>
    )
  }

  return (
    <div>
      <h1 className='flex justify-center items-center h-screen text-5xl'>{message}</h1>
    </div>
  )
}
