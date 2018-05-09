#!/usr/bin/env bash
#
# Example taken from http://argbash.readthedocs.io/en/stable/example.html

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export VERSION_NUMBER=1.3.1
export ENABLE_LOGS=true

die()
{
	local _ret=$2
	test -n "$_ret" || _ret=1
	test "$_PRINT_HELP" = yes && print_help >&2
	echo "$1" >&2
	exit ${_ret}
}

begins_with_short_option()
{
	local first_option all_short_options
	all_short_options='pdeh'
	first_option="${1:0:1}"
	test "$all_short_options" = "${all_short_options/$first_option/}" && return 1 || return 0
}


# THE DEFAULTS INITIALIZATION - OPTIONALS
_arg_platform=ios
_arg_device=''
_arg_environment=local

print_help ()
{
	printf "%s\n" "The general script's help msg"
	printf 'Usage: %s [-p|--platform <arg>] [-d|--device <arg>] [-e|--environment <arg>] [-h|--help]\n' "$0"
	printf "\t%s\n" "-p,--platform: the platform to target 'android | ios | web'. default: ios"
	printf "\t%s\n" "-d,--device: the platform to target 'emulator | device'. default: none"
	printf "\t%s\n" "-e,--environment: the environment to target. default: local"
	printf "\t%s\n" "-h,--help: Prints help"
}

parse_commandline ()
{
	while test $# -gt 0
	do
		_key="$1"
		case "$_key" in
			-p|--platform)
				test $# -lt 2 && die "Missing value for the optional argument '$_key'." 1
				_arg_platform="$2"
				shift
				;;
			--platform=*)
				_arg_platform="${_key##--platform=}"
				;;
			-p*)
				_arg_platform="${_key##-p}"
				;;
			-d|--device)
				test $# -lt 2 && die "Missing value for the optional argument '$_key'." 1
				_arg_device="$2"
				shift
				;;
			--device=*)
				_arg_device="${_key##--device=}"
				;;
			-d*)
				_arg_device="${_key##-d}"
				;;
			-e|--environment)
				test $# -lt 2 && die "Missing value for the optional argument '$_key'." 1
				_arg_environment="$2"
				shift
				;;
			--environment=*)
				_arg_environment="${_key##--environment=}"
				;;
			-e*)
				_arg_environment="${_key##-e}"
				;;
			-h|--help)
				print_help
				exit 0
				;;
			-h*)
				print_help
				exit 0
				;;
			*)
				_PRINT_HELP=yes die "FATAL ERROR: Got an unexpected argument '$1'" 1
				;;
		esac
		shift
	done
}

parse_commandline "$@"

echo "Value of --platform: $_arg_platform"
echo "Value of --device: $_arg_device"
echo "Value of --environment: $_arg_environment"



function run_device() {
  cd "$DIR"/mywell-ui/
	PATH=$(npm bin):$PATH
  npm run build:"$_arg_environment"
  ionic run $_arg_platform --"$_arg_device"
}

function run_web() {
  cd "$DIR"/mywell-ui/
  echo "WARNING: run_device -d web currently only supports webpack dev server"

  source "$DIR"/env/env"$_arg_environment".sh
  npm run webpack_dev_server
}


case "$_arg_platform" in
  ios|android)
    run_device
    ;;
  web)
    run_web
    ;;
  *)
    _PRINT_HELP=yes die "FATAL ERROR: Device must be one of android | ios | web. Got: '$1'" 1
    ;;
esac
