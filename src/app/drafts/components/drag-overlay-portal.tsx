import { createPortal } from "react-dom"

export const DragOverlayPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined')
    return null
  return createPortal(
    children,
    document.body
  )
}

