from flask_classy import FlaskView, route

from cartunningservice.autos import decorators
from cartunningservice.autos.models import Ecu
from cartunningservice.utils import response

class EcuResource(FlaskView):
    """ Ecu endpoint """

    route_base = '/engines/<int:engine_id>/ecus'

    @decorators.auth()
    def index(self, **kwargs):
        """
        Getting list of all ecus
        """
        engine = kwargs.get('engine')

        ecus = engine.ecus.order_by(Ecu.name.asc()).all()

        return response([ecu.to_dict() for ecu in ecus])

    @route('/<int:ecu_id>/')
    @decorators.auth()
    def get(self, **kwargs):
        """
        Returning specific engine for car model
        """
        ecu = kwargs.get('ecu')
        return response(ecu.to_dict())
