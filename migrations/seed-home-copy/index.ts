import {at, defineMigration, setIfMissing} from 'sanity/migrate'

import {
  ABOUT_PARAGRAPHS,
  ABOUT_SUMMARY,
  CAMPAIGN_DONOR,
  DONATE_ASK,
  KEY_DATES,
  TRUST_STATEMENT,
} from '../../schemaTypes/homeCopySeed'

/**
 * Fill Site Settings with the copy that used to live only in the app.
 * Safe to re-run: a field someone has already edited is left alone.
 * The announcement stays blank so the home page does not grow a banner.
 */
export default defineMigration({
  title: 'Seed home page copy on Site Settings',
  documentTypes: ['siteSettings'],
  filter:
    '!defined(keyDates) || !defined(aboutSummary) || !defined(aboutParagraphs) || !defined(trustStatement) || !defined(donateAsk) || !defined(campaignDonor)',
  migrate: {
    document() {
      return [
        at('aboutSummary', setIfMissing(ABOUT_SUMMARY)),
        at('aboutParagraphs', setIfMissing(ABOUT_PARAGRAPHS)),
        at('trustStatement', setIfMissing(TRUST_STATEMENT)),
        at('donateAsk', setIfMissing(DONATE_ASK)),
        at('campaignDonor', setIfMissing(CAMPAIGN_DONOR)),
        at('keyDates', setIfMissing(KEY_DATES)),
      ]
    },
  },
})
