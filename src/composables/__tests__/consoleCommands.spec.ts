import { describe, it, expect } from 'vitest'
import { runCommand, type ConsoleState } from '../consoleCommands'

const state: ConsoleState = { level: 2, bugs: 3, cheats: false, god: false, noclip: false, rapidFire: false }

describe('runCommand', () => {
  it.each([
    ['cl_level 1', 1],
    ['cl_level 3', 3],
    ['cl_level 5', 5],
    ['cl_level 9', 5]
  ])('%s goes to level %i', (input, level) => {
    expect(runCommand(input, state).action).toEqual({ type: 'goToLevel', level })
  })

  it('prints cl_level like a cvar without an argument', () => {
    expect(runCommand('cl_level', state).lines).toEqual(['"cl_level" is "2"'])
  })

  it.each(['cl_level abc', 'cl_level 0', 'cl_level -2'])('%s prints usage', (input) => {
    const result = runCommand(input, state)
    expect(result.action).toBeUndefined()
    expect(result.lines).toEqual(['Usage: cl_level <1-5>'])
  })

  it('reports unknown commands like CS', () => {
    expect(runCommand('bhop', state).lines).toEqual(['Unknown command: bhop'])
  })

  it('gates impulse 101 behind sv_cheats', () => {
    const denied = runCommand('impulse 101', state)
    expect(denied.action).toBeUndefined()
    expect(denied.lines[0]).toContain("Can't use cheat command impulse 101")

    const enabled = runCommand('sv_cheats 1', state)
    expect(enabled.lines).toEqual(['"sv_cheats" changed to "1"'])
    expect(runCommand('impulse 101', enabled.state).action).toEqual({ type: 'addScore', points: 1000 })
  })

  it('toggles rapid_fire like a cvar', () => {
    expect(runCommand('rapid_fire', state).lines).toEqual(['"rapid_fire" is "0"'])
    const on = runCommand('rapid_fire 1', state)
    expect(on.action).toEqual({ type: 'setRapidFire', on: true })
    expect(runCommand('rapid_fire', on.state).lines).toEqual(['"rapid_fire" is "1"'])
    expect(runCommand('rapid_fire 0', on.state).action).toEqual({ type: 'setRapidFire', on: false })
    expect(runCommand('rapid_fire 7', state).lines).toEqual(['Usage: rapid_fire <0|1>'])
  })

  it('maps map names to levels', () => {
    expect(runCommand('map de_aaa', state).action).toEqual({ type: 'goToLevel', level: 4 })
    expect(runCommand('map de_dust2', state).lines).toEqual(['map load failed: de_dust2 not found or invalid'])
  })
})
