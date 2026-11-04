// Pure command interpreter for the in-game developer console (GoldSrc style).

export const MAX_LEVEL = 5
export const MAPS = ['de_arcade', 'de_y2k', 'de_runegrove', 'de_aaa', 'de_neon']
export const PLAYER_NAME = 'Player'

export interface ConsoleState {
  level: number
  bugs: number
  cheats: boolean
  god: boolean
  noclip: boolean
  rapidFire: boolean
}

export type ConsoleAction =
  | { type: 'goToLevel'; level: number }
  | { type: 'addScore'; points: number }
  | { type: 'setRapidFire'; on: boolean }
  | { type: 'close' }
  | { type: 'clear' }

export interface ConsoleResult {
  lines: string[]
  state: ConsoleState
  action?: ConsoleAction
}

export const BANNER = [
  'Portfolio Engine build 2026 (cstrike)',
  'Protocol version 48, exe version 1.6.2026',
  "Type 'help' for a list of commands."
]

const HELP = [
  'help / cmdlist      list available commands',
  'cl_level <1-5>      jump to a level',
  'map <name>          load a map (see status)',
  'status              show server status',
  'kill                respawn at level 1',
  'clear               clear the console',
  'rapid_fire <0|1>    throw 3 mugs in a row',
  'sv_cheats <0|1>     allow cheat commands',
  'god                 toggle godmode (cheat)',
  'noclip              toggle noclip (cheat)',
  'impulse 101         1000 points and a full mug (cheat)'
]

const cvar = (name: string, value: string | number) => `"${name}" is "${value}"`
const cheatDenied = (name: string) =>
  `Can't use cheat command ${name} in multiplayer, unless the server has sv_cheats set to 1.`

export function runCommand(input: string, state: ConsoleState): ConsoleResult {
  const text = input.trim().replace(/\s+/g, ' ')
  const [rawName = '', ...args] = text.split(' ')
  const name = rawName.toLowerCase()
  const arg = args[0]
  const reply = (lines: string[], action?: ConsoleAction, next = state): ConsoleResult => ({ lines, action, state: next })

  switch (text.toLowerCase()) {
    case '': return reply([])
    case 'rush b':
    case 'rushb': return reply(["Rush B, don't stop!"])
    case 'fire in the hole': return reply(['Fire in the hole!'])
    case 'quit':
    case 'exit': return reply(['Nice try. The bugs are still out there.'], { type: 'close' })
    case 'cliaj': return reply(['Cheat accepted. Skipping level.'], { type: 'goToLevel', level: Math.min(state.level + 1, MAX_LEVEL) })
  }

  switch (name) {
    case 'help':
    case 'cmdlist':
      return reply(HELP)
    case 'clear':
      return reply([], { type: 'clear' })
    case 'cl_level': {
      if (arg === undefined) return reply([cvar('cl_level', state.level)])
      if (!/^\d+$/.test(arg) || Number(arg) < 1) return reply(['Usage: cl_level <1-5>'])
      return reply([], { type: 'goToLevel', level: Math.min(Number(arg), MAX_LEVEL) })
    }
    case 'map': {
      if (arg === undefined) return reply(['Usage: map <mapname>'])
      const index = MAPS.indexOf(arg.toLowerCase())
      if (index === -1) return reply([`map load failed: ${arg} not found or invalid`])
      return reply([], { type: 'goToLevel', level: index + 1 })
    }
    case 'status':
      return reply([
        "hostname:  Clirim Ajeti's portfolio",
        'version :  48/1.6.2026 secure',
        'tcp/ip  :  127.0.0.1:27015',
        `map     :  ${MAPS[state.level - 1]} at: 0 x, 0 y, 0 z`,
        `players :  1 human, ${state.bugs} bug${state.bugs === 1 ? '' : 's'}`
      ])
    case 'kill':
      return reply([`${PLAYER_NAME} suicided.`], { type: 'goToLevel', level: 1 })
    case 'rapid_fire': {
      if (arg === undefined) return reply([cvar('rapid_fire', Number(state.rapidFire))])
      if (arg !== '0' && arg !== '1') return reply(['Usage: rapid_fire <0|1>'])
      const on = arg === '1'
      return reply([`"rapid_fire" changed to "${arg}"`], { type: 'setRapidFire', on }, { ...state, rapidFire: on })
    }
    case 'sv_cheats': {
      if (arg === undefined) return reply([cvar('sv_cheats', Number(state.cheats))])
      if (Number.isNaN(Number(arg))) return reply(['Usage: sv_cheats <0|1>'])
      const cheats = Number(arg) !== 0
      return reply([`"sv_cheats" changed to "${Number(cheats)}"`], undefined, { ...state, cheats })
    }
    case 'god':
    case 'noclip': {
      if (!state.cheats) return reply([cheatDenied(name)])
      const on = !state[name]
      return reply([`${name === 'god' ? 'godmode' : 'noclip'} ${on ? 'ON' : 'OFF'}`], undefined, { ...state, [name]: on })
    }
    case 'impulse':
      if (arg !== '101') return reply([])
      if (!state.cheats) return reply([cheatDenied('impulse 101')])
      return reply(['You got 1000 points and a full coffee mug.'], { type: 'addScore', points: 1000 })
    case 'connect':
      if (arg === undefined) return reply(['Usage: connect <server>'])
      return reply([`Connecting to ${args.join(' ')}...`, 'Server is full.'])
    default:
      return reply([`Unknown command: ${rawName}`])
  }
}
