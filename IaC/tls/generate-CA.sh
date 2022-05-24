# Generate CA key pair
openssl req -x509 -nodes -new -sha256 -days 1024 \
    -newkey rsa:2048 -keyout DMTRootCA.key -out DMTRootCA.crt \
    -subj "/C=NO/CN=DMT-Root-CA"

# Generate certificates
# openssl x509 -outform pem -in DMTRootCA.crt \
#     -out DMTRootCA.pem

# Create CA PEM file
cat DMTRootCA.key DMTRootCA.crt > DMTRootCA.pem