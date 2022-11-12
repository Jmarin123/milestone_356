import axios from 'axios'
const api = axios.create({
    baseURL: 'http://INSERT_IP_ADDRESS', //to be edited when server is created
})

export const get10Docs = () => api.get(`/collection/list`) //top 10 most recently edited documents

const apis = {
    get10Docs
}

export default apis