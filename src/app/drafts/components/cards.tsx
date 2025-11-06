'use client'

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { DndType } from "../data"
import SortableItem, { ItemType, UseSortableChildrenProps } from "./sortable-item"
import { CheckIcon, DragHandleDots2Icon, Pencil1Icon } from "@radix-ui/react-icons"

import React from "react"
import { cn } from "@/lib/utils"

export type CardProps = Partial<UseSortableChildrenProps> & {
  id: string;
  data: DndType
}

export const SectionCard: React.FC<CardProps> = (props) => {
  const { id, listeners, data } = props
  const section = data.sections[id]

  return (
    <div className="bg-gray-50 flex-1 h-full flex flex-col select-none rounded-sm overflow-clip w-96 border border-solid border-gray-300">
      <div {...listeners} className="flex flex-row gap-2 justify-between items-start w-full p-6">
        <h4 className='font-semibold'>{section.title}</h4>
        <button>
          <DragHandleDots2Icon />
        </button>
      </div>
      <SortableContext strategy={verticalListSortingStrategy} items={section.subSecIds}>
        <div className='overflow-y-auto grow px-6 pb-6 flex flex-col gap-4'>
          {section.subSecIds.map(subSecId => (
            <SortableSubSectionCard
              key={subSecId}
              id={subSecId}
              data={data}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export const SubSectionCard: React.FC<CardProps> = (props) => {
  const { id, data, listeners } = props
  const subSection = data.subSections[id]

  const [activitiesSortable, setActivitiesSortable] = React.useState(false)
  return (
    <div className={cn('flex flex-col bg-white rounded-sm border border-solid border-gray-500 min-h-36 h-36 overflow-hidden', {
      'h-max overflow-auto': activitiesSortable
    })}>
      <div className="flex justify-between gap-2 items-start">
        <div {...listeners} className="flex gap-1 grow items-start p-4">
          <DragHandleDots2Icon className="shrink-0" />
          <h5 className='text-xs font-medium select-none'>
            {subSection.title}
          </h5>
        </div>
        <button className="p-4" onClick={() => setActivitiesSortable(prev => !prev)}>
          {activitiesSortable ? <CheckIcon /> : <Pencil1Icon />}
        </button>
      </div>
      <SortableContext strategy={verticalListSortingStrategy} items={subSection.activityIds} disabled={!activitiesSortable}>
        <div className='grow flex flex-col gap-2 overflow-hidden px-4 pb-4'>
          {subSection.activityIds.map(activityId => (
            <SortableActivityCard
              key={activityId}
              id={activityId}
              data={data}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

export const ActivityCard: React.FC<CardProps> = (props) => {
  const { id, data, listeners } = props
  const { author, createdInSeconds, content } = data.activities[id]
  return (
    <div {...listeners} className='p-1 border border-solid border-gray-400 bg-gray-50 rounded-sm'>
      <p className='text-xs line-clamp-2'>{content}</p>
      <div className='*:text-xs flex justify-between items-end'>
        <span>{author}</span>
        <time className="font-mono text-xs">
          {new Date(createdInSeconds).toLocaleDateString('en-in', { dateStyle: 'medium' })}
        </time>
      </div>
    </div>
  )
}

export const SortableSectionCard: React.FC<CardProps> = (props) => (
  <SortableItem id={props.id} cardType='section'>
    {(sortableProps) => (
      <SectionCard {...props} {...sortableProps} />
    )}
  </SortableItem>
)

const SortableSubSectionCard: React.FC<CardProps> = (props) => (
  <SortableItem id={props.id} cardType='sub-section'>
    {(sortableProps) => (
      <SubSectionCard {...props} {...sortableProps} />
    )}
  </SortableItem>
)

const SortableActivityCard: React.FC<CardProps> = (props) => (
  <SortableItem id={props.id} cardType='activity'>
    {(sortableProps) => (
      <ActivityCard {...props} {...sortableProps} />
    )}
  </SortableItem>
)

const PlaceholderCard: React.FC<{ itemType: ItemType }> = ({ itemType }) => {
  const messageText = {
    'activity': 'Drop an activity here',
    'sub-section': 'Drop a sub-section here',
    'section': 'Drop a section here'
  }
  return (
    <div className='flex items-center justify-center border-2 border-dashed border-gray-400 rounded-sm grow min-h-36'>
      <p className="text-center text-gray-500 mt-3 text-xs">{messageText[itemType]}</p>
    </div>
  )
}
