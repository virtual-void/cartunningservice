# -*- coding: utf-8 -*-
"""Public forms."""
from flask_wtf import Form
from wtforms import PasswordField, StringField, SelectField, FileField
from wtforms.validators import DataRequired

from cartunningservice.autos.models import VehicleType
from cartunningservice.extensions import data_api_client
from cartunningservice.user.models import User

class CreateTaskForm(Form):
    """Create task form."""

    type = SelectField('Type', coerce=int, choices=[])
    brand = SelectField('Brand', coerce=int, choices=[])
    model = SelectField('Model', coerce=int, choices=[])
    engine = SelectField('Engine', coerce=int, choices=[])
    ecu = SelectField('Ecu', coerce=int, choices=[])
    file = FileField('Source ECU file')

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(CreateTaskForm, self).__init__(*args, **kwargs)

class LoginForm(Form):
    """Login form."""

    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])

    def __init__(self, *args, **kwargs):
        """Create instance."""
        super(LoginForm, self).__init__(*args, **kwargs)
        self.user = None

    def validate(self):
        """Validate the form."""
        initial_validation = super(LoginForm, self).validate()
        if not initial_validation:
            return False

        self.user = User.query.filter_by(email=self.email.data).first()
        if not self.user:
            self.email.errors.append('Unknown email')
            return False

        if not self.user.check_password(self.password.data):
            self.password.errors.append('Invalid password')
            return False

        if not self.user.active:
            self.email.errors.append('User not activated')
            return False
        return True
