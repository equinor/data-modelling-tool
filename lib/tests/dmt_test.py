#!/usr/bin/env python

import unittest

import responses

from dmt import DMT


class SnapchatTestCase(unittest.TestCase):

    def setUp(self):
        responses.reset()
        self.dmt = DMT()

    @responses.activate
    def test_login(self):
        pass


if __name__ == '__main__':
    unittest.main()
