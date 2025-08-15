import { get } from "@vercel/edge-config"

export const getEnvVarOrEdgeConfigValue = async (name: string) => {
  "use server"
  if (process.env.EDGE_CONFIG) {
    return await get<string>(name)
  }

  return process.env[name]
}
