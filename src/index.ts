export const basedOn =
  <T extends string | number | symbol>(paths: Record<T, () => void>) =>
  (choice: T) => {
    return paths[choice]();
  };

export const switchOn = basedOn;
export const basedOnPartial =
  <T extends string | number | symbol>(paths: Partial<Record<T, () => void>>) =>
  (choice: T) => {
    return paths[choice] && paths[choice]();
  };
export const switchOnPartial = basedOnPartial;
