import client from "../client";


const MakeTeamApi = (data) => {
  return client.post('/api/team/makeTeam/', data)
}

const SearchPlayerByNameAPI = (data) => {
  client.post('/api/player/searchPlayerByname/', data)
  .then((response) => {
    return response.data.result;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

const ApplyTeamApi = ({data}) => {
  return client.post('/api/player/joinTeam/', data)
}

const TeamMemberApi = () => {
  client.post('/api/team/getTeamPlayerList/', {"team_code": sessionStorage.getItem('teamCode')})
  .then((response) => {
    return response.data.result;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

const RemovePlayerApi = ({data}) => {
  client.post('/api/team/removePlayer/', data)
  .then((response) => {
    return response.data.result;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

const InvitePlayerApi = ({data}) => {
  client.post('/api/team/invitePlayer/', data)
  .then((response) => {
    return response.data.result;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

const AcceptPlayerApi = ({data}) => {
  client.post('/api/team/acceptPlayer/', data)
  .then((response) => {
    return response.data.result;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

const getJoinRequestListApi = () => {
  client.post('/api/team/getJoinRequestList/', {"team_code": sessionStorage.getItem('teamCode')})
  .then((response) => {
    return response.data.result;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

const getTeamInfoApi = () => {
  client.post('/api/team/getTeamInfo/', {"team_code": sessionStorage.getItem('teamCode')})
  .then((response) => {
    return response.data;
  })
  .catch(() => {
    return '데이터를 불러오던 중 에러가 발생했습니다.'
  })
}

export {MakeTeamApi, SearchPlayerByNameAPI, ApplyTeamApi, TeamMemberApi, RemovePlayerApi, InvitePlayerApi, AcceptPlayerApi, getJoinRequestListApi, getTeamInfoApi};