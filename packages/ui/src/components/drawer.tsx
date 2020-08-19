import styled from 'styled-components'
import React, { useEffect, useRef } from 'react'

export function useFirstMountState(): boolean {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}

const useUpdateEffect: typeof useEffect = (effect, deps) => {
  const isFirstMount = useFirstMountState()

  useEffect(() => {
    if (!isFirstMount) {
      return effect()
    }
  }, deps)
}

const DrawerWrapper = styled.div<{ open: boolean }>`
  top: 0;
  left: auto;
  right: 0;
  transform: ${({ open }) => (open ? 'none' : 'translateX(100%)')};
  transition: transform 225ms cubic-bezier(0, 0, 0.2, 1);

  position: fixed;
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  height: 100%;
  outline: 0;
  // https://stackoverflow.com/questions/491052/minimum-and-maximum-value-of-z-index
  z-index: 2147483647;
  color: #fff;
  background-color: #333;
`

const ToggleButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translate(-100%, -50%);
  border-radius: 8px 0 0 8px;

  background-color: #d4d4d4;
  width: 30px;
  height: 80px;
  border: none;
  outline: none;
  cursor: pointer;
  transition: all 225ms;
  opacity: 0.7;
  box-shadow: rgba(118, 118, 118, 0.1) -1px 3px 1px 0px;

  &:active {
    transform-origin: right;
    transform: translate(-100%, -50%) scale(1.1);
  }

  &:hover {
    opacity: 1;
    box-shadow: rgba(118, 118, 118, 0.2) -1px 3px 3px 0px;
  }
`

export const Drawer: React.FC<{
  onOpen?: () => void
  onClose?: () => void
}> = ({ onOpen, onClose, children }) => {
  const [open, setOpen] = React.useState(false)

  useUpdateEffect(() => {
    if (open) {
      onOpen?.()
    } else {
      onClose?.()
    }
  }, [open])

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <DrawerWrapper open={open}>
      <ToggleButton onClick={toggleDrawer}></ToggleButton>
      {children}
    </DrawerWrapper>
  )
}
