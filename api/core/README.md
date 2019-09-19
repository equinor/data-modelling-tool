# Architecture style

We follow the [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) style and structure the codebase accordingly.

The most important rule:

> Source code dependencies can only point inwards. 
Nothing in an inner circle can know anything at all about something in an outer circle. 
In particular, the name of something declared in an outer circle must not be mentioned by the code in the an inner circle. 
That includes, functions, classes. variables, or any other named software entity.
