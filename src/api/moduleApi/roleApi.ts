import NetWork from "@/api/NetWork";

export const getRolesApi = (params?: {}) => NetWork.get('/api/v1/roles', params);
export const addRolesApi = (params: {}) => NetWork.post('/api/v1/roles', params);
export const delRolesApi = (id:string) => NetWork.delete(`/api/v1/roles/${id}`);
export const updateRolesApi = (id:string, params:{}) => NetWork.put(`/api/v1/roles/${id}`, params);