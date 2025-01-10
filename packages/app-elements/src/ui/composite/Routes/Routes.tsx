import { formatResourceName } from '#helpers/resources'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { EmptyState } from '#ui/atoms/EmptyState'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { PageLayout } from '#ui/composite/PageLayout'
import { type ListableResourceType } from '@commercelayer/sdk'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import type { SetRequired } from 'type-fest'
import type {
  RouteComponentProps,
  RouteProps as WouterRouteProps
} from 'wouter'
import { Switch, Route as WouterRoute, useLocation } from 'wouter'
import { type GetParams } from './utils'

/**
 * Renders the Switch component to conditionally render a route based on the current path
 * by leveraging the `wouter` library to handle routing.
 * Each route is loaded with a lazy component to improve the performance of the app.
 * While the (lazy) component is loading, a `LoadingPage` component is rendered.
 * If the route is not found, the `GenericPageNotFound` component is rendered.
 *
 * Note: Default exports are required for dynamic / lazy imports.
 *
 * ```
 * <Routes
 *   routes={appRoutes}
 *   list={{
 *     home: {
 *       component: async () => await import('#pages/Home')
 *     },
 *     details: {
 *       component: async () => await import('#pages/Details')
 *     },
 *     filters: {
 *       component: async () => await import('#pages/Filters'),
 *       overlay: true
 *     }
 *   }}
 * />
 * ```
 */
export function Routes<T extends Record<string, { path: string }>>({
  routes,
  list
}: {
  /** Object of available app routes build using the `createRoute` helper method */
  routes: T
  /**
   * Object that contains, for each, provided route the component tp render
   * and the instruction if it has to be rendered as overlay or regular page
   **/
  list: {
    [key in keyof T]: {
      component: () => Promise<{ default: React.ComponentType<any> }>
      overlay?: boolean
    }
  }
}): JSX.Element {
  return (
    <Switch>
      {Object.entries(list).map(([key, { component, ...props }]) => {
        const route = routes[key]

        if (route?.path == null) {
          throw new Error(
            'Missing configuration when defining <Routes routes=".." list=".." />'
          )
        }

        return (
          <Route
            key={route.path}
            path={route.path}
            component={lazy(component)}
            {...props}
          />
        )
      })}

      <Route component={() => <GenericPageNotFound />} />
    </Switch>
  )
}

function Route({
  path,
  component: Component,
  ...rest
}: SetRequired<WouterRouteProps<any>, 'component'> & {
  overlay?: boolean
}): React.ReactNode {
  return (
    <WouterRoute path={path}>
      {(params) => {
        return (
          <Suspense fallback={<LoadingPage overlay={rest.overlay} />}>
            <Component params={params} {...rest} />
          </Suspense>
        )
      }}
    </WouterRoute>
  )
}

export function LoadingPage({
  overlay = false
}: {
  overlay?: boolean
}): JSX.Element {
  const {
    settings: { mode }
  } = useTokenProvider()

  return (
    <div style={overlay ? { backgroundColor: '#F5F5F5' } : undefined}>
      <SkeletonTemplate isLoading>
        <PageLayout
          title={
            <SkeletonTemplate isLoading>Loading app page...</SkeletonTemplate>
          }
          mode={mode}
          gap='only-top'
        >
          <div />
        </PageLayout>
      </SkeletonTemplate>
    </div>
  )
}

/**
 * This component can be used as error component when the resource is not found by passing the resource type.
 * When empty it will render a generic page not found message.
 */
export function GenericPageNotFound({
  resource
}: {
  resource?: ListableResourceType
}): JSX.Element {
  const [, setLocation] = useLocation()
  const { t } = useTranslation()

  return (
    <PageLayout title=''>
      <EmptyState
        title={
          resource == null
            ? t('common.routes.page_not_found')
            : t('common.routes.invalid_resource', {
                resource: formatResourceName({
                  resource,
                  count: 'singular'
                })
              })
        }
        description={
          resource == null
            ? t('common.routes.we_could_not_find_page')
            : t('common.routes.we_could_not_find_resource', {
                resource: formatResourceName({
                  resource,
                  count: 'singular'
                })
              })
        }
        action={
          <Button
            size='regular'
            onClick={() => {
              setLocation('/')
            }}
          >
            {t('common.routes.go_home')}
          </Button>
        }
      />
    </PageLayout>
  )
}

/**
 * Typescript helper to statically type the props of a page component.
 * Usage:
 * ```
 * const DetailsPage: FC<PageProps<typeof appRoutes.details>> ({ params }) => <div>{params.id}</div>
 * export default DetailsPage
 */
export type PageProps<
  Route extends {
    makePath: (...arg: any[]) => string
  }
> = RouteComponentProps<GetParams<Route>> & { overlay?: boolean }
