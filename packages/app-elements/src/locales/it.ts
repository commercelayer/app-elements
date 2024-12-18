import type en from './en'

const it: typeof en = {
  common: {
    add_resource: 'Aggiungi {{resource}}',
    add_up_to: 'Puoi aggiungere fino a {{limit}} {{resource}}.',
    all_items: 'Tutti gli elementi',
    amount: 'Importo',
    apply: 'Applica',
    back: 'Torna indietro',
    cancel: 'Annulla',
    close: 'Chiudi',
    clear_text: 'Svuota testo',
    continue: 'Continua',
    create_resource: 'Crea {{resource}}',
    download_file: 'Scarica file',
    download_json: 'Scarica JSON',
    edit: 'Modifica',
    edit_resource: 'Modifica {{resource}}',
    filters: 'Filtri',
    limit_reached: 'Limite raggiunto',
    manage_resource: 'Gestisci {{resource}}',
    metadata: 'Metadati',
    new: 'Nuovo',
    no_items: 'Nessun elemento',
    not_authorized: 'Non autorizzato',
    not_found: 'Non trovato',
    not_handled: 'Non gestito',
    search: 'Cerca...',
    select_resource: 'Seleziona {{resource}}',
    update: 'Aggiorna',
    updated: 'Aggiornato',
    view_logs: 'Visualizza i log',
    generic_resource_not_found: 'La risorsa che cercavi non è esiste.',
    empty_state_resource_title: 'Nessun {{resource}} trovato!',
    empty_state_resource_description:
      'Nessun {{resource}} trovato found per questa organizzazione.',
    empty_state_resource_filtered:
      "Non c'è {{resources}} che corrisponde ai filtri selezionati.",
    generic_select_autocomplete_hint: 'Digita per cercare più opzioni.',
    routes: {
      missing_configuration:
        'Configurazione mancante durante la definizione di {{component}}',
      loading_app_page: 'Caricamento pagina app...',
      page_not_found: 'Pagina non trovata',
      invalid_resource: '{{resource}} non valida',
      we_could_not_find_page:
        'Non abbiamo trovato la pagina che stavi cercando.',
      we_could_not_find_resource:
        'Non abbiamo trovato la risorsa {{resource}} che stavi cercando.',
      go_home: 'Vai alla home'
    },
    table: {
      and_another_record: 'e un altro elemento',
      and_other_records: 'e altri {{count}} elementi',
      record: '1 elemento',
      record_other: '{{count}} elementi'
    },
    timeline: {
      name: 'Storico',
      leave_a_note: 'Lascia una nota o un commento',
      only_staff_can_see:
        'Solo tu e altri membri dello staff possono vedere i commenti'
    }
  },
  resources: {
    addresses: {
      name: 'Indirizzo',
      name_other: 'Indirizzi',
      attributes: {}
    },
    adjustments: {
      name: 'Rettifica',
      name_other: 'Rettifiche',
      attributes: {}
    },
    bundles: {
      name: 'Bundle',
      name_other: 'Bundles',
      attributes: {
        currency_code: 'Codice valuta'
      }
    },
    coupons: {
      name: 'Coupon',
      name_other: 'Coupon',
      attributes: {}
    },
    customers: {
      name: 'Cliente',
      name_other: 'Clienti',
      attributes: {
        status: {
          prospect: 'Potenziale',
          acquired: 'Acquisito',
          repeat: 'Abituale'
        }
      }
    },
    orders: {
      name: 'Ordine',
      name_other: 'Ordini',
      attributes: {
        status: {
          approved: 'Approvato',
          cancelled: 'Cancellato',
          draft: 'Bozza',
          editing: 'In modifica',
          pending: 'In attesa',
          placed: 'Piazzato',
          placing: 'In piazzamento'
        },
        payment_status: {
          authorized: 'Autorizzato',
          paid: 'Pagato',
          unpaid: 'Non pagato',
          free: 'Gratuito',
          voided: 'Annullato',
          refunded: 'Rimborsato',
          partially_authorized: 'Parz. autorizzato',
          partially_paid: 'Parz. pagato',
          partially_refunded: 'Parz. rimborsato',
          partially_voided: 'Parz. annullato'
        },
        fulfillment_status: {
          unfulfilled: 'Non evaso',
          in_progress: 'In corso',
          fulfilled: 'Evaso',
          not_required: 'Non richiesto'
        },
        billing_address: 'Indirizzo di fatturazione',
        shipping_address: 'Indirizzo di spedizione'
      }
    },
    gift_cards: {
      name: 'Carta regalo',
      name_other: 'Carte regalo',
      attributes: {}
    },
    markets: {
      name: 'Mercato',
      name_other: 'Mercati',
      attributes: {}
    },
    promotions: {
      name: 'Promozione',
      name_other: 'Promozioni',
      attributes: {
        status: {
          active: 'Attiva',
          disabled: 'Disabilitata',
          expired: 'Scaduta',
          inactive: 'Inattiva',
          pending: 'In attesa'
        }
      }
    },
    returns: {
      name: 'Reso',
      name_other: 'Resi',
      attributes: {
        status: {
          approved: 'Approvato',
          cancelled: 'Cancellato',
          draft: 'Bozza',
          requested: 'Richiesto',
          received: 'Ricevuto',
          refunded: 'Rimborsato',
          rejected: 'Rifiutato',
          shipped: 'Spedito'
        }
      }
    },
    shipments: {
      name: 'Spedizione',
      name_other: 'Spedizioni',
      attributes: {
        status: {
          cancelled: 'Cancellato',
          delivered: 'Consegnato',
          draft: 'Bozza',
          on_hold: 'In attesa',
          packing: 'In imballaggio',
          picking: 'In prelievo',
          ready_to_ship: 'Pronto per la spedizione',
          shipped: 'Spedito',
          upcoming: 'Imminente'
        }
      }
    },
    shipping_methods: {
      name: 'Metodo di spedizione',
      name_other: 'Metodi di spedizione',
      attributes: {}
    },
    skus: {
      name: 'SKU',
      name_other: 'SKU',
      attributes: {}
    },
    stock_transfers: {
      name: 'Trasferimento di magazzino',
      name_other: 'Trasferimenti di magazzino',
      attributes: {
        status: {
          cancelled: 'Cancellato',
          completed: 'Completato',
          draft: 'Bozza',
          in_transit: 'In transito',
          on_hold: 'In attesa',
          picking: 'In prelievo',
          upcoming: 'Imminente'
        }
      }
    },
    tags: {
      name: 'Tag',
      name_other: 'Tag',
      attributes: {}
    }
  },
  validation: {
    select_one_item: 'Seleziona almeno un elemento',
    coupon_code_invalid: 'Inserisci un codice valido',
    coupon_code_too_short: 'Il codice è troppo corto (minimo 8 caratteri)',
    amount_invalid: 'Inserisci un importo valido'
  },
  apps: {
    orders: {
      attributes: {
        status: 'Stato',
        payment_status: 'Stato pagamento',
        fulfillment_status: 'Stato evasione'
      },
      display_status: {
        in_progress: 'In corso',
        in_progress_manual: 'In corso (Manuale)'
      },
      task: {
        open: 'Aperti',
        browse: 'Sfoglia',
        awaiting_approval: 'In attesa di approvazione',
        error_to_cancel: 'Errore nella cancellazione',
        payment_to_capture: 'Pagamento da catturare',
        fulfillment_in_progress: 'Evasione in corso',
        editing: 'In modifica',
        history: 'Tutti gli ordini',
        cart: 'Carrello',
        carts: 'Carrelli',
        archived: 'Archiviati'
      },
      details: {
        summary: 'Riepilogo',
        to_be_calculated: 'Da calcolare',
        shipping: 'Spedizione',
        subtotal: 'Totale parziale',
        total: 'Totale',
        payment_method: 'Metodo di pagamento',
        taxes: 'Tasse',
        included: 'incluse',
        discount: 'Sconto',
        fulfillment: 'Evasione',
        payment: 'Pagamento',
        use_for_shipping: 'Usa per la spedizione',
        use_for_billing: 'Usa per la fatturazione',
        new_total_line1:
          'Il nuovo totale è {{new_total}}, {{difference}} in più rispetto al totale originale.',
        new_total_line2: 'Rettifica il totale per renderlo uguale o inferiore.'
      },
      form: {
        language: 'Lingua',
        language_hint: 'La lingua usata per il checkout',
        error_create_order:
          "Non è possibile creare l'ordine senza un prodotto valido. Selezionane uno.",
        email: 'Indirizzo Email',
        email_placeholder: 'Cerca o aggiungi un indirizzo email',
        email_hint: "L'indirizzo email del cliente per questo ordine.",
        coupon_code: 'Codice coupon',
        select_adjustment_amount:
          "Seleziona un tipo di importo positivo per aumentare il totale dell'ordine."
      },
      actions: {
        add_item: 'Aggiungi prodotto',
        approve: 'Approva',
        archive: 'Archivia',
        cancel_transactions: 'Annulla pagamento',
        cancel: 'Annulla ordine',
        capture: 'Cattura pagamento',
        place: 'Piazza ordine',
        refund: 'Rimborsa',
        unarchive: 'Ripristina',
        continue_editing: 'Continua modifiche',
        finish_editing: 'Finalizza',
        adjust_total: 'Rettifica totale'
      }
    },
    shipments: {
      details: {
        awaiting_stock_transfer: 'In attesa di trasferimento di magazzino'
      }
    },
    promotions: {
      display_status: {
        upcoming: 'Imminente'
      }
    }
  }
}

export default it
