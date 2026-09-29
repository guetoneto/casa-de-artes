import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkAccess(currentSession) {
      if (!currentSession) {
        if (mounted) {
          setSession(null)
          setIsAdmin(false)
          setLoading(false)
        }
        return
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', currentSession.user.id)
        .maybeSingle()

      if (!mounted) return

      setSession(currentSession)

      if (error) {
        console.error(
          'Erro ao verificar autorização:',
          error
        )
        setIsAdmin(false)
      } else {
        setIsAdmin(profile?.role === 'admin')
      }

      setLoading(false)
    }

    async function initializeAccess() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      await checkAccess(currentSession)
    }

    initializeAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setLoading(true)
        checkAccess(currentSession)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <p>Verificando acesso...</p>
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}