import NetWork from "@/api/NetWork";

export const addRoleRightsApi = (params: {}) => NetWork.post('/api/v1/roleRights', params);
export const delRoleRightsApi = (id:string | number, params: {}) => NetWork.delete(`/api/v1/roleRights/${id}`, params);
