export const buildAPI = (route: string, ...replacements: (string | number)[]) => {
  let index = 0
  return route.replace(/:([\w-]+)/g, () => {
    return replacements[index++] as string
  })
}
