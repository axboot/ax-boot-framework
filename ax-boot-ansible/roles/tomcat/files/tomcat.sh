#!/bin/sh

usage() {
	echo "Usage: $PGR INSTANCE_NAME COMMAND"
	echo "COMMAND: [start/stop/restart/status/log/trace]"
	echo " ex) tomcat.sh instance1 start"
	echo " ex) tomcat.sh instance1 stop"
	echo " ex) tomcat.sh instance1 stop 30"
	echo " ex) tomcat.sh instance1 restart"
	echo " ex) tomcat.sh instance1 restart 30"
    echo " ex) tomcat.sh instance1 status"
    echo " ex) tomcat.sh instance1 deploy /home/deploy/tomcat/mywebapp/*.war"
    echo " ex) tomcat.sh instance1 log"
    echo " ex) tomcat.sh instance1 log testService.log"
    echo " ex) tomcat.sh instance1 trace"
    echo " ex) tomcat.sh instance1 trace testService.log"
    echo " ex) tomcat.sh instance1 edit"
    echo " ex) tomcat.sh instance1 edit bin/setenv.sh"
}


# check tomcat's status
isRunning() {
	if [ ! -z $TOMCAT_PID ]; then
		sudo kill -0 $TOMCAT_PID > /dev/null 2>&1
		return $?
	fi

	return 1
}

start() {
	if isRunning ; then
		echo "Cannot start a tomcat."
		echo "Running tomcat($TOMCAT_PID) exists."
		return 1
	fi

	if [ -f "$CATALINA_PID" ]; then
		echo "tomcat pid file stil exists. try to delete $CATALINA_PID."
		sudo rm -f "$CATALINA_PID"
	fi

	CUR_PATH=$(cd `dirname $0`;pwd)

	nohup sudo -E su nobody -c "$CATALINA_HOME/bin/catalina.sh start" -s /bin/sh

	RETVAL=$?

        if [ $RETVAL != 0 ]; then
                tail -10 $CATALINA_BASE/logs/catalina.out
        fi

        return $RETVAL
}

stop() {
	isRunning
	if [ $? -gt 0 ]; then
		echo "Tomcat is not running"
		if [ -f "$CATALINA_PID" ]; then
			echo "tomcat pid file stil exists. try to delete $CATALINA_PID."
			sudo rm -f "$CATALINA_PID"
		fi
		return 0
	fi

	echo "tomcat instance($TOMCAT_PID) is shutting down."
	sudo kill $TOMCAT_PID

	TIMEOUT=30
	if [ ! -z "$1" ]; then
		TIMEOUT=$1
	fi
	echo "waiting for tomcat's termination for $TIMEOUT sceonds."
	while isRunning ; do
		tryCount=$[$tryCount+1]
		echo "$tryCount seconds."
		if [ $tryCount -ge $TIMEOUT ]; then
			echo "force shutdown tomcat instance."
            sudo kill -9 $TOMCAT_PID
            unset TOMCAT_PID
			echo "Running tomcat($TOMCAT_PID) exists."
		    break
		fi
		sleep 1
	done

	if [ -f "$CATALINA_PID" ]; then
		sudo rm -f "$CATALINA_PID"
	fi

	echo "tomcat instance gracefully shutdown."
	return 0
}

forcestop() {
	stop $@
	if [ $? -eq 99 ]; then
		echo "force a shutdown for instance($TOMCAT_PID)"
		sudo kill -9 $TOMCAT_PID
		sudo rm -f $CATALINA_PID
        sleep 10
	fi
}

status() {
	if isRunning ; then
		echo "Running tomcat($TOMCAT_PID) exists."
		return 0
	else
		echo "no tomcat is running"
		return 1
	fi
}

trace() {
	LOGFILENAME=catalina.out
	if [ "x$1" != "x" ]; then
		LOGFILENAME=$1
	fi
	LOGFILE=$CATALINA_BASE/logs/${LOGFILENAME}

	echo "=================================================================================="
	echo "Try to trace a log file.[ $LOGFILE ]           "
	echo "=================================================================================="

	tail -F $LOGFILE
}

log() {
	LOGFILENAME=catalina.out
	LINE=100000
	if [ "x$1" != "x" ]; then
		LOGFILENAME=$1
	fi

	if [ "x$2" != "x" ]; then
		LINE=$2
	fi

	LOGFILE=$CATALINA_BASE/logs/${LOGFILENAME}

	echo "=================================================================================="
	echo "Try to trace a log file.[ $LOGFILE ]           "
	echo "=================================================================================="

	tail -$LINE $LOGFILE | vim -
}

edit() {
	EDITFILE=$CATALINA_BASE/conf/catalina.properties

	if [ ! -z "$1" ]; then
		EDITFILE=$CATALINA_BASE/$1
	fi

	if [ ! -f "$EDITFILE" ]; then
		echo "$EDITFILE does not exist."
		return 1
	fi

	vim $EDITFILE
}

deploy() {
	WAR_FILES=$@

	for FILE in $WAR_FILES ; do
		echo "copy $FILE to $CATALINA_BASE/webapps."
		CONTEXT_NAME=`basename $FILE .war`
		sudo rm -rf $CATALINA_BASE/webapps/$CONTEXT_NAME 2>/dev/null
		sudo cp -fp "$FILE" $CATALINA_BASE/webapps
	done
}

echo ">> SET ENVs"

export PGR="$0"

export INSTANCE_NAME=$1
export COMMAND_NAME=$2

shift 2

if [ -z "$INSTANCE_NAME" ]; then
	usage
	exit 1
elif [ -z "$COMMAND_NAME" ]; then
	usage
	exit 1
fi

export PGR_DIR=/home/deploy/scripts/tomcat
export TOMCAT_INSTALL_BASE=/usr/local

if [ -z $JAVA_HOME ]; then
	export JAVA_HOME=/usr/java/default
fi

if [ -z $CATALINA_HOME ]; then
	export CATALINA_HOME=$TOMCAT_INSTALL_BASE/tomcat
fi

#export INSTANCE_BASE=/home/deploy/service/tomcat
export INSTANCE_BASE=/var/tomcat
export CATALINA_BASE=$INSTANCE_BASE/$INSTANCE_NAME
export CATALINA_PID=$CATALINA_BASE/logs/tomcat.pid

if [ -f $CATALINA_PID ]; then
	export TOMCAT_PID=`cat $CATALINA_PID`
fi

case $COMMAND_NAME in
    *l)
        export COMMAND_NAME=${COMMAND_NAME:0:${#COMMAND_NAME}-1}
        TRACE=1
        ;;
esac

case $COMMAND_NAME in
    start)
		start
		RETVAL=$?
		#exit $RETVAL
		;;
	stop)
		stop $@
		RETVAL=$?
		#exit $RETVAL
		;;
	forcestop)
		forcestop $@
		#exit $RETVAL
		;;
	restart)
		stop $@
		RETVAL=$?
		if [ $RETVAL == 0 ] ; then
			start
			RETVAL=$?
			#exit $RETVAL
		fi
		#exit $RETVAL
		;;
	status)
		status
		;;
	trace)
		trace $@
		;;
	log)
		log $@
		;;
	edit)
		edit $@
		;;
	deploy)
		deploy $@
		;;
    base)
        echo $CATALINA_BASE
        ;;
    forcerestart)
        forcestop $@
        start
        RETVAL=$?
        #exit $RETVAL
        ;;
	*)
		usage
esac

if [ ! -z $TRACE ]; then
    trace $@
fi

if [ ! -z $RETVAL ]; then
    exit $RETVAL
fi