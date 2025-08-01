import React from "react";

export function useFilterItems<T>(listItems?: T[]) {
  const [filterItems, setFilterItems] = React.useState<T[] | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (listItems) {
      setFilterItems(listItems);
    }
  }, [listItems]);

  return {
    filterItems,
    handleFilter(keys: string[], value: string) {
      setFilterItems(
        listItems?.filter((item) =>
          keys.some((key) =>
            item[key as keyof T]?.toString().toLowerCase().includes(value)
          )
        )
      );
    },
  };
}
