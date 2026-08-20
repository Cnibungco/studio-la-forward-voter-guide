import {defineArrayMember, defineField} from 'sanity'

/**
 * Portable Text block for endorsement reasoning and measure pros/cons.
 *
 * `{type: 'block'}` already enables bold (`strong`) and a URL `link`
 * annotation via Sanity defaults. Spelling them out here keeps those
 * marks from being dropped if someone later customizes the editor, and
 * does not change the stored array-of-blocks shape.
 */
export const richTextBlock = defineArrayMember({
  type: 'block',
  marks: {
    decorators: [
      {title: 'Strong', value: 'strong'},
      {title: 'Italic', value: 'em'},
      {title: 'Code', value: 'code'},
      {title: 'Underline', value: 'underline'},
      {title: 'Strike', value: 'strike-through'},
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            type: 'url',
            title: 'URL',
            description: 'A valid web, email, phone, or relative link.',
            validation: (Rule) =>
              Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel'],
                allowRelative: true,
              }),
          }),
        ],
      },
    ],
  },
})
