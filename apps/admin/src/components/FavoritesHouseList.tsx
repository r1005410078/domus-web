import React, { memo, useMemo } from "react";
import { useQueryListHouseFavorite } from "@/hooks/useHouse";
import { useFuseSearch } from "@/hooks/useFuseSearch";
import { getHouseDataByColDef } from "./HouseTableConfig";
import { houseDataFuseKeys } from "@/schema/house";
import HouseList from "./HouseList";

export interface HouseListProps {
  category_id: number;
}

function FavoritesHouseList({ category_id }: HouseListProps) {
  const { data, isFetched, isFetching } =
    useQueryListHouseFavorite(category_id);

  const houseList = useMemo(() => data || [], [data]);

  return (
    <HouseList
      houseList={houseList}
      loading={isFetching}
      isFetched={isFetched}
    />
  );
}

export default memo(FavoritesHouseList);
