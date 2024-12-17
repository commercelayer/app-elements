import type en from './en'

const it: typeof en = {
  common: {
    all_items: 'Tutti gli elementi',
    not_handled: 'Non gestito',
    back: 'Torna indietro',
    close: 'Chiudi',
    new: 'Nuovo',
    not_authorized: 'Non autorizzato',
    no_items: 'Nessun elemento',
    edit: 'Modifica',
    manage_resource: 'Gestisci {{resource}}',
    updated: 'Aggiornato',
    timeline: 'Storico',
    filters: 'Filtri',
    metadata: 'Metadati',
    search: 'Cerca...',
    limit_reached: 'Limite raggiunto',
    add_up_to: 'Puoi aggiungere fino a {{limit}} {{resource}}.',
    update: 'Aggiorna',
    cancel: 'Annulla',
    apply: 'Applica',
    not_found: 'Non trovato',
    generic_resource_not_found: 'La risorsa che cercavi non è esiste.',
    create_resource: 'Crea {{resource}}',
    generic_select_autocomplete_hint: 'Digita per cercare più opzioni.'
  },
  resources: {
    adjustments: {
      name: 'Rettifica',
      name_other: 'Rettifiche',
      attributes: {}
    },
    bundles: {
      name: 'Bundle',
      name_other: 'Bundles',
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
    select_one_item: 'Seleziona almeno un elemento'
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
        adjust_total: 'Aggiusta totale',
        use_for_shipping: 'Usa per la spedizione',
        use_for_billing: 'Usa per la fatturazione'
      },
      form: {
        language: 'Lingua',
        language_hint: 'La lingua usata per il checkout',
        error_create_order:
          "Non è possibile creare l'ordine senza un prodotto valido. Selezionane uno.",
        email: 'Indirizzo Email',
        email_placeholder: 'Cerca o aggiungi un indirizzo email',
        email_hint: "L'indirizzo email del cliente per questo ordine."
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
        select_address: 'Seleziona indirizzo',
        edit_customer: 'Modifica cliente'
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
