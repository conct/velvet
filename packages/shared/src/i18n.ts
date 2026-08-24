export type Locale = "de" | "en" | "pl" | "es";

export const DEFAULT_LOCALE: Locale = "de";
export const LOCALES: Locale[] = ["de", "en", "pl", "es"];

export const LOCALE_LABELS: Record<Locale, string> = {
  de: "Deutsch",
  en: "English",
  pl: "Polski",
  es: "Español",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  de: "🇩🇪",
  en: "🇬🇧",
  pl: "🇵🇱",
  es: "🇪🇸",
};

// Frontend UI copy only -- distinct from the backend's own translation table
// (server/src/lib/i18n.ts), which covers API error/success strings and email
// content. Nest by feature area to keep this navigable as it grows; every
// locale must define every key (TypeScript catches missing ones since both
// objects are typed against the same `Translations` shape).
export interface Translations {
  nav: {
    overview: string;
    guests: string;
    pending: string;
    team: string;
    messages: string;
    settings: string;
    addVenue: string;
    reviewVenues: string;
    reviewApplications: string;
    hiddenVenues: string;
    logout: string;
    openMenu: string;
  };
  login: {
    heading: string;
    subtitle: string;
    email: string;
    password: string;
    submit: string;
    submitting: string;
    forgotPassword: string;
    chooseVenue: string;
    chooseVenueSubtitle: string;
    notVerified: string;
    back: string;
  };
  landing: {
    tagline: string;
    heroBody: string;
    ctaLogin: string;
    ctaForTeam: string;

    heroEyebrow: string;
    heroCardVerified: string;
    heroCardLocations: string;
    heroCardScore: string;

    principleEyebrow: string;
    principleTitle: string;
    flowSteps: { n: string; title: string; body: string }[];

    howEyebrow: string;
    howTitle: string;
    explainerTabs: { tabLabel: string; eyebrow: string; title: string }[];
    demoLink: string;

    guestsEyebrow: string;
    guestsTitle: string;
    guestsBody: string;
    guestsBenefits: { title: string; body: string }[];
    guestsWelcomeBack: string;
    guestsGlobalStatus: string;
    guestsBenefitText: string;

    staffEyebrow: string;
    staffTitle: string;
    staffBody: string;
    staffBenefits: { title: string; body: string }[];
    staffScanDetected: string;
    staffVisitsSuffix: string;
    staffLocationsLabel: string;
    staffLocationsValue: string;
    staffLastVisitLabel: string;
    staffLocalStatusLabel: string;
    staffLocalStatusValue: string;
    staffTraitsLabel: string;
    staffTraitsValue: string;
    staffNoIncidents: string;

    ownersEyebrow: string;
    ownersTitle: string;
    ownersBody: string;
    ownersBenefits: { title: string; body: string }[];
    ownersRecentCheckins: string;
    ownersColGuest: string;
    ownersColStatus: string;
    ownersColScore: string;

    statusEyebrow: string;
    statusTitle: string;
    statusBody: string;
    tierPath: { tier: string; body: string }[];

    downloadEyebrow: string;
    downloadTitle: string;
    downloadBody: string;
    downloadSources: {
      ios: { title: string; body: string };
      android: { title: string; body: string };
      apk: { title: string; body: string };
      web: { title: string; body: string };
    };
    closingEyebrow: string;
    closingTitle: string;

    footerTagline: string;
    footerImpressum: string;
    footerDatenschutz: string;
    footerWerbematerial: string;
    footerAgb: string;
    footerWiderruf: string;
    footerLocationTerms: string;
    footerApply: string;
  };
  common: {
    genericError: string;
    loading: string;
    showPassword: string;
    hidePassword: string;
  };
  venueTypes: {
    CLUB: string;
    BAR: string;
    PUB: string;
    OTHER: string;
  };
  tiers: {
    VIP: string;
    TRUSTED: string;
    STANDARD: string;
    WATCH: string;
    BANNED: string;
  };
  explainers: {
    qrCheckin: {
      accessCodeLabel: string;
      scanningLabel: string;
      checkedInLabel: string;
      readyToScan: string;
      scanningStaffLabel: string;
      entryGranted: string;
      captionShow: string;
      captionScan: string;
      captionAppear: string;
    };
    premiumMatch: {
      checkedInTag: string;
      matchesQuestion: string;
      chatMsgOut: string;
      chatMsgIn: string;
      captionSameNight: string;
      captionPremiumShows: string;
      captionRealMatches: string;
    };
    multiVenue: {
      navOverview: string;
      navAddVenue: string;
      statGuests: string;
      statAvgScore: string;
      formButtonCreate: string;
      captionOneLogin: string;
      captionSwitch: string;
      captionCreateOwn: string;
    };
    trustScore: {
      rateLabel: string;
      tagFriendly: string;
      tagPunctual: string;
      submitButton: string;
      processingLabel: string;
      rateCapturedLabel: string;
      statusUpdatingLabel: string;
      networkWideValidLabel: string;
      captionStars: string;
      captionGlobalStatus: string;
      captionTravels: string;
    };
  };
  languagePage: {
    title: string;
    subtitle: string;
  };
  authFlow: {
    backToLogin: string;
    forgotPasswordSubtitle: string;
    emailSentTitle: string;
    emailSentBody: string;
    forgotPasswordTitle: string;
    forgotPasswordBody: string;
    sending: string;
    sendLink: string;

    resetPasswordSubtitle: string;
    invalidLink: string;
    passwordChangedTitle: string;
    passwordChangedBody: string;
    goToLogin: string;
    setNewPasswordTitle: string;
    newPasswordPlaceholder: string;
    confirmPasswordPlaceholder: string;
    passwordsDontMatch: string;
    saving: string;
    savePassword: string;

    verifyEmailSubtitle: string;
    verifying: string;
    emailVerifiedTitle: string;
    emailVerifiedBody: string;
    invalidVerifyLink: string;
  };
  pages: {
    overview: {
      welcomeBack: string;
      recentCheckins: string;
      rateAll: string;
      nothingPending: string;
    };
    guests: {
      title: string;
      subtitle: string;
      searchPlaceholder: string;
      colGuest: string;
      colGlobalStatus: string;
      colVisits: string;
      colHere: string;
      colLastVisit: string;
      flagVip: string;
      flagBanned: string;
      noneFound: string;
    };
    pending: {
      title: string;
      subtitle: string;
      nothingPending: string;
      stars: string;
      tags: string;
      noteLabel: string;
      notePlaceholder: string;
      statusHere: string;
      flagNone: string;
      flagVip: string;
      flagBanned: string;
      missingStars: string;
      saveFailed: string;
      saving: string;
      save: string;
    };
    team: {
      title: string;
      subtitle: string;
      managerOnly: string;
      colName: string;
      colEmail: string;
      colRole: string;
      roleManager: string;
      roleDoorman: string;
      roleService: string;
      newMember: string;
      namePlaceholder: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      createFailed: string;
      creating: string;
      create: string;
    };
    settings: {
      title: string;
      subtitle: string;
      loadFailed: string;
      saveFailed: string;
      name: string;
      address: string;
      logoUrl: string;
      loggedInAs: string;
      saved: string;
      saving: string;
      save: string;
      cancel: string;
      edit: string;
    };
    venuesNew: {
      title: string;
      subtitle: string;
      namePlaceholder: string;
      addressPlaceholder: string;
      createFailed: string;
      creating: string;
      create: string;
      createdHeading: string;
      createdBody: string;
      switchFailed: string;
      switching: string;
      switchTo: string;
    };
    messages: {
      title: string;
      subtitle: string;
      managerOnly: string;
      conversations: string;
      noConversations: string;
      writeToGuests: string;
      noMoreGuests: string;
      premiumBadge: string;
      noMessages: string;
      messagePlaceholder: string;
      sendAriaLabel: string;
      selectConversation: string;
      loadHistoryFailed: string;
      sendFailed: string;
    };
    venueApplication: {
      eyebrow: string;
      title: string;
      intro: string;
      verifyTitle: string;
      verifyBody: string;
      sectionVenue: string;
      sectionContact: string;
      sectionDocument: string;
      venueName: string;
      venueType: string;
      address: string;
      website: string;
      contactName: string;
      contactEmail: string;
      contactPhone: string;
      message: string;
      documentHint: string;
      documentChoose: string;
      documentNone: string;
      privacyHint: string;
      submit: string;
      submitting: string;
      submitFailed: string;
      successTitle: string;
      successBody: string;
      backHome: string;
    };
    adminApplications: {
      title: string;
      subtitle: string;
      adminOnly: string;
      loadFailed: string;
      pendingHeading: string;
      decidedHeading: string;
      nothingPending: string;
      contactLabel: string;
      websiteLabel: string;
      messageLabel: string;
      documentLabel: string;
      documentDeleted: string;
      openDocument: string;
      opening: string;
      openFailed: string;
      approve: string;
      approving: string;
      approveFailed: string;
      approveHint: string;
      reject: string;
      rejecting: string;
      rejectFailed: string;
      rejectReason: string;
      rejectConfirm: string;
      cancel: string;
      statusApproved: string;
      statusRejected: string;
      reviewNoteLabel: string;
    };
    adminVenues: {
      title: string;
      subtitle: string;
      adminOnly: string;
      pendingHeading: string;
      verifiedHeading: string;
      suspendedHeading: string;
      verifying: string;
      verify: string;
      loadFailed: string;
      verifyFailed: string;
      suspend: string;
      suspendReasonPlaceholder: string;
      suspendConfirm: string;
      suspending: string;
      suspendFailed: string;
      cancel: string;
      reactivate: string;
      reactivating: string;
      reactivateFailed: string;
      suspendedSinceLabel: string;
      suspendedReasonLabel: string;
    };
    adminHiddenVenues: {
      title: string;
      subtitle: string;
      adminOnly: string;
      emailPlaceholder: string;
      search: string;
      searching: string;
      searchFailed: string;
      nothingHidden: string;
      hiddenSinceLabel: string;
      unhide: string;
      unhiding: string;
      unhideFailed: string;
    };
    werbematerial: {
      eyebrow: string;
      title: string;
      intro: string;
      downloads: {
        title: string;
        format: string;
        description: string;
        thumb: string;
        thumbWidth: number;
        thumbHeight: number;
        file: string;
      }[];
      previewAlt: string;
      downloadButton: string;
      guestInfoHeading: string;
      guestInfoBody: string;
      guestInfoButton: string;
      stickerHeading: string;
      stickerBody1: string;
      stickerBody2: string;
      contactButton: string;
    };
  };
  mobile: {
    welcome: {
      continueAsGuest: string;
      staffLogin: string;
      impressum: string;
      datenschutz: string;
      agb: string;
      widerruf: string;
    };
    guestLogin: {
      welcomeBack: string;
      createAccount: string;
      loginHint: string;
      registerHint: string;
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      dateOfBirthHint: string;
      dateOfBirthInvalid: string;
      dateOfBirthUnderage: string;
      email: string;
      password: string;
      submitLogin: string;
      submitRegister: string;
      registerSuccess: string;
      switchToRegister: string;
      switchToLogin: string;
      forgotPassword: string;
      resendVerification: string;
      resending: string;
      verificationResent: string;
    };
    staffLogin: {
      heading: string;
      subtitle: string;
      email: string;
      password: string;
      submit: string;
      forgotPassword: string;
      chooseVenue: string;
      chooseVenueSubtitle: string;
      notVerified: string;
      back: string;
    };
    invite: {
      shareTitle: string;
      shareSubtitle: string;
      yourCode: string;
      share: string;
      rotate: string;
      rotating: string;
      rotateConfirmTitle: string;
      rotateConfirmBody: string;
      rotateConfirmButton: string;
      cancel: string;
      enterCode: string;
      enterCodePlaceholder: string;
      requests: string;
      loadFailed: string;
      preview: {
        sendRequest: string;
        sending: string;
        requestSent: string;
        alreadyConnected: string;
        back: string;
      };
      requestsScreen: {
        title: string;
        noRequests: string;
        accept: string;
        decline: string;
      };
    };
    tabBar: {
      profile: string;
      entry: string;
      locations: string;
      messages: string;
      scanner: string;
      rate: string;
    };
    home: {
      welcomeBack: string;
      choosePhotoLibrary: string;
      takePhoto: string;
      uploading: string;
      photoAccessDenied: string;
      uploadFailed: string;
      yourStatus: string;
      scoreLabel: string;
      tierPerks: { VIP: string; TRUSTED: string; STANDARD: string; WATCH: string; BANNED: string };
      qrEntryButton: string;
      premiumTitle: string;
      premiumTeaser: string;
      logout: string;
      deleteAccount: string;
      deletingAccount: string;
      deleteConfirmTitle: string;
      deleteConfirmBody: string;
      deleteConfirmCancel: string;
      deleteErrorTitle: string;
      deleteErrorBody: string;
    };
    qr: {
      showAtDoor: string;
      photoMissingTitle: string;
      photoMissingBody: string;
      addPhotoButton: string;
      accessCodeTitle: string;
      manualFallback: string;
      loadFailed: string;
      expiresIn: string;
    };
    venues: {
      alreadyVisited: string;
      title: string;
      searchPlaceholder: string;
      emptyNoVisits: string;
      emptyNoResults: string;
      visitsSingular: string;
      visitsPlural: string;
      flagVip: string;
      flagBanned: string;
      hide: string;
      hideConfirmTitle: string;
      hideConfirmBody: string;
      hideConfirmAction: string;
      hideCancel: string;
      hideFailed: string;
    };
    staffScanner: {
      scanFailed: string;
      atVenue: string;
      visitsHere: string;
      onVipList: string;
      bannedHere: string;
      noteLabel: string;
      rateButton: string;
      continueScanning: string;
      entryScanner: string;
      scanTitle: string;
      allowCamera: string;
      checkingCode: string;
      manualFallback: string;
      codePlaceholder: string;
      checkButton: string;
      logoutLabel: string;
    };
    staffPending: {
      recentEntries: string;
      title: string;
      empty: string;
    };
    staffRate: {
      rateGuest: string;
      starsLabel: string;
      traitsLabel: string;
      noteLabel: string;
      notePlaceholder: string;
      statusHereLabel: string;
      flagNone: string;
      flagVip: string;
      flagBanned: string;
      missingStars: string;
      saveFailed: string;
      save: string;
    };
    messagesHome: {
      title: string;
      premiumUpsellBody: string;
      discoverPremium: string;
      whoWasThereTonight: string;
      noMatches: string;
    };
    messageThread: {
      back: string;
      report: string;
      block: string;
      blockConfirmTitle: string;
      blockConfirmBody: string;
      cancel: string;
      reportConfirmTitle: string;
      reportConfirmBody: string;
      reportThanksTitle: string;
      reportThanksBody: string;
      reportReason: string;
      noMessages: string;
      messagePlaceholder: string;
      send: string;
      sendFailed: string;
    };
    premium: {
      back: string;
      title: string;
      subtitle: string;
      activeSubscription: string;
      providerGranted: string;
      monthly: string;
      yearly: string;
      expiresOn: string;
      renewsOn: string;
      cancelButton: string;
      saveBadge: string;
      subscribeWithStripe: string;
      subscribeWithPaypal: string;
      paymentNote: string;
      statusLoadFailed: string;
      checkoutFailed: string;
      cancelFailed: string;
      withdrawalConsentHeading: string;
      withdrawalReadMore: string;
      withdrawalConsentRequired: string;
      features: { icon: string; title: string; body: string }[];
    };
    premiumSuccess: {
      title: string;
      body: string;
      button: string;
    };
    premiumCancel: {
      title: string;
      body: string;
      button: string;
    };
  };
  ratingTags: {
    friendly: string;
    punctual: string;
    big_spender: string;
    well_dressed: string;
    trouble: string;
    too_intoxicated: string;
  };
  demo: {
    eyebrow: string;
    title: string;
    intro: string;
    sections: {
      key: string;
      eyebrow: string;
      title: string;
      subtitle: string;
      steps: { n: string; title: string; body: string }[];
    }[];
  };
  legal: {
    back: string;
    kontoLoeschen: {
      title: string;
      sections: { heading: string; paragraphs: string[] }[];
    };
  };
  makingOf: {
    eyebrow: string;
    title: string;
    intro: string;
    devTimeLabel: string;
    devTimeValue: string;
    devTimeRange: string;
    commitsLabel: string;
    subsystemsLabel: string;
    workBlocksHeading: string;
    commitSingular: string;
    commitPlural: string;
    sessions: { range: string; commits: number; note?: string }[];
    methodologyHeading: string;
    methodologyBody: string;
  };
}

