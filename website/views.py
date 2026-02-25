from flask import Blueprint, render_template, request, flash, jsonify, Response
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
        note = request.form.get('note')
        title = request.form.get('title', '')

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
@login_required
def update_note():
    data = json.loads(request.data)
    noteid = data.get('noteid')
    title = data.get('title', '')
    content = data.get('content', '')
    
    note = Note.query.get(noteid)
    if note and note.user_id == current_user.id:
        note.title = title
        note.data = content
        db.session.commit()
        return jsonify({'success': True, 'message': 'Note updated!'})
    return jsonify({'success': False, 'message': 'Note not found or unauthorized'})


@views.route('/export-notes', methods=['GET'])
@login_required
def export_notes():
    notes = Note.query.filter_by(user_id=current_user.id).all()
    
    content = ""
    for note in notes:
        title = note.title if note.title else "无标题"
        content += f"{title} - {note.data}\n\n"
    
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    filename = f"{timestamp}.txt"
    
    return Response(
        content,
        mimetype='text/plain',
        headers={'Content-Disposition': f'attachment;filename={filename}'}
    )
