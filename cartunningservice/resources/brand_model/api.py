from flask_classy import FlaskView, route

from cartunningservice.autos import decorators
from cartunningservice.autos.models import BrandModel, Brand
from cartunningservice.utils import response


class BrandModelResource(FlaskView):
    """ BrandModel endpoint """

    route_base = '/brands/<int:brand_id>/models'

    @decorators.auth()
    def index(self, **kwargs):
        """
        Getting list of all brands
        """
        brand = kwargs.get('brand')

        models = brand.models.order_by(BrandModel.name.asc()).all()

        return response([model.to_dict() for model in models])

    @route('/<int:model_id>/')
    @decorators.auth()
    def get(self, **kwargs):
        """
        Returning specific contact for user
        """
        model = kwargs.get('model')
        return response(model.to_dict())
