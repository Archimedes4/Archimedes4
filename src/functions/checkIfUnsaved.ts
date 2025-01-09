/**
 * 
 * @param original 
 * @param current 
 * @returns True if there are unsaved changes
 */
export function checkIfUnsaved(original: post, current: post) {
  if (original.assests.every((e, index) => {return e.id !== current.assests[index].id}) === false) {
    console.log("nark")
    return true
  }
  if (original.content !== current.content) {
    return true
  }
  if (original.cover.id !== current.cover.id) {
    return true
  }
  if (original.githubUrl !== current.githubUrl) {
    return true
  }
  if (original.hidden !== current.hidden) {
    return true
  }
  if (original.hiddenTitle !== original.hiddenTitle) {
    return true
  }
  if (original.id !== current.id) {
    // Somethings wrong
  }
  if (original.status !== current.status) {
    return true
  }
  console.log("halg one " + (original.technologies.length !== current.technologies.length))
  if (original.technologies.length !== current.technologies.length && original.technologies.every((e, index) => {return e.id !== current.technologies[index].id}) === false) {
    return true
  }
  console.log("Nope")
  if (original.title !== current.title) {
    return true
  }
  if (original.type !== current.type) {
    return true
  }
  if (original.updated !== original.updated) {
    return true
  }
  return false
}