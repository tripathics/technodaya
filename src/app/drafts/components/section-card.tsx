'use client'

import { useSortable } from "@dnd-kit/sortable"

const SectionCard = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

  const style = {
    transform: `translate3d(${transform?.x}px, ${transform?.y}px, 0)`,
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="border p-4 mb-2 bg-white rounded shadow"
    >
      Section {id}
    </div>
  )
}

export default SectionCard
