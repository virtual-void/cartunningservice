from datetime import datetime

from sqlalchemy_utils import CurrencyType, Currency

from cartunningservice.database import SurrogatePK, Model, reference_col
from cartunningservice.extensions import db
from cartunningservice.utils import generate_uuid


class Task(SurrogatePK, Model):
    __tablename__ = 'tasks'

    uuid = db.Column(db.Integer, unique=True, nullable=False, default=generate_uuid)

    status = db.Column(db.Integer, nullable=False, default=0)

    allowDownload = db.Column(db.Boolean, nullable=False, default=False)

    amount = db.Column(db.Integer, nullable=False, default=0)

    currency = db.Column(CurrencyType, nullable=False, default=Currency('USD'))

    created = db.Column(db.TIMESTAMP, default=datetime.utcnow)

    updated = db.Column(db.TIMESTAMP, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = reference_col('users', nullable=False)

    vehicle_type_id = reference_col('vehicle_type', nullable=False)

    brand_id = reference_col('brand', nullable=False)

    model_id = reference_col('model', nullable=False)

    engine_id = reference_col('engine', nullable=False)

    ecu_id = reference_col('ecu', nullable=False)

    def __repr__(self):
        return '<Task: %r>' % self.uuid

    def to_dict(self, properties=None):
        """
        To dictionary
        :param properties: {list} of required properties
        :return: {dict}
        """
        dict = {
            'id': self.id,
            'uuid': self.uuid,
            'status': self.status,
            'allowDownload': self.allowDownload,
            'amount': self.amount,
            'currency': str(self.currency),
            'vehicle': self.vehicle.to_dict() if self.vehicle \
                else None,
            'brand': self.brand.to_dict() if self.brand \
                else None,
            'model': self.model.to_dict() if self.model\
                else None,
            'engine': self.engine.to_dict() if self.engine \
                else None,
            'ecu': self.ecu.to_dict() if self.ecu\
                else None,
            'created': self.created.isoformat(sep=' ') if self.created \
                else None,
            'updated': self.updated.isoformat(sep=' ') if self.updated \
                else None
        }

        if properties is None:
            properties = dict.keys()

        return {key: dict.get(key) for key in properties}
