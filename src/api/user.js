import api from './axiosInstance'

export const uploadProfilePicture = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/user/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
