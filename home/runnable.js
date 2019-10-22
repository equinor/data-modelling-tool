import axios from 'axios'

const GET_URL = "https://jsonplaceholder.typicode.com/todos/"
const POST_URL = "/api/v2/documents"

const runnable = ({action, runnable, node}) => {
    axios
      .get(GET_URL)
      .then(response => {
          axios.put(`${POST_URL}/${action.data.dataSourceId}/${action.data.documentId}`, {
              "name": "List",
              "items": response.data.map(todo => {
                  todo["name"] = todo["title"]
                  return todo
              })
          })
      })
      .catch(error => {
          console.log(error);
      })
}

export default {
    run: runnable
};
