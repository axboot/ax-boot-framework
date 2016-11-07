DEV="/dev/xvdb"
INPUT="/tmp/input"

# fdisk - delete all partitions
rm -f $INPUT
echo "n" >> $INPUT
echo "p" >> $INPUT
echo "1" >> $INPUT
echo "\n" >> $INPUT
echo "\n" >> $INPUT
echo "# cmd : fdisk $DEV < $INPUT"
fdisk $DEV < $INPUT

mkfs.ext4 /dev/xvdb

mkdir /mnt/var
mount $DEV /mnt/var

cd /var
cp -ax * /mnt/var

cd /
mv var var.old
mkdir var
umount $DEV
mount $DEV /var

echo "/dev/xvdb               /var                    ext4    defaults        0 0" >> /etc/fstab