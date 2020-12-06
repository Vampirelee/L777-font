import NetWork from "@/api/NetWork";

export const getRightsApi = (params?: {}) => NetWork.get('/api/v1/rights', params);
export const addRightsApi = (params: {}) => NetWork.post('/api/v1/rights', params);
export const delRightsApi = (id:string | number) => NetWork.delete(`/api/v1/rights/${id}`);
export const updateRightsApi = (id:string | number, params:{}) => NetWork.put(`/api/v1/rights/${id}`, params);