const de: Translations = {
  nav: {
    overview: "Übersicht",
    guests: "Gäste",
    pending: "Bewerten",
    team: "Team",
    messages: "Nachrichten",
    settings: "Einstellungen",
    addVenue: "Standort hinzufügen",
    reviewVenues: "Locations prüfen",
    reviewApplications: "Bewerbungen",
    hiddenVenues: "Ausgeblendete Locations",
    logout: "Abmelden",
    openMenu: "Menü öffnen",
  },
  login: {
    heading: "Anmelden",
    subtitle: "Club-Dashboard für Team & Management",
    email: "E-Mail",
    password: "Passwort",
    submit: "Anmelden",
    submitting: "Anmelden…",
    forgotPassword: "Passwort vergessen?",
    chooseVenue: "Location wählen",
    chooseVenueSubtitle: "Dieser Account verwaltet mehrere Standorte.",
    notVerified: "Nicht freigegeben",
    back: "Zurück",
  },
  landing: {
    tagline: "Zugang, der sich verdient anfühlt.",
    heroBody:
      "VELVET ersetzt die Papierliste und das Bauchgefühl am Einlass durch ein Profil, das mitwächst: Gäste bauen sich eine Reputation auf, die über einen einzelnen Club hinausreicht. Türsteher sehen beim Scan sofort, wen sie vor sich haben. Betreiber schützen ihr Haus, ohne jeden Abend bei null anzufangen.",
    ctaLogin: "Anmelden",
    ctaForTeam: "Für Team & Management teilnehmender Locations",

    heroEyebrow: "Geteiltes Vertrauensnetzwerk für den Türstand",
    heroCardVerified: "Verifiziert am Einlass",
    heroCardLocations: "3 Locations im Netzwerk",
    heroCardScore: "Score 4.7",

    principleEyebrow: "Das Prinzip",
    principleTitle: "Ein Profil. Jeder Türstand im Netzwerk kennt es.",
    flowSteps: [
      { n: "01 · Profil", title: "Konto anlegen", body: "Name, Foto, ein Konto — gültig in allen teilnehmenden Locations, nicht nur in einer." },
      { n: "02 · Einlass", title: "Am Einlass scannen", body: "Der Türsteher scannt den Code und sieht sofort Foto, Status und Vorgeschichte." },
      { n: "03 · Bewertung", title: "Kurz einschätzen", body: "Nach dem Abend: Sterne plus Merkmale wie „Freundlich“, „Pünktlich“ oder „Ärger gemacht“." },
      { n: "04 · Reputation", title: "Status reist mit", body: "Die Einschätzung fließt in einen globalen Status ein — sichtbar für jedes Haus im Netzwerk." },
    ],

    howEyebrow: "So funktioniert's",
    howTitle: "Angesehen ist schneller als erklärt.",
    explainerTabs: [
      { tabLabel: "QR-Check-in", eyebrow: "Am Einlass", title: "Vom Code zum Check-in — live, kein Mockup." },
      { tabLabel: "Premium-Match", eyebrow: "Nach dem Abend", title: "Wer war heute Nacht auch da?" },
      { tabLabel: "Team & Standorte", eyebrow: "Für Betreiber", title: "Ein Login, mehrere Standorte." },
      { tabLabel: "Vertrauens-Score", eyebrow: "Der Status-Pfad", title: "Aus Bewertungen wird ein Status, der mitreist." },
    ],
    demoLink: "Ausführliche Erklärung ansehen →",

    guestsEyebrow: "01 · Für Gäste",
    guestsTitle: "Dein Ruf öffnet dir die Tür — überall im Netzwerk.",
    guestsBody: "Kein Erklären, wer man ist. Kein Anstehen für etwas, das man sich längst verdient hat.",
    guestsBenefits: [
      { title: "Ein Code statt langer Diskussionen —", body: "Foto und Status sind sofort sichtbar, der Einlass geht schneller." },
      { title: "Status sammelt sich standortübergreifend —", body: "gutes Verhalten in einem Club zahlt auf den Status in jedem anderen ein." },
      { title: "Ehrliches Auftreten wird belohnt —", body: "höherer Status bedeutet kürzere Wege und Zugang zum VIP-Bereich." },
    ],
    guestsWelcomeBack: "Willkommen zurück",
    guestsGlobalStatus: "Globaler Status",
    guestsBenefitText: "Garantierter Einlass ohne Warteschlange und Zugang zum VIP-Bereich in allen teilnehmenden Locations.",

    staffEyebrow: "02 · Für Türsteher & Sicherheitsdienste",
    staffTitle: "Kontext statt Bauchgefühl — in der Sekunde des Scans.",
    staffBody: "Ein Blick auf den Scanner sagt mehr als jede Namensliste je konnte.",
    staffBenefits: [
      { title: "Foto, Status und Historie auf einen Scan —", body: "auch aus anderen Häusern im Netzwerk, nicht nur der eigenen Location." },
      { title: "Keine Diskussionen mehr am Eingang —", body: "die Entscheidung stützt sich auf dokumentierte Vorgeschichte statt auf Zettel." },
      { title: "Auffälligkeiten sind sofort sichtbar —", body: "Vorfälle wie Ärger oder starke Alkoholisierung werden erfasst, bevor sie sich wiederholen." },
    ],
    staffScanDetected: "Scan erkannt",
    staffVisitsSuffix: "Besuche",
    staffLocationsLabel: "Standorte",
    staffLocationsValue: "3 im Netzwerk",
    staffLastVisitLabel: "Zuletzt",
    staffLocalStatusLabel: "Lokaler Status",
    staffLocalStatusValue: "VIP hier",
    staffTraitsLabel: "Merkmale",
    staffTraitsValue: "Freundlich, Pünktlich",
    staffNoIncidents: "Keine Vorfälle im Netzwerk hinterlegt",

    ownersEyebrow: "03 · Für Clubbetreiber & Management",
    ownersTitle: "Ein Netzwerk schützt jedes Haus darin.",
    ownersBody: "Weniger Reibung am Eingang heißt weniger Eskalationen — und planbarere Abende.",
    ownersBenefits: [
      { title: "Gästeliste, Bewertungen und Team auf einen Blick —", body: "im Dashboard, ohne Zettelwirtschaft zwischen den Schichten." },
      { title: "Häuser profitieren voneinander —", body: "ein an einem Standort gesperrter Gast ist netzwerkweit sichtbar, bevor er an eine andere Tür kommt." },
      { title: "Stammgäste müssen sich nicht neu beweisen —", body: "verdientes Vertrauen bleibt erhalten, wohin der Gast auch geht." },
    ],
    ownersRecentCheckins: "Zuletzt eingecheckt",
    ownersColGuest: "Gast",
    ownersColStatus: "Status",
    ownersColScore: "Score",

    statusEyebrow: "Der Status-Pfad",
    statusTitle: "Fünf Stufen, netzwerkweit gültig.",
    statusBody: "Der Status ergibt sich aus den gesammelten Bewertungen aller teilnehmenden Locations — nicht aus einem einzelnen Abend.",
    tierPath: [
      { tier: "VIP", body: "Garantierter Einlass, VIP-Bereich. Durchgehend sehr gute Bewertungen über mehrere Locations." },
      { tier: "TRUSTED", body: "Bevorzugter Einlass. Verlässlich guter Eindruck, als Stammgast erkannt." },
      { tier: "STANDARD", body: "Regulärer Einlass. Der Ausgangspunkt für jedes neue Profil." },
      { tier: "WATCH", body: "Genauer hingeschaut. Einlass liegt im Ermessen der Tür." },
      { tier: "BANNED", body: "Netzwerkweite Sperre. Ein Hausverbot an einem Standort ist an jeder Tür im Netzwerk sichtbar." },
    ],

    downloadEyebrow: "Gast-App",
    downloadTitle: "VELVET aufs Handy",
    downloadBody:
      "Dein Status, dein QR-Code am Einlass, deine Locations — such dir aus, woher du die App holst.",
    downloadSources: {
      ios: { title: "App Store", body: "Für iPhone und iPad." },
      android: { title: "Google Play", body: "Für Android-Geräte." },
      apk: { title: "APK auf Anfrage", body: "Ohne Play Store — schreib uns kurz, dann schicken wir dir die Datei." },
      web: { title: "Im Browser öffnen", body: "Ohne Installation, funktioniert auf jedem Handy." },
    },
    closingEyebrow: "VELVET",
    closingTitle: "Ein Türstand, der sich erinnert.",

    footerTagline: "VELVET — Geteiltes Vertrauensnetzwerk für den Türstand",
    footerImpressum: "Impressum",
    footerDatenschutz: "Datenschutz",
    footerWerbematerial: "Werbematerial",
    footerAgb: "AGB",
    footerWiderruf: "Widerruf",
    footerLocationTerms: "Bedingungen für Locations",
    footerApply: "Location anmelden",
  },
  common: {
    genericError: "Verbindung fehlgeschlagen",
    loading: "Lädt…",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
  },
  venueTypes: {
    CLUB: "Club",
    BAR: "Bar",
    PUB: "Kneipe/Pub",
    OTHER: "Andere",
  },
  tiers: {
    VIP: "VIP",
    TRUSTED: "Vertraut",
    STANDARD: "Standard",
    WATCH: "Beobachtung",
    BANNED: "Gesperrt",
  },
  explainers: {
    qrCheckin: {
      accessCodeLabel: "Dein Zugangscode",
      scanningLabel: "Code wird gescannt…",
      checkedInLabel: "Eingecheckt",
      readyToScan: "Bereit zum Scannen",
      scanningStaffLabel: "Scan läuft…",
      entryGranted: "Einlass gewährt",
      captionShow: "Gast **zeigt seinen Code** — als QR oder 6-stellige Zahl.",
      captionScan: "Türsteher **scannt oder tippt ihn ein** — beides funktioniert.",
      captionAppear: "Profil erscheint **sofort** — inklusive Status und Historie.",
    },
    premiumMatch: {
      checkedInTag: "Eingecheckt",
      matchesQuestion: "Wer war heute Nacht auch da?",
      chatMsgOut: "Hey, cooler Abend gestern!",
      chatMsgIn: "Auf jeden Fall 🙌",
      captionSameNight: "Zwei Gäste, **derselbe Abend**, dieselbe Location.",
      captionPremiumShows: "Premium zeigt: **„Wer war heute Nacht auch da?“**",
      captionRealMatches: "Anschreiben — **nur bei echten Matches**, keine Fremden.",
    },
    multiVenue: {
      navOverview: "Übersicht",
      navAddVenue: "Standort hinzufügen",
      statGuests: "Gäste",
      statAvgScore: "Score",
      formButtonCreate: "Standort anlegen",
      captionOneLogin: "**Ein Login**, mehrere Standorte — jeder mit eigenen Zahlen.",
      captionSwitch: "Location **wechseln**, ohne dich neu anzumelden.",
      captionCreateOwn: "Neue Location **selbst anlegen** — startet erst nach Prüfung.",
    },
    trustScore: {
      rateLabel: "Bewertung abgeben",
      tagFriendly: "Freundlich",
      tagPunctual: "Pünktlich",
      submitButton: "Abschicken",
      processingLabel: "Wird verarbeitet…",
      rateCapturedLabel: "Bewertung erfasst",
      statusUpdatingLabel: "Status wird aktualisiert…",
      networkWideValidLabel: "Netzwerkweit gültig",
      captionStars: "Nach dem Besuch: **Sterne plus Merkmale** — 10 Sekunden.",
      captionGlobalStatus: "Fließt in den **globalen Status** ein — nicht nur diesen einen Abend.",
      captionTravels: "Status **reist mit** — gültig an jeder Tür im Netzwerk.",
    },
  },
  languagePage: {
    title: "Sprache wählen",
    subtitle: "Wähle die Sprache für VELVET.",
  },
  authFlow: {
    backToLogin: "Anmelden",
    forgotPasswordSubtitle: "Passwort zurücksetzen",
    emailSentTitle: "E-Mail unterwegs",
    emailSentBody: "Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir dir einen Link zum Zurücksetzen geschickt. Prüfe auch den Spam-Ordner.",
    forgotPasswordTitle: "Passwort vergessen?",
    forgotPasswordBody: "Gib deine E-Mail-Adresse ein, wir schicken dir einen Link zum Zurücksetzen.",
    sending: "Sende…",
    sendLink: "Link senden",

    resetPasswordSubtitle: "Neues Passwort",
    invalidLink: "Kein gültiger Link. Fordere einen neuen Reset-Link an.",
    passwordChangedTitle: "Passwort geändert",
    passwordChangedBody: "Du kannst dich jetzt mit deinem neuen Passwort anmelden.",
    goToLogin: "Zur Anmeldung",
    setNewPasswordTitle: "Neues Passwort setzen",
    newPasswordPlaceholder: "Neues Passwort (min. 8 Zeichen)",
    confirmPasswordPlaceholder: "Passwort bestätigen",
    passwordsDontMatch: "Passwörter stimmen nicht überein",
    saving: "Speichert…",
    savePassword: "Passwort speichern",

    verifyEmailSubtitle: "E-Mail-Adresse bestätigen",
    verifying: "Bestätige deine E-Mail-Adresse…",
    emailVerifiedTitle: "E-Mail bestätigt",
    emailVerifiedBody: "Dein Konto ist jetzt aktiv. Du kannst dich in der VELVET-App einloggen.",
    invalidVerifyLink: "Kein gültiger Link. Fordere in der App eine neue Bestätigungs-Mail an.",
  },
  pages: {
    overview: {
      welcomeBack: "Willkommen zurück",
      recentCheckins: "Zuletzt eingecheckt",
      rateAll: "Alle bewerten →",
      nothingPending: "Aktuell nichts offen.",
    },
    guests: {
      title: "Gäste",
      subtitle: "Alle Gäste, die dieses Haus bereits besucht haben.",
      searchPlaceholder: "Suche nach Name oder E-Mail…",
      colGuest: "Gast",
      colGlobalStatus: "Globaler Status",
      colVisits: "Besuche",
      colHere: "Bei uns",
      colLastVisit: "Letzter Besuch",
      flagVip: "VIP hier",
      flagBanned: "Hausverbot",
      noneFound: "Keine Gäste gefunden.",
    },
    pending: {
      title: "Bewerten",
      subtitle: "Gäste der letzten 6 Stunden, die noch nicht bewertet wurden.",
      nothingPending: "Aktuell nichts offen.",
      stars: "Sterne",
      tags: "Merkmale",
      noteLabel: "Notiz (nur für dieses Haus sichtbar)",
      notePlaceholder: "Optional…",
      statusHere: "Status bei uns",
      flagNone: "Keine Änderung",
      flagVip: "Auf VIP-Liste (dieses Haus)",
      flagBanned: "Hausverbot (dieses Haus)",
      missingStars: "Bitte eine Sternebewertung auswählen",
      saveFailed: "Bewertung fehlgeschlagen",
      saving: "Speichert…",
      save: "Bewertung speichern",
    },
    team: {
      title: "Team",
      subtitle: "Türsteher und Manager für {venue}.",
      managerOnly: "Nur Manager können das Team verwalten.",
      colName: "Name",
      colEmail: "E-Mail",
      colRole: "Rolle",
      roleManager: "Manager",
      roleDoorman: "Türsteher",
      roleService: "Servicekraft",
      newMember: "Neues Teammitglied",
      namePlaceholder: "Name",
      emailPlaceholder: "E-Mail",
      passwordPlaceholder: "Passwort (min. 8 Zeichen)",
      createFailed: "Anlegen fehlgeschlagen",
      creating: "Anlegen…",
      create: "Anlegen",
    },
    settings: {
      title: "Einstellungen",
      subtitle: "Angaben zu deiner Location.",
      loadFailed: "Location konnte nicht geladen werden",
      saveFailed: "Speichern fehlgeschlagen",
      name: "Name",
      address: "Adresse",
      logoUrl: "Logo-URL (optional)",
      loggedInAs: "Angemeldet als",
      saved: "Gespeichert.",
      saving: "Speichert…",
      save: "Speichern",
      cancel: "Abbrechen",
      edit: "Bearbeiten",
    },
    venuesNew: {
      title: "Standort hinzufügen",
      subtitle: "Neue Location zu deinem Account hinzufügen. Du wirst automatisch als Manager eingetragen.",
      namePlaceholder: "Name der Location",
      addressPlaceholder: "Adresse",
      createFailed: "Anlegen fehlgeschlagen",
      creating: "Anlegen…",
      create: "Standort anlegen",
      createdHeading: "„{name}“ angelegt",
      createdBody:
        "Diese Location ist noch nicht freigegeben. Einlass per QR-Code und Bewertungen funktionieren erst, nachdem VELVET den Standort manuell verifiziert hat. Du kannst schon jetzt Adresse und Team einrichten.",
      switchFailed: "Wechsel fehlgeschlagen",
      switching: "Wechsle…",
      switchTo: "Zu diesem Standort wechseln",
    },
    messages: {
      title: "Nachrichten",
      subtitle: "Schreib VIP- oder Premium-Gästen dieses Hauses, um sie z. B. einzuladen.",
      managerOnly: "Nur Manager können Gäste anschreiben.",
      conversations: "Unterhaltungen",
      noConversations: "Noch keine Unterhaltungen.",
      writeToGuests: "Gäste anschreiben",
      noMoreGuests: "Keine weiteren VIP-/Premium-Gäste.",
      premiumBadge: "Premium",
      noMessages: "Noch keine Nachrichten — schreib die erste.",
      messagePlaceholder: "Nachricht schreiben…",
      sendAriaLabel: "Senden",
      selectConversation: "Wähle links eine Unterhaltung oder einen Gast aus.",
      loadHistoryFailed: "Verlauf konnte nicht geladen werden",
      sendFailed: "Nachricht konnte nicht gesendet werden",
    },
    venueApplication: {
      eyebrow: "Für Locations",
      title: "Location bei VELVET anmelden",
      intro:
        "Club, Bar oder Kneipe — trag hier deine Location ein. Wir prüfen die Angaben von Hand und legen dich frei, sobald alles passt.",
      verifyTitle: "Warum wir eine Gewerbeanmeldung brauchen",
      verifyBody:
        "VELVET-Locations sehen Gästeprofile und vergeben Bewertungen. Deshalb schalten wir nur echte Betriebe frei — die Gewerbeanmeldung ist unser Nachweis dafür. Sie wird nur intern geprüft und nie veröffentlicht.",
      sectionVenue: "Deine Location",
      sectionContact: "Ansprechpartner:in",
      sectionDocument: "Nachweis",
      venueName: "Name der Location",
      venueType: "Art der Location",
      address: "Adresse",
      website: "Website oder Instagram (optional)",
      contactName: "Vor- und Nachname",
      contactEmail: "E-Mail-Adresse",
      contactPhone: "Telefon (optional)",
      message: "Kurz zu deiner Location (optional)",
      documentHint: "Gewerbeanmeldung als PDF, JPEG oder PNG — maximal 10 MB.",
      documentChoose: "Datei wählen",
      documentNone: "Keine Datei gewählt",
      privacyHint:
        "Mit dem Absenden stimmst du zu, dass wir deine Angaben zur Prüfung speichern. Details in der Datenschutzerklärung.",
      submit: "Bewerbung absenden",
      submitting: "Wird gesendet…",
      submitFailed: "Senden fehlgeschlagen",
      successTitle: "Danke — wir haben deine Bewerbung",
      successBody:
        "Wir prüfen deine Angaben und die Gewerbeanmeldung und melden uns per E-Mail. Wenn alles passt, bekommst du einen Link, um dein Passwort zu setzen.",
      backHome: "Zurück zur Startseite",
    },
    adminApplications: {
      title: "Bewerbungen",
      subtitle: "Self-Service-Anmeldungen prüfen: Gewerbeanmeldung ansehen, dann Location anlegen oder ablehnen.",
      adminOnly: "Nur für Platform-Admins.",
      loadFailed: "Laden fehlgeschlagen",
      pendingHeading: "Wartet auf Prüfung",
      decidedHeading: "Bereits entschieden",
      nothingPending: "Nichts zu prüfen.",
      contactLabel: "Kontakt",
      websiteLabel: "Web",
      messageLabel: "Nachricht",
      documentLabel: "Gewerbeanmeldung",
      documentDeleted: "Dokument nach Ablauf der 6-monatigen Aufbewahrungsfrist gelöscht",
      openDocument: "Dokument öffnen",
      opening: "Öffne…",
      openFailed: "Dokument konnte nicht geöffnet werden",
      approve: "Freigeben",
      approving: "Gebe frei…",
      approveFailed: "Freigabe fehlgeschlagen",
      approveHint: "Legt die Location an und schickt dem Kontakt einen Link zum Passwort-Setzen.",
      reject: "Ablehnen",
      rejecting: "Lehne ab…",
      rejectFailed: "Ablehnen fehlgeschlagen",
      rejectReason: "Grund für die Absage (geht per E-Mail raus)",
      rejectConfirm: "Absage senden",
      cancel: "Abbrechen",
      statusApproved: "Freigegeben",
      statusRejected: "Abgelehnt",
      reviewNoteLabel: "Notiz",
    },
    adminVenues: {
      title: "Locations prüfen",
      subtitle: "Self-service angelegte Standorte freigeben, bevor QR-Einlass und Bewertungen dort funktionieren.",
      adminOnly: "Nur für Platform-Admins.",
      pendingHeading: "Wartet auf Freigabe",
      verifiedHeading: "Bereits freigegeben",
      suspendedHeading: "Stillgelegt",
      verifying: "Bestätige…",
      verify: "Bestätigen",
      loadFailed: "Laden fehlgeschlagen",
      verifyFailed: "Bestätigen fehlgeschlagen",
      suspend: "Stilllegen",
      suspendReasonPlaceholder: "Grund für die Stilllegung",
      suspendConfirm: "Stilllegen bestätigen",
      suspending: "Lege still…",
      suspendFailed: "Stilllegen fehlgeschlagen",
      cancel: "Abbrechen",
      reactivate: "Reaktivieren",
      reactivating: "Reaktiviere…",
      reactivateFailed: "Reaktivieren fehlgeschlagen",
      suspendedSinceLabel: "Stillgelegt seit",
      suspendedReasonLabel: "Grund",
    },
    adminHiddenVenues: {
      title: "Ausgeblendete Locations",
      subtitle: "Ein Gast kann eine Location dauerhaft aus der eigenen Historie nehmen. Rückgängig geht nur hier, per exakter E-Mail-Suche.",
      adminOnly: "Nur für Platform-Admins.",
      emailPlaceholder: "E-Mail-Adresse des Gasts",
      search: "Suchen",
      searching: "Suche…",
      searchFailed: "Suche fehlgeschlagen",
      nothingHidden: "Dieser Gast hat aktuell keine Location ausgeblendet.",
      hiddenSinceLabel: "Ausgeblendet seit",
      unhide: "Wieder einblenden",
      unhiding: "Blende ein…",
      unhideFailed: "Einblenden fehlgeschlagen",
    },
    werbematerial: {
      eyebrow: "Für Clubbetreiber",
      title: "Werbematerial für deine Location",
      intro: "Zum Ausdrucken und Präsentieren vor Ort — jedes Material verlinkt per QR-Code direkt zu VELVET, damit deine Gäste ohne Umwege einsteigen können.",
      downloads: [
        {
          title: "Flyer v1",
          format: "A5 · PDF",
          description: "Zum Auslegen an der Bar oder am Tisch — mit QR-Code, der direkt zu VELVET führt.",
          thumb: "/material/thumb-flyer.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5.pdf",
        },
        {
          title: "Flyer v2",
          format: "A5 · PDF",
          description: "Asymmetrisches Layout mit dem Monogramm als großflächigem Wasserzeichen, das über den Rand ausblutet.",
          thumb: "/material/thumb-flyer-a5-v2.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5-v2.pdf",
        },
        {
          title: "Aufsteller v1",
          format: "A4 · PDF",
          description: "Für Eingang, Tresen oder Garderobe — großer QR-Code, gut lesbar auch aus Entfernung.",
          thumb: "/material/thumb-poster.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-aufsteller-a4.pdf",
        },
        {
          title: "Aufsteller v2",
          format: "A4 · PDF",
          description: "Zweigeteiltes Panel in Dunkel und Gold — kräftigerer Kontrast für Eingang und Tresen.",
          thumb: "/material/thumb-flyer-a4-v2.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-flyer-a4-v2.pdf",
        },
        {
          title: "Visitenkarte v1",
          format: "85×55 mm · PDF, 2 Seiten",
          description: "Zum Mitgeben an der Tür — von Türstehern direkt an Gäste. Vorderseite Marke, Rückseite Scan-QR.",
          thumb: "/material/thumb-visitenkarte.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte.pdf",
        },
        {
          title: "Visitenkarte v2",
          format: "85×55 mm · PDF, 2 Seiten",
          description: "Umgekehrte Farbgebung: dunkles Monogramm vorne, satter Gold-Hintergrund mit QR-Code hinten.",
          thumb: "/material/thumb-visitenkarte-v2.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte-v2.pdf",
        },
        {
          title: "Logo (Profilbild)",
          format: "1024×1024 · PNG",
          description: "Monogramm mit dunklem Hintergrund — direkt als Profilbild nutzbar, z. B. für Social-Media-Kanäle.",
          thumb: "/material/velvet-logo.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo.png",
        },
        {
          title: "Logo (freigestellt)",
          format: "1024×1024 · PNG, transparent",
          description: "Gleiches Monogramm mit transparentem Hintergrund — zum Freistellen auf eigenem Material.",
          thumb: "/material/velvet-logo-transparent.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo-transparent.png",
        },
      ],
      previewAlt: "Vorschau",
      downloadButton: "Herunterladen",
      guestInfoHeading: "Info-Seite für eure Gäste",
      guestInfoBody:
        "Eine Seite in einfacher Sprache: wie VELVET funktioniert, was gespeichert wird und wer es sieht. Gedacht zum Weitergeben — als Link, QR-Code am Einlass oder Aushang. Sie ist bewusst nicht über Suchmaschinen auffindbar.",
      guestInfoButton: "Seite ansehen",
      stickerHeading: "Sticker & individuelles Merch",
      stickerBody1: "Über die PDFs hinaus können wir für eure Location auch **Sticker** sowie **Print-on-Demand-Artikel** (z. B. Tischaufsteller, Garderobenmarken, Merchandise mit eurem Logo kombiniert mit VELVET) produzieren und liefern lassen.",
      stickerBody2: "Meldet euch einfach formlos, dann besprechen wir Format, Menge und Gestaltung.",
      contactButton: "mail@velvet-network.app kontaktieren",
    },
  },
  mobile: {
    welcome: {
      continueAsGuest: "Als Gast fortfahren",
      staffLogin: "Staff-Login",
      impressum: "Impressum",
      datenschutz: "Datenschutz",
      agb: "AGB",
      widerruf: "Widerruf",
    },
    guestLogin: {
      welcomeBack: "Willkommen zurück",
      createAccount: "Konto erstellen",
      loginHint: "Melde dich mit deinem Gast-Konto an.",
      registerHint: "Registriere dich als Gast.",
      firstName: "Vorname",
      lastName: "Nachname",
      dateOfBirth: "Geburtsdatum (TT.MM.JJJJ)",
      dateOfBirthHint: "Damit prüfen wir nur, ob du volljährig bist — Locations sehen dein Geburtsdatum nicht.",
      dateOfBirthInvalid: "Bitte gib dein Geburtsdatum als TT.MM.JJJJ an.",
      dateOfBirthUnderage: "VELVET ist ab 18 Jahren. Mit diesem Geburtsdatum lässt sich kein Konto anlegen.",
      email: "E-Mail",
      password: "Passwort",
      submitLogin: "Anmelden",
      submitRegister: "Registrieren",
      registerSuccess:
        "Fast geschafft! Wir haben dir eine E-Mail geschickt — bestätige deine Adresse über den Link darin, dann kannst du dich einloggen.",
      switchToRegister: "Noch kein Konto? Jetzt registrieren",
      switchToLogin: "Bereits registriert? Anmelden",
      forgotPassword: "Passwort vergessen?",
      resendVerification: "Bestätigungs-Mail erneut senden",
      resending: "Wird gesendet…",
      verificationResent: "Bestätigungs-Mail wurde erneut verschickt.",
    },
    staffLogin: {
      heading: "Staff-Zugang",
      subtitle: "Für Türsteher und Manager teilnehmender Venues.",
      email: "E-Mail",
      password: "Passwort",
      submit: "Anmelden",
      forgotPassword: "Passwort vergessen?",
      chooseVenue: "Location wählen",
      chooseVenueSubtitle: "Dieser Account verwaltet mehrere Standorte.",
      notVerified: "Nicht freigegeben",
      back: "Zurück",
    },
    invite: {
      shareTitle: "Freunde einladen",
      shareSubtitle:
        "Teile deinen Code — wer ihn nutzt, muss von dir erst angenommen werden, bevor ihr chatten könnt.",
      yourCode: "Dein Code",
      share: "Link teilen",
      rotate: "Neuen Code erzeugen",
      rotating: "Erzeugt…",
      rotateConfirmTitle: "Neuen Code erzeugen?",
      rotateConfirmBody: "Der alte Code funktioniert danach nicht mehr. Bestehende Verbindungen bleiben bestehen.",
      rotateConfirmButton: "Erzeugen",
      cancel: "Abbrechen",
      enterCode: "Code eingeben",
      enterCodePlaceholder: "Code oder Link…",
      requests: "Anfragen",
      loadFailed: "Konnte nicht geladen werden",
      preview: {
        sendRequest: "Anfrage senden",
        sending: "Sendet…",
        requestSent: "Anfrage gesendet",
        alreadyConnected: "Ihr seid bereits verbunden",
        back: "Zurück",
      },
      requestsScreen: {
        title: "Eingehende Anfragen",
        noRequests: "Keine offenen Anfragen.",
        accept: "Annehmen",
        decline: "Ablehnen",
      },
    },
    tabBar: {
      profile: "Profil",
      entry: "Einlass",
      locations: "Locations",
      messages: "Nachrichten",
      scanner: "Scanner",
      rate: "Bewerten",
    },
    home: {
      welcomeBack: "Willkommen zurück",
      choosePhotoLibrary: "Aus Galerie wählen",
      takePhoto: "Foto aufnehmen",
      uploading: "Lädt hoch…",
      photoAccessDenied: "Zugriff nicht erlaubt",
      uploadFailed: "Upload fehlgeschlagen",
      yourStatus: "Dein Status",
      scoreLabel: "Score",
      tierPerks: {
        VIP: "Garantierter Einlass ohne Warteschlange und Zugang zum VIP-Bereich in allen teilnehmenden Locations.",
        TRUSTED: "Bevorzugter Einlass und gute Chancen auf einen Platz auch an vollen Abenden.",
        STANDARD: "Regulärer Einlass nach den üblichen Bedingungen der jeweiligen Location.",
        WATCH: "Einlass liegt im Ermessen der Türsteher — sammle positive Bewertungen, um dich zu verbessern.",
        BANNED: "Zugang aktuell eingeschränkt. Bei Fragen wende dich direkt an die jeweilige Location.",
      },
      qrEntryButton: "QR-Code für Einlass zeigen",
      premiumTitle: "Premium",
      premiumTeaser: "Schreib Gästen, mit denen du am selben Abend unterwegs warst, um euch zu verabreden.",
      logout: "Abmelden",
      deleteAccount: "Konto löschen",
      deletingAccount: "Wird gelöscht…",
      deleteConfirmTitle: "Konto löschen",
      deleteConfirmBody: "Dein Profil, Foto und dein globaler Status werden unwiderruflich gelöscht. Das kann nicht rückgängig gemacht werden.",
      deleteConfirmCancel: "Abbrechen",
      deleteErrorTitle: "Fehler",
      deleteErrorBody: "Konto konnte nicht gelöscht werden. Bitte versuch es erneut.",
    },
    qr: {
      showAtDoor: "Am Einlass vorzeigen",
      photoMissingTitle: "Profilfoto fehlt",
      photoMissingBody: "Für den Einlass-Code brauchst du ein Profilfoto, damit das Team dich am Scanner erkennen kann.",
      addPhotoButton: "Foto hinzufügen",
      accessCodeTitle: "Dein Zugangscode",
      manualFallback: "Klappt der Scan nicht? Code eintippen lassen:",
      loadFailed: "Code konnte nicht geladen werden",
      expiresIn: "Code läuft in {s}s ab · aktualisiert automatisch",
    },
    venues: {
      alreadyVisited: "Bereits besucht",
      title: "Deine Locations",
      searchPlaceholder: "Suchen…",
      emptyNoVisits: "Noch keine Location besucht. Sobald du das erste Mal gescannt wirst, taucht sie hier auf.",
      emptyNoResults: "Keine Location gefunden.",
      visitsSingular: "Besuch",
      visitsPlural: "Besuche",
      flagVip: "VIP hier",
      flagBanned: "Hausverbot",
      hide: "Ausblenden",
      hideConfirmTitle: "Location dauerhaft ausblenden?",
      hideConfirmBody:
        "Diese Location verschwindet aus deiner Historie, und niemand kann dich über sie in den Premium-Kontakten finden. Das lässt sich in der App nicht rückgängig machen — nur der Support kann sie zurückholen.\n\nDeine Bewertungen von dort zählen weiter für deinen Status, und die Location selbst behält ihre eigenen Aufzeichnungen.",
      hideConfirmAction: "Dauerhaft ausblenden",
      hideCancel: "Abbrechen",
      hideFailed: "Ausblenden fehlgeschlagen",
    },
    staffScanner: {
      scanFailed: "Scan fehlgeschlagen",
      atVenue: "Bei",
      visitsHere: "Besuch(e) hier",
      onVipList: "Auf der VIP-Liste dieses Hauses",
      bannedHere: "Hausverbot bei uns",
      noteLabel: "Notiz",
      rateButton: "Bewerten",
      continueScanning: "Weiter scannen",
      entryScanner: "Einlass-Scanner",
      scanTitle: "QR-Code scannen",
      allowCamera: "Kamerazugriff erlauben",
      checkingCode: "Prüfe Code…",
      manualFallback: "Klappt der Scan nicht? Code eintippen:",
      codePlaceholder: "6-stelliger Code",
      checkButton: "Prüfen",
      logoutLabel: "Abmelden",
    },
    staffPending: {
      recentEntries: "Letzte Einlässe",
      title: "Noch zu bewerten",
      empty: "Aktuell nichts offen — alle Gäste sind bewertet.",
    },
    staffRate: {
      rateGuest: "Gast bewerten",
      starsLabel: "Sterne",
      traitsLabel: "Merkmale",
      noteLabel: "Notiz (nur für dieses Haus sichtbar)",
      notePlaceholder: "Optional…",
      statusHereLabel: "Status bei uns",
      flagNone: "Keine Änderung",
      flagVip: "Auf VIP-Liste (dieses Haus)",
      flagBanned: "Hausverbot (dieses Haus)",
      missingStars: "Bitte eine Sternebewertung auswählen",
      saveFailed: "Bewertung fehlgeschlagen",
      save: "Bewertung speichern",
    },
    messagesHome: {
      title: "Nachrichten",
      premiumUpsellBody: "Mit Premium kannst du Gästen schreiben, mit denen du am selben Abend in derselben Location warst.",
      discoverPremium: "Premium entdecken",
      whoWasThereTonight: "Wer war heute Nacht auch da?",
      noMatches: "Noch keine Übereinstimmungen.",
    },
    messageThread: {
      back: "Zurück",
      report: "Melden",
      block: "Blockieren",
      blockConfirmTitle: "Nutzer blockieren?",
      blockConfirmBody: "Ihr könnt euch danach keine Nachrichten mehr schreiben.",
      cancel: "Abbrechen",
      reportConfirmTitle: "Nachricht melden?",
      reportConfirmBody: "Wir prüfen den gemeldeten Inhalt.",
      reportThanksTitle: "Danke",
      reportThanksBody: "Die Nachricht wurde gemeldet.",
      reportReason: "Unangemessener Inhalt",
      noMessages: "Noch keine Nachrichten.",
      messagePlaceholder: "Nachricht…",
      send: "Senden",
      sendFailed: "Nachricht konnte nicht gesendet werden",
    },
    premium: {
      back: "Zurück",
      title: "Premium",
      subtitle: "Schalte private Nachrichten frei, um dich mit anderen Premium-Gästen zu verabreden, mit denen du am selben Abend in derselben Location warst.",
      activeSubscription: "Aktives Abo",
      providerGranted: "Gewährt",
      monthly: "Monatlich",
      yearly: "Jährlich",
      expiresOn: "Läuft aus am",
      renewsOn: "Verlängert sich am",
      cancelButton: "Kündigen",
      saveBadge: "Spare 33%",
      subscribeWithStripe: "Mit Stripe abonnieren",
      subscribeWithPaypal: "Mit PayPal abonnieren",
      paymentNote: "Die Zahlung erfolgt über eine sichere Checkout-Seite von Stripe bzw. PayPal in deinem Browser. VELVET speichert keine Zahlungsdaten.",
      statusLoadFailed: "Status konnte nicht geladen werden",
      checkoutFailed: "Checkout konnte nicht gestartet werden",
      cancelFailed: "Kündigung fehlgeschlagen",
      withdrawalConsentHeading: "Sofortiger Beginn & Widerrufsrecht",
      withdrawalReadMore: "Widerrufsbelehrung lesen",
      withdrawalConsentRequired: "Bitte bestätige den sofortigen Beginn, um das Abo abzuschließen.",
      features: [
        {
          icon: "✉",
          title: "Private Nachrichten",
          body: "Schreib Gästen, mit denen du unterwegs warst, um euch zu verabreden.",
        },
        {
          icon: "✓",
          title: "Sicher & verifiziert",
          body: "Nur mit Leuten möglich, die nachweislich am selben Abend in derselben Location eingecheckt waren — keine Fremden-Anfragen.",
        },
      ],
    },
    premiumSuccess: {
      title: "Willkommen bei Premium",
      body: "Dein Abo ist aktiv. Es kann einen Moment dauern, bis die Bestätigung deines Zahlungsanbieters eintrifft — lade dein Profil neu, falls der Status noch nicht aktualisiert ist.",
      button: "Zu Premium",
    },
    premiumCancel: {
      title: "Kein Problem",
      body: "Der Kaufvorgang wurde abgebrochen. Es wurde nichts abgebucht.",
      button: "Zurück zu Premium",
    },
  },
  ratingTags: {
    friendly: "Freundlich",
    punctual: "Pünktlich",
    big_spender: "Umsatzstark",
    well_dressed: "Stilvoll gekleidet",
    trouble: "Ärger gemacht",
    too_intoxicated: "Zu stark alkoholisiert",
  },
  demo: {
    eyebrow: "In Aktion",
    title: "So funktioniert VELVET.",
    intro: "Keine Mockups, kein Marketing-Blabla — hier siehst du jeden Ablauf so, wie er in der echten App passiert, und liest direkt darunter, was währenddessen im Hintergrund abläuft.",
    sections: [
      {
        key: "qr-checkin",
        eyebrow: "Am Einlass",
        title: "Der QR-Check-in",
        subtitle: "Vom Zugangscode bis zum erkannten Gast — in unter einer Sekunde.",
        steps: [
          {
            n: "01",
            title: "Der Code erscheint",
            body: "Im Profil tippt der Gast auf „QR-Code für Einlass zeigen“. Es erscheinen zwei Varianten desselben Zugangs: ein QR-Code zum Scannen und eine 6-stellige Zahl zum Ablesen. Beide sind 90 Sekunden gültig und erneuern sich danach automatisch — niemand muss hektisch die App offen halten.",
          },
          {
            n: "02",
            title: "Der Türsteher liest ihn ein",
            body: "Am Einlass öffnet das Team den Scanner — in der App oder im Web, etwa auf einem Tablet oder Kiosk-Terminal. Klappt der Scan nicht (schlechtes Licht, volle Tür, Kamera streikt), reicht das manuelle Eintippen der 6 Ziffern. Beides führt zum gleichen Ergebnis, auf jeder Plattform.",
          },
          {
            n: "03",
            title: "Das Profil erscheint sofort",
            body: "Foto, Name, globaler Status (VIP, Vertraut, Standard, Beobachtung, Gesperrt) und die Besuchshistorie an diesem Haus werden direkt angezeigt — inklusive Vermerken wie „auf der VIP-Liste“ oder „Hausverbot“, falls hinterlegt.",
          },
          {
            n: "04",
            title: "Einmal gültig, dann vorbei",
            body: "Jeder Code funktioniert nur ein einziges Mal. Ist der Einlass erfasst, ist er sofort verbraucht — ein zweiter Scan mit demselben Code schlägt fehl. So lässt sich ein Screenshot nicht mehrfach oder von jemand anderem benutzen.",
          },
        ],
      },
      {
        key: "premium-match",
        eyebrow: "Nach dem Abend",
        title: "Premium-Match",
        subtitle: "Nur mit Leuten schreiben, mit denen du wirklich unterwegs warst.",
        steps: [
          {
            n: "01",
            title: "Gemeinsamer Check-in",
            body: "Zwei Gäste checken am selben Abend über den QR-Code in derselben Location ein. Das allein reicht schon — es braucht kein gegenseitiges Anfragen oder Verbinden vorab.",
          },
          {
            n: "02",
            title: "Das Match erscheint automatisch",
            body: "Mit einer aktiven Premium-Mitgliedschaft zeigt der Bereich „Nachrichten“ unter „Wer war heute Nacht auch da?“ automatisch alle Gäste, mit denen ein gemeinsamer, verifizierter Check-in vorliegt — namentlich, mit Foto und Location.",
          },
          {
            n: "03",
            title: "Anschreiben, nicht anbaggern",
            body: "Nachrichten sind ausschließlich zwischen echten Matches möglich — es gibt keine offene Gästeliste zum Durchstöbern und keine Anfragen von Fremden, die nie an derselben Tür eingecheckt haben.",
          },
          {
            n: "04",
            title: "Nur mit Premium",
            body: "Die Funktion ist Teil der optionalen, kostenpflichtigen Premium-Mitgliedschaft für Gäste (monatlich oder jährlich) — VELVET selbst bleibt für Gäste und Locations kostenlos nutzbar.",
          },
        ],
      },
      {
        key: "multi-venue",
        eyebrow: "Für Betreiber",
        title: "Mehrere Standorte, ein Login",
        subtitle: "Für Marken mit mehr als einer Location — ohne mehrere Accounts.",
        steps: [
          {
            n: "01",
            title: "Ein Account, mehrere Standorte",
            body: "Betreibt ein Team mehrere Locations, hängen alle an einem einzigen Login. Beim Anmelden mit Zugriff auf mehrere Standorte wird kurz gefragt, mit welchem Standort gerade gearbeitet werden soll.",
          },
          {
            n: "02",
            title: "Jederzeit wechseln",
            body: "Über einen Umschalter in der Seitenleiste lässt sich der aktive Standort jederzeit wechseln, ohne sich neu anzumelden — Gästeliste, Team und Zahlen aktualisieren sich auf den gewählten Standort.",
          },
          {
            n: "03",
            title: "Neue Location selbst anlegen",
            body: "Ein bestehendes Team-Mitglied kann direkt im Dashboard einen weiteren Standort anlegen — Name und Adresse genügen, der Account wird automatisch als Manager dieser neuen Location eingetragen.",
          },
          {
            n: "04",
            title: "Erst geprüft, dann live",
            body: "Eine neu angelegte Location ist zunächst komplett gesperrt: kein QR-Check-in, keine Bewertungen, nicht in der öffentlichen Standort-Liste sichtbar. Erst nach manueller Prüfung wird sie freigeschaltet — so kann niemand unbemerkt eine Fake-Location ins Netzwerk hängen.",
          },
        ],
      },
      {
        key: "trust-score",
        eyebrow: "Der Status-Pfad",
        title: "Vom Sternchen zum Status",
        subtitle: "Wie aus einzelnen Bewertungen ein netzwerkweiter Ruf wird.",
        steps: [
          {
            n: "01",
            title: "Kurz einschätzen",
            body: "Nach einem erfassten Einlass kann das Team innerhalb weniger Stunden eine Bewertung abgeben: Sterne (1–5) plus optionale Merkmale wie „Freundlich“, „Pünktlich“ oder „Ärger gemacht“ — das Ganze dauert etwa 10 Sekunden.",
          },
          {
            n: "02",
            title: "Fließt in den globalen Status ein",
            body: "Die Bewertung zählt nicht nur für diesen einen Abend an diesem einen Haus — sie fließt in den standortübergreifenden, globalen Status des Gastes ein, zusammen mit allen bisherigen Bewertungen aus jeder teilnehmenden Location.",
          },
          {
            n: "03",
            title: "Fünf Stufen, netzwerkweit gültig",
            body: "Aus dem gesammelten Schnitt ergibt sich eine von fünf Stufen: Gesperrt, Beobachtung, Standard, Vertraut oder VIP. Jede Stufe ist an jeder Tür im Netzwerk sofort sichtbar, nicht nur dort, wo sie entstanden ist.",
          },
          {
            n: "04",
            title: "Verdientes Vertrauen bleibt erhalten",
            body: "Ein Gast muss sich in einer neuen Location nicht neu beweisen — guter Ruf reist mit. Umgekehrt ist ein Hausverbot an einem Standort ebenso netzwerkweit sichtbar, bevor der Gast an eine andere Tür kommt.",
          },
        ],
      },
    ],
  },
  legal: {
    back: "Zurück",
    kontoLoeschen: {
      title: "Konto löschen",
      sections: [
        {
          heading: "Löschung in der App",
          paragraphs: [
            "Öffne die VELVET-App und melde dich mit deinem Gast-Konto an.",
            "Tippe im Profilbereich unten auf „Konto löschen“ und bestätige den Hinweis.",
            "Dein Konto wird danach sofort und unwiderruflich gelöscht, du wirst automatisch abgemeldet.",
          ],
        },
        {
          heading: "Löschung ohne installierte App",
          paragraphs: [
            "Falls du die App nicht mehr installiert hast, schreib uns eine E-Mail an mail@velvet-network.app von der E-Mail-Adresse, mit der dein Konto registriert ist, mit dem Betreff „Konto löschen“.",
            "Wir löschen dein Konto dann manuell innerhalb weniger Tage und bestätigen dir das per E-Mail.",
          ],
        },
        {
          heading: "Was gelöscht wird",
          paragraphs: [
            "Dein Profil (Name, E-Mail-Adresse, Profilfoto).",
            "Dein globaler Status und alle Bewertungen, die zu deinem Konto gehören.",
            "Deine Einlass-Historie (Zeitpunkt und Location vergangener Scans) und alle Standort-Beziehungen (Besuche, lokale Vermerke).",
            "Die Löschung ist endgültig und betrifft alle Locations im Netzwerk, nicht nur eine einzelne.",
          ],
        },
        {
          heading: "Hinweis für Türsteher- und Manager-Konten",
          paragraphs: [
            "Staff-Konten (Türsteher, Manager) werden nicht von Gästen selbst verwaltet, sondern von der jeweiligen Location angelegt. Für die Löschung eines Staff-Kontos wende dich bitte an das Management deiner Location oder an mail@velvet-network.app.",
          ],
        },
      ],
    },
  },
  makingOf: {
    eyebrow: "Making Of",
    title: "Wie lange steckt in VELVET?",
    intro: "Backend, Mobile-App und Dashboard sind an einem einzigen Tag entstanden — als Referenz, wie schnell sich eine vollständige, produktiv laufende Plattform mit KI-gestützter Entwicklung umsetzen lässt.",
    devTimeLabel: "Geschätzte aktive Entwicklungszeit",
    devTimeValue: "~22,4 Std.",
    devTimeRange: "vom 19. auf den 20. August 2026, bis 03:10 Uhr",
    commitsLabel: "Commits",
    subsystemsLabel: "Teilsysteme",
    workBlocksHeading: "Arbeitsblöcke",
    commitSingular: "Commit",
    commitPlural: "Commits",
    sessions: [
      { range: "vor 01:16 Uhr (19.8.)", commits: 0, note: "Projektaufsetzung, geschätzt" },
      { range: "01:16 – 01:19 Uhr", commits: 2 },
      { range: "07:17 – 07:50 Uhr", commits: 2 },
      { range: "10:32 – 14:50 Uhr", commits: 11 },
      { range: "17:27 – 18:21 Uhr", commits: 3 },
      { range: "22:02 – 03:10 Uhr (20.8.)", commits: 18 },
    ],
    methodologyHeading: "Methodik",
    methodologyBody: "Die Zeit ist aus den Zeitstempeln der Git-Commits geschätzt, nach dem gleichen Prinzip wie das verbreitete Werkzeug „git-hours\": Liegen zwei aufeinanderfolgende Commits weniger als zwei Stunden auseinander, zählt die tatsächliche Lücke als Arbeitszeit — schließlich passiert zwischen zwei Commits noch Schreiben, Testen und Nachdenken. Liegt die Lücke darüber, beginnt ein neuer Arbeitsblock, für den pauschal zwei Stunden angesetzt werden, da unklar ist, wie lange vor dem ersten Commit dieses Blocks schon gearbeitet wurde. Zusätzlich sind 1,5 Stunden für die Projektaufsetzung vor dem allerersten Commit eingerechnet (initiales Scaffolding von Backend, App und Dashboard, bevor überhaupt etwas versioniert wurde). Es ist eine Näherung, keine exakte Zeiterfassung.",
  },
};

