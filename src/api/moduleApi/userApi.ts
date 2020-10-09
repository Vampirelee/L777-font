import NetWork from "@/api/NetWork";

export const registerUserApi = (params: {}) => NetWork.post('/register', params);
export const sendEmailApi = (params: {}) => NetWork.get('/emailcode', params);
export const sendSmsApi = (params: {}) => NetWork.get('/phoneCode', params);
export const getUser = () => NetWork.get('/users');