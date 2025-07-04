import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownSearch
} from '#ui/composite/Dropdown'
import { type Meta, type StoryFn } from '@storybook/react'

const setup: Meta<typeof Dropdown> = {
  title: 'Composite/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <div
        style={{
          paddingBottom: '120px'
        }}
      >
        <Story />
      </div>
    )
  ]
}
export default setup

const Template: StoryFn<typeof Dropdown> = (args) => {
  return <Dropdown {...args} />
}

export const Default = Template.bind({})
Default.args = {
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/**
 * Each dropdown item can have an `info` prop that will be rendered as a secondary text on the right side of the item.
 * When the `info` prop is set, the item will have a fixed minimum width to accommodate the text.
 **/
export const WithInfo = Template.bind({})
WithInfo.args = {
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {}}
        label='Europe'
        info='€45.230'
        icon='check'
      />
      <DropdownItem
        onClick={() => {}}
        label='USA'
        info='$15.445'
        icon='keep-space'
      />
      <DropdownItem
        onClick={() => {}}
        label='Canada'
        info='$3.890'
        icon='keep-space'
      />
      <DropdownItem
        onClick={() => {}}
        label='Japan'
        info='¥780'
        icon='keep-space'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {}}
        label='Italy'
        info='€0'
        icon='keep-space'
      />
      <DropdownItem
        onClick={() => {}}
        label='France'
        info='€0'
        icon='keep-space'
      />
      <DropdownItem
        onClick={() => {}}
        label='United States of America'
        info='$1,000'
        icon='keep-space'
      />
    </>
  )
}

/**
 * Dropdown menu has a fixed maximum height. When content exceeds this height, it will be scrollable.
 **/
export const WithScrollbar = Template.bind({})
WithScrollbar.args = {
  dropdownLabel: 'Long menu list',
  dropdownItems: (
    <>
      {Array.from({ length: 30 }, (_, i) => (
        <DropdownItem key={i} label={`Item ${i + 1}`} onClick={() => {}} />
      ))}
    </>
  )
}
WithScrollbar.decorators = [
  (Story) => (
    <div
      style={{
        paddingBottom: '320px'
      }}
    >
      <Story />
    </div>
  )
]

/**
 * It is possible to pass a custom `<button>` element as the dropdown label.
 * In this case the Dropdown component will use the provided button instead of creating a new one.
 **/
export const CustomButton = Template.bind({})
CustomButton.args = {
  dropdownLabel: <button>click me</button>,
  dropdownItems: (
    <>
      <DropdownItem label='Edit' />
      <DropdownItem label='Delete' />
    </>
  )
}

/**
 * While by default, the dropdown menu will try to fit its content using a min/max width range,
 * it can be also set to use a fixed `wider` width.
 **/
export const MenuWidthWide = Template.bind({})
MenuWidthWide.args = {
  menuWidth: 'wide',
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Lorem impsum dolor sit amet elit.'
      />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Short label'
      />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Still trimmed when max width is reached'
      />
    </>
  )
}

/** By default, the component renders as a `dots-three-circle` Phosphor icon, but you can provide instead a different icon or a more generic JSX Element. */
export const DropdownLabelAsJSXElement = Template.bind({})
DropdownLabelAsJSXElement.args = {
  dropdownLabel: (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='32'
      height='32'
      fill='#000000'
      viewBox='0 0 256 256'
    >
      <path d='M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128Zm56-12a12,12,0,1,0,12,12A12,12,0,0,0,196,116ZM60,116a12,12,0,1,0,12,12A12,12,0,0,0,60,116Z' />
    </svg>
  ),
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** When the `dropdownLabel` prop is set as a `button`, the component will use the provided Button instead of creating a new one. */
export const DropdownLabelAsButton = Template.bind({})
DropdownLabelAsButton.args = {
  dropdownLabel: (
    <Button variant='secondary'>
      <Icon name='dotsThree' size={16} />
    </Button>
  ),
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** The provided `button` can also have the `variant="circle"`. */
export const DropdownLabelAsCircleButton = Template.bind({})
DropdownLabelAsCircleButton.args = {
  dropdownLabel: (
    <Button variant='circle'>
      <Icon name='dotsThree' size={24} />
    </Button>
  ),
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Edit clicked!')
        }}
        label='Edit'
      />
      <DropdownDivider />
      <DropdownItem
        onClick={() => {
          alert('Delete clicked!')
        }}
        label='Delete'
      />
    </>
  )
}

/** When the `dropdownLabel` prop is set as a `string`, the component renders as a link with a caret-down icon. */
export const DropdownLabelAsString = Template.bind({})
DropdownLabelAsString.args = {
  dropdownLabel: 'Add item',
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Add a SKU clicked!')
        }}
        label='Add a SKU'
      />
      <DropdownItem
        onClick={() => {
          alert('Add a bundle clicked!')
        }}
        label='Add a bundle'
      />
    </>
  )
}

