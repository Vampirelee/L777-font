import NetWork from "@/api/NetWork";
export const LoginApi = (params: {}) => NetWork.post('/login', params);