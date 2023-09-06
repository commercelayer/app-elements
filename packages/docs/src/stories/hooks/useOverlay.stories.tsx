import { useOverlay } from '#hooks/useOverlay'
import { Button } from '#ui/atoms/Button'
import { type Meta, type StoryFn } from '@storybook/react'

/**
 * Simple hook that return an `Overlay` component along with `open` and `close` methods to control its visibility.
 * Can be initialized with an optional `queryParam`  to be used to open/close the Overlay as new history entry.
 *
 * Example: `useOverlay({queryParam: 'myOverlay'})`
 **/
const setup: Meta = {
  title: 'Hooks/useOverlay',
  args: {},
  argTypes: {
    children: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}
export default setup

/**
 * Overlay is open with a short content and footer button is rendered just underneath it.
 **/
export const Default: StoryFn = () => {
  const { Overlay, open, close } = useOverlay()

  return (
    <div>
      <Button onClick={open}>Open overlay</Button>
      <Overlay
        footer={
          <Button onClick={close} fullWidth>
            close
          </Button>
        }
      >
        <p>Overlay content</p>
      </Overlay>
    </div>
  )
}

/**
 * Overlay is open with long content and footer sticks at the bottom of the viewport.
 **/
export const LongContent: StoryFn = () => {
  const { Overlay, open, close } = useOverlay()

  return (
    <div>
      <Button onClick={open}>Open overlay</Button>
      <Overlay
        footer={
          <Button onClick={close} fullWidth>
            close
          </Button>
        }
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          fringilla, leo vel blandit consequat, arcu tellus tristique ipsum, vel
          accumsan risus urna in ante. Morbi iaculis elit mattis dolor laoreet
          rhoncus. Aliquam interdum vel dui nec dapibus. Praesent id justo
          ultricies quam finibus sollicitudin eu nec magna. Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Nunc eget luctus nisi. Orci varius natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus. Nam malesuada
          lacus eget aliquam tempor. Fusce sit amet lorem bibendum, congue dui
          at, porttitor tellus. Ut venenatis enim ut sapien fringilla, sit amet
          consequat lectus commodo.
        </p>
        <br />
        <p>
          Maecenas euismod lectus at eros hendrerit tincidunt. Nam malesuada
          commodo arcu at ultrices. Praesent dictum lectus erat, sed vulputate
          leo gravida sit amet. Nam ut nunc sed lacus viverra bibendum quis a
          est. Sed enim est, consectetur eget tempus eget, venenatis ac sem.
          Mauris feugiat est in justo elementum congue. Ut posuere nisl nulla,
          nec sagittis leo pellentesque et. Nullam laoreet dignissim dolor, a
          hendrerit dui porta ornare. Integer nec dolor a ligula lacinia maximus
          sit amet eget nisi. Duis quis dolor consequat diam egestas dignissim
          quis a nibh. Phasellus interdum, neque et sodales sodales, urna neque
          facilisis diam, et volutpat sapien nulla at sem. Suspendisse potenti.
        </p>
        <br />
        <p>
          Nam ultricies arcu ipsum, eu lacinia ex lacinia sed. Nulla facilisi.
          Duis id turpis nec nisi sagittis fermentum. Etiam convallis erat ut ex
          hendrerit, a finibus augue consequat. Vestibulum feugiat ex pretium
          nibh euismod, eget gravida leo egestas. Vestibulum at rhoncus purus.
          Vestibulum posuere nec leo ut scelerisque. Integer ultrices quam et
          molestie efficitur. Fusce eu vulputate ex. Sed pulvinar, est sed
          tempor dictum, erat enim gravida nisi, bibendum consectetur eros metus
          ultrices risus. Sed eros nulla, aliquet nec elit pulvinar, facilisis
          tristique nisl. Maecenas at imperdiet elit. Curabitur fermentum leo in
          placerat convallis. Aenean ligula est, malesuada ac erat eget,
          tristique finibus metus. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Donec id libero vitae diam
          cursus pretium.
        </p>
        <br />
        <p>
          Sed efficitur, ante mollis porttitor viverra, purus orci accumsan
          erat, in mattis enim justo ultrices mi. Morbi porttitor lectus metus.
          Nunc blandit sit amet libero nec tristique. Curabitur feugiat
          malesuada tellus, eget tristique nibh molestie a. Praesent risus odio,
          sodales non porta et, pretium nec tortor. Nullam tincidunt mauris ut
          sagittis semper. Aenean congue fermentum eros, in venenatis enim
          maximus vitae. Class aptent taciti sociosqu ad litora torquent per
          conubia nostra, per inceptos himenaeos. Nulla dictum pharetra mi, eu
          pellentesque purus accumsan sed. Vestibulum vel posuere nisl.
        </p>
        <br />
        <p>
          Nam ultricies arcu ipsum, eu lacinia ex lacinia sed. Nulla facilisi.
          Duis id turpis nec nisi sagittis fermentum. Etiam convallis erat ut ex
          hendrerit, a finibus augue consequat. Vestibulum feugiat ex pretium
          nibh euismod, eget gravida leo egestas. Vestibulum at rhoncus purus.
          Vestibulum posuere nec leo ut scelerisque. Integer ultrices quam et
          molestie efficitur. Fusce eu vulputate ex. Sed pulvinar, est sed
          tempor dictum, erat enim gravida nisi, bibendum consectetur eros metus
          ultrices risus. Sed eros nulla, aliquet nec elit pulvinar, facilisis
          tristique nisl. Maecenas at imperdiet elit. Curabitur fermentum leo in
          placerat convallis. Aenean ligula est, malesuada ac erat eget,
          tristique finibus metus. Vestibulum ante ipsum primis in faucibus orci
          luctus et ultrices posuere cubilia curae; Donec id libero vitae diam
          cursus pretium.
        </p>
      </Overlay>
    </div>
  )
}
