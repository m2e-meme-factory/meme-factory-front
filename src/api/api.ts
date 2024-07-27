import axios from "axios"

const API_URL = "https://api.meme-factory.site"


export const verifyUser = async (query_id: string, data: {
  userId: string
  name: string
  phoneNumber: string,
  email: string
}) => {
  return axios.post(`${API_URL}/verify_user?query_id=${query_id}`, data)
}


export const getUserData = async (query_id: string, user_id: string) => {
  return axios.get(`${API_URL}/get_user_data?query_id=${query_id}&user_id=${user_id}`)
}


export const getRefData = async (query_id: string, ref_id: string) => {
  return axios.get(`${API_URL}/referals_info?query_id=${query_id}&ref_id=${ref_id}`)
}

console.log(API_URL + "/profile")