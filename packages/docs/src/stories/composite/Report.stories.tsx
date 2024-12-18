import { I18NProvider } from '#providers/I18NProvider'
import { Report } from '#ui/composite/Report'

import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Report> = {
  title: 'Composite/Report',
  component: Report,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: StoryFn<typeof Report> = (args) => (
  <I18NProvider localeCode='it'>
    <Report {...args} />
  </I18NProvider>
)

export const Default = Template.bind({})
Default.args = {
  isLoading: false,
  items: [
    {
      label: 'Record imported',
      count: 500,
      linkUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkLabel: 'Download CSV file'
    },
    {
      label: 'Errors',
      count: 100,
      downloadJsonAsFile: {
        foo: 'bar',
        hello: 'world',
        test: true
      },
      downloadJsonFilename: 'testerros',
      linkLabel: 'View logs'
    }
  ]
}

export const Single = Template.bind({})
Single.args = {
  isLoading: false,
  items: [
    {
      label: 'Record imported',
      count: 500,
      linkUrl:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      linkLabel: 'Download CSV file'
    }
  ]
}

export const NoLinks = Template.bind({})
NoLinks.args = {
  isLoading: false,
  items: [
    {
      label: 'Record imported',
      count: 500
    }
  ]
}