/** Dropdown menu can have an header  */
export const MenuWithHeader = Template.bind({})
MenuWithHeader.args = {
  menuHeader: 'ringostarr@commercelayer-very-long-text.io',
  dropdownItems: (
    <>
      <DropdownItem onClick={() => {}} label='Edit' />
      <DropdownItem onClick={() => {}} label='Delete' />
    </>
  )
}

/** Dropdown menu can have an header  */
export const ItemsWithSkeleton = Template.bind({})
ItemsWithSkeleton.args = {
  dropdownItems: (
    <>
      <DropdownItem label='Item loaded' />
      <SkeletonTemplate delayMs={0} isLoading>
        <DropdownItem label='Item is loading' />
        <DropdownItem label='Item is loading' />
      </SkeletonTemplate>
      <DropdownItem onClick={() => {}} label='Item loaded' />
    </>
  )
}

/** Dropdown items can be anchor or button on div depending on the existence of `href` or `onClick`  */
export const ItemsDifferentTags = Template.bind({})
ItemsDifferentTags.args = {
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('clicked!')
        }}
        label='I am a button with onClick'
      />
      <DropdownItem label='I am a button without onClick' />
      <DropdownItem
        href='https://commercelayer.io/'
        target='_blank'
        label='I am a link'
      />
    </>
  )
}

/**
 * Dropdown items can also have icons. When you need to list them
 * together with items without icons, you can pass `keep-space` so gap will be maintained.
 **/
export const ItemsWithIcons = Template.bind({})
ItemsWithIcons.args = {
  dropdownItems: (
    <>
      <DropdownItem onClick={() => {}} icon='userCircle' label='Profile' />
      <DropdownItem onClick={() => {}} icon='creditCard' label='Subscription' />
      <DropdownItem
        onClick={() => {}}
        icon='keep-space'
        label='Super long label that eventually will be trimmed'
      />
      <DropdownItem onClick={() => {}} icon='keep-space' label='No icon' />
      <DropdownDivider />
      <DropdownItem onClick={() => {}} icon='signOut' label='Logout' />
    </>
  )
}

/**
 * Dropdown can also accept a DropdownSearch item that returns debounced values.
 **/
export const WithDropdownSearch = Template.bind({})
WithDropdownSearch.args = {
  dropdownItems: (
    <>
      <DropdownSearch
        onSearch={(hint) => {
          console.log(hint)
        }}
        placeholder='Search...'
      />
      <DropdownDivider />
      <DropdownItem icon='check' label='Green' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='Red' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='Yellow' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='Black' />
      <DropdownItem onClick={() => {}} icon='keep-space' label='White' />
    </>
  )
}

/** Dropdown can also be used as a Section's action button. */
export const WithinASection: StoryFn<typeof Dropdown> = (args) => {
  return (
    <Section title='Summary' actionButton={<Dropdown {...args} />}>
      <Spacer top='4'>Content here ..</Spacer>
    </Section>
  )
}
WithinASection.args = {
  dropdownLabel: (
    <Button variant='secondary' size='mini' alignItems='center'>
      <Icon name='plus' />
      Add
    </Button>
  ),
  dropdownItems: (
    <>
      <DropdownItem
        onClick={() => {
          alert('Add a SKU clicked!')
        }}
        label='Add a SKU'
      />
      <DropdownItem
        onClick={() => {
          alert('Add a bundle clicked!')
        }}
        label='Add a bundle'
      />
    </>
  )
}
WithinASection.parameters = {
  layout: 'padded'
}

/**
 * Arrow will try to center itself to the parent element when is smaller than 50px.
 **/
export const AutoCenterArrow: StoryFn = (args) => {
  return (
    <div>
      <div className='flex gap-8'>
        <div>
          <Dropdown
            dropdownLabel={<Icon name='arrowCircleDown' size={30} />}
            dropdownItems={Default.args?.dropdownItems}
            menuPosition='bottom-left'
          />
        </div>
        <div>
          <Dropdown
            dropdownLabel={<Icon name='arrowCircleDown' size={48} />}
            dropdownItems={Default.args?.dropdownItems}
            menuPosition='bottom-right'
          />
        </div>
      </div>
    </div>
  )
}

/** Dropdown can also be used with different opening positions */
export const Positioning: StoryFn = (args) => {
  const items = Default.args?.dropdownItems
  return (
    <div>
      <div className='flex flex-wrap gap-8 justify-around'>
        <Dropdown
          dropdownLabel={<div>top-left</div>}
          dropdownItems={items}
          menuPosition='top-left'
        />
        <Dropdown
          dropdownLabel={<div>top-right</div>}
          dropdownItems={items}
          menuPosition='top-right'
        />
        <Dropdown
          dropdownLabel={<div>bottom-left</div>}
          dropdownItems={items}
          menuPosition='bottom-left'
        />
        <Dropdown
          dropdownLabel={<div>bottom-right</div>}
          dropdownItems={items}
          menuPosition='bottom-right'
        />
      </div>
    </div>
  )
}
Positioning.decorators = [
  (Story) => (
    <div
      style={{
        paddingTop: '120px'
      }}
    >
      <Story />
    </div>
  )
]
