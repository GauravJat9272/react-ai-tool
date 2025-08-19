export function checkHeading(str) {
  return /^\*\*(.*)\*\*$/.test(str); // true if starts and ends with **
}

export function replaceHeadingStarts(str) {
  return str.replace(/^\*\*(.*)\*\*$/, '$1'); // remove surrounding **
}
