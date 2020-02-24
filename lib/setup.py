#!/usr/bin/env python

try:
    from setuptools import setup
except ImportError:
    from distutils.core import setup

setup(
    name='dmt',
    version='0.1.0',
    description='DMT API client in Python',
    long_description=open('README.md').read(),
    author='',
    author_email='',
    url='',
    packages=['dmt'],
    scripts=['bin/get_packages.py'],
    install_requires=[
        'Click>=7.0',
        'requests>=2.2.1',
        'cryptography>=1.2.2',
    ],
    license=open('LICENSE').read()
)
