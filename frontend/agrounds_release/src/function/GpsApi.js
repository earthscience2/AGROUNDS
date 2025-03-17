import client from "../client"

const findStadium = (data) => {
  return client.post('/api/ground/search-grounds/', data)
}

const getCoordinate = (data) => {
  return client.post('/api/ground/get-coordinate/', data)
}

export {findStadium, getCoordinate};