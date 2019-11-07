import axios from 'axios'

const getMeasurements = async ({ document, config, setProgress }) => {
  return new Promise(resolve => {
    resolve({
      name: 'List',
      measurements: [
        {
          name: '1',
          date: '1',
          temperature: '100',
        },
        {
          name: '2',
          date: '2',
          temperature: '200',
        },
      ],
    })
  })
}

const getTodoList = async ({ document, config, setProgress }) => {
  const GET_URL = 'https://jsonplaceholder.typicode.com/todos/'
  const result = await axios.get(GET_URL)
  return {
    name: 'List',
    items: result.data.map(todo => {
      todo['name'] = todo['title']
      return todo
    }),
  }
}

const runnableMethods = {
  getTodoList,
  getMeasurements,
}

export default runnableMethods
