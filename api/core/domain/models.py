try:
    from core.domain.dynamic_models import *  # noqa
except ImportError:
    pass

try:
    from core.domain.dynamic_models import Blueprint
except ImportError:
    from core.domain.blueprint import Blueprint  # noqa
