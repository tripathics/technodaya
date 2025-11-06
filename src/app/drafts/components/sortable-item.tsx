'use client'

import { useSortable, UseSortableArguments, AnimateLayoutChanges, defaultAnimateLayoutChanges } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type ItemType = 'section' | 'sub-section' | 'activity'
export type HandleListenerType = ReturnType<typeof useSortable>['listeners']
export type UseSortableChildrenProps = {
  listeners: HandleListenerType;
  isOver?: boolean;
  isDragging?: boolean;
  disabled?: boolean;
}

const animateLayoutChanges: AnimateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

const SortableItem: React.FC<UseSortableArguments & {
  children: (props: UseSortableChildrenProps) => React.ReactNode;
  cardType: ItemType;
  element?: React.JSX.ElementType;
}> = (props) => {
  const { element, children, cardType, ...restProps } = props;
  const { setNodeRef, listeners, attributes, isDragging, transition, transform, isOver } = useSortable({
    ...restProps,
    data: { cardType },
    animateLayoutChanges
  })
  const Element = props.element || 'div'

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.25 : 1,
    transition
  }

  return (
    <Element ref={setNodeRef} {...attributes} style={style}>
      {children({ listeners, isOver, isDragging })}
    </Element>
  )
}

export default SortableItem;
