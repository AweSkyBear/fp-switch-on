export const basedOn =
  <T extends string | number | symbol, P extends any[] = void[]>(
    paths: Record<T, (...args: [T, ...P]) => void>
  ) =>
  (choice: T, ...rest: P) => {
    return paths[choice](choice, ...rest);
  };

export const switchOn = basedOn;
export const basedOnPartial =
  <T extends string | number | symbol, P extends any[] = void[]>(
    paths: Partial<Record<T, (...args: [T, ...P]) => void>>
  ) =>
  (choice: T, ...rest: P) => {
    return paths[choice] && paths[choice](choice, ...rest);
  };
export const switchOnPartial = basedOnPartial;
