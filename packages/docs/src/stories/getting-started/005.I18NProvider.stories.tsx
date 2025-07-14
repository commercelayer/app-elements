import { useTranslation } from '#providers/I18NProvider'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import {
  InputSelect,
  isSingleValueSelected,
  type InputSelectValue
} from '#ui/forms/InputSelect'
import { type PossibleSelectValue } from '#ui/forms/InputSelect/InputSelect'
import { type Meta, type StoryFn } from '@storybook/react-vite'
import { useState, type JSX } from 'react'

const meta: Meta = {
  title: 'Getting Started/I18N Provider',
  parameters: {
    layout: 'padded',
    docs: {
      source: {
        type: 'code'
      }
    }
  }
}

export default meta

/**
 * Here below a simple example that shows how to use the translations provided by the `I18NProvider`:
 */
export const Translations: StoryFn = (): JSX.Element => {
  const languages = [
    { value: 'en-US', label: 'English' },
    { value: 'it-IT', label: 'Italiano' }
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
          Translation of string <strong>common.all_items</strong>:{' '}
          {t('common.all_items')}
        </Text>
      </Spacer>
      <Spacer top='4'>
        <Text>
          Translation of string <strong>common.search</strong>:{' '}
          {t('common.search')}
        </Text>
      </Spacer>
    </PageLayout>
  )
}
