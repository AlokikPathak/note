import { Injectable } from '@angular/core';
import { Note } from './../models/note-model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {

  private _notes: Note[] = new Array();

  constructor() {}

  /**
   * Purpose: Fetch current Note list from localstorage
   * @returns void
   */
  fetchNotes(): void {
    this._notes = JSON.parse(localStorage.getItem("Notes"));
  }


  /**
   * Purpose: Fetch & returns current Notes list
   * @returns matchedNotes: Notes list
   */
  getNotes(searchKey: string): Note[] {
    this.fetchNotes();
    // Deep-search throughout the list
    if(searchKey!=="") {
      let matchedNotes = [];
      this._notes.forEach( note =>{
        var regx = new RegExp(searchKey, "gi");
        if(regx.test(note.title) || regx.test(note.note) || regx.test(note.created_on) || regx.test(note.modified_on)) {
          matchedNotes.push(note);
        }
      });
      return matchedNotes;
    }else {
      this.fetchNotes();
      return this._notes;
    }

  }


  /**
   * Purpose: Deletes a specific Note from Notes list
   * @param noteIndex: number
   */
  deleteNote(note_id: string): string {
    console.log("Array Before delete: ", this._notes);
    // For last element deletion
    if(this._notes.length ===1 && this._notes[0].note_id === note_id) {
      this._notes.pop();
      console.log("Array after last item delete: ", this._notes);
      this.updateNoteInLocalStorage(this._notes);
      return "Last Note Deleted!";
    }

    let updatedNotes = [];
    this._notes.forEach( (note, index) => {
       if( note.note_id == note_id) {
         updatedNotes = this._notes.splice(index, 1);
       }
    });
    this.updateNoteInLocalStorage(updatedNotes);
    console.log("Array after delete: ", updatedNotes);
    return "Note Deleted!";
  }

  /**
   * Purpose: Adds a new Note
   * @param newNote 
   * @returns string
   */
  addNote(newNote: Note): string {
    this.fetchNotes();
    console.log("Service add note: ", newNote);
    if(this._notes === null)
      this._notes = [];
    this._notes.push(newNote);
    this.updateNoteInLocalStorage(this._notes);
    return "Note Added!";
  }

  /**
   * Purpose: Updates existing Note
   * @param updatedNote: Note 
   */
  updateNote(updatedNote: Note): string {
    this._notes.forEach( (note, index) => {
      if( note.note_id === updatedNote.note_id) {
        this._notes[index] = updatedNote;
      }
    });
    this.updateNoteInLocalStorage(this._notes);
    return "Note Updated!";
  }

  /**
   * Purpose: Updates new Notes[] in localStorage
   * @param updatedNotes: Note[]
   */
  updateNoteInLocalStorage(updatedNotes: Note[]): void {
    localStorage.setItem("Notes", JSON.stringify(updatedNotes));
  }


  updateLocalNotes(notes: Note[]) {
    this.updateNoteInLocalStorage(notes);
  }
}
