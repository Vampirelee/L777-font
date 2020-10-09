import NetWork from "@/api/NetWork";
export const isLogin = () => NetWork.get('/islogin');