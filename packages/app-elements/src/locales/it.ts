import type en from './en'

const it: typeof en = {
  common: {
    add_another: 'Aggiungi un altro',
    add_resource: 'Aggiungi {{resource}}',
    new_resource: 'Crea {{resource}}',
    missing_resource: '{{resource}} mancante',
    add_up_to: 'Puoi aggiungere fino a {{limit}} {{resource}}.',
    all: 'Tutti',
    all_items: 'Tutti gli elementi',
    amount: 'Importo',
    apply: 'Applica',
    apply_filters: 'Applica filtri',
    attachments: 'Allegati',
    back: 'Indietro',
    go_back: 'Torna indietro',
    cancel: 'Annulla',
    close: 'Chiudi',
    clear_text: 'Svuota testo',
    continue: 'Continua',
    could_not_retrieve_data: 'Impossibile recuperare i dati',
    could_not_retrieve_resource: 'Impossibile recuperare {{resource}}',
    create: 'Crea',
    create_resource: 'Crea {{resource}}',
    created: 'Creato',
    currency: 'Valuta',
    custom_time_range: 'Intervallo di tempo personalizzato',
    update_resource: 'Aggiorna {{resource}}',
    delete_resource: 'Elimina {{resource}}',
    delete: 'Elimina',
    download_file: 'Scarica file',
    download_json: 'Scarica JSON',
    edit: 'Modifica',
    edit_details: 'Modifica dettagli',
    edit_resource: 'Modifica {{resource}}',
    estimated_delivery: 'Consegna stimata',
    filters: 'Filtri',
    from: 'Dal',
    to: 'Al',
    info: 'Info',
    limit_reached: 'Limite raggiunto',
    loading: 'Caricamento...',
    manage_resource: 'Gestisci {{resource}}',
    metadata: 'Metadati',
    new: 'Nuovo',
    no_address: 'Nessun indirizzo',
    no_items: 'Nessun elemento',
    no_metadata: 'Nessun metadato',
    no_results_found: 'Nessun risultato trovato',
    no_textsearch_filter_set: 'Nessun filtro di ricerca testuale impostato',
    not_authorized: 'Non autorizzato',
    not_authorized_description:
      'Non sei autorizzato ad accedere a questa pagina.',
    not_handled: 'Non gestito',
    parcel_total: 'Totale',
    parcel_weight: 'Peso',
    print_shipping_label: 'Stampa etichetta di spedizione',
    reference: 'Referenza',
    reference_origin: 'Origine referenza',
    remove: 'Rimuovi',
    restocked: 'Riassortito',
    retry: 'Riprova',
    saving: 'Salvataggio...',
    search: 'Cerca...',
    see_all: 'Vedi tutti',
    select: 'Seleziona...',
    select_resource: 'Seleziona {{resource}}',
    show_less: 'Mostra meno',
    show_more: 'Mostra di più',
    status: 'Stato',
    swap: 'Scambia',
    time_range: 'Periodo',
    tracking: 'Tracciamento',
    try_to_refresh_page: 'Prova a ricaricare la pagina o richiedi supporto.',
    unit_price: 'Prezzo unitario',
    update: 'Aggiorna',
    updated: 'Aggiornato',
    view_logs: 'Visualizza i log',
    view_api_docs: 'Visualizza la documentazione API',
    empty_states: {
      not_found: 'Non trovato',
      generic_not_found: 'La risorsa che cercavi non è esiste.',
      all_good_here: 'Niente da fare qui!',
      no_resource_found: 'Nessuna risorsa {{resource}} trovata!',
      no_resource_yet:
        'Non esiste ancora nessuna risorsa di tipo {{resource}}!',
      create_the_first_resource:
        'Aggiungi una nuova risorsa di tipo {{resource}} tramite API, oppure usa la CLI.',
      no_resources_found_for_list:
        'Non ci sono {{resources}} per questa lista.',
      no_resource_found_for_organization:
        'Nessuna risorsa {{resource}} trovata per questa organizzazione.',
      no_resources_found_for_filters:
        'Non ci sono {{resources}} che corrispondono ai filtri selezionati.'
    },
    forms: {
      currency_code_not_valid:
        '{{currencyCode}} non è un codice valuta valido.',
      cents_not_integer: '`centesimi` ({{cents}}) non è un valore intero',
      type_to_search_for_more:
        'Mostrati 25 risultati. Digita per cercare più opzioni.',
      all_markets_with_currency: 'Tutti i markets provvisti di valuta',
      minimum: 'Minimo',
      maximum: 'Massimo',
      drag_here_or: 'trascina qui o',
      browse_files: 'seleziona file',
      required_field: 'Campo richiesto'
    },
    generic_select_autocomplete_hint: 'Digita per cercare più opzioni.',
    routes: {
      page_not_found: 'Pagina non trovata',
      invalid_resource: 'Risorsa {{resource}} non valida',
      invalid_resource_or_not_authorized:
        '{{resource}} assente oppure non sei autorizzato ad accedere a questa risorsa.',
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
      name: 'Attività',
      leave_a_note: 'Lascia una nota o un commento',
      only_staff_can_see:
        'Solo tu e altri membri dello staff possono vedere i commenti',
      resource_created: '{{resource}} creato',
      resource_updated: '{{resource}} aggiornato',
      order_placed: 'Ordine #{{number}} piazzato su {{orderMarket}}',
      left_a_note: 'ha lasciato una nota',
      left_a_refund_note: 'ha lasciato una nota di rimborso',
      resources: {
        order_is: "L'ordine è",
        order_was: "L'ordine è stato",
        order_created: 'creato',
        order_placed: 'piazzato',
        order_cancelled: 'annullato',
        order_archived: 'archiviato',
        order_approved: 'approvato',
        order_fulfilled: 'evaso',
        order_unfulfilled: 'non evaso',
        order_fulfillment_is: "L'evasione dell'ordine è",
        order_fulfillment_in_progress: 'in corso',
        order_fulfillment_not_required: 'non richiesto',
        return_number_was: 'Reso #{{number}} è stato',
        return_approved: 'approvato',
        return_cancelled: 'annullato',
        return_received: 'ricevuto',
        return_rejected: 'rifiutato',
        return_shipped: 'spedito',
        payment_of_was: 'Il pagamento di {{amount}} è stato',
        stock_transfer_completed: 'completato',
        shipment_number_is: 'La spedizione #{{number}} è',
        shipment_number_isbeing: 'La spedizione #{{number}} sta per essere',
        shipment_number_was: 'La spedizione #{{number}} è',
        shipment_on_hold: 'in attesa',
        shipment_picked: 'presa',
        shipment_packed: 'imballata',
        shipment_ready_to_ship: 'pronta per la spedizione',
        shipment_shipped: 'spedita',
        transaction_of: '{{transaction}} di {{amount}}',
        transaction_failed: 'fallito'
      }
    },
    links: {
      checkout_link_status: 'Il link al checkout è {{status}}!',
      open_checkout: 'Apri il checkout',
      share_email_subject: 'Completa il tuo ordine (#{{number}})',
      share_email_body:
        'Gentile cliente,\nClicca su questo link per completare il tuo ordine #{{number}}: {{url}}\n\nGrazie,\nIl team di {{organization}}',
      share_whatsapp_text:
        'Apri questo link per completare il tuo ordine *#{{number}}*: {{url}}'
    },
    tracking_details: {
      contents_type: 'Tipo di contenuto',
      courier: 'Corriere',
      customs_signer: 'Firmatario doganale',
      customs_certify: 'Certificato doganale',
      estimated_delivery_date: 'Data di consegna stimata',
      delivery_confirmation: 'Conferma di consegna',
      last_update: 'Ultimo aggiornamento',
      non_delivery_option: 'Opzione di non consegna',
      restriction_type: 'Tipo di restrizione',
      tracking_pre_transit: 'Pre-Transito',
      tracking_in_transit: 'In transito',
      tracking_out_for_delivery: 'In consegna',
      tracking_delivered: 'Consegnato'
    },
    no_resources: {
      no_tags: 'Nessun tag'
    }
  },
  resources: {
    addresses: {
      name: 'Indirizzo',
      name_other: 'Indirizzi',
      attributes: {
        billing_info: 'Informazione di fatturazione',
        city: 'Città',
        company: 'Azienda',
        country_code: 'Paese',
        first_name: 'Nome',
        last_name: 'Cognome',
        line_1: 'Indirizzo',
        notes: 'Note',
        phone: 'Telefono',
        state_code: 'Provincia',
        zip_code: 'CAP'
      }
    },
    adjustments: {
      name: 'Modifica',
      name_other: 'Modifiche',
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
        email: 'Indirizzo Email',
        status: {
          prospect: 'Potenziale',
          acquired: 'Acquisito',
          repeat: 'Abituale'
        }
      }
    },
    links: {
      name: 'Link',
      name_other: 'Links',
      attributes: {}
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
          placed: 'Acquistato',
          placing: 'In acquisto'
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
          unfulfilled: 'Non spedito',
          in_progress: 'In corso',
          fulfilled: 'Spedito',
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
    packages: {
      name: 'Imballo',
      name_other: 'Imballi',
      attributes: {}
    },
    parcels: {
      name: 'Collo',
      name_other: 'Colli',
      attributes: {
        unit_of_weight: {
          gr: 'Grammi',
          lb: 'Libbra',
          oz: 'Oncia'
        }
      }
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
    stock_locations: {
      name: 'Magazzino',
      name_other: 'Magazzini',
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
    amount_invalid: 'Inserisci un importo valido',
    required_field: 'Campo obbligatorio'
  },
  apps: {
    customers: {
      attributes: {
        status: 'Stato'
      },
      details: {
        registered: 'Registrato',
        guest: 'Ospite',
        newsletter: 'Newsletter',
        subscribed: 'Iscritto',
        type: 'Tipo',
        wallet: 'Portafoglio',
        groups: 'Gruppi',
        confirm_customer_delete: 'Sei sicuro di voler eliminare {{email}}?',
        customer_cannot_be_deleted:
          'Il cliente non può essere eliminato tramite la nostra dashboard'
      },
      form: {
        customer_group_label: 'Gruppo',
        customer_group_hint: 'Il gruppo di appartenenza del cliente',
        email_hint: "L'indirizzo email del cliente"
      }
    },
    orders: {
      attributes: {
        status: 'Stato',
        payment_status: 'Stato pagamento',
        fulfillment_status: 'Stato spedizione'
      },
      display_status: {
        in_progress: 'In corso',
        in_progress_manual: 'In corso (Manuale)'
      },
      tasks: {
        open: 'Aperti',
        browse: 'Altro',
        awaiting_approval: 'Da approvare',
        error_to_cancel: 'Errore nella cancellazione',
        payment_to_capture: 'Da catturare',
        fulfillment_in_progress: 'Da spedire',
        editing: 'In modifica',
        history: 'Tutti gli ordini',
        cart: 'Carrello',
        carts: 'Carrelli',
        archived: 'Archiviati',
        request_return: 'Richiedi reso'
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
        fulfillment: 'Spedizione',
        payment: 'Pagamento',
        use_for_shipping: 'Usa per la spedizione',
        use_for_billing: 'Usa per la fatturazione',
        new_total_line1:
          'Il nuovo totale è {{new_total}}, {{difference}} in più rispetto al totale originale.',
        new_total_line2: 'Modifica il totale per renderlo uguale o inferiore.',
        confirm_order_cancellation:
          "Sei sicuro di voler cancellare l'ordine #{{number}}",
        confirm_capture: 'Conferma cattura',
        irreversible_action:
          'Questa azione non può essere annullata, procedi con cautela.',
        payment_captured: 'Catturato',
        payment_authorization: 'Autorizzazione pagamento',
        payment_capture: 'Cattura pagamento',
        payment_refund: 'Rimborso',
        payment_void: 'Annulla'
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
          "Seleziona un tipo di importo positivo per aumentare il totale dell'ordine.",
        manual_adjustment_name: 'Modifica manuale'
      },
      actions: {
        add_item: 'Aggiungi prodotto',
        approve: 'Approva',
        archive: 'Archivia',
        cancel_transactions: 'Annulla pagamento',
        cancel: 'Annulla ordine',
        capture_payment: 'Cattura pagamento',
        capture: 'Cattura',
        place: 'Piazza ordine',
        refund: 'Rimborsa',
        unarchive: 'Ripristina',
        continue_editing: 'Continua modifiche',
        finish_editing: 'Finalizza',
        adjust_total: 'Modifica il totale'
      }
    },
    returns: {
      attributes: {
        status: 'Stato del reso'
      },
      details: {
        origin: 'Magazzino origine',
        destination: 'Magazzino destinazione',
        to_destination: 'Verso',
        return_locations: 'Magazzini di reso',
        confirm_return_cancellation:
          'Sei sicuro di voler cancellare il reso #{{number}}',
        delete_error: "Errore durante l'eliminazione del reso",
        info: 'Info',
        timeline_requested_return:
          '{{email}} ha richiesto un reso di {{count}} prodotto',
        timeline_requested_return_other:
          '{{email}} ha richiesto un reso di {{count}} prodotti',
        timeline_shipped: 'Il reso è stato <strong>spedito</strong>',
        timeline_received: 'Il reso è stato <strong>ricevuto</strong>',
        timeline_cancelled: 'Il reso è stato <strong>cancellato</strong>',
        timeline_archived: 'Il reso è stato <strong>archiviato</strong>',
        timeline_approved: 'Il reso è stato <strong>approvato</strong>',
        timeline_item_code_restocked:
          'Il prodotto {{code}} è stato <strong>riassortito</strong>',
        timeline_payment_of_amount_was_action:
          'Il pagamento di {{amount}} è stato <strong>{{action}}</strong>',
        timeline_action_of_amount_failed:
          'Il tentativo di {{action}} di {{amount}} è <strong>fallito</strong>'
      },
      tasks: {
        open: 'Aperti',
        browse: 'Altro',
        requested: 'Da approvare',
        approved: 'Da spedire',
        shipped: 'Da ricevere',
        all_returns: 'Tutti i resi',
        archived: 'Archiviati'
      },
      form: {
        items: 'Prodotti',
        no_items: 'Nessun prodotto'
      },
      actions: {
        approve: 'Approva',
        reject: 'Rifiuta',
        cancel: 'Annulla reso',
        ship: 'Segna come spedito',
        receive: 'Ricevuto',
        restock: 'Restock',
        archive: 'Archivia',
        unarchive: 'Ripristina',
        refund: 'Emetti un rimborso'
      }
    },
    shipments: {
      attributes: {
        status: 'Stato spedizione'
      },
      details: {
        awaiting_stock_transfer: 'In attesa di trasferimento di magazzino',
        label_already_purchased: 'Etichetta già acquistata',
        get_rates_error: 'Errore nel recupero delle tariffe',
        purchase_label_error:
          "Errore nell'acquisto dell'etichetta di spedizione. Contatta il tuo corriere.",
        select_rate: 'Seleziona una tariffa di spedizione',
        getting_rates: 'Recupero tariffe...',
        purchasing: 'Acquisto in corso...',
        not_in_packing: 'La spedizione non è in stato di imballaggio',
        picking_list: 'Lista di prelievo',
        awaiting_stock_transfers: 'In attesa di trasferimenti di magazzino',
        origin: 'Magazzino di partenza',
        ship_from: 'Partenza da',
        ship_to: 'Destinazione',
        weight: 'Peso',
        parcel_item: '{{count}} prodotto',
        parcel_item_other: '{{count}} prodotti'
      },
      tasks: {
        pending: 'Aperte',
        browse: 'Altro',
        picking: 'Da prelevare',
        packing: 'Da imballare',
        ready_to_ship: 'Da spedire',
        on_hold: 'In sospeso',
        all_shipments: 'Tutte le spedizioni'
      },
      actions: {
        put_on_hold: 'Metti in sospeso',
        start_picking: 'Inizia prelievo',
        start_packing: 'Inizia imballaggio',
        continue_packing: 'Continua imballaggio',
        set_back_to_picking: 'Torna in stato prelievo',
        set_back_to_packing: 'Torna in stato imballaggio',
        set_ready_to_ship: 'Pronto per la spedizione',
        set_shipped: 'Segna come spedito',
        set_delivered: 'Segna come consegnato',
        purchase_label: 'Acquista etichetta',
        purchase_labels: 'Acquista etichette'
      },
      form: {
        unit_of_weight: 'Unità di peso',
        required_package: 'Selezionare un imballo',
        invalid_weight: 'Selezionare un peso valido',
        invalid_unit_of_weight: "Selezionare un'unità di peso valida",
        incoterms_rules: 'Regole Incoterms',
        select_option: "Seleziona un'opzione",
        delivery_confirmation: 'Conferma di consegna',
        require_custom_forms: 'Richiedi moduli doganali',
        customs_info_type: 'Tipo di merce che stai spedendo',
        content_explanation_hint: 'Descrivi brevemente il contenuto del pacco',
        customs_info_failed_delivery_label:
          'Istruzioni in caso di mancata consegna',
        customs_info_restriction_type_label: 'Trattamenti speciali richiesti',
        customs_info_customs_signer_label: 'Firma doganale',
        customs_info_confirm_checkbox_label:
          'Confermo che le informazioni sono corrette',
        required_custom_form_value:
          'Richiesto quando si specifica un valore del modulo doganale',
        required_if_other_is_selected: 'Richiesto se "Altro" è selezionato',
        required_restriction_comments:
          'Richiesto se si specificano restrizioni doganali',
        customs_info_customs_signer_signature: 'Firma',
        customs_info_customs_signer_no_signature: 'Nessuna firma',
        customs_info_type_merchandise: 'Merce',
        customs_info_type_gift: 'Regalo',
        customs_info_type_documents: 'Documenti',
        customs_info_type_returned_goods: 'Beni restituiti',
        customs_info_type_sample: 'Campione',
        customs_info_type_other: 'Altro',
        customs_info_failed_delivery_return: 'Restituzione',
        customs_info_failed_delivery_abandon: 'Abbandono',
        customs_info_restriction_type_none: 'Nessuna restrizione',
        customs_info_restriction_type_other: 'Altro',
        customs_info_restriction_type_quarantine: 'Quarantena',
        customs_info_restriction_type_sanitary_phytosanitary_inspection:
          'Ispezione sanitaria o fitosanitaria',
        no_packages_found: 'Nessun imballo trovato in questo magazzino',
        select_package: 'Seleziona un imballo',
        packing_items: 'Prodotti',
        pack_items: 'Imballa elementi · {{items}}',
        more_options: 'Altre opzioni'
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
