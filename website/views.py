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

        if len(note) < 1:
            flash('Note is too short', category='error')
        else:
            new_note = Note(data=note, user_id=current_user.id)
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

@views.route('/delete-notes', methods=['POST'])
def delete_notes():
    data = json.loads(request.data)
    noteids = data.get('noteids', [])
    delete_all = data.get('deleteAll', False)
    
    if delete_all:
        # 删除全部笔记
        notes = Note.query.filter_by(user_id=current_user.id).all()
        for note in notes:
            db.session.delete(note)
    else:
        # 删除选中的笔记
        for noteid in noteids:
            note = Note.query.get(noteid)
            if note and note.user_id == current_user.id:
                db.session.delete(note)
    
    db.session.commit()
    return jsonify({})
