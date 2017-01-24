# -*- coding: utf-8 -*-
"""Helper utilities and decorators."""
import importlib
import uuid

from flask import flash, jsonify

from cartunningservice.constants.http_status_codes import STATUS_CODES


def flash_errors(form, category='warning'):
    """Flash all errors for a form."""
    for field, errors in form.errors.items():
        for error in errors:
            flash('{0} - {1}'.format(getattr(form, field).label.text, error), category)

def response(payload, meta=None, status_code=200, message=None):
    """

    :param payload: {list|dict|str} response payload
    :param status_code: {int} http response status code
    :param message: {str} string message
    """
    # check validity of status code
    if status_code not in STATUS_CODES:
        raise Exception('Status code does not exist.')

    res = {
        'meta': {
            'code': status_code,
            'message': STATUS_CODES[status_code] if not message else message
        },
        'data': payload
    }

    if meta is not None:
        res['meta'].update(meta)

    return jsonify(res), status_code


def underscore_to_camelcase(value):
    """
    Transformation string from underscore to camelcase
    :param value: {str} underscored string
    :return: {str} camelcased string
    """
    def camelcase():
        yield str.lower
        while True:
            yield str.capitalize
    c = camelcase()
    value = "".join(c(x) if x else '_' for x in value.split("_"))
    return value[0].upper() + value[1:]


def generate_uuid():
    """
    Generate new uuid
    :return: {string} uuid
    """
    return str(uuid.uuid4())
