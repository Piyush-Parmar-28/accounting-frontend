import { useEffect, useRef } from "react";

export default function useDidUpdateEffect(
  fn: any,
  inputs: any,
  runTimes: number
) {
  const didMountRef = useRef(0);
  //   console.log(123);
  //   console.log("didmountref", didMountRef.current);
  useEffect(() => {
    if (didMountRef.current > runTimes) {
      //   console.log(456);
      return fn();
    } else {
      //   console.log(789);
      didMountRef.current += 1;
    }
  }, inputs);
}
