#!/usr/local/env python

from dmt import DMT


def main():
    dmt = DMT()

    document = dmt.get(
        data_source_id="SSR-DataSource",
        document_id="03ec7ed1-bd15-4aeb-91fd-9a836ad471e1"
    )
    document["description"] = "new description..."

    document_2 = dmt.save(
        data_source_id="SSR-DataSource",
        document_id="03ec7ed1-bd15-4aeb-91fd-9a836ad471e1",
        data=document
    )

    print(document_2)


if __name__ == '__main__':
    main()
