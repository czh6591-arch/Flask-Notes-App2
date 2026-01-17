from flask import Blueprint, render_template, request, flash, jsonify, make_response
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
from datetime import datetime

views = Blueprint('views', __name__)


# decorates the function to handle requests to the root URL (/)
@views.route('/', methods=['GET', 'POST'])
@login_required
# defines a function that returns HTML content
def home():
    if request.method == 'POST':
        note_title = request.form.get('noteTitle')
        note_data = request.form.get('note')

        if len(note_data) < 1:
            flash('Note is too short', category='error')
        else:
            # Check if this is an update (note_id present)
            note_id = request.form.get('noteId')
            if note_id:
                note = Note.query.get(note_id)
                if note and note.user_id == current_user.id:
                    if note_title:
                        note.title = note_title
                    note.data = note_data
                    db.session.commit()
                    flash('Note updated!', category='success')
            else:
                # Create new note
                new_note = Note(title=note_title if note_title else 'Untitled', data=note_data, user_id=current_user.id)
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


@views.route('/export-notes', methods=['GET'])
@login_required
def export_notes():
    # Get all notes for current user, ordered by date
    notes = Note.query.filter_by(user_id=current_user.id).order_by(Note.date.desc()).all()
    
    # Generate timestamp for filename
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = f"notes_export_{timestamp}.txt"
    
    # Build content
    content = ""
    for note in notes:
        title = note.title if note.title else 'Untitled'
        content += f"{title}\n- {note.data}\n\n"
    
    # Create response
    response = make_response(content)
    response.headers['Content-Type'] = 'text/plain'
    response.headers['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response
