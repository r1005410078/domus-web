import { FiltersForm } from "./Filters";
import { PaginationProps } from "./Pagination";
import React, { memo, useMemo } from "react";
import { HouseListRequest } from "@/services/house";
import { useHouseList } from "@/hooks/useHouse";
import HouseList from "./HouseList";

export interface HouseListProps {
  transactionType: string;
  onPullLoadMore?: () => void;
  pagination?: PaginationProps;
}

function RentalAndSaleHouseList({
  transactionType,
  pagination,
  onPullLoadMore,
}: HouseListProps) {
  const [houseListRequest, setHouseListRequest] =
    React.useState<HouseListRequest>({
      page: 1,
      page_size: 9999,
      transaction_type: transactionType,
    });

  const { data, isFetched, isFetching } = useHouseList(
    houseListRequest,
    ["出售", "出租"].includes(transactionType)
  );

  const houseList = useMemo(() => {
    return data?.list || [];
  }, [data]);

  const onFilterSubmit = React.useCallback((values: FiltersForm) => {
    setHouseListRequest((pre) => ({
      ...pre,
      ...values,
      amap_bounds: pre.amap_bounds,
      page: pre.page,
      page_size: pre.page_size,
    }));
  }, []);

  return (
    <HouseList
      transactionType={transactionType}
      pagination={pagination}
      houseList={houseList}
      loading={isFetching}
      isFetched={isFetched}
      onFilterSubmit={onFilterSubmit}
      onPullLoadMore={onPullLoadMore}
    />
  );
}

export default memo(RentalAndSaleHouseList);
