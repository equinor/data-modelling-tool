export default class Workspace {
  private storage: Storage

  public constructor(useSession: boolean = false) {
    this.storage = useSession ? window.sessionStorage : window.localStorage
  }

  public setItem(url: string, value: any): void {
    this.storage.setItem(url, JSON.stringify(value))
  }

  public getItem(url: string): any {
    return JSON.parse(this.storage.getItem(url) || 'null')
  }

  public key(index: number): string | null {
    return this.storage.key(index)
  }

  public removeItem(url: string): void {
    this.storage.removeItem(url)
  }

  public clear(): void {
    this.storage.clear()
  }

  public get length(): number {
    return this.storage.length
  }
}
