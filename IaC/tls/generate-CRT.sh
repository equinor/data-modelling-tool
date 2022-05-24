# Generate key and CSR
openssl req -new -nodes -newkey rsa:2048 \
    -keyout dmt-db.key -out dmt-db.csr \
    -subj "/C=NO/ST=Trondheim/O=DMT/OU=DMT/CN=dmt-db-prod.norwayeast.cloudapp.azure.com"

# Generate certificate
openssl x509 -req -sha256 -days 1024 \
    -in dmt-db.csr -CA DMTRootCA.crt -CAkey DMTRootCA.key \
    -CAcreateserial -extfile domains.ext -out dmt-db.crt

# Generate server PEM file
cat dmt-db.key dmt-db.crt > dmt-db.pem
