from flask import Blueprint, render_template, request, flash, jsonify, send_file
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
        title = request.form.get('title', 'Untitled Note')

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


@views.route('/edit-note', methods=['POST'])
def edit_note():
    note_data = json.loads(request.data)
    noteid = note_data['noteid']
    title = note_data['title']
    data = note_data['data']
    
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
    
    # Create content for export
    content = ""
    for note in notes:
        content += f"{note.title} - {note.data}\n\n"
    
    # Create a file in memory
    mem_file = io.BytesIO()
    mem_file.write(content.encode('utf-8'))
    mem_file.seek(0)
    
    # Generate filename with current timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"notes_export_{timestamp}.txt"
    
    return send_file(
        mem_file,
        as_attachment=True,
        download_name=filename,
        mimetype='text/plain'
    )
