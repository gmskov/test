#!/bin/bash -xe

lftp sftp://${SFTP_USERNAME}:${SFTP_PASSWORD}@${SFTP_HOSTNAME} -e '
mirror -v -R ./${THEME_NAME} ./wp-content/themes/${THEME_NAME}
quit
'
