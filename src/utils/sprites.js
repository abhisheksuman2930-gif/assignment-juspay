import { SPRITE_WIDTH, SPRITE_HEIGHT } from "../constant";

export function getNextSpriteId(sprites, scripts) {
  const spriteIds = sprites.map((sprite) => sprite.id);
  const highestId = spriteIds.length ? Math.max(...spriteIds) : 0;
  return highestId + 1;
}

export function getNextScriptId(scripts) {
  const scriptIds = scripts.map((script) => script.id);
  const highestId = scriptIds.length ? Math.max(...scriptIds) : 0;
  return highestId + 1;
}

export function applyGotoOffset(sprite, offsetX, offsetY) {
  const originX =
    sprite.originX !== undefined && sprite.originX !== null
      ? sprite.originX
      : sprite.x;
  const originY =
    sprite.originY !== undefined && sprite.originY !== null
      ? sprite.originY
      : sprite.y;

  return {
    ...sprite,
    originX,
    originY,
    x: originX + offsetX,
    y: originY - offsetY,
  };
}

export function detectCollisionPair(sprites) {
  if (!sprites || sprites.length < 2) {
    return null;
  }

  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      const a = sprites[i];
      const b = sprites[j];

      const isOverlapping =
        a.x < b.x + SPRITE_WIDTH &&
        a.x + SPRITE_WIDTH > b.x &&
        a.y < b.y + SPRITE_HEIGHT &&
        a.y + SPRITE_HEIGHT > b.y;

      if (isOverlapping) {
        return { first: a, second: b };
      }
    }
  }

  return null;
}

