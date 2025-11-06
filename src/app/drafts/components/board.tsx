'use client'

import { closestCenter, DndContext, DragOverlay, MeasuringStrategy } from "@dnd-kit/core"
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers"
import { useState } from "react"
import { DndType } from "../data"
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable"
import { ItemType } from './sortable-item'
import { ActivityCard, SortableSectionCard, SubSectionCard, SectionCard, CardProps } from './cards'
import { createPortal } from "react-dom"
import { computeReorderedData, findContainer, moveBwContainers } from "./utils"

const Board: React.FC<{ dndData: DndType }> = ({ dndData }) => {
  const [data, setData] = useState(dndData)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeCardType, setActiveCardType] = useState<ItemType | null>(null)

  const renderDragOverlay = (props: CardProps & { itemType: ItemType }) => {
    if (!props.id || !props.itemType) return null

    const Component = props.itemType === 'section'
      ? SectionCard
      : props.itemType === 'sub-section'
        ? SubSectionCard
        : ActivityCard

    return <Component {...props} />
  }

  return (
    <DndContext
      onDragStart={e => {
        setActiveId(e.active.id as string)
        setActiveCardType(e.active.data.current?.cardType)
      }}
      onDragOver={e => {
        const { active, over } = e;
        if (!over) return [data, false];

        const activeType: ItemType = active.data.current?.cardType
        const overType: ItemType = over.data.current?.cardType
        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeType === 'section') return

        const next = structuredClone(data)

        if (activeType === 'sub-section') {
          const srcSec = findContainer(next, activeId, 'sub-section')
          const dstSec = overType === 'sub-section'
            ? findContainer(next, overId, 'sub-section')
            : overId
          const from = next.sections[srcSec].subSecIds.indexOf(activeId)
          const to = next.sections[dstSec].subSecIds.indexOf(overId)

          if (srcSec === dstSec) return
          const [removed, inserted] = moveBwContainers(
            next.sections[srcSec].subSecIds,
            next.sections[dstSec].subSecIds,
            from,
            to
          )
          next.sections[srcSec].subSecIds = removed
          next.sections[dstSec].subSecIds = inserted
          setData(next)
          return
        }
        if (activeType === 'activity') {
          if (overType === 'section') return

          const srcSubSec = findContainer(next, activeId, "activity");
          const dstSubSec =
            overType === "activity"
              ? findContainer(next, overId, "activity")
              : overId;
          const from = next.subSections[srcSubSec].activityIds.indexOf(activeId);
          const to = next.subSections[dstSubSec].activityIds.indexOf(overId);

          if (srcSubSec === dstSubSec) return

          const [removed, inserted] = moveBwContainers(
            next.subSections[srcSubSec].activityIds,
            next.subSections[dstSubSec].activityIds,
            from,
            to,
          );

          next.subSections[srcSubSec].activityIds = removed;
          next.subSections[dstSubSec].activityIds = inserted;
          setData(next)
          return
        }
      }}
      onDragEnd={e => {
        const [final, changed] = computeReorderedData(data, e)
        if (changed)
          setData(final)
        setActiveId(null)
        setActiveCardType(null)
      }}
      onDragCancel={() => {
        setActiveId(null)
        setActiveCardType(null)
      }}
      collisionDetection={closestCenter}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.WhileDragging,
        },
      }}
    >
      <SortableContext
        items={data.sectionOrder}
        strategy={horizontalListSortingStrategy}
      >
        <div className='flex flex-row gap-4 grow overflow-x-auto'>
          {data.sectionOrder.map(secId => (
            <SortableSectionCard key={secId} id={secId} data={data} />
          ))}
        </div>
      </SortableContext>
      <DragOverlayPortal>
        <DragOverlay>
          {(activeId && activeCardType) && renderDragOverlay({
            id: activeId,
            itemType: activeCardType,
            data
          })}
        </DragOverlay>
      </DragOverlayPortal>
    </DndContext>
  )

}

const DragOverlayPortal = ({ children }: { children: React.ReactNode }) => {
  if (typeof document === 'undefined')
    return null
  return createPortal(
    children,
    document.body
  )
}

export default Board
