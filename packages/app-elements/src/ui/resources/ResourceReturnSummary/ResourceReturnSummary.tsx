import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  ActionButtons,
  type ActionButtonsProps
} from '#ui/composite/ActionButtons'
import { ResourceLineItems } from '#ui/resources/ResourceLineItems'
import type { Return } from '@commercelayer/sdk'

interface ResourceReturnSummaryProps {
  /**
   * Resource of type Return
   */
  resource: Return
  /**
   * Optional array of footer actions
   */
  footerActions?: ActionButtonsProps['actions']
}

/**
 * Renders `return_line_items` of a given resource of type `Return` and an optional set of footer actions.
 * <span type="info">
 * ResourceReturnSummary is using the `ResourceLineItems` component to render the `return_line_items` at the top.
 * </span>
 */
export const ResourceReturnSummary =
  withSkeletonTemplate<ResourceReturnSummaryProps>(
    ({ resource, footerActions = [] }) => {
      return (
        <div>
          <ResourceLineItems
            editable={false}
            items={resource.return_line_items ?? []}
          />
          <ActionButtons actions={footerActions} />
        </div>
      )
    }
  )

ResourceReturnSummary.displayName = 'ResourceReturnSummary'
