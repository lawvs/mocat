set -e

cd dist
git init
# git config user.email "github-actions[bot]@users.noreply.github.com"
# git config user.name "github-actions[bot]"
git add .
git commit -m "Deployed at $(date --iso-8601)"
git remote add origin git@github.com:lawvs/mocat.git
git push -f origin master:gh-pages
rm -rf .git
