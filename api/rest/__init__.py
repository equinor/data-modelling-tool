from flask import Blueprint

bp = Blueprint('rest', __name__)

from rest import models
