/** id of the element that describes a field: its error if shown, otherwise its hint. */
export function describedBy(id, { error, hint }) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
