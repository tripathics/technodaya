import { createContext, useState } from "react";
import { DndType } from "../data";

const BoardDataContext = createContext<{
  data: DndType,
  setData: (data: DndType) => void
}>({
  data: {
    activities: {},
    sections: {},
    subSections: {},
    sectionOrder: []
  },
  setData: () => { }
})

export const BoardDataProvider = ({ dndData, children }: React.PropsWithChildren<{ dndData: DndType }>) => {
  const [data, setData] = useState(dndData)

  return (
    <BoardDataContext.Provider value={{ data, setData }}>
      {children}
    </BoardDataContext.Provider>
  )
}

export default BoardDataContext;
