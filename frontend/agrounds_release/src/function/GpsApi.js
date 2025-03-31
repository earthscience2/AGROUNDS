import client from "../client"

const findStadium = (data) => {
  return client.post('/api/ground/search-grounds/', data)
}

const getCoordinate = (data) => {
  return client.post('/api/ground/get-coordinate/', data)
}

const AddMatchInfo = (data) => {
  return client.post('/api/upload/add-match-info/', data)
}
export {findStadium, getCoordinate, AddMatchInfo};