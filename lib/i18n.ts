'use client';

// ─── Translation Dictionaries ──────────────────────────────────────────────

export type Language = 'en' | 'tr';

export const translations = {
  en: {
    // ── Bottom Nav ──
    nav_home: 'Home',
    nav_groups: 'Groups',
    nav_post: 'Post',
    nav_messages: 'Messages',
    nav_profile: 'Profile',

    // ── Home Page ──
    home_search_placeholder: 'Search games, players...',
    home_live_title: 'LIVE — 247 squads forming',
    home_live_sub: 'Jump in — your perfect squad is looking for you right now',
    home_lfg_feed: 'LFG FEED',
    home_filter: 'Filter',
    home_no_posts: 'No posts found',

    // ── Add Post Modal ──
    modal_title: 'NEW LFG POST',
    modal_sub: 'Find your squad',
    modal_game: 'GAME',
    modal_game_placeholder: 'Select a game...',
    modal_desc_label: 'DESCRIPTION',
    modal_desc_placeholder: 'Looking for a chill duo for ranked. Mic preferred...',
    modal_description: 'DESCRIPTION',
    modal_description_placeholder: "Describe what you're looking for, your rank, play style...",
    modal_looking_for: 'LOOKING FOR',
    modal_looking_for_placeholder: 'e.g. Support main, any role, builders...',
    modal_players_needed: 'PLAYERS NEEDED',
    modal_platform: 'PLATFORM',
    modal_when: 'WHEN',
    modal_when_placeholder: 'e.g. Tonight 8PM, Weekends, Flexible...',
    modal_submit: 'POST LIVE',
    modal_publish: 'Deploy Post',
    post_other: 'Other',
    modal_success_title: 'POST LIVE!',
    modal_success_sub: 'Your squad request is out there 🔥',

    // ── Profile Page ──
    profile_edit: 'EDIT',
    profile_clips: 'CLIPS',
    profile_identity: 'IDENTITY',
    profile_games: 'GAMES',
    profile_favorite_games: 'FAVORITE GAMES',
    profile_banner: 'Banner',
    profile_posts: 'Posts',
    profile_matches: 'Matches',
    profile_friends: 'Friends',
    profile_groups: 'Groups',
    my_bio: 'Casual-competitive gamer 🎮 | Cozy game enthusiast & FPS sweat | Always down to vibe or sweat it out 💜',

    // ── Edit Profile Modal ──
    edit_title: 'EDIT PROFILE',
    edit_display_name: 'DISPLAY NAME',
    edit_username: 'USERNAME',
    edit_bio: 'BIO',
    edit_bio_placeholder: 'Tell the squad about yourself...',
    edit_rank: 'RANK',
    edit_level: 'LEVEL',
    edit_cancel: 'CANCEL',
    edit_save: 'SAVE CHANGES',
    edit_saved: 'SAVED!',

    // ── Gaming Identity ──
    identity_title: 'GAMING IDENTITY',
    identity_verified: 'Verified',

    // ── Clips Gallery ──
    clips_title: 'CLIPS',
    clips_see_all: 'See All',

    // ── Settings Page ──
    settings_title: 'SETTINGS',
    settings_neon_theme: 'NEON THEME',
    settings_logo_style: 'LOGO STYLE',
    settings_language: 'LANGUAGE',
    settings_account: 'ACCOUNT',
    settings_support: 'SUPPORT',
    settings_manage_profile: 'Manage Profile',
    settings_privacy: 'Privacy & Safety',
    settings_notifications: 'Notifications',
    settings_private_mode: 'Private Mode',
    settings_help: 'Help & FAQ',
    settings_sign_out: 'Sign Out',
    settings_custom_color: 'Custom Color',
    settings_custom_color_sub: 'Pick any hex color you want',
    settings_version: 'Nexa v1.0.0-beta',
    settings_color_mode: 'Color Mode',
    settings_dark_mode: 'Dark',
    settings_light_mode: 'Light',
    settings_minimalist: 'minimalist',
    settings_cyberpunk: 'cyberpunk',

    // ── LFG Card ──
    card_players: 'players',
    card_join: 'JOIN',
    card_joined: 'JOINED',
    card_requested: 'REQUESTED',
    card_accepted: 'ACCEPTED',
    card_looking_for: 'Looking for',
  },

  tr: {
    // ── Bottom Nav ──
    nav_home: 'Ana Sayfa',
    nav_groups: 'Gruplar',
    nav_post: 'Paylaş',
    nav_messages: 'Mesajlar',
    nav_profile: 'Profil',

    // ── Home Page ──
    home_search_placeholder: 'Oyun, oyuncu ara...',
    home_live_title: 'CANLI — 247 takım kuruluyor',
    home_live_sub: 'Hemen katıl — mükemmel takımın seni bekliyor',
    home_lfg_feed: 'TAKIM ARA',
    home_filter: 'Filtre',
    home_no_posts: 'Gönderi bulunamadı',

    // ── Add Post Modal ──
    modal_title: 'YENİ TAKIM İLANI',
    modal_sub: 'Takımını bul',
    modal_game: 'OYUN',
    modal_game_placeholder: 'Bir oyun seçin...',
    modal_desc_label: 'AÇIKLAMA',
    modal_desc_placeholder: 'Dereceli için chill duo arıyorum. Mikrofon tercih edilir...',
    modal_description: 'AÇIKLAMA',
    modal_description_placeholder: 'Aradığını, rankını, oyun tarzını anlat...',
    modal_looking_for: 'ARANAN',
    modal_looking_for_placeholder: 'ör. Support main, herhangi bir rol, builder...',
    modal_players_needed: 'GEREKEN OYUNCU',
    modal_platform: 'PLATFORM',
    modal_when: 'NE ZAMAN',
    modal_when_placeholder: 'ör. Bu gece 21:00, Hafta sonu, Esnek...',
    modal_submit: 'YAYINLA',
    modal_publish: 'İlanı Yayınla',
    post_other: 'Diğer',
    modal_success_title: 'YAYINDA!',
    modal_success_sub: 'Takım isteğin yayına girdi 🔥',
    post_desc_placeholder: 'Nasıl oyuncular arıyorsun?',

    // ── Profile Page ──
    profile_edit: 'DÜZENLE',
    profile_clips: 'KLİPLER',
    profile_identity: 'KİMLİK',
    profile_games: 'OYUNLAR',
    profile_favorite_games: 'FAVORİ OYUNLAR',
    profile_banner: 'Kapak',
    profile_posts: 'Gönderi',
    profile_matches: 'Maç',
    profile_friends: 'Arkadaş',
    profile_groups: 'Grup',
    my_bio: 'Rekabetçi-rahat oyuncu 🎮 | Sıcak oyun meraklısı ve FPS terleyicisi | Her zaman takılmaya veya oynamaya varım 💜',

    // ── Edit Profile Modal ──
    edit_title: 'PROFİLİ DÜZENLE',
    edit_display_name: 'GÖRÜNEN AD',
    edit_username: 'KULLANICI ADI',
    edit_bio: 'BİYOGRAFİ',
    edit_bio_placeholder: 'Takıma kendini tanıt...',
    edit_rank: 'RANK',
    edit_level: 'SEVİYE',
    edit_cancel: 'İPTAL',
    edit_save: 'DEĞİŞİKLİKLERİ KAYDET',
    edit_saved: 'KAYDEDİLDİ!',

    // ── Gaming Identity ──
    identity_title: 'OYUN KİMLİĞİ',
    identity_verified: 'Doğrulandı',

    // ── Clips Gallery ──
    clips_title: 'KLİPLER',
    clips_see_all: 'Tümünü Gör',

    // ── Settings Page ──
    settings_title: 'AYARLAR',
    settings_neon_theme: 'NEON TEMA',
    settings_logo_style: 'LOGO STİLİ',
    settings_language: 'DİL',
    settings_account: 'HESAP',
    settings_support: 'DESTEK',
    settings_manage_profile: 'Profili Yönet',
    settings_privacy: 'Gizlilik & Güvenlik',
    settings_notifications: 'Bildirimler',
    settings_private_mode: 'Gizli Mod',
    settings_help: 'Yardım & SSS',
    settings_sign_out: 'Çıkış Yap',
    settings_custom_color: 'Özel Renk',
    settings_custom_color_sub: 'İstediğin hex rengi seç',
    settings_version: 'Nexa v1.0.0-beta',
    settings_color_mode: 'Renk Modu',
    settings_dark_mode: 'Koyu',
    settings_light_mode: 'Açık',
    settings_minimalist: 'minimalist',
    settings_cyberpunk: 'cyberpunk',

    // ── LFG Card ──
    card_players: 'oyuncu',
    card_join: 'KATIL',
    card_joined: 'KATILDI',
    card_requested: 'İSTEK GÖNDERİLDİ',
    card_accepted: 'KABUL EDİLDİ',
    card_looking_for: 'Aranıyor',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
