
def find_form(client, data_source, _id):
    if data_source.type == 'mongodb':
        return client[data_source.collection].find_one(filter={'_id': _id})


def write_form(client, data_source, form, _id=None):
    if data_source.type == 'mongodb':
        if _id:
            form['_id'] = _id
        return client[data_source.collection].insert_one(form)


def update_form(client, data_source, form, _id):
    if data_source.type == 'mongodb':
        return client[data_source.collection].replace_one({'_id': _id}, form, upsert=True)
