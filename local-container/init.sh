echo "ok"

time=$(date +'%d/%m/%Y %r')
echo "** Start time: ${time} **"
for i in "$@"; do
  case $i in
    --token=*)
      TOKEN="${i#*=}"
      shift # past argument=value
      ;;
    --json-string-input=*)
      JSON_STRING_INPUT="${i#*=}"
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

python3 /code/wrapper.py get-and-upload-result --token=$TOKEN --target=$TARGET --result-link-target=$RESULT_LINK_TARGET --json-string-input=$JSON_STRING_INPUT
#wrapper.py run get_and_upload_result --token=$TOKEN --target=$TARGET --result-link-target=$RESULT_LINK_TARGET --json-string-input=$JSON_STRING_INPUT
#--target=AnalysisPlatformDS/Data/Analysis/results --result-link-target=4483c9b0-d505-46c9-a157-94c79f4d7a6c.jobs.0.result --token=DMSS_J-aqSkr_wSo-KeeutezJLIUzHCtsQT5D2bgHF4XYw00=
time=$(date +'%d/%m/%Y %r')
echo "** End time: ${time} **"
