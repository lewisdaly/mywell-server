#!/bin/bash

#REF: https://microsoft.github.io/code-push/docs/cli.html

#login first
code-push login #follow prompts!

cd src/mywell-ui/src/
ionic build android

#1.2.0 is the target binary version - tells codepush which app version this update is for.
code-push release mywell_android platforms/android/assets/www/ 1.2.0 --mandatory

#promote to Production
code-push promote mywell_android Staging Production
