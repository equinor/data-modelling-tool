import axios from 'axios'

export class JobApi {
  urlRoot = location.origin
  jobUrl = `${this.urlRoot}/api/v1/job`
  requestConfig = {}

  constructor(token: string) {
    this.requestConfig = {
      headers: { Authorization: `Bearer ${token || 'noToken'}` },
    }
  }

  startJob(jobDMSSPath: string) {
    return axios.post(`${this.jobUrl}/${jobDMSSPath}`, null, this.requestConfig)
  }

  statusJob(jobUID: string) {
    return axios.get(`${this.jobUrl}/${jobUID}`, this.requestConfig)
  }

  removeJob(jobUID: string) {
    return axios.delete(`${this.jobUrl}/${jobUID}`, this.requestConfig)
  }

  result(jobUID: string) {
    return axios.get(`${this.jobUrl}/${jobUID}/result`, this.requestConfig)
  }
}
