import client from "../client"

const reasonForWithdrawApi = ({data}) => {
  client.post('/api/manage/reason-for-withdraw/', data)
}

const withdrawApi = ({data}) => {
  client.delete('/api/user/withdraw/', data)
}

export {reasonForWithdrawApi, withdrawApi}