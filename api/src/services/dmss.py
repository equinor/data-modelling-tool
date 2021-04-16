from dmss_api.apis import DefaultApi


from config import Config

dmss_api = DefaultApi()
dmss_api.api_client.configuration.host = Config.DMSS_API
