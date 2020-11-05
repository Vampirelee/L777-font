import NetWork from "@/api/NetWork";

export const registerUserApi = (params: {}) => NetWork.post('/register', params);
export const sendEmailApi = (params: {}) => NetWork.get('/emailcode', params);
export const sendSmsApi = (params: {}) => NetWork.get('/phoneCode', params);
export const getUserApi = (params: {}) => NetWork.get('/api/v1/users', params);
export const addUserApi = (data: {}) => NetWork.post('/api/v1/users', data);
export const destroyUserUserApi = (id: string) => NetWork.delete(`/api/v1/users/${id}`);
export const updateUserUserApi = (id: string, data: {}) => NetWork.put(`/api/v1/users/${id}`, data);