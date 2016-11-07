#!/bin/sh

export COMMAND_NAME=$1


start() {
for x in `ls /home/deploy/service/tomcat `;
do
/home/deploy/scripts/tomcat.sh $x start
done
}


case $COMMAND_NAME in
    start)
        start
        ;;
    stop)
        stop
        ;;
esac

exit 0