import React, { useState } from "react";
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

  const handleReload = () => {
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

  const handlePlay = () => {
    if (!sprites.length || !scripts.length) {
      return;
    }

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
        ? parseInt(repeatBlock.times, 10) || 1
        : 1;

      if (repeatTimes < 1) {
        repeatTimes = 1;
      }

      for (let loopIndex = 0; loopIndex < repeatTimes; loopIndex++) {
        for (let i = 0; i < script.blocks.length; i++) {
          const block = script.blocks[i];

          if (block.type === "control_repeat") {
            continue;
          }

          if (block.type === "control_wait") {
            const seconds = parseFloat(block.seconds) || 1;
            await wait(seconds * 1000);
            continue;
          }

          if (block.type === "motion_move") {
            const rawSteps = parseInt(block.steps, 10) || 0;
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
                    return {
                      ...sprite,
                      x: sprite.x + direction,
                    };
                  }
                  return sprite;
                });

                checkCollisionAndSwapDirectionsAndScripts(updated);
                return updated;
              });

              await wait(MOVE_STEP_DELAY_MS);
            }
          } else if (block.type === "motion_turn") {
            const degrees = parseInt(block.degrees, 10) || 0;

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
            }
          } else if (block.type === "motion_goto") {
            const valueX = parseInt(block.x, 10) || 0;
            const valueY = parseInt(block.y, 10) || 0;

            setSprites((oldSprites) => {
              const updated = oldSprites.map((sprite) => {
                if (sprite.id !== spriteId) {
                  return sprite;
                }

                return {
                  ...sprite,
                  x: sprite.x + valueX,
                  y: sprite.y - valueY,
                };
              });
              checkCollisionAndSwapDirectionsAndScripts(updated);
              return updated;
            });

            await wait(GOTO_DELAY_MS);
          } else if (block.type === "looks_say") {
            const text = block.text || "";
            const seconds = parseFloat(block.seconds) || 1;

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
            const seconds = parseFloat(block.seconds) || 1;

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

    const runAll = async () => {
      const jobs = sprites.map((sprite) => {
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

    runAll();
  };

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
          onClearScript={handleClearActiveScript}
          onRemoveSprite={handleRemoveSprite}
          onRemoveBlock={handleRemoveBlock}
        />
      </div>
      <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
        <PreviewArea
          sprites={sprites}
          onMoveSprite={handleMoveSprite}
          onPlay={handlePlay}
          onReload={handleReload}
        />
      </div>
    </div>
  );
}

