import { useQuery } from "./url";

export const useSearchQuery = () => {
  return useQuery().get("search") || "";
};
