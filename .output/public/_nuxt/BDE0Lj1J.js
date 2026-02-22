import{G as r}from"./BceSs3DB.js";const o={register:t=>r.post("/auth/register",t),login:t=>r.post("/auth/login",t),getProfile:()=>r.get("/auth/profile")};export{o as a};
