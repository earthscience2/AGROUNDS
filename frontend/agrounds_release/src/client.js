import axios from "axios";

const client = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});


const token = sessionStorage.getItem('token');
if (token) {
    client.defaults.headers.common['Authorization'] = token;
}

export default client;