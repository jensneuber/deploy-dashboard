export const createAuthString = (username: string, token: string) => {
  return btoa(`${username}:${token}`)
}
