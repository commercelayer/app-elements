import '#styles/global.css'

// Helpers
export { goBack, navigateTo } from '#helpers/appsNavigation'
export { isAttachmentValidNote, referenceOrigins } from '#helpers/attachments'
export {
  formatDate,
  formatDateWithPredicate,
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
export { useOnBlurFromContainer } from '#hooks/useOnBlurFromContainer'
export { useOverlay } from '#hooks/useOverlay'
// Providers
export {
  CoreSdkProvider,
  useCoreApi,
  useCoreSdkProvider
} from '#providers/CoreSdkProvider'
export { ErrorBoundary } from '#providers/ErrorBoundary'
export { GTMProvider, useTagManager } from '#providers/GTMProvider'
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
export { A, type AProps } from '#ui/atoms/A'
export { Alert, type AlertProps } from '#ui/atoms/Alert'
export { Avatar, type AvatarProps } from '#ui/atoms/Avatar'
export { AvatarLetter, type AvatarLetterProps } from '#ui/atoms/AvatarLetter'
export { Badge, type BadgeProps } from '#ui/atoms/Badge'
export { Button, type ButtonProps } from '#ui/atoms/Button'
export { ButtonFilter, type ButtonFilterProps } from '#ui/atoms/ButtonFilter'
export { Card, type CardProps } from '#ui/atoms/Card'
export { Container, type ContainerProps } from '#ui/atoms/Container'
export {
  CopyToClipboard,
  type CopyToClipboardProps
} from '#ui/atoms/CopyToClipboard'
export { EmptyState, type EmptyStateProps } from '#ui/atoms/EmptyState'
export { Grid, type GridProps } from '#ui/atoms/Grid'
export { Hint, type HintProps } from '#ui/atoms/Hint'
export { Hr, type HrProps } from '#ui/atoms/Hr'
export { Icon, type IconProps } from '#ui/atoms/Icon'
export { PageHeading, type PageHeadingProps } from '#ui/atoms/PageHeading'
export { Pagination, type PaginationProps } from '#ui/atoms/Pagination'
export { Progress, type ProgressProps } from '#ui/atoms/Progress'
export {
  RadialProgress,
  type RadialProgressProps
} from '#ui/atoms/RadialProgress'
export { RemoveButton, type RemoveButtonProps } from '#ui/atoms/RemoveButton'
export { Section, type SectionProps } from '#ui/atoms/Section'
export {
  Skeleton,
  SkeletonItem,
  type SkeletonItemProps,
  type SkeletonProps
} from '#ui/atoms/Skeleton'
export {
  SkeletonTemplate,
  withSkeletonTemplate
} from '#ui/atoms/SkeletonTemplate'
export { Spacer, type SpacerProps } from '#ui/atoms/Spacer'
export { Stack, type StackProps } from '#ui/atoms/Stack'
export { StatusDot, type StatusDotProps } from '#ui/atoms/StatusDot'
export { StatusIcon, type StatusIconProps } from '#ui/atoms/StatusIcon'
export { Steps, type StepsProps } from '#ui/atoms/Steps'
export {
  Table,
  Td,
  Th,
  Tr,
  type TableProps,
  type TdProps,
  type ThProps,
  type TrProps
} from '#ui/atoms/Table'
export { Tab, Tabs, type TabProps, type TabsProps } from '#ui/atoms/Tabs'
export { Tag, type TagProps } from '#ui/atoms/Tag'
export { Text, type TextProps } from '#ui/atoms/Text'
// Composite
export {
  ActionButtons,
  type ActionButtonsProps
} from '#ui/composite/ActionButtons'
export { CardDialog, type CardDialogProps } from '#ui/composite/CardDialog'
export {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  DropdownSearch,
  type DropdownDividerProps,
  type DropdownItemProps,
  type DropdownProps,
  type DropdownSearchProps
} from '#ui/composite/Dropdown'
export { List, type ListProps } from '#ui/composite/List'
export { ListDetails, type ListDetailsProps } from '#ui/composite/ListDetails'
export {
  ListDetailsItem,
  type ListDetailsItemProps
} from '#ui/composite/ListDetailsItem'
export { ListItem, type ListItemProps } from '#ui/composite/ListItem'
export {
  OrganizationMenu,
  OrganizationMenuItem,
  type OrganizationMenuItemProps
} from '#ui/composite/OrganizationMenu'
export { PageError, type PageErrorProps } from '#ui/composite/PageError'
export { PageLayout, type PageLayoutProps } from '#ui/composite/PageLayout'
export {
  PageSkeleton,
  type PageSkeletonProps
} from '#ui/composite/PageSkeleton'
export { Report, type ReportProps } from '#ui/composite/Report'
export { SearchBar, type SearchBarProps } from '#ui/composite/SearchBar'
export { SwitchMode, type SwitchModeProps } from '#ui/composite/SwitchMode'
export { TableData, type TableDataProps } from '#ui/composite/TableData'
export {
  Timeline,
  type TimelineEvent,
  type TimelineProps
} from '#ui/composite/Timeline'
// Forms
export { HookedForm } from '#ui/forms/Form'
export {
  HookedInput,
  Input,
  type HookedInputProps,
  type InputProps
} from '#ui/forms/Input'
export {
  HookedInputCheckbox,
  InputCheckbox,
  type HookedInputCheckboxProps,
  type InputCheckboxProps
} from '#ui/forms/InputCheckbox'
export {
  HookedInputCheckboxGroup,
  InputCheckboxGroup,
  type HookedInputCheckboxGroupProps,
  type InputCheckboxGroupProps
} from '#ui/forms/InputCheckboxGroup'
export {
  HookedInputCurrency,
  InputCurrency,
  formatCentsToCurrency,
  type CurrencyCode,
  type HookedInputCurrencyProps,
  type InputCurrencyProps
} from '#ui/forms/InputCurrency'
export {
  InputCurrencyRange,
  type InputCurrencyRangeProps
} from '#ui/forms/InputCurrencyRange'
export {
  HookedInputDate,
  InputDate,
  type HookedInputDateProps,
  type InputDateProps
} from '#ui/forms/InputDate'
export {
  HookedInputDateRange,
  InputDateRange,
  type HookedInputDateRangeProps,
  type InputDateRangeProps
} from '#ui/forms/InputDateRange'
export { InputFeedback, type InputFeedbackProps } from '#ui/forms/InputFeedback'
export { InputFile, type InputFileProps } from '#ui/forms/InputFile'
export { InputJson, type InputJsonProps } from '#ui/forms/InputJson'
export {
  HookedInputRadioGroup,
  InputRadioGroup,
  type HookedInputRadioGroupProps,
  type InputRadioGroupProps
} from '#ui/forms/InputRadioGroup'
export { InputReadonly, type InputReadonlyProps } from '#ui/forms/InputReadonly'
export {
  HookedInputResourceGroup,
  InputResourceGroup,
  type HookedInputResourceGroupProps,
  type InputResourceGroupProps
} from '#ui/forms/InputResourceGroup'
export {
  HookedInputSelect,
  InputSelect,
  flatSelectValues,
  getDefaultValueFromFlatten,
  isGroupedSelectValues,
  isMultiValueSelected,
  isSingleValueSelected,
  type HookedInputSelectProps,
  type InputSelectProps,
  type InputSelectValue
} from '#ui/forms/InputSelect'
export {
  HookedInputSimpleSelect,
  InputSimpleSelect,
  type HookedInputSimpleSelectProps,
  type InputSimpleSelectProps
} from '#ui/forms/InputSimpleSelect'
export {
  HookedInputSpinner,
  InputSpinner,
  type HookedInputSpinnerProps,
  type InputSpinnerProps
} from '#ui/forms/InputSpinner'
export {
  HookedInputSwitch,
  InputSwitch,
  type HookedInputSwitchProps,
  type InputSwitchProps
} from '#ui/forms/InputSwitch'
export {
  HookedInputTextArea,
  InputTextArea,
  type HookedInputTextAreaProps,
  type InputTextAreaProps
} from '#ui/forms/InputTextArea'
export {
  HookedInputToggleButton,
  InputToggleButton,
  type HookedInputToggleButtonProps,
  type InputToggleButtonProps
} from '#ui/forms/InputToggleButton'
export { Label, type LabelProps } from '#ui/forms/Label'
export { Legend, type LegendProps } from '#ui/forms/Legend'
export {
  HookedValidationApiError,
  HookedValidationError,
  setApiFormErrors,
  useValidationFeedback
} from '#ui/forms/ReactHookForm'
// Resources
export {
  ResourceAddress,
  type ResourceAddressProps
} from '#ui/resources/ResourceAddress'
export {
  ResourceLineItems,
  type ResourceLineItemsProps
} from '#ui/resources/ResourceLineItems'
export {
  ResourceList,
  type ResourceListProps
} from '#ui/resources/ResourceList'
export {
  ResourceListItem,
  type ResourceListItemProps
} from '#ui/resources/ResourceListItem'
export {
  ResourceMetadata,
  type ResourceMetadataProps
} from '#ui/resources/ResourceMetadata'
export {
  ResourceOrderSummary,
  type ResourceOrderSummaryProps
} from '#ui/resources/ResourceOrderSummary'
export {
  ResourceOrderTimeline,
  type ResourceOrderTimelineProps
} from '#ui/resources/ResourceOrderTimeline'
export {
  ResourceShipmentParcels,
  type ResourceShipmentParcelsProps
} from '#ui/resources/ResourceShipmentParcels'
export {
  ResourceTags,
  type ResourceTagsProps
} from '#ui/resources/ResourceTags'
export {
  useResourceFilters,
  type FiltersInstructions
} from '#ui/resources/useResourceFilters'
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
  getReturnStatusName
} from '#dictionaries/returns'
export {
  getShipmentDisplayStatus,
  getShipmentStatusName
} from '#dictionaries/shipments'
export {
  getStockTransferDisplayStatus,
  getStockTransferStatusName
} from '#dictionaries/stockTransfers'
