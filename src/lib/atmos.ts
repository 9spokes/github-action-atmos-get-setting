import { execSync } from "node:child_process";

export const runAtmosDescribeComponent = async (component: string, stack: string, processTemplates: boolean, processFunctions: boolean, atmosProfile?: string, cwd?: string) => {
  const env = atmosProfile ? { ...process.env, ATMOS_PROFILE: atmosProfile } : process.env;
  const options = cwd ? { cwd, env } : { env };
  let command = `atmos describe component ${component} -s ${stack} --format=json`;

  if (!processFunctions) {
    command += ` --process-functions=false`;
  }

  if (!processTemplates) {
    command += ` --process-templates=false`;
  }

  const atmos = execSync(command, options);
  return atmos.toString();
};
