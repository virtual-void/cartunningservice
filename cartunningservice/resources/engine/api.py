from flask_classy import FlaskView, route

from cartunningservice.autos import decorators
from cartunningservice.autos.models import Engine
from cartunningservice.utils import response


class EngineResource(FlaskView):
    """ BrandModel endpoint """

    route_base = '/models/<int:model_id>/engines'

    @decorators.auth()
    def index(self, **kwargs):
        """
        Getting list of all engines
        """
        model = kwargs.get('model')

        engines = model.engines.order_by(Engine.name.asc()).all()

        return response([engine.to_dict() for engine in engines])

    @route('/<int:engine_id>/')
    @decorators.auth()
    def get(self, **kwargs):
        """
        Returning specific engine for car model
        """
        engine = kwargs.get('engine')
        return response(engine.to_dict())
