class MongoRepositoryBase(object):
    def __init__(self, db):
        self.db = db

    def c(self):
        return self.db.client

    def create(self, item):
        data = item.__dict__
        self.c().insert(data)
        return item

    def convert_from_model(self, obj):
        return obj.__dict__

    def convert_to_model(self, d):
        # del d["_id"]
        return self.Meta.model().from_dict(d)

        # x = self.Meta.model(id=d["_id"])
        # x.__dict__.update(d)
        # x.from_dict()
        # return x
