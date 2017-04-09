VERSION=`jq '.version' package.json | sed -e 's/^"//'  -e 's/"$//'`

git tag -a $VERSION -m $VERSION || true

git push origin HEAD:master --follow-tags --force || true

npm publish || true