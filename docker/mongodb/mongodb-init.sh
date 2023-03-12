set -e

mongosh <<EOF
db = db.getSiblingDB('$MONGODB_DATABASE_NAME')

db.createUser({
  user: '$MONGODB_USER_USERNAME',
  pwd: '$MONGODB_USER_PASSWORD',
  roles: [{ role: 'readWrite', db: '$MONGODB_DATABASE_NAME' }],
});
db.createCollection('users')
db.createCollection('events')
db.createCollection('refreshToken')

EOF