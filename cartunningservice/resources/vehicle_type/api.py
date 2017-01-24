from flask_classy import FlaskView, route
from flask_login import login_required

from cartunningservice.autos import decorators
from cartunningservice.autos.models import VehicleType
from cartunningservice.utils import response


class VehicleTypeResource(FlaskView):
    """ VehicleType endpoint """

    route_base = '/vehicles/'

    @decorators.auth()
    def index(self, **kwargs):
        """
        Getting list of all vehicles
        """
        vehicles = VehicleType.query.order_by(VehicleType.id.asc()).all()

        return response([vehicle.to_dict() for vehicle in vehicles])

    @route('/<int:vehicle_id>/')
    @decorators.auth()
    def get(self, **kwargs):
        """
        Returning specific contact for user
        """
        vehicle = kwargs.get('vehicle')
        return response(vehicle.to_dict())