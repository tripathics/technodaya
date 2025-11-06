'use client'

import { DndContext } from "@dnd-kit/core";

export default function Page() {
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4 p-2">Draft</h1>
      <div>
        <DndContext>
        </DndContext>
      </div>
    </div>
  );
}
