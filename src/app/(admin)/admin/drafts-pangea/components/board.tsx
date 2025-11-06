'use client'
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd'
import React from 'react'
import { data as dndData, DndType } from '@/app/drafts/data'
import { SectionCard } from './cards'

export function arrayMove<T>(
  array: T[],
  from: number,
  to: number,
) {
  const [item] = array.splice(from, 1)
  array.splice(to, 0, item)
  return array
}

export function moveBwContainers<T>(
  src: T[],
  dest: T[],
  from: number,
  to?: number,
): [T[], T[]] {
  const [item] = src.splice(from, 1);
  if (to === undefined || to === -1) to = dest.length;
  dest.splice(to, 0, item);
  return [src, dest];
}

const computeReorderedData = (data: DndType, result: DropResult<string>) => {
  const { source, destination, type } = result
  if (
    !destination ||
    (source.droppableId === destination.droppableId && source.index === destination.index)
  )
    return data

  const next = structuredClone(data)
  if (type === 'section') {
    const newSectionOrder = arrayMove(next.sectionOrder, source.index, destination.index)
    next.sectionOrder = newSectionOrder
    return next
  }

  if (type === 'sub-section') {
    const srcSec = next.sections[source.droppableId]
    const dstSec = next.sections[destination.droppableId]
    if (srcSec === dstSec) {
      const newSubSecIds = arrayMove(srcSec.subSecIds, source.index, destination.index)

      next.sections[source.droppableId].subSecIds = newSubSecIds
      return next
    }

    const [removedArray, insertedArray] = moveBwContainers(
      srcSec.subSecIds,
      dstSec.subSecIds,
      source.index,
      destination.index
    )
    next.sections[source.droppableId].subSecIds = removedArray
    next.sections[destination.droppableId].subSecIds = insertedArray
    return next
  }

  // type === 'activity'
  const srcSubSec = next.subSections[source.droppableId]
  const dstSubSec = next.subSections[destination.droppableId]

  if (srcSubSec === dstSubSec) {
    const newActivityIds = arrayMove(
      srcSubSec.activityIds,
      source.index,
      destination.index
    )
    next.subSections[source.droppableId].activityIds = newActivityIds
    return next
  }

  const [removedArray, insertedArray] = moveBwContainers(
    srcSubSec.activityIds,
    dstSubSec.activityIds,
    source.index,
    destination.index
  )
  next.subSections[source.droppableId].activityIds = removedArray
  next.subSections[destination.droppableId].activityIds = insertedArray
  return next
}

const PangeaBoard: React.FC<{
  orders: DndType;
  updateOrders: (newOrder: DndType) => void
}> = (props) => {
  const { orders, updateOrders } = props

  return (
    <div className='flex flex-col grow overflow-x-auto items-stretch h-screen p-8'>
      <header className=''>
        Drafts pangea
      </header>
      <DragDropContext onDragEnd={(result) => {
        const newData = computeReorderedData(orders, result)
        updateOrders(newData)
      }}>
        <Droppable droppableId='board' direction='horizontal' type='section'>
          {provided => (
            <div
              className='flex flex-row *:mr-4 select-none min-h-0'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {orders.sectionOrder.map((secId, index) => (
                <SectionCard key={secId} id={secId} index={index} data={orders} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}

export default PangeaBoard
