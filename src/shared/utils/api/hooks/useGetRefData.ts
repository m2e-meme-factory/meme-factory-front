import {useQuery} from "@tanstack/react-query";
import {getRefData} from "../requests";

export const useGetRefData = (query_id: string, ref_id: string) => {
    const query = useQuery({
        queryKey: ['getRefId', ref_id],
        queryFn: () => {
            return getRefData({query_id, ref_id})
        },
        select: (data) => data
    });

    return {...query};
}