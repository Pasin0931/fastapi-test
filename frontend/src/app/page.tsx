"use client"
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

// export default function Home() {
// const [message, setMessage] = useState('')

// useEffect(() => {
//   fetch('http://localhost:8000/api/hello')
//     .then(res => res.json())
//     .then(data => setMessage(data.message))
// }, [])

// useEffect(() => {
//   fetch('http://localhost:8000/api/hi')
//     .then(res => res.json())
//     .then(data => setMessage(data.message))
// }, [])

//   if (!message) {
//     return (
//       <h1 className='flex justify-center items-center h-screen text-5xl'>No Messages or Loading</h1>
//     )
//   }

//   return (
//     <div>
//       <h1 className='flex justify-center items-center h-screen text-5xl'>{message}</h1>
//     </div>
//   )
// }

interface UserProps {
  id: string
  name: string
  email: string
}

export default function Home() {

  const [user, setUser] = useState<UserProps[]>([])

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:8000/api/users')
      .then(res => res.json())
      .then(data => {
        setUser(data)
        // console.log(data)
        setLoading(false)
      })
      .catch(error => {
        console.log("Error :", error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen text-xl'>
        <h1>Loading . . .</h1>
      </div>
    )
  }

  if (user.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen text-xl'>
        <Card className='p-4'>No user or loading . . .</Card>
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col justify-center items-center h-screen gap-5 w-full' >
        <Card className='grid grid-cols-4 mb-3 p-5'>
          {user.map((usr: any, index: any) => (
            <Card key={usr.id ?? index} className='relative p-8'>
              <Button variant='destructive' size='sm' className='absolute top-2 right-2 rounded-xl'>
                <X />
              </Button>
              <div>
                <h1>{usr.name}</h1>
                <h2>{usr.email}</h2>
              </div>
            </Card>
          ))}
        </Card>

        <div className='grid grid-cols-2 gap-4'>
          <Button variant='destructive'>
            Clear User
          </Button>
          <Button>
            Add User
          </Button>
        </div>
      </div >
    </div >
  )
}