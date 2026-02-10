export function createBlock(type, nextId) {
  const base = { id: nextId, type };

  switch (type) {
    case "motion_move":
      return { ...base, steps: 10 };
    case "motion_turn":
      return { ...base, degrees: 15 };
    case "motion_goto":
      return { ...base, x: 0, y: 0 };
    case "control_repeat":
      return { ...base, times: 5 };
    case "control_wait":
      return { ...base, seconds: 1 };
    case "looks_say":
    case "looks_think":
      return { ...base, text: "", seconds: 2 };
    default:
      return base;
  }
}

