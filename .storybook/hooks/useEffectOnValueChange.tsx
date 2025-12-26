import { useEffect, useRef } from "react";

type Destructor = () => void;

export function useEffectOnValueChange<
  T extends readonly [value: any, ...moreValues: any[]],
>(effect: (...args: T) => void | Destructor, values: T): void {
  const refIsFistRender = useRef(true);

  useEffect(() => {
    if (refIsFistRender.current) {
      refIsFistRender.current = false;
      return;
    }

    return effect(...values);
  }, [effect, values]);
}
