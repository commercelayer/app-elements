import { fireEvent, render, waitFor } from '@testing-library/react'

import { RuleEngine } from './RuleEngineComponent'

describe('RuleEngine', () => {
  it('renders empty without any error', async () => {
    const { container } = render(<RuleEngine />)
    expect(container).toMatchSnapshot()
  })

  it('renders rule name correctly', () => {
    const { container } = render(
      <RuleEngine
        defaultValue={JSON.stringify({
          rules: [
            {
              name: 'Sample Rule',
              actions: [],
              conditions: []
            }
          ]
        })}
      />
    )
    expect(
      container.querySelector('[contenteditable="plaintext-only"]')
    ).toHaveTextContent('Sample Rule')
  })

  it('updates rule name on input', async () => {
    const onChangeMock = vi.fn()
    const { container } = render(
      <RuleEngine
        onChange={onChangeMock}
        defaultValue={JSON.stringify({
          rules: [
            {
              name: 'Initial Rule',
              actions: [],
              conditions: []
            }
          ]
        })}
      />
    )

    const ruleNameElement = container.querySelector(
      '[contenteditable="plaintext-only"]'
    )
    expect(ruleNameElement).toBeVisible()
    expect(ruleNameElement).toHaveTextContent('Initial Rule')

    if (ruleNameElement === null) {
      throw new Error('Rule name element not found')
    }

    fireEvent.input(ruleNameElement, { target: { innerText: 'Updated Rule' } })
    expect(onChangeMock).toHaveBeenLastCalledWith(
      expect.objectContaining({
        rules: [
          {
            name: 'Updated Rule',
            actions: [],
            conditions: []
          }
        ]
      })
    )
  })

  describe('Action component', () => {
    it('renders percentage action with correct value', () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [
                  {
                    type: 'percentage',
                    value: 0.23,
                    selector: 'order'
                  }
                ],
                conditions: []
              }
            ]
          })}
        />
      )
      expect(
        container.querySelector('input[name="rules.0.actions.0.type"]')
      ).toHaveValue('percentage')
      expect(
        container.querySelector('input[name="rules.0.actions.0.value"]')
      ).toHaveValue(23)
      expect(
        container.querySelector('input[name="rules.0.actions.0.selector"]')
      ).toHaveValue('order')
    })

    it('renders fixed_amount action with correct value', () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [
                  {
                    type: 'fixed_amount',
                    value: 5500,
                    selector: 'order'
                  }
                ],
                conditions: []
              }
            ]
          })}
        />
      )
      expect(
        container.querySelector('input[name="rules.0.actions.0.type"]')
      ).toHaveValue('fixed_amount')
      expect(
        container.querySelector('input[name="rules.0.actions.0.value"]')
      ).toHaveValue(5500)
      expect(
        container.querySelector('input[name="rules.0.actions.0.selector"]')
      ).toHaveValue('order')
    })

    it('renders fixed_price action with correct value', () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [
                  {
                    type: 'fixed_price',
                    value: 2500,
                    selector: 'order'
                  }
                ],
                conditions: []
              }
            ]
          })}
        />
      )
      expect(
        container.querySelector('input[name="rules.0.actions.0.type"]')
      ).toHaveValue('fixed_price')
      expect(
        container.querySelector('input[name="rules.0.actions.0.value"]')
      ).toHaveValue(2500)
      expect(
        container.querySelector('input[name="rules.0.actions.0.selector"]')
      ).toHaveValue('order')
    })

    it('renders buy_x_pay_y action with correct values', () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [
                  {
                    type: 'buy_x_pay_y',
                    value: {
                      x: 3,
                      y: 2
                    },
                    selector: 'order'
                  }
                ],
                conditions: []
              }
            ]
          })}
        />
      )
      expect(
        container.querySelector('input[name="rules.0.actions.0.type"]')
      ).toHaveValue('buy_x_pay_y')
      expect(
        container.querySelector('input[name="rules.0.actions.0.value.x"]')
      ).toHaveValue(3)
      expect(
        container.querySelector('input[name="rules.0.actions.0.value.y"]')
      ).toHaveValue(2)
      expect(
        container.querySelector('input[name="rules.0.actions.0.selector"]')
      ).toHaveValue('order')
    })

    it('renders every_x_discount_y action with correct values', () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [
                  {
                    type: 'every_x_discount_y',
                    value: {
                      x: 5,
                      y: 3
                    },
                    selector: 'order'
                  }
                ],
                conditions: []
              }
            ]
          })}
        />
      )
      expect(
        container.querySelector('input[name="rules.0.actions.0.type"]')
      ).toHaveValue('every_x_discount_y')
      expect(
        container.querySelector('input[name="rules.0.actions.0.value.x"]')
      ).toHaveValue(5)
      expect(
        container.querySelector('input[name="rules.0.actions.0.value.y"]')
      ).toHaveValue(3)
      expect(
        container.querySelector('input[name="rules.0.actions.0.selector"]')
      ).toHaveValue('order')
    })

    it('renders more than one action correctly', () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [
                  {
                    type: 'percentage',
                    value: 0.1,
                    selector: 'order'
                  },
                  {
                    type: 'fixed_amount',
                    value: 500,
                    selector: 'order'
                  }
                ],
                conditions: []
              }
            ]
          })}
        />
      )

      expect(
        container.querySelectorAll('input[name="rules.0.actions.0.type"]')[0]
      ).toHaveValue('percentage')
      expect(
        container.querySelectorAll('input[name="rules.0.actions.0.value"]')[0]
      ).toHaveValue(10)
      expect(
        container.querySelectorAll(
          'input[name="rules.0.actions.0.selector"]'
        )[0]
      ).toHaveValue('order')
      expect(
        container.querySelectorAll('input[name="rules.0.actions.1.type"]')[0]
      ).toHaveValue('fixed_amount')
      expect(
        container.querySelectorAll('input[name="rules.0.actions.1.value"]')[0]
      ).toHaveValue(500)
      expect(
        container.querySelectorAll(
          'input[name="rules.0.actions.1.selector"]'
        )[0]
      ).toHaveValue('order')
    })
  })

  describe('Condition component', () => {
    it('renders condition with a string value', async () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [],
                conditions: [
                  {
                    field: 'order.currency_code',
                    matcher: 'eq',
                    value: 'USD'
                  }
                ]
              }
            ]
          })}
        />
      )

      await waitFor(() => {
        expect(
          container.querySelector('input[name="rules.0.conditions.0.field"]')
        ).toHaveValue('order.currency_code')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.matcher"]')
        ).toHaveValue('eq')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.value"]')
        ).toHaveValue('USD')
      })
    })

    it('renders condition with a number value', async () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [],
                conditions: [
                  {
                    field: 'order.skus_count',
                    matcher: 'eq',
                    value: '12'
                  }
                ]
              }
            ]
          })}
        />
      )

      await waitFor(() => {
        expect(
          container.querySelector('input[name="rules.0.conditions.0.field"]')
        ).toHaveValue('order.skus_count')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.matcher"]')
        ).toHaveValue('eq')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.value"]')
        ).toHaveAttribute('type', 'number')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.value"]')
        ).toHaveValue(12)
      })
    })

    it('renders condition with a boolean value', async () => {
      const { container } = render(
        <RuleEngine
          defaultValue={JSON.stringify({
            rules: [
              {
                name: 'Test Rule',
                actions: [],
                conditions: [
                  {
                    field: 'order.tax_included',
                    matcher: 'eq',
                    value: true
                  }
                ]
              }
            ]
          })}
        />
      )

      await waitFor(() => {
        expect(
          container.querySelector('input[name="rules.0.conditions.0.field"]')
        ).toHaveValue('order.tax_included')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.matcher"]')
        ).toHaveValue('eq')
        expect(
          container.querySelector('input[name="rules.0.conditions.0.value"]')
        ).toHaveValue('true')
      })
    })
  })
})
