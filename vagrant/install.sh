#!/usr/bin/env bash

sudo -s

############
# SETTINGS #
############
DBHOST=localhost
DBNAME=laoujin_twtactics # hardcoded in migrations/
DBUSER=laoujin_laoujin
DBPASSWD=KeepingTrackOfTheDownloads
# port is 33060

################
# INSTALLATION #
################
echo "mysql-server mysql-server/root_password password $DBPASSWD" | debconf-set-selections
echo "mysql-server mysql-server/root_password_again password $DBPASSWD" | debconf-set-selections

apt-get update
apt-get -y install mysql-server-5.5 #> /dev/null 2>&1

mysql -uroot -p$DBPASSWD -e "CREATE DATABASE $DBNAME"
mysql -uroot -p$DBPASSWD -e "CREATE USER '$DBUSER'@'localhost' IDENTIFIED BY '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "grant all privileges on $DBNAME.* to '$DBUSER'@'localhost' identified by '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "CREATE USER '$DBUSER'@'%' IDENTIFIED BY '$DBPASSWD'"
mysql -uroot -p$DBPASSWD -e "grant all privileges on $DBNAME.* to '$DBUSER'@'%' identified by '$DBPASSWD'"

mysql -uroot -p$DBPASSWD -e "CREATE USER 'vagrant'@'localhost' IDENTIFIED BY ''"
mysql -uroot -p$DBPASSWD -e "grant all privileges on $DBNAME.* to 'vagrant'@'localhost' identified by ''"

sed -i "s/^bind-address/#bind-address/" /etc/mysql/my.cnf
sudo /etc/init.d/mysql restart


###########
# SEEDING #
###########
mysql -uroot -p$DBPASSWD $DBNAME < /vagrant/migrations/initial.sql


########
# INFO #
########
echo "MYSQL USER: $DBUSER, PWD: $DBPASSWD, PORT: 33060 and DATABASE: $DBNAME"
# login after `vagrant ssh`:
# mysql --user=laoujin_laoujin --password=KeepingTrackOfTheDownloads
#
# Socket problem=
# sudo pkill -9 mysqld