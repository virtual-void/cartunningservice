# -*- coding: utf-8 -*-
"""User models."""
import datetime as dt

from flask_login import UserMixin

from cartunningservice.database import Column, Model, SurrogatePK, db, reference_col
from cartunningservice.database import relationship
from cartunningservice.extensions import bcrypt
from cartunningservice.utils import generate_uuid


class Role(SurrogatePK, Model):
    """A role for a user."""

    __tablename__ = 'roles'
    name = Column(db.String(80), unique=True, nullable=False)
    user_id = reference_col('users', nullable=True)
    user = relationship('User', backref='roles')

    def __init__(self, name, **kwargs):
        """Create instance."""
        db.Model.__init__(self, name=name, **kwargs)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<Role({name})>'.format(name=self.name)


class User(UserMixin, SurrogatePK, Model):
    """A user of the app."""

    ROLE_ADMIN = 'admin'
    ROLE_USER = 'user'

    __tablename__ = 'users'

    uuid = db.Column(db.String(36), unique=True, nullable=False,
                     default=generate_uuid)
    email = Column(db.String(80), unique=True, nullable=False)
    #: The hashed password
    password = Column(db.Binary(128), nullable=True)
    created_at = Column(db.DateTime, nullable=False, default=dt.datetime.utcnow)
    first_name = Column(db.String(30), nullable=True)
    last_name = Column(db.String(30), nullable=True)
    active = Column(db.Boolean(), default=False)
    is_admin = Column(db.Boolean(), default=False)
    role = db.Column('role', db.Enum("user", "admin"), default='user',
                     nullable=False)

    tasks = relationship("Task", backref='user', lazy='dynamic')

    def __init__(self, first_name, last_name, email, password=None, **kwargs):
        """Create instance."""
        db.Model.__init__(self, first_name=first_name, last_name=last_name, email=email, **kwargs)
        if password:
            self.set_password(password)
        else:
            self.password = None

    def set_password(self, password):
        """Set password."""
        self.password = bcrypt.generate_password_hash(password)

    def check_password(self, value):
        """Check password."""
        return bcrypt.check_password_hash(self.password, value)

    @staticmethod
    def get_by_email_address(email_address):
        return User.query.filter(
            User.email == email_address
        ).first()

    @property
    def full_name(self):
        """Full user name."""
        return '{0} {1}'.format(self.first_name, self.last_name)

    def __repr__(self):
        """Represent instance as a unique string."""
        return '<User({username!r})>'.format(username=self.username)


class UserToken(Model):
    """ User token model """

    token = db.Column(db.CHAR(64), nullable=False,
                     default=generate_uuid, primary_key=True)
    userId = reference_col('users', nullable=False)
    #userId = db.Column(db.INTEGER(10, unsigned=True), ForeignKey('user.id'))
    info = db.Column(db.TEXT)
    agent = db.Column(db.VARCHAR(128))
