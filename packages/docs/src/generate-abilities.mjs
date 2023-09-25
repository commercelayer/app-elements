// @ts-check

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */

await generatePageFromAbilities()

async function generatePageFromAbilities() {
  const { writeFileSync } = await import('fs')
  const yaml = await import('js-yaml')
  const path = await import('path')
  const urlModule = await import('url')

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const __dirname = urlModule.fileURLToPath(new URL('.', import.meta.url))

  const { GITHUB_TOKEN } = process.env
  const url = `https://raw.githubusercontent.com/commercelayer/core-api/master/config/abilities.yml`

  const plainText = await fetch(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }).then(async (res) => await res.text())

  if (GITHUB_TOKEN == null || plainText === '404: Not Found') {
    throw new Error('Token is not valid.')
  }

  /** @type Doc */
  // @ts-expect-error doc is `unknown`
  const doc = yaml.load(plainText)

  /** @type [string, App][] */
  const entries = Object.entries(
    Object.keys(doc)
      .sort()
      .reduce((accumulator, key) => {
        // @ts-expect-error I'm not able to type the initialValue
        accumulator[key] = doc[key]

        return accumulator
      }, {})
  )

  const content = `
import { Meta } from '@storybook/addon-docs';

<Meta title="Getting Started/Application roles"></Meta>

# Application roles

Each application is equipped with a specific set of permissions based on the application the developer would like to customize.

${generateToc(entries)}
${generateAppTable(entries)}
`

  writeFileSync(
    path.resolve(
      __dirname,
      'stories',
      'getting-started',
      '002a.application-roles.mdx'
    ),
    content
  )
}

/**
 * Convert the `abilities.yml` to a TOC
 * @param {[string, App][]} entries Entries from `abilities.yml`
 * @returns {string}
 */
function generateToc(entries) {
  return `<ul>${entries
    .map(([appName]) => {
      return `<li>${createLink(`#${appName}`, appName)}</li>`
    })
    .join('\n')}</ul>`
}

/**
 * Convert the `abilities.yml` to a `<table>`
 * @param {[string, App][]} entries Entries from `abilities.yml`
 * @returns {string}
 */
function generateAppTable(entries) {
  return entries
    .map(([appName, app]) => {
      return `
        ## ${appName}

        ${generateRole(app, 'admin')}
        ${generateRole(app, 'read_only')}
      `
    })
    .join('\n')
}

/**
 *
 * @param {App} app
 * @param {'admin' | 'read_only'} kind
 * @returns {string}
 */
function generateRole(app, kind) {
  return `
    <h3 style={{ marginTop: '16px' }}>${kind}</h3>
    |subject|create|read|update|destroy|restriction|
    |:---|:---:|:---:|:---:|:---:|:---|
    ${app[kind].map(roleToTable).join('\n')}
  `
}

/**
 * @param {Role} role
 * @returns {string}
 */
function roleToTable({
  can_create = false,
  can_destroy = false,
  can_read = false,
  can_update = false,
  restrictions,
  subject
}) {
  return `|${[
    createLink(
      `https://docs.commercelayer.io/core/v/api-reference/${subject}/object`,
      subject,
      '_blank'
    ),
    booleanToIcon(can_create),
    booleanToIcon(can_read),
    booleanToIcon(can_update),
    booleanToIcon(can_destroy),
    restrictions != null ? `\`${JSON.stringify(restrictions)}\`` : ''
  ].join('|')}`
}

// ------------------------------------------------------------

/**
 * @typedef {Object} Role
 * @property {string} subject
 * @property {boolean} [can_create]
 * @property {boolean} [can_read]
 * @property {boolean} [can_update]
 * @property {boolean} [can_destroy]
 * @property {object} [restrictions]
 */

/**
 * @typedef {Object} AdminRole
 * @property {string} subject
 * @property {boolean} can_create
 * @property {boolean} can_read
 * @property {boolean} can_update
 * @property {boolean} can_destroy
 * @property {object} [restrictions]
 */

/**
 * @typedef {Object} ReadOnlyRole
 * @property {string} subject
 * @property {boolean} can_read
 */

/**
 * @typedef {Object} App
 * @property {AdminRole[]} admin
 * @property {ReadOnlyRole[]} read_only
 */

/**
 * @typedef {Object.<string, App>} Doc
 */

// ------------------------------------------------------------

/**
 * Convert a boolean value to an icon.
 * @param {boolean} canI
 * @returns {string}
 */
function booleanToIcon(canI) {
  return canI
    ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#1FDA8A" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"></path></svg>'
    : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#FF656B" viewBox="0 0 256 256"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>'
}

/**
 * Create an <a> HTML Element.
 * @param {string} url
 * @param {string} text
 * @param {'_self' | '_blank'} target
 * @returns {string}
 */
function createLink(url, text, target = '_self') {
  return `<a style={{ fontWeight: 'normal' }} target="${target}" href="${url}">${text}</a>`
}
