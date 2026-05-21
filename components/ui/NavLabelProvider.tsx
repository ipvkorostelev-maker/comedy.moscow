"use client"
import { createContext, useContext, useState, useEffect } from "react"

interface NavLabelCtxValue {
  label: string | null
  setLabel: (l: string | null) => void
}

const NavLabelCtx = createContext<NavLabelCtxValue>({ label: null, setLabel: () => {} })

export function NavLabelProvider({ children }: { children: React.ReactNode }) {
  const [label, setLabel] = useState<string | null>(null)
  return <NavLabelCtx.Provider value={{ label, setLabel }}>{children}</NavLabelCtx.Provider>
}

export function useNavLabel() {
  return useContext(NavLabelCtx)
}

export function NavLabelSync({ label }: { label: string }) {
  const { setLabel } = useNavLabel()
  useEffect(() => {
    setLabel(label)
    return () => { setLabel(null) }
  }, [label, setLabel])
  return null
}
