import '#styles/global.css'

// Helpers
export { goBack, navigateTo } from '#helpers/appsNavigation'
export { isAttachmentValidNote, referenceOrigins } from '#helpers/attachments'
export {
  formatDate,
  getIsoDateAtDayEdge,
  getIsoDateAtDaysBefore,
  sortAndGroupByDate,
  timeSeparator
} from '#helpers/date'
export { downloadJsonAsFile } from '#helpers/downloadJsonAsFile'
export { computeFullname, formatDisplayName } from '#helpers/name'
export { formatResourceName, type TriggerAttribute } from '#helpers/resources'
export {
  getAvatarSrcFromRate,
  getParcelTrackingDetail,
  getParcelTrackingDetails,
  getShipmentRate,
  getShipmentRates,
  hasBeenPurchased,
  hasSingleTracking,
  type Rate,
  type TrackingDetail
} from '#helpers/tracking'
// Hooks
export { useClickAway } from '#hooks/useClickAway'
export { useDelayShow } from '#hooks/useDelayShow'
export { useIsChanged } from '#hooks/useIsChanged'
export { useOverlay } from '#hooks/useOverlay'
// Providers
export {
  CoreSdkProvider,
  useCoreApi,
  useCoreSdkProvider
} from '#providers/CoreSdkProvider'
export { ErrorBoundary } from '#providers/ErrorBoundary'
export {
  MetaTags,
  TokenProvider,
  useTokenProvider,
  type TokenProviderAllowedApp,
  type TokenProviderPermissionItem,
  type TokenProviderRoleActions,
  type TokenProviderRolePermissions,
  type TokenProviderTokenApplicationKind
} from '#providers/TokenProvider'

