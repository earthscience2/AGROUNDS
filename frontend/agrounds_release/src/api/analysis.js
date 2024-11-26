import React, { useEffect } from 'react';
import client from '../client';

const data = {
  user_code: 'u_001',
  match_code: 'm_001',
  quarter: 1
}

const GetDetailAnal = async () => {
  try {
    const response = await client.post('https://agrounds.com/api/test_page/analyze-data/', data);
    return response.data;
  } catch (error) {
    console.error("API 요청 실패:", error);
    return null;
  }
};

export { GetDetailAnal };