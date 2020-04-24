import React from 'react'
import { useLocation } from 'react-router-dom'
import { GlowingWrapper } from '../styled'

export const LinkableContext = React.createContext({ active: false, onInitCallback: fn => {}, id: '' })

export default function LinkableComponent({ children, id }) {
  const location = useLocation()
  const wrapperRef = React.useRef<HTMLElement>(null)
  const [initialized, setInitialized] = React.useState(false)
  const glow = location.hash === `#${id}`
  const onInitCallback = React.useCallback(
    (fn: Function) => {
      if (initialized) return

      if (fn) {
        fn()
      }

      setInitialized(true)
    },
    [initialized],
  )
  const value = React.useMemo(
    () => ({
      active: glow,
      onInitCallback,
      id,
    }),
    [glow, onInitCallback, id],
  )

  React.useEffect(() => {
    if (glow && wrapperRef && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [glow])

  return (
    <LinkableContext.Provider value={value}>
      <GlowingWrapper ref={wrapperRef} glow={glow}>
        {children}
      </GlowingWrapper>
    </LinkableContext.Provider>
  )
}
