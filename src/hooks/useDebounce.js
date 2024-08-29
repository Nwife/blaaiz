import _ from "lodash";
import { useMemo } from "react";

export default function useDebounce(duration) {
  const debounce = useMemo(
    () =>
      _.debounce(
        (searchFunction) => {
          searchFunction && searchFunction();
        },
        duration || 1000,
        { leading: false, trailing: true }
      ),
    [duration]
  );

  return debounce
}
