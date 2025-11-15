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

  // ... hier können später weitere 150+ Aktivitäten ergänzt werden
];
