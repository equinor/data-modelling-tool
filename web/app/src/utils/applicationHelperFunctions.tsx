//@ts-ignore
import { NotificationManager } from 'react-notifications'

export const sortApplications = (applications: any[]) => {
  return Object.values(applications).sort(
    (applicationA: any, applicationB: any) => {
      if (applicationA.tabIndex === undefined) return 1
      else if (applicationB.tabIndex === undefined) return -1
      else return applicationA.tabIndex > applicationB.tabIndex ? 1 : -1
    }
  )
}

export const getAllVisibleDataSources = (applications: any[]) => {
  const visibleDataSources = Object.values(applications).map((app) => {
    return app.visibleDataSources
  })
  return visibleDataSources.flat()
}

export const getFirstVisibleApplicationSettings = (applications: any[]) => {
  const apps = sortApplications(Object.values(applications))
  for (let i = 0; i < apps.length; i++) {
    let app = apps[i]
    if (app?.hidden) continue
    else {
      return app
    }
  }
  NotificationManager.error(
    "Error: found no applications that are set to 'visible'. Try to update an application's settings.json to 'hidden': false"
  )
}
