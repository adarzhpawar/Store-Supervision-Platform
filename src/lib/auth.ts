import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/db'
import { stores } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function getCurrentStore() {
  const user = await getCurrentUser()
  if (!user) return null
  
  const userStore = await db.query.stores.findFirst({
    where: eq(stores.ownerId, user.id)
  })
  return userStore || null
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  
  const store = await getCurrentStore()
  if (!store) {
    // If they have no store, maybe redirect to signup or onboarding
    redirect('/signup')
  }
  
  return { user, store }
}
