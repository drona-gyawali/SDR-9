
export const BACKEND_PORT:string | undefined = import.meta.env.VITE_NODE_ENV == 'dev'
 ? import.meta.env.VITE_BACKEND_PORT_DEV 
 : import.meta.env.VITE_BACKEND_PORT_PROD


 export const SERVERS = {
    google1: import.meta.env.VITE_STUN_GOOGLE1,
    google2: import.meta.env.VITE_STUN_GOOGLE2,
    cloudFlare: import.meta.env.VITE_STUN_CLOUDFARE,
    turnServer: import.meta.env.VITE_TURN_URL,
    turnPassword: import.meta.env.VITE_TURN_PASS,
    turnUsername: import.meta.env.VITE_TURN_USERNAME

 }