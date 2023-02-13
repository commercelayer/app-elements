import { Skeleton, SkeletonItem } from '#core-app-elements/atoms/Skeleton'
import { Spacer } from '#core-app-elements/atoms/Spacer'
import { Container } from '#core-app-elements/atoms/Container'
import { ComponentStory, ComponentMeta } from '@storybook/react'

const setup: ComponentMeta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const Template: ComponentStory<typeof Skeleton> = (args) => (
  <Container minHeight={false}>
    <Skeleton {...args}>
      <Spacer bottom='4'>
        <SkeletonItem type='box' height='2rem' />
      </Spacer>
      <Spacer bottom='4'>
        <SkeletonItem type='box' height='2rem' width='90%' />
      </Spacer>
      <Spacer bottom='4'>
        <SkeletonItem type='box' height='2rem' width='50%' />
      </Spacer>
      <Spacer bottom='4'>
        <SkeletonItem type='circle' height='6rem' width='6rem' />
      </Spacer>
    </Skeleton>
  </Container>
)

export const Default = Template.bind({})
Default.args = {
  delayMs: 0
}

export const WithRenderDelay = Template.bind({})
WithRenderDelay.args = {
  delayMs: 3000
}
