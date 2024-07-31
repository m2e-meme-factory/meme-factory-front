import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface VerifyUserData {
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
}

export interface VerifyUserRequestData {
  queryId: string;
  userData: VerifyUserData;
}

export interface GetUserDataParams {
  query_id: string;
  user_id: string;
}

export interface GetRefDataParams {
  query_id: string;
  ref_id: string;
}

export type ApiRequestConfig = AxiosRequestConfig;

export type RequestConfig<Params = undefined> = Params extends undefined
  ? { config?: ApiRequestConfig }
  : { params: Params; config?: ApiRequestConfig };

export type VerifyUserResponse = AxiosResponse<any>;
export type GetUserDataResponse = AxiosResponse<any>;
export type GetRefDataResponse = AxiosResponse<any>;
