import axios from 'axios'

const GET_URL = "https://jsonplaceholder.typicode.com/todos/"
const POST_URL = "/api/v2/documents"

const runnable = ({action, runnable, node, setProgress, createNodes, layout}) => {
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
          setProgress(100)
          layout.refresh(action.data.documentId)
      })
      .catch(error => {
          console.log(error);
      })
}

export default {
    run: runnable
};
