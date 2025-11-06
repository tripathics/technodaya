import { DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { DndType } from "../data";
import { ItemType } from "./sortable-item";
import { arrayMove } from "@dnd-kit/sortable";

export const findContainer = (
  data: DndType,
  id: string,
  itemType: ItemType,
) => {
  let containers = null;
  let lsName: "subSecIds" | "activityIds" | null = null;
  if (itemType === "sub-section") {
    containers = data.sections;
    lsName = "subSecIds";
  } else if (itemType === "activity") {
    containers = data.subSections;
    lsName = "activityIds";
  }
  if (!containers || !lsName) return null;
  return Object.values(containers).find((section) =>
    section[lsName].includes(id),
  )?.id;
};

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

export const computeReorderedData = (
  data: DndType,
  e: DragOverEvent | DragEndEvent,
): [DndType, boolean] => {
  const { active, over } = e;
  if (!over) return [data, false];

  const activeType: ItemType = active.data.current?.cardType;
  const overType: ItemType = over.data.current?.cardType;
  const activeId = active.id as string;
  const overId = over.id as string;

  if (activeId === overId && activeType === overId) return [data, false];

  const next = structuredClone(data);

  if (activeType === "section") {
    const from = next.sectionOrder.indexOf(activeId);
    const to = next.sectionOrder.indexOf(overId);

    if (from !== to) next.sectionOrder = arrayMove(next.sectionOrder, from, to);
    return [next, from !== to];
  }

  if (activeType === "sub-section") {
    const srcSec = findContainer(next, activeId, "sub-section");
    const dstSec =
      overType === "sub-section"
        ? findContainer(next, overId, "sub-section")
        : overId;

    const from = next.sections[srcSec].subSecIds.indexOf(activeId);
    const to = next.sections[dstSec].subSecIds.indexOf(overId);
    if (srcSec === dstSec) {
      if (from !== to && to !== -1) {
        next.sections[srcSec].subSecIds = arrayMove(
          next.sections[srcSec].subSecIds,
          from,
          to,
        );
      }
    } else {
      const [removed, inserted] = moveBwContainers(
        next.sections[srcSec].subSecIds,
        next.sections[dstSec].subSecIds,
        from,
        to,
      );
      next.sections[srcSec].subSecIds = removed;
      next.sections[dstSec].subSecIds = inserted;
    }
    return [next, srcSec !== dstSec || from !== to];
  }

  if (activeType === "activity") {
    if (overType === "section") return [data, false];

    const srcSubSec = findContainer(next, activeId, "activity");
    const dstSubSec =
      overType === "activity"
        ? findContainer(next, overId, "activity")
        : overId;

    const from = next.subSections[srcSubSec].activityIds.indexOf(activeId);
    const to = next.subSections[dstSubSec].activityIds.indexOf(overId);

    if (srcSubSec === dstSubSec) {
      next.subSections[srcSubSec].activityIds = arrayMove(
        next.subSections[srcSubSec].activityIds,
        from,
        to,
      );
    } else {
      const [removed, inserted] = moveBwContainers(
        next.subSections[srcSubSec].activityIds,
        next.subSections[dstSubSec].activityIds,
        from,
        to,
      );
      next.subSections[srcSubSec].activityIds = removed;
      next.subSections[dstSubSec].activityIds = inserted;
    }
    return [next, from !== to || srcSubSec !== dstSubSec];
  }

  return [data, false];
};
