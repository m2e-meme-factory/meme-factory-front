import {useQuery} from "@tanstack/react-query";
import {getUserData} from "../requests";

export const useVerifyUser = (query_id: string, user_id: string) => {
    const query = useQuery({
        queryKey: ['getUser', user_id],
        queryFn: () => {
            return getUserData({query_id, user_id})
        },
        select: (data) => data
    });

    return {...query};
}