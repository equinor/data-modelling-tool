from core.repository.mongo.mongo_db_client import DbClient


class MongoRepositoryBase:
    def __init__(self, db: DbClient):
        self.db = db

    def client(self) -> DbClient:
        return self.db

    # def create(self, item):
    #    data = item.__dict__
    #    self.c().insert(data)
    #    return item

    # def convert_from_model(self, obj):
    #    return obj.__dict__

    def convert_to_model(self, dict_):
        # del d["_id"]
        return self.Meta.model.from_dict(dict_)

        # x = self.Meta.model(id=d["_id"])
        # x.__dict__.update(d)
        # x.from_dict()
        # return x
