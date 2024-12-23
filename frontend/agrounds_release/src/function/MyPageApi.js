import client from "../client"

const reasonForWithdrawApi = ({data}) => {
  client.post('/api/manage/reason-for-withdraw/', data)
}

const withdrawApi = ({data}) => {
  client.delete('/api/user/withdraw/', data)
}

const announcementApi = () => {
  client.get('/api/manage/announcement/')
  .then((response) => {
    return response.data.result;
  })
  .then(() => {
    return 'error 발생';
  })
}

export {reasonForWithdrawApi, withdrawApi, announcementApi}