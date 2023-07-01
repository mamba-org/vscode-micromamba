import { CommandLike } from './_definitions'

export const runShowOutputCommand: CommandLike = async ({ ch }) => {
  ch.show()
}
