#!/bin/bash

# Railway persistent volume setup
mkdir -p /data/database
mkdir -p /data/storage/framework/cache/data
mkdir -p /data/storage/framework/sessions
mkdir -p /data/storage/framework/views
mkdir -p /data/storage/logs
mkdir -p /data/storage/app

# Symlink to persistent storage
rm -rf database/database.sqlite
ln -sf /data/database/database.sqlite database/database.sqlite

rm -rf storage/framework/cache
rm -rf storage/framework/sessions
rm -rf storage/framework/views
rm -rf storage/logs
rm -rf storage/app

ln -sf /data/storage/framework/cache storage/framework/cache
ln -sf /data/storage/framework/sessions storage/framework/sessions
ln -sf /data/storage/framework/views storage/framework/views
ln -sf /data/storage/logs storage/logs
ln -sf /data/storage/app storage/app

# Initialize database if it doesn't exist
if [ ! -f /data/database/database.sqlite ]; then
    touch /data/database/database.sqlite
    php artisan migrate --force
fi

php artisan config:clear
php artisan cache:clear

# Use PHP built-in server with public/index.php as router
php -S 0.0.0.0:${PORT:-8080} -t public public/index.php
