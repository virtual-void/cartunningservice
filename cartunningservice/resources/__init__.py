import glob
import os

import inflection as inflection

from cartunningservice.utils import underscore_to_camelcase


def register(app):
    """
    Registration of resources modules
    :param app: {Flask} flask app instance
    """
    # register converters
    #converters.register(app)

    # registerting additional routes
    #register_additional_routes(app)

    # API resources registration
    directory = os.path.dirname(os.path.realpath(__file__))
    resources = [os.path.basename(os.path.normpath(i)) \
                 for i in glob.glob(os.path.join(directory, '*/'))]
    for resource in resources:
        module = "{0}.{1}.api".format(__name__, resource)
        class_name = "{0}Resource".format(inflection.camelize(resource))
        try:
            class_ref = getattr(__import__(module, fromlist=[class_name]),
                        class_name)
            class_ref.register(app, route_prefix='api/1.0')
        except ImportError as e:
            print("Resource '{0}' does not exists".format(module))
        except AttributeError as e:
            print("Resource class '{0}' does not exists".format(class_name))
