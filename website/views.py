from flask import Blueprint, render_template, request, flash, jsonify
from flask_login import login_required, current_user
from .models import Note
from . import db
import json

views = Blueprint('views', __name__)


# decorates the function to handle requests to the root URL (/)
@views.route('/', methods=['GET', 'POST'])
@login_required
# defines a function that returns HTML content
def home():
    if request.method == 'POST':
        note = request.form.get('note')
        title = request.form.get('title')

        if len(note) < 1:
            flash('Note is too short', category='error')
        else:
            new_note = Note(title=title, data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user)


@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteid = note['noteid']
    note = Note.query.get(noteid)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    return jsonify({})


@views.route('/edit-note', methods=['POST'])
def edit_note():
    data = json.loads(request.data)
    noteid = data['noteid']
    title = data['title']
    note_content = data['note_content']
    note = Note.query.get(noteid)
    if note:
        if note.user_id == current_user.id:
            note.title = title
            note.data = note_content
            db.session.commit()
    return jsonify({})
