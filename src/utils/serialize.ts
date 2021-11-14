/**
 * Note: Serializing and deserializing data is usually not as simple as calling
 * JSON.stringify and JSON.parse. Most type information is lost to JSON and typically
 * the way you want to store objects (in memory) during run-time is very different
 * from the way you want to store them for transfer or storage
 * (in memory, on disk, or any other medium).
 */
export const serialize = (value: any) => {
  return JSON.stringify(value)
}
export const deserialize = (value: string) => {
  return JSON.parse(serialize(value))
}
