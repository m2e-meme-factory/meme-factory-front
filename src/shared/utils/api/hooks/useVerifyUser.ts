import {useQuery} from "@tanstack/react-query";
import {verifyUser} from "../requests";
import {VerifyUserData} from "../../../../@types/api";

export const useVerifyUser = (query_id: string, userData: VerifyUserData) => {
    const query = useQuery({
        queryKey: ['verifyUser', query_id],
        queryFn: () => {
            return verifyUser(query_id, userData)
        },
        select: (data) => data
    });

    return {...query};
}