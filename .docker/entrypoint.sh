#!/bin/sh

gunicorn -w 2 -b 0.0.0.0:8080 app:app --access-logfile=-
