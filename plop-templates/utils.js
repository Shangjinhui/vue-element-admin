// exports.notEmpty = name => {
//   return v => {
//     if (!v || v.trim === '') {
//       return `${name} is required`
//     } else {
//       return true
//     }
//   }
// }
export var notEmpty = name => {
  return v => {
    if (!v || v.trim === '') {
      return `${name} is required`
    } else {
      return true
    }
  }
}
// export function notEmpty(name){
//   return v => {
//     if (!v || v.trim === '') {
//       return `${name} is required`
//     } else {
//       return true
//     }
//   }
// }