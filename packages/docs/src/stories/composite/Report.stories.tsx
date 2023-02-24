import { Report } from '#ui/composite/Report'

import { ComponentMeta, ComponentStory } from '@storybook/react'

const setup: ComponentMeta<typeof Report> = {
  title: 'Composite/Report',
  component: Report,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Report> = (args) => <Report {...args} />

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
