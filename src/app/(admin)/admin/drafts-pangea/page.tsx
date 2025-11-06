'use client'
// import PangeaBoard from "./components/board";
import dynamic from "next/dynamic"

const PangeaBoard = dynamic(() => import('./components/board'), { ssr: false });

export default function Page() {
  return (
    <PangeaBoard />
  )
}