const en: Translations = {
  nav: {
    overview: "Overview",
    guests: "Guests",
    pending: "Rate",
    team: "Team",
    messages: "Messages",
    settings: "Settings",
    addVenue: "Add Location",
    reviewVenues: "Review Locations",
    reviewApplications: "Applications",
    hiddenVenues: "Hidden venues",
    logout: "Log out",
    openMenu: "Open menu",
  },
  login: {
    heading: "Sign in",
    subtitle: "Club dashboard for team & management",
    email: "Email",
    password: "Password",
    submit: "Sign in",
    submitting: "Signing in…",
    forgotPassword: "Forgot password?",
    chooseVenue: "Choose a location",
    chooseVenueSubtitle: "This account manages multiple locations.",
    notVerified: "Not yet approved",
    back: "Back",
  },
  landing: {
    tagline: "Access that feels earned.",
    heroBody:
      "VELVET replaces the paper list and gut feeling at the door with a profile that grows over time: guests build a reputation that carries beyond a single club. Doormen see who they're dealing with the moment they scan. Operators protect their venue without starting from zero every night.",
    ctaLogin: "Sign in",
    ctaForTeam: "For team & management of participating locations",

    heroEyebrow: "Shared trust network for the door",
    heroCardVerified: "Verified at the door",
    heroCardLocations: "3 locations in the network",
    heroCardScore: "Score 4.7",

    principleEyebrow: "The idea",
    principleTitle: "One profile. Every door in the network knows it.",
    flowSteps: [
      { n: "01 · Profile", title: "Create an account", body: "Name, photo, one account — valid at every participating location, not just one." },
      { n: "02 · Entry", title: "Scan at the door", body: "The doorman scans the code and instantly sees photo, status, and history." },
      { n: "03 · Rating", title: "Rate briefly", body: "After the night: stars plus traits like \"Friendly\", \"On time\", or \"Caused trouble\"." },
      { n: "04 · Reputation", title: "Status travels with you", body: "The rating feeds into a global status — visible to every venue in the network." },
    ],

    howEyebrow: "How it works",
    howTitle: "Seen is faster than explained.",
    explainerTabs: [
      { tabLabel: "QR check-in", eyebrow: "At the door", title: "From code to check-in — live, not a mockup." },
      { tabLabel: "Premium match", eyebrow: "After the night", title: "Who else was out tonight?" },
      { tabLabel: "Team & locations", eyebrow: "For operators", title: "One login, multiple locations." },
      { tabLabel: "Trust score", eyebrow: "The status path", title: "Ratings become a status that travels with you." },
    ],
    demoLink: "See the full explanation →",

    guestsEyebrow: "01 · For guests",
    guestsTitle: "Your reputation opens the door — anywhere in the network.",
    guestsBody: "No explaining who you are. No waiting for something you've already earned.",
    guestsBenefits: [
      { title: "A code instead of long discussions —", body: "photo and status are visible instantly, entry is faster." },
      { title: "Status builds up across locations —", body: "good behavior at one club pays into your status everywhere else." },
      { title: "Honest behavior gets rewarded —", body: "higher status means shorter waits and access to the VIP area." },
    ],
    guestsWelcomeBack: "Welcome back",
    guestsGlobalStatus: "Global status",
    guestsBenefitText: "Guaranteed entry with no line and access to the VIP area at every participating location.",

    staffEyebrow: "02 · For doormen & security",
    staffTitle: "Context instead of gut feeling — the second you scan.",
    staffBody: "One look at the scanner tells you more than any guest list ever could.",
    staffBenefits: [
      { title: "Photo, status, and history in one scan —", body: "from other venues in the network too, not just your own location." },
      { title: "No more discussions at the door —", body: "the decision rests on documented history, not a piece of paper." },
      { title: "Trouble is visible immediately —", body: "incidents like conflict or heavy intoxication are recorded before they repeat." },
    ],
    staffScanDetected: "Scan detected",
    staffVisitsSuffix: "visits",
    staffLocationsLabel: "Locations",
    staffLocationsValue: "3 in the network",
    staffLastVisitLabel: "Last seen",
    staffLocalStatusLabel: "Local status",
    staffLocalStatusValue: "VIP here",
    staffTraitsLabel: "Traits",
    staffTraitsValue: "Friendly, On time",
    staffNoIncidents: "No incidents on record in the network",

    ownersEyebrow: "03 · For venue owners & management",
    ownersTitle: "A network protects every venue in it.",
    ownersBody: "Less friction at the door means fewer escalations — and more predictable nights.",
    ownersBenefits: [
      { title: "Guest list, ratings, and team at a glance —", body: "in the dashboard, no more paperwork between shifts." },
      { title: "Venues benefit from each other —", body: "a guest banned at one location is visible network-wide before they reach another door." },
      { title: "Regulars don't have to prove themselves again —", body: "earned trust carries over wherever the guest goes." },
    ],
    ownersRecentCheckins: "Recently checked in",
    ownersColGuest: "Guest",
    ownersColStatus: "Status",
    ownersColScore: "Score",

    statusEyebrow: "The status path",
    statusTitle: "Five tiers, valid network-wide.",
    statusBody: "Status is built from the ratings collected across every participating location — not from a single night.",
    tierPath: [
      { tier: "VIP", body: "Guaranteed entry, VIP area. Consistently great ratings across multiple locations." },
      { tier: "TRUSTED", body: "Priority entry. Reliably good impression, recognized as a regular." },
      { tier: "STANDARD", body: "Regular entry. The starting point for every new profile." },
      { tier: "WATCH", body: "Extra scrutiny. Entry is at the door's discretion." },
      { tier: "BANNED", body: "Network-wide ban. A ban at one location is visible at every door in the network." },
    ],

    downloadEyebrow: "Guest app",
    downloadTitle: "Get VELVET on your phone",
    downloadBody:
      "Your status, your QR code at the door, your locations — pick where you'd like to get the app.",
    downloadSources: {
      ios: { title: "App Store", body: "For iPhone and iPad." },
      android: { title: "Google Play", body: "For Android devices." },
      apk: { title: "APK on request", body: "Without the Play Store — drop us a line and we'll send you the file." },
      web: { title: "Open in the browser", body: "No install needed, works on any phone." },
    },
    closingEyebrow: "VELVET",
    closingTitle: "A door that remembers.",

    footerTagline: "VELVET — Shared trust network for the door",
    footerImpressum: "Legal notice",
    footerDatenschutz: "Privacy",
    footerWerbematerial: "Promo material",
    footerAgb: "Terms",
    footerWiderruf: "Withdrawal",
    footerLocationTerms: "Terms for locations",
    footerApply: "Register a location",
  },
  venueTypes: {
    CLUB: "Club",
    BAR: "Bar",
    PUB: "Pub",
    OTHER: "Other",
  },
  tiers: {
    VIP: "VIP",
    TRUSTED: "Trusted",
    STANDARD: "Standard",
    WATCH: "Watch",
    BANNED: "Banned",
  },
  explainers: {
    qrCheckin: {
      accessCodeLabel: "Your access code",
      scanningLabel: "Scanning code…",
      checkedInLabel: "Checked in",
      readyToScan: "Ready to scan",
      scanningStaffLabel: "Scanning…",
      entryGranted: "Entry granted",
      captionShow: "Guest **shows their code** — as a QR code or 6-digit number.",
      captionScan: "Doorman **scans it or types it in** — both work.",
      captionAppear: "Profile appears **instantly** — including status and history.",
    },
    premiumMatch: {
      checkedInTag: "Checked in",
      matchesQuestion: "Who else was out tonight?",
      chatMsgOut: "Hey, great night yesterday!",
      chatMsgIn: "Absolutely 🙌",
      captionSameNight: "Two guests, **the same night**, the same venue.",
      captionPremiumShows: "Premium shows: **\"Who else was out tonight?\"**",
      captionRealMatches: "Messaging — **only for real matches**, no strangers.",
    },
    multiVenue: {
      navOverview: "Overview",
      navAddVenue: "Add location",
      statGuests: "Guests",
      statAvgScore: "Score",
      formButtonCreate: "Create location",
      captionOneLogin: "**One login**, multiple locations — each with its own numbers.",
      captionSwitch: "**Switch** locations without logging in again.",
      captionCreateOwn: "**Create a new location yourself** — it goes live only after review.",
    },
    trustScore: {
      rateLabel: "Submit a rating",
      tagFriendly: "Friendly",
      tagPunctual: "On time",
      submitButton: "Submit",
      processingLabel: "Processing…",
      rateCapturedLabel: "Rating recorded",
      statusUpdatingLabel: "Updating status…",
      networkWideValidLabel: "Valid network-wide",
      captionStars: "After the visit: **stars plus traits** — 10 seconds.",
      captionGlobalStatus: "Feeds into the **global status** — not just this one night.",
      captionTravels: "Status **travels with you** — valid at every door in the network.",
    },
  },
  common: {
    genericError: "Connection failed",
    loading: "Loading…",
    showPassword: "Show password",
    hidePassword: "Hide password",
  },
  languagePage: {
    title: "Choose language",
    subtitle: "Choose the language for VELVET.",
  },
  authFlow: {
    backToLogin: "Sign in",
    forgotPasswordSubtitle: "Reset your password",
    emailSentTitle: "Email on its way",
    emailSentBody: "If an account with this email address exists, we've sent you a reset link. Check your spam folder too.",
    forgotPasswordTitle: "Forgot your password?",
    forgotPasswordBody: "Enter your email address and we'll send you a reset link.",
    sending: "Sending…",
    sendLink: "Send link",

    resetPasswordSubtitle: "New password",
    invalidLink: "Invalid link. Request a new reset link.",
    passwordChangedTitle: "Password changed",
    passwordChangedBody: "You can now sign in with your new password.",
    goToLogin: "Go to sign in",
    setNewPasswordTitle: "Set a new password",
    newPasswordPlaceholder: "New password (min. 8 characters)",
    confirmPasswordPlaceholder: "Confirm password",
    passwordsDontMatch: "Passwords don't match",
    saving: "Saving…",
    savePassword: "Save password",

    verifyEmailSubtitle: "Confirm email address",
    verifying: "Confirming your email address…",
    emailVerifiedTitle: "Email confirmed",
    emailVerifiedBody: "Your account is now active. You can sign in to the VELVET app.",
    invalidVerifyLink: "Invalid link. Request a new confirmation email in the app.",
  },
  pages: {
    overview: {
      welcomeBack: "Welcome back",
      recentCheckins: "Recent check-ins",
      rateAll: "Rate all →",
      nothingPending: "Nothing pending right now.",
    },
    guests: {
      title: "Guests",
      subtitle: "All guests who have visited this venue before.",
      searchPlaceholder: "Search by name or email…",
      colGuest: "Guest",
      colGlobalStatus: "Global status",
      colVisits: "Visits",
      colHere: "Here",
      colLastVisit: "Last visit",
      flagVip: "VIP here",
      flagBanned: "Banned",
      noneFound: "No guests found.",
    },
    pending: {
      title: "Rate",
      subtitle: "Guests from the last 6 hours who haven't been rated yet.",
      nothingPending: "Nothing pending right now.",
      stars: "Stars",
      tags: "Tags",
      noteLabel: "Note (only visible to this venue)",
      notePlaceholder: "Optional…",
      statusHere: "Status here",
      flagNone: "No change",
      flagVip: "On VIP list (this venue)",
      flagBanned: "Banned (this venue)",
      missingStars: "Please choose a star rating",
      saveFailed: "Rating failed",
      saving: "Saving…",
      save: "Save rating",
    },
    team: {
      title: "Team",
      subtitle: "Door staff and managers for {venue}.",
      managerOnly: "Only managers can manage the team.",
      colName: "Name",
      colEmail: "Email",
      colRole: "Role",
      roleManager: "Manager",
      roleDoorman: "Door staff",
      roleService: "Service staff",
      newMember: "New team member",
      namePlaceholder: "Name",
      emailPlaceholder: "Email",
      passwordPlaceholder: "Password (min. 8 characters)",
      createFailed: "Failed to create",
      creating: "Creating…",
      create: "Create",
    },
    settings: {
      title: "Settings",
      subtitle: "Details about your location.",
      loadFailed: "Location could not be loaded",
      saveFailed: "Save failed",
      name: "Name",
      address: "Address",
      logoUrl: "Logo URL (optional)",
      loggedInAs: "Signed in as",
      saved: "Saved.",
      saving: "Saving…",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
    },
    venuesNew: {
      title: "Add location",
      subtitle: "Add a new location to your account. You'll automatically be set as its manager.",
      namePlaceholder: "Location name",
      addressPlaceholder: "Address",
      createFailed: "Failed to create",
      creating: "Creating…",
      create: "Create location",
      createdHeading: "“{name}” created",
      createdBody:
        "This location isn't approved yet. QR check-in and ratings won't work until VELVET manually verifies it. You can already set up its address and team.",
      switchFailed: "Switch failed",
      switching: "Switching…",
      switchTo: "Switch to this location",
    },
    messages: {
      title: "Messages",
      subtitle: "Message VIP or Premium guests of this venue, e.g. to invite them.",
      managerOnly: "Only managers can message guests.",
      conversations: "Conversations",
      noConversations: "No conversations yet.",
      writeToGuests: "Message guests",
      noMoreGuests: "No more VIP/Premium guests.",
      premiumBadge: "Premium",
      noMessages: "No messages yet — write the first one.",
      messagePlaceholder: "Write a message…",
      sendAriaLabel: "Send",
      selectConversation: "Select a conversation or guest on the left.",
      loadHistoryFailed: "Couldn't load history",
      sendFailed: "Couldn't send message",
    },
    venueApplication: {
      eyebrow: "For locations",
      title: "Register your location with VELVET",
      intro:
        "Club, bar or pub — tell us about your location here. We review every application by hand and approve you once everything checks out.",
      verifyTitle: "Why we ask for a business registration",
      verifyBody:
        "VELVET locations see guest profiles and hand out ratings, so we only approve real businesses. Your business registration is how we verify that. It is reviewed internally and never published.",
      sectionVenue: "Your location",
      sectionContact: "Contact person",
      sectionDocument: "Proof",
      venueName: "Location name",
      venueType: "Type of location",
      address: "Address",
      website: "Website or Instagram (optional)",
      contactName: "First and last name",
      contactEmail: "Email address",
      contactPhone: "Phone (optional)",
      message: "A few words about your location (optional)",
      documentHint: "Business registration as PDF, JPEG or PNG — 10 MB max.",
      documentChoose: "Choose file",
      documentNone: "No file selected",
      privacyHint:
        "By submitting you agree that we store your details for review. See the privacy policy for details.",
      submit: "Send application",
      submitting: "Sending…",
      submitFailed: "Failed to send",
      successTitle: "Thanks — we've got your application",
      successBody:
        "We'll review your details and your business registration and get back to you by email. If everything checks out, you'll get a link to set your password.",
      backHome: "Back to the homepage",
    },
    adminApplications: {
      title: "Applications",
      subtitle: "Review self-service sign-ups: open the business registration, then create the location or reject it.",
      adminOnly: "Platform admins only.",
      loadFailed: "Failed to load",
      pendingHeading: "Awaiting review",
      decidedHeading: "Already decided",
      nothingPending: "Nothing to review.",
      contactLabel: "Contact",
      websiteLabel: "Web",
      messageLabel: "Message",
      documentLabel: "Business registration",
      documentDeleted: "Document deleted after the 6-month retention period",
      openDocument: "Open document",
      opening: "Opening…",
      openFailed: "Could not open the document",
      approve: "Approve",
      approving: "Approving…",
      approveFailed: "Failed to approve",
      approveHint: "Creates the location and emails the contact a link to set their password.",
      reject: "Reject",
      rejecting: "Rejecting…",
      rejectFailed: "Failed to reject",
      rejectReason: "Reason for the rejection (this is emailed out)",
      rejectConfirm: "Send rejection",
      cancel: "Cancel",
      statusApproved: "Approved",
      statusRejected: "Rejected",
      reviewNoteLabel: "Note",
    },
    adminVenues: {
      title: "Review locations",
      subtitle: "Approve self-service locations before QR check-in and ratings work there.",
      adminOnly: "Platform admins only.",
      pendingHeading: "Awaiting approval",
      verifiedHeading: "Already approved",
      suspendedHeading: "Suspended",
      verifying: "Approving…",
      verify: "Approve",
      loadFailed: "Failed to load",
      verifyFailed: "Failed to approve",
      suspend: "Suspend",
      suspendReasonPlaceholder: "Reason for suspension",
      suspendConfirm: "Confirm suspension",
      suspending: "Suspending…",
      suspendFailed: "Failed to suspend",
      cancel: "Cancel",
      reactivate: "Reactivate",
      reactivating: "Reactivating…",
      reactivateFailed: "Failed to reactivate",
      suspendedSinceLabel: "Suspended since",
      suspendedReasonLabel: "Reason",
    },
    adminHiddenVenues: {
      title: "Hidden venues",
      subtitle: "A guest can permanently remove a venue from their own history. Undoing that only happens here, via an exact email lookup.",
      adminOnly: "Platform admins only.",
      emailPlaceholder: "Guest's email address",
      search: "Search",
      searching: "Searching…",
      searchFailed: "Search failed",
      nothingHidden: "This guest doesn't currently have any venue hidden.",
      hiddenSinceLabel: "Hidden since",
      unhide: "Unhide",
      unhiding: "Unhiding…",
      unhideFailed: "Failed to unhide",
    },
    werbematerial: {
      eyebrow: "For venue operators",
      title: "Promo material for your venue",
      intro: "To print and display on-site — every item links via QR code straight to VELVET, so your guests can join without detours.",
      downloads: [
        {
          title: "Flyer v1",
          format: "A5 · PDF",
          description: "To lay out at the bar or on tables — with a QR code that leads straight to VELVET.",
          thumb: "/material/thumb-flyer.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5.pdf",
        },
        {
          title: "Flyer v2",
          format: "A5 · PDF",
          description: "Asymmetric layout with the monogram as a large-scale watermark that bleeds off the edge.",
          thumb: "/material/thumb-flyer-a5-v2.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5-v2.pdf",
        },
        {
          title: "Poster v1",
          format: "A4 · PDF",
          description: "For the entrance, bar, or coat check — large QR code, readable even from a distance.",
          thumb: "/material/thumb-poster.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-aufsteller-a4.pdf",
        },
        {
          title: "Poster v2",
          format: "A4 · PDF",
          description: "Two-tone panel in dark and gold — bolder contrast for the entrance and bar.",
          thumb: "/material/thumb-flyer-a4-v2.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-flyer-a4-v2.pdf",
        },
        {
          title: "Business card v1",
          format: "85×55 mm · PDF, 2 pages",
          description: "To hand out at the door — from doormen straight to guests. Brand on the front, scan QR on the back.",
          thumb: "/material/thumb-visitenkarte.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte.pdf",
        },
        {
          title: "Business card v2",
          format: "85×55 mm · PDF, 2 pages",
          description: "Reversed color scheme: dark monogram on the front, rich gold background with QR code on the back.",
          thumb: "/material/thumb-visitenkarte-v2.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte-v2.pdf",
        },
        {
          title: "Logo (profile picture)",
          format: "1024×1024 · PNG",
          description: "Monogram on a dark background — usable directly as a profile picture, e.g. for social media.",
          thumb: "/material/velvet-logo.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo.png",
        },
        {
          title: "Logo (cutout)",
          format: "1024×1024 · PNG, transparent",
          description: "Same monogram with a transparent background — for placing on your own material.",
          thumb: "/material/velvet-logo-transparent.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo-transparent.png",
        },
      ],
      previewAlt: "Preview",
      downloadButton: "Download",
      guestInfoHeading: "An info page for your guests",
      guestInfoBody:
        "A page in plain language: how VELVET works, what is stored and who sees it. Made to be passed on — as a link, a QR code at the door or a printout. It is deliberately not findable through search engines.",
      guestInfoButton: "View the page",
      stickerHeading: "Stickers & custom merch",
      stickerBody1: "Beyond the PDFs, we can also produce and ship **stickers** and **print-on-demand items** for your venue (e.g. table stands, coat check tags, merch combining your logo with VELVET).",
      stickerBody2: "Just reach out, no formal request needed, and we'll discuss format, quantity, and design.",
      contactButton: "Contact mail@velvet-network.app",
    },
  },
  mobile: {
    welcome: {
      continueAsGuest: "Continue as guest",
      staffLogin: "Staff login",
      impressum: "Imprint",
      datenschutz: "Privacy",
      agb: "Terms",
      widerruf: "Withdrawal",
    },
    guestLogin: {
      welcomeBack: "Welcome back",
      createAccount: "Create account",
      loginHint: "Sign in with your guest account.",
      registerHint: "Register as a guest.",
      firstName: "First name",
      lastName: "Last name",
      dateOfBirth: "Date of birth (DD.MM.YYYY)",
      dateOfBirthHint: "We only use this to check that you are of age — venues never see your date of birth.",
      dateOfBirthInvalid: "Please enter your date of birth as DD.MM.YYYY.",
      dateOfBirthUnderage: "VELVET is for ages 18 and up. No account can be created with this date of birth.",
      email: "Email",
      password: "Password",
      submitLogin: "Sign in",
      submitRegister: "Register",
      registerSuccess:
        "Almost there! We've sent you an email — confirm your address via the link inside, then you can sign in.",
      switchToRegister: "No account yet? Register now",
      switchToLogin: "Already registered? Sign in",
      forgotPassword: "Forgot password?",
      resendVerification: "Resend confirmation email",
      resending: "Sending…",
      verificationResent: "Confirmation email has been resent.",
    },
    staffLogin: {
      heading: "Staff access",
      subtitle: "For door staff and managers of participating venues.",
      email: "Email",
      password: "Password",
      submit: "Sign in",
      forgotPassword: "Forgot password?",
      chooseVenue: "Choose a location",
      chooseVenueSubtitle: "This account manages multiple locations.",
      notVerified: "Not yet approved",
      back: "Back",
    },
    invite: {
      shareTitle: "Invite friends",
      shareSubtitle: "Share your code — whoever uses it needs your approval before you can chat.",
      yourCode: "Your code",
      share: "Share link",
      rotate: "Generate new code",
      rotating: "Generating…",
      rotateConfirmTitle: "Generate a new code?",
      rotateConfirmBody: "The old code will stop working. Existing connections stay intact.",
      rotateConfirmButton: "Generate",
      cancel: "Cancel",
      enterCode: "Enter a code",
      enterCodePlaceholder: "Code or link…",
      requests: "Requests",
      loadFailed: "Could not be loaded",
      preview: {
        sendRequest: "Send request",
        sending: "Sending…",
        requestSent: "Request sent",
        alreadyConnected: "You're already connected",
        back: "Back",
      },
      requestsScreen: {
        title: "Incoming requests",
        noRequests: "No open requests.",
        accept: "Accept",
        decline: "Decline",
      },
    },
    tabBar: {
      profile: "Profile",
      entry: "Entry",
      locations: "Locations",
      messages: "Messages",
      scanner: "Scanner",
      rate: "Rate",
    },
    home: {
      welcomeBack: "Welcome back",
      choosePhotoLibrary: "Choose from library",
      takePhoto: "Take a photo",
      uploading: "Uploading…",
      photoAccessDenied: "Access not granted",
      uploadFailed: "Upload failed",
      yourStatus: "Your status",
      scoreLabel: "Score",
      tierPerks: {
        VIP: "Guaranteed entry with no line and access to the VIP area at every participating location.",
        TRUSTED: "Priority entry and good odds of getting in even on full nights.",
        STANDARD: "Regular entry under the usual conditions of the respective venue.",
        WATCH: "Entry is at the doorman's discretion — earn positive ratings to improve your status.",
        BANNED: "Access is currently restricted. Contact the venue directly with questions.",
      },
      qrEntryButton: "Show QR code for entry",
      premiumTitle: "Premium",
      premiumTeaser: "Message guests you were out with, to meet up.",
      logout: "Sign out",
      deleteAccount: "Delete account",
      deletingAccount: "Deleting…",
      deleteConfirmTitle: "Delete account",
      deleteConfirmBody: "Your profile, photo, and global status will be deleted irrevocably. This cannot be undone.",
      deleteConfirmCancel: "Cancel",
      deleteErrorTitle: "Error",
      deleteErrorBody: "Couldn't delete your account. Please try again.",
    },
    qr: {
      showAtDoor: "Show at the door",
      photoMissingTitle: "Profile photo missing",
      photoMissingBody: "You need a profile photo for the entry code, so the team can recognize you at the scanner.",
      addPhotoButton: "Add photo",
      accessCodeTitle: "Your access code",
      manualFallback: "Scan not working? Have it typed in:",
      loadFailed: "Couldn't load code",
      expiresIn: "Code expires in {s}s · refreshes automatically",
    },
    venues: {
      alreadyVisited: "Already visited",
      title: "Your locations",
      searchPlaceholder: "Search…",
      emptyNoVisits: "No locations visited yet. As soon as you're scanned for the first time, it'll show up here.",
      emptyNoResults: "No location found.",
      visitsSingular: "visit",
      visitsPlural: "visits",
      flagVip: "VIP here",
      flagBanned: "Banned",
      hide: "Hide",
      hideConfirmTitle: "Hide this location for good?",
      hideConfirmBody:
        "It disappears from your history, and nobody can find you through it in Premium contacts. You cannot undo this in the app — only support can bring it back.\n\nRatings from there still count towards your status, and the location keeps its own records.",
      hideConfirmAction: "Hide permanently",
      hideCancel: "Cancel",
      hideFailed: "Could not hide it",
    },
    staffScanner: {
      scanFailed: "Scan failed",
      atVenue: "At",
      visitsHere: "visit(s) here",
      onVipList: "On this venue's VIP list",
      bannedHere: "Banned here",
      noteLabel: "Note",
      rateButton: "Rate",
      continueScanning: "Keep scanning",
      entryScanner: "Entry scanner",
      scanTitle: "Scan QR code",
      allowCamera: "Allow camera access",
      checkingCode: "Checking code…",
      manualFallback: "Scan not working? Type in the code:",
      codePlaceholder: "6-digit code",
      checkButton: "Check",
      logoutLabel: "Sign out",
    },
    staffPending: {
      recentEntries: "Recent entries",
      title: "Still to rate",
      empty: "Nothing pending right now — every guest has been rated.",
    },
    staffRate: {
      rateGuest: "Rate guest",
      starsLabel: "Stars",
      traitsLabel: "Traits",
      noteLabel: "Note (visible only to this venue)",
      notePlaceholder: "Optional…",
      statusHereLabel: "Status with us",
      flagNone: "No change",
      flagVip: "On VIP list (this venue)",
      flagBanned: "Banned (this venue)",
      missingStars: "Please pick a star rating",
      saveFailed: "Failed to submit rating",
      save: "Save rating",
    },
    messagesHome: {
      title: "Messages",
      premiumUpsellBody: "With Premium you can message guests you were at the same venue with on the same night.",
      discoverPremium: "Discover Premium",
      whoWasThereTonight: "Who else was out tonight?",
      noMatches: "No matches yet.",
    },
    messageThread: {
      back: "Back",
      report: "Report",
      block: "Block",
      blockConfirmTitle: "Block this user?",
      blockConfirmBody: "You won't be able to message each other afterward.",
      cancel: "Cancel",
      reportConfirmTitle: "Report this message?",
      reportConfirmBody: "We'll review the reported content.",
      reportThanksTitle: "Thanks",
      reportThanksBody: "The message has been reported.",
      reportReason: "Inappropriate content",
      noMessages: "No messages yet.",
      messagePlaceholder: "Message…",
      send: "Send",
      sendFailed: "Couldn't send message",
    },
    premium: {
      back: "Back",
      title: "Premium",
      subtitle: "Unlock private messages to meet up with other Premium guests you were at the same venue with on the same night.",
      activeSubscription: "Active subscription",
      providerGranted: "Granted",
      monthly: "Monthly",
      yearly: "Yearly",
      expiresOn: "Expires on",
      renewsOn: "Renews on",
      cancelButton: "Cancel",
      saveBadge: "Save 33%",
      subscribeWithStripe: "Subscribe with Stripe",
      subscribeWithPaypal: "Subscribe with PayPal",
      paymentNote: "Payment happens on a secure Stripe or PayPal checkout page in your browser. VELVET doesn't store any payment data.",
      statusLoadFailed: "Couldn't load status",
      checkoutFailed: "Couldn't start checkout",
      cancelFailed: "Failed to cancel",
      withdrawalConsentHeading: "Immediate start & right of withdrawal",
      withdrawalReadMore: "Read the withdrawal policy",
      withdrawalConsentRequired: "Please confirm the immediate start to complete the subscription.",
      features: [
        {
          icon: "✉",
          title: "Private messages",
          body: "Message guests you were out with, to meet up.",
        },
        {
          icon: "✓",
          title: "Safe & verified",
          body: "Only possible with people who provably checked in at the same venue on the same night — no requests from strangers.",
        },
      ],
    },
    premiumSuccess: {
      title: "Welcome to Premium",
      body: "Your subscription is active. It may take a moment for your payment provider's confirmation to arrive — reload your profile if the status hasn't updated yet.",
      button: "Go to Premium",
    },
    premiumCancel: {
      title: "No problem",
      body: "The purchase was canceled. Nothing was charged.",
      button: "Back to Premium",
    },
  },
  ratingTags: {
    friendly: "Friendly",
    punctual: "On time",
    big_spender: "Big spender",
    well_dressed: "Well dressed",
    trouble: "Caused trouble",
    too_intoxicated: "Too intoxicated",
  },
  demo: {
    eyebrow: "In action",
    title: "How VELVET works.",
    intro: "No mockups, no marketing fluff — see every flow exactly as it happens in the real app, with what's running in the background right below it.",
    sections: [
      {
        key: "qr-checkin",
        eyebrow: "At the door",
        title: "The QR check-in",
        subtitle: "From access code to recognized guest — in under a second.",
        steps: [
          {
            n: "01",
            title: "The code appears",
            body: "In their profile, the guest taps \"Show QR code for entry\". Two versions of the same access appear: a QR code to scan and a 6-digit number to read out. Both are valid for 90 seconds and then refresh automatically — nobody has to frantically keep the app open.",
          },
          {
            n: "02",
            title: "The doorman reads it",
            body: "At the door, the team opens the scanner — in the app or on the web, e.g. on a tablet or kiosk terminal. If the scan doesn't work (bad lighting, a packed door, a stubborn camera), typing in the 6 digits manually is enough. Both lead to the same result, on any platform.",
          },
          {
            n: "03",
            title: "The profile appears instantly",
            body: "Photo, name, global status (VIP, Trusted, Standard, Watch, Banned), and the visit history at this venue are shown right away — including notes like \"on the VIP list\" or \"banned\", if any are on file.",
          },
          {
            n: "04",
            title: "Valid once, then done",
            body: "Every code only works once. Once an entry is recorded, it's immediately spent — a second scan with the same code fails. That way a screenshot can't be reused multiple times or by someone else.",
          },
        ],
      },
      {
        key: "premium-match",
        eyebrow: "After the night",
        title: "Premium Match",
        subtitle: "Only message people you were actually out with.",
        steps: [
          {
            n: "01",
            title: "A shared check-in",
            body: "Two guests check in via QR code at the same venue on the same night. That alone is enough — no mutual request or connection beforehand is needed.",
          },
          {
            n: "02",
            title: "The match appears automatically",
            body: "With an active Premium membership, the \"Messages\" area shows, under \"Who else was out tonight?\", every guest with a shared, verified check-in — by name, with photo and venue.",
          },
          {
            n: "03",
            title: "Messaging, not browsing",
            body: "Messages are only possible between real matches — there's no open guest list to browse and no requests from strangers who never checked in at the same door.",
          },
          {
            n: "04",
            title: "Premium only",
            body: "The feature is part of the optional, paid Premium membership for guests (monthly or yearly) — VELVET itself stays free to use for guests and venues.",
          },
        ],
      },
      {
        key: "multi-venue",
        eyebrow: "For operators",
        title: "Multiple locations, one login",
        subtitle: "For brands with more than one venue — without multiple accounts.",
        steps: [
          {
            n: "01",
            title: "One account, multiple locations",
            body: "If a team runs several venues, they're all tied to a single login. When signing in with access to multiple locations, you're briefly asked which one to work with.",
          },
          {
            n: "02",
            title: "Switch anytime",
            body: "A switcher in the sidebar lets you change the active location at any time without signing in again — the guest list, team, and numbers update to the selected location.",
          },
          {
            n: "03",
            title: "Create a new location yourself",
            body: "An existing team member can create another location directly in the dashboard — name and address are enough, and the account is automatically entered as that new location's manager.",
          },
          {
            n: "04",
            title: "Reviewed first, then live",
            body: "A newly created location is completely locked at first: no QR check-in, no ratings, not visible in the public location list. It only unlocks after manual review — so nobody can quietly attach a fake location to the network.",
          },
        ],
      },
      {
        key: "trust-score",
        eyebrow: "The status path",
        title: "From a star rating to a status",
        subtitle: "How individual ratings become a network-wide reputation.",
        steps: [
          {
            n: "01",
            title: "Rate briefly",
            body: "After a recorded entry, the team can submit a rating within a few hours: stars (1–5) plus optional traits like \"Friendly\", \"On time\", or \"Caused trouble\" — the whole thing takes about 10 seconds.",
          },
          {
            n: "02",
            title: "Feeds into the global status",
            body: "The rating doesn't just count for that one night at that one venue — it feeds into the guest's cross-venue, global status, together with every previous rating from every participating location.",
          },
          {
            n: "03",
            title: "Five tiers, valid network-wide",
            body: "The collected average results in one of five tiers: Banned, Watch, Standard, Trusted, or VIP. Every tier is instantly visible at every door in the network, not just where it was earned.",
          },
          {
            n: "04",
            title: "Earned trust carries over",
            body: "A guest doesn't have to prove themselves again at a new location — a good reputation travels with them. Conversely, a ban at one location is just as visible network-wide before the guest reaches another door.",
          },
        ],
      },
    ],
  },
  legal: {
    back: "Back",
    kontoLoeschen: {
      title: "Delete account",
      sections: [
        {
          heading: "Deleting in the app",
          paragraphs: [
            "Open the VELVET app and sign in with your guest account.",
            "In the profile area, tap \"Delete account\" at the bottom and confirm the notice.",
            "Your account is then deleted immediately and irreversibly, and you're signed out automatically.",
          ],
        },
        {
          heading: "Deleting without the app installed",
          paragraphs: [
            "If you no longer have the app installed, email us at mail@velvet-network.app from the address your account is registered with, subject \"Delete account\".",
            "We'll delete your account manually within a few days and confirm it by email.",
          ],
        },
        {
          heading: "What gets deleted",
          paragraphs: [
            "Your profile (name, email address, profile photo).",
            "Your global status and all ratings tied to your account.",
            "Your entry history (time and location of past scans) and all venue relationships (visits, local notes).",
            "Deletion is final and applies to every location in the network, not just one.",
          ],
        },
        {
          heading: "Note for doorman and manager accounts",
          paragraphs: [
            "Staff accounts (doormen, managers) aren't self-managed by guests — they're created by the respective venue. To delete a staff account, please contact your venue's management or mail@velvet-network.app.",
          ],
        },
      ],
    },
  },
  makingOf: {
    eyebrow: "Making Of",
    title: "How much time is in VELVET?",
    intro: "The backend, mobile app, and dashboard were all built in a single day — as a reference for how fast a complete, production-ready platform can come together with AI-assisted development.",
    devTimeLabel: "Estimated active development time",
    devTimeValue: "~22.4 hrs",
    devTimeRange: "from August 19 to 20, 2026, until 3:10 AM",
    commitsLabel: "Commits",
    subsystemsLabel: "Subsystems",
    workBlocksHeading: "Work sessions",
    commitSingular: "commit",
    commitPlural: "commits",
    sessions: [
      { range: "before 1:16 AM (Aug 19)", commits: 0, note: "Project setup, estimated" },
      { range: "1:16 – 1:19 AM", commits: 2 },
      { range: "7:17 – 7:50 AM", commits: 2 },
      { range: "10:32 AM – 2:50 PM", commits: 11 },
      { range: "5:27 – 6:21 PM", commits: 3 },
      { range: "10:02 PM – 3:10 AM (Aug 20)", commits: 18 },
    ],
    methodologyHeading: "Methodology",
    methodologyBody: "The time is estimated from git commit timestamps, using the same principle as the popular \"git-hours\" tool: if two consecutive commits are less than two hours apart, the actual gap counts as work time — after all, writing, testing, and thinking happen between commits too. If the gap is larger, a new work session begins, flatly counted as two hours, since it's unclear how long was spent working before that session's first commit. An additional 1.5 hours is counted for project setup before the very first commit (initial scaffolding of the backend, app, and dashboard, before anything was version-controlled yet). It's an approximation, not exact time tracking.",
  },
};

