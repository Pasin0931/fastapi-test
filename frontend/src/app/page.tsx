"use client"
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

interface UserProps {
  id: string
  name: string
  email: string
}

export default function Home() {

  const [user, setUser] = useState<UserProps[]>([])

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const [loading, setLoading] = useState(false)

  const fetchData = () => {
    setLoading(true)
    fetch('http://localhost:8000/api/users', { method: "GET" })
      .then(async res => {
        const text = await res.text()
        const data = text ? JSON.parse(text) : []
        setUser(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(error => {
        console.log("Error :", error)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClear = async () => {
    try {

      if (user.length === 0) {
        return alert("Already empty")
      }

      if (!confirm("Clear database ?")) {
        return console.log("Canceled")
      }

      const res = await fetch(`http://localhost:8000/api/users`, { method: "DELETE" })
      if (res.ok) {
        fetchData()
      }
      alert("Deleted")
      setUser([])

    } catch (error) {
      console.log("Error :", error)
      return alert("Error")
    }
  }

  const handleDelete = async (id: string) => {
    try {

      if (!confirm("Delete ?")) {
        return console.log("Canceled")
      }

      const res = await fetch(`http://localhost:8000/api/users/${id}`, { method: "DELETE" })

      if (res.ok) {
        fetchData()
      }
      alert("Deleted")

    } catch (error) {
      console.log("Error", error)
      return alert("Error")
    }
  }

  const handleAdd = async () => {

    if (!name || !email) {
      return alert("Fill all forms")
    }

    const newUser = { name, email }
    try {
      const res = await fetch(`http://localhost:8000/api/users`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newUser) })
      if (res.ok) {
        fetchData()
      } else {
        alert("Error")
      }
      // setName("")
      // setEmail("")
    } catch (error) {
      alert("Error")
    }
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen text-xl'>
        <div className='grid grid-row-3 mb-3 p-5 gap-4'>
          <Card className='p-4'>Loading . . .</Card>
          <div className='grid grid-cols-2 gap-4'>
            <Button variant='destructive' onClick={handleClear}>
              Clear User
            </Button>
            <Button onClick={handleAdd}>
              Add User
            </Button>
          </div>

          <Card className='grid grid-rows-2 gap-4 p-5'>
            <Input
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}>
            </Input>
            <Input
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}>
            </Input>
          </Card>
        </div>
      </div>
    )
  }

  if (user.length === 0) {
    return (
      <div className='flex justify-center items-center h-screen text-xl'>
        <div className='grid grid-row-3 mb-3 p-5 gap-4'>
          <Card className='p-4'>No user</Card>
          <div className='grid grid-cols-2 gap-4'>
            <Button variant='destructive' onClick={handleClear}>
              Clear User
            </Button>
            <Button onClick={handleAdd}>
              Add User
            </Button>
          </div>

          <Card className='grid grid-rows-2 gap-4 p-5'>
            <Input
              placeholder='Name'
              value={name}
              onChange={(e) => setName(e.target.value)}>
            </Input>
            <Input
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}>
            </Input>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex flex-col justify-center items-center h-screen gap-5 w-full' >
        <Card className='grid grid-cols-4 mb-3 p-5'>
          {user.map((usr: any, index: any) => (
            <Card key={usr.id ?? index} className='relative p-8'>
              <Button variant='destructive' size='sm' className='absolute top-2 right-2 rounded-xl' onClick={() => handleDelete(usr._id)}>
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
          <Button variant='destructive' onClick={handleClear}>
            Clear User
          </Button>
          <Button onClick={handleAdd}>
            Add User
          </Button>
        </div>

        <Card className='grid grid-rows-2 gap-4 p-5'>
          <Input
            placeholder='Name'
            value={name}
            onChange={(e) => setName(e.target.value)}>
          </Input>
          <Input
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}>
          </Input>
        </Card>
      </div >
    </div >
  )
}