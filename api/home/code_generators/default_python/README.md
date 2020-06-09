# The standard Python generator

This plugin creates Python classes of the relevant blueprints.
Classes represent blueprints, while entities are represented by instances of said classes.

The resulting zip file, contains all necessary code to use the classes.

Classes, and entities can be converted to `dict`s, and JSON.
They can also generate code of themselves, should they be changed, or the need arise.
In that case, use the class' `__code__` method.
