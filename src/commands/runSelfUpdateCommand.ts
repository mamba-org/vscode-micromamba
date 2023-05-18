import { updateMicromamba } from '../micromamba/updateMicromamba'
import { CommandLike } from './_definitions'

export const runSelfUpdateCommand: CommandLike = async ({ ch, params }) => {
  await updateMicromamba(params.micromambaParams, ch)
}
