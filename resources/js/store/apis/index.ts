// ─── Base API ─────────────────────────────────────────────────────────────────
export { mainApi } from './mainApi';


// ─── Core ─────────────────────────────────────────────────────────────────────
export * from './core/seasons.api';
export * from './core/continents.api';
export * from './core/countries.api';
export * from './core/competitions.api';
export * from './core/managers.api';
export * from './core/players.api';
export * from './core/teams.api';
export * from './core/competitionSeasons.api';

// ─── GameEngine ───────────────────────────────────────────────────────────────
export * from './gameEngine/games.api';
export * from './gameEngine/gameInstances.api';

// ─── GameList ────────────────────────────────────────────────────────────────
export * from './gameList/bingoGame.api';
export * from './gameList/careerGame.api';
export * from './gameList/gridGame.api';

// ─── Infra ────────────────────────────────────────────────────────────────────
export * from './infra/user.api';

