// 100 Achievement definitions with icons (using Heroicons outline)
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string; // Heroicon name
  requirement: {
    type:
      | "tasks_completed"
      | "points_earned"
      | "task_streak"
      | "single_task_count"
      | "wishes_redeemed"
      | "points_transferred"
      | "login_streak"
      | "special";
    target: number;
    taskId?: string; // for single_task_count
  };
};

export const ACHIEVEMENTS: Achievement[] = [
  // Tasks Completed
  {
    id: "tasks_1",
    title: "Erste Schritte",
    description: "5 Aufgaben erledigt",
    icon: "CheckCircleIcon",
    requirement: { type: "tasks_completed", target: 5 },
  },
  {
    id: "tasks_5",
    title: "Fleißig",
    description: "5 Aufgaben erledigt",
    icon: "CheckBadgeIcon",
    requirement: { type: "tasks_completed", target: 5 },
  },
  {
    id: "tasks_10",
    title: "Engagiert",
    description: "10 Aufgaben erledigt",
    icon: "SparklesIcon",
    requirement: { type: "tasks_completed", target: 10 },
  },
  {
    id: "tasks_25",
    title: "Motiviert",
    description: "25 Aufgaben erledigt",
    icon: "FireIcon",
    requirement: { type: "tasks_completed", target: 25 },
  },
  {
    id: "tasks_50",
    title: "Halb-Profi",
    description: "50 Aufgaben erledigt",
    icon: "TrophyIcon",
    requirement: { type: "tasks_completed", target: 50 },
  },
  {
    id: "tasks_100",
    title: "Jahrhundert-Held",
    description: "100 Aufgaben erledigt",
    icon: "StarIcon",
    requirement: { type: "tasks_completed", target: 100 },
  },
  {
    id: "tasks_250",
    title: "Aufgaben-Meister",
    description: "250 Aufgaben erledigt",
    icon: "BoltIcon",
    requirement: { type: "tasks_completed", target: 250 },
  },
  {
    id: "tasks_500",
    title: "Unstoppable",
    description: "500 Aufgaben erledigt",
    icon: "RocketLaunchIcon",
    requirement: { type: "tasks_completed", target: 500 },
  },
  {
    id: "tasks_1000",
    title: "Legende",
    description: "1000 Aufgaben erledigt",
    icon: "TrophyIcon",
    requirement: { type: "tasks_completed", target: 1000 },
  },
  {
    id: "tasks_2500",
    title: "Mythos",
    description: "2500 Aufgaben erledigt",
    icon: "ShieldCheckIcon",
    requirement: { type: "tasks_completed", target: 2500 },
  },

  // Points Earned
  {
    id: "points_10",
    title: "Erstes Taschengeld",
    description: "10 Punkte verdient",
    icon: "BanknotesIcon",
    requirement: { type: "points_earned", target: 10 },
  },
  {
    id: "points_50",
    title: "Sparer",
    description: "50 Punkte verdient",
    icon: "CurrencyDollarIcon",
    requirement: { type: "points_earned", target: 50 },
  },
  {
    id: "points_100",
    title: "Dreistellig",
    description: "100 Punkte verdient",
    icon: "ChartBarIcon",
    requirement: { type: "points_earned", target: 100 },
  },
  {
    id: "points_250",
    title: "Gut dabei",
    description: "250 Punkte verdient",
    icon: "ArrowTrendingUpIcon",
    requirement: { type: "points_earned", target: 250 },
  },
  {
    id: "points_500",
    title: "Halbes Tausend",
    description: "500 Punkte verdient",
    icon: "PresentationChartLineIcon",
    requirement: { type: "points_earned", target: 500 },
  },
  {
    id: "points_1000",
    title: "Tausender",
    description: "1000 Punkte verdient",
    icon: "StarIcon",
    requirement: { type: "points_earned", target: 1000 },
  },
  {
    id: "points_2500",
    title: "Punkte-Magnat",
    description: "2500 Punkte verdient",
    icon: "BuildingLibraryIcon",
    requirement: { type: "points_earned", target: 2500 },
  },
  {
    id: "points_5000",
    title: "Fünf-Tausender",
    description: "5000 Punkte verdient",
    icon: "BanknotesIcon",
    requirement: { type: "points_earned", target: 5000 },
  },
  {
    id: "points_10000",
    title: "Zehn-Tausender",
    description: "10000 Punkte verdient",
    icon: "TrophyIcon",
    requirement: { type: "points_earned", target: 10000 },
  },
  {
    id: "points_25000",
    title: "Punkte-König",
    description: "25000 Punkte verdient",
    icon: "ShieldCheckIcon",
    requirement: { type: "points_earned", target: 25000 },
  },

  // Task Streaks (days in a row)
  {
    id: "streak_3",
    title: "3-Tage-Streak",
    description: "3 Tage hintereinander Aufgaben erledigt",
    icon: "CalendarIcon",
    requirement: { type: "task_streak", target: 3 },
  },
  {
    id: "streak_7",
    title: "Wochenlang",
    description: "7 Tage hintereinander Aufgaben erledigt",
    icon: "CalendarDaysIcon",
    requirement: { type: "task_streak", target: 7 },
  },
  {
    id: "streak_14",
    title: "Zwei-Wochen-Power",
    description: "14 Tage hintereinander Aufgaben erledigt",
    icon: "FireIcon",
    requirement: { type: "task_streak", target: 14 },
  },
  {
    id: "streak_30",
    title: "Monats-Marathon",
    description: "30 Tage hintereinander Aufgaben erledigt",
    icon: "BoltIcon",
    requirement: { type: "task_streak", target: 30 },
  },
  {
    id: "streak_60",
    title: "Zwei-Monats-Champion",
    description: "60 Tage hintereinander Aufgaben erledigt",
    icon: "TrophyIcon",
    requirement: { type: "task_streak", target: 60 },
  },
  {
    id: "streak_100",
    title: "Hundert-Tage-Held",
    description: "100 Tage hintereinander Aufgaben erledigt",
    icon: "StarIcon",
    requirement: { type: "task_streak", target: 100 },
  },
  {
    id: "streak_365",
    title: "Jahres-Legende",
    description: "365 Tage hintereinander Aufgaben erledigt",
    icon: "ShieldCheckIcon",
    requirement: { type: "task_streak", target: 365 },
  },

  // Single Task Repeated
  {
    id: "repeat_5",
    title: "Gewohnheitstier",
    description: "Eine Aufgabe 5x erledigt",
    icon: "ArrowPathIcon",
    requirement: { type: "single_task_count", target: 5 },
  },
  {
    id: "repeat_10",
    title: "Routine-Meister",
    description: "Eine Aufgabe 10x erledigt",
    icon: "ArrowPathRoundedSquareIcon",
    requirement: { type: "single_task_count", target: 10 },
  },
  {
    id: "repeat_25",
    title: "Wiederholungs-König",
    description: "Eine Aufgabe 25x erledigt",
    icon: "ArrowsRightLeftIcon",
    requirement: { type: "single_task_count", target: 25 },
  },
  {
    id: "repeat_50",
    title: "Halb-Hundert",
    description: "Eine Aufgabe 50x erledigt",
    icon: "CheckIcon",
    requirement: { type: "single_task_count", target: 50 },
  },
  {
    id: "repeat_100",
    title: "Jahrhundert-Routine",
    description: "Eine Aufgabe 100x erledigt",
    icon: "TrophyIcon",
    requirement: { type: "single_task_count", target: 100 },
  },

  // Wishes Redeemed
  {
    id: "wish_1",
    title: "Erster Wunsch",
    description: "1 Wunsch eingelöst",
    icon: "GiftIcon",
    requirement: { type: "wishes_redeemed", target: 1 },
  },
  {
    id: "wish_3",
    title: "Wunsch-Sammler",
    description: "3 Wünsche eingelöst",
    icon: "HeartIcon",
    requirement: { type: "wishes_redeemed", target: 3 },
  },
  {
    id: "wish_5",
    title: "Wunsch-Jäger",
    description: "5 Wünsche eingelöst",
    icon: "SparklesIcon",
    requirement: { type: "wishes_redeemed", target: 5 },
  },
  {
    id: "wish_10",
    title: "Wunsch-Erfüller",
    description: "10 Wünsche eingelöst",
    icon: "StarIcon",
    requirement: { type: "wishes_redeemed", target: 10 },
  },

  // Points Transferred (generosity)
  {
    id: "transfer_50",
    title: "Großzügig",
    description: "50 Punkte verschenkt",
    icon: "HandRaisedIcon",
    requirement: { type: "points_transferred", target: 50 },
  },
  {
    id: "transfer_100",
    title: "Wohltäter",
    description: "100 Punkte verschenkt",
    icon: "HeartIcon",
    requirement: { type: "points_transferred", target: 100 },
  },
  {
    id: "transfer_250",
    title: "Philanthrop",
    description: "250 Punkte verschenkt",
    icon: "UserGroupIcon",
    requirement: { type: "points_transferred", target: 250 },
  },
  {
    id: "transfer_500",
    title: "Mäzen",
    description: "500 Punkte verschenkt",
    icon: "ShieldCheckIcon",
    requirement: { type: "points_transferred", target: 500 },
  },

  // Special Achievements
  {
    id: "special_first_login",
    title: "Willkommen!",
    description: "Erstes Login",
    icon: "UserPlusIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "special_first_task",
    title: "Debütant",
    description: "Erste Aufgabe angelegt",
    icon: "DocumentPlusIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "special_first_wish",
    title: "Träumer",
    description: "Ersten Wunsch angelegt",
    icon: "LightBulbIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "special_perfect_day",
    title: "Perfekter Tag",
    description: "Alle fälligen Aufgaben an einem Tag erledigt",
    icon: "SunIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "special_early_bird",
    title: "Frühaufsteher",
    description: "Aufgabe vor 6 Uhr morgens erledigt",
    icon: "ClockIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "special_night_owl",
    title: "Nachteule",
    description: "Aufgabe nach 22 Uhr erledigt",
    icon: "MoonIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "special_weekend_warrior",
    title: "Wochenend-Krieger",
    description: "Am Wochenende 5 Aufgaben erledigt",
    icon: "CalendarIcon",
    requirement: { type: "special", target: 5 },
  },
  {
    id: "special_team_player",
    title: "Teamplayer",
    description: "10 Punktetransfers durchgeführt",
    icon: "UserGroupIcon",
    requirement: { type: "special", target: 10 },
  },

  // More Creative Achievements (50-100)
  {
    id: "creative_1",
    title: "Saubermann",
    description: "Alle Putz-Aufgaben in einem Monat erledigt",
    icon: "SparklesIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "creative_2",
    title: "Gärtner",
    description: "10 Garten-Aufgaben erledigt",
    icon: "HomeModernIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "creative_3",
    title: "Koch",
    description: "10 Küchen-Aufgaben erledigt",
    icon: "CakeIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "creative_4",
    title: "Organisator",
    description: "5 Termine im Kalender angelegt",
    icon: "CalendarDaysIcon",
    requirement: { type: "special", target: 5 },
  },
  {
    id: "creative_5",
    title: "Rezept-Sammler",
    description: "10 Rezepte angelegt",
    icon: "BookOpenIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "creative_6",
    title: "Einkaufs-Profi",
    description: "20 Einkaufslisten-Einträge generiert",
    icon: "ShoppingCartIcon",
    requirement: { type: "special", target: 20 },
  },
  {
    id: "creative_7",
    title: "Schnellschuss",
    description: "Aufgabe in unter 1 Minute erledigt (nach Zuweisung)",
    icon: "BoltIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "creative_8",
    title: "Multitasker",
    description: "5 Aufgaben an einem Tag erledigt",
    icon: "Squares2X2Icon",
    requirement: { type: "special", target: 5 },
  },
  {
    id: "creative_9",
    title: "Disziplin",
    description: "Nie eine Aufgabe übersprungen (30 Tage)",
    icon: "ShieldCheckIcon",
    requirement: { type: "special", target: 30 },
  },
  {
    id: "creative_10",
    title: "Sozial",
    description: "5 verschiedenen Mitgliedern Punkte geschenkt",
    icon: "UsersIcon",
    requirement: { type: "special", target: 5 },
  },

  // Level-Based (61-70)
  {
    id: "level_5",
    title: "Level 5",
    description: "Level 5 erreicht",
    icon: "ChevronUpIcon",
    requirement: { type: "special", target: 5 },
  },
  {
    id: "level_10",
    title: "Level 10",
    description: "Level 10 erreicht",
    icon: "ChevronDoubleUpIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "level_25",
    title: "Level 25",
    description: "Level 25 erreicht",
    icon: "ArrowUpIcon",
    requirement: { type: "special", target: 25 },
  },
  {
    id: "level_50",
    title: "Level 50",
    description: "Level 50 erreicht",
    icon: "ArrowUpCircleIcon",
    requirement: { type: "special", target: 50 },
  },
  {
    id: "level_100",
    title: "Level 100",
    description: "Level 100 erreicht",
    icon: "TrophyIcon",
    requirement: { type: "special", target: 100 },
  },

  // Community & Social (71-80)
  {
    id: "social_1",
    title: "Einlader",
    description: "1 Mitglied eingeladen",
    icon: "UserPlusIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "social_2",
    title: "Recruiter",
    description: "3 Mitglieder eingeladen",
    icon: "UsersIcon",
    requirement: { type: "special", target: 3 },
  },
  {
    id: "social_3",
    title: "Community-Builder",
    description: "5 Mitglieder eingeladen",
    icon: "UserGroupIcon",
    requirement: { type: "special", target: 5 },
  },
  {
    id: "social_4",
    title: "Admin-Helfer",
    description: "10 Admin-Aktionen durchgeführt",
    icon: "Cog6ToothIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "social_5",
    title: "Supporter",
    description: "50 Kommentare/Feedback gegeben",
    icon: "ChatBubbleLeftRightIcon",
    requirement: { type: "special", target: 50 },
  },

  // Time-Based (81-90)
  {
    id: "time_1",
    title: "1 Woche Dabei",
    description: "7 Tage registriert",
    icon: "CalendarIcon",
    requirement: { type: "special", target: 7 },
  },
  {
    id: "time_2",
    title: "1 Monat Dabei",
    description: "30 Tage registriert",
    icon: "CalendarDaysIcon",
    requirement: { type: "special", target: 30 },
  },
  {
    id: "time_3",
    title: "3 Monate Dabei",
    description: "90 Tage registriert",
    icon: "ClockIcon",
    requirement: { type: "special", target: 90 },
  },
  {
    id: "time_4",
    title: "Halbjahr",
    description: "180 Tage registriert",
    icon: "CalendarIcon",
    requirement: { type: "special", target: 180 },
  },
  {
    id: "time_5",
    title: "1 Jahr Dabei",
    description: "365 Tage registriert",
    icon: "CakeIcon",
    requirement: { type: "special", target: 365 },
  },

  // Misc Fun (91-100)
  {
    id: "fun_1",
    title: "Glückspilz",
    description: "Genau 777 Punkte erreicht",
    icon: "SparklesIcon",
    requirement: { type: "special", target: 777 },
  },
  {
    id: "fun_2",
    title: "Perfektionist",
    description: "100% aller Aufgaben in einer Woche erledigt",
    icon: "CheckCircleIcon",
    requirement: { type: "special", target: 100 },
  },
  {
    id: "fun_3",
    title: "Sparsam",
    description: "1000 Punkte gesammelt ohne auszugeben",
    icon: "BanknotesIcon",
    requirement: { type: "special", target: 1000 },
  },
  {
    id: "fun_4",
    title: "Verschwender",
    description: "1000 Punkte für Wünsche ausgegeben",
    icon: "CurrencyDollarIcon",
    requirement: { type: "special", target: 1000 },
  },
  {
    id: "fun_5",
    title: "Speed-Runner",
    description: "10 Aufgaben in 1 Stunde erledigt",
    icon: "RocketLaunchIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "fun_6",
    title: "Nacht-Schicht",
    description: "50 Aufgaben nach 20 Uhr erledigt",
    icon: "MoonIcon",
    requirement: { type: "special", target: 50 },
  },
  {
    id: "fun_7",
    title: "Morgen-Mensch",
    description: "50 Aufgaben vor 8 Uhr erledigt",
    icon: "SunIcon",
    requirement: { type: "special", target: 50 },
  },
  {
    id: "fun_8",
    title: "Wochenend-Held",
    description: "100 Aufgaben am Wochenende erledigt",
    icon: "CalendarIcon",
    requirement: { type: "special", target: 100 },
  },
  {
    id: "fun_9",
    title: "Monats-König",
    description: "Meiste Punkte im Monat (Haushalt)",
    icon: "TrophyIcon",
    requirement: { type: "special", target: 1 },
  },
  {
    id: "fun_10",
    title: "Hall of Fame",
    description: "Top 3 im Jahres-Ranking",
    icon: "StarIcon",
    requirement: { type: "special", target: 3 },
  },

  // === 17 NEUE ACHIEVEMENTS FÜR ERWEITERTE HERAUSFORDERUNGEN ===

  // Familienaktivitäten Achievements
  {
    id: "activities_1",
    title: "Aktivitäts-Starter",
    description: "3 verschiedene Familienaktivitäten ausprobiert",
    icon: "SparklesIcon",
    requirement: { type: "special", target: 3 },
  },
  {
    id: "activities_2", 
    title: "Aktivitäts-Explorer",
    description: "10 verschiedene Familienaktivitäten ausprobiert",
    icon: "MapIcon",
    requirement: { type: "special", target: 10 },
  },
  {
    id: "activities_3",
    title: "Aktivitäts-Meister",
    description: "25 verschiedene Familienaktivitäten ausprobiert", 
    icon: "TrophyIcon",
    requirement: { type: "special", target: 25 },
  },
  {
    id: "activities_4",
    title: "Kategorie-Sammler",
    description: "Aktivitäten aus allen 8 Kategorien ausprobiert",
    icon: "ViewColumnsIcon",
    requirement: { type: "special", target: 8 },
  },

  // Erweiterte Task Achievements
  {
    id: "tasks_mega_1",
    title: "Jahrhundert-Aufgabe",
    description: "100 Aufgaben an einem Tag erledigt",
    icon: "BoltIcon",
    requirement: { type: "special", target: 100 },
  },
  {
    id: "tasks_mega_2", 
    title: "Aufgaben-Titan",
    description: "1000 Aufgaben insgesamt erledigt",
    icon: "CommandLineIcon",
    requirement: { type: "tasks_completed", target: 1000 },
  },

  // Soziale Achievements
  {
    id: "social_1",
    title: "Teamplayer", 
    description: "50 Punkte an Familienmitglieder verschenkt",
    icon: "GiftIcon",
    requirement: { type: "points_transferred", target: 50 },
  },
  {
    id: "social_2",
    title: "Großzügiger Helfer",
    description: "200 Punkte an Familienmitglieder verschenkt", 
    icon: "HeartIcon",
    requirement: { type: "points_transferred", target: 200 },
  },

  // Langzeit-Achievements
  {
    id: "longterm_1",
    title: "Treuer Nutzer",
    description: "30 Tage in Folge eingeloggt",
    icon: "CalendarDaysIcon",
    requirement: { type: "login_streak", target: 30 },
  },
  {
    id: "longterm_2",
    title: "Jahres-Champion", 
    description: "365 Tage in Folge eingeloggt",
    icon: "TrophyIcon",
    requirement: { type: "login_streak", target: 365 },
  },

  // Spezial-Achievements
  {
    id: "special_1",
    title: "Perfektionist",
    description: "7 Tage hintereinander alle Aufgaben erledigt",
    icon: "CheckBadgeIcon", 
    requirement: { type: "special", target: 7 },
  },
  {
    id: "special_2",
    title: "Punkte-Millionär",
    description: "10.000 Punkte gesammelt", 
    icon: "BanknotesIcon",
    requirement: { type: "points_earned", target: 10000 },
  },
  {
    id: "special_3",
    title: "Wunsch-Erfüller",
    description: "20 Wünsche eingelöst",
    icon: "StarIcon",
    requirement: { type: "wishes_redeemed", target: 20 },
  },

  // Kreativitäts-Achievements
  {
    id: "creative_1", 
    title: "Kreativ-Genius",
    description: "15 kreative Aktivitäten ausprobiert",
    icon: "PaintBrushIcon",
    requirement: { type: "special", target: 15 },
  },
  {
    id: "creative_2",
    title: "Outdoor-Abenteurer", 
    description: "20 Outdoor-Aktivitäten gemeistert",
    icon: "SunIcon",
    requirement: { type: "special", target: 20 },
  },

  // Konsistenz-Achievement
  {
    id: "consistency_1",
    title: "Unaufhaltsam",
    description: "100 Tage Aufgaben-Streak",
    icon: "FireIcon", 
    requirement: { type: "task_streak", target: 100 },
  },

  // Meta-Achievement
  {
    id: "meta_1",
    title: "Achievement-Jäger",
    description: "50 Achievements freigeschaltet",
    icon: "ShieldCheckIcon",
    requirement: { type: "special", target: 50 },
  },
];
