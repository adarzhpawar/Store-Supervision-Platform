'use client'

import { signupAction } from '@/actions/auth'
import { useActionState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Store } from 'lucide-react'

const initialState = {
  error: '',
}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signupAction, initialState)

  return (
    <div className="premium-card w-full max-w-lg p-8 md:p-10 flex flex-col items-center shadow-sm my-8">
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mb-6">
          <Store className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-medium tracking-tight mb-2">Create your store</h1>
        <p className="text-secondary text-sm">
          Get started with StoreSync in seconds
        </p>
      </div>

      <form action={formAction} className="w-full space-y-6">
        {state?.error && (
          <div className="p-3 bg-red-500/10 text-red-600 text-sm rounded-md border border-red-500/20 text-center">
            {state.error}
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2">Account Details</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="email" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                Email
              </label>
              <Input id="email" name="email" type="email" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" title="Please provide a valid email address" className="h-11 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="password" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                Password
              </label>
              <Input id="password" name="password" type="password" required className="h-11 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2">Store Details</h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="storeName" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                Store Name *
              </label>
              <Input id="storeName" name="storeName" required placeholder="e.g. Minimalist Boutique" className="h-11 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 rounded-lg" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="storePhone" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                  Phone (Optional)
                </label>
                <Input id="storePhone" name="storePhone" pattern="^\+?[1-9]\d{1,14}$" title="Please provide a valid phone number (e.g., +1234567890)" className="h-11 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="storeAddress" className="font-mono text-[10px] uppercase tracking-widest text-secondary block">
                  Address (Optional)
                </label>
                <Input id="storeAddress" name="storeAddress" className="h-11 bg-surface-container-lowest border-outline-variant/50 focus-visible:ring-primary/50 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <h3 className="font-mono text-xs uppercase tracking-widest text-primary border-b border-border/50 pb-2">Appearance</h3>
          <div className="flex items-center gap-4">
            {[
              { id: "red", bg: "bg-[#b71422] dark:bg-[#ffb3ae]", label: "Red" },
              { id: "blue", bg: "bg-[#2563eb] dark:bg-[#60a5fa]", label: "Blue" },
              { id: "emerald", bg: "bg-[#059669] dark:bg-[#34d399]", label: "Emerald" },
              { id: "zinc", bg: "bg-[#18181b] dark:bg-[#fafafa]", label: "Zinc" },
              { id: "amber", bg: "bg-[#d97706] dark:bg-[#fbbf24]", label: "Amber" },
            ].map((color) => (
              <label key={color.id} className="relative flex flex-col items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="accentColor" 
                  value={color.id} 
                  defaultChecked={color.id === "red"}
                  className="peer sr-only"
                />
                <div className={`w-8 h-8 rounded-full ${color.bg} outline outline-1 outline-border outline-offset-2 peer-checked:outline-2 peer-checked:outline-primary transition-all group-hover:scale-110`}></div>
                <span className="text-[10px] uppercase font-mono text-secondary tracking-widest">{color.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 pb-2">
          <button type="submit" className="btn-primary w-full h-12 text-sm font-bold flex justify-center items-center" disabled={isPending}>
            {isPending ? 'Creating store...' : 'Create Account'}
          </button>
        </div>
        
        <div className="text-center font-mono text-xs text-secondary mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-bold uppercase tracking-wide">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
