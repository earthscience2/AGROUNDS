import axios from "axios";

const apiBaseURL = window.location.hostname === 'localhost'
    ? 'https://agrounds.com'
    : window.location.origin;



const client = axios.create({
    baseURL: apiBaseURL,
    timeout: 30000, // 30초 타임아웃
    headers: {
        'Content-Type': 'application/json',
    },
    // 재시도 로직을 위한 설정
    retries: 3,
    retryDelay: 1000,
});


// 요청 인터셉터
client.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 (자동 재시도 로직)
client.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { config } = error;
        
        // 재시도 로직
        if (!config || !config.retries) {
            return Promise.reject(error);
        }
        
        // 네트워크 오류나 타임아웃 시 재시도
        if (
            error.code === 'ECONNABORTED' || 
            error.code === 'NETWORK_ERROR' ||
            error.message.includes('timeout') ||
            error.message.includes('Network Error')
        ) {
            config.retries -= 1;
            
            console.log(`네트워크 오류 발생, ${config.retries}번 재시도 남음`);
            
            // 재시도 전 대기
            await new Promise(resolve => setTimeout(resolve, config.retryDelay));
            
            return client(config);
        }
        
        return Promise.reject(error);
    }
);

// 기존 토큰 설정 (호환성 유지)
const token = sessionStorage.getItem('token');
if (token) {
    client.defaults.headers.common['Authorization'] = token;
}

export default client;