import React from "react";
import Sidebar from "./Sidebar";
import MidArea from "./MidArea";
import PreviewArea from "./PreviewArea";

export default function Layout() {
  return (
    <div className="h-screen overflow-hidden flex flex-row">
      {/* Left section */}
      <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
        <Sidebar />
        <MidArea />
      </div>

      {/* Right section */}
      <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
        <PreviewArea />
      </div>
    </div>
  );
}
