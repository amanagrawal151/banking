import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://ebank-2t3r.onrender.com/api/request/"
    : "http://localhost:5000/api/account/";


//Get All accounts
const getAllAccounts = async () => {
  const res = await axios.get(`${API_URL}getAllAccounts`);
  const data = res.data; 
  return data ;
}

const addAllInterest = async (account_id) => {
  const res = await axios.post(`http://localhost:5000/api/admins/addFdInterest/${account_id}`) ;
  const data = res.data; 
  return data ;
}


const accountActionServices = {
  getAllAccounts,
  addAllInterest
};

export default accountActionServices;
