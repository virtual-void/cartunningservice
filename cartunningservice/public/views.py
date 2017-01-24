# -*- coding: utf-8 -*-
"""Public section, including homepage and signup."""
import requests
from flask import Blueprint, flash, redirect, render_template, request, url_for
from flask import session
from flask_login import login_required, login_user, logout_user

from cartunningservice.extensions import login_manager, data_api_client
from cartunningservice.public.forms import LoginForm
from cartunningservice.user.forms import RegisterForm
from cartunningservice.user.models import User, UserToken
from cartunningservice.utils import flash_errors

blueprint = Blueprint('public', __name__, static_folder='../static')

@login_manager.user_loader
def load_user(user_id):
    """Load user by ID."""
    return User.get_by_id(int(user_id))


@blueprint.route('/', methods=['GET', 'POST'])
def home():
    """Home page."""
    form = LoginForm(request.form)
    # Handle logging in
    if request.method == 'POST':
        if form.validate_on_submit():
            user_json = data_api_client.authenticate_user(
                form.email.data,
                form.password.data)

            # data_api_client.auth_token = 'Token ' + user_json['token']
            # session['auth_token'] = data_api_client.auth_token
            login_user(form.user)
            flash('You are logged in.', 'success')
            redirect_url = request.args.get('next') or url_for('controlpanel.main')
            return redirect(redirect_url)
        else:
            flash_errors(form)
    return render_template('public/home.html', form=form)


@blueprint.route('/logout/')
@login_required
def logout():
    """Logout."""
    logout_user()
    flash('You are logged out.', 'info')
    return redirect(url_for('public.home'))


@blueprint.route('/register/', methods=['GET', 'POST'])
def register():
    """Register new user."""
    form = RegisterForm(request.form, csrf_enabled=False)
    if form.validate_on_submit():
        User.create(first_name=form.firstname.data, last_name=form.lastname.data, email=form.email.data, password=form.password.data, active=True)
        flash('Thank you for registering. You can now log in.', 'success')
        return redirect(url_for('public.home'))
    else:
        flash_errors(form)
    return render_template('public/register.html', form=form)


@blueprint.route('/about/')
def about():
    """About page."""
    form = LoginForm(request.form)
    return render_template('public/about.html', form=form)
