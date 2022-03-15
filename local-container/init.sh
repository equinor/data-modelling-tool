echo "ok"

time=$(date +'%d/%m/%Y %r')
echo "** Start time: ${time} **"
#for i in "$@"; do
#  case $i in
#    --token=*)
#      TOKEN="${i#*=}"
#      shift # past argument=value
#      ;;
#    --stask=*)
#      STASK="${i#*=}"
#      shift # past argument=value
#      ;;
#    --task=*)
#      TASK="${i#*=}"
#      shift # past argument=value
#      ;;
#    --workflow=*)
#      WORKFLOW="${i#*=}"
#      shift # past argument=value
#      ;;
#    --compute-service-cfg=*)
#      COMPUTE_SERVICE_CFG="${i#*=}"
#      shift # past argument=value
#      ;;
#    --remote-run)
#      REMOTE_RUN="--remote-run"
#      shift # past argument=value
#      ;;
#    --input=*)
#      INPUT="${i#*=}"
#      shift
#      ;;
#    --target=*)
#      TARGET="${i#*=}"
#      shift
#      ;;
#    --result-link-target=*)
#      RESULT_LINK_TARGET="${i#*=}"
#      shift
#      ;;
#    *)
#      echo "WARNING: Invalid argument '$i'"
#      ;;
#  esac
#done
#
#/code/wrapper.py upload --token=$TOKEN --target=$TARGET --result-link-target=$RESULT_LINK_TARGET

time=$(date +'%d/%m/%Y %r')
echo "** End time: ${time} **"