const pl: Translations = {
  nav: {
    overview: "Przegląd",
    guests: "Goście",
    pending: "Oceń",
    team: "Zespół",
    messages: "Wiadomości",
    settings: "Ustawienia",
    addVenue: "Dodaj lokal",
    reviewVenues: "Sprawdź lokale",
    reviewApplications: "Zgłoszenia",
    hiddenVenues: "Ukryte lokale",
    logout: "Wyloguj",
    openMenu: "Otwórz menu",
  },
  login: {
    heading: "Zaloguj się",
    subtitle: "Panel klubowy dla zespołu i kierownictwa",
    email: "E-mail",
    password: "Hasło",
    submit: "Zaloguj się",
    submitting: "Logowanie…",
    forgotPassword: "Nie pamiętasz hasła?",
    chooseVenue: "Wybierz lokal",
    chooseVenueSubtitle: "To konto zarządza kilkoma lokalami.",
    notVerified: "Niezatwierdzony",
    back: "Wstecz",
  },
  landing: {
    tagline: "Dostęp, na który się zasłużyło.",
    heroBody:
      "VELVET zastępuje papierową listę i przeczucie przy wejściu profilem, który rośnie razem z gościem: goście budują reputację wykraczającą poza jeden klub. Ochrona od razu widzi przy skanowaniu, z kim ma do czynienia. Właściciele chronią swój lokal, nie zaczynając każdego wieczoru od zera.",
    ctaLogin: "Zaloguj się",
    ctaForTeam: "Dla zespołu i kierownictwa uczestniczących lokali",

    heroEyebrow: "Wspólna sieć zaufania dla wejścia",
    heroCardVerified: "Zweryfikowano przy wejściu",
    heroCardLocations: "3 lokale w sieci",
    heroCardScore: "Wynik 4.7",

    principleEyebrow: "Zasada",
    principleTitle: "Jeden profil. Zna go każde wejście w sieci.",
    flowSteps: [
      { n: "01 · Profil", title: "Załóż konto", body: "Imię, zdjęcie, jedno konto — ważne we wszystkich uczestniczących lokalach, nie tylko w jednym." },
      { n: "02 · Wejście", title: "Skanowanie przy wejściu", body: "Ochroniarz skanuje kod i od razu widzi zdjęcie, status i historię." },
      { n: "03 · Ocena", title: "Krótka ocena", body: "Po wieczorze: gwiazdki plus cechy typu „Miły”, „Punktualny” lub „Sprawiał kłopoty”." },
      { n: "04 · Reputacja", title: "Status podróżuje z tobą", body: "Ocena wpływa na globalny status — widoczny dla każdego lokalu w sieci." },
    ],

    howEyebrow: "Jak to działa",
    howTitle: "Widać to szybciej, niż da się wytłumaczyć.",
    explainerTabs: [
      { tabLabel: "Check-in QR", eyebrow: "Przy wejściu", title: "Od kodu do check-inu — na żywo, nie makieta." },
      { tabLabel: "Premium Match", eyebrow: "Po wieczorze", title: "Kto jeszcze wyszedł dziś wieczorem?" },
      { tabLabel: "Zespół i lokale", eyebrow: "Dla operatorów", title: "Jedno logowanie, wiele lokali." },
      { tabLabel: "Wynik zaufania", eyebrow: "Ścieżka statusu", title: "Oceny stają się statusem, który podróżuje z tobą." },
    ],
    demoLink: "Zobacz pełne wyjaśnienie →",

    guestsEyebrow: "01 · Dla gości",
    guestsTitle: "Twoja reputacja otwiera drzwi — w całej sieci.",
    guestsBody: "Bez tłumaczenia, kim jesteś. Bez czekania na coś, na co już zasłużyłeś.",
    guestsBenefits: [
      { title: "Kod zamiast długich dyskusji —", body: "zdjęcie i status widoczne od razu, wejście jest szybsze." },
      { title: "Status buduje się w całej sieci —", body: "dobre zachowanie w jednym klubie podnosi status wszędzie indziej." },
      { title: "Uczciwe zachowanie się opłaca —", body: "wyższy status oznacza krótsze oczekiwanie i dostęp do strefy VIP." },
    ],
    guestsWelcomeBack: "Witaj z powrotem",
    guestsGlobalStatus: "Status globalny",
    guestsBenefitText: "Gwarantowane wejście bez kolejki i dostęp do strefy VIP we wszystkich uczestniczących lokalach.",

    staffEyebrow: "02 · Dla ochrony",
    staffTitle: "Kontekst zamiast przeczucia — w sekundę skanowania.",
    staffBody: "Jedno spojrzenie na skaner mówi więcej niż jakakolwiek lista gości.",
    staffBenefits: [
      { title: "Zdjęcie, status i historia w jednym skanie —", body: "także z innych lokali w sieci, nie tylko z własnego." },
      { title: "Koniec dyskusji przy wejściu —", body: "decyzja opiera się na udokumentowanej historii, nie na kartce papieru." },
      { title: "Problemy widoczne od razu —", body: "incydenty jak awantury czy silne upojenie są odnotowywane, zanim się powtórzą." },
    ],
    staffScanDetected: "Wykryto skan",
    staffVisitsSuffix: "wizyt",
    staffLocationsLabel: "Lokale",
    staffLocationsValue: "3 w sieci",
    staffLastVisitLabel: "Ostatnio",
    staffLocalStatusLabel: "Status lokalny",
    staffLocalStatusValue: "VIP tutaj",
    staffTraitsLabel: "Cechy",
    staffTraitsValue: "Miły, Punktualny",
    staffNoIncidents: "Brak odnotowanych incydentów w sieci",

    ownersEyebrow: "03 · Dla właścicieli i zarządu",
    ownersTitle: "Sieć chroni każdy lokal, który do niej należy.",
    ownersBody: "Mniej tarć przy wejściu oznacza mniej eskalacji — i bardziej przewidywalne wieczory.",
    ownersBenefits: [
      { title: "Lista gości, oceny i zespół na pierwszy rzut oka —", body: "w panelu, bez papierkowej roboty między zmianami." },
      { title: "Lokale korzystają nawzajem na sobie —", body: "gość zablokowany w jednym miejscu jest widoczny w całej sieci, zanim dotrze do innych drzwi." },
      { title: "Stali goście nie muszą udowadniać tego od nowa —", body: "zdobyte zaufanie zostaje, gdziekolwiek gość się uda." },
    ],
    ownersRecentCheckins: "Ostatnio zameldowani",
    ownersColGuest: "Gość",
    ownersColStatus: "Status",
    ownersColScore: "Wynik",

    statusEyebrow: "Ścieżka statusu",
    statusTitle: "Pięć poziomów, ważnych w całej sieci.",
    statusBody: "Status wynika z ocen zebranych ze wszystkich uczestniczących lokali — nie z jednego wieczoru.",
    tierPath: [
      { tier: "VIP", body: "Gwarantowane wejście, strefa VIP. Konsekwentnie bardzo dobre oceny w wielu lokalach." },
      { tier: "TRUSTED", body: "Priorytetowe wejście. Niezmiennie dobre wrażenie, rozpoznawany jako stały gość." },
      { tier: "STANDARD", body: "Standardowe wejście. Punkt startowy dla każdego nowego profilu." },
      { tier: "WATCH", body: "Dokładniejsza obserwacja. Wejście zależy od decyzji ochrony." },
      { tier: "BANNED", body: "Blokada w całej sieci. Zakaz w jednym lokalu jest widoczny przy każdych drzwiach w sieci." },
    ],

    downloadEyebrow: "Aplikacja dla gości",
    downloadTitle: "VELVET na telefonie",
    downloadBody:
      "Twój status, kod QR przy wejściu, Twoje lokale — wybierz, skąd chcesz pobrać aplikację.",
    downloadSources: {
      ios: { title: "App Store", body: "Na iPhone'a i iPada." },
      android: { title: "Google Play", body: "Na urządzenia z Androidem." },
      apk: { title: "APK na życzenie", body: "Bez Sklepu Play — napisz do nas, a wyślemy Ci plik." },
      web: { title: "Otwórz w przeglądarce", body: "Bez instalacji, działa na każdym telefonie." },
    },
    closingEyebrow: "VELVET",
    closingTitle: "Wejście, które pamięta.",

    footerTagline: "VELVET — Wspólna sieć zaufania dla wejścia",
    footerImpressum: "Nota prawna",
    footerDatenschutz: "Prywatność",
    footerWerbematerial: "Materiały reklamowe",
    footerAgb: "Regulamin",
    footerWiderruf: "Odstąpienie",
    footerLocationTerms: "Warunki dla lokali",
    footerApply: "Zgłoś lokal",
  },
  venueTypes: {
    CLUB: "Klub",
    BAR: "Bar",
    PUB: "Pub",
    OTHER: "Inne",
  },
  tiers: {
    VIP: "VIP",
    TRUSTED: "Zaufany",
    STANDARD: "Standard",
    WATCH: "Obserwacja",
    BANNED: "Zablokowany",
  },
  explainers: {
    qrCheckin: {
      accessCodeLabel: "Twój kod dostępu",
      scanningLabel: "Skanowanie kodu…",
      checkedInLabel: "Zameldowano",
      readyToScan: "Gotowy do skanowania",
      scanningStaffLabel: "Skanowanie…",
      entryGranted: "Wejście przyznane",
      captionShow: "Gość **pokazuje swój kod** — jako QR lub 6-cyfrową liczbę.",
      captionScan: "Ochroniarz **skanuje go lub wpisuje** — oba sposoby działają.",
      captionAppear: "Profil pojawia się **natychmiast** — wraz ze statusem i historią.",
    },
    premiumMatch: {
      checkedInTag: "Zameldowano",
      matchesQuestion: "Kto jeszcze wyszedł dziś wieczorem?",
      chatMsgOut: "Hej, super wieczór wczoraj!",
      chatMsgIn: "Zdecydowanie 🙌",
      captionSameNight: "Dwóch gości, **ten sam wieczór**, ten sam lokal.",
      captionPremiumShows: "Premium pokazuje: **„Kto jeszcze wyszedł dziś wieczorem?”**",
      captionRealMatches: "Pisanie wiadomości — **tylko przy prawdziwych dopasowaniach**, bez obcych.",
    },
    multiVenue: {
      navOverview: "Przegląd",
      navAddVenue: "Dodaj lokal",
      statGuests: "Goście",
      statAvgScore: "Wynik",
      formButtonCreate: "Utwórz lokal",
      captionOneLogin: "**Jedno logowanie**, wiele lokali — każdy z własnymi liczbami.",
      captionSwitch: "**Przełączaj** lokale bez ponownego logowania.",
      captionCreateOwn: "**Utwórz nowy lokal samodzielnie** — uruchamia się dopiero po weryfikacji.",
    },
    trustScore: {
      rateLabel: "Wystaw ocenę",
      tagFriendly: "Miły",
      tagPunctual: "Punktualny",
      submitButton: "Wyślij",
      processingLabel: "Przetwarzanie…",
      rateCapturedLabel: "Ocena zapisana",
      statusUpdatingLabel: "Aktualizowanie statusu…",
      networkWideValidLabel: "Ważne w całej sieci",
      captionStars: "Po wizycie: **gwiazdki plus cechy** — 10 sekund.",
      captionGlobalStatus: "Wpływa na **status globalny** — nie tylko na ten jeden wieczór.",
      captionTravels: "Status **podróżuje z tobą** — ważny przy każdych drzwiach w sieci.",
    },
  },
  common: {
    genericError: "Połączenie nie powiodło się",
    loading: "Ładowanie…",
    showPassword: "Pokaż hasło",
    hidePassword: "Ukryj hasło",
  },
  languagePage: {
    title: "Wybierz język",
    subtitle: "Wybierz język dla VELVET.",
  },
  authFlow: {
    backToLogin: "Zaloguj się",
    forgotPasswordSubtitle: "Zresetuj hasło",
    emailSentTitle: "E-mail w drodze",
    emailSentBody: "Jeśli konto z tym adresem e-mail istnieje, wysłaliśmy link do resetowania hasła. Sprawdź też folder spam.",
    forgotPasswordTitle: "Nie pamiętasz hasła?",
    forgotPasswordBody: "Podaj swój adres e-mail, wyślemy Ci link do zresetowania hasła.",
    sending: "Wysyłanie…",
    sendLink: "Wyślij link",

    resetPasswordSubtitle: "Nowe hasło",
    invalidLink: "Nieprawidłowy link. Poproś o nowy link resetujący.",
    passwordChangedTitle: "Hasło zmienione",
    passwordChangedBody: "Możesz teraz zalogować się nowym hasłem.",
    goToLogin: "Przejdź do logowania",
    setNewPasswordTitle: "Ustaw nowe hasło",
    newPasswordPlaceholder: "Nowe hasło (min. 8 znaków)",
    confirmPasswordPlaceholder: "Potwierdź hasło",
    passwordsDontMatch: "Hasła nie są zgodne",
    saving: "Zapisywanie…",
    savePassword: "Zapisz hasło",

    verifyEmailSubtitle: "Potwierdź adres e-mail",
    verifying: "Potwierdzanie adresu e-mail…",
    emailVerifiedTitle: "E-mail potwierdzony",
    emailVerifiedBody: "Twoje konto jest teraz aktywne. Możesz zalogować się w aplikacji VELVET.",
    invalidVerifyLink: "Nieprawidłowy link. Poproś o nową wiadomość potwierdzającą w aplikacji.",
  },
  pages: {
    overview: {
      welcomeBack: "Witaj ponownie",
      recentCheckins: "Ostatnio zameldowani",
      rateAll: "Oceń wszystkich →",
      nothingPending: "Obecnie nic do zrobienia.",
    },
    guests: {
      title: "Goście",
      subtitle: "Wszyscy goście, którzy już odwiedzili ten lokal.",
      searchPlaceholder: "Szukaj po imieniu lub e-mailu…",
      colGuest: "Gość",
      colGlobalStatus: "Status globalny",
      colVisits: "Wizyty",
      colHere: "U nas",
      colLastVisit: "Ostatnia wizyta",
      flagVip: "VIP tutaj",
      flagBanned: "Zakaz wstępu",
      noneFound: "Nie znaleziono gości.",
    },
    pending: {
      title: "Oceń",
      subtitle: "Goście z ostatnich 6 godzin, którzy nie zostali jeszcze ocenieni.",
      nothingPending: "Obecnie nic do zrobienia.",
      stars: "Gwiazdki",
      tags: "Cechy",
      noteLabel: "Notatka (widoczna tylko dla tego lokalu)",
      notePlaceholder: "Opcjonalnie…",
      statusHere: "Status u nas",
      flagNone: "Bez zmian",
      flagVip: "Na liście VIP (ten lokal)",
      flagBanned: "Zakaz wstępu (ten lokal)",
      missingStars: "Wybierz ocenę w gwiazdkach",
      saveFailed: "Ocena nie powiodła się",
      saving: "Zapisywanie…",
      save: "Zapisz ocenę",
    },
    team: {
      title: "Zespół",
      subtitle: "Ochrona i menedżerowie dla {venue}.",
      managerOnly: "Tylko menedżerowie mogą zarządzać zespołem.",
      colName: "Imię",
      colEmail: "E-mail",
      colRole: "Rola",
      roleManager: "Menedżer",
      roleDoorman: "Ochrona",
      roleService: "Obsługa",
      newMember: "Nowy członek zespołu",
      namePlaceholder: "Imię",
      emailPlaceholder: "E-mail",
      passwordPlaceholder: "Hasło (min. 8 znaków)",
      createFailed: "Nie udało się utworzyć",
      creating: "Tworzenie…",
      create: "Utwórz",
    },
    settings: {
      title: "Ustawienia",
      subtitle: "Dane Twojego lokalu.",
      loadFailed: "Nie udało się załadować lokalu",
      saveFailed: "Zapis nie powiódł się",
      name: "Nazwa",
      address: "Adres",
      logoUrl: "URL logo (opcjonalnie)",
      loggedInAs: "Zalogowano jako",
      saved: "Zapisano.",
      saving: "Zapisywanie…",
      save: "Zapisz",
      cancel: "Anuluj",
      edit: "Edytuj",
    },
    venuesNew: {
      title: "Dodaj lokal",
      subtitle: "Dodaj nowy lokal do swojego konta. Zostaniesz automatycznie ustawiony jako jego menedżer.",
      namePlaceholder: "Nazwa lokalu",
      addressPlaceholder: "Adres",
      createFailed: "Nie udało się utworzyć",
      creating: "Tworzenie…",
      create: "Utwórz lokal",
      createdHeading: "Utworzono „{name}”",
      createdBody:
        "Ten lokal nie jest jeszcze zatwierdzony. Odprawa przez kod QR i oceny zadziałają dopiero po ręcznej weryfikacji przez VELVET. Możesz już teraz ustawić adres i zespół.",
      switchFailed: "Przełączenie nie powiodło się",
      switching: "Przełączanie…",
      switchTo: "Przełącz na ten lokal",
    },
    messages: {
      title: "Wiadomości",
      subtitle: "Napisz do gości VIP lub Premium tego lokalu, np. aby ich zaprosić.",
      managerOnly: "Tylko menedżerowie mogą pisać do gości.",
      conversations: "Rozmowy",
      noConversations: "Brak rozmów.",
      writeToGuests: "Napisz do gości",
      noMoreGuests: "Brak kolejnych gości VIP/Premium.",
      premiumBadge: "Premium",
      noMessages: "Brak wiadomości — napisz pierwszą.",
      messagePlaceholder: "Napisz wiadomość…",
      sendAriaLabel: "Wyślij",
      selectConversation: "Wybierz rozmowę lub gościa po lewej.",
      loadHistoryFailed: "Nie udało się załadować historii",
      sendFailed: "Nie udało się wysłać wiadomości",
    },
    venueApplication: {
      eyebrow: "Dla lokali",
      title: "Zgłoś swój lokal do VELVET",
      intro:
        "Klub, bar albo pub — wpisz tutaj swój lokal. Sprawdzamy każde zgłoszenie ręcznie i zatwierdzamy je, gdy wszystko się zgadza.",
      verifyTitle: "Dlaczego prosimy o wpis do ewidencji działalności",
      verifyBody:
        "Lokale w VELVET widzą profile gości i wystawiają oceny, więc zatwierdzamy tylko prawdziwe firmy. Dokument rejestracyjny jest dla nas potwierdzeniem. Sprawdzamy go wewnętrznie i nigdy nie publikujemy.",
      sectionVenue: "Twój lokal",
      sectionContact: "Osoba kontaktowa",
      sectionDocument: "Potwierdzenie",
      venueName: "Nazwa lokalu",
      venueType: "Rodzaj lokalu",
      address: "Adres",
      website: "Strona lub Instagram (opcjonalnie)",
      contactName: "Imię i nazwisko",
      contactEmail: "Adres e-mail",
      contactPhone: "Telefon (opcjonalnie)",
      message: "Kilka słów o lokalu (opcjonalnie)",
      documentHint: "Dokument rejestracyjny jako PDF, JPEG lub PNG — maksymalnie 10 MB.",
      documentChoose: "Wybierz plik",
      documentNone: "Nie wybrano pliku",
      privacyHint:
        "Wysyłając zgłoszenie zgadzasz się na przechowywanie danych do weryfikacji. Szczegóły w polityce prywatności.",
      submit: "Wyślij zgłoszenie",
      submitting: "Wysyłanie…",
      submitFailed: "Nie udało się wysłać",
      successTitle: "Dziękujemy — zgłoszenie dotarło",
      successBody:
        "Sprawdzimy Twoje dane i dokument rejestracyjny, a potem odezwiemy się mailem. Jeśli wszystko się zgadza, dostaniesz link do ustawienia hasła.",
      backHome: "Powrót na stronę główną",
    },
    adminApplications: {
      title: "Zgłoszenia",
      subtitle: "Sprawdzaj zgłoszenia self-service: otwórz dokument rejestracyjny, potem utwórz lokal albo odrzuć.",
      adminOnly: "Tylko dla administratorów platformy.",
      loadFailed: "Nie udało się załadować",
      pendingHeading: "Czeka na weryfikację",
      decidedHeading: "Już rozpatrzone",
      nothingPending: "Nic do sprawdzenia.",
      contactLabel: "Kontakt",
      websiteLabel: "Web",
      messageLabel: "Wiadomość",
      documentLabel: "Dokument rejestracyjny",
      documentDeleted: "Dokument usunięty po upływie 6-miesięcznego okresu przechowywania",
      openDocument: "Otwórz dokument",
      opening: "Otwieranie…",
      openFailed: "Nie udało się otworzyć dokumentu",
      approve: "Zatwierdź",
      approving: "Zatwierdzanie…",
      approveFailed: "Nie udało się zatwierdzić",
      approveHint: "Tworzy lokal i wysyła kontaktowi link do ustawienia hasła.",
      reject: "Odrzuć",
      rejecting: "Odrzucanie…",
      rejectFailed: "Nie udało się odrzucić",
      rejectReason: "Powód odmowy (zostanie wysłany mailem)",
      rejectConfirm: "Wyślij odmowę",
      cancel: "Anuluj",
      statusApproved: "Zatwierdzone",
      statusRejected: "Odrzucone",
      reviewNoteLabel: "Notatka",
    },
    adminVenues: {
      title: "Weryfikacja lokali",
      subtitle: "Zatwierdzaj lokale dodane samodzielnie, zanim check-in QR i oceny zaczną tam działać.",
      adminOnly: "Tylko dla administratorów platformy.",
      pendingHeading: "Oczekuje na zatwierdzenie",
      verifiedHeading: "Już zatwierdzone",
      suspendedHeading: "Zawieszone",
      verifying: "Zatwierdzanie…",
      verify: "Zatwierdź",
      loadFailed: "Nie udało się załadować",
      verifyFailed: "Nie udało się zatwierdzić",
      suspend: "Zawieś",
      suspendReasonPlaceholder: "Powód zawieszenia",
      suspendConfirm: "Potwierdź zawieszenie",
      suspending: "Zawieszanie…",
      suspendFailed: "Nie udało się zawiesić",
      cancel: "Anuluj",
      reactivate: "Przywróć",
      reactivating: "Przywracanie…",
      reactivateFailed: "Nie udało się przywrócić",
      suspendedSinceLabel: "Zawieszone od",
      suspendedReasonLabel: "Powód",
    },
    adminHiddenVenues: {
      title: "Ukryte lokale",
      subtitle: "Gość może trwale usunąć lokal ze swojej historii. Cofnięcie tego jest możliwe tylko tutaj, przez dokładne wyszukanie e-mail.",
      adminOnly: "Tylko dla administratorów platformy.",
      emailPlaceholder: "Adres e-mail gościa",
      search: "Szukaj",
      searching: "Wyszukiwanie…",
      searchFailed: "Wyszukiwanie nie powiodło się",
      nothingHidden: "Ten gość nie ma obecnie żadnego ukrytego lokalu.",
      hiddenSinceLabel: "Ukryte od",
      unhide: "Pokaż ponownie",
      unhiding: "Pokazywanie…",
      unhideFailed: "Nie udało się pokazać ponownie",
    },
    werbematerial: {
      eyebrow: "Dla właścicieli lokali",
      title: "Materiały reklamowe dla Twojego lokalu",
      intro: "Do wydruku i wyłożenia na miejscu — każdy materiał prowadzi przez kod QR bezpośrednio do VELVET, dzięki czemu Twoi goście mogą dołączyć bez zbędnych kroków.",
      downloads: [
        {
          title: "Ulotka v1",
          format: "A5 · PDF",
          description: "Do wyłożenia przy barze lub na stoliku — z kodem QR prowadzącym bezpośrednio do VELVET.",
          thumb: "/material/thumb-flyer.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5.pdf",
        },
        {
          title: "Ulotka v2",
          format: "A5 · PDF",
          description: "Asymetryczny układ z monogramem jako dużym znakiem wodnym, wychodzącym poza krawędź.",
          thumb: "/material/thumb-flyer-a5-v2.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5-v2.pdf",
        },
        {
          title: "Stojak v1",
          format: "A4 · PDF",
          description: "Do wejścia, baru lub szatni — duży kod QR, czytelny nawet z daleka.",
          thumb: "/material/thumb-poster.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-aufsteller-a4.pdf",
        },
        {
          title: "Stojak v2",
          format: "A4 · PDF",
          description: "Dwudzielny panel w ciemnym kolorze i złocie — mocniejszy kontrast do wejścia i baru.",
          thumb: "/material/thumb-flyer-a4-v2.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-flyer-a4-v2.pdf",
        },
        {
          title: "Wizytówka v1",
          format: "85×55 mm · PDF, 2 strony",
          description: "Do wręczenia przy wejściu — od ochrony bezpośrednio gościom. Przód: marka, tył: kod QR do skanowania.",
          thumb: "/material/thumb-visitenkarte.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte.pdf",
        },
        {
          title: "Wizytówka v2",
          format: "85×55 mm · PDF, 2 strony",
          description: "Odwrócona kolorystyka: ciemny monogram z przodu, intensywne złote tło z kodem QR z tyłu.",
          thumb: "/material/thumb-visitenkarte-v2.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte-v2.pdf",
        },
        {
          title: "Logo (zdjęcie profilowe)",
          format: "1024×1024 · PNG",
          description: "Monogram na ciemnym tle — gotowy do użycia jako zdjęcie profilowe, np. w mediach społecznościowych.",
          thumb: "/material/velvet-logo.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo.png",
        },
        {
          title: "Logo (wycięte)",
          format: "1024×1024 · PNG, przezroczyste",
          description: "Ten sam monogram z przezroczystym tłem — do umieszczenia na własnych materiałach.",
          thumb: "/material/velvet-logo-transparent.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo-transparent.png",
        },
      ],
      previewAlt: "Podgląd",
      downloadButton: "Pobierz",
      guestInfoHeading: "Strona informacyjna dla gości",
      guestInfoBody:
        "Strona napisana prostym językiem: jak działa VELVET, co jest zapisywane i kto to widzi. Do przekazywania dalej — jako link, kod QR przy wejściu albo wydruk. Celowo nie jest wyszukiwalna w wyszukiwarkach.",
      guestInfoButton: "Zobacz stronę",
      stickerHeading: "Naklejki i indywidualny merch",
      stickerBody1: "Oprócz plików PDF możemy dla Waszego lokalu wyprodukować i dostarczyć również **naklejki** oraz **produkty print-on-demand** (np. stojaki na stoliki, znaczki do szatni, gadżety łączące Wasze logo z VELVET).",
      stickerBody2: "Po prostu się odezwijcie, bez formalności, a omówimy format, ilość i design.",
      contactButton: "Skontaktuj się: mail@velvet-network.app",
    },
  },
  mobile: {
    welcome: {
      continueAsGuest: "Kontynuuj jako gość",
      staffLogin: "Logowanie personelu",
      impressum: "Nota prawna",
      datenschutz: "Prywatność",
      agb: "Regulamin",
      widerruf: "Odstąpienie",
    },
    guestLogin: {
      welcomeBack: "Witaj ponownie",
      createAccount: "Utwórz konto",
      loginHint: "Zaloguj się na swoje konto gościa.",
      registerHint: "Zarejestruj się jako gość.",
      firstName: "Imię",
      lastName: "Nazwisko",
      dateOfBirth: "Data urodzenia (DD.MM.RRRR)",
      dateOfBirthHint: "Sprawdzamy tylko pełnoletność — lokale nie widzą Twojej daty urodzenia.",
      dateOfBirthInvalid: "Podaj datę urodzenia w formacie DD.MM.RRRR.",
      dateOfBirthUnderage: "VELVET jest dla osób od 18 lat. Z tą datą urodzenia nie można założyć konta.",
      email: "E-mail",
      password: "Hasło",
      submitLogin: "Zaloguj się",
      submitRegister: "Zarejestruj się",
      registerSuccess:
        "Już prawie gotowe! Wysłaliśmy Ci e-mail — potwierdź swój adres, klikając w link, a potem będziesz mógł się zalogować.",
      switchToRegister: "Nie masz jeszcze konta? Zarejestruj się",
      switchToLogin: "Masz już konto? Zaloguj się",
      forgotPassword: "Nie pamiętasz hasła?",
      resendVerification: "Wyślij ponownie e-mail potwierdzający",
      resending: "Wysyłanie…",
      verificationResent: "E-mail potwierdzający został wysłany ponownie.",
    },
    staffLogin: {
      heading: "Dostęp dla personelu",
      subtitle: "Dla ochrony i menedżerów uczestniczących lokali.",
      email: "E-mail",
      password: "Hasło",
      submit: "Zaloguj się",
      forgotPassword: "Nie pamiętasz hasła?",
      chooseVenue: "Wybierz lokal",
      chooseVenueSubtitle: "To konto zarządza kilkoma lokalami.",
      notVerified: "Niezatwierdzony",
      back: "Wstecz",
    },
    invite: {
      shareTitle: "Zaproś znajomych",
      shareSubtitle:
        "Udostępnij swój kod — osoba, która go użyje, musi zostać najpierw przez Ciebie zaakceptowana, zanim będziecie mogli czatować.",
      yourCode: "Twój kod",
      share: "Udostępnij link",
      rotate: "Wygeneruj nowy kod",
      rotating: "Generowanie…",
      rotateConfirmTitle: "Wygenerować nowy kod?",
      rotateConfirmBody: "Stary kod przestanie działać. Istniejące połączenia pozostaną nienaruszone.",
      rotateConfirmButton: "Generuj",
      cancel: "Anuluj",
      enterCode: "Wprowadź kod",
      enterCodePlaceholder: "Kod lub link…",
      requests: "Prośby",
      loadFailed: "Nie udało się załadować",
      preview: {
        sendRequest: "Wyślij prośbę",
        sending: "Wysyłanie…",
        requestSent: "Prośba wysłana",
        alreadyConnected: "Jesteście już połączeni",
        back: "Wstecz",
      },
      requestsScreen: {
        title: "Otrzymane prośby",
        noRequests: "Brak oczekujących próśb.",
        accept: "Akceptuj",
        decline: "Odrzuć",
      },
    },
    tabBar: {
      profile: "Profil",
      entry: "Wejście",
      locations: "Lokale",
      messages: "Wiadomości",
      scanner: "Skaner",
      rate: "Oceń",
    },
    home: {
      welcomeBack: "Witaj z powrotem",
      choosePhotoLibrary: "Wybierz z galerii",
      takePhoto: "Zrób zdjęcie",
      uploading: "Przesyłanie…",
      photoAccessDenied: "Brak dostępu",
      uploadFailed: "Przesyłanie nie powiodło się",
      yourStatus: "Twój status",
      scoreLabel: "Wynik",
      tierPerks: {
        VIP: "Gwarantowane wejście bez kolejki i dostęp do strefy VIP we wszystkich uczestniczących lokalach.",
        TRUSTED: "Priorytetowe wejście i duże szanse na wejście nawet w pełne wieczory.",
        STANDARD: "Standardowe wejście na zwykłych warunkach danego lokalu.",
        WATCH: "Wejście zależy od decyzji ochrony — zbieraj pozytywne oceny, by poprawić swój status.",
        BANNED: "Dostęp obecnie ograniczony. W razie pytań skontaktuj się bezpośrednio z lokalem.",
      },
      qrEntryButton: "Pokaż kod QR do wejścia",
      premiumTitle: "Premium",
      premiumTeaser: "Napisz do gości, z którymi byłeś/aś na mieście, żeby się umówić.",
      logout: "Wyloguj się",
      deleteAccount: "Usuń konto",
      deletingAccount: "Usuwanie…",
      deleteConfirmTitle: "Usuń konto",
      deleteConfirmBody: "Twój profil, zdjęcie i status globalny zostaną nieodwracalnie usunięte. Tej operacji nie można cofnąć.",
      deleteConfirmCancel: "Anuluj",
      deleteErrorTitle: "Błąd",
      deleteErrorBody: "Nie udało się usunąć konta. Spróbuj ponownie.",
    },
    qr: {
      showAtDoor: "Pokaż przy wejściu",
      photoMissingTitle: "Brak zdjęcia profilowego",
      photoMissingBody: "Do kodu wejścia potrzebne jest zdjęcie profilowe, aby zespół mógł Cię rozpoznać przy skanerze.",
      addPhotoButton: "Dodaj zdjęcie",
      accessCodeTitle: "Twój kod dostępu",
      manualFallback: "Skan nie działa? Podaj kod do wpisania:",
      loadFailed: "Nie udało się załadować kodu",
      expiresIn: "Kod wygasa za {s}s · odświeża się automatycznie",
    },
    venues: {
      alreadyVisited: "Już odwiedzone",
      title: "Twoje lokale",
      searchPlaceholder: "Szukaj…",
      emptyNoVisits: "Nie odwiedziłeś/aś jeszcze żadnego lokalu. Pojawi się tutaj po pierwszym skanowaniu.",
      emptyNoResults: "Nie znaleziono lokalu.",
      visitsSingular: "wizyta",
      visitsPlural: "wizyt",
      flagVip: "VIP tutaj",
      flagBanned: "Zakaz wstępu",
      hide: "Ukryj",
      hideConfirmTitle: "Ukryć lokal na stałe?",
      hideConfirmBody:
        "Zniknie z Twojej historii i nikt nie znajdzie Cię przez niego w kontaktach Premium. W aplikacji nie da się tego cofnąć — tylko wsparcie może go przywrócić.\n\nOceny stamtąd nadal liczą się do Twojego statusu, a lokal zachowuje własne zapisy.",
      hideConfirmAction: "Ukryj na stałe",
      hideCancel: "Anuluj",
      hideFailed: "Nie udało się ukryć",
    },
    staffScanner: {
      scanFailed: "Skanowanie nie powiodło się",
      atVenue: "W",
      visitsHere: "wizyt(a) tutaj",
      onVipList: "Na liście VIP tego lokalu",
      bannedHere: "Zakaz wstępu u nas",
      noteLabel: "Notatka",
      rateButton: "Oceń",
      continueScanning: "Skanuj dalej",
      entryScanner: "Skaner wejścia",
      scanTitle: "Zeskanuj kod QR",
      allowCamera: "Zezwól na dostęp do kamery",
      checkingCode: "Sprawdzanie kodu…",
      manualFallback: "Skan nie działa? Wpisz kod:",
      codePlaceholder: "6-cyfrowy kod",
      checkButton: "Sprawdź",
      logoutLabel: "Wyloguj się",
    },
    staffPending: {
      recentEntries: "Ostatnie wejścia",
      title: "Do oceny",
      empty: "Obecnie nic do zrobienia — wszyscy goście zostali ocenieni.",
    },
    staffRate: {
      rateGuest: "Oceń gościa",
      starsLabel: "Gwiazdki",
      traitsLabel: "Cechy",
      noteLabel: "Notatka (widoczna tylko dla tego lokalu)",
      notePlaceholder: "Opcjonalnie…",
      statusHereLabel: "Status u nas",
      flagNone: "Bez zmian",
      flagVip: "Na liście VIP (ten lokal)",
      flagBanned: "Zakaz wstępu (ten lokal)",
      missingStars: "Wybierz ocenę w gwiazdkach",
      saveFailed: "Nie udało się zapisać oceny",
      save: "Zapisz ocenę",
    },
    messagesHome: {
      title: "Wiadomości",
      premiumUpsellBody: "Dzięki Premium możesz pisać do gości, z którymi byłeś/aś w tym samym lokalu tego samego wieczoru.",
      discoverPremium: "Odkryj Premium",
      whoWasThereTonight: "Kto jeszcze wyszedł dziś wieczorem?",
      noMatches: "Brak dopasowań.",
    },
    messageThread: {
      back: "Wstecz",
      report: "Zgłoś",
      block: "Zablokuj",
      blockConfirmTitle: "Zablokować tego użytkownika?",
      blockConfirmBody: "Nie będziecie mogli już do siebie pisać.",
      cancel: "Anuluj",
      reportConfirmTitle: "Zgłosić tę wiadomość?",
      reportConfirmBody: "Sprawdzimy zgłoszoną treść.",
      reportThanksTitle: "Dziękujemy",
      reportThanksBody: "Wiadomość została zgłoszona.",
      reportReason: "Nieodpowiednia treść",
      noMessages: "Brak wiadomości.",
      messagePlaceholder: "Wiadomość…",
      send: "Wyślij",
      sendFailed: "Nie udało się wysłać wiadomości",
    },
    premium: {
      back: "Wstecz",
      title: "Premium",
      subtitle: "Odblokuj prywatne wiadomości, aby umówić się z innymi gośćmi Premium, z którymi byłeś/aś w tym samym lokalu tego samego wieczoru.",
      activeSubscription: "Aktywny abonament",
      providerGranted: "Przyznano",
      monthly: "Miesięcznie",
      yearly: "Rocznie",
      expiresOn: "Wygasa",
      renewsOn: "Odnawia się",
      cancelButton: "Anuluj",
      saveBadge: "Oszczędź 33%",
      subscribeWithStripe: "Subskrybuj przez Stripe",
      subscribeWithPaypal: "Subskrybuj przez PayPal",
      paymentNote: "Płatność odbywa się na bezpiecznej stronie płatności Stripe lub PayPal w Twojej przeglądarce. VELVET nie przechowuje żadnych danych płatniczych.",
      statusLoadFailed: "Nie udało się załadować statusu",
      checkoutFailed: "Nie udało się rozpocząć płatności",
      cancelFailed: "Nie udało się anulować",
      withdrawalConsentHeading: "Natychmiastowy start a prawo odstąpienia",
      withdrawalReadMore: "Przeczytaj pouczenie o odstąpieniu",
      withdrawalConsentRequired: "Potwierdź natychmiastowy start, aby dokończyć subskrypcję.",
      features: [
        {
          icon: "✉",
          title: "Prywatne wiadomości",
          body: "Napisz do gości, z którymi byłeś/aś na mieście, żeby się umówić.",
        },
        {
          icon: "✓",
          title: "Bezpieczne i zweryfikowane",
          body: "Możliwe tylko z osobami, które udowodniły wspólny check-in w tym samym lokalu tego samego wieczoru — bez próśb od obcych.",
        },
      ],
    },
    premiumSuccess: {
      title: "Witamy w Premium",
      body: "Twoja subskrypcja jest aktywna. Potwierdzenie od dostawcy płatności może chwilę potrwać — odśwież profil, jeśli status jeszcze się nie zaktualizował.",
      button: "Przejdź do Premium",
    },
    premiumCancel: {
      title: "Bez problemu",
      body: "Zakup został anulowany. Nic nie zostało pobrane.",
      button: "Wróć do Premium",
    },
  },
  ratingTags: {
    friendly: "Miły",
    punctual: "Punktualny",
    big_spender: "Duży wydatek",
    well_dressed: "Stylowo ubrany",
    trouble: "Sprawiał kłopoty",
    too_intoxicated: "Zbyt mocno pod wpływem alkoholu",
  },
  demo: {
    eyebrow: "W akcji",
    title: "Jak działa VELVET.",
    intro: "Bez makiet, bez marketingowego gadania — zobacz każdy proces dokładnie tak, jak przebiega w prawdziwej aplikacji, a tuż pod spodem przeczytasz, co dzieje się w tle.",
    sections: [
      {
        key: "qr-checkin",
        eyebrow: "Przy wejściu",
        title: "Check-in QR",
        subtitle: "Od kodu dostępu do rozpoznanego gościa — w niecałą sekundę.",
        steps: [
          {
            n: "01",
            title: "Pojawia się kod",
            body: "W profilu gość dotyka „Pokaż kod QR do wejścia”. Pojawiają się dwa warianty tego samego dostępu: kod QR do zeskanowania i 6-cyfrowa liczba do odczytania. Oba są ważne przez 90 sekund i potem automatycznie się odnawiają — nikt nie musi w pośpiechu trzymać otwartej aplikacji.",
          },
          {
            n: "02",
            title: "Ochroniarz go odczytuje",
            body: "Przy wejściu zespół otwiera skaner — w aplikacji lub w przeglądarce, np. na tablecie lub terminalu kioskowym. Jeśli skan nie działa (słabe światło, tłok przy drzwiach, kamera nie współpracuje), wystarczy ręcznie wpisać 6 cyfr. Oba sposoby prowadzą do tego samego wyniku, na każdej platformie.",
          },
          {
            n: "03",
            title: "Profil pojawia się natychmiast",
            body: "Zdjęcie, imię, status globalny (VIP, Zaufany, Standard, Obserwacja, Zablokowany) oraz historia wizyt w tym lokalu są wyświetlane od razu — wraz z notatkami typu „na liście VIP” lub „zakaz wstępu”, jeśli takie istnieją.",
          },
          {
            n: "04",
            title: "Ważny raz, potem nieaktywny",
            body: "Każdy kod działa tylko raz. Gdy wejście zostanie zarejestrowane, kod od razu traci ważność — drugie skanowanie tym samym kodem się nie powiedzie. Dzięki temu zrzutu ekranu nie da się użyć wielokrotnie ani przekazać komuś innemu.",
          },
        ],
      },
      {
        key: "premium-match",
        eyebrow: "Po wieczorze",
        title: "Premium Match",
        subtitle: "Pisz tylko z osobami, z którymi naprawdę byłeś/aś na mieście.",
        steps: [
          {
            n: "01",
            title: "Wspólny check-in",
            body: "Dwóch gości melduje się tego samego wieczoru przez kod QR w tym samym lokalu. To już wystarczy — nie trzeba wcześniej wysyłać żadnych próśb ani się łączyć.",
          },
          {
            n: "02",
            title: "Dopasowanie pojawia się automatycznie",
            body: "Przy aktywnym członkostwie Premium sekcja „Wiadomości” pod hasłem „Kto jeszcze wyszedł dziś wieczorem?” automatycznie pokazuje wszystkich gości ze wspólnym, zweryfikowanym check-inem — z imieniem, zdjęciem i lokalem.",
          },
          {
            n: "03",
            title: "Pisanie, nie przeglądanie",
            body: "Wiadomości są możliwe wyłącznie między prawdziwymi dopasowaniami — nie ma otwartej listy gości do przeglądania ani próśb od obcych osób, które nigdy nie zameldowały się przy tych samych drzwiach.",
          },
          {
            n: "04",
            title: "Tylko z Premium",
            body: "Funkcja jest częścią opcjonalnego, płatnego członkostwa Premium dla gości (miesięcznie lub rocznie) — sam VELVET pozostaje darmowy dla gości i lokali.",
          },
        ],
      },
      {
        key: "multi-venue",
        eyebrow: "Dla operatorów",
        title: "Wiele lokali, jedno logowanie",
        subtitle: "Dla marek z więcej niż jednym lokalem — bez wielu kont.",
        steps: [
          {
            n: "01",
            title: "Jedno konto, wiele lokali",
            body: "Jeśli zespół prowadzi kilka lokali, wszystkie są powiązane z jednym logowaniem. Przy logowaniu z dostępem do wielu lokali pojawia się krótkie pytanie, z którym lokalem chcesz teraz pracować.",
          },
          {
            n: "02",
            title: "Przełączaj w dowolnym momencie",
            body: "Przełącznik w panelu bocznym pozwala w dowolnym momencie zmienić aktywny lokal bez ponownego logowania — lista gości, zespół i liczby aktualizują się do wybranego lokalu.",
          },
          {
            n: "03",
            title: "Utwórz nowy lokal samodzielnie",
            body: "Istniejący członek zespołu może utworzyć kolejny lokal bezpośrednio w panelu — wystarczy nazwa i adres, a konto zostaje automatycznie wpisane jako menedżer tego nowego lokalu.",
          },
          {
            n: "04",
            title: "Najpierw weryfikacja, potem aktywacja",
            body: "Nowo utworzony lokal jest na początku całkowicie zablokowany: brak check-inu QR, brak ocen, niewidoczny na publicznej liście lokali. Aktywuje się dopiero po ręcznej weryfikacji — dzięki temu nikt nie może po cichu podpiąć fałszywego lokalu do sieci.",
          },
        ],
      },
      {
        key: "trust-score",
        eyebrow: "Ścieżka statusu",
        title: "Od gwiazdki do statusu",
        subtitle: "Jak z pojedynczych ocen powstaje reputacja w całej sieci.",
        steps: [
          {
            n: "01",
            title: "Krótka ocena",
            body: "Po zarejestrowanym wejściu zespół może w ciągu kilku godzin wystawić ocenę: gwiazdki (1–5) plus opcjonalne cechy jak „Miły”, „Punktualny” lub „Sprawiał kłopoty” — całość zajmuje około 10 sekund.",
          },
          {
            n: "02",
            title: "Wpływa na status globalny",
            body: "Ocena liczy się nie tylko na ten jeden wieczór w tym jednym lokalu — wpływa na globalny status gościa obowiązujący we wszystkich lokalach, razem ze wszystkimi dotychczasowymi ocenami z każdego uczestniczącego lokalu.",
          },
          {
            n: "03",
            title: "Pięć poziomów, ważnych w całej sieci",
            body: "Z zebranej średniej wynika jeden z pięciu poziomów: Zablokowany, Obserwacja, Standard, Zaufany lub VIP. Każdy poziom jest natychmiast widoczny przy każdych drzwiach w sieci, nie tylko tam, gdzie powstał.",
          },
          {
            n: "04",
            title: "Zdobyte zaufanie zostaje",
            body: "Gość nie musi udowadniać niczego od nowa w nowym lokalu — dobra reputacja podróżuje razem z nim. I odwrotnie, zakaz wstępu w jednym lokalu jest równie widoczny w całej sieci, zanim gość dotrze do innych drzwi.",
          },
        ],
      },
    ],
  },
  legal: {
    back: "Wstecz",
    kontoLoeschen: {
      title: "Usuń konto",
      sections: [
        {
          heading: "Usuwanie w aplikacji",
          paragraphs: [
            "Otwórz aplikację VELVET i zaloguj się na swoje konto gościa.",
            "W sekcji profilu na dole dotknij „Usuń konto” i potwierdź komunikat.",
            "Twoje konto zostanie wtedy natychmiast i nieodwracalnie usunięte, a Ty zostaniesz automatycznie wylogowany.",
          ],
        },
        {
          heading: "Usuwanie bez zainstalowanej aplikacji",
          paragraphs: [
            "Jeśli nie masz już zainstalowanej aplikacji, napisz do nas e-mail na mail@velvet-network.app z adresu, na który zarejestrowane jest Twoje konto, z tematem „Usuń konto”.",
            "Usuniemy Twoje konto ręcznie w ciągu kilku dni i potwierdzimy to e-mailem.",
          ],
        },
        {
          heading: "Co zostanie usunięte",
          paragraphs: [
            "Twój profil (imię, nazwisko, adres e-mail, zdjęcie profilowe).",
            "Twój status globalny i wszystkie oceny powiązane z Twoim kontem.",
            "Twoja historia wejść (czas i lokal poprzednich skanów) oraz wszystkie relacje z lokalami (wizyty, lokalne notatki).",
            "Usunięcie jest ostateczne i dotyczy wszystkich lokali w sieci, nie tylko jednego.",
          ],
        },
        {
          heading: "Uwaga dla kont ochrony i menedżerów",
          paragraphs: [
            "Konta personelu (ochrona, menedżerowie) nie są zarządzane samodzielnie przez gości, tylko zakładane przez dany lokal. Aby usunąć konto personelu, skontaktuj się z zarządem swojego lokalu lub napisz na mail@velvet-network.app.",
          ],
        },
      ],
    },
  },
  makingOf: {
    eyebrow: "Making Of",
    title: "Ile czasu jest w VELVET?",
    intro: "Backend, aplikacja mobilna i panel powstały w ciągu jednego dnia — jako punkt odniesienia, jak szybko można stworzyć kompletną, działającą produkcyjnie platformę dzięki programowaniu wspieranemu przez AI.",
    devTimeLabel: "Szacowany aktywny czas developmentu",
    devTimeValue: "~22,4 godz.",
    devTimeRange: "z 19 na 20 sierpnia 2026, do 3:10",
    commitsLabel: "Commitów",
    subsystemsLabel: "Podsystemy",
    workBlocksHeading: "Bloki pracy",
    commitSingular: "commit",
    commitPlural: "commitów",
    sessions: [
      { range: "przed 1:16 (19.08.)", commits: 0, note: "Konfiguracja projektu, szacunkowo" },
      { range: "1:16 – 1:19", commits: 2 },
      { range: "7:17 – 7:50", commits: 2 },
      { range: "10:32 – 14:50", commits: 11 },
      { range: "17:27 – 18:21", commits: 3 },
      { range: "22:02 – 3:10 (20.08.)", commits: 18 },
    ],
    methodologyHeading: "Metodologia",
    methodologyBody: "Czas jest szacowany na podstawie znaczników czasu commitów Git, według tej samej zasady co popularne narzędzie „git-hours”: jeśli dwa kolejne commity dzieli mniej niż dwie godziny, rzeczywista przerwa liczy się jako czas pracy — w końcu między commitami dzieje się jeszcze pisanie, testowanie i myślenie. Jeśli przerwa jest większa, zaczyna się nowy blok pracy, dla którego przyjmuje się ryczałtowo dwie godziny, ponieważ nie wiadomo, jak długo pracowano przed pierwszym commitem tego bloku. Dodatkowo doliczono 1,5 godziny na konfigurację projektu przed pierwszym commitem (wstępne szkielety backendu, aplikacji i panelu, zanim cokolwiek trafiło pod kontrolę wersji). To przybliżenie, a nie dokładny pomiar czasu.",
  },
};

const es: Translations = {
  nav: {
    overview: "Resumen",
    guests: "Invitados",
    pending: "Valorar",
    team: "Equipo",
    messages: "Mensajes",
    settings: "Ajustes",
    addVenue: "Añadir local",
    reviewVenues: "Revisar locales",
    reviewApplications: "Solicitudes",
    hiddenVenues: "Locales ocultos",
    logout: "Cerrar sesión",
    openMenu: "Abrir menú",
  },
  login: {
    heading: "Iniciar sesión",
    subtitle: "Panel del club para equipo y dirección",
    email: "Correo electrónico",
    password: "Contraseña",
    submit: "Iniciar sesión",
    submitting: "Iniciando sesión…",
    forgotPassword: "¿Olvidaste tu contraseña?",
    chooseVenue: "Elige un local",
    chooseVenueSubtitle: "Esta cuenta gestiona varios locales.",
    notVerified: "No verificado",
    back: "Atrás",
  },
  landing: {
    tagline: "Un acceso que se siente merecido.",
    heroBody:
      "VELVET sustituye la lista de papel y el instinto en la puerta por un perfil que crece con el tiempo: los invitados construyen una reputación que va más allá de un solo club. El personal de seguridad ve al instante con quién trata al escanear. Los propietarios protegen su local sin empezar de cero cada noche.",
    ctaLogin: "Iniciar sesión",
    ctaForTeam: "Para el equipo y la dirección de los locales participantes",

    heroEyebrow: "Red de confianza compartida para la puerta",
    heroCardVerified: "Verificado en la puerta",
    heroCardLocations: "3 locales en la red",
    heroCardScore: "Puntuación 4.7",

    principleEyebrow: "La idea",
    principleTitle: "Un perfil. Cada puerta de la red lo conoce.",
    flowSteps: [
      { n: "01 · Perfil", title: "Crear una cuenta", body: "Nombre, foto, una cuenta — válida en todos los locales participantes, no solo en uno." },
      { n: "02 · Entrada", title: "Escanear en la puerta", body: "El personal de seguridad escanea el código y ve al instante la foto, el estado y el historial." },
      { n: "03 · Valoración", title: "Valorar brevemente", body: "Después de la noche: estrellas más rasgos como «Amable», «Puntual» o «Causó problemas»." },
      { n: "04 · Reputación", title: "El estado te acompaña", body: "La valoración alimenta un estado global — visible para cada local de la red." },
    ],

    howEyebrow: "Cómo funciona",
    howTitle: "Verlo es más rápido que explicarlo.",
    explainerTabs: [
      { tabLabel: "Check-in QR", eyebrow: "En la puerta", title: "Del código al check-in — en vivo, no una maqueta." },
      { tabLabel: "Match Premium", eyebrow: "Después de la noche", title: "¿Quién más salió esta noche?" },
      { tabLabel: "Equipo y locales", eyebrow: "Para operadores", title: "Un inicio de sesión, varios locales." },
      { tabLabel: "Puntuación de confianza", eyebrow: "El camino del estado", title: "Las valoraciones se convierten en un estado que te acompaña." },
    ],
    demoLink: "Ver la explicación completa →",

    guestsEyebrow: "01 · Para invitados",
    guestsTitle: "Tu reputación te abre la puerta — en toda la red.",
    guestsBody: "Sin explicar quién eres. Sin hacer cola por algo que ya te has ganado.",
    guestsBenefits: [
      { title: "Un código en vez de largas discusiones —", body: "la foto y el estado son visibles al instante, la entrada es más rápida." },
      { title: "El estado se acumula entre locales —", body: "el buen comportamiento en un club suma al estado en cualquier otro." },
      { title: "El comportamiento honesto se recompensa —", body: "un estado más alto significa esperas más cortas y acceso a la zona VIP." },
    ],
    guestsWelcomeBack: "Bienvenido de nuevo",
    guestsGlobalStatus: "Estado global",
    guestsBenefitText: "Entrada garantizada sin cola y acceso a la zona VIP en todos los locales participantes.",

    staffEyebrow: "02 · Para seguridad",
    staffTitle: "Contexto en vez de instinto — en el segundo del escaneo.",
    staffBody: "Un vistazo al escáner dice más de lo que cualquier lista de invitados podría.",
    staffBenefits: [
      { title: "Foto, estado e historial en un solo escaneo —", body: "también de otros locales de la red, no solo del propio." },
      { title: "Se acabaron las discusiones en la puerta —", body: "la decisión se basa en un historial documentado, no en un papel." },
      { title: "Los problemas son visibles al instante —", body: "incidentes como conflictos o embriaguez fuerte quedan registrados antes de que se repitan." },
    ],
    staffScanDetected: "Escaneo detectado",
    staffVisitsSuffix: "visitas",
    staffLocationsLabel: "Locales",
    staffLocationsValue: "3 en la red",
    staffLastVisitLabel: "Última vez",
    staffLocalStatusLabel: "Estado local",
    staffLocalStatusValue: "VIP aquí",
    staffTraitsLabel: "Rasgos",
    staffTraitsValue: "Amable, Puntual",
    staffNoIncidents: "Sin incidentes registrados en la red",

    ownersEyebrow: "03 · Para propietarios y dirección",
    ownersTitle: "Una red protege a cada local que forma parte de ella.",
    ownersBody: "Menos fricción en la puerta significa menos escaladas — y noches más predecibles.",
    ownersBenefits: [
      { title: "Lista de invitados, valoraciones y equipo de un vistazo —", body: "en el panel, sin papeleo entre turnos." },
      { title: "Los locales se benefician entre sí —", body: "un invitado vetado en un local es visible en toda la red antes de llegar a otra puerta." },
      { title: "Los habituales no tienen que demostrarlo de nuevo —", body: "la confianza ganada se mantiene allá donde vaya el invitado." },
    ],
    ownersRecentCheckins: "Registrados recientemente",
    ownersColGuest: "Invitado",
    ownersColStatus: "Estado",
    ownersColScore: "Puntuación",

    statusEyebrow: "El camino del estado",
    statusTitle: "Cinco niveles, válidos en toda la red.",
    statusBody: "El estado surge de las valoraciones acumuladas en todos los locales participantes — no de una sola noche.",
    tierPath: [
      { tier: "VIP", body: "Entrada garantizada, zona VIP. Valoraciones excelentes de forma constante en varios locales." },
      { tier: "TRUSTED", body: "Entrada prioritaria. Buena impresión de forma fiable, reconocido como habitual." },
      { tier: "STANDARD", body: "Entrada regular. El punto de partida de todo perfil nuevo." },
      { tier: "WATCH", body: "Vigilancia adicional. La entrada queda a criterio de la puerta." },
      { tier: "BANNED", body: "Veto en toda la red. Un veto en un local es visible en cada puerta de la red." },
    ],

    downloadEyebrow: "App para invitados",
    downloadTitle: "VELVET en tu móvil",
    downloadBody:
      "Tu estado, tu código QR en la puerta, tus locales — elige desde dónde quieres conseguir la app.",
    downloadSources: {
      ios: { title: "App Store", body: "Para iPhone y iPad." },
      android: { title: "Google Play", body: "Para dispositivos Android." },
      apk: { title: "APK a petición", body: "Sin Play Store — escríbenos y te enviamos el archivo." },
      web: { title: "Abrir en el navegador", body: "Sin instalar nada, funciona en cualquier móvil." },
    },
    closingEyebrow: "VELVET",
    closingTitle: "Una puerta que recuerda.",

    footerTagline: "VELVET — Red de confianza compartida para la puerta",
    footerImpressum: "Aviso legal",
    footerDatenschutz: "Privacidad",
    footerWerbematerial: "Material promocional",
    footerAgb: "Condiciones",
    footerWiderruf: "Desistimiento",
    footerLocationTerms: "Condiciones para locales",
    footerApply: "Registrar un local",
  },
  venueTypes: {
    CLUB: "Club",
    BAR: "Bar",
    PUB: "Pub",
    OTHER: "Otro",
  },
  tiers: {
    VIP: "VIP",
    TRUSTED: "De confianza",
    STANDARD: "Estándar",
    WATCH: "Vigilancia",
    BANNED: "Vetado",
  },
  explainers: {
    qrCheckin: {
      accessCodeLabel: "Tu código de acceso",
      scanningLabel: "Escaneando código…",
      checkedInLabel: "Registrado",
      readyToScan: "Listo para escanear",
      scanningStaffLabel: "Escaneando…",
      entryGranted: "Entrada concedida",
      captionShow: "El invitado **muestra su código** — como QR o número de 6 dígitos.",
      captionScan: "El personal **lo escanea o lo introduce** — ambas opciones funcionan.",
      captionAppear: "El perfil aparece **al instante** — con estado e historial.",
    },
    premiumMatch: {
      checkedInTag: "Registrado",
      matchesQuestion: "¿Quién más salió esta noche?",
      chatMsgOut: "¡Oye, qué buena noche ayer!",
      chatMsgIn: "Totalmente 🙌",
      captionSameNight: "Dos invitados, **la misma noche**, el mismo local.",
      captionPremiumShows: "Premium muestra: **«¿Quién más salió esta noche?»**",
      captionRealMatches: "Escribir mensajes — **solo con coincidencias reales**, sin desconocidos.",
    },
    multiVenue: {
      navOverview: "Resumen",
      navAddVenue: "Añadir local",
      statGuests: "Invitados",
      statAvgScore: "Puntuación",
      formButtonCreate: "Crear local",
      captionOneLogin: "**Un solo inicio de sesión**, varios locales — cada uno con sus propios números.",
      captionSwitch: "**Cambia** de local sin volver a iniciar sesión.",
      captionCreateOwn: "**Crea un nuevo local tú mismo** — se activa solo tras la revisión.",
    },
    trustScore: {
      rateLabel: "Enviar una valoración",
      tagFriendly: "Amable",
      tagPunctual: "Puntual",
      submitButton: "Enviar",
      processingLabel: "Procesando…",
      rateCapturedLabel: "Valoración registrada",
      statusUpdatingLabel: "Actualizando estado…",
      networkWideValidLabel: "Válido en toda la red",
      captionStars: "Tras la visita: **estrellas más rasgos** — 10 segundos.",
      captionGlobalStatus: "Alimenta el **estado global** — no solo esta noche.",
      captionTravels: "El estado **te acompaña** — válido en cada puerta de la red.",
    },
  },
  common: {
    genericError: "Error de conexión",
    loading: "Cargando…",
    showPassword: "Mostrar contraseña",
    hidePassword: "Ocultar contraseña",
  },
  languagePage: {
    title: "Elegir idioma",
    subtitle: "Elige el idioma para VELVET.",
  },
  authFlow: {
    backToLogin: "Iniciar sesión",
    forgotPasswordSubtitle: "Restablecer contraseña",
    emailSentTitle: "Correo en camino",
    emailSentBody: "Si existe una cuenta con este correo electrónico, te hemos enviado un enlace para restablecer la contraseña. Revisa también tu carpeta de spam.",
    forgotPasswordTitle: "¿Olvidaste tu contraseña?",
    forgotPasswordBody: "Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.",
    sending: "Enviando…",
    sendLink: "Enviar enlace",

    resetPasswordSubtitle: "Nueva contraseña",
    invalidLink: "Enlace no válido. Solicita un nuevo enlace de restablecimiento.",
    passwordChangedTitle: "Contraseña cambiada",
    passwordChangedBody: "Ya puedes iniciar sesión con tu nueva contraseña.",
    goToLogin: "Ir a iniciar sesión",
    setNewPasswordTitle: "Establecer nueva contraseña",
    newPasswordPlaceholder: "Nueva contraseña (mín. 8 caracteres)",
    confirmPasswordPlaceholder: "Confirmar contraseña",
    passwordsDontMatch: "Las contraseñas no coinciden",
    saving: "Guardando…",
    savePassword: "Guardar contraseña",

    verifyEmailSubtitle: "Confirmar dirección de correo",
    verifying: "Confirmando tu dirección de correo…",
    emailVerifiedTitle: "Correo confirmado",
    emailVerifiedBody: "Tu cuenta ya está activa. Ya puedes iniciar sesión en la app de VELVET.",
    invalidVerifyLink: "Enlace no válido. Solicita un nuevo correo de confirmación en la app.",
  },
  pages: {
    overview: {
      welcomeBack: "Bienvenido de nuevo",
      recentCheckins: "Últimos registros",
      rateAll: "Valorar todos →",
      nothingPending: "No hay nada pendiente ahora mismo.",
    },
    guests: {
      title: "Invitados",
      subtitle: "Todos los invitados que ya han visitado este local.",
      searchPlaceholder: "Buscar por nombre o correo…",
      colGuest: "Invitado",
      colGlobalStatus: "Estado global",
      colVisits: "Visitas",
      colHere: "Aquí",
      colLastVisit: "Última visita",
      flagVip: "VIP aquí",
      flagBanned: "Vetado",
      noneFound: "No se encontraron invitados.",
    },
    pending: {
      title: "Valorar",
      subtitle: "Invitados de las últimas 6 horas que aún no han sido valorados.",
      nothingPending: "No hay nada pendiente ahora mismo.",
      stars: "Estrellas",
      tags: "Etiquetas",
      noteLabel: "Nota (visible solo para este local)",
      notePlaceholder: "Opcional…",
      statusHere: "Estado aquí",
      flagNone: "Sin cambios",
      flagVip: "En lista VIP (este local)",
      flagBanned: "Vetado (este local)",
      missingStars: "Por favor elige una valoración en estrellas",
      saveFailed: "Error al guardar la valoración",
      saving: "Guardando…",
      save: "Guardar valoración",
    },
    team: {
      title: "Equipo",
      subtitle: "Personal de seguridad y encargados de {venue}.",
      managerOnly: "Solo los encargados pueden gestionar el equipo.",
      colName: "Nombre",
      colEmail: "Correo",
      colRole: "Rol",
      roleManager: "Encargado",
      roleDoorman: "Seguridad",
      roleService: "Personal de servicio",
      newMember: "Nuevo miembro del equipo",
      namePlaceholder: "Nombre",
      emailPlaceholder: "Correo",
      passwordPlaceholder: "Contraseña (mín. 8 caracteres)",
      createFailed: "Error al crear",
      creating: "Creando…",
      create: "Crear",
    },
    settings: {
      title: "Ajustes",
      subtitle: "Datos de tu local.",
      loadFailed: "No se pudo cargar el local",
      saveFailed: "Error al guardar",
      name: "Nombre",
      address: "Dirección",
      logoUrl: "URL del logo (opcional)",
      loggedInAs: "Sesión iniciada como",
      saved: "Guardado.",
      saving: "Guardando…",
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
    },
    venuesNew: {
      title: "Añadir local",
      subtitle: "Añade un nuevo local a tu cuenta. Se te asignará automáticamente como su encargado.",
      namePlaceholder: "Nombre del local",
      addressPlaceholder: "Dirección",
      createFailed: "Error al crear",
      creating: "Creando…",
      create: "Crear local",
      createdHeading: "“{name}” creado",
      createdBody:
        "Este local aún no está aprobado. El check-in por QR y las valoraciones no funcionarán hasta que VELVET lo verifique manualmente. Ya puedes configurar su dirección y equipo.",
      switchFailed: "Error al cambiar",
      switching: "Cambiando…",
      switchTo: "Cambiar a este local",
    },
    messages: {
      title: "Mensajes",
      subtitle: "Escribe a invitados VIP o Premium de este local, por ejemplo para invitarlos.",
      managerOnly: "Solo los gerentes pueden escribir a los invitados.",
      conversations: "Conversaciones",
      noConversations: "Aún no hay conversaciones.",
      writeToGuests: "Escribir a invitados",
      noMoreGuests: "No hay más invitados VIP/Premium.",
      premiumBadge: "Premium",
      noMessages: "Aún no hay mensajes — escribe el primero.",
      messagePlaceholder: "Escribe un mensaje…",
      sendAriaLabel: "Enviar",
      selectConversation: "Selecciona una conversación o invitado a la izquierda.",
      loadHistoryFailed: "No se pudo cargar el historial",
      sendFailed: "No se pudo enviar el mensaje",
    },
    venueApplication: {
      eyebrow: "Para locales",
      title: "Registra tu local en VELVET",
      intro:
        "Club, bar o pub — cuéntanos aquí sobre tu local. Revisamos cada solicitud a mano y te damos de alta en cuanto todo encaje.",
      verifyTitle: "Por qué pedimos el alta de actividad",
      verifyBody:
        "Los locales de VELVET ven perfiles de invitados y ponen valoraciones, así que solo aprobamos negocios reales. El alta de actividad es nuestra prueba. Se revisa internamente y nunca se publica.",
      sectionVenue: "Tu local",
      sectionContact: "Persona de contacto",
      sectionDocument: "Justificante",
      venueName: "Nombre del local",
      venueType: "Tipo de local",
      address: "Dirección",
      website: "Web o Instagram (opcional)",
      contactName: "Nombre y apellidos",
      contactEmail: "Correo electrónico",
      contactPhone: "Teléfono (opcional)",
      message: "Unas palabras sobre tu local (opcional)",
      documentHint: "Alta de actividad en PDF, JPEG o PNG — máximo 10 MB.",
      documentChoose: "Elegir archivo",
      documentNone: "Ningún archivo elegido",
      privacyHint:
        "Al enviar aceptas que guardemos tus datos para revisarlos. Más detalles en la política de privacidad.",
      submit: "Enviar solicitud",
      submitting: "Enviando…",
      submitFailed: "Error al enviar",
      successTitle: "Gracias — hemos recibido tu solicitud",
      successBody:
        "Revisaremos tus datos y el alta de actividad y te escribiremos por correo. Si todo encaja, recibirás un enlace para establecer tu contraseña.",
      backHome: "Volver al inicio",
    },
    adminApplications: {
      title: "Solicitudes",
      subtitle: "Revisa las altas por autoservicio: abre el alta de actividad y luego crea el local o recházalo.",
      adminOnly: "Solo para administradores de la plataforma.",
      loadFailed: "Error al cargar",
      pendingHeading: "Pendiente de revisión",
      decidedHeading: "Ya resueltas",
      nothingPending: "Nada que revisar.",
      contactLabel: "Contacto",
      websiteLabel: "Web",
      messageLabel: "Mensaje",
      documentLabel: "Alta de actividad",
      documentDeleted: "Documento eliminado tras el plazo de conservación de 6 meses",
      openDocument: "Abrir documento",
      opening: "Abriendo…",
      openFailed: "No se pudo abrir el documento",
      approve: "Aprobar",
      approving: "Aprobando…",
      approveFailed: "Error al aprobar",
      approveHint: "Crea el local y envía al contacto un enlace para establecer su contraseña.",
      reject: "Rechazar",
      rejecting: "Rechazando…",
      rejectFailed: "Error al rechazar",
      rejectReason: "Motivo del rechazo (se envía por correo)",
      rejectConfirm: "Enviar rechazo",
      cancel: "Cancelar",
      statusApproved: "Aprobado",
      statusRejected: "Rechazado",
      reviewNoteLabel: "Nota",
    },
    adminVenues: {
      title: "Revisar locales",
      subtitle: "Aprueba los locales creados por autoservicio antes de que el check-in QR y las valoraciones funcionen allí.",
      adminOnly: "Solo para administradores de la plataforma.",
      pendingHeading: "Pendiente de aprobación",
      verifiedHeading: "Ya aprobados",
      suspendedHeading: "Suspendidos",
      verifying: "Aprobando…",
      verify: "Aprobar",
      loadFailed: "Error al cargar",
      verifyFailed: "Error al aprobar",
      suspend: "Suspender",
      suspendReasonPlaceholder: "Motivo de la suspensión",
      suspendConfirm: "Confirmar suspensión",
      suspending: "Suspendiendo…",
      suspendFailed: "Error al suspender",
      cancel: "Cancelar",
      reactivate: "Reactivar",
      reactivating: "Reactivando…",
      reactivateFailed: "Error al reactivar",
      suspendedSinceLabel: "Suspendido desde",
      suspendedReasonLabel: "Motivo",
    },
    adminHiddenVenues: {
      title: "Locales ocultos",
      subtitle: "Un huésped puede quitar un local de su historial de forma permanente. Deshacerlo solo es posible aquí, mediante una búsqueda exacta por correo electrónico.",
      adminOnly: "Solo para administradores de la plataforma.",
      emailPlaceholder: "Correo electrónico del huésped",
      search: "Buscar",
      searching: "Buscando…",
      searchFailed: "Error al buscar",
      nothingHidden: "Este huésped no tiene ningún local oculto actualmente.",
      hiddenSinceLabel: "Oculto desde",
      unhide: "Mostrar de nuevo",
      unhiding: "Mostrando…",
      unhideFailed: "Error al mostrar de nuevo",
    },
    werbematerial: {
      eyebrow: "Para propietarios de locales",
      title: "Material promocional para tu local",
      intro: "Para imprimir y mostrar in situ — cada material enlaza mediante código QR directamente a VELVET, para que tus invitados puedan unirse sin rodeos.",
      downloads: [
        {
          title: "Folleto v1",
          format: "A5 · PDF",
          description: "Para dejar en la barra o en las mesas — con un código QR que lleva directo a VELVET.",
          thumb: "/material/thumb-flyer.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5.pdf",
        },
        {
          title: "Folleto v2",
          format: "A5 · PDF",
          description: "Diseño asimétrico con el monograma como marca de agua a gran escala que sangra hasta el borde.",
          thumb: "/material/thumb-flyer-a5-v2.png",
          thumbWidth: 559,
          thumbHeight: 794,
          file: "/material/velvet-flyer-a5-v2.pdf",
        },
        {
          title: "Cartel v1",
          format: "A4 · PDF",
          description: "Para la entrada, la barra o el guardarropa — código QR grande, legible incluso desde lejos.",
          thumb: "/material/thumb-poster.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-aufsteller-a4.pdf",
        },
        {
          title: "Cartel v2",
          format: "A4 · PDF",
          description: "Panel de dos tonos en oscuro y dorado — contraste más marcado para la entrada y la barra.",
          thumb: "/material/thumb-flyer-a4-v2.png",
          thumbWidth: 794,
          thumbHeight: 1123,
          file: "/material/velvet-flyer-a4-v2.pdf",
        },
        {
          title: "Tarjeta v1",
          format: "85×55 mm · PDF, 2 páginas",
          description: "Para entregar en la puerta — del personal de seguridad directamente a los invitados. Marca en el anverso, QR de escaneo en el reverso.",
          thumb: "/material/thumb-visitenkarte.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte.pdf",
        },
        {
          title: "Tarjeta v2",
          format: "85×55 mm · PDF, 2 páginas",
          description: "Colores invertidos: monograma oscuro en el anverso, fondo dorado intenso con código QR en el reverso.",
          thumb: "/material/thumb-visitenkarte-v2.png",
          thumbWidth: 1100,
          thumbHeight: 351,
          file: "/material/velvet-visitenkarte-v2.pdf",
        },
        {
          title: "Logo (foto de perfil)",
          format: "1024×1024 · PNG",
          description: "Monograma sobre fondo oscuro — listo para usar como foto de perfil, por ejemplo en redes sociales.",
          thumb: "/material/velvet-logo.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo.png",
        },
        {
          title: "Logo (recortado)",
          format: "1024×1024 · PNG, transparente",
          description: "El mismo monograma con fondo transparente — para colocar sobre tu propio material.",
          thumb: "/material/velvet-logo-transparent.png",
          thumbWidth: 1024,
          thumbHeight: 1024,
          file: "/material/velvet-logo-transparent.png",
        },
      ],
      previewAlt: "Vista previa",
      downloadButton: "Descargar",
      guestInfoHeading: "Página informativa para tus invitados",
      guestInfoBody:
        "Una página en lenguaje sencillo: cómo funciona VELVET, qué se guarda y quién lo ve. Pensada para compartir — como enlace, código QR en la puerta o impresa. A propósito no aparece en los buscadores.",
      guestInfoButton: "Ver la página",
      stickerHeading: "Pegatinas y merchandising personalizado",
      stickerBody1: "Más allá de los PDF, también podemos producir y enviar **pegatinas** y **artículos bajo demanda** para tu local (p. ej. atriles de mesa, tarjetas de guardarropa, merchandising que combine tu logo con VELVET).",
      stickerBody2: "Escríbenos sin compromiso y hablamos sobre formato, cantidad y diseño.",
      contactButton: "Contactar mail@velvet-network.app",
    },
  },
  mobile: {
    welcome: {
      continueAsGuest: "Continuar como invitado",
      staffLogin: "Acceso del personal",
      impressum: "Aviso legal",
      datenschutz: "Privacidad",
      agb: "Condiciones",
      widerruf: "Desistimiento",
    },
    guestLogin: {
      welcomeBack: "Bienvenido de nuevo",
      createAccount: "Crear cuenta",
      loginHint: "Inicia sesión con tu cuenta de invitado.",
      registerHint: "Regístrate como invitado.",
      firstName: "Nombre",
      lastName: "Apellido",
      dateOfBirth: "Fecha de nacimiento (DD.MM.AAAA)",
      dateOfBirthHint: "Solo la usamos para comprobar que eres mayor de edad — los locales no ven tu fecha de nacimiento.",
      dateOfBirthInvalid: "Introduce tu fecha de nacimiento como DD.MM.AAAA.",
      dateOfBirthUnderage: "VELVET es para mayores de 18 años. No se puede crear una cuenta con esta fecha de nacimiento.",
      email: "Correo",
      password: "Contraseña",
      submitLogin: "Iniciar sesión",
      submitRegister: "Registrarse",
      registerSuccess:
        "¡Ya casi está! Te hemos enviado un correo — confirma tu dirección con el enlace incluido y luego podrás iniciar sesión.",
      switchToRegister: "¿Aún no tienes cuenta? Regístrate",
      switchToLogin: "¿Ya tienes cuenta? Inicia sesión",
      forgotPassword: "¿Olvidaste tu contraseña?",
      resendVerification: "Reenviar correo de confirmación",
      resending: "Enviando…",
      verificationResent: "El correo de confirmación se ha reenviado.",
    },
    staffLogin: {
      heading: "Acceso del personal",
      subtitle: "Para el personal de seguridad y encargados de los locales participantes.",
      email: "Correo",
      password: "Contraseña",
      submit: "Iniciar sesión",
      forgotPassword: "¿Olvidaste tu contraseña?",
      chooseVenue: "Elige un local",
      chooseVenueSubtitle: "Esta cuenta gestiona varios locales.",
      notVerified: "No verificado",
      back: "Atrás",
    },
    invite: {
      shareTitle: "Invitar amigos",
      shareSubtitle: "Comparte tu código — quien lo use necesitará tu aprobación antes de poder chatear.",
      yourCode: "Tu código",
      share: "Compartir enlace",
      rotate: "Generar nuevo código",
      rotating: "Generando…",
      rotateConfirmTitle: "¿Generar un nuevo código?",
      rotateConfirmBody: "El código antiguo dejará de funcionar. Las conexiones existentes se mantendrán.",
      rotateConfirmButton: "Generar",
      cancel: "Cancelar",
      enterCode: "Introducir código",
      enterCodePlaceholder: "Código o enlace…",
      requests: "Solicitudes",
      loadFailed: "No se pudo cargar",
      preview: {
        sendRequest: "Enviar solicitud",
        sending: "Enviando…",
        requestSent: "Solicitud enviada",
        alreadyConnected: "Ya estáis conectados",
        back: "Atrás",
      },
      requestsScreen: {
        title: "Solicitudes recibidas",
        noRequests: "No hay solicitudes pendientes.",
        accept: "Aceptar",
        decline: "Rechazar",
      },
    },
    tabBar: {
      profile: "Perfil",
      entry: "Entrada",
      locations: "Locales",
      messages: "Mensajes",
      scanner: "Escáner",
      rate: "Valorar",
    },
    home: {
      welcomeBack: "Bienvenido de nuevo",
      choosePhotoLibrary: "Elegir de la galería",
      takePhoto: "Hacer una foto",
      uploading: "Subiendo…",
      photoAccessDenied: "Acceso no concedido",
      uploadFailed: "Error al subir",
      yourStatus: "Tu estado",
      scoreLabel: "Puntuación",
      tierPerks: {
        VIP: "Entrada garantizada sin cola y acceso a la zona VIP en todos los locales participantes.",
        TRUSTED: "Entrada prioritaria y buenas probabilidades de entrar incluso en noches llenas.",
        STANDARD: "Entrada regular según las condiciones habituales del local.",
        WATCH: "La entrada queda a criterio del personal de seguridad — consigue valoraciones positivas para mejorar.",
        BANNED: "El acceso está actualmente restringido. Contacta directamente con el local si tienes dudas.",
      },
      qrEntryButton: "Mostrar código QR para entrar",
      premiumTitle: "Premium",
      premiumTeaser: "Escribe a invitados con los que saliste, para quedar.",
      logout: "Cerrar sesión",
      deleteAccount: "Eliminar cuenta",
      deletingAccount: "Eliminando…",
      deleteConfirmTitle: "Eliminar cuenta",
      deleteConfirmBody: "Tu perfil, foto y estado global se eliminarán de forma irreversible. Esto no se puede deshacer.",
      deleteConfirmCancel: "Cancelar",
      deleteErrorTitle: "Error",
      deleteErrorBody: "No se pudo eliminar tu cuenta. Inténtalo de nuevo.",
    },
    qr: {
      showAtDoor: "Muestra esto en la puerta",
      photoMissingTitle: "Falta la foto de perfil",
      photoMissingBody: "Necesitas una foto de perfil para el código de entrada, para que el equipo pueda reconocerte en el escáner.",
      addPhotoButton: "Añadir foto",
      accessCodeTitle: "Tu código de acceso",
      manualFallback: "¿No funciona el escaneo? Que te lo introduzcan:",
      loadFailed: "No se pudo cargar el código",
      expiresIn: "El código caduca en {s}s · se actualiza automáticamente",
    },
    venues: {
      alreadyVisited: "Ya visitado",
      title: "Tus locales",
      searchPlaceholder: "Buscar…",
      emptyNoVisits: "Aún no has visitado ningún local. En cuanto te escaneen por primera vez, aparecerá aquí.",
      emptyNoResults: "No se encontró ningún local.",
      visitsSingular: "visita",
      visitsPlural: "visitas",
      flagVip: "VIP aquí",
      flagBanned: "Vetado",
      hide: "Ocultar",
      hideConfirmTitle: "¿Ocultar el local para siempre?",
      hideConfirmBody:
        "Desaparece de tu historial y nadie podrá encontrarte a través de él en los contactos Premium. No puedes deshacerlo en la app — solo soporte puede recuperarlo.\n\nLas valoraciones de allí siguen contando para tu estado, y el local conserva sus propios registros.",
      hideConfirmAction: "Ocultar para siempre",
      hideCancel: "Cancelar",
      hideFailed: "No se pudo ocultar",
    },
    staffScanner: {
      scanFailed: "Error al escanear",
      atVenue: "En",
      visitsHere: "visita(s) aquí",
      onVipList: "En la lista VIP de este local",
      bannedHere: "Vetado aquí",
      noteLabel: "Nota",
      rateButton: "Valorar",
      continueScanning: "Seguir escaneando",
      entryScanner: "Escáner de entrada",
      scanTitle: "Escanear código QR",
      allowCamera: "Permitir acceso a la cámara",
      checkingCode: "Comprobando código…",
      manualFallback: "¿No funciona el escaneo? Introduce el código:",
      codePlaceholder: "Código de 6 dígitos",
      checkButton: "Comprobar",
      logoutLabel: "Cerrar sesión",
    },
    staffPending: {
      recentEntries: "Entradas recientes",
      title: "Pendientes de valorar",
      empty: "No hay nada pendiente ahora mismo — todos los invitados están valorados.",
    },
    staffRate: {
      rateGuest: "Valorar invitado",
      starsLabel: "Estrellas",
      traitsLabel: "Rasgos",
      noteLabel: "Nota (visible solo para este local)",
      notePlaceholder: "Opcional…",
      statusHereLabel: "Estado con nosotros",
      flagNone: "Sin cambios",
      flagVip: "En lista VIP (este local)",
      flagBanned: "Vetado (este local)",
      missingStars: "Selecciona una valoración en estrellas",
      saveFailed: "Error al guardar la valoración",
      save: "Guardar valoración",
    },
    messagesHome: {
      title: "Mensajes",
      premiumUpsellBody: "Con Premium puedes escribir a invitados con los que estuviste en el mismo local la misma noche.",
      discoverPremium: "Descubrir Premium",
      whoWasThereTonight: "¿Quién más salió esta noche?",
      noMatches: "Aún no hay coincidencias.",
    },
    messageThread: {
      back: "Atrás",
      report: "Denunciar",
      block: "Bloquear",
      blockConfirmTitle: "¿Bloquear a este usuario?",
      blockConfirmBody: "Después ya no podréis escribiros.",
      cancel: "Cancelar",
      reportConfirmTitle: "¿Denunciar este mensaje?",
      reportConfirmBody: "Revisaremos el contenido denunciado.",
      reportThanksTitle: "Gracias",
      reportThanksBody: "El mensaje ha sido denunciado.",
      reportReason: "Contenido inapropiado",
      noMessages: "Aún no hay mensajes.",
      messagePlaceholder: "Mensaje…",
      send: "Enviar",
      sendFailed: "No se pudo enviar el mensaje",
    },
    premium: {
      back: "Atrás",
      title: "Premium",
      subtitle: "Desbloquea mensajes privados para quedar con otros invitados Premium con los que estuviste en el mismo local la misma noche.",
      activeSubscription: "Suscripción activa",
      providerGranted: "Concedido",
      monthly: "Mensual",
      yearly: "Anual",
      expiresOn: "Caduca el",
      renewsOn: "Se renueva el",
      cancelButton: "Cancelar",
      saveBadge: "Ahorra 33%",
      subscribeWithStripe: "Suscribirse con Stripe",
      subscribeWithPaypal: "Suscribirse con PayPal",
      paymentNote: "El pago se realiza en una página de pago segura de Stripe o PayPal en tu navegador. VELVET no almacena datos de pago.",
      statusLoadFailed: "No se pudo cargar el estado",
      checkoutFailed: "No se pudo iniciar el pago",
      cancelFailed: "Error al cancelar",
      withdrawalConsentHeading: "Inicio inmediato y derecho de desistimiento",
      withdrawalReadMore: "Leer la información sobre desistimiento",
      withdrawalConsentRequired: "Confirma el inicio inmediato para completar la suscripción.",
      features: [
        {
          icon: "✉",
          title: "Mensajes privados",
          body: "Escribe a invitados con los que saliste, para quedar.",
        },
        {
          icon: "✓",
          title: "Seguro y verificado",
          body: "Solo es posible con personas que demostrablemente hicieron check-in en el mismo local la misma noche — sin solicitudes de desconocidos.",
        },
      ],
    },
    premiumSuccess: {
      title: "Bienvenido a Premium",
      body: "Tu suscripción está activa. Puede tardar un momento en llegar la confirmación de tu proveedor de pago — recarga tu perfil si el estado aún no se ha actualizado.",
      button: "Ir a Premium",
    },
    premiumCancel: {
      title: "No pasa nada",
      body: "La compra se canceló. No se ha cobrado nada.",
      button: "Volver a Premium",
    },
  },
  ratingTags: {
    friendly: "Amable",
    punctual: "Puntual",
    big_spender: "Gran gasto",
    well_dressed: "Bien vestido",
    trouble: "Causó problemas",
    too_intoxicated: "Demasiado ebrio",
  },
  demo: {
    eyebrow: "En acción",
    title: "Cómo funciona VELVET.",
    intro: "Sin maquetas, sin palabrería de marketing — aquí ves cada flujo tal como ocurre en la app real, y justo debajo lees lo que pasa entretanto en segundo plano.",
    sections: [
      {
        key: "qr-checkin",
        eyebrow: "En la puerta",
        title: "El check-in QR",
        subtitle: "Del código de acceso al invitado reconocido — en menos de un segundo.",
        steps: [
          {
            n: "01",
            title: "Aparece el código",
            body: "En su perfil, el invitado toca «Mostrar código QR para entrar». Aparecen dos variantes del mismo acceso: un código QR para escanear y un número de 6 dígitos para leer en voz alta. Ambos son válidos durante 90 segundos y luego se renuevan automáticamente — nadie tiene que mantener la app abierta con prisas.",
          },
          {
            n: "02",
            title: "El personal lo lee",
            body: "En la puerta, el equipo abre el escáner — en la app o en la web, por ejemplo en una tablet o un terminal de quiosco. Si el escaneo falla (poca luz, mucha gente, la cámara no coopera), basta con introducir los 6 dígitos manualmente. Ambos caminos llevan al mismo resultado, en cualquier plataforma.",
          },
          {
            n: "03",
            title: "El perfil aparece al instante",
            body: "Foto, nombre, estado global (VIP, De confianza, Estándar, Vigilancia, Vetado) y el historial de visitas en ese local se muestran de inmediato — incluidas notas como «en la lista VIP» o «vetado», si las hay.",
          },
          {
            n: "04",
            title: "Válido una vez, y ya está",
            body: "Cada código funciona una sola vez. En cuanto se registra la entrada, el código se consume al instante — un segundo escaneo con el mismo código falla. Así una captura de pantalla no se puede reutilizar ni pasar a otra persona.",
          },
        ],
      },
      {
        key: "premium-match",
        eyebrow: "Después de la noche",
        title: "Premium Match",
        subtitle: "Escribe solo a personas con las que realmente saliste.",
        steps: [
          {
            n: "01",
            title: "Check-in compartido",
            body: "Dos invitados se registran la misma noche mediante el código QR en el mismo local. Con eso basta — no hace falta ninguna solicitud ni conexión previa entre ellos.",
          },
          {
            n: "02",
            title: "El match aparece automáticamente",
            body: "Con una membresía Premium activa, la sección «Mensajes» muestra automáticamente, bajo «¿Quién más salió esta noche?», a todos los invitados con un check-in compartido y verificado — con nombre, foto y local.",
          },
          {
            n: "03",
            title: "Escribir, no fisgonear",
            body: "Los mensajes solo son posibles entre coincidencias reales — no hay una lista de invitados abierta para curiosear ni solicitudes de desconocidos que nunca se registraron en la misma puerta.",
          },
          {
            n: "04",
            title: "Solo con Premium",
            body: "La función forma parte de la membresía Premium opcional y de pago para invitados (mensual o anual) — VELVET en sí sigue siendo gratuito para invitados y locales.",
          },
        ],
      },
      {
        key: "multi-venue",
        eyebrow: "Para operadores",
        title: "Varios locales, un inicio de sesión",
        subtitle: "Para marcas con más de un local — sin varias cuentas.",
        steps: [
          {
            n: "01",
            title: "Una cuenta, varios locales",
            body: "Si un equipo gestiona varios locales, todos están vinculados a un único inicio de sesión. Al iniciar sesión con acceso a varios locales, se pregunta brevemente con cuál se quiere trabajar.",
          },
          {
            n: "02",
            title: "Cambia en cualquier momento",
            body: "Un selector en la barra lateral permite cambiar el local activo en cualquier momento sin volver a iniciar sesión — la lista de invitados, el equipo y las cifras se actualizan según el local elegido.",
          },
          {
            n: "03",
            title: "Crea tú mismo un nuevo local",
            body: "Un miembro del equipo existente puede crear otro local directamente desde el panel — basta con el nombre y la dirección, y la cuenta queda registrada automáticamente como gerente de ese nuevo local.",
          },
          {
            n: "04",
            title: "Primero revisado, luego activo",
            body: "Un local recién creado empieza completamente bloqueado: sin check-in QR, sin valoraciones, no visible en la lista pública de locales. Solo se activa tras una revisión manual — así nadie puede añadir un local falso a la red sin que se note.",
          },
        ],
      },
      {
        key: "trust-score",
        eyebrow: "El camino del estado",
        title: "De una estrella a un estado",
        subtitle: "Cómo las valoraciones individuales se convierten en una reputación de toda la red.",
        steps: [
          {
            n: "01",
            title: "Valorar brevemente",
            body: "Tras una entrada registrada, el equipo puede enviar una valoración en cuestión de horas: estrellas (1–5) más rasgos opcionales como «Amable», «Puntual» o «Causó problemas» — todo el proceso dura unos 10 segundos.",
          },
          {
            n: "02",
            title: "Alimenta el estado global",
            body: "La valoración no cuenta solo para esa noche en ese local — alimenta el estado global del invitado en toda la red, junto con todas las valoraciones anteriores de cada local participante.",
          },
          {
            n: "03",
            title: "Cinco niveles, válidos en toda la red",
            body: "Del promedio acumulado resulta uno de cinco niveles: Vetado, Vigilancia, Estándar, De confianza o VIP. Cada nivel es visible al instante en cada puerta de la red, no solo donde se originó.",
          },
          {
            n: "04",
            title: "La confianza ganada se mantiene",
            body: "Un invitado no tiene que demostrar nada de nuevo en un local nuevo — la buena reputación viaja con él. A la inversa, un veto en un local es igual de visible en toda la red antes de que el invitado llegue a otra puerta.",
          },
        ],
      },
    ],
  },
  legal: {
    back: "Atrás",
    kontoLoeschen: {
      title: "Eliminar cuenta",
      sections: [
        {
          heading: "Eliminar en la app",
          paragraphs: [
            "Abre la app de VELVET e inicia sesión con tu cuenta de invitado.",
            "En la sección de perfil, toca «Eliminar cuenta» abajo y confirma el aviso.",
            "Tu cuenta se eliminará entonces de inmediato e irrevocablemente, y se cerrará tu sesión automáticamente.",
          ],
        },
        {
          heading: "Eliminar sin la app instalada",
          paragraphs: [
            "Si ya no tienes la app instalada, escríbenos a mail@velvet-network.app desde el correo con el que está registrada tu cuenta, con el asunto «Eliminar cuenta».",
            "Eliminaremos tu cuenta manualmente en unos pocos días y te lo confirmaremos por correo.",
          ],
        },
        {
          heading: "Qué se elimina",
          paragraphs: [
            "Tu perfil (nombre, correo electrónico, foto de perfil).",
            "Tu estado global y todas las valoraciones asociadas a tu cuenta.",
            "Tu historial de entradas (fecha y local de escaneos anteriores) y todas las relaciones con locales (visitas, notas locales).",
            "La eliminación es definitiva y afecta a todos los locales de la red, no solo a uno.",
          ],
        },
        {
          heading: "Nota para cuentas de seguridad y gerencia",
          paragraphs: [
            "Las cuentas de personal (seguridad, gerentes) no las gestionan los propios invitados, sino el local correspondiente. Para eliminar una cuenta de personal, contacta con la dirección de tu local o con mail@velvet-network.app.",
          ],
        },
      ],
    },
  },
  makingOf: {
    eyebrow: "Making Of",
    title: "¿Cuánto tiempo hay en VELVET?",
    intro: "El backend, la app móvil y el panel se crearon en un solo día — como referencia de lo rápido que se puede construir una plataforma completa y en producción con desarrollo asistido por IA.",
    devTimeLabel: "Tiempo de desarrollo activo estimado",
    devTimeValue: "~22,4 h",
    devTimeRange: "del 19 al 20 de agosto de 2026, hasta las 3:10",
    commitsLabel: "Commits",
    subsystemsLabel: "Subsistemas",
    workBlocksHeading: "Bloques de trabajo",
    commitSingular: "commit",
    commitPlural: "commits",
    sessions: [
      { range: "antes de la 1:16 (19.8.)", commits: 0, note: "Configuración del proyecto, estimado" },
      { range: "1:16 – 1:19", commits: 2 },
      { range: "7:17 – 7:50", commits: 2 },
      { range: "10:32 – 14:50", commits: 11 },
      { range: "17:27 – 18:21", commits: 3 },
      { range: "22:02 – 3:10 (20.8.)", commits: 18 },
    ],
    methodologyHeading: "Metodología",
    methodologyBody: "El tiempo se estima a partir de las marcas de tiempo de los commits de Git, con el mismo principio que la popular herramienta «git-hours»: si dos commits consecutivos distan menos de dos horas, el intervalo real cuenta como tiempo de trabajo — al fin y al cabo, entre commits también se escribe, se prueba y se piensa. Si el intervalo es mayor, empieza un nuevo bloque de trabajo, al que se le asignan dos horas de forma fija, ya que no se sabe cuánto se trabajó antes del primer commit de ese bloque. Además, se suman 1,5 horas por la configuración del proyecto antes del primer commit (estructura inicial del backend, la app y el panel, antes de que nada estuviera versionado). Es una aproximación, no un registro exacto del tiempo.",
  },
};

export const TRANSLATIONS: Record<Locale, Translations> = { de, en, pl, es };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "de" || value === "en" || value === "pl" || value === "es";
}

// Maps a raw device/browser language tag (e.g. "en-US", "de-DE", "fr") to one
// of our supported locales. Untagged/unsupported languages fall back to
// German, matching "German default" rather than trying to support every
// language on earth.
export function resolveDeviceLocale(languageTag: string | null | undefined): Locale {
  const primary = languageTag?.toLowerCase().split("-")[0];
  if (primary && isLocale(primary)) return primary;
  return DEFAULT_LOCALE;
}
