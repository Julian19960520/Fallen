 #!/bin/bash

[ ! ${#} -eq 1 ] && echo -e "./lftp.sh <filepath>" && exit 1

username="zhaozinian"
target_dir="data/resource"


filename=`basename ${1}`
tar zcvf ${filename}.tar ${filename}
rm -rf filename
lftp -u ${username}, sftp://192.144.200.156:2222 << EOF
ls >> /dev/null
cd htrain-res
ls >> /dev/null
cd team5-system
cd ${target_dir}/
put ${1}.tar
bye
EOF


/usr/bin/expect << EOF
spawn ssh ${username}@192.144.200.156 -p 2222

expect "Opt>"
send "htrain-res\n"

sleep 0.5

send "tar xf /${target_dir}/${filename}.tar -C /${target_dir}/ && exit\n"

expect "~]$ "
send "mv /${target_dir}/${filename}.tar /${target_dir}/${filename}.tar.`date +%Y%m%d-%H%M%S` && exit\n"

expect "Opt>"
send "exit\n"
EOF
