import React, { useEffect, useRef, useState } from "react";
import CatSprite from "./CatSprite";
import Button from "../common/Button";
import { SPRITE_HEIGHT, SPRITE_WIDTH } from "../constant";

export default function PreviewArea({ sprites, onMoveSprite, onPlay, onReload }) {
  const areaRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [playDisabled, setPlayDisabled] = useState(false);

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
 
  };

  useEffect(() => {
    return () => {
      if (playCooldownRef.current) clearTimeout(playCooldownRef.current);
    };
  }, []);

  const handleReloadClick = () => {
    if (typeof onReload === "function") {
      onReload();
    }
  };

  return (
    <div className="flex-1 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="text-sm font-semibold">Preview</div>
        <div className="flex items-center space-x-2">
          <Button variant="secondary" onClick={handleReloadClick}>
            Reload
          </Button>
          <Button variant="success" onClick={handlePlayClick} disabled={playDisabled}>
            Play
          </Button>
        </div>
      </div>
      <div
        ref={areaRef}
        className="flex-1 bg-gray-50 relative overflow-hidden"
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
              <div
                className="absolute bottom-0 left-1/2 mt-0.5 text-xs font-medium text-gray-600 whitespace-nowrap"
                style={{
                  transform: `translate(-50%, 100%) rotate(${-(sprite.direction || 0)}deg)`,
                }}
              >
                Cat {sprite.id}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
