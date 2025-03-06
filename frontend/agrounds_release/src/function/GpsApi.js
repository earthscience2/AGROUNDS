import client from "../client"

const findStadium = (data) => {
  return client.post('/api/ground/search-grounds/', data)
}

export {findStadium};