import { Draggable, Droppable } from '@hello-pangea/dnd'
import React from 'react'
import { DndType } from '@/app/drafts/data'
import { CheckIcon, DragHandleDots2Icon, Pencil1Icon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'

export type CardProps = { id: string; index: number; data: DndType }
export const SectionCard: React.FC<CardProps> = React.memo(props => {
  const section = props.data.sections[props.id]

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided, _snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="shrink-0 bg-gray-50 flex-1 h-full flex flex-col rounded-sm overflow-clip min-w-96 w-96 border border-solid border-gray-300">
          <div
            {...provided.dragHandleProps}
            className="flex flex-row gap-2 justify-between items-start w-full p-6"
          >
            <h4 className='font-semibold '>{section.title}</h4>
            <DragHandleDots2Icon className='shrink-0' />
          </div>
          <Droppable direction='vertical' droppableId={section.id} type="sub-section">
            {(provided, _snapshot) => (
              <div className='overflow-y-auto grow px-6 pb-6 flex flex-col *:mb-4'
                ref={provided.innerRef} >
                {section.subSecIds.map((subSecId, index) => (
                  <SubSectionCard key={subSecId} data={props.data} id={subSecId} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
})

export const SubSectionCard: React.FC<CardProps> = React.memo(props => {
  const subSection = props.data.subSections[props.id]
  const [activitiesSortable, setActivitiesSortable] = React.useState(false)

  return (
    <Draggable draggableId={props.id} index={props.index}>
      {(provided, _snapshot) => (
        <div className={cn('flex flex-col bg-white rounded-sm border border-solid h-36 min-h-36 border-gray-500', {
          'min-h-fit h-max': activitiesSortable,
          'overflow-hidden': !activitiesSortable,
        })}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div className="flex justify-between gap-2 items-start">
            <div {...provided.dragHandleProps} className="text-left flex gap-1 grow items-start p-4">
              <DragHandleDots2Icon className="shrink-0" />
              <h5 className='text-xs font-medium'>{subSection.title}</h5>
            </div>
            <button className="p-4" onClick={() => setActivitiesSortable(prev => !prev)}>
              {activitiesSortable ? <CheckIcon /> : <Pencil1Icon />}
            </button>
          </div>
          <Droppable droppableId={subSection.id} type='activity' isDropDisabled={!activitiesSortable}>
            {(provided, _snapshot) => (
              <div className='grow flex flex-col *:mb-2 overflow-hidden px-4 pb-4'
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {subSection.activityIds.map((activityId, index) => (
                  <ActivityCard key={activityId} data={props.data} id={activityId} index={index} isDragDisabled={!activitiesSortable} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  )
})

export const ActivityCard: React.FC<CardProps & { isDragDisabled?: boolean }> = React.memo(props => {
  const activity = props.data.activities[props.id]

  return (
    <Draggable draggableId={props.id} index={props.index} isDragDisabled={props.isDragDisabled}>
      {(provided, _snapshot) => (
        <div className='p-1 border border-solid border-gray-400 bg-gray-50 rounded-sm'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p className='text-xs line-clamp-2'>{activity.content}</p>
          <div className='*:text-xs flex justify-between items-end'>
            <span>{activity.author}</span>
            <time className="font-mono text-xs">
              {new Date(activity.createdInSeconds).toLocaleDateString('en-in', { dateStyle: 'medium' })}
            </time>
          </div>
        </div>
      )}
    </Draggable>
  )
})

