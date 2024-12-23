import client from "../client";


const MakeTeamApi = (data) => {
  return client.post('/api/team/make-team/', data)
}

const SearchPlayerByNicknameAPI = (data) => {
  return client.post('/api/player/search-individual-player-by-nickname/', data)
}

const ApplyTeamApi = (data) => {
  return client.post('/api/player/join-team/', data)
}


const RemovePlayerApi = (data) => {
  return client.post('/api/team/remove-player/', data)
}

const InvitePlayerApi = (data) => {
  return client.post('/api/team/invite-player/', data)
}

const AcceptPlayerApi = (data) => {
  return client.post('/api/team/accept-player/', data)
}

const getJoinRequestListApi = () => {
  return client.post('/api/team/get-join-request-list/', {"team_code": sessionStorage.getItem('teamCode')})
}

const getTeamInfoApi = (data) => {
  return client.post('/api/team/get-team-info/', data)
}


const withdrawTeamApi = () => {
  return client.delete('/api/player/withdraw-team/', {"team_code" : sessionStorage.getItem('teamCode'), "user_code": sessionStorage.getItem('userCode')})
}


const getTeamPlayerListApi = (data) => {
  return client.post('/api/team/get-team-player-list/', data)
}

const getPlayerInfoApi = (data) => {
  return client.post('/api/player/get-player-info/', data)
}


const searchTeamByNameApi = (data) => {
  return client.post('/api/team/search-team-by-name/', data)
}


export {MakeTeamApi, SearchPlayerByNicknameAPI, ApplyTeamApi, RemovePlayerApi, InvitePlayerApi, AcceptPlayerApi, getJoinRequestListApi, getTeamInfoApi, withdrawTeamApi, getTeamPlayerListApi, getPlayerInfoApi, searchTeamByNameApi};