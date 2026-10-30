import { execSync } from "node:child_process";
import * as core from "@actions/core";

export const runAtmosDescribeComponent = async (component: string, stack: string, processTemplates: boolean, processFunctions: boolean, atmosProfile?: string, cwd?: string) => {
  // Atmos editions >= 2026-07-17 default `describe.component.filter` to "schema",
  // which drops computed sections like `atmos_cli_config` from the output.
  // Force the full view so settings-paths keep resolving; respect an explicit override.
  const env = {
    ...process.env,
    ATMOS_DESCRIBE_COMPONENT_FILTER: process.env.ATMOS_DESCRIBE_COMPONENT_FILTER ?? "full",
    ...(atmosProfile ? { ATMOS_PROFILE: atmosProfile } : {}),
  };
  const options = cwd ? { cwd, env } : { env };
  let command = `atmos describe component ${component} -s ${stack} --format=json`;

  if (!processFunctions) {
    command += ` --process-functions=false`;
  }

  if (!processTemplates) {
    command += ` --process-templates=false`;
  }

  // core.info(`Running command: ${command}`);
  const atmos = execSync(command, options);
  const rawOutput = atmos.toString();
  // core.info(`Command output: ${rawOutput}`);
  const jsonStart = rawOutput.indexOf('{');
  if (jsonStart === -1) {
    throw new Error('No JSON object found in atmos output');
  }
  const output = rawOutput.substring(jsonStart);
  return output;
};
