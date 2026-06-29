'use client'

import { loginAction } from '@/actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Store } from 'lucide-react'

const initialState = {
  error: '',
}

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="premium-card w-full max-w-md p-8 md:p-10 flex flex-col items-center shadow-sm">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight mb-2">Welcome Back</h1>
        <p className="text-secondary text-sm">
          Sign in to your StoreSync account
        </p>
      </div>
      
      <form action={formAction} className="w-full space-y-5">
        {state?.error && (
          <div className="p-3 bg-red-500/10 text-red-600 text-sm rounded-md border border-red-500/20 text-center">
            {state.error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
            Email
          </label>
          <Input id="email" name="email" type="email" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" title="Please provide a valid email address" placeholder="you@domain.com" className="h-12 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 rounded-lg text-sm" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
            Password
          </label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            className="h-12 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 text-base rounded-xl"
          />
        </div>
        
        <div className="pt-4 pb-2">
          <button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg w-full h-12 text-sm font-bold flex justify-center items-center" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
        
        <div className="text-center font-mono text-xs text-secondary mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline font-bold uppercase tracking-wide">
            Create a store
          </Link>
        </div>
      </form>
    </div>
  )
}
