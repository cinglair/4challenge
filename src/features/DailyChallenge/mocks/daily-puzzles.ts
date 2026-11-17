import type { Level } from '../services/models'

/**
 * Mock provisório no lugar do banco. Cada trio é [alvo, algarismo, quantidade].
 * Todos foram conferidos por um solver: "easy" sai só com + − × ÷;
 * "medium" exige potência ou raiz; "hard" exige fatorial.
 */
// prettier-ignore
export const MOCK_DB: Record<Level, Array<[number, number, number]>> = {
   easy: [[7,8,4],[16,4,4],[6,5,3],[10,9,4],[48,6,4],[4,3,3],[44,2,4],[12,5,4],[44,2,3],[36,3,4],[4,1,4],[5,6,3],[10,9,3],[42,7,4]],
   medium: [[32,5,4],[64,2,5],[103,9,5],[24,4,3],[30,9,4],[98,8,5],[64,1,5],[20,8,4],[111,5,5],[38,4,4],[10,5,3],[24,2,4],[53,4,5],[48,3,5]],
   hard: [[132,5,4],[116,3,5],[93,4,5],[133,6,5],[131,9,5],[127,3,4],[71,9,4],[133,5,5],[35,2,5],[104,4,4],[102,7,5],[69,8,5],[119,1,5],[23,8,4]],
}
