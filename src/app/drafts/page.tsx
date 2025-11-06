'use client'

import dynamic from "next/dynamic";

import { data } from "./data";
const Board = dynamic(() => import('./components/board'), { ssr: false });

export default function Page() {

  return (
    <div className="flex flex-col h-screen p-4">
      <h1 className="text-2xl font-bold">Draft</h1>
      <Board dndData={data} />
    </div>
  );
}
