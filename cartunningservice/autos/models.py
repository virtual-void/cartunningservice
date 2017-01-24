from cartunningservice.controlpanel.models import Task
from cartunningservice.database import SurrogatePK, Model, Column, reference_col, relationship
from cartunningservice.extensions import db


class VehicleType(SurrogatePK, Model):
    __tablename__ = 'vehicle_type'

    name = Column(db.String(64))
    brands = relationship("Brand", backref='vehicle', lazy='dynamic')
    tasks = relationship("Task", backref='vehicle', lazy='dynamic')

    def __init__(self, name, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, **kwargs)

    def __repr__(self):
        return '<VehicleType: %r>' % self.name

    def to_dict(self, properties=None):
        """
        To dictionary
        :param properties: {list} of required properties
        :return: {dict}
        """

        dict = {
            'id': self.id,
            'name': self.name,
        }
        if properties is None:
            properties = dict.keys()

        return {key: dict.get(key) for key in properties}


class Brand(SurrogatePK, Model):
    __tablename__ = 'brand'

    name = Column(db.String(64))
    vehicle_type_id = reference_col('vehicle_type', nullable=False)
    models = relationship("BrandModel", backref='brand', lazy='dynamic')
    tasks = relationship("Task", backref='brand', lazy='dynamic')

    def __init__(self, name, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, **kwargs)

    def __repr__(self):
        return '<Brand: %r>' % self.name

    def to_dict(self, properties=None):
        """
        To dictionary
        :param properties: {list} of required properties
        :return: {dict}
        """

        dict = {
            'id': self.id,
            'name': self.name,
        }
        if properties is None:
            properties = dict.keys()

        return {key: dict.get(key) for key in properties}


class BrandModel(SurrogatePK, Model):
    __tablename__ = 'model'

    name = Column(db.String(64))
    brand_id = reference_col('brand', nullable=False)
    engines = relationship("Engine", backref='model', lazy='dynamic')
    tasks = relationship("Task", backref='model', lazy='dynamic')

    def __repr__(self):
        return '<BrandModel: %r>' % self.name

    def to_dict(self, properties=None):
        """
        To dictionary
        :param properties: {list} of required properties
        :return: {dict}
        """

        dict = {
            'id': self.id,
            'name': self.name,
        }
        if properties is None:
            properties = dict.keys()

        return {key: dict.get(key) for key in properties}


class Engine(SurrogatePK, Model):
    __tablename__ = 'engine'

    name = db.Column(db.String(64))
    model_id = reference_col('model', nullable=False)
    ecus = relationship("Ecu", backref='engine', lazy='dynamic')
    tasks = relationship("Task", backref='engine', lazy='dynamic')

    def __repr__(self):
        return '<Engine: %r>' % self.name

    def to_dict(self, properties=None):
        """
        To dictionary
        :param properties: {list} of required properties
        :return: {dict}
        """

        dict = {
            'id': self.id,
            'name': self.name,
        }
        if properties is None:
            properties = dict.keys()

        return {key: dict.get(key) for key in properties}


class Ecu(SurrogatePK, Model):
    __tablename__ = 'ecu'

    ecu_id = db.Column(db.Integer)
    name = db.Column(db.String(64))

    engine_id = reference_col('engine', nullable=False)
    tasks = relationship("Task", backref='ecu', lazy='dynamic')

    def __repr__(self):
        return '<Ecu: %r>' % self.name

    def to_dict(self, properties=None):
        """
        To dictionary
        :param properties: {list} of required properties
        :return: {dict}
        """

        dict = {
            'id': self.id,
            'name': self.name,
        }
        if properties is None:
            properties = dict.keys()

        return {key: dict.get(key) for key in properties}


class SecondFile(SurrogatePK, Model):
    __tablename__ = 'second_file'

    ecu_id = reference_col('ecu', nullable=False)
    first_name = db.Column(db.String(64))
    second_name = db.Column(db.String(64))
    need_second = db.Column(db.String(64))

    def __repr__(self):
        return '<SecondFile: %r>' % self.name
