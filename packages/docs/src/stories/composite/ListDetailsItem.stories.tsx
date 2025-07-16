import type { Meta, StoryFn } from "@storybook/react-vite"
import { A } from "#ui/atoms/A"
import { Button } from "#ui/atoms/Button"
import { CopyToClipboard } from "#ui/atoms/CopyToClipboard"
import { Icon } from "#ui/atoms/Icon"
import { Section } from "#ui/atoms/Section"
import { Text } from "#ui/atoms/Text"
import { Dropdown, DropdownItem } from "#ui/composite/Dropdown"
import { ListDetailsItem } from "#ui/composite/ListDetailsItem"
import { ListItem } from "#ui/composite/ListItem"

const setup: Meta<typeof ListDetailsItem> = {
  title: "Composite/ListDetailsItem",
  component: ListDetailsItem,
  parameters: {
    layout: "padded",
  },
}
export default setup

const Template: StoryFn<typeof ListDetailsItem> = (args) => (
  <ListDetailsItem {...args} />
)

export const Default = Template.bind({})
Default.args = {
  label: "Name",
  isLoading: false,
  children: "Gray Women Crop Top with Black Logo (M)",
}

export const WithLink = Template.bind({})
WithLink.args = {
  label: "Name",
  isLoading: false,
  children: (
    <A target="_blank" href="https://commercelayer.io">
      Gray Women Crop Top with Black Logo (M)
    </A>
  ),
}

export const Empty = Template.bind({})
Empty.args = {
  label: "Name",
  isLoading: false,
  childrenAlign: "right",
}

export const List: StoryFn<typeof ListDetailsItem> = (_args) => (
  <>
    <ListDetailsItem
      label="Status"
      childrenAlign="right"
      border="none"
      gutter="none"
    >
      <Button variant="link">In transit</Button>
    </ListDetailsItem>
    <ListDetailsItem
      label="Tracking"
      childrenAlign="right"
      border="none"
      gutter="none"
    >
      42314321ASD4545
    </ListDetailsItem>
    <ListDetailsItem
      label="Estimated delivery"
      childrenAlign="right"
      border="none"
      gutter="none"
    >
      May 17, 2023 12:00 AM
    </ListDetailsItem>
  </>
)

export const ListWithActions: StoryFn<typeof ListDetailsItem> = (_args) => {
  const Menu = (
    <Dropdown
      dropdownLabel={<Icon name="dotsThree" size={24} />}
      dropdownItems={[
        <DropdownItem key="delete" label="Delete" onClick={() => {}} />,
      ]}
    />
  )
  return (
    <Section title="List" actionButton={<Button variant="link">Add</Button>}>
      <ListDetailsItem label="Number" gutter="none">
        <ListItem padding="none" borderStyle="none">
          <Text weight="semibold">is greater than 10</Text>
          {Menu}
        </ListItem>
      </ListDetailsItem>
      <ListDetailsItem label="Color" gutter="none">
        <ListItem padding="none" borderStyle="none">
          <Text weight="semibold">is not Red</Text>
          {Menu}
        </ListItem>
      </ListDetailsItem>
      <ListDetailsItem label="Item" gutter="none">
        <ListItem padding="none" borderStyle="none">
          <Text weight="semibold">is the last one</Text>
          {Menu}
        </ListItem>
      </ListDetailsItem>
      <br />
    </Section>
  )
}

/**
 * ListDetailsItem allow to render long content without breaking the layout.
 *
 * Just be sure that the long children passed to the component can automatically handle the overflow, or content will be truncated by css.
 */
export const ListWithCopyToClipboardAndLongContent: StoryFn<
  typeof ListDetailsItem
> = (_args) => (
  <>
    <ListDetailsItem label="Status">
      <Button variant="link">In transit</Button>
    </ListDetailsItem>
    <ListDetailsItem label="Tracking">42314321ASD4545</ListDetailsItem>
    <ListDetailsItem label="Payment instrument:">
      <CopyToClipboard value='{"issuer_type":"cards"}' />
    </ListDetailsItem>
    <ListDetailsItem label="Payment request data:">
      <CopyToClipboard
        value={`{"web-app":{"servlet":[{"servlet-name":"cofaxEmail","servlet-class":"org.cofax.cds.EmailServlet","init-param":{"mailHost":"mail1","mailHostOverride":"mail2"}},{"servlet-name":"cofaxAdmin","servlet-class":"org.cofax.cds.AdminServlet"},{"servlet-name":"fileServlet","servlet-class":"org.cofax.cds.FileServlet"},{"servlet-name":"cofaxTools","servlet-class":"org.cofax.cms.CofaxToolsServlet","init-param":{"templatePath":"toolstemplates/","log":1,"logLocation":"/usr/local/tomcat/logs/CofaxTools.log","logMaxSize":"","dataLog":1,"dataLogLocation":"/usr/local/tomcat/logs/dataLog.log","dataLogMaxSize":"","removePageCache":"/content/admin/remove?cache=pages&id=","removeTemplateCache":"/content/admin/remove?cache=templates&id=","fileTransferFolder":"/usr/local/tomcat/webapps/content/fileTransferFolder","lookInContext":1,"adminGroupID":4,"betaServer":true}}],"servlet-mapping":{"cofaxCDS":"/","cofaxEmail":"/cofaxutil/aemail/*","cofaxAdmin":"/admin/*","fileServlet":"/static/*","cofaxTools":"/tools/*"},"taglib":{"taglib-uri":"cofax.tld","taglib-location":"/WEB-INF/tlds/cofax.tld"}}}`}
      />
    </ListDetailsItem>
    <ListDetailsItem label="Description:">
      <CopyToClipboard value="Body-hugging crop top that will become the centerpiece of any summer outfit! 82% polyester, 18% spandex. Made with a smooth and comfortable microfiber yarn." />
    </ListDetailsItem>

    <ListDetailsItem label="Long string (no whitespaces):">
      <CopyToClipboard value="eyJ2ZXJzaW9uIjoiMS4wLjAiLCJkZXZpY2VGaW5nZXJwcmludCI6IjFCMk0yWdsdsadsdsAwMDAwSHhaMmZZNHUwN3J6c2VLR1FKOWw6NDAiLCJwZXJzaXN0ZW50Q29va2llIjpbXSwiY29tcG9uZW50cyI6edsdsdsdxNmUzNdsdsdsdsdsdsdsdsdsdsdwMDAwMDAwMDAwMCJ9fQ" />
    </ListDetailsItem>
    <ListDetailsItem label="String child that do not handle overflow:">
      eyJ2ZXJzaW9uIjoiMS4wLjAiLCJkZXZpY2VGaW5nZXJwcmludCI6IjFCMk0yWdsdsadsdsAwMDAwSHhaMmZZNHUwN3J6c2VLR1FKOWw6NDAiLCJwZXJzaXN0ZW50Q29va2llIjpbXSwiY29tcG9uZW50cyI6edsdsdsdxNmUzNdsdsdsdsdsdsdsdsdsdsdwMDAwMDAwMDAwMCJ9fQ
    </ListDetailsItem>
    <ListDetailsItem label="Long content in <Text>:" childrenAlign="right">
      <Text>
        customer, shipping_address, billing_address,
        payment_method.payment_gateway, line_items.item, shipments.parcels,
        line_items.stock_line_items.stock_item.sku.prices,
        shipments.shipping_method
      </Text>
    </ListDetailsItem>
  </>
)
