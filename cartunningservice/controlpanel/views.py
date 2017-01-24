# -*- coding: utf-8 -*-
"""Public section, including homepage and signup."""
from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask import current_app
from flask_login import current_user
from flask_login import login_required
from flask_paginate import Pagination, get_page_args

from cartunningservice.controlpanel.forms import CreateTaskForm
from cartunningservice.extensions import data_api_client

blueprint = Blueprint('controlpanel', __name__, url_prefix='/controlpanel', static_folder='../static')

def get_css_framework():
    return current_app.config.get('CSS_FRAMEWORK', 'bootstrap3')


def get_link_size():
    return current_app.config.get('LINK_SIZE', 'sm')


def show_single_page_or_not():
    return current_app.config.get('SHOW_SINGLE_PAGE', False)

def get_pagination(**kwargs):
    kwargs.setdefault('record_name', 'records')
    return Pagination(css_framework=get_css_framework(),
                      link_size=get_link_size(),
                      show_single_page=show_single_page_or_not(),
                      **kwargs
                      )

@blueprint.route('/', defaults={'page':1}, methods=['GET'])
@blueprint.route('/page/<int:page>', methods=['GET'])
@login_required
def main(page):
    page, per_page, offset = get_page_args()

    tasks = data_api_client.list_task_by_user(
        current_user.uuid, page, per_page)

    total = tasks.get('meta', 0).get('total_count', 0)

    # tasks_list = tasks.get('data')
    # tasks_list = [tasks_list[i:i + per_page] for i in range(0, len(tasks_list), per_page)]
    # tasks_per_page = tasks_list[page-1]

    pagination = get_pagination(page=page,
                                per_page=per_page,
                                total=total,
                                record_name='tasks',
                                format_total=True,
                                format_number=True,
                                )

    return render_template('controlpanel/main.html',
                           tasks=tasks.get('data'), page=page,
                           per_page=per_page,
                           pagination=pagination)


@blueprint.route('/create_task', methods=['GET', 'POST'])
@login_required
def create_task():
    """Create task page."""
    form = CreateTaskForm()
    # Handle create task
    if request.method == 'POST':
        task_json = data_api_client.create_task(
            current_user.uuid,
            form.type.data,
            form.brand.data,
            form.model.data,
            form.engine.data,
            form.ecu.data)

        redirect_url = request.args.get('next') or url_for('user.members')
        return redirect(redirect_url)
    return render_template('controlpanel/create_task.html', form=form)
