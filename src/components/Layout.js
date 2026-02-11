import React, { useState, useRef } from "react";
import Sidebar from "./Sidebar";
import MidArea from "./MidArea";
import PreviewArea from "./PreviewArea";
import {
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  GOTO_DELAY_MS,
  MOVE_STEP_DELAY_MS,
  TURN_DELAY_MS,
} from "../constant";
import { createBlock } from "../utils/blocks";
import {
  getNextSpriteId,
  getNextScriptId,
  applyGotoOffset,
  detectCollisionPair,
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
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stopRequestedRef = useRef(false);

  const clampPosition = (x, y) => {
    if (stageSize.width <= 0 || stageSize.height <= 0) return { x, y };
    const maxX = Math.max(0, stageSize.width - SPRITE_WIDTH);
    const maxY = Math.max(0, stageSize.height - SPRITE_HEIGHT);
    return {
      x: Math.max(0, Math.min(maxX, x)),
      y: Math.max(0, Math.min(maxY, y)),
    };
  };

  const MIN_CAT_SPACING = 30;

  const handleAddCat = () => {
    const nextSpriteId = getNextSpriteId(sprites, scripts);
    const nextScriptId = getNextScriptId(scripts);

    setSprites((oldSprites) => {
      if (oldSprites.length === 0) {
        const newX = 40;
        const newY = 40;
        return [
          {
            id: nextSpriteId,
            x: newX,
            y: newY,
            originX: newX,
            originY: newY,
            directionMultiplier: 1,
            initialX: newX,
            initialY: newY,
            initialDirection: 0,
            initialDirectionMultiplier: 1,
          },
        ];
      }

      const bottommostEdge = Math.max(
        ...oldSprites.map((s) => s.y + SPRITE_HEIGHT)
      );
      const maxY = Math.max(...oldSprites.map((s) => s.y));
      const ROW_Y_TOLERANCE = 50;
      const bottomRowSprites = oldSprites.filter(
        (s) => s.y >= maxY - ROW_Y_TOLERANCE
      );
      const rightmostEdgeOnBottomRow = Math.max(
        ...bottomRowSprites.map((s) => s.x + SPRITE_WIDTH)
      );

      let newX = rightmostEdgeOnBottomRow + MIN_CAT_SPACING;
      let newY = maxY;

      const fitsOnCurrentRow =
        stageSize.width <= 0 ||
        newX + SPRITE_WIDTH <= stageSize.width;

      if (!fitsOnCurrentRow) {
        newX = 40;
        newY = bottommostEdge + MIN_CAT_SPACING;
      }

      if (stageSize.width > 0) {
        newX = Math.min(newX, stageSize.width - SPRITE_WIDTH);
      }
      if (stageSize.height > 0) {
        newY = Math.min(newY, stageSize.height - SPRITE_HEIGHT);
      }
      newX = Math.max(0, newX);
      newY = Math.max(0, newY);

      return [
        ...oldSprites,
        {
          id: nextSpriteId,
          x: newX,
          y: newY,
          originX: newX,
          originY: newY,
          directionMultiplier: 1,
          initialX: newX,
          initialY: newY,
          initialDirection: 0,
          initialDirectionMultiplier: 1,
        },
      ];
    });

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

  const handleReload = () => {
    stopRequestedRef.current = true;
    setSprites([
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
    setScripts([
      {
        id: 1,
        spriteId: 1,
        name: "Script 1",
        blocks: [],
      },
    ]);
    setActiveScriptId(1);
  };

  const handleMoveSprite = (id, x, y) => {
    const { x: cx, y: cy } = clampPosition(x, y);
    setSprites((oldSprites) =>
      oldSprites.map((sprite) =>
        sprite.id === id ? { ...sprite, x: cx, y: cy } : sprite
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

  const handleClearActiveScript = () => {
    if (!activeScriptId) {
      return;
    }

    setScripts((oldScripts) =>
      oldScripts.map((script) =>
        script.id === activeScriptId ? { ...script, blocks: [] } : script
      )
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

  const handleRemoveSprite = (spriteIdToRemove) => {
    if (!spriteIdToRemove) {
      return;
    }

    if (sprites.length <= 1) {
      return;
    }

    const remainingSprites = sprites.filter(
      (sprite) => sprite.id !== spriteIdToRemove
    );
    const remainingScriptsList = scripts.filter(
      (script) => script.spriteId !== spriteIdToRemove
    );

    if (!remainingSprites.length) {
      return;
    }

    setSprites(remainingSprites);
    setScripts(remainingScriptsList);

    const activeScript = scripts.find((s) => s.id === activeScriptId);
    const stillHasActive =
      activeScript && activeScript.spriteId !== spriteIdToRemove;

    if (!stillHasActive && remainingScriptsList.length > 0) {
      setActiveScriptId(remainingScriptsList[0].id);
    }
  };

  const activeScript = scripts.find((s) => s.id === activeScriptId);
  const activeSpriteId =
    activeScript?.spriteId ?? sprites[0]?.id ?? null;

  const handleSelectSprite = (spriteId) => {
    const scriptForSprite = scripts.find((s) => s.spriteId === spriteId);
    if (scriptForSprite) {
      setActiveScriptId(scriptForSprite.id);
    }
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

  const handlePlay = (optionalSpriteId) => {
    if (!sprites.length || !scripts.length) {
      return;
    }

    stopRequestedRef.current = false;
    const onlySpriteIds = optionalSpriteId ? [optionalSpriteId] : undefined;

    const moveDirection = {};
    let hasSwappedOnce = false;

    const wait = (ms) =>
      new Promise((resolve) => {
        setTimeout(resolve, ms);
      });

    const checkCollisionAndSwapDirectionsAndScripts = (currentSprites) => {
      if (hasSwappedOnce) {
        return;
      }

      if (!currentSprites || currentSprites.length < 2) {
        return;
      }

      const pair = detectCollisionPair(currentSprites);
      if (!pair) {
        return;
      }

      const { first, second } = pair;
      const idA = first.id;
      const idB = second.id;

      const dirA = moveDirection[idA] ?? 1;
      const dirB = moveDirection[idB] ?? -1;
      moveDirection[idA] = dirB;
      moveDirection[idB] = dirA;

      const multA = first.directionMultiplier ?? 1;
      const multB = second.directionMultiplier ?? 1;
      setSprites((oldSprites) =>
        oldSprites.map((s) => {
          if (s.id === idA) return { ...s, directionMultiplier: multB };
          if (s.id === idB) return { ...s, directionMultiplier: multA };
          return s;
        })
      );

      setScripts((oldScripts) =>
        oldScripts.map((script) => {
          if (script.spriteId === idA) return { ...script, spriteId: idB };
          if (script.spriteId === idB) return { ...script, spriteId: idA };
          return script;
        })
      );

      hasSwappedOnce = true;
    };

    const runScriptForSprite = async (spriteId, script) => {
      if (!script || !script.blocks || script.blocks.length === 0) {
        return;
      }

      const repeatBlock = script.blocks.find(
        (block) => block.type === "control_repeat"
      );

      let repeatTimes = repeatBlock
        ? (() => {
            const n = parseInt(repeatBlock.times, 10);
            return isNaN(n) ? 1 : Math.max(0, n);
          })()
        : 1;

      for (let loopIndex = 0; loopIndex < repeatTimes; loopIndex++) {
        if (stopRequestedRef.current) return;
        for (let i = 0; i < script.blocks.length; i++) {
          if (stopRequestedRef.current) return;
          const block = script.blocks[i];

          if (block.type === "control_repeat") {
            continue;
          }

          if (block.type === "control_wait") {
            const seconds = (() => {
              const n = parseFloat(block.seconds);
              return isNaN(n) ? 0 : n;
            })();
            await wait(seconds * 1000);
            if (stopRequestedRef.current) return;
            continue;
          }

          if (block.type === "motion_move") {
            const rawSteps = (() => {
              const n = parseInt(block.steps, 10);
              return isNaN(n) ? 0 : n;
            })();
            if (moveDirection[spriteId] === undefined) {
              const mult = sprites.find((s) => s.id === spriteId)?.directionMultiplier ?? 1;
              moveDirection[spriteId] = (rawSteps >= 0 ? 1 : -1) * mult;
            }

            const steps = Math.abs(rawSteps);

            for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
              const direction = moveDirection[spriteId];

              setSprites((oldSprites) => {
                const updated = oldSprites.map((sprite) => {
                  if (sprite.id === spriteId) {
                    const { x } = clampPosition(sprite.x + direction, sprite.y);
                    return {
                      ...sprite,
                      x,
                    };
                  }
                  return sprite;
                });

                checkCollisionAndSwapDirectionsAndScripts(updated);
                return updated;
              });

              await wait(MOVE_STEP_DELAY_MS);
              if (stopRequestedRef.current) return;
            }
          } else if (block.type === "motion_turn") {
            const degrees = (() => {
              const n = parseInt(block.degrees, 10);
              return isNaN(n) ? 0 : n;
            })();

            if (degrees !== 0) {
              setSprites((oldSprites) =>
                oldSprites.map((sprite) =>
                  sprite.id === spriteId
                    ? {
                        ...sprite,
                        direction: (sprite.direction || 0) + degrees,
                      }
                    : sprite
                )
              );
              await wait(TURN_DELAY_MS);
              if (stopRequestedRef.current) return;
            }
          } else if (block.type === "motion_goto") {
            const valueX = (() => {
              const n = parseInt(block.x, 10);
              return isNaN(n) ? 0 : n;
            })();
            const valueY = (() => {
              const n = parseInt(block.y, 10);
              return isNaN(n) ? 0 : n;
            })();

            const currentSprite = sprites.find((s) => s.id === spriteId);
            const alreadyAtTarget =
              currentSprite &&
              Math.round(currentSprite.x) === valueX &&
              Math.round(currentSprite.y) === valueY;

            if (!alreadyAtTarget) {
              setSprites((oldSprites) => {
                const updated = oldSprites.map((sprite) => {
                  if (sprite.id !== spriteId) {
                    return sprite;
                  }
                  const { x, y } = clampPosition(valueX, valueY);
                  return {
                    ...sprite,
                    x,
                    y,
                  };
                });
                checkCollisionAndSwapDirectionsAndScripts(updated);
                return updated;
              });
            }

            await wait(GOTO_DELAY_MS);
            if (stopRequestedRef.current) return;
          } else if (block.type === "looks_say") {
            const text = block.text || "";
            const seconds = (() => {
              const n = parseFloat(block.seconds);
              return isNaN(n) ? 0 : n;
            })();

            setSprites((oldSprites) =>
              oldSprites.map((sprite) =>
                sprite.id === spriteId
                  ? {
                      ...sprite,
                      sayText: text,
                    }
                  : sprite
              )
            );

            await wait(seconds * 1000);
            if (stopRequestedRef.current) return;

            setSprites((oldSprites) =>
              oldSprites.map((sprite) =>
                sprite.id === spriteId
                  ? {
                      ...sprite,
                      sayText: "",
                    }
                  : sprite
              )
            );
          } else if (block.type === "looks_think") {
            const text = block.text || "";
            const seconds = (() => {
              const n = parseFloat(block.seconds);
              return isNaN(n) ? 0 : n;
            })();

            setSprites((oldSprites) =>
              oldSprites.map((sprite) =>
                sprite.id === spriteId
                  ? {
                      ...sprite,
                      thinkText: text,
                    }
                  : sprite
              )
            );

            await wait(seconds * 1000);
            if (stopRequestedRef.current) return;

            setSprites((oldSprites) =>
              oldSprites.map((sprite) =>
                sprite.id === spriteId
                  ? {
                      ...sprite,
                      thinkText: "",
                    }
                  : sprite
              )
            );
          }
        }
      }
    };

    const scriptsBySpriteId = {};
    scripts.forEach((script) => {
      if (!scriptsBySpriteId[script.spriteId]) {
        scriptsBySpriteId[script.spriteId] = [];
      }
      scriptsBySpriteId[script.spriteId].push(script);
    });

    const runAll = async (onlySpriteIds) => {
      const spritesToRun = onlySpriteIds
        ? sprites.filter((s) => onlySpriteIds.includes(s.id))
        : sprites;
      const jobs = spritesToRun.map((sprite) => {
        const scriptsForSprite = scriptsBySpriteId[sprite.id] || [];
        const runAllScriptsForThisSprite = async () => {
          for (const script of scriptsForSprite) {
            await runScriptForSprite(sprite.id, script);
          }
        };
        return runAllScriptsForThisSprite();
      });
      await Promise.all(jobs);
    };

    runAll(onlySpriteIds);
  };

  const handleRunSpriteScript = (spriteId) => {
    if (!spriteId || !sprites.length || !scripts.length) return;
    handlePlay(spriteId);
  };

  const handleStop = () => {
    stopRequestedRef.current = true;
  };

  return (
    <div className="h-full min-h-0 flex flex-row overflow-hidden">
      <div className="flex-1 min-h-0 min-w-0 overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
        <Sidebar />
        <MidArea
          scripts={scripts}
          sprites={sprites}
          activeScriptId={activeScriptId}
          onSelectScript={setActiveScriptId}
          onAddCat={handleAddCat}
          onDropBlock={handleDropBlock}
          onChangeBlockValue={handleChangeBlockValue}
          onClearScript={handleClearActiveScript}
          onRemoveSprite={handleRemoveSprite}
          onRemoveBlock={handleRemoveBlock}
        />
      </div>
      <div className="w-1/3 min-w-0 min-h-0 overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
        <PreviewArea
          sprites={sprites}
          activeSpriteId={activeSpriteId}
          onSelectSprite={handleSelectSprite}
          onRunSpriteScript={handleRunSpriteScript}
          onMoveSprite={handleMoveSprite}
          onPlay={handlePlay}
          onStop={handleStop}
          onReload={handleReload}
          onStageSizeChange={(w, h) => setStageSize({ width: w, height: h })}
        />
      </div>
    </div>
  );
}

