import api from "./api";
import {
    GetRefDataParams, GetRefDataResponse,
    GetUserDataParams,
    GetUserDataResponse,
    VerifyUserData,
    VerifyUserResponse
} from "../../../@types/api";

export const verifyUser = async (query_id: string, data: VerifyUserData): Promise<VerifyUserResponse> => {
    return api.post(`/verify_user?query_id=${query_id}`, data);
};

export const getUserData = async ({ query_id, user_id }: GetUserDataParams): Promise<GetUserDataResponse> => {
    return api.get(`/get_user_data?query_id=${query_id}&user_id=${user_id}`);
};

export const getRefData = async ({ query_id, ref_id }: GetRefDataParams): Promise<GetRefDataResponse> => {
    return api.get(`/referals_info?query_id=${query_id}&ref_id=${ref_id}`);
};
