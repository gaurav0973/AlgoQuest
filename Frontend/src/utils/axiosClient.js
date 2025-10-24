import axios from 'axios'

const axiosClient = axios.create({
  baseURL: 'https://localhost:8888',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
   }
});

export default axiosClient;


/*
const responce = await axiosClient.post('/user/register', userData);

response = {
  statusCode : 
  data : {iske ander jo maine responce bheja hai vo pura aata hai}
  success : 
}
=> response.data => iske ander jo maine bheja hai vo aata hai


*/