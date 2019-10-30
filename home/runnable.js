import axios from 'axios'

const getMeasurements = async () => {
    return new Promise(resolve => {
        resolve({
            "name": "List",
            "measurements": [
                {
                    "name": "1",
                    "date": "1",
                    "temperature": "100"
                },
                {
                    "name": "2",
                    "date": "2",
                    "temperature": "200"
                }
            ]
        })
    });
}

const runnable = async ({document, config, setProgress}) => {
    console.log("RUN:", config);
    console.log("Document:", config);

    const runMethod = config["method"]

    switch (runMethod) {
        case "GET_TODO_LIST": {
            const GET_URL = "https://jsonplaceholder.typicode.com/todos/"
            const result = await axios.get(GET_URL);
            return {
                "name": "List",
                "items": result.data.map(todo => {
                    todo["name"] = todo["title"]
                    return todo
                })
            }

        }
        case "GET_MEASUREMENTS": {
            return await getMeasurements()
        }
        default:
            throw "Runnable method not found"
    }
}

export default {
    run: runnable
};
