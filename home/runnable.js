import axios from 'axios'

const GET_URL = "https://jsonplaceholder.typicode.com/todos/"

const runnable = async ({document, config, setProgress}) => {
    console.log("RUN:", config);
    console.log("Document:", config);

    // TODO: Call specified function in config

    const result = await axios.get(GET_URL);
    return {
        "name": "List",
        "items": result.data.map(todo => {
            todo["name"] = todo["title"]
            return todo
        })
    }
}

export default {
    run: runnable
};
