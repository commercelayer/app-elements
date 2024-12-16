import type { en } from './en'

const it: typeof en = {
  common: {
    all: 'Tutti {{resource}}',
    all_female: 'Tutte {{resource}}',
    not_handled: 'Non gestito',
    back: 'Torna indietro',
    new: 'Nuovo',
    new_resource: 'Nuovo {{resource}}',
    new_resource_female: 'Nuova {{resource}}',
    not_authorized: 'Non autorizzato',
    no_items: 'Nessun elemento',
    edit: 'Modifica',
    manage: 'Gestisci {{resource}}',
    updated: 'Aggiornato',
    timeline: 'Storico',
    filters: 'Filtri',
    metadata: 'Metadati',
    search: 'Cerca...',
    limit_reached: 'Limite raggiunto',
    add_up_to: 'Puoi aggiungere fino a {{limit}} {{resource}}.',
    update: 'Aggiorna',
    resources: {
      common: {
        status: {
          not_handled: 'Non gestito'
        }
      },
      adjustments: {
        name: 'Rettifica',
        name_other: 'Rettifiche',
        task: {
          adjust_total: 'Rettifica totale'
        }
      },
      bundles: {
        name: 'Bundle',
        name_other: 'Bundles',
        status: {}
      },
      customers: {
        name: 'Cliente',
        name_other: 'Clienti',
        status: {
          prospect: 'Potenziale',
          acquired: 'Acquisito',
          repeat: 'Abituale'
        }
      },
      orders: {
        name: 'Ordine',
        name_other: 'Ordini',
        status: {
          name: 'Stato',
          approved: 'Approvato',
          cancelled: 'Cancellato',
          draft: 'Bozza',
          editing: 'In modifica',
          pending: 'In attesa',
          placed: 'Piazzato',
          placing: 'In piazzamento',
          in_progress: 'In corso',
          in_progress_manual: 'In corso (Manuale)'
        },
        payment_status: {
          name: 'Stato pagamento',
          name_short: 'Pagamento',
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
          name: 'Stato evasione',
          name_short: 'Evasione',
          unfulfilled: 'Non evaso',
          in_progress: 'In corso',
          fulfilled: 'Evaso',
          not_required: 'Non richiesto'
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
          billing_address: 'Indirizzo di fatturazione',
          shipping_address: 'Indirizzo di spedizione'
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
          select_address: 'Seleziona indirizzo'
        }
      },
      gift_cards: {
        name: 'Carta regalo',
        name_other: 'Carte regalo'
      },
      promotions: {
        name: 'Promozione',
        name_other: 'Promozioni',
        status: {
          active: 'Attiva',
          disabled: 'Disabilitata',
          expired: 'Scaduta',
          inactive: 'Inattiva',
          pending: 'In attesa',
          upcoming: 'Imminente'
        }
      },
      returns: {
        name: 'Reso',
        name_other: 'Resi',
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
      },
      shipments: {
        name: 'Spedizione',
        name_other: 'Spedizioni',
        status: {
          awaiting_stock_transfer: 'In attesa di trasferimento di magazzino',
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
      },
      stock_transfers: {
        name: 'Trasferimento di magazzino',
        name_other: 'Trasferimenti di magazzino',
        status: {
          cancelled: 'Cancellato',
          completed: 'Completato',
          draft: 'Bozza',
          in_transit: 'In transito',
          on_hold: 'In attesa',
          picking: 'In prelievo',
          upcoming: 'Imminente'
        }
      },
      tags: {
        name: 'Tag',
        name_other: 'Tag',
        status: {}
      }
    },
    validation: {
      select_one_item: 'Seleziona almeno un elemento'
    }
  }
}

export default it