// Atoms
export { A } from '#ui/atoms/A'
export { Avatar } from '#ui/atoms/Avatar'
export { AvatarLetter } from '#ui/atoms/AvatarLetter'
export { Badge, badgeVariants } from '#ui/atoms/Badge'
export { BlockCode } from '#ui/atoms/BlockCode'
export { Button } from '#ui/atoms/Button'
export { ButtonFilter } from '#ui/atoms/ButtonFilter'
export { Card } from '#ui/atoms/Card'
export { Container } from '#ui/atoms/Container'
export { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
export { EmptyState } from '#ui/atoms/EmptyState'
export { Grid } from '#ui/atoms/Grid'
export { Hint } from '#ui/atoms/Hint'
export { Hr } from '#ui/atoms/Hr'
export { Icon, iconNames } from '#ui/atoms/Icon'
export { PageHeading } from '#ui/atoms/PageHeading'
export { Pagination } from '#ui/atoms/Pagination'
export { Progress } from '#ui/atoms/Progress'
export { RadialProgress } from '#ui/atoms/RadialProgress'
export { Section } from '#ui/atoms/Section'
export { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
export {
  SkeletonTemplate,
  withSkeletonTemplate
} from '#ui/atoms/SkeletonTemplate'
export { Spacer } from '#ui/atoms/Spacer'
export { Stack } from '#ui/atoms/Stack'
export { StatusDot } from '#ui/atoms/StatusDot'
export { Steps } from '#ui/atoms/Steps'
export { Table, Td, Th, Tr } from '#ui/atoms/Table'
export { Tab, Tabs } from '#ui/atoms/Tabs'
export { Tag } from '#ui/atoms/Tag'
export { Text } from '#ui/atoms/Text'
export {
  DropdownMenu,
  DropdownMenuDivider,
  DropdownMenuItem
} from '#ui/atoms/dropdown'
// Composite
export { ActionButtons } from '#ui/composite/ActionButtons'
export { CardDialog } from '#ui/composite/CardDialog'
export { ContextMenu } from '#ui/composite/ContextMenu'
export { List } from '#ui/composite/List'
export { ListDetails } from '#ui/composite/ListDetails'
export { ListDetailsItem } from '#ui/composite/ListDetailsItem'
export { ListItem } from '#ui/composite/ListItem'
export { PageError } from '#ui/composite/PageError'
export { PageLayout } from '#ui/composite/PageLayout'
export { PageSkeleton } from '#ui/composite/PageSkeleton'
export { Report } from '#ui/composite/Report'
export { SearchBar } from '#ui/composite/SearchBar'
export { TableData } from '#ui/composite/TableData'
export { Timeline, type TimelineEvent } from '#ui/composite/Timeline'
// Forms
export { HookedForm } from '#ui/forms/Form'
export { HookedInput, Input } from '#ui/forms/Input'
export { HookedInputCheckbox, InputCheckbox } from '#ui/forms/InputCheckbox'
export { InputCheckboxGroup } from '#ui/forms/InputCheckboxGroup'
export {
  HookedInputCurrency,
  InputCurrency,
  formatCentsToCurrency,
  type InputCurrencyProps
} from '#ui/forms/InputCurrency'
export { InputCurrencyRange } from '#ui/forms/InputCurrencyRange'
export { HookedInputDate, InputDate } from '#ui/forms/InputDate'
export { HookedInputDateRange, InputDateRange } from '#ui/forms/InputDateRange'
export { InputFeedback } from '#ui/forms/InputFeedback'
export { InputFile } from '#ui/forms/InputFile'
export { InputJson } from '#ui/forms/InputJson'
export { HookedInputMetadata } from '#ui/forms/InputMetadata'
export { InputRadioGroup } from '#ui/forms/InputRadioGroup'
export { InputReadonly } from '#ui/forms/InputReadonly'
export {
  HookedInputResourceGroup,
  InputResourceGroup
} from '#ui/forms/InputResourceGroup'
export {
  HookedInputSelect,
  InputSelect,
  flatSelectValues,
  getDefaultValueFromFlatten,
  isGroupedSelectValues,
  isMultiValueSelected,
  isSingleValueSelected,
  type InputSelectProps,
  type SelectValue
} from '#ui/forms/InputSelect'
export {
  HookedInputSimpleSelect,
  InputSimpleSelect
} from '#ui/forms/InputSimpleSelect'
export { HookedInputSpinner, InputSpinner } from '#ui/forms/InputSpinner'
export { HookedInputSwitch, InputSwitch } from '#ui/forms/InputSwitch'
export { InputTextArea } from '#ui/forms/InputTextArea'
export {
  HookedInputToggleButton,
  InputToggleButton,
  type InputToggleButtonProps,
  type ToggleButtonOption
} from '#ui/forms/InputToggleButton'
export { Label } from '#ui/forms/Label'
export { Legend } from '#ui/forms/Legend'
export {
  HookedValidationApiError,
  HookedValidationError,
  setApiFormErrors,
  useValidationFeedback
} from '#ui/forms/ReactHookForm'
// Resources
export { ResourceLineItems } from '#ui/resources/ResourceLineItems'
export { ResourceList } from '#ui/resources/ResourceList'
export { ResourceListItem } from '#ui/resources/ResourceListItem'
export { ResourceListItemsMetadata } from '#ui/resources/ResourceListItemsMetadata'
export { ResourceOrderSummary } from '#ui/resources/ResourceOrderSummary'
export { ResourceOrderTimeline } from '#ui/resources/ResourceOrderTimeline'
export { ResourceShipmentParcels } from '#ui/resources/ResourceShipmentParcels'
export { ResourceTags } from '#ui/resources/ResourceTags'
export { useResourceFilters } from '#ui/resources/useResourceFilters'
// Dictionaries
export {
  getCustomerDisplayStatus,
  getCustomerStatusName
} from '#dictionaries/customers'
export {
  getOrderDisplayStatus,
  getOrderFulfillmentStatusName,
  getOrderPaymentStatusName,
  getOrderStatusName,
  getOrderTransactionPastTense,
  getOrderTriggerAttributeName
} from '#dictionaries/orders'
export {
  getReturnDisplayStatus,
  getReturnStatusName,
  getReturnTriggerAttributeName
} from '#dictionaries/returns'
