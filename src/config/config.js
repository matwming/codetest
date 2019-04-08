import axios from "axios";

const instance = axios.create({
 baseURL: "https://blockchaintech-code-test.herokuapp.com",
 headers: {
  Accept: "application/json"
 }
});

export default instance;
