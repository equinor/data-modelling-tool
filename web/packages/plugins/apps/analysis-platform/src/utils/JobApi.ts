import axios from 'axios'

export default class {
  urlRoot = location.origin
  jobUrl = `${this.urlRoot}/api/job`
  requestConfig = {}

  constructor(token: string) {
    this.requestConfig = {
      headers: { Authorization: `Bearer ${token || 'noToken'}` },
    }
  }

  startJob(jobId: string) {
    return axios.post(`${this.jobUrl}/${jobId}`, null, this.requestConfig)
  }

  statusJob(jobId: string) {
    return axios.get(`${this.jobUrl}/${jobId}`, this.requestConfig)
  }

  removeJob(jobId: string) {
    return axios.delete(`${this.jobUrl}/${jobId}`, this.requestConfig)
  }
}
