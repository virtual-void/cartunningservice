from flask import request
from flask_classy import route, FlaskView

from cartunningservice.autos import decorators
from cartunningservice.controlpanel.models import Task
from cartunningservice.utils import response


class TaskResource(FlaskView):
    """ Task endpoint """

    route_base = '/users/<string:user_uuid>/tasks/'

    @decorators.auth()
    def index(self, **kwargs):
        """
        Returning list of tasks for specific user
        """
        user = kwargs.get('user')

        page = int(request.args.get('page'))
        per_page = int(request.args.get('per_page'))

        meta_pagination = None
        if page and per_page:
            tasks = Task.query.filter_by(user_id = user.id).paginate(page, per_page, False)

            meta_pagination = {
                'page': tasks.page,
                'per_page': tasks.per_page,
                'page_count': len(tasks.items),
                'total_count': tasks.total
            }
            data = [task.to_dict() for task in tasks.items]
            #tasks = user.tasks.order_by(Task.created.desc()).paginate(page, per_page, False)
        else:
            tasks = user.tasks.order_by(Task.created.desc()).all()
            data = [task.to_dict() for task in tasks]

        return response(data, meta_pagination)

    @route('/<int:task_id>/')
    @decorators.auth()
    def get(self, **kwargs):
        """
        Returning specific task for user
        """
        task = kwargs.get('task')
        return response(task.to_dict())

    #@route('/users/<uuid:user_uuid>/task/', methods=['POST'])
    @decorators.auth()
    def post(self, **kwargs):
        """
        Creating user task
        """
        user = kwargs.get('user')

        # create and save task
        # TODO(vojta) handling unique contacts ?
        task = Task(user_id=user.id, **request.json)

        task.save(True)

        return response(task.to_dict(), status_code=201)
