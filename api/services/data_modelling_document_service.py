from dmss_api import DocumentApi, PackageApi, ExplorerApi

from config import Config

document_api = DocumentApi()
document_api.api_client.configuration.host = Config.DMSS_API

package_api = PackageApi()
package_api.api_client.configuration.host = Config.DMSS_API

explorer_api = ExplorerApi()
explorer_api.api_client.configuration.host = Config.DMSS_API
