import type {StructureResolver} from 'sanity/structure'

/**
 * Groups the flat document list into something that matches how Sea/David
 * actually think about the guide: State / County / City, then Races and
 * Measures underneath. Sanity's default desk just lists every document
 * type in one flat pile, which fails the "non-technical editors, hard
 * requirement" constraint (PRD §4) the moment there are 40+ Regions.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Voter Guide')
    .items([
      S.listItem()
        .title('State')
        .child(
          S.documentList()
            .title('State Regions')
            .filter('_type == "region" && tier == "state"')
        ),
      S.listItem()
        .title('County')
        .child(
          S.documentList()
            .title('County Regions')
            .filter('_type == "region" && tier == "county"')
        ),
      S.listItem()
        .title('City')
        .child(
          S.documentList()
            .title('City Regions')
            .filter('_type == "region" && tier == "city"')
        ),
      S.divider(),
      S.listItem()
        .title('All Races')
        .child(S.documentTypeList('race').title('All Races')),
      S.listItem()
        .title('All Measures')
        .child(S.documentTypeList('measure').title('All Measures')),
      S.listItem()
        .title('All Entries (Candidates)')
        .child(S.documentTypeList('entry').title('All Entries')),
    ])
