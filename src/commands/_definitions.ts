import { EnvironmentInfo } from "../micromamba";

export type CommandLike = (info: EnvironmentInfo) => Promise<void>
