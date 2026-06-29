'use server'

import { createClient } from '@/lib/supabase/server'
import { db } from '@/db'
import { stores } from '@/db/schema'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function loginAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return { error: 'Please provide a valid email address' }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function signupAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const storeName = formData.get('storeName') as string
  const storeAddress = formData.get('storeAddress') as string
  const storePhone = formData.get('storePhone') as string
  const accentColor = formData.get('accentColor') as string || 'red'

  if (!email || !password || !storeName) {
    return { error: 'Email, password, and store name are required' }
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(email)) {
    return { error: 'Please provide a valid email address' }
  }

  if (storePhone) {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/
    if (!phoneRegex.test(storePhone)) {
      return { error: 'Please provide a valid phone number (e.g., +1234567890)' }
    }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    try {
      await db.insert(stores).values({
        ownerId: data.user.id,
        name: storeName,
        address: storeAddress,
        phone: storePhone,
        accentColor,
      })
    } catch (dbError) {
      console.error('Failed to create store:', dbError)
      return { error: 'Failed to create store for user.' }
    }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/login')
}
