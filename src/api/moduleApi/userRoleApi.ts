import NetWork from "@/api/NetWork";

export const dispatchRoleApi = (params: {}) => NetWork.post('/api/v1/userrole', params);
export const deleteRoleApi = (userId:string, params: {}) => NetWork.delete(`/api/v1/userrole/${userId}`, params);
