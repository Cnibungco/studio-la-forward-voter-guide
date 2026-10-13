/**
 * Current home-page copy, used as initial values for a new Site Settings
 * document and as the one-time seed for the live document. The Next.js app
 * keeps the same words as a fallback when a field is empty.
 */

const LAVOTE_HREF = 'https://www.lavote.gov'

type Span = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

type MarkDef = {
  _key: string
  _type: 'link'
  href: string
}

type TextPart = string | {strong: string} | {label: string; href: string}

function line(key: string, parts: TextPart[]) {
  const markDefs: MarkDef[] = []
  const children: Span[] = parts.map((part, index) => {
    const spanKey = `${key}-s${index}`
    if (typeof part === 'string') {
      return {_type: 'span', _key: spanKey, text: part, marks: []}
    }
    if ('strong' in part) {
      return {_type: 'span', _key: spanKey, text: part.strong, marks: ['strong']}
    }
    const markKey = `${key}-a${index}`
    markDefs.push({_key: markKey, _type: 'link', href: part.href})
    return {_type: 'span', _key: spanKey, text: part.label, marks: [markKey]}
  })

  return [
    {
      _type: 'block' as const,
      _key: `${key}-b`,
      style: 'normal' as const,
      markDefs,
      children,
    },
  ]
}

export const ABOUT_SUMMARY = 'About this guide and how we arrived at our recommendations'

export const ABOUT_PARAGRAPHS = [
  {
    _key: 'about-1',
    _type: 'aboutParagraph' as const,
    text: 'LA Forward is dedicated to democracy. We support policies and power-building to make Los Angeles County a fair, flourishing place for everyone.',
  },
  {
    _key: 'about-2',
    _type: 'aboutParagraph' as const,
    text: "We've been publishing detailed voter guides every election since we launched in Fall 2016. Our local candidate endorsements are the result of a multi-step process. For all other candidates and measures, the recommendations here were written by a team of volunteers and staff. Our team consulted publicly available media coverage, candidate and organizational websites, and conducted interviews with people in our networks and on the ground to make our decisions and complete our write-ups.",
  },
  {
    _key: 'about-3',
    _type: 'aboutParagraph' as const,
    text: "If this voter guide has been useful for you, we'd be grateful for a donation of any amount to help cover the costs of making it every election! More than 75% of our budget comes from small-dollar donations from people like you.",
  },
  {
    _key: 'about-4',
    _type: 'aboutParagraph' as const,
    text: 'Translations are automatic and may not be perfect.',
  },
]

export const TRUST_STATEMENT =
  'Candidates and ballot measure committees were not given the opportunity to pay for preferential treatment and were not shown these recommendations before they were published.'

export const DONATE_ASK =
  "If this voter guide has been useful for you, we'd be grateful for a donation so we can reach even more people."

export const CAMPAIGN_DONOR = 'Elizabeth Thomas in the amount of $5,000'

export const KEY_DATES = [
  {
    _key: 'oct-19',
    _type: 'keyDate' as const,
    date: 'OCT 19',
    electionDay: false,
    event: line('oct-19', [
      'Last day to register online (or update your address) to receive your ballot by mail. After this, register and vote in person at a vote center.',
    ]),
  },
  {
    _key: 'oct-24',
    _type: 'keyDate' as const,
    date: 'OCT 24',
    electionDay: false,
    event: line('oct-24', ['Vote centers open across LA County.']),
  },
  {
    _key: 'oct-27',
    _type: 'keyDate' as const,
    date: 'OCT 27',
    electionDay: false,
    event: line('oct-27', [
      {label: 'Last recommended day', href: LAVOTE_HREF},
      ' to mail your ballot at the post office.',
    ]),
  },
  {
    _key: 'nov-3',
    _type: 'keyDate' as const,
    date: 'NOV 3',
    electionDay: true,
    event: line('nov-3', ["Election Day (but don't wait)."]),
  },
]
