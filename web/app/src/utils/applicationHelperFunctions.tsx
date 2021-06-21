//sort applications based on their tabIndex values
export const sortApplications = (applications: any[]) => {
  return Object.values(applications).sort(
    (applicationA: any, applicationB: any) => {
      if (applicationA.tabIndex === undefined) return 1
      else if (applicationB.tabIndex === undefined) return -1
      else if (applicationB.tabIndex === applicationA.tabIndex) return 1
      else return applicationA.tabIndex > applicationB.tabIndex ? 1 : -1
    }
  )
}
