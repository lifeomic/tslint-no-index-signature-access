import { exec } from 'child_process';
import { join } from 'path';
import * as Lint from 'tslint';

const tslintBin = join('..', 'node_modules', '.bin', 'tslint');
const tslintConfig = join('.', 'tslint.json');
const tslintFormat = 'json';
const tsFiles = `${join('.', '*.ts')} ${join('.', '*/*.ts')}`;
const tsconfig = join('.', 'tsconfig.json');

test('all cases pass', async () => {
  const [stdout, stderr] = await new Promise<[string, string]>(function(
    resolve
  ) {
    exec(
      `${tslintBin} -p ${tsconfig} -c ${tslintConfig} -r .. -t ${tslintFormat} ${tsFiles}`,
      { cwd: __dirname },
      (_, stdout, stderr) => {
        // Intentionally ignore errors because the linter is expected to fail
        resolve([stdout, stderr]);
      }
    );
  });

  expect(stderr).toBe('');

  // Only validate failures and names.
  const actual = (JSON.parse(stdout) as Lint.IRuleFailureJson[]).map((x) => ({
    failure: x.failure,
    name: x.name.replace(/.*\/test\//, ''),
    startPosition: x.startPosition
  }));

  expect(actual).toMatchSnapshot();
});
