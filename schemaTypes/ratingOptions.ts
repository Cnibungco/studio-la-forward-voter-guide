/** Locked rating scale. The same three values live on candidate entries and on state/county races. */
export const RATING_OPTIONS = [
  {title: 'No Recommendation', value: 'no_recommendation'},
  {title: 'Recommended', value: 'recommended'},
  {title: 'Endorsed', value: 'endorsed'},
] as const

const RATING_TITLES = Object.fromEntries(RATING_OPTIONS.map((option) => [option.value, option.title]))

export function ratingTitle(value: string | undefined): string | undefined {
  if (!value) return undefined
  return RATING_TITLES[value] ?? value
}
