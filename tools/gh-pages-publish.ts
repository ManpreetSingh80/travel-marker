const { cd, exec, echo, touch } = require('shelljs');
const { readFileSync } = require('fs');
const url = require('url');

let repoUrl, authorName, authorEmail;
let pkg = JSON.parse(readFileSync('package.json') as any);
if (typeof pkg.repository === 'object') {
  if (!pkg.repository.hasOwnProperty('url')) {
    throw new Error('URL does not exist in repository section');
  }
  const author: string = pkg.author;
  authorName = author.substring(0, author.indexOf('<'));
  authorEmail = author.substring(author.indexOf('<') + 1, author.indexOf('>'));
  repoUrl = pkg.repository.url;
} else {
  repoUrl = pkg.repository;
}

let parsedUrl = url.parse(repoUrl);
let repository = (parsedUrl.host || '') + (parsedUrl.path || '');
let ghToken = process.env.GH_TOKEN;

echo('Deploying docs!!!');
cd('dist/docs');
touch('.nojekyll');
exec('git init');
exec('git add .');
exec(`git config user.name "${authorName}"`);
exec(`git config user.email "${authorEmail}"`);
exec('git commit -m "docs(docs): update gh-pages"');
exec(
  `git push --force --quiet "https://${repository}" master:gh-pages`
);
echo('Docs deployed!!');
