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

  const { GITHUB_TOKEN, ABILITIES_YAML } = process.env

  if (ABILITIES_YAML == null) {
    throw new Error('ABILITIES_YAML is not defined.')
  }

  const plainText = await fetch(ABILITIES_YAML, {
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
  const doc = yaml.load(plainText, { json: true })

  const repositories = await getRepositoryNames()

  const entries = Object.entries(sortObj(doc)).filter(([appSlug]) =>
    Object.keys(repositories).includes(appSlug)
  )

  entries.push([
    'generic',
    {
      admin: [],
      read_only: []
    }
  ])

  console.group('Available applications:')
  console.log(entries.map(([appSlug]) => `- ${appSlug}`).join('\n'))
  console.groupEnd()

  const content = `
import { Meta } from '@storybook/blocks';
import { Tabs, Tab } from '#ui/atoms/Tabs';

<Meta title="Getting Started/Applications"></Meta>

# Applications

This is the updated list of all the currently available Commerce Layer Dashboard open-source applications:

${await generateToc(repositories, entries)}

Each application is equipped with a different set of permissions in terms of CRUD actions on the single resources. You can check them here below.

${await generateAppTable(repositories, entries)}
`

  writeFileSync(
    path.resolve(
      __dirname,
      'stories',
      'getting-started',
      '001a.applications.mdx'
    ),
    content
  )
}

/**
 * Convert an application slug like `stock_transfers` to the application name (e.g. `stock transfers`, or `SKUs`)
 * @param {string} appSlug Application slug
 * @returns {string}
 */
function toAppName(appSlug) {
  return appSlug.toLowerCase().replaceAll('_', ' ').replaceAll('sku', 'SKU')
}

/**
 * Get all repositories tagged as `dashboard-apps`
 * @returns {Promise<{ [appSlug: string]: Repository }>}
 */
async function getRepositoryNames() {
  const queryUrl = `https://api.github.com/repos/commercelayer/dashboard-apps/contents/apps/`

  const result = await fetch(queryUrl, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
    .then(async (res) => await res.json())
    .then(async (/** @type GitHubRepositoryContent[] */ json) =>
      Object.fromEntries(
        json.map((appFolders) => {
          const appSlug = appFolders.name
          /** @type {`app-${string}`} */
          const packageName = `app-${appSlug}`
          return [
            appSlug,
            {
              slug: appSlug,
              name: packageName,
              displayName: capitalizeFirstLetter(toAppName(appSlug)),
              description: `Commerce Layer application for managing ${toAppName(appSlug)}.`,
              repositoryUrl: appFolders.html_url,
              visibility: /** @type {const} */ ('public')
            }
          ]
        })
      )
    )

  return result
}

/**
 * Convert the `abilities.yml` to a TOC
 * @param {Object.<string, Repository>} repositories GitHub repositories
 * @param {(readonly [appSlug: string, App])[]} entries Entries from `abilities.yml`
 * @returns {Promise<string>}
 */
async function generateToc(repositories, entries) {
  return `<ul>${entries
    .map(([appSlug]) => {
      return `<li>${createLink(`#${appSlug.toLowerCase().replaceAll('_', '-')}`, capitalizeFirstLetter(toAppName(appSlug)))}</li>`
    })
    .join('\n')}</ul>`
}

/**
 * Convert the `abilities.yml` to a `<table>`
 * @param {Object.<string, Repository>} repositories GitHub repositories
 * @param {(readonly [appSlug: string, App])[]} entries Entries from `abilities.yml`
 * @returns {Promise<string>}
 */
async function generateAppTable(repositories, entries) {
  return entries
    .map(([appSlug, app]) => {
      if (appSlug === 'generic') {
        return `
        ## Generic

        Generic apps are a special kind of [custom apps](/docs/getting-started-custom-apps--docs) that can have Full access (read and write)
        or Read-only permissions on all the [Commerce Layer Core resources](https://docs.commercelayer.io/core/api-reference/), thus enabling
        you to create the most flexible custom Dashboard applications tailored to your needs
        (e.g. mixing features of multiple original Commerce Layer Dashboard apps in one single app,
        specifying a dedicated slug, icon, etc. — check [this basic example](https://github.com/commercelayer/dashboard-apps/tree/main/apps/my_sample_app) as a starter).
        `
      }

      const repo = repositories[appSlug]

      return `
        ## ${repo?.displayName}

        ${repo?.description}

        <Tabs style={{ marginTop: '24px' }}>
          <Tab name="Can manage">
            <div>
              ${generateRole(app, 'admin')}
            </div>
          </Tab>
          <Tab name="Can view">
            <div>
              ${generateRole(app, 'read_only')}
            </div>
          </Tab>
        </Tabs>
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
    |Resource|\`create\`|\`read\`|\`update\`|\`destroy\`|Restrictions|
    |:---|:---:|:---:|:---:|:---:|:---|
    ${sortByKey(app[kind], 'subject').map(roleToTable).join('\n')}
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
      `https://docs.commercelayer.io/core/v/api-reference/${checkSubject(subject)}/object`,
      checkSubject(subject),
      '_blank'
    ),
    booleanToIcon(can_create),
    booleanToIcon(can_read),
    booleanToIcon(can_update),
    booleanToIcon(can_destroy),
    restrictions != null ? `\`${JSON.stringify(restrictions)}\`` : ''
  ].join('|')}`
}

/**
 * @param {string} subject
 * @returns {string}
 */
function checkSubject(subject) {
  return subject === 'organizations' ? 'organization' : subject
}

// ------------------------------------------------------------

/**
 * @typedef {Object} GitHubRepositoryContent
 * @property {`app-${string}`} name
 * @property {string} html_url
 */

/**
 * @typedef {Object} Repository
 * @property {`app-${string}`} name
 * @property {string} displayName
 * @property {string} description
 * @property {string} repositoryUrl
 * @property {'public' | 'private'} visibility
 */

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
  return `<a style={{ fontWeight: 'normal', display: 'inline-block' }} target="${target}" href="${url}">${text}</a>`
}

/**
 *
 * @template {Object.<string, any>} T
 * @param {T} obj
 * @returns {T}
 */
function sortObj(obj) {
  return Object.keys(obj)
    .sort()
    .reduce((accumulator, key) => {
      // @ts-expect-error I'm not able to type the initialValue
      accumulator[key] = obj[key]

      return accumulator
    }, /** @type {T} */ ({}))
}

/**
 *
 * @template {Array<any>} T
 * @param {T} array
 * @param {string} key
 * @returns {T}
 */
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    const x = a[key]
    const y = b[key]
    return x < y ? -1 : x > y ? 1 : 0
  })
}

/**
 * Capitalize first letter
 * @param {string} str
 * @returns {string}
 */
function capitalizeFirstLetter(str) {
  return str.replace(/^./, str[0]?.toUpperCase() ?? '')
}
