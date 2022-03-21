time=$(date +'%d/%m/%Y %r')
echo "** Start time: ${time} **"
for i in "$@"; do
  case $i in
    --token=*)
      TOKEN="${i#*=}"
      shift # past argument=value
      ;;
    --application-input=*)
      APPLICATION_INPUT="${i#*=}"
      shift # past argument=value
      ;;
    --target=*)
      TARGET="${i#*=}"
      shift
      ;;
    --result-link-target=*)
      RESULT_LINK_TARGET="${i#*=}"
      shift
      ;;
    *)
      echo "WARNING: Invalid argument '$i'"
      ;;
  esac
done

python3 /code/wrapper.py get-and-upload-result --token=$TOKEN --target=$TARGET --result-link-target=$RESULT_LINK_TARGET --application-input=$APPLICATION_INPUT
time=$(date +'%d/%m/%Y %r')
echo "** End time: ${time} **"
