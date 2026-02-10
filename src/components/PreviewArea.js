import React, { useEffect, useRef, useState } from "react";
import CatSprite from "./CatSprite";
import { SPRITE_HEIGHT, SPRITE_WIDTH } from "../constant";

export default function PreviewArea({ sprites, activeSpriteId, onSelectSprite, onRunSpriteScript, onMoveSprite, onPlay, onReload, onStageSizeChange }) {
  const areaRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [playDisabled, setPlayDisabled] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  const selectedSprite =
    activeSpriteId != null
      ? sprites?.find((s) => s.id === activeSpriteId)
      : null;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!draggingId || !areaRef.current) return;
      if (typeof onMoveSprite !== "function") return;

      const rect = areaRef.current.getBoundingClientRect();
      let x = event.clientX - rect.left - dragOffset.x;
      let y = event.clientY - rect.top - dragOffset.y;

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > rect.width - SPRITE_WIDTH) x = rect.width - SPRITE_WIDTH;
      if (y > rect.height - SPRITE_HEIGHT) y = rect.height - SPRITE_HEIGHT;

      onMoveSprite(draggingId, x, y);
    };

    const handleMouseUp = () => {
      if (draggingId) {
        setDraggingId(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingId, dragOffset, onMoveSprite]);

  const handleMouseDown = (id, event) => {
    if (!areaRef.current) return;

    if (typeof onSelectSprite === "function") {
      onSelectSprite(id);
    }
    if (typeof onRunSpriteScript === "function") {
      onRunSpriteScript(id);
    }

    const rect = areaRef.current.getBoundingClientRect();
    const sprite = sprites.find((item) => item.id === id);

    if (!sprite) return;

    const offsetX = event.clientX - rect.left - sprite.x;
    const offsetY = event.clientY - rect.top - sprite.y;

    setDragOffset({ x: offsetX, y: offsetY });
    setDraggingId(id);
  };

  const playCooldownRef = useRef(null);

  const handlePlayClick = () => {
    if (playDisabled || typeof onPlay !== "function") return;
    setPlayDisabled(true);
    onPlay();
    if (playCooldownRef.current) clearTimeout(playCooldownRef.current);
    playCooldownRef.current = setTimeout(() => setPlayDisabled(false), 500);
  };

  useEffect(() => {
    return () => {
      if (playCooldownRef.current) clearTimeout(playCooldownRef.current);
    };
  }, []);

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      const w = Math.floor(width);
      const h = Math.floor(height);
      setStageSize({ width: w, height: h });
      if (typeof onStageSizeChange === "function") onStageSizeChange(w, h);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [onStageSizeChange]);

  const handleReloadClick = () => {
    if (typeof onReload === "function") {
      onReload();
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col">
      <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200">
        <div className="text-sm font-semibold text-gray-700">Preview</div>
      </div>
      <div className="flex-shrink-0 min-h-12 bg-black flex flex-col justify-center px-5 py-2 border-b border-gray-800">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 font-mono text-sm text-white tracking-wide">
            <span className="flex items-center gap-1.5">
              <span className="text-gray-400 text-xs uppercase">x</span>
              <span className="font-semibold tabular-nums">
                {selectedSprite != null ? Math.round(selectedSprite.x) : "—"}
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-gray-400 text-xs uppercase">y</span>
              <span className="font-semibold tabular-nums">
                {selectedSprite != null ? Math.round(selectedSprite.y) : "—"}
              </span>
            </span>
            {selectedSprite != null && (
              <span className="text-gray-500 text-xs ml-1">
                (Cat {selectedSprite.id})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReloadClick}
            className="h-8 px-4 rounded-md text-xs font-medium text-white bg-gray-700 border border-gray-600 hover:bg-gray-600 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-black"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={handlePlayClick}
            disabled={playDisabled}
            className="h-8 px-4 rounded-md text-xs font-medium text-black bg-white border border-gray-400 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
          >
            Play
          </button>
        </div>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 relative overflow-hidden min-h-0 flex">
        {stageSize.width > 0 && stageSize.height > 0 && (
          <div className="w-1 flex-shrink-0 bg-gray-200/90 border-r border-gray-300 pointer-events-none" />
        )}

        <div className="flex-1 flex flex-col min-w-0">
          {stageSize.width > 0 && stageSize.height > 0 && (
            <div className="h-1 flex-shrink-0 bg-gray-200/90 border-b border-gray-300 pointer-events-none" />
          )}

          <div
            ref={areaRef}
            className="flex-1 relative overflow-hidden min-h-0"
          >
            {sprites &&
              sprites.map((sprite) => (
                <div
                  key={sprite.id}
                  style={{
                    position: "absolute",
                    left: sprite.x,
                    top: sprite.y,
                    cursor: "grab",
                    transform: `rotate(${sprite.direction || 0}deg)`,
                    transformOrigin: "center center",
                  }}
                  onMouseDown={(event) => handleMouseDown(sprite.id, event)}
                >
                  {sprite.sayText && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow">
                      {sprite.sayText}
                    </div>
                  )}
                  {sprite.thinkText && !sprite.sayText && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-black text-xs px-2 py-1 rounded shadow italic">
                      {sprite.thinkText}
                    </div>
                  )}
                  <CatSprite />
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-0.5 text-[10px] text-gray-600 font-medium whitespace-nowrap pointer-events-none">
                    Cat {sprite.id}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
