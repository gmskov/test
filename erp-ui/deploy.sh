#!/bin/bash -xe

lftp sftp://gbar:123QweAs@$gbar.digitize.ee -e "mirror -v -R ./build ./gbar.digitize.ee/test; quit"
