import {defineArrayMember, defineField} from 'sanity'

/**
 * Portable Text for candidate reasoning and measure write-ups.
 *
 * Normal paragraphs only — no heading styles — so a write-up stays one
 * piece of text. Bold and links stay available.
 */
export const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
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
