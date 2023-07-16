export interface PaginationMeta {
  pageCount: number;
  itemCount: number;
  prevPage: number | null;
  nextPage: number | null;
}
export interface getPaginationMetaProps {
  currentPage?: number;
  itemCount: number;
  take: number;
}

export const getPaginationMeta = ({
  currentPage = 1,
  itemCount,
  take,
}: getPaginationMetaProps): PaginationMeta => {
  const pageCount = Math.ceil(itemCount / take) || 0;

  return {
    pageCount: pageCount,
    itemCount: itemCount || 0,
    prevPage: currentPage - 1 >= 1 ? currentPage - 1 : null,
    nextPage: currentPage + 1 <= pageCount ? currentPage + 1 : null,
  };
};
