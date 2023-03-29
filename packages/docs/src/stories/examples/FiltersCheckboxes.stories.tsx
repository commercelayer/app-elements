import { Avatar } from '#ui/atoms/Avatar'
import { Card } from '#ui/atoms/Card'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import { InputCheckbox } from '#ui/forms/InputCheckbox'
import { ComponentStory, Meta } from '@storybook/react'
import { useState } from 'react'

const setup: Meta = {
  title: 'Examples/Filters Checkboxes',
  parameters: {
    layout: 'fullscreen'
  }
}
export default setup

const options = [
  {
    id: 'rlEPzheRgO',
    name: 'NY Store'
  },
  {
    id: 'dlQbPhNNop',
    name: 'Europe'
  },
  {
    id: 'AlRevhXQga',
    name: 'Milan'
  },
  {
    id: 'AjRevhQOoa',
    name: 'Market Special'
  },
  {
    id: 'EjDkXhNEoD',
    name: 'USA'
  }
]

const Template: ComponentStory<typeof InputCheckbox> = (args) => {
  const [selectedIds, setSelectedId] = useState<string[]>([])

  return (
    <PageLayout title='Filters' onGoBack={() => {}}>
      <Spacer bottom='4'>
        <Text variant='info' weight='medium'>
          Markets{' '}
          {selectedIds.length > 0
            ? `${selectedIds.length} of ${options.length}`
            : options.length}
        </Text>
      </Spacer>
      <Card>
        {options.map((opt, idx) => {
          const isChecked = selectedIds.includes(opt.id)
          return (
            <Spacer
              bottom={options.length === idx + 1 ? undefined : '4'}
              key={opt.id}
            >
              <InputCheckbox
                checked={isChecked}
                onChange={() => {
                  if (isChecked) {
                    setSelectedId((prev) => prev.filter((id) => id !== opt.id))
                  } else {
                    setSelectedId((prev) => [...prev, opt.id])
                  }
                }}
                icon={
                  <Avatar
                    size='small'
                    shape='circle'
                    border='none'
                    src={makeGravatarUrl(opt.name, idx)}
                    alt={opt.name}
                  />
                }
              >
                <Text weight='semibold'>{opt.name}</Text>
              </InputCheckbox>
            </Spacer>
          )
        })}
      </Card>
    </PageLayout>
  )
}

export const Default = Template.bind({})

function makeGravatarUrl(name: string, index: number): string {
  const colors = ['FF656B', '055463', 'FFAB2E', '282929', '001993']
  const bgColor = colors[Math.min(index, colors.length - 1)] ?? 'FF656B'
  const letters = name.substring(0, 2)
  return `https://ui-avatars.com/api/${letters}/160/${bgColor}/FFFFFF/2/0.33/false/true/true`
}
