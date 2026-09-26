import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'LA Forward Voter Guide',

  projectId: 'wcogcahu',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    // Singleton — creating a second siteSettings document would fork the copy.
    templates: (templates) => templates.filter((template) => template.schemaType !== 'siteSettings'),
  },
})
