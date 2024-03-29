import { type Address } from '@commercelayer/sdk'

export const presetAddresses = {
  withName: {
    type: 'addresses',
    id: '',
    company: '',
    first_name: 'Darth',
    last_name: 'Vader',
    full_name: 'Darth Vader',
    line_1: 'Via Morte Nera, 13',
    line_2: 'Ragnatela, 99',
    city: 'Cogorno',
    country_code: 'IT',
    state_code: 'GE',
    zip_code: '16030',
    phone: '+39 055 1234567890',
    billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ',
    created_at: '',
    updated_at: ''
  },
  withCompany: {
    type: 'addresses',
    id: '',
    company: 'Galactic Empire',
    first_name: '',
    last_name: '',
    full_name: 'Galactic Empire',
    line_1: 'Via Morte Nera, 13',
    line_2: 'Ragnatela, 99',
    city: 'Cogorno',
    country_code: 'IT',
    state_code: 'GE',
    zip_code: '16030',
    phone: '+39 055 1234567890',
    billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ',
    created_at: '',
    updated_at: ''
  },
  withNotes: {
    type: 'addresses',
    id: '',
    company: '',
    first_name: 'Darth',
    last_name: 'Vader',
    full_name: 'Darth Vader',
    line_1: 'Via Morte Nera, 13',
    line_2: 'Ragnatela, 99',
    city: 'Cogorno',
    country_code: 'IT',
    state_code: 'GE',
    zip_code: '16030',
    phone: '+39 055 1234567890',
    billing_info: 'ABCDEFGHIJKLMNOPQRSTUVWYXZ',
    created_at: '',
    updated_at: '',
    notes: 'Kindly leave the package to my neighbor, Adam Sandler.'
  }
} satisfies Record<string, Address>
