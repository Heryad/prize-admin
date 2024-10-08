'use client'
import { CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

export default function Home() {
  const [isLoading] = useState(false);

  return (
    <main className="grid grid-cols-2">
      <section className="flex h-screen items-center justify-center bg-[#111827]">
        <span className="text-white">PRIZE-EX ADMIN</span>
      </section>
      <section className="flex flex-col h-screen items-center justify-center">
        <CardTitle className="text-2xl font-bold m-5">Login</CardTitle>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Adress*</Label>
            <Input id="email" type="email" placeholder="m@example.com" required className="w-[450px] h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required className="w-[450px] h-12" />
          </div>
          <div className="flex flex-row mb-20">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="text-sm font-medium ml-2 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Remember Me
            </label>
            <label className="text-sm font-medium ml-auto leading-none opacity-80">Forgot Password ?</label>
          </div>
          <Button type="submit" className="w-full h-12">
            {isLoading ? 'Please Wait ...' : 'Login'}
          </Button>
        </div>
      </section>
    </main>
  )
}