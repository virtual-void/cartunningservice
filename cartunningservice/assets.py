# -*- coding: utf-8 -*-
"""Application assets."""
from flask_assets import Bundle, Environment

css = Bundle(
    'libs/blueimp-file-upload/css/jquery.fileupload.css',
    'libs/formvalidation.io/dist/css/formValidation.min.css',
    'libs/bootstrap/dist/css/bootstrap.css',
    'libs/bootstrap-select/dist/css/bootstrap-select.css',
    'css/style.css',
    filters='cssmin',
    output='public/css/common.css'
)

js = Bundle(
    'libs/jQuery/dist/jquery.js',
    'libs/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
    'libs/blueimp-file-upload/js/jquery.fileupload.js',
    'libs/bootstrap/dist/js/bootstrap.js',
    'libs/bootstrap-select/dist/js/bootstrap-select.js',
    'libs/formvalidation.io/dist/js/formValidation.min.js',
    'libs/formvalidation.io/dist/js/framework/bootstrap.min.js',
    'js/plugins.js',
    'js/script.js',
    filters='jsmin',
    output='public/js/common.js'
)

assets = Environment()

assets.register('js_all', js)
assets.register('css_all', css)
