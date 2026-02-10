import React, { useRef, useState } from "react";

export default function Sidebar() {
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  const handleDragStart = (event, type) => {
    if (!event || !type) return;
    event.dataTransfer.setData("text/plain", type);
  };


  return (
    <div ref={scrollRef} className="w-60 flex-none h-full overflow-y-auto flex flex-col items-stretch p-0 border-r border-gray-200 bg-gray-50">
      <div className="sticky top-0 z-10 flex flex-wrap border-b border-gray-200 bg-white shadow-sm">
      
      </div>
      <div className="p-2 flex flex-col items-stretch">
      <div ref={(el) => (sectionRefs.current.Motion = el)} className="text-xs font-bold text-gray-700 mt-1 mb-1">Motion</div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "motion_move")}
      >
        {"Move X steps"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "motion_turn")}
      >
        {"Turn X degrees"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "motion_goto")}
      >
        {"Go to x: 0 y: 0"}
      </div>

      <div ref={(el) => (sectionRefs.current.Looks = el)} className="text-xs font-bold text-gray-700 mt-3 mb-1">Looks</div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "looks_say")}
      >
        {"Say hello for 2 seconds"}
      </div>
      <div
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
        draggable
        onDragStart={(event) => handleDragStart(event, "looks_think")}
      >
        {"Think hmm... for 2 seconds"}
      </div>

      <div ref={(el) => (sectionRefs.current.Control = el)} className="text-xs font-bold text-gray-700 mt-3 mb-2">Controls</div>
      <div
        className="flex flex-row flex-wrap items-center bg-red-500 text-white px-3 py-2 my-1.5 text-sm cursor-pointer rounded shadow-sm"
        draggable
        onDragStart={(event) => handleDragStart(event, "control_repeat")}
      >
        <span className="font-medium">Repeat</span>
        <span className="mx-1">5 times</span>
      </div>
      <div
        className="flex flex-row flex-wrap items-center bg-red-500 text-white px-3 py-2 my-1.5 text-sm cursor-pointer rounded shadow-sm"
        draggable
        onDragStart={(event) => handleDragStart(event, "control_wait")}
      >
        <span className="font-medium">Wait</span>
        <span className="mx-1">1 second</span>
      </div>
      <div className="pb-4" />
      </div>
    </div>
  );
}
