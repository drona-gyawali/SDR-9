import axios from "axios";
import { BACKEND_PORT } from "./conf";
import type { EmailData } from "../types/global";

const emailPort = '/api/v1/send/email'


const apiClient = axios.create({
    baseURL: BACKEND_PORT,
    headers: {'Content-Type': 'application/json'},
})


export const sendEmail = async (data: EmailData) => {
    try {
        const response = await apiClient.post(emailPort, data)
        return response.data
    }catch (error) {
        if(error instanceof Error) {
            console.log(`Error occured ${error}`)
            throw error
        }else {
            console.log(`Error occured ${error}`)
            throw error
        }
   }
}



