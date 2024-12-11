import { I18NProvider } from '#providers/I18NProvider'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import {
  InputSelect,
  isSingleValueSelected,
  type InputSelectValue
} from '#ui/forms/InputSelect'
import { type PossibleSelectValue } from '#ui/forms/InputSelect/InputSelect'
import { Description, Primary, Subtitle, Title } from '@storybook/blocks'
import { type Meta, type StoryFn } from '@storybook/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const setup: Meta = {
  title: 'Examples/I18N',
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: () => (
        <>
          <I18NProvider
            localeCode='en'
            localeUrl='http://localhost:3000/{{lng}}.json'
          >
            <Title />
            <Subtitle />
            <Description />
            <Primary />
          </I18NProvider>
        </>
      )
    }
  }
}

export const Default: StoryFn = (): JSX.Element => {
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'it', label: 'Italiano' }
  ]

  const { t, i18n } = useTranslation()
  const [activeLang, setActiveLang] = useState<
    InputSelectValue | PossibleSelectValue
  >(
    languages.find(
      (lang) => lang.value === i18n.language
    ) as PossibleSelectValue
  )

  return (
    <PageLayout title='Translations'>
      <InputSelect
        label='Languages'
        initialValues={languages}
        value={activeLang as InputSelectValue}
        onSelect={(value) => {
          if (isSingleValueSelected(value)) {
            setActiveLang(value)
            void i18n.changeLanguage(value.value as string)
          }
        }}
      />
      <Spacer top='4'>
        <Text>
          Translation of string <strong>common.all</strong>: {t('common.all')}
        </Text>
      </Spacer>
      <Spacer top='4'>
        <Text>
          Translation of string <strong>common.all_female</strong>:{' '}
          {t('common.all_female')}
        </Text>
      </Spacer>
    </PageLayout>
  )
}

export default setup
