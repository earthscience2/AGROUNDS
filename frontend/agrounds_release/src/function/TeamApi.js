import client from "../client";


const MakeTeamApi = (data) => {
  return client.post('/api/team/makeTeam/', data)
}

const SearchPlayerByNameAPI = (data) => {
  return client.post('api/player/searchPlayerByname/', data)
}

const ApplyTeamApi = () => {
  return client.post('api/player/joinTeam/', data)
}

export {MakeTeamApi, SearchPlayerByNameAPI, ApplyTeamApi};