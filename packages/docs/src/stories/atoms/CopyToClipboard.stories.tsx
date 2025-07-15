import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { type Meta, type StoryFn } from '@storybook/react-vite'

const setup: Meta<typeof CopyToClipboard> = {
  title: 'Atoms/CopyToClipboard',
  component: CopyToClipboard,
  parameters: {
    layout: 'padded'
  }
}
export default setup

const TemplateDefault: StoryFn<typeof CopyToClipboard> = (args) => (
  <CopyToClipboard {...args} />
)
export const Default = TemplateDefault.bind({})
Default.args = {
  value: 'BEANIEXXFFFFFF000000XXXX'
}

const TemplateStacked: StoryFn<typeof CopyToClipboard> = (args) => (
  <>
    <CopyToClipboard {...args} />
    <CopyToClipboard value='Soft double-layered customizable beanie. 95% polyester, 5% spandex. Regular fit. Accurately printed, cut, and hand-sewn.' />
    <CopyToClipboard value='https://data.commercelayer.app/seed/images/skus/BEANIEXXFFFFFF000000XXXX_FLAT.png' />
  </>
)

export const Stacked = TemplateStacked.bind({})
Stacked.args = {
  value: 'BEANIEXXFFFFFF000000XXXX'
}

const TemplateEmpty: StoryFn<typeof CopyToClipboard> = (args) => (
  <>
    <CopyToClipboard {...args} />
    <CopyToClipboard {...args} />
  </>
)
export const Empty = TemplateEmpty.bind({})
Empty.args = {
  value: ''
}

/** When content is identified as JSON string it will be rendered accordinling with a max-height and scrollable overflow */
export const WithJsonContent: StoryFn<typeof CopyToClipboard> = (args) => (
  <>
    <CopyToClipboard value='{"issuer_type":"cards"}' />
    <CopyToClipboard
      value={`{"web-app":{"servlet":[{"servlet-name":"cofaxEmail","servlet-class":"org.cofax.cds.EmailServlet","init-param":{"mailHost":"mail1","mailHostOverride":"mail2"}},{"servlet-name":"cofaxAdmin","servlet-class":"org.cofax.cds.AdminServlet"},{"servlet-name":"fileServlet","servlet-class":"org.cofax.cds.FileServlet"},{"servlet-name":"cofaxTools","servlet-class":"org.cofax.cms.CofaxToolsServlet","init-param":{"templatePath":"toolstemplates/","log":1,"logLocation":"/usr/local/tomcat/logs/CofaxTools.log","logMaxSize":"","dataLog":1,"dataLogLocation":"/usr/local/tomcat/logs/dataLog.log","dataLogMaxSize":"","removePageCache":"/content/admin/remove?cache=pages&id=","removeTemplateCache":"/content/admin/remove?cache=templates&id=","fileTransferFolder":"/usr/local/tomcat/webapps/content/fileTransferFolder","lookInContext":1,"adminGroupID":4,"betaServer":true}}],"servlet-mapping":{"cofaxCDS":"/","cofaxEmail":"/cofaxutil/aemail/*","cofaxAdmin":"/admin/*","fileServlet":"/static/*","cofaxTools":"/tools/*"},"taglib":{"taglib-uri":"cofax.tld","taglib-location":"/WEB-INF/tlds/cofax.tld"}}}`}
    />
  </>
)
