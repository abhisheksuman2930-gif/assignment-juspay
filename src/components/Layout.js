import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MidArea from "./MidArea";
import PreviewArea from "./PreviewArea";
import { createBlock } from "../utils/blocks";
import {
  getNextSpriteId,
  getNextScriptId,
} from "../utils/sprites";

export default function Layout() {
  const [sprites, setSprites] = useState([
    {
      id: 1,
      x: 40,
      y: 40,
      originX: 40,
      originY: 40,
      directionMultiplier: 1,
      initialX: 40,
      initialY: 40,
      initialDirection: 0,
      initialDirectionMultiplier: 1,
    },
  ]);

  const [scripts, setScripts] = useState([
    {
      id: 1,
      spriteId: 1,
      name: "Script 1",
      blocks: [],
    },
  ]);

  const [activeScriptId, setActiveScriptId] = useState(1);

  const handleAddCat = () => {
    const nextSpriteId = getNextSpriteId(sprites, scripts);
    const nextScriptId = getNextScriptId(scripts);

    setSprites((oldSprites) => [
      ...oldSprites,
      {
        id: nextSpriteId,
        x: 60,
        y: 60,
        originX: 60,
        originY: 60,
        directionMultiplier: 1,
        initialX: 60,
        initialY: 60,
        initialDirection: 0,
        initialDirectionMultiplier: 1,
      },
    ]);

    setScripts((oldScripts) => [
      ...oldScripts,
      {
        id: nextScriptId,
        spriteId: nextSpriteId,
        name: `Script 1`,
        blocks: [],
      },
    ]);

    setActiveScriptId(nextScriptId);
  };

  const handleMoveSprite = (id, x, y) => {
    setSprites((oldSprites) =>
      oldSprites.map((sprite) =>
        sprite.id === id ? { ...sprite, x, y } : sprite
      )
    );
  };

  const handleDropBlock = (type) => {
    if (!type) return;

    setScripts((oldScripts) =>
      oldScripts.map((script) => {
        if (script.id !== activeScriptId) {
          return script;
        }

        const nextBlockId = script.blocks.length
          ? Math.max(...script.blocks.map((b) => b.id)) + 1
          : 1;

        const newBlock = createBlock(type, nextBlockId);

        return {
          ...script,
          blocks: [...script.blocks, newBlock],
        };
      })
    );
  };

  const handleChangeBlockValue = (blockId, changes) => {
    if (!blockId || !changes) return;

    setScripts((oldScripts) =>
      oldScripts.map((script) => {
        if (script.id !== activeScriptId) {
          return script;
        }

        const newBlocks = script.blocks.map((block) =>
          block.id === blockId ? { ...block, ...changes } : block
        );

        return {
          ...script,
          blocks: newBlocks,
        };
      })
    );
  };


  const handleRemoveBlock = (blockId) => {
    if (!blockId) {
      return;
    }

    setScripts((oldScripts) =>
      oldScripts.map((script) => {
        if (script.id !== activeScriptId) {
          return script;
        }

        return {
          ...script,
          blocks: script.blocks.filter((block) => block.id !== blockId),
        };
      })
    );
  };

const handlePlay=()=>{

}

  return (
    <div className="h-screen overflow-hidden flex flex-row">
      <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
        <Sidebar />
        <MidArea
          scripts={scripts}
          sprites={sprites}
          activeScriptId={activeScriptId}
          onSelectScript={setActiveScriptId}
          onAddCat={handleAddCat}
          onDropBlock={handleDropBlock}
          onChangeBlockValue={handleChangeBlockValue}
          onRemoveBlock={handleRemoveBlock}
        />
      </div>
      <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
        <PreviewArea
          sprites={sprites}
          onMoveSprite={handleMoveSprite}
          onPlay={handlePlay}
        
        />
      </div>
    </div>
  );
}

