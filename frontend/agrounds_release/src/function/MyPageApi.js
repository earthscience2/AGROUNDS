import client from "../client"

const reasonForWithdrawApi = (data) => {
  client.post('/api/manage/reason-for-withdraw/', data)
}

const withdrawApi = (data) => {
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

const EditUserInfoApi = (data) => {
  return client.patch('api/user/edit-user-info/', data)
}

export {reasonForWithdrawApi, withdrawApi, announcementApi, EditUserInfoApi}