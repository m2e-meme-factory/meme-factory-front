import {GetRefDataParams, GetRefDataResponse, RequestConfig} from "../../../../@types/api";
import api from "../api";

export type GetRefDataConfig = RequestConfig<GetRefDataParams>

export const getRefData =  (config : GetRefDataConfig): Promise<GetRefDataResponse> => {
    return api.get(`/referals_info?query_id=${config?.params.query_id}&ref_id=${config?.params.ref_id}`);
};
