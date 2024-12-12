import client from "../client";


const MakeTeamApi = (data) => {
  return client.post('/api/team/makeTeam/', data)
}

export {MakeTeamApi};