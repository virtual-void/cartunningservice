# -*- coding: utf-8 -*-
# http://google-styleguide.googlecode.com/svn/trunk/pyguide.html
from flask import request
from flask_classy import FlaskView, route

from cartunningservice.error.api import ErrorResource
from cartunningservice.user.models import User, UserToken
from cartunningservice.utils import response


class AuthResource(FlaskView):
    """ Auth endpoint """

    route_base = '/auth/'

    @route('/login/', methods=['POST'])
    # @decorators.jsonschema_validate(login.schema)
    def login(self):
        """
        """
        # TODO(vojta) save success login, improve token stuff
        data = request.json

        # find user by email and if is not existing or passwd
        # is incorect will raise error 403
        user = User.get_by_email_address(data['email'].lower())

        #user = User.query.filter_by(username=data['username']).first()
        if user is None or user.check_password(data['password']) is False:
            raise ErrorResource(
                403,
                message="Invalid password or email."
            )

        # non active users are not allowed
        if user.active is False:
            raise ErrorResource(403, message="Account is not active.")

        # create user token for user
        token = None
        agent = request.headers.get('User-Agent')
        if agent is not None:
            token = UserToken.query \
                .filter_by(userId=user.id) \
                .filter_by(agent=agent) \
                .first()
        if token is None:
            token = UserToken(userId=user.id, agent=agent)
            token.save(True)

        # create payload response
        return response({
            'uuid': user.uuid,
            'token': token.token
        }, status_code=200)
