import {AccessLevel} from  './enums'

export type ACL = {
    owner: string,
    roles?: { [key: string]: AccessLevel; }
    users?: { [key: string]: AccessLevel; }
    others: AccessLevel
  }