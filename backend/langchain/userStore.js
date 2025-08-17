const userMemoryMap = new Map();

export function getUserMemory(userId) {
  return userMemoryMap.get(userId);
}

export function setUserMemory(userId, bundle) {
  userMemoryMap.set(userId, bundle);
}
