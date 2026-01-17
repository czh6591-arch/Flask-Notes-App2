from flask import Blueprint, render_template, request, flash, jsonify, make_response
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from datetime import datetime
import io

views = Blueprint('views', __name__)


@views.route('/', methods=['GET', 'POST'])
@login_required
def home():
    if request.method == 'POST':
        note = request.form.get('note')
        title = request.form.get('title', 'Untitled Note')

        if len(note) < 1:
            flash('Note is too short', category='error')
        else:
            new_note = Note(title=title, data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user)


@views.route('/update-note', methods=['POST'])
@login_required
def update_note():
    data = json.loads(request.data)
    note_id = data['noteId']
    new_title = data['newTitle']
    new_data = data['newData']
    
    note = Note.query.get(note_id)
    if note and note.user_id == current_user.id:
        note.title = new_title
        note.data = new_data
        db.session.commit()
    return jsonify({})


@views.route('/export-notes')
@login_required
def export_notes():
    notes = Note.query.filter_by(user_id=current_user.id).all()
    
    content = []
    for note in notes:
        content.append(f"{note.title}")
        content.append(f"- {note.data}")
        content.append("")
    
    export_content = '\n'.join(content)
    
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    filename = f"notes_export_{timestamp}.txt"
    
    response = make_response(export_content)
    response.headers['Content-Type'] = 'text/plain'
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response


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
