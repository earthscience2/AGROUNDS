import client from "../client";


const MakeTeamApi = (data) => {
  return client.post('/api/team/makeTeam/', data)
}

const SearchPlayerByNameAPI = (data) => {
  return client.post('api/player/searchPlayerByname/', data)
}

export {MakeTeamApi, SearchPlayerByNameAPI};