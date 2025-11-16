export type FamilyActivity = {
  id: string;
  title: string;
  description: string;
  category:
    | "Indoor"
    | "Outdoor"
    | "Kreativ"
    | "Spiel"
    | "Lernen"
    | "Kochen"
    | "Sport"
    | "Entspannung";
  duration: string; // "30 Min" | "1-2 Std" | "Ganzer Tag"
  ageGroup: string; // "Alle Altersgruppen" | "Ab 3 Jahren" | "Ab 6 Jahren"
  materials?: string; // "Papier, Stifte" | "Keine" | "Küchenzutaten"
  link?: string; // Optional: Link zu Anleitungen
  season?: "Frühling" | "Sommer" | "Herbst" | "Winter" | "Ganzjährig";
};

export const FAMILY_ACTIVITIES: FamilyActivity[] = [
  // Indoor Aktivitäten
  {
    id: "indoor_001",
    title: "Höhle aus Decken bauen",
    description:
      "Verwandelt das Wohnzimmer in eine gemütliche Höhle mit Decken, Kissen und Stühlen.",
    category: "Indoor",
    duration: "30-60 Min",
    ageGroup: "Alle Altersgruppen",
    materials: "Decken, Kissen, Stühle",
    season: "Ganzjährig",
  },
  {
    id: "indoor_002",
    title: "Familien-Karaoke",
    description:
      "Singt eure Lieblingslieder zusammen. YouTube Karaoke-Videos nutzen!",
    category: "Indoor",
    duration: "1-2 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Handy/Computer, evtl. Mikrofon",
    link: "https://www.youtube.com/results?search_query=karaoke+deutsch",
    season: "Ganzjährig",
  },
  {
    id: "indoor_003",
    title: "Familien-Puzzle Challenge",
    description:
      "Gemeinsam ein großes Puzzle lösen. Jeder bekommt eine Farbe/Bereich zugeteilt.",
    category: "Indoor",
    duration: "1-3 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Puzzle (500+ Teile)",
    season: "Ganzjährig",
  },
  {
    id: "indoor_004",
    title: "Socken-Basketball",
    description:
      "Socken zu Bällen rollen und in Wäschekörbe werfen. Verschiedene Schwierigkeitsgrade!",
    category: "Sport",
    duration: "20-30 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Socken, Wäschekörbe",
    season: "Ganzjährig",
  },
  {
    id: "indoor_005",
    title: "Familien-Fotoshooting",
    description:
      "Lustige Fotos mit selbstgemachten Requisiten und verrückten Posen.",
    category: "Kreativ",
    duration: "45 Min",
    ageGroup: "Alle Altersgruppen",
    materials: "Kamera/Handy, Verkleidungen",
    season: "Ganzjährig",
  },

  // Outdoor Aktivitäten
  {
    id: "outdoor_001",
    title: "Schatzsuche im Park",
    description:
      "Versteckt kleine Gegenstände oder erstellt Rätsel für eine spannende Schatzsuche.",
    category: "Outdoor",
    duration: "1-2 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Kleine Gegenstände, Zettel, Stift",
    season: "Frühling",
  },
  {
    id: "outdoor_002",
    title: "Familien-Spaziergang mit Foto-Challenge",
    description:
      "Jeder fotografiert 5 verschiedene Dinge: etwas Rundes, etwas Rotes, ein Tier...",
    category: "Outdoor",
    duration: "1-1.5 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Handy/Kamera, Liste mit Aufgaben",
    season: "Ganzjährig",
  },
  {
    id: "outdoor_003",
    title: "Drachen steigen lassen",
    description:
      "Selbst gebastelte oder gekaufte Drachen bei Wind steigen lassen.",
    category: "Outdoor",
    duration: "1-2 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Drachen oder Bastelmaterial",
    season: "Herbst",
  },
  {
    id: "outdoor_004",
    title: "Blätter sammeln und pressen",
    description:
      "Verschiedene Blätter sammeln und zuhause in einem Buch pressen für ein Herbarium.",
    category: "Lernen",
    duration: "45 Min draußen + Nacharbeit",
    ageGroup: "Ab 3 Jahren",
    materials: "Sammelbeutel, schweres Buch",
    season: "Herbst",
  },
  {
    id: "outdoor_005",
    title: "Wasserschlacht im Garten",
    description:
      "Mit Wasserpistolen, Ballons oder Gartenschlauch eine erfrischende Schlacht!",
    category: "Sport",
    duration: "30-60 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Wasserspielzeug, alte Kleidung",
    season: "Sommer",
  },

  // Kreative Aktivitäten
  {
    id: "creative_001",
    title: "Familien-Comic zeichnen",
    description: "Jeder zeichnet ein Panel einer gemeinsamen Comicgeschichte.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Papier, Stifte, Radiergummi",
    season: "Ganzjährig",
  },
  {
    id: "creative_002",
    title: "Salzteig-Figuren basteln",
    description:
      "Figuren aus Salzteig formen und bemalen. Rezept: 2 Tassen Mehl, 1 Tasse Salz, 1 Tasse Wasser.",
    category: "Kreativ",
    duration: "2-3 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Mehl, Salz, Wasser, Farben",
    link: "https://www.geo.de/geolino/basteln/15225-rtkl-basteln-salzteig-das-rezept",
    season: "Ganzjährig",
  },
  {
    id: "creative_003",
    title: "Origami lernen",
    description: "Einfache Papierfiguren falten: Kraniche, Boote, Blumen.",
    category: "Kreativ",
    duration: "30-60 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Buntes Papier",
    link: "https://www.origami-kunst.de/anleitungen/",
    season: "Ganzjährig",
  },
  {
    id: "creative_004",
    title: "Familien-Zeitkapsel erstellen",
    description:
      "Sammelt Erinnerungen, Fotos und Briefe für die Zukunft in einer Dose.",
    category: "Kreativ",
    duration: "1 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Dose/Box, Papier, Fotos",
    season: "Ganzjährig",
  },

  // Spiele
  {
    id: "game_001",
    title: "Familien-Bingo im Alltag",
    description:
      'Erstellt Bingo-Karten mit Alltagsdingen: "Katze gesehen", "Lächeln bekommen"...',
    category: "Spiel",
    duration: "Ganzer Tag",
    ageGroup: "Ab 4 Jahren",
    materials: "Papier, Stifte",
    season: "Ganzjährig",
  },
  {
    id: "game_002",
    title: "Pantomime-Raten",
    description:
      "Begriffe ohne Worte darstellen und erraten lassen. Themen: Tiere, Berufe, Filme.",
    category: "Spiel",
    duration: "30-45 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Zettel mit Begriffen",
    season: "Ganzjährig",
  },
  {
    id: "game_003",
    title: "Verstecken im Dunkeln",
    description: "Versteckspiel mit Taschenlampen, macht es extra spannend!",
    category: "Spiel",
    duration: "45 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Taschenlampen",
    season: "Ganzjährig",
  },

  // Lernaktivitäten
  {
    id: "learn_001",
    title: "Familien-Forschungsprojekt",
    description:
      "Wählt ein Thema (Dinosaurier, Weltall, Ozeane) und forscht gemeinsam dazu.",
    category: "Lernen",
    duration: "2-3 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Internet/Bücher, Papier",
    season: "Ganzjährig",
  },
  {
    id: "learn_002",
    title: "Sterne beobachten",
    description:
      "Bei klarer Nacht Sternbilder suchen und Geschichten dazu erfinden.",
    category: "Lernen",
    duration: "1 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Sternenkarte, evtl. Fernglas",
    link: "https://www.astrokramkiste.de/sternkarten",
    season: "Ganzjährig",
  },

  // Kochen & Backen
  {
    id: "cooking_001",
    title: "Pizza selbst belegen",
    description:
      "Jeder gestaltet seine eigene Mini-Pizza mit Lieblingszutaten.",
    category: "Kochen",
    duration: "1 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Pizzateig, verschiedene Beläge",
    season: "Ganzjährig",
  },
  {
    id: "cooking_002",
    title: "Plätzchen backen",
    description: "Gemeinsam Teig kneten, ausstechen und verzieren.",
    category: "Kochen",
    duration: "2-3 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Mehl, Butter, Zucker, Ausstechformen",
    season: "Winter",
  },
  {
    id: "cooking_003",
    title: "Smoothies mixen",
    description:
      "Gesunde Smoothies aus Obst und Gemüse zusammen mixen und testen.",
    category: "Kochen",
    duration: "30 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Obst, Mixer, Gläser",
    season: "Ganzjährig",
  },

  // Sport & Bewegung
  {
    id: "sport_001",
    title: "Familien-Yoga",
    description:
      "Einfache Yoga-Übungen für die ganze Familie. Online-Videos nutzen.",
    category: "Sport",
    duration: "20-30 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Yoga-Matten oder Decken",
    link: "https://www.youtube.com/results?search_query=familien+yoga+kinder",
    season: "Ganzjährig",
  },
  {
    id: "sport_002",
    title: "Hindernis-Parcours im Wohnzimmer",
    description:
      "Mit Kissen, Stühlen und Seilen einen Indoor-Parcours aufbauen.",
    category: "Sport",
    duration: "45 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Kissen, Stühle, Seile, Decken",
    season: "Ganzjährig",
  },

  // Entspannung
  {
    id: "relax_001",
    title: "Familien-Meditation",
    description:
      "Gemeinsam entspannen und zur Ruhe kommen mit geführter Meditation.",
    category: "Entspannung",
    duration: "15-20 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Ruhiger Raum, evtl. Musik",
    season: "Ganzjährig",
  },
  {
    id: "relax_002",
    title: "Vorlese-Marathon",
    description: "Jeder liest abwechselnd aus seinem Lieblingsbuch vor.",
    category: "Entspannung",
    duration: "1-2 Std",
    ageGroup: "Alle Altersgruppen",
    materials: "Bücher, gemütliche Ecke",
    season: "Ganzjährig",
  },

  // Weitere kreative Ideen
  {
    id: "creative_005",
    title: "Familien-Theater aufführen",
    description:
      "Ein kleines Theaterstück einstudieren und für Nachbarn/Großeltern aufführen.",
    category: "Kreativ",
    duration: "2-3 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Kostüme, einfache Requisiten",
    season: "Ganzjährig",
  },
  {
    id: "creative_006",
    title: "Steine bemalen",
    description:
      "Schöne Steine sammeln und mit Acrylfarben zu Kunstwerken gestalten.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Steine, Acrylfarben, Pinsel",
    season: "Ganzjährig",
  },

  // Weitere Indoor Aktivitäten
  {
    id: "indoor_006",
    title: "Papierflugzeug-Wettbewerb",
    description:
      "Verschiedene Papierflugzeug-Designs basteln und schauen, welches am weitesten fliegt.",
    category: "Indoor",
    duration: "45 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Papier, Lineal, evtl. Farben",
    season: "Ganzjährig",
  },
  {
    id: "indoor_007",
    title: "Schattentheater spielen",
    description:
      "Mit Taschenlampe und Laken ein eigenes Schattentheater aufführen.",
    category: "Indoor",
    duration: "1 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Taschenlampe, Laken, evtl. Figuren",
    season: "Ganzjährig",
  },
  {
    id: "indoor_008",
    title: "Familien-Memory mit eigenen Fotos",
    description:
      "Memory-Spiel mit ausgedruckten Familienfotos oder gemalten Bildern erstellen.",
    category: "Indoor",
    duration: "30-45 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Fotos, Karton, Schere, Kleber",
    season: "Ganzjährig",
  },
  {
    id: "indoor_009",
    title: "Kissenschlacht",
    description: "Gemütliche Kissenschlacht im Wohnzimmer mit Regeln.",
    category: "Indoor",
    duration: "15-20 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Weiche Kissen",
    season: "Ganzjährig",
  },
  {
    id: "indoor_010",
    title: "Verkleidungs-Modenschau",
    description:
      "Aus alten Kleidern und Accessoires eine Modenschau veranstalten.",
    category: "Indoor",
    duration: "1 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Alte Kleidung, Accessoires, Musik",
    season: "Ganzjährig",
  },

  // Weitere Outdoor Aktivitäten
  {
    id: "outdoor_006",
    title: "Steinmännchen bauen",
    description:
      "Kleine Türme aus Steinen stapeln und schauen, wer den höchsten baut.",
    category: "Outdoor",
    duration: "30-45 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Steine verschiedener Größen",
    season: "Ganzjährig",
  },
  {
    id: "outdoor_007",
    title: "Hüpfspiele mit Kreide",
    description:
      "Himmel und Hölle oder andere Hüpfspiele auf Asphalt malen.",
    category: "Outdoor",
    duration: "30-60 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Straßenkreide",
    season: "Frühling",
  },
  {
    id: "outdoor_008",
    title: "Naturmandala legen",
    description:
      "Aus gesammelten Naturmaterialien schöne Mandalas am Boden legen.",
    category: "Outdoor",
    duration: "45-60 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Gesammelte Naturmaterialien",
    season: "Herbst",
  },
  {
    id: "outdoor_009",
    title: "Seifenblasen-Party",
    description:
      "Riesenseifenblasen pusten und versuchen sie zu fangen.",
    category: "Outdoor",
    duration: "30-45 Min",
    ageGroup: "Ab 2 Jahren",
    materials: "Seifenblasenlösung, verschiedene Pustewerkzeuge",
    season: "Sommer",
  },
  {
    id: "outdoor_010",
    title: "Garten-Parcours",
    description:
      "Hindernisparcours im Garten mit Seilen, Hütchen und Sprungbrettern.",
    category: "Outdoor",
    duration: "1 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Seile, Hütchen, Bretter",
    season: "Ganzjährig",
  },

  // Kreative Aktivitäten erweitert
  {
    id: "creative_007",
    title: "Selbstgemachte Knete herstellen",
    description:
      "Knete aus Mehl, Salz, Öl und Lebensmittelfarbe selber machen.",
    category: "Kreativ",
    duration: "1 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Mehl, Salz, Öl, Lebensmittelfarbe",
    season: "Ganzjährig",
  },
  {
    id: "creative_008",
    title: "Marmorpapier herstellen",
    description:
      "Mit Rasierschaum und Farben wunderschöne Marmoreffekte auf Papier zaubern.",
    category: "Kreativ",
    duration: "45-60 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Rasierschaum, Farben, Papier",
    season: "Ganzjährig",
  },
  {
    id: "creative_009",
    title: "Freundschaftsarmbänder knüpfen",
    description: "Bunte Armbänder aus Wolle oder Garn für die Familie knüpfen.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Bunte Wolle, Schere",
    season: "Ganzjährig",
  },
  {
    id: "creative_010",
    title: "Collage aus Zeitschriften",
    description:
      "Aus alten Zeitschriften Bilder ausschneiden und Traumcollagen erstellen.",
    category: "Kreativ",
    duration: "1 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Alte Zeitschriften, Schere, Kleber, Papier",
    season: "Ganzjährig",
  },

  // Spiele erweitert
  {
    id: "game_004",
    title: "Ich sehe was, was du nicht siehst",
    description:
      "Klassisches Ratespiel für drinnen und draußen, trainiert Beobachtung.",
    category: "Spiel",
    duration: "15-30 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Keine",
    season: "Ganzjährig",
  },
  {
    id: "game_005",
    title: "Geschichten-Würfel",
    description:
      "Mit selbstgebastelten Würfeln mit Bildern gemeinsam Geschichten erfinden.",
    category: "Spiel",
    duration: "30-45 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Würfel, Bilder/Sticker",
    season: "Ganzjährig",
  },
  {
    id: "game_006",
    title: "Stille Post",
    description:
      "Nachricht von Ohr zu Ohr weitergeben und schauen, was am Ende ankommt.",
    category: "Spiel",
    duration: "15-20 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Keine",
    season: "Ganzjährig",
  },
  {
    id: "game_007",
    title: "Stopp-Tanz",
    description:
      "Zur Musik tanzen, bei Stopp sofort einfrieren - wer wackelt, scheidet aus.",
    category: "Spiel",
    duration: "20-30 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Musik/Handy",
    season: "Ganzjährig",
  },

  // Lernen erweitert
  {
    id: "learn_003",
    title: "Vogelstimmen erkennen",
    description:
      "Mit einer App verschiedene Vogelstimmen in der Natur identifizieren.",
    category: "Lernen",
    duration: "45-60 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Handy mit Vogel-App",
    season: "Frühling",
  },
  {
    id: "learn_004",
    title: "Familien-Stammbaum erstellen",
    description:
      "Gemeinsam einen Familienstammbaum zeichnen und Geschichten zu Verwandten erzählen.",
    category: "Lernen",
    duration: "1-2 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Großes Papier, Stifte, Fotos",
    season: "Ganzjährig",
  },
  {
    id: "learn_005",
    title: "Experimente mit Wasser",
    description:
      "Einfache Wasserexperimente: schwimmt/sinkt, Oberflächenspannung testen.",
    category: "Lernen",
    duration: "45 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Wasser, verschiedene Gegenstände",
    season: "Ganzjährig",
  },

  // Kochen & Backen erweitert
  {
    id: "cooking_004",
    title: "Obstsalat zubereiten",
    description: "Bunten Obstsalat gemeinsam schneiden und anrichten.",
    category: "Kochen",
    duration: "30 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Verschiedenes Obst, Messer (kindersicher)",
    season: "Ganzjährig",
  },
  {
    id: "cooking_005",
    title: "Pancakes backen",
    description: "Leckere Pfannkuchen braten und kreativ verzieren.",
    category: "Kochen",
    duration: "45 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Mehl, Eier, Milch, Pfanne",
    season: "Ganzjährig",
  },
  {
    id: "cooking_006",
    title: "Gesunde Energy Balls",
    description:
      "Aus Datteln, Nüssen und Kakao gesunde Süßigkeiten rollen.",
    category: "Kochen",
    duration: "30-45 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Datteln, Nüsse, Kakao",
    season: "Ganzjährig",
  },

  // Sport & Bewegung erweitert
  {
    id: "sport_003",
    title: "Familien-Tanzparty",
    description: "Zu Lieblingsmusik tanzen und neue Moves erfinden.",
    category: "Sport",
    duration: "30-45 Min",
    ageGroup: "Alle Altersgruppen",
    materials: "Musik, Platz zum Tanzen",
    season: "Ganzjährig",
  },
  {
    id: "sport_004",
    title: "Luftballon-Volleyball",
    description:
      "Mit Luftballons Volleyball spielen - fällt langsamer, perfekt für Kinder.",
    category: "Sport",
    duration: "30 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Luftballons",
    season: "Ganzjährig",
  },
  {
    id: "sport_005",
    title: "Familien-Stretching",
    description: "Gemeinsam dehnen und entspannen nach dem Tag.",
    category: "Sport",
    duration: "15-20 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Matten oder Decken",
    season: "Ganzjährig",
  },

  // Entspannung erweitert
  {
    id: "relax_003",
    title: "Hörbuch-Zeit",
    description: "Gemeinsam einem spannenden Hörbuch lauschen.",
    category: "Entspannung",
    duration: "30-60 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Hörbuch, gemütliche Sitzgelegenheit",
    season: "Ganzjährig",
  },
  {
    id: "relax_004",
    title: "Massage-Kette",
    description:
      "Alle sitzen hintereinander und massieren den Rücken des Vordermanns.",
    category: "Entspannung",
    duration: "15-20 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Keine",
    season: "Ganzjährig",
  },

  // Zusätzliche saisonale Aktivitäten
  {
    id: "seasonal_001",
    title: "Schneemann bauen",
    description: "Klassischen Schneemann mit Karotte und Steinen bauen.",
    category: "Outdoor",
    duration: "1-2 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Schnee, Karotte, Steine, alte Kleidung",
    season: "Winter",
  },
  {
    id: "seasonal_002",
    title: "Ostereier färben",
    description: "Eier mit Naturfarben oder Farbtabletten bunt färben.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Eier, Farben, Essig",
    season: "Frühling",
  },
  {
    id: "seasonal_003",
    title: "Kürbis schnitzen",
    description: "Gruselige oder lustige Gesichter in Kürbisse schnitzen.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Kürbis, Messer, Löffel, Kerzen",
    season: "Herbst",
  },
  {
    id: "seasonal_004",
    title: "Lebkuchenhaus backen",
    description: "Süßes Lebkuchenhaus zur Weihnachtszeit zusammenbauen.",
    category: "Kochen",
    duration: "2-3 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Lebkuchen, Zuckerguss, Süßigkeiten",
    season: "Winter",
  },

  // Musik & Kunst
  {
    id: "music_001",
    title: "Familien-Band gründen",
    description:
      "Mit selbstgebastelten oder echten Instrumenten Musik machen.",
    category: "Kreativ",
    duration: "45-60 Min",
    ageGroup: "Ab 3 Jahren",
    materials: "Instrumente oder Bastelmaterial",
    season: "Ganzjährig",
  },
  {
    id: "music_002",
    title: "Lieder-Raten",
    description: "Melodien summen oder pfeifen und raten lassen.",
    category: "Spiel",
    duration: "20-30 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Keine",
    season: "Ganzjährig",
  },

  // Natur & Umwelt
  {
    id: "nature_001",
    title: "Insektenhotel bauen",
    description:
      "Aus Naturmaterialien ein Hotel für Insekten im Garten bauen.",
    category: "Lernen",
    duration: "1-2 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Holz, Stroh, Bambus, Bohrer",
    season: "Frühling",
  },
  {
    id: "nature_002",
    title: "Pflanzen züchten",
    description: "Kresse, Bohnen oder Kräuter auf der Fensterbank ziehen.",
    category: "Lernen",
    duration: "5 Min täglich über Wochen",
    ageGroup: "Ab 4 Jahren",
    materials: "Samen, Erde, Töpfe",
    season: "Ganzjährig",
  },
  {
    id: "nature_003",
    title: "Wetter beobachten",
    description:
      "Täglich Wetter dokumentieren und Wolkenarten bestimmen.",
    category: "Lernen",
    duration: "15 Min täglich",
    ageGroup: "Ab 5 Jahren",
    materials: "Notizbuch, Stift, Wetter-App",
    season: "Ganzjährig",
  },

  // Technik & Digital
  {
    id: "tech_001",
    title: "Stop-Motion Film drehen",
    description:
      "Mit Handy/Tablet einen kleinen Trickfilm mit Spielzeug erstellen.",
    category: "Kreativ",
    duration: "2-3 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Handy/Tablet, Spielzeug, App",
    season: "Ganzjährig",
  },
  {
    id: "tech_002",
    title: "QR-Code Schatzsuche",
    description: "Schatzsuche mit selbsterstellten QR-Codes als Hinweise.",
    category: "Spiel",
    duration: "1-2 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Handy, QR-Code Generator",
    season: "Ganzjährig",
  },

  // Abenteuer & Entdeckung
  {
    id: "adventure_001",
    title: "Nachtwanderung",
    description: "Mit Taschenlampen eine kleine Wanderung in der Dunkelheit.",
    category: "Outdoor",
    duration: "45-60 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Taschenlampen, warme Kleidung",
    season: "Ganzjährig",
  },
  {
    id: "adventure_002",
    title: "Geocaching für Anfänger",
    description: "Moderne Schatzsuche mit GPS-Koordinaten in der Umgebung.",
    category: "Outdoor",
    duration: "1-3 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Handy mit GPS, Geocaching-App",
    season: "Ganzjährig",
  },
  {
    id: "adventure_003",
    title: "Campingnacht im Wohnzimmer",
    description: "Mit Schlafsäcken und Taschenlampen im Zelt übernachten.",
    category: "Indoor",
    duration: "Ganze Nacht",
    ageGroup: "Ab 4 Jahren",
    materials: "Zelt oder Decken, Schlafsäcke",
    season: "Ganzjährig",
  },

  // Handwerk & Bauen
  {
    id: "craft_001",
    title: "Vogelhaus bauen",
    description: "Einfaches Vogelhaus aus Holz zusammenbauen.",
    category: "Kreativ",
    duration: "2-3 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Holzbretter, Nägel, Hammer, Säge",
    season: "Herbst",
  },
  {
    id: "craft_002",
    title: "Seife selber machen",
    description: "Duftende Seifen aus Seifenbasis und ätherischen Ölen gießen.",
    category: "Kreativ",
    duration: "1 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Seifenbasis, Duftöle, Formen",
    season: "Ganzjährig",
  },

  // Gemeinschaft & Helfen
  {
    id: "community_001",
    title: "Nachbarn überraschen",
    description:
      "Kleine Aufmerksamkeiten für Nachbarn basteln und verteilen.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Bastelmaterial, kleine Geschenke",
    season: "Ganzjährig",
  },
  {
    id: "community_002",
    title: "Müll sammeln im Park",
    description: "Gemeinsam die Umgebung säubern und Umweltbewusstsein stärken.",
    category: "Outdoor",
    duration: "1 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Handschuhe, Müllsäcke",
    season: "Ganzjährig",
  },

  // Wissenschaft & Experimente
  {
    id: "science_001",
    title: "Vulkan-Experiment",
    description:
      "Mit Backpulver und Essig einen sprudelnden Vulkan bauen.",
    category: "Lernen",
    duration: "30-45 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Backpulver, Essig, Lebensmittelfarbe",
    season: "Ganzjährig",
  },
  {
    id: "science_002",
    title: "Kristalle züchten",
    description: "Salzwasser-Kristalle über mehrere Tage wachsen lassen.",
    category: "Lernen",
    duration: "5 Min täglich über Wochen",
    ageGroup: "Ab 6 Jahren",
    materials: "Salz, Wasser, Faden, Glas",
    season: "Ganzjährig",
  },

  // Sport & Bewegung draußen
  {
    id: "outdoor_sport_001",
    title: "Familien-Fußball",
    description: "Kleines Fußballspiel im Park oder Garten.",
    category: "Sport",
    duration: "45-60 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Fußball, evtl. Tore",
    season: "Ganzjährig",
  },
  {
    id: "outdoor_sport_002",
    title: "Frisbee spielen",
    description: "Frisbee werfen und fangen im Park üben.",
    category: "Sport",
    duration: "30-45 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Frisbee",
    season: "Ganzjährig",
  },

  // Entspannung & Achtsamkeit
  {
    id: "mindful_001",
    title: "Atemübungen für Kinder",
    description: "Spielerische Atemtechniken wie 'Blume riechen, Kerze auspusten'.",
    category: "Entspannung",
    duration: "10-15 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Keine",
    season: "Ganzjährig",
  },
  {
    id: "mindful_002",
    title: "Dankbarkeits-Runde",
    description: "Jeder erzählt, wofür er heute dankbar ist.",
    category: "Entspannung",
    duration: "15-20 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Keine",
    season: "Ganzjährig",
  },

  // Weitere kreative Ideen
  {
    id: "creative_011",
    title: "Traumfänger basteln",
    description: "Indianische Traumfänger aus Ästen und Wolle basteln.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Äste, Wolle, Federn, Perlen",
    season: "Ganzjährig",
  },
  {
    id: "creative_012",
    title: "Batik-Shirts färben",
    description: "Alte weiße T-Shirts mit Batik-Technik neu gestalten.",
    category: "Kreativ",
    duration: "2-3 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Weiße T-Shirts, Textilfarbe, Gummibänder",
    season: "Sommer",
  },

  // Kochen international
  {
    id: "cooking_007",
    title: "Sushi-Rollen selber machen",
    description: "Einfache Maki-Rollen mit Gurke und Avocado rollen.",
    category: "Kochen",
    duration: "1-2 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Sushi-Reis, Nori, Gemüse, Bambusmatte",
    season: "Ganzjährig",
  },
  {
    id: "cooking_008",
    title: "Pizza aus aller Welt",
    description: "Verschiedene internationale Pizza-Varianten ausprobieren.",
    category: "Kochen",
    duration: "1-2 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Pizzateig, verschiedene Beläge",
    season: "Ganzjährig",
  },

  // Spiele aus aller Welt
  {
    id: "world_games_001",
    title: "Mikado selbst basteln",
    description: "Stäbchen bemalen und das klassische Geschicklichkeitsspiel spielen.",
    category: "Spiel",
    duration: "1 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Holzstäbchen, Farben",
    season: "Ganzjährig",
  },
  {
    id: "world_games_002",
    title: "Afrikanisches Kalaha",
    description: "Traditionelles Strategiespiel mit Steinen und Mulden spielen.",
    category: "Spiel",
    duration: "30-45 Min",
    ageGroup: "Ab 8 Jahren",
    materials: "Kalaha-Brett oder selbstgebastelt",
    season: "Ganzjährig",
  },

  // Weitere Outdoor-Aktivitäten
  {
    id: "outdoor_011",
    title: "Sterne fotografieren",
    description: "Bei klarer Nacht versuchen, Sterne mit dem Handy zu fotografieren.",
    category: "Outdoor",
    duration: "1-2 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Handy mit Kamera, Stativ",
    season: "Ganzjährig",
  },
  {
    id: "outdoor_012",
    title: "Boote aus Naturmaterialien",
    description: "Kleine Boote aus Ästen und Blättern bauen und schwimmen lassen.",
    category: "Outdoor",
    duration: "1 Std",
    ageGroup: "Ab 4 Jahren",
    materials: "Äste, Blätter, Bach oder Pfütze",
    season: "Frühling",
  },

  // Mehr Lernaktivitäten
  {
    id: "learn_006",
    title: "Morse-Code lernen",
    description: "Geheime Nachrichten mit Morse-Code schreiben und entschlüsseln.",
    category: "Lernen",
    duration: "45-60 Min",
    ageGroup: "Ab 8 Jahren",
    materials: "Morse-Alphabet, Taschenlampe",
    season: "Ganzjährig",
  },
  {
    id: "learn_007",
    title: "Uhrzeit spielerisch lernen",
    description: "Mit selbstgebastelter Uhr die Zeit lernen und üben.",
    category: "Lernen",
    duration: "45 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Pappteller, Zeiger, Musterbeutelklammer",
    season: "Ganzjährig",
  },

  // Weitere Entspannungsaktivitäten
  {
    id: "relax_005",
    title: "Progressive Muskelentspannung",
    description: "Einfache Entspannungsübungen für die ganze Familie.",
    category: "Entspannung",
    duration: "20-30 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Ruhiger Raum, evtl. entspannende Musik",
    season: "Ganzjährig",
  },
  {
    id: "relax_006",
    title: "Familien-Teestunde",
    description: "Gemeinsam verschiedene Tees probieren und zur Ruhe kommen.",
    category: "Entspannung",
    duration: "30-45 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "verschiedene Tees, Honig, Kekse",
    season: "Ganzjährig",
  },

  // Zusätzliche Indoor-Aktivitäten
  {
    id: "indoor_011",
    title: "Wohnzimmer-Disco",
    description: "Mit bunten Lichtern und lauter Musik eine echte Disco feiern.",
    category: "Indoor",
    duration: "1 Std",
    ageGroup: "Ab 3 Jahren",
    materials: "Musik, bunte Lichter/Taschenlampen",
    season: "Ganzjährig",
  },
  {
    id: "indoor_012",
    title: "Familien-Quizshow",
    description: "Eigene Quizshow mit Fragen über die Familie veranstalten.",
    category: "Indoor",
    duration: "45-60 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Vorbereitet Fragen, evtl. Preise",
    season: "Ganzjährig",
  },

  // Mehr Kochaktivitäten
  {
    id: "cooking_009",
    title: "Kräuterbutter selbst machen",
    description: "Frische Kräuter sammeln und leckere Kräuterbutter zubereiten.",
    category: "Kochen",
    duration: "30 Min",
    ageGroup: "Ab 5 Jahren",
    materials: "Butter, frische Kräuter, Salz",
    season: "Sommer",
  },
  {
    id: "cooking_010",
    title: "Popcorn aromatisieren",
    description: "Popcorn selber machen und mit verschiedenen Gewürzen verfeinern.",
    category: "Kochen",
    duration: "20-30 Min",
    ageGroup: "Ab 6 Jahren",
    materials: "Popcorn-Mais, Pfanne, verschiedene Gewürze",
    season: "Ganzjährig",
  },

  // Noch mehr kreative Ideen
  {
    id: "creative_013",
    title: "Windspiele basteln",
    description: "Aus Naturmaterialien oder Metall klingende Windspiele bauen.",
    category: "Kreativ",
    duration: "1-2 Std",
    ageGroup: "Ab 6 Jahren",
    materials: "Äste, Metall, Schnur, evtl. Glocken",
    season: "Ganzjährig",
  },
  {
    id: "creative_014",
    title: "Fingerpuppen nähen",
    description: "Kleine Fingerpuppen aus Filz nähen und Geschichten spielen.",
    category: "Kreativ",
    duration: "2-3 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Filz, Nadel, Faden, kleine Knöpfe",
    season: "Ganzjährig",
  },

  // Weitere Sportaktivitäten
  {
    id: "sport_006",
    title: "Familien-Olympiade",
    description: "Verschiedene lustige Wettkämpfe veranstalten mit Siegerehrung.",
    category: "Sport",
    duration: "2-3 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Verschiedene Sportgeräte, selbstgebastelte Medaillen",
    season: "Ganzjährig",
  },
  {
    id: "sport_007",
    title: "Balance-Training",
    description: "Auf Balken, Seilen oder Linien balancieren lernen.",
    category: "Sport",
    duration: "30-45 Min",
    ageGroup: "Ab 4 Jahren",
    materials: "Balken, Seil oder Kreidestrich",
    season: "Ganzjährig",
  },

  // Weitere Naturaktivitäten
  {
    id: "nature_004",
    title: "Tierspuren suchen",
    description: "Im Wald oder Park nach Tierspuren und Fährten suchen.",
    category: "Lernen",
    duration: "1-2 Std",
    ageGroup: "Ab 5 Jahren",
    materials: "Spurenführer, evtl. Gips für Abdrücke",
    season: "Ganzjährig",
  },
  {
    id: "nature_005",
    title: "Wetterstation bauen",
    description: "Einfache Wetterstation mit Regenmesser und Windrichtungsanzeiger.",
    category: "Lernen",
    duration: "2-3 Std",
    ageGroup: "Ab 8 Jahren",
    materials: "Plastikflasche, Holzstab, Pappe",
    season: "Ganzjährig",
  }
];
