import React from "react";
import Icon from "./Icon";
import Button from "../common/Button";

export default function MidArea({
  scripts,
  sprites,
  activeScriptId,
  onSelectScript,
  onAddCat,
  onDropBlock,
  onChangeBlockValue,
  onRemoveSprite,
  onRemoveBlock,
}) {
  const activeScript =
    scripts && scripts.find((script) => script.id === activeScriptId);

  const scriptsBySprite = {};
  sprites.forEach((sprite) => {
    scriptsBySprite[sprite.id] = scripts.filter(
      (s) => s.spriteId === sprite.id
    );
  });

  const handleAddCatClick = () => {
    if (typeof onAddCat === "function") {
      onAddCat();
    }
  };

 

  const handleRemoveSpriteClick = (spriteId, event) => {
    if (event) {
      event.stopPropagation();
    }
    if (typeof onRemoveSprite === "function") {
      onRemoveSprite(spriteId);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("text/plain");
    if (typeof onDropBlock === "function") {
      onDropBlock(type);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleStepsChange = (blockId, event) => {
    const value = event.target.value;
    const numberValue = parseInt(value, 10) || 0;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { steps: numberValue });
    }
  };

  const handleDegreesChange = (blockId, event) => {
    const value = event.target.value;
    const numberValue = parseInt(value, 10) || 0;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { degrees: numberValue });
    }
  };

  const handleGotoChange = (blockId, field, event) => {
    const value = event.target.value;
    const numberValue = parseInt(value, 10) || 0;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { [field]: numberValue });
    }
  };

  const handleRepeatChange = (blockId, event) => {
    const value = event.target.value;
    const numberValue = parseInt(value, 10) || 0;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { times: numberValue });
    }
  };

  const handleWaitSecondsChange = (blockId, event) => {
    const value = event.target.value;
    const numberValue = parseFloat(value) || 0;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { seconds: numberValue });
    }
  };

  const handleLooksTextChange = (blockId, event) => {
    const value = event.target.value;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { text: value });
    }
  };

  const handleLooksSecondsChange = (blockId, event) => {
    const value = event.target.value;
    const numberValue = parseFloat(value) || 0;

    if (typeof onChangeBlockValue === "function") {
      onChangeBlockValue(blockId, { seconds: numberValue });
    }
  };

  const handleRemoveBlockClick = (blockId) => {
    if (typeof onRemoveBlock === "function") {
      onRemoveBlock(blockId);
    }
  };

  return (
    <div className="flex-1 h-full overflow-auto flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-gray-200">
        <div className="flex items-center space-x-2 flex-wrap">
          {sprites &&
            sprites.map((sprite) => {
              const spriteScripts = scriptsBySprite[sprite.id] || [];
              return (
                <div key={sprite.id} className="flex items-center space-x-1">
                  {spriteScripts.map((script) => (
                    <button
                      key={script.id}
                      onClick={() =>
                        typeof onSelectScript === "function" &&
                        onSelectScript(script.id)
                      }
                      className={`px-3 py-1 text-xs rounded-t flex items-center space-x-1 ${
                        script.id === activeScriptId
                          ? "bg-white border border-b-white border-gray-300 font-semibold"
                          : "bg-gray-100 border border-gray-200 text-gray-600"
                      }`}
                    >
                      <span>Sprite {sprite.id}</span>
                    </button>
                  ))}
                  {sprites.length > 1 && (
                    <span
                      onClick={(event) =>
                        handleRemoveSpriteClick(sprite.id, event)
                      }
                      className="ml-1 text-[10px] leading-none px-1 rounded hover:bg-red-200 cursor-pointer"
                    >
                      ×
                    </span>
                  )}
                </div>
              );
            })}
        </div>
        <div className="flex items-center space-x-2">
       
          <Button variant="primary" onClick={handleAddCatClick}>
            Add cat sprite
          </Button>
        </div>
      </div>

      <div
        className="flex-1 p-4 bg-gray-50"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {!activeScript || activeScript.blocks.length === 0 ? (
          <div className="text-gray-400 text-sm">
            Drag blocks from the sidebar into this area.
          </div>
        ) : (
          <div className="space-y-2">
            {activeScript.blocks.map((block) => {
              if (block.type === "event_when_flag_clicked") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-yellow-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      {"When "}
                      <Icon
                        name="flag"
                        size={15}
                        className="text-green-600 mx-2"
                      />
                      {"clicked"}
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-yellow-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "motion_move") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-blue-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Move</span>
                      <input
                        type="number"
                        value={block.steps ?? 0}
                        onChange={(event) =>
                          handleStepsChange(block.id, event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>steps</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-blue-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "motion_turn") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-blue-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Turn</span>
                      <input
                        type="number"
                        value={block.degrees ?? 0}
                        onChange={(event) =>
                          handleDegreesChange(block.id, event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>degrees</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-blue-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "motion_goto") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-blue-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Go to x:</span>
                      <input
                        type="number"
                        value={block.x ?? 0}
                        onChange={(event) =>
                          handleGotoChange(block.id, "x", event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>y:</span>
                      <input
                        type="number"
                        value={block.y ?? 0}
                        onChange={(event) =>
                          handleGotoChange(block.id, "y", event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-blue-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "control_repeat") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-red-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Repeat</span>
                      <input
                        type="number"
                        value={block.times ?? 5}
                        onChange={(event) =>
                          handleRepeatChange(block.id, event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>times</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "control_wait") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-red-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Wait</span>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={block.seconds ?? 1}
                        onChange={(event) =>
                          handleWaitSecondsChange(block.id, event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>seconds</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "looks_say") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-purple-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Say</span>
                      <input
                        type="text"
                        value={block.text ?? ""}
                        onChange={(event) =>
                          handleLooksTextChange(block.id, event)
                        }
                        className="mx-1 text-xs text-black rounded px-1 py-0.5"
                        placeholder="hello"
                      />
                      <span>for</span>
                      <input
                        type="number"
                        value={block.seconds ?? 2}
                        onChange={(event) =>
                          handleLooksSecondsChange(block.id, event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>seconds</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-purple-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              if (block.type === "looks_think") {
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between bg-purple-500 text-white px-2 py-1 text-sm"
                  >
                    <div className="flex items-center">
                      <span>Think</span>
                      <input
                        type="text"
                        value={block.text ?? ""}
                        onChange={(event) =>
                          handleLooksTextChange(block.id, event)
                        }
                        className="mx-1 text-xs text-black rounded px-1 py-0.5"
                        placeholder="hmm..."
                      />
                      <span>for</span>
                      <input
                        type="number"
                        value={block.seconds ?? 2}
                        onChange={(event) =>
                          handleLooksSecondsChange(block.id, event)
                        }
                        className="w-16 mx-1 text-xs text-black rounded px-1 py-0.5"
                      />
                      <span>seconds</span>
                    </div>
                    <button
                      onClick={() => handleRemoveBlockClick(block.id)}
                      className="ml-2 text-xs px-1 rounded hover:bg-purple-600"
                    >
                      ×
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={block.id}
                  className="flex items-center justify-between bg-gray-300 text-gray-700 px-2 py-1 text-xs rounded"
                >
                  <span>{block.type}</span>
                  <button
                    onClick={() => handleRemoveBlockClick(block.id)}
                    className="ml-2 text-[10px] px-1 rounded hover:bg-gray-400"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

