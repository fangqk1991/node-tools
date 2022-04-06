export interface SimpleVisitor {
  email: string
}

export interface VisitorInfo extends SimpleVisitor {
  iamId: number
  email: string
  name: string
  permissionKeyMap: { [p: string]: 1 }
  isAdmin?: boolean
}
