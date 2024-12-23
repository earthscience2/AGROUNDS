import React from 'react';
import client from '../client';

const getMatchListApi = (data) => {
  return client.post('/api/match/get-match-list/', data)
};


const getTeamMatchList = (data) => {
  return client.post('/api/match/get-team-match-list/', data)
}


const getVideoSummationApi = (data) => {
  return client.post('/api/video/get-video-summation/', data)
}

const getPlayerVideoListApi = (data) => {
  return client.post('/api/video/get-player-video-list/', data)
}

const getTeamVideoListApi = (data) => {
  return client.post('/api/video/get-team-video-list/', data)
}

const getFullVideoListApi = (data) => {
  return client.post('/api/video/get-full-video-list/', data)
}

const getMatchVideoInfoApi = (data) => {
  return client.post('/api/video/get-match-video-info/', data)
}

const getAnalyzeResultApi = (data) => {
  return client.post('api/analyze/get-analyze-result/', data);
}


export {getMatchListApi, getTeamMatchList, getVideoSummationApi, getPlayerVideoListApi,getTeamVideoListApi, getFullVideoListApi, getMatchVideoInfoApi, getAnalyzeResultApi};