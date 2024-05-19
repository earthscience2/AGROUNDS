import axios from "axios";
const client = axios.create({baseURL: "https://agrounds.com/"});
export default client;