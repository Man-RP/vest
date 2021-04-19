/**
 * Removes first found element from array
 * WARNING: Mutates array
 *
 * @param {any[]} array
 * @param {any} element
 */
const removeElementFromArray = <T>(array: T[], element: T): T[] => {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }

  return array;
};

export default removeElementFromArray;
