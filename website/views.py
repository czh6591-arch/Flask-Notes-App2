from flask import Blueprint, render_template, request, flash, jsonify, send_file, make_response
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from datetime import datetime
import io

views = Blueprint('views', __name__)


# decorates the function to handle requests to the root URL (/)
@views.route('/', methods=['GET', 'POST'])
@login_required
# defines a function that returns HTML content
def home():
    if request.method == 'POST':
        note = request.form.get('note')
        title = request.form.get('title', 'Untitled')

        if len(note) < 1:
            flash('Note is too short', category='error')
        else:
            new_note = Note(data=note, title=title, user_id=current_user.id)
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


@views.route('/update-note', methods=['POST'])
def update_note():
    note = json.loads(request.data)
    noteid = note['noteid']
    title = note.get('title', 'Untitled')
    data = note.get('data', '')
    note = Note.query.get(noteid)
    if note:
        if note.user_id == current_user.id:
            note.title = title
            note.data = data
            db.session.commit()
    return jsonify({})


@views.route('/export-notes', methods=['GET'])
@login_required
def export_notes():
    notes = Note.query.filter_by(user_id=current_user.id).all()
    content = ""
    for note in notes:
        content += f"{note.title}\n- {note.data}\n\n"
    
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".txt"
    
    response = make_response(content)
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    response.headers["Content-Type"] = "text/plain"
    return response
