import {useQuery} from "@tanstack/react-query";
import {getRefData} from "../requests/getRefData";

export const useGetRefData = (query_id: string, ref_id: string) => {
    const query = useQuery({
        queryKey: ['getRefId', ref_id],
        queryFn: () => {
            return getRefData({params: {query_id, ref_id}})
        },
        select: (data) => data
    });

    return {...query};
}