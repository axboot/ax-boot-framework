#!/bin/bash

COMMAND=$1

case $COMMAND in
    start)
		sudo /usr/local/nginx/sbin/nginx
		;;
	stop)
		sudo /usr/local/nginx/sbin/nginx -s quit
		;;
	restart)
		sudo /usr/local/nginx/sbin/nginx -s reload
		;;
	*)
		usage
esac
