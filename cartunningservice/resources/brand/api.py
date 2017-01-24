from flask_classy import FlaskView, route

from cartunningservice.autos import decorators
from cartunningservice.autos.models import Brand
from cartunningservice.utils import response


class BrandResource(FlaskView):
    """ Brand endpoint """

    route_base = '/vehicles/<int:vehicle_id>/brands/'

    @decorators.auth()
    def index(self, **kwargs):
        """
        Getting list of all brands
        """
        vehicle = kwargs.get('vehicle')

        brands = vehicle.brands.order_by(Brand.name.asc()).all()

        return response([brand.to_dict() for brand in brands])

    @route('/<int:brand_id>/')
    @decorators.auth()
    def get(self, **kwargs):
        """
        Returning specific contact for user
        """
        brand = kwargs.get('brand')
        return response(brand.to_dict())